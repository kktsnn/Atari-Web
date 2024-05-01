import Utility from "../logic/utility.js";
import Vector2 from "../structs/vector2.js";
import GameObject from "./GameObject.js";

export default class Paddle extends GameObject {

    constructor() {
        super(
            new Vector2(425, 950),
            new Vector2(150, 20),
            '#f28482'
        );
        this.startingPosition = this.position.copy();
    }

    update(deltaTime) { }

    updatePosition(mouseX, boardX) {
        this.position.x = Utility.clamp(
            mouseX - this.size.x / 2,
            0,
            boardX - this.size.x
        );
    }

    render(renderer) {
        renderer.drawRectangle(this);
    }

    reset() {
        this.position = this.startingPosition.copy();
    }
}