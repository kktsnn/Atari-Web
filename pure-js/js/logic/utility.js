import Vector2 from "../structs/vector2.js";

export default class Utility {
    static clamp(num, min, max) {
        return Math.min(Math.max(num, min), max);
    }

    static inRange(num, min, max) {
        return num >= min && num <= max;
    }

    static checkCollision(ball, brick) {
        let closestPoint = new Vector2(
            this.clamp(ball.center.x, brick.position.x, brick.position.x + brick.size.x),
            this.clamp(ball.center.y, brick.position.y, brick.position.y + brick.size.y)
        );

        return Math.pow(ball.radius, 2) > closestPoint.sqrDist(ball.center);
    }

    static sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    //@range(val, min: -.5, max: .5)
    static linearToParabolic(val) {
        return (val < 0 ? -1 : 1) * val * val * 2;
    }
}