import GameObject from '../gameClasses/gameObject';
import Field from './engineModules/Field';
import ModelHandler from './engineModules/ModelHandler';
import Tank from '../gameObjects/tank';

class GameEngine {
    canvasContext: CanvasRenderingContext2D;
    field: Field;
    movementHandler: ModelHandler;
    lastFrameTime: number;
    constructor() {
        canvas = document.querySelector('.gameField') as HTMLCanvasElement;
        this.canvasContext = canvas.getContext('2d') || new CanvasRenderingContext2D();
        this.field = new Field();
        this.movementHandler = new ModelHandler(this.field);
        this.lastFrameTime = 0;
    }
    draw() {
        this.canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        // render obsacle
        for (const obsacle of this.field.obsacle) {
            this.renderEntity(this.canvasContext, obsacle);
        }

        //make step
        const dt = this.getDt();
        this.movementHandler.frameEngine(dt);
        this.drawRotated(this.canvasContext, this.field.player);
        for (const shell of this.field.shell) {
            this.drawRotated(this.canvasContext, shell);
        }
        for (const particle of this.field.particles) {
            this.renderEntity(this.canvasContext, particle);
        }
        // render player
    }
    getDt() {
        const now = Date.now();
        const dt = (now - this.lastFrameTime) / 1000.0;
        this.lastFrameTime = now;
        return dt;
    }

    start() {
        this.lastFrameTime = Date.now();
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
