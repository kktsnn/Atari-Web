export default class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    plus(v2) {
        this.x += v2.x;
        this.y += v2.y
        return this;
    }

    times(i) {
        this.x *= i;
        this.y *= i;
        return this;
    }

    copy() {
        return new Vector2(
            this.x,
            this.y
        );
    }

    equals(v2) {
        return this.x === v2.x && this.y === v2.y;
    }

    sqrDist(v2) {
        return Math.pow(this.x - v2.x, 2) + Math.pow(this.y - v2.y, 2);
    }
}