import GameObject from '../gameClasses/gameObject';
import Field from './engineModules/Field';
import ModelHandler from './engineModules/ModelHandler';
import Tank from '../gameObjects/tank';
import Shell from '../gameObjects/shell';
import EntityClasses from './engineModules/constObjects/entityClasses';
import SkinCollection from './engineModules/skinCollection';
import { directionToAngle, entityDirections } from './engineModules/constObjects/DirectionHandler';
import Figure from '../gameClasses/figure';
import Point from '../gameClasses/Point';
import Base from '../gameObjects/base';
import Store from './store';
import backToMainMenu from './StageSwitcher';

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
        const background_img = new Image();
        background_img.src = './assets/ground.svg';

        canvas = document.querySelector('.gameField') as HTMLCanvasElement;

        canvas.style.backgroundColor = '#212F3C';
        this.canvasContext = canvas.getContext('2d') || new CanvasRenderingContext2D();

        // https://stackoverflow.com/questions/46430787/createpatternthis-image-repeat-returns-null-when-image-is-locally-saved
        let ptrn = this.canvasContext.createPattern(background_img, 'repeat');
        // @ts-ignore
        console.log(ptrn);
        // @ts-ignore
        this.canvasContext.fillStyle = ptrn;
        this.canvasContext.fillRect(0, 0, canvas.width, canvas.height);

        this.init();
    }

    start() {
        this.lastFrameTime = Date.now();
        // setInterval(()=>this.gameEngine(), 1000/20)
        requestAnimationFrame(() => this.gameEngine());
    }
    gameEngine() {
        if (this.checkIsGameOver()) {
            this.finishGame();
        } else {
            this.updateModel();
            this.draw();
            this.updateGameInfo();
            requestAnimationFrame(() => this.gameEngine());
        }
    }
    checkIsGameOver() {
        // TODO improve rules
        return (
            this.field.base[0].hp === 0 ||
            this.field.base[1].hp === 0 ||
            (this.field.tanks[0].respawnCount === 0 && this.field.tanks[0].hp === 0) ||
            (this.field.tanks[1].respawnCount === 0 && this.field.tanks[1].hp === 0)
        );
    }

    init() {
        this.field = new Field(canvas.width, canvas.height, Store.choosenMap);
        this.ModelHandler = new ModelHandler(this.field);
        this.lastFrameTime = 0;
        this.skinCollection = new SkinCollection();
        this.skinCollection.load();
    }
    finishGame() {
        Store.socket.off('opponent disconnected');
        Store.socket.disconnect();
        if (this.ModelHandler.playerBase.hp === 0 || this.ModelHandler.entityHandler.currentPlayer.hp === 0) {
            backToMainMenu('You were defeated.');
        } else {
            backToMainMenu('Victory!');
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
                    if ('maxHp' in entity) {
                        // @ts-ignore
                        this.drawHpBar(this.canvasContext, {
                            x: entity.x,
                            y: entity.y,
                            size: entity.size,
                            // @ts-ignore
                            direction: entity.direction,
                            hp: entity.hp,
                            maxHp: entity.maxHp,
                        });
                    }
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
        context.translate(entity.x + entity.size / 2, entity.y + entity.size / 2);
        context.rotate((directionToAngle[entity.direction] * Math.PI) / 180);
        context.drawImage(
            this.skinCollection.get(entity.skin),
            -entity.size / 2,
            -entity.size / 2,
            entity.size,
            entity.size
        );

        context.restore();
        // if ('maxHp' in entity) {
        //     this.drawHpBar(context, entity);
        // }
    }

    drawHpBar(context: CanvasRenderingContext2D, entity: Tank | Base) {
        if (!entity) {
            return;
        }
        const hpPercent = entity.hp / entity.maxHp;
        if (hpPercent > 0.5) {
            context.fillStyle = 'green';
        } else {
            context.fillStyle = 'red';
        }
        const hpBarH = 4;
        const margin = 8;
        if ('direction' in entity) {
            let x: number;
            let y: number;
            let width;
            let height;
            switch (entity.direction) {
                case entityDirections.Up:
                    x = entity.x;
                    y = entity.y + entity.size + margin;
                    width = hpPercent * entity.size;
                    height = hpBarH;
                    break;
                case entityDirections.Right:
                    x = entity.x - margin;
                    y = entity.y;
                    width = hpBarH;
                    height = hpPercent * entity.size;
                    break;
                case entityDirections.Down:
                    x = entity.x;
                    y = entity.y - margin;
                    width = hpPercent * entity.size;
                    height = hpBarH;
                    break;
                case entityDirections.Left:
                    x = entity.x + entity.size + margin;
                    y = entity.y;
                    width = hpBarH;
                    height = hpPercent * entity.size;
                    break;
                default:
                    throw new Error();
            }

            // context.translate(entity.x + entity.size / 2, entity.y + entity.size / 2);
            // context.rotate((directionToAngle[entity.direction] * Math.PI) / 180);
            context.fillRect(x, y, width, height);
        } else {
            context.fillRect(entity.x, entity.y + entity.size + margin, hpPercent * entity.size, hpBarH);
        }
        // @ts-ignore
        // context.fillText(entity.hp, spawnPoint.x, spawnPoint.y, width, height);

        // if ('maxHp' in entity) {
        //     this.drawHpBar(context, entity);
        // }
    }

    drawEntity(ctx: CanvasRenderingContext2D, entity: GameObject) {
        ctx.drawImage(this.skinCollection.get(entity.skin), entity.x, entity.y, entity.size, entity.size);
        if ('maxHp' in entity) {
            this.drawHpBar(ctx, entity);
        }
    }
}

let canvas: HTMLCanvasElement;

export default GameEngine;
