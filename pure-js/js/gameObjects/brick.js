import GameObject from "./GameObject.js";

export default class Brick extends GameObject {

    colors = [
        '#dad7cd',
        '#a3b18a',
        '#588157',
        '#3a5a40',
        '#344e41'
    ];
    defaultColor = '#264653';   // unbreakable, or high health value;

    visible = true;
    _health = 0;

    get health() {
        return this._health;
    }

    set health(value) {
        this._health = value;
        // Only 0 is invisible, any negative health is unbreakable
        if (value === 0) {
            this.visible = false;
        }
        this.color = this.colors[value - 1] ?? this.defaultColor;
    }

    constructor(position, size, health) {
        super(
            position,
            size,
            'black'
        );

        this.health = health;
    }

    update(deltaTime) { }

    render(renderer) {
        if (this.visible) {
            renderer.drawRectangle(this);
        }
    }
}