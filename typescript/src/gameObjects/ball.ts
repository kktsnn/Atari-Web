import Vector2 from "../structs/vector2.js";
import Utility from "../logic/utility.js";
import Paddle from "./paddle.js";
import Brick from "./brick.js";
import Renderer from "../logic/renderer.js";

export enum BallEvent {
    DEAD, BREAK
}

export type BallEventCallback = (e: BallEvent) => void;

export class Ball {

    startingPosition = new Vector2(495, 930);
    radius = 8;
    color: string = '#f6bd60';

    position: Vector2;
    moving: boolean = false;
    speed: number = 0;
    direction: Vector2 = Vector2.zero;

    listeners: BallEventCallback[] = [];

    constructor() {
        this.position = this.startingPosition.copy();
        this.reset();
    }

    reset() {
        this.position = this.startingPosition.copy();
        this.moving = false;

        let rad = (Math.random() - .5) / 2 * Math.PI;
        this.direction = new Vector2(Math.sin(rad), -Math.cos(rad));
    }

    update(deltaTime: number, paddle : Paddle, bricks: Brick[], boardSize: Vector2) {
        this.checkBorderCollision(boardSize);

        this.checkPaddleCollision(paddle);

        bricks.forEach(b => {
            this.checkBrickCollision(b);
        });

        if (this.moving) {
            this.position.plus(
                this.direction.copy()
                .times(this.speed)
                .times(deltaTime)
            );
        }
    }

    render(renderer: Renderer) {
        renderer.drawBall(this.position, this.radius, this.color);
    }

    checkBorderCollision(boardSize: Vector2) {
        // bottom
        if (this.position.y >= boardSize.x) {
            this.evoke(BallEvent.DEAD);
            return;
        }

        let maxPos = boardSize.x - this.radius * 2;

        // top
        if (this.position.y <= 0) {
            this.direction.y *= -1;
            this.position = new Vector2(
                this.position.x, 
                Utility.clamp(this.position.y, 1, maxPos - 1)
            );
        }

        // sides
        if (!Utility.inRange(this.position.x, 0, maxPos)) {
            this.direction.x *= -1;
            this.position = new Vector2(
                Utility.clamp(this.position.x, 1, maxPos - 1),
                this.position.y
            );
        }
    }

    checkPaddleCollision(paddle: Paddle) {
        let closestPoint = Utility.findClosestPoint(this.position, this.radius, paddle.position, paddle.size)
        if (Utility.checkCollision(this.position, this.radius, closestPoint)) {
            if (Utility.inRange(
                this.position.x + this.radius,
                paddle.position.x - this.radius,
                paddle.position.x + paddle.size.x + this.radius
            ) ) 
            {
                let dist = (this.position.x + this.radius - paddle.position.x + this.radius) / 
                    (paddle.size.x + 2 * this.radius) - .5;

                let mult = Utility.linearToParabolic(dist) * .8;

                this.direction = new Vector2(
                    Math.sin(mult * Math.PI), 
                    -Math.cos(mult * Math.PI)
                );
            } else {
                this.direction.x *= -1;
            }
        }
    }

    checkBrickCollision(brick: Brick) {
        if (!brick.visible) return;

        let closestPoint = Utility.findClosestPoint(this.position, this.radius, brick.position, brick.size)
        if (Utility.checkCollision(this.position, this.radius, closestPoint)) {
            if (Utility.inRange(
                this.position.x + this.radius,
                brick.position.x,
                brick.position.x + brick.size.x
            ) || Math.abs(this.position.x - closestPoint.x) < Math.abs(this.position.y - closestPoint.y)) {
                this.direction.y *= -1;
            }
            else {
                this.direction.x *= -1;
            }

            if (brick.handleHit()) {
                this.evoke(BallEvent.BREAK);
            }
        }
    }

    listen(callback: BallEventCallback) {
        this.listeners.push(callback);
    }

    evoke(e: BallEvent) {
        this.listeners.forEach(l => {
            l(e);
        });
    }

} 