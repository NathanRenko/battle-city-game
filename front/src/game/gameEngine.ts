import GameObject from './gameClasses/gameObject';
import GameEntity from './gameRules/gameEntity';
import MovementHandler from './engineModules/MovementHandler';
import Point from './gameClasses/Point';
import InputHandler from './engineModules/inputHandler';
import Tank from './gameObjects/tank';

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
        this.canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        // render obsacle
        for (const obsacle of this.gameEntity.obsacle) {
            this.renderEntity(this.canvasContext, obsacle);
        }

        //make step
        const dt = this.getDt();
        this.movementHandler.frameEngine(dt);
        this.drawRotated(this.canvasContext, this.gameEntity.player);
        for (const shell of this.gameEntity.shell) {
            this.drawRotated(this.canvasContext, shell);
        }
        for (const particle of this.gameEntity.particles) {
            this.renderEntity(this.canvasContext, particle);
        }
        // render player
    }
    getDt() {
        const now = Date.now();
        const dt = (now - this.lastTime) / 1000.0;
        this.lastTime = now;
        return dt;
    }

    start() {
        this.lastTime = Date.now();
        setInterval(() => this.draw(), 1000 / 60);
    }
    drawRotated(context: CanvasRenderingContext2D, entity: Tank) {
        if (!entity) {
            return;
        }
        context.save();
        context.translate(entity.x + entity.width / 2, entity.y + entity.height / 2);
        context.rotate((entity.direction * Math.PI) / 180);
        const img = new Image(entity.width, entity.height);
        img.src = entity.skin;
        context.drawImage(img, -entity.width / 2, -entity.height / 2, entity.width, entity.height);
        context.restore();
    }
    renderEntity(ctx: CanvasRenderingContext2D, entity: GameObject) {
        const img = new Image();
        img.src = entity.skin;
        ctx.drawImage(img, entity.x, entity.y, entity.width, entity.height);
    }
}

let canvas: HTMLCanvasElement;

export default GameEngine;
