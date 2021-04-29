import Field from './Field';
import Point from '../../gameClasses/Point';
import InputHandler from './inputHandler';
import EntityHandlers from './entityHandlers';
import { buttonsToDirections, entityDirections } from './constObjects/DirectionHandler';
import io from 'socket.io-client';
import Store from '../store';
import Base from '../../gameObjects/base';
import GameObject from '../../gameClasses/gameObject';
import Tank from '../../gameObjects/tank';
import Bot from '../../gameObjects/bot';
import House from '../../gameObjects/house';

class ModelHandler {
    field: Field;
    InputHandler: InputHandler;
    entityHandler!: EntityHandlers;
    socketId!: number;
    playerBase!: Base;
    currentPlayer!: Tank;
    opponent!: Tank;
    needDestroy!: GameObject | undefined;

    bots!: Bot[];

    constructor(field: Field) {
        this.field = field;
        this.InputHandler = new InputHandler();
        if (Store.isSinglePlayer) {
            this.initPlayer(0, 0);
            this.bots = [];
            this.bots.push(new Bot(this.field.mapObjects.tanks[1], this.field, this.entityHandler, 'chaotic'));
            this.bots.push(new Bot(this.field.mapObjects.tanks[2], this.field, this.entityHandler, 'chaotic'));
            this.bots.push(new Bot(this.field.mapObjects.tanks[3], this.field, this.entityHandler, 'playerPursuing'));
            return;
        } else {
            // TODO
            this.socketId = Store.playerNumber;
            console.log('socket: ' + this.socketId);
            this.initPlayer(this.socketId, this.socketId);
            this.setupSocket();
        }
    }

    initPlayer(playerId: number, baseId: number) {
        this.entityHandler = new EntityHandlers(this.field);
        this.currentPlayer = this.field.mapObjects.tanks[playerId];
        this.opponent = this.field.mapObjects.tanks[1 - playerId];
        this.playerBase = this.field.mapObjects.base[baseId];
    }

    setupSocket() {
        Store.socket.on('move', (event: any, ...args: any) => {
            this.opponent.x = event[0].x;
            this.opponent.y = event[0].y;
            this.opponent.direction = event[0].direction;
        });
        Store.socket.on('shoot', (event: any, ...args: any) => {
            this.entityHandler.makeShoot(this.opponent);
        });

        Store.socket.once('opponent disconnected', (event: any, ...args: any) => {
            Store.openModal('Оппонент отключился.');
            Store.socket.disconnect();
        });

        // this.socketId - underfined, т.к. socket.on выполняется позже
        console.log('socket: ' + this.socketId);
    }

    frameEngine(dt: number) {
        this.handleMovementKeyPressing(dt);
        this.handleShotPress();
        this.handleShellsMovement(dt);
        this.handleParticleChanging(dt);
        this.handleHouseCollectionAnimation(dt);
        this.handleWaterAnimation(dt);
        if (Store.isSinglePlayer) {
            for (const bot of this.bots) {
                // if (!(bot.tank.respawnCount === 0 && bot.tank.hp === 0)) {
                if (this.field.mapObjects.tanks.indexOf(bot.tank) !== -1) {
                    bot.handleBotActions(dt);
                } else {
                    this.bots.splice(this.bots.indexOf(bot), 1);
                }
                // if (!bot.tank) {
                //     // this.bots.splice(this.bots.indexOf(bot), 1);
                // } else {
                //     if (Math.random() > 0.98) {
                //         console.log(bot.tank);
                //     }
                //     bot.handleBotActions(dt);
                // }
            }
            return;
        } else {
            Store.socket.emit('move', {
                x: this.currentPlayer.x,
                y: this.currentPlayer.y,
                direction: this.currentPlayer.direction,
            });
        }
    }

    handleMovementKeyPressing(dt: number) {
        const playerSpeed = 15;
        const shift = Math.round(playerSpeed * dt * 10);
        const movement: { [index: string]: Point } = {
            ArrowDown: new Point(0, shift),
            ArrowUp: new Point(0, -shift),
            ArrowLeft: new Point(-shift, 0),
            ArrowRight: new Point(shift, 0),
        };
        for (const move in movement) {
            if (this.handleMovements(move, movement[move])) break;
        }
    }

    handleShotPress() {
        if (this.InputHandler.isDown(' ')) {
            if (this.entityHandler.canShoot(this.currentPlayer)) {
                this.entityHandler.makeShoot(this.currentPlayer);
                if (Store.isSinglePlayer) {
                    return;
                } else {
                    Store.socket.emit('shoot');
                }
            }
        }
    }

    handleShellsMovement(dt: number) {
        const shellSpeed = 30;
        const shellShift = Math.round(shellSpeed * dt * 10);

        const directions: { [index: string]: Point } = {
            [entityDirections.Down]: new Point(0, shellShift),
            [entityDirections.Up]: new Point(0, -shellShift),
            [entityDirections.Left]: new Point(-shellShift, 0),
            [entityDirections.Right]: new Point(shellShift, 0),
        };
        for (const shell of this.field.mapObjects.shell) {
            this.entityHandler.handleShellMovements(shell, directions[shell.direction]);
        }
    }

    handleParticleChanging(dt: number) {
        for (const particle of this.field.mapObjects.particles) {
            this.entityHandler.handleParticle(particle, dt);
        }
    }

    handleHouseCollectionAnimation(dt: number) {
        for (const obstacle of this.field.mapObjects.obstacle) {
            if (obstacle.constructor === House) {
                if (obstacle.stateNumber !== 0) {
                    this.entityHandler.handleHouseFireAnimation(obstacle, dt);
                }
            }
        }
    }

    handleWaterAnimation(dt: number) {
        for (const water of this.field.mapObjects.water) {
            water.changeAnimationStep(dt);
        }
    }

    handleMovements(button: any, step: Point) {
        if (this.InputHandler.isDown(button)) {
            this.entityHandler.handleTankMovements(this.currentPlayer, buttonsToDirections[button], step);
            return true;
        }
        return false;
    }
}

export default ModelHandler;
