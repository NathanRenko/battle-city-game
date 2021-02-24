import Figure from './gameClasses/figure';
import GameEntity from './gameObjects/gameEntity';
import InputHandlerRules from './gameObjects/inputHandlerRules';
import Point from './gameClasses/Point';
import InputHandler from './gameObjects/inputHandler';

class GameEngine {
    canvasContext: CanvasRenderingContext2D;
    gameEntity: GameEntity;
    inputEngine: InputHandlerRules;
    idkInputHandler: InputHandler
    constructor() {
        canvas = document.querySelector('.gameField') as HTMLCanvasElement;
        this.canvasContext = canvas.getContext('2d') || new CanvasRenderingContext2D();
        this.gameEntity = new GameEntity();
        this.inputEngine = new InputHandlerRules(this.gameEntity, canvas);
        this.idkInputHandler = new InputHandler();
    }
    draw() {
        let player = this.gameEntity.getPlayerPosition();
        this.canvasContext.clearRect(player.x, player.y, player.width, player.height);
        this.gameEntity.applyStep();
        player = this.gameEntity.getPlayerPosition();
        // console.log(pos.x, pos.y, size.width, size.height);
        this.canvasContext.fillStyle = 'rgb(200,0,0)';
        this.canvasContext.fillRect(
            this.gameEntity.player.x,
            this.gameEntity.player.y,
            this.gameEntity.player.width,
            this.gameEntity.player.height
        );

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
