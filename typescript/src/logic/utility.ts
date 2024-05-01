import Vector2 from "../structs/vector2.js";

export default class Utility {
    static clamp(num: number, min: number, max: number): number {
        return Math.min(Math.max(num, min), max);
    }

    static inRange(num: number, min: number, max: number) {
        return num >= min && num <= max;
    }

    static checkCollision(ballPosition: Vector2, ballRadius: number, closestPoint: Vector2) {
        return Math.pow(ballRadius, 2) > closestPoint.sqrDist(
            new Vector2(
                ballPosition.x + ballRadius,
                ballPosition.y + ballRadius
            )
        );
    }

    static findClosestPoint(ballPosition: Vector2, ballRadius: number, rectPosition: Vector2, rectSize: Vector2) {
        return new Vector2(
            this.clamp(ballPosition.x + ballRadius, rectPosition.x, rectPosition.x + rectSize.x),
            this.clamp(ballPosition.y + ballRadius, rectPosition.y, rectPosition.y + rectSize.y)
        );
    }

    static sleep(ms: number) {
        return new Promise(r => setTimeout(r, ms));
    }

    //@range(val, min: -.5, max: .5)
    static linearToParabolic(val: number) {
        return (val < 0 ? -1 : 1) * val * val * 2;
    }
}