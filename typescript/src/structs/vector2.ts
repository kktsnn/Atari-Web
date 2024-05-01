export default class Vector2 {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    plus(v2: Vector2): this {
        this.x += v2.x;
        this.y += v2.y
        return this;
    }

    times(i: number): this {
        this.x *= i;
        this.y *= i;
        return this;
    }

    copy(): Vector2 {
        return new Vector2(
            this.x,
            this.y
        );
    }

    equals(v2: Vector2): boolean {
        return this.x === v2.x && this.y === v2.y;
    }

    sqrDist(v2: Vector2): number {
        return Math.pow(this.x - v2.x, 2) + Math.pow(this.y - v2.y, 2);
    }

    static get zero(): Vector2 {
        return new Vector2(0, 0);
    }
}