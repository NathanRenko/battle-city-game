import GameObject from '../gameClasses/gameObject';
import Field from './engineModules/Field';
import ModelHandler from './engineModules/ModelHandler';
import Tank from '../gameObjects/tank';
import Shell from '../gameObjects/shell';
import { EntityClasses } from './engineModules/constObjects/entityClasses';
import SkinCollection from './engineModules/skinCollection';
import { directionToAngle, entityDirections } from './engineModules/constObjects/DirectionHandler';
import Figure from '../gameClasses/figure';
import Point from '../gameClasses/Point';
import Base from '../gameObjects/base';
import Store from './store';
import Bot from '../gameObjects/bot';

class GameEngine {
    canvasContext: CanvasRenderingContext2D;
    field!: Field;
    ModelHandler!: ModelHandler;
    lastFrameTime!: number;

    respawnCountPanel = document.getElementById('respawnCount');
    enemyCountPanel = document.getElementById('enemyCount');

    opponentRespawnCountPanel = document.getElementById('opponentRespawnCount');
    opponentNamePanel = document.getElementById('opponentName');

    skinCollection!: SkinCollection;
    gameFinishRules = { singlePlayer: {}, multiPlayer: {} };
    constructor() {
        canvas = document.querySelector('.gameField') as HTMLCanvasElement;
        // @ts-ignore
        this.canvasContext = canvas.getContext('2d');
        let backgroundImage: string;
        if (Store.choosenMap === 'first') {
            backgroundImage = './assets/images/RPG_Nature_Tileset_Autumn.png';
        } else {
            backgroundImage = './assets/images/street.png';
        }

        canvas.style.backgroundImage = `url(${backgroundImage})`;
        canvas.style.backgroundRepeat = 'repeat';
        if (!Store.isSinglePlayer) {
            if (this.opponentNamePanel) {
                this.opponentNamePanel.textContent = Store.opponentName;
            }
        }
        this.init();
        this.start();
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

    isTankAlive(owner: Tank | Bot) {
        //@ts-ignore
        return !(owner.respawnCount === 0 && owner.hp === 0);
    }

    checkIsGameOver() {
        if (Store.isSinglePlayer) {
            return (
                this.field.mapObjects.base[0].hp === 0 ||
                this.field.mapObjects.base[1].hp === 0 ||
                (this.ModelHandler.currentPlayer.respawnCount === 0 && this.ModelHandler.currentPlayer.hp === 0) ||
                this.ModelHandler.bots.length === 0
            );
        } else {
            return (
                this.field.mapObjects.base[0].hp === 0 ||
                this.field.mapObjects.base[1].hp === 0 ||
                (this.ModelHandler.currentPlayer.respawnCount === 0 && this.ModelHandler.currentPlayer.hp === 0) ||
                (this.ModelHandler.opponent.respawnCount === 0 && this.ModelHandler.opponent.hp === 0)
            );
        }
        // TODO improve rules
    }

    init() {
        this.field = new Field(canvas.width, canvas.height, Store.choosenMap);
        this.ModelHandler = new ModelHandler(this.field);
        this.lastFrameTime = 0;
        this.skinCollection = new SkinCollection();
        this.skinCollection.load();
    }

    finishGame() {
        if (!Store.isSinglePlayer) {
            Store.socket.off('opponent disconnected');
            Store.socket.off('move');
            Store.socket.off('shoot');
            Store.socket.disconnect();
        }

        if (this.ModelHandler.playerBase.hp === 0 || this.ModelHandler.currentPlayer.hp === 0) {
            Store.openModal('Поражение.');
        } else {
            Store.openModal('Победа!');
        }
    }

    updateGameInfo() {
        if (this.respawnCountPanel) {
            //@ts-ignore
            this.respawnCountPanel.textContent = this.ModelHandler.currentPlayer.respawnCount || '0';
        }
        if (Store.isSinglePlayer) {
            if (this.enemyCountPanel) {
                //@ts-ignore
                this.enemyCountPanel.textContent = this.ModelHandler.bots.length || '';
            }
        } else {
            if (this.opponentRespawnCountPanel) {
                //@ts-ignore
                this.opponentRespawnCountPanel.textContent = this.ModelHandler.opponent.respawnCount || '0';
            }
            if (this.opponentNamePanel) {
                //@ts-ignore
                this.opponentNamePanel.textContent = Store.opponentName || '';
            }
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
        for (const entityCollection of this.field.getAllMapObjects()) {
            const isDirectionable = entityCollection.length !== 0 && 'direction' in entityCollection[0];

            if (isDirectionable) {
                for (const entity of entityCollection) {
                    // TODO
                    // if (entity.constructor === Tank && !this.isTankAlive(entity)) {
                    //     continue;
                    // }
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
