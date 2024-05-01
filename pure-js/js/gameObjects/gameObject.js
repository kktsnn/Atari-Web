export default class GameObject {
    constructor(position, size, color) {
        this.position = position;
        this.size = size;
        this.color = color;
    }

    update(deltaTime) {
        throw Error('Not implemented');
    }

    render(renderer) {
        throw Error('Not Implemented');
    }
}