import Renderer from "../logic/renderer.ts";
import Vector2 from "../structs/vector2.ts";

export default class Brick {

    position: Vector2;
    size: Vector2;

    colors = [
        '#dad7cd',
        '#a3b18a',
        '#588157',
        '#3a5a40',
        '#344e41'
    ];
    defaultColor = '#264653';   // unbreakable, or high health value;

    visible = true;
    health = 0;

    constructor(position: Vector2, size: Vector2, health: number) {
        this.position = position,
        this.size = size,
        this.health = health;
    }

    render(renderer: Renderer): void {
        if (this.visible) {
            renderer.drawRectangle(this.position, this.size, this.colors[this.health - 1]);
        }
    }

    handleHit(): boolean {
        this.health--;
        if (this.health === 0) this.visible = false;
        return this.health >= 0;
    }
}