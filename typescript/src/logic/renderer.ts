import Vector2 from "../structs/vector2.js";

export default class Renderer {

    boardSize: Vector2;
    appContainer: Element;
    scale: Vector2 = Vector2.zero;

    constructor(boardSize: Vector2) {
        this.boardSize = boardSize;
        this.appContainer = document.querySelector("#app")!;
    }

    fixScale() {
        this.scale = new Vector2(
            document.documentElement.clientWidth / this.boardSize.x,
            document.documentElement.clientHeight / this.boardSize.y
        );
    }

    clear() {
        this.appContainer.innerHTML = '';
    }

    drawBall(position: Vector2, radius: number, color: string) {
        let div = document.createElement('div');

        div.style.zIndex = '10';
        div.style.position = 'fixed';

        div.style.top = position.y * this.scale.y  + 'px';
        div.style.left = position.x * this.scale.x  + 'px';

        div.style.borderRadius = '50%';

        div.style.width = radius * 2 * this.scale.x + 'px';
        div.style.height = radius * 2 * this.scale.x + 'px';

        div.style.backgroundColor = color;

        this.appContainer.append(div);
    }

    drawRectangle(position: Vector2, size: Vector2, color: string) {
        let div = document.createElement('div');

        div.style.zIndex = '10';
        div.style.position = 'fixed';

        div.style.top = position.y * this.scale.y  + 'px';
        div.style.left = position.x * this.scale.x  + 'px';

        div.style.width = size.x * this.scale.x + 'px';
        div.style.height = size.y + this.scale.y + 'px';

        div.style.backgroundColor = color;

        this.appContainer.append(div);
    }

    updateScore(score: number) {
        document.querySelector<HTMLElement>('#score')!.innerHTML = score.toString();
    }

    updateLives(lives: number) {
        document.querySelector<HTMLElement>('#lives')!.innerHTML = lives.toString();
    }

    updateLevel(level: number) {
        document.querySelector<HTMLElement>('#level')!.innerHTML = level.toString();
    }

    hideTitle() {
        document.querySelector<HTMLElement>("#title")!.hidden = true;
    }

    togglePause(bool: boolean) {
        document.querySelector<HTMLElement>('#pause')!.hidden = !bool;
    }

    toggleGameOver(bool: boolean, scores: number[] | undefined) {
        document.querySelector<HTMLElement>('#gameOver')!.hidden = bool;
        if (bool) return;
        document.querySelector<HTMLElement>('#scoreBoard')!.innerHTML = scores!.join("<br>");
    }

    toggleLevelCleared(bool: boolean) {
        document.querySelector<HTMLElement>('#cleared')!.hidden = bool;
    }
}