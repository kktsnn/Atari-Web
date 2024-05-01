import Ball from "../gameObjects/ball.js";
import Brick from "../gameObjects/brick.js";
import Paddle from "../gameObjects/paddle.js";
import Vector2 from "../structs/vector2.js";
import Renderer from "./renderer.js";
import Utility from "./utility.js";

export default class Controller {

    boardSize = new Vector2(1000, 1000);
    ballStartSpeed = 500;
    startLevelLayout = [
        new Array(15).fill(1),
        ...new Array(5).fill(new Array(15).fill(0))
    ];

    paddle = new Paddle();
    ball = new Ball(8);     // radius as parameter
    bricks = [];

    paused = false;
    bestScores = [];
    levelLayout = [];   // Array of arrays of brick health.
    
    _level = 1;
    get level() {
        return this._level;
    }
    
    set level(value) {
        this._level = value;
        this.renderer.updateLevel(value);
    }
    
    _score = 0;
    get score() {
        return this._score;
    }
    
    set score(value) {
        this._score = value;
        this.renderer.updateScore(value);
    }
    
    startingLives = 3;
    _lives = 3;
    get lives() {
        return this._lives;
    }

    set lives(value) {
        this._lives = value;
        this.renderer.updateLives(value);
    }

    constructor() {
        this.renderer = new Renderer(this.boardSize);

        this.ball.listen(this.handleBallEvent.bind(this));

        document.querySelector('#pauseButton')
            .addEventListener('click', (e) => { 
                this.paused = !this.paused;
                this.renderer.togglePause(this.paused);
                e.target.innerHTML = this.paused ? '▶' : '❚❚';
        })
        document.addEventListener('mousemove', e => this.handleMouseMovement(e));
        document.addEventListener('mouseup', (_) => this.handleMouseClick());

    }

    update(deltaTime) {
        this.paddle.update(deltaTime);
        this.ball.update(deltaTime, this.paddle, this.bricks, this.boardSize);
        this.bricks.forEach(b => b.update(deltaTime));
    }

    render() {
        this.renderer.appContainer.innerHTML = '';

        this.paddle.render(this.renderer);
        this.ball.render(this.renderer);
        this.bricks.forEach(b => b.render(this.renderer));
    }

    gameLoop(timestamp) {
        this.renderer.fixScale();
    
        if (!this.paused) {
            let deltaTime = (timestamp - this.lastTimestamp) / 1000;
    
            this.update(deltaTime);
        }

        this.render();
        
        this.lastTimestamp = timestamp;
    
        requestAnimationFrame((ts) => this.gameLoop(ts));
    }

    handleMouseMovement(e) {
        if (this.paused) return;
        
        let mouseX = Utility.clamp(
            e.x / this.renderer.scale.x,
            this.paddle.size.x / 2,
            this.boardSize.x - this.paddle.size.x / 2
        );
        this.paddle.position.x = mouseX - this.paddle.size.x / 2;

        if (!this.ball.moving) {
            this.ball.position.x = mouseX - this.ball.radius;
        }
    }

    handleMouseClick() {
        this.renderer.hideTitle();
        if (this._lives === -1) {
            this.renderer.toggleGameOver(true);
            this.initializeGameBoard();
            return;
        }
        if (!this.ball.moving) {
            this.ball.moving = true;
        }
    }

    handleBallEvent(e) {
        switch (e) {
            case (Ball.event.BREAK):
                const brickScore = 10;
                const ballSpeedStep = 10;

                this.score += brickScore;
                this.ball.speed += ballSpeedStep;

                if (this.bricks.every(b => b.health <= 0)) {
                    this.roundFinish();
                }

                break;
            case (Ball.event.DEAD):
                this.resetGameBoard();
                this.ball.speed = this.ballStartSpeed;

                if (this.lives <= 0) {
                    this._lives = -1;
                    this.gameOver();
                } else {
                    this.lives -= 1;
                }
        }
    }

    initializeGameBoard() {
        this.renderer.fixScale();

        this.score = 0;
        this.lives = this.startingLives;
        this.level = 1;
        this.levelLayout = this.startLevelLayout.map(r => r.slice());

        this.resetGameBoard();
        this.ResetBricks();

        this.ball.speed = this.ballStartSpeed;

        this.lastTimestamp = performance.now();
    }

    resetGameBoard() {
        this.ball.reset();
        this.paddle.reset();
    }
    
    ResetBricks() {
        this.bricks = [];

        const brickHeight = 40;
        const padding = 8;
        const anchorY = 200;

        let x = 0;
        let y = 0;

        for (const row of this.levelLayout) {
            let stepX = (this.boardSize.x - padding) / row.length;
            for (const health of row) {
                if (health === 0) continue;

                let stepY = brickHeight + padding * this.renderer.scale.x;

                this.bricks.push(
                    new Brick(
                        new Vector2(padding + x * stepX, anchorY + y * stepY),
                        new Vector2(stepX - padding, brickHeight),
                        health
                    )
                );
                x++;
            }
            x = 0;
            y++;
        }
    }

    // currently endless
    nextLevel() {
        this.level++;
        let rem = (this.level - 1) % 3;
        let sum = (rem * (rem + 1)) / 2;

        for (let i = sum; i <= rem + sum; i++) {
            this.levelLayout[i] = this.levelLayout[i].map(h => h + 1);
        }
    }

    async roundFinish() {
        console.log('Round clear')
        this.renderer.toggleLevelCleared(false);
        await Utility.sleep(1500);

        this.lives += 1;
        this.score += 100;

        this.resetGameBoard();
        this.nextLevel();
        this.ResetBricks();

        this.renderer.toggleLevelCleared(true);
    }

    gameOver() {
        console.log('Game over');
        this.resetGameBoard();
        this.bestScores.push(this.score);
        this.renderer.toggleGameOver(
            false, 
            this.bestScores
                .sort((a, b) => b - a)
                .slice(0, Math.min(this.bestScores.length, 3))
        );
    }
}