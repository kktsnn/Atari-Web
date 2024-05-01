import Vector2 from "../structs/vector2.js";

export default class Renderer {

    boardSize = null;
    appContainer = null;
    scale = null;

    constructor(boardSize) {
        this.boardSize = boardSize;
        this.appContainer = document.querySelector("#app");
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

    drawBall(gameObj) {
        let div = document.createElement('div');

        div.style.zIndex = 10;
        div.style.position = 'fixed';

        div.style.top = gameObj.position.y * this.scale.y  + 'px';
        div.style.left = gameObj.position.x * this.scale.x  + 'px';

        div.style.borderRadius = '50%';

        div.style.width = gameObj.radius * 2 * this.scale.x + 'px';
        div.style.height = gameObj.radius * 2 * this.scale.x + 'px';

        div.style.backgroundColor = gameObj.color;

        this.appContainer.append(div);
    }

    drawRectangle(gameObj) {
        let div = document.createElement('div');

        div.style.zIndex = 10;
        div.style.position = 'fixed';

        div.style.top = gameObj.position.y * this.scale.y  + 'px';
        div.style.left = gameObj.position.x * this.scale.x  + 'px';

        div.style.width = gameObj.size.x * this.scale.x + 'px';
        div.style.height = gameObj.size.y + this.scale.y + 'px';

        div.style.backgroundColor = gameObj.color;

        this.appContainer.append(div);
    }

    updateScore(score) {
        document.querySelector('#score').innerHTML = score;
    }

    updateLives(lives) {
        document.querySelector('#lives').innerHTML = lives;
    }

    updateLevel(level) {
        document.querySelector('#level').innerHTML = level;
    }

    hideTitle() {
        document.querySelector("#title").hidden = true;
    }

    togglePause(bool) {
        document.querySelector('#pause').hidden = !bool;
    }

    toggleGameOver(bool, scores) {
        document.querySelector('#gameOver').hidden = bool;
        if (bool) return;
        document.querySelector('#scoreBoard').innerHTML = scores.join("<br>");
    }

    toggleLevelCleared(bool) {
        document.querySelector('#cleared').hidden = bool;
    }
}