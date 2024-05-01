import Renderer from "../logic/renderer.ts";
import Utility from "../logic/utility.js";
import Vector2 from "../structs/vector2.js";

export default class Paddle {

    startingPosition: Vector2 = new Vector2(425, 950);
    size: Vector2 = new Vector2(150, 20);
    color: string = '#f28482';
    
    position: Vector2;

    constructor() {
        this.position = this.startingPosition.copy();
    }

    updatePosition(mouseX: number, boardX: number) {
        this.position.x = Utility.clamp(
            mouseX - this.size.x / 2,
            0,
            boardX - this.size.x
        );
    }

    render(renderer: Renderer): void {
        renderer.drawRectangle(this.position, this.size, this.color);
    }

    reset() {
        this.position = this.startingPosition.copy();
    }
}