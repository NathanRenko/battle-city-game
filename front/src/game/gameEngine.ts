import GameObject from './gameClasses/gameObject';
import GameEntity from './gameRules/gameEntity';
import MovementHandler from './engineModules/MovementHandler';
import Point from './gameClasses/Point';
import InputHandler from './engineModules/inputHandler';

class GameEngine {
    canvasContext: CanvasRenderingContext2D;
    gameEntity: GameEntity;
    movementHandler: MovementHandler;
    lastTime: number;
    constructor() {
        canvas = document.querySelector('.gameField') as HTMLCanvasElement;
        this.canvasContext = canvas.getContext('2d') || new CanvasRenderingContext2D();
        this.gameEntity = new GameEntity();
        this.movementHandler = new MovementHandler(this.gameEntity, canvas);
        this.lastTime = 0;
    }
    draw() {
        //unrender player
        let playerPosition = this.gameEntity.player.getPlayerPosition();
        this.canvasContext.clearRect(playerPosition.x, playerPosition.y, playerPosition.width, playerPosition.height);

        //make step
        let dt = this.getDt();
        this.movementHandler.keyPressEngine(dt);

        // render player
        playerPosition = this.gameEntity.player.getPlayerPosition();
        let img = new Image(); // Создает новый элемент изображения
        // img.src = this.gameEntity.player.skin;
        img.src = './assets/tankSM.png';
       
        // this.canvasContext.fillStyle = 'rgb(200,0,0)';
        // this.canvasContext.fillRect(playerPosition.x, playerPosition.y, playerPosition.width, playerPosition.height);

        this.drawRotated(
            this.canvasContext,
            img,
            playerPosition.x,
            playerPosition.y,
            // @ts-ignore
            this.gameEntity.player.direction,
            0
        );
        // this.canvasContext.drawImage(
        //     img,
        //     playerPosition.x,
        //     playerPosition.y,
        //     playerPosition.width,
        //     playerPosition.height
        // );
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
    drawRotated(context: any, image: any, x: any, y: any, degrees: any, flip: any) {
        if (!context || !image) return;
        context.save();
        context.translate(x + image.width / 2, y + image.height / 2);
        context.rotate((degrees * Math.PI) / 180);
        // context.scale(flip,1);
        context.drawImage(image, -image.width / 2, -image.height / 2);
        context.restore();
    }
}

let canvas: HTMLCanvasElement;

export default GameEngine;
