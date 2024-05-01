import Vector2 from "../structs/vector2.js";
import Utility from "../logic/utility.js";
import GameObject from "./GameObject.js";

export default class Ball extends GameObject{

    startingPosition = new Vector2(495, 940);
    radius = 8;

    moving = false;
    speed = 0;
    direction = new Vector2(0, 0);

    static event = {
        DEAD: 'DEAD',
        BREAK: 'BREAK'
    };

    listeners = [];

    get center() {
        return new Vector2(
            this.position.x + this.radius,
            this.position.y + this.radius
        );
    }

    constructor(radius) {
        super(
            new Vector2(495, 930),
            new Vector2(radius * 2, radius * 2),
            '#f6bd60'
        );
        this.startingPosition = this.position.copy();
        this.radius = radius;
    }

    reset() {
        this.position = this.startingPosition.copy();
        this.moving = false;

        let rad = (Math.random() - .5) / 2 * Math.PI;
        this.direction = new Vector2(Math.sin(rad), -Math.cos(rad));
    }

    update(deltaTime, paddle, bricks, boardSize) {
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

    render(renderer) {
        renderer.drawBall(this);
    }

    checkBorderCollision(boardSize) {
        // bottom
        if (this.position.y >= boardSize.x) {
            this.evoke(Ball.event.DEAD);
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

    checkPaddleCollision(paddle) {
        if (Utility.checkCollision(this, paddle)) {
            if (Utility.inRange(
                this.center.x,
                paddle.position.x - this.radius,
                paddle.position.x + paddle.size.x + this.radius
            ) ) 
            {
                let dist = ((this.center.x - paddle.position.x + this.radius) / 
                    (paddle.size.x + 2 * this.radius) - .5);

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

    checkBrickCollision(brick) {
        if (!brick.visible) return;

        if (Utility.checkCollision(this, brick)) {
            if (Utility.inRange(
                this.center.x,
                brick.position.x,
                brick.position.x + brick.size.x
            )) {
                this.direction.y *= -1;
            }
            else if (Utility.inRange(
                this.center.y,
                brick.position.y,
                brick.position.y + brick.size.y
            ) ) 
            {
                this.direction.x *= -1;
            }
            // corner check (choose bounce on whichever coord is closer to closest point (corner))

            brick.health -= 1;
            
            if (brick.health >= 0) {
                this.evoke(Ball.event.BREAK);
            }
        }
    }

    listen(callback) {
        this.listeners.push(callback);
    }

    evoke(e) {
        this.listeners.forEach(l => {
            l(e);
        });
    }

}