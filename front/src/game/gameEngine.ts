import Figure from './gameClasses/figure';
import GameEntity from './gameObjects/gameEntity';
import MovementHandler from './gameObjects/MovementHandler';
import Point from './gameClasses/Point';
import InputHandler from './gameObjects/inputHandler';

class GameEngine {
    canvasContext: CanvasRenderingContext2D;
    gameEntity: GameEntity;
    movementHandler: MovementHandler;
    lastTime: any;
    constructor() {
        canvas = document.querySelector('.gameField') as HTMLCanvasElement;
        this.canvasContext = canvas.getContext('2d') || new CanvasRenderingContext2D();
        this.gameEntity = new GameEntity();
        this.movementHandler = new MovementHandler(this.gameEntity, canvas);
        this.lastTime = 0;
    }
    draw() {
        //unrender player
        let player = this.gameEntity.getPlayerPosition();
        this.canvasContext.clearRect(player.x, player.y, player.width, player.height);

        //make step
        let dt = this.getDt();
        this.movementHandler.keyPressEngine(dt);
        this.gameEntity.applyStep();

        // render player
        player = this.gameEntity.getPlayerPosition();
        this.canvasContext.fillStyle = 'rgb(200,0,0)';
        this.canvasContext.fillRect(
            this.gameEntity.player.x,
            this.gameEntity.player.y,
            this.gameEntity.player.width,
            this.gameEntity.player.height
        );
    }
    getDt() {
        let now = Date.now();
        let dt = (now - this.lastTime) / 1000.0;
        this.lastTime = now;
        return dt;
    }

    start() {
        let obsacle = this.gameEntity.obsacle;
        this.canvasContext.fillStyle = 'rgb(100,0,100)';
        this.canvasContext.fillRect(obsacle.x, obsacle.y, obsacle.width, obsacle.height);
        this.lastTime = Date.now();
        setInterval(() => this.draw(), 1000 / 60);
    }
}

let canvas: HTMLCanvasElement;

export default GameEngine;
