import GameObject from '../gameClasses/gameObject';
import Field from './engineModules/Field';
import ModelHandler from './engineModules/ModelHandler';
import Tank from '../gameObjects/tank';
import Shell from '../gameObjects/shell';
import EntityClasses from './engineModules/constObjects/entityClasses';
import SkinCollection from './engineModules/skinCollection';
import {directionToAngle} from './engineModules/constObjects/DirectionHandler';

class GameEngine {
    canvasContext: CanvasRenderingContext2D;
    field!: Field;
    ModelHandler!: ModelHandler;
    lastFrameTime!: number;
    baseHp = document.getElementById('hp');
    enemyBaseHp = document.getElementById('enemyBaseHp');
    tankHp = document.getElementById('tankHp');
    skinCollection!: SkinCollection;
    constructor() {
        canvas = document.querySelector('.gameField') as HTMLCanvasElement;
        this.canvasContext = canvas.getContext('2d') || new CanvasRenderingContext2D();
        this.init();
    }

    init() {
        this.field = new Field(canvas.width, canvas.height);
        this.ModelHandler = new ModelHandler(this.field);
        this.lastFrameTime = 0;
        this.skinCollection = new SkinCollection();
        this.skinCollection.load();
    }

    start() {
        this.lastFrameTime = Date.now();
        let timer = setInterval(() => {
            if (this.checkIsGameOver()) {
                this.finishGame(timer);
            } else {
                this.updateModel();
                this.draw();
                this.updateGameInfo();
            }
        }, 1000 / 60);
        // requestAnimationFrame(this.gameEngine.bind(this));
    }

    checkIsGameOver() {
        return this.field.base[0].hp === 0 || this.field.base[1].hp === 0;
    }

    finishGame(timer: NodeJS.Timer) {
        clearInterval(timer);
        if (this.field.base[0].hp === 0) {
            alert('Поражение!');
        } else {
            alert('Победа!');
        }
        let needRestart = window.confirm('Restart?');
        if (needRestart) {
            this.init();
            this.start();
        }
    }

    updateGameInfo() {
        if (this.baseHp && this.field.base[0] && this.baseHp.textContent !== this.field.base[0].hp.toString()) {
            this.baseHp.textContent = this.field.base[0].hp.toString();
        }
        if (
            this.enemyBaseHp &&
            this.field.base[1] &&
            this.enemyBaseHp.textContent !== this.field.base[1].hp.toString()
        ) {
            this.enemyBaseHp.textContent = this.field.base[1].hp.toString();
        }
        if (this.tankHp && this.field.tanks[0] && this.tankHp.textContent !== this.field.tanks[0].hp.toString()) {
            this.tankHp.textContent = this.field.tanks[0].hp.toString();
        }
    }
    // gameEngine() {
    //     this.updateModel();
    //     this.draw();
    //     if (
    //         this.infoTable &&
    //         this.field.base &&
    //         this.field.base[0] &&
    //         this.infoTable.textContent !== this.field.base[0].hp.toString()
    //     ) {
    //         this.infoTable.textContent = this.field.base[0].hp.toString();
    //     }
    //     console.log(1);
    //     requestAnimationFrame(this.gameEngine.bind(this));
    // }

    updateModel() {
        const dt = this.getDt();
        this.ModelHandler.frameEngine(dt);
    }

    getDt() {
        const now = Date.now();
        const dt = (now - this.lastFrameTime) / 1000.0;
        this.lastFrameTime = now;
        return dt;
    }

    draw() {
        this.canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        for (const entityType in EntityClasses) {
            const entityCollection = this.field.getParentCollection(entityType);
            const isDirectionable = entityCollection.length !== 0 && 'direction' in entityCollection[0];
            if (isDirectionable) {
                for (const entity of entityCollection) {
                    // @ts-ignore
                    this.drawRotatedEntity(this.canvasContext, entity);
                }
            } else {
                for (const entity of entityCollection) {
                    this.drawEntity(this.canvasContext, entity);
                }
            }
        }
    }

    drawRotatedEntity(context: CanvasRenderingContext2D, entity: Tank | Shell) {
        if (!entity) {
            return;
        }
        context.save();
        context.translate(entity.x + entity.width / 2, entity.y + entity.height / 2);
        context.rotate((directionToAngle[entity.direction] * Math.PI) / 180);
        context.drawImage(
            this.skinCollection.get(entity.skin),
            -entity.width / 2,
            -entity.height / 2,
            entity.width,
            entity.height
        );
        context.restore();
    }

    drawEntity(ctx: CanvasRenderingContext2D, entity: GameObject) {
        ctx.drawImage(this.skinCollection.get(entity.skin), entity.x, entity.y, entity.width, entity.height);
    }
}

let canvas: HTMLCanvasElement;

export default GameEngine;
