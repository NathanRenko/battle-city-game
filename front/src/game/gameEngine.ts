import Figure from './gameClasses/figure';
import GameEntity from './gameObjects/gameEntity';
import MovementHandler from './gameObjects/MovementHandler';
import Point from './gameClasses/Point';
import InputHandler from './gameObjects/inputHandler';

var lastTime: any;
class GameEngine {
    canvasContext: CanvasRenderingContext2D;
    gameEntity: GameEntity;
    movementHandler: MovementHandler;
    info: { dt: number };

    constructor() {
        canvas = document.querySelector('.gameField') as HTMLCanvasElement;
        this.canvasContext = canvas.getContext('2d') || new CanvasRenderingContext2D();
        this.gameEntity = new GameEntity();
        this.info = { dt: 10 };
        this.movementHandler = new MovementHandler(this.gameEntity, canvas, this.info);
    }
    draw() {
        let player = this.gameEntity.getPlayerPosition();
        // this.canvasContext.clearRect(player.x, player.y, player.width, player.height);
        this.gameEntity.applyStep();
        player = this.gameEntity.getPlayerPosition();
        this.canvasContext.fillStyle = 'rgb(0,100,0)';
        this.canvasContext.fillRect(0, 0, canvas.width, canvas.height);
        // console.log(pos.x, pos.y, size.width, size.height);
        this.canvasContext.fillStyle = 'rgb(200,0,0)';
        this.canvasContext.fillRect(
            this.gameEntity.player.x,
            this.gameEntity.player.y,
            this.gameEntity.player.width,
            this.gameEntity.player.height
        );
        this.canvasContext.fillStyle = 'rgb(100,0,100)';
        
        this.canvasContext.fillRect(this.gameEntity.obsacle.x, this.gameEntity.obsacle.y, this.gameEntity.obsacle.width, this.gameEntity.obsacle.height);
        let now = Date.now();
        let dt = (now - lastTime) / 1000.0;
        this.info = { dt: dt };
        lastTime = now;
        this.movementHandler.keyPressEngine(dt);
        // ctx.restore();
        // requestAnimationFrame(draw)
    }
    start() {
        let obsacle = this.gameEntity.obsacle;
        this.canvasContext.fillStyle = 'rgb(100,0,100)';
        this.canvasContext.fillRect(obsacle.x, obsacle.y, obsacle.width, obsacle.height);
        // document.addEventListener('keydown', this.inputEngine.keyPressEngine.bind(this.inputEngine));
        setInterval(() => this.draw(), 1000 / 60);
    }
}

let canvas: HTMLCanvasElement;

export default GameEngine;
