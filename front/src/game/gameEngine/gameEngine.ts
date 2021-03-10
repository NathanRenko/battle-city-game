import GameObject from '../gameClasses/gameObject';
import Field from './engineModules/Field';
import ModelHandler from './engineModules/ModelHandler';
import Tank from '../gameObjects/tank';
import Shell from '../gameObjects/shell';

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

    start() {
        this.lastFrameTime = Date.now();
        setInterval(() => {
            this.updateModel();
            this.draw();
        }, 1000 / 60);
    }

    updateModel() {
        const dt = this.getDt();
        this.movementHandler.frameEngine(dt);
    }

    getDt() {
        const now = Date.now();
        const dt = (now - this.lastFrameTime) / 1000.0;
        this.lastFrameTime = now;
        return dt;
    }

    draw() {
        this.canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        this.renderObstacles();
        this.renderTanks();
        this.renderShells();
        this.renderParticles();
    }

    renderObstacles() {
        for (const obstacle of this.field.obstacle) {
            this.drawEntity(this.canvasContext, obstacle);
        }
    }

    renderTanks() {
        for (const tank of this.field.tanks) {
            this.drawRotatedEntity(this.canvasContext, tank);
        }
    }

    renderShells() {
        for (const shell of this.field.shell) {
            this.drawRotatedEntity(this.canvasContext, shell);
        }
    }

    renderParticles() {
        for (const particle of this.field.particles) {
            this.drawEntity(this.canvasContext, particle);
        }
    }

    drawRotatedEntity(context: CanvasRenderingContext2D, entity: Tank | Shell) {
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

    drawEntity(ctx: CanvasRenderingContext2D, entity: GameObject) {
        const img = new Image();
        img.src = entity.skin;
        ctx.drawImage(img, entity.x, entity.y, entity.width, entity.height);
    }
}

let canvas: HTMLCanvasElement;

export default GameEngine;
