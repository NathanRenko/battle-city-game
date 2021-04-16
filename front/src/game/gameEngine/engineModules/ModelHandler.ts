import Field from './Field';
import Point from '../../gameClasses/Point';
import InputHandler from './inputHandler';
import EntityHandlers from './entityHandlers';
import { buttonsToDirections, entityDirections } from './constObjects/DirectionHandler';
import io from 'socket.io-client';
import Store from '../store';
import Base from '../../gameObjects/base';
import backToMainMenu from '../StageSwitcher';
import GameObject from '../../gameClasses/gameObject';
import Tank from '../../gameObjects/tank';
import Bot from '../../gameObjects/bot';

class ModelHandler {
    field: Field;
    InputHandler: InputHandler;
    entityHandler!: EntityHandlers;
    socketId!: number;
    playerBase!: Base;
    currentPlayer!: Tank;
    needDestroy!: GameObject | undefined;

    bot!: Bot;

    constructor(field: Field) {
        this.field = field;
        this.InputHandler = new InputHandler();
        if (Store.isSinglePlayer) {
            this.initPlayer(0, 0);
            this.bot = new Bot(this.field.mapObjects.tanks[1], this.field, this.entityHandler, 'chaotic');
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
        this.playerBase = this.field.mapObjects.base[baseId];
    }

    setupSocket() {
        Store.socket.on('move', (event: any, ...args: any) => {
            this.field.mapObjects.tanks[1 - this.socketId].x = event[0].player.x;
            this.field.mapObjects.tanks[1 - this.socketId].y = event[0].player.y;
            this.field.mapObjects.tanks[1 - this.socketId].direction = event[0].player.direction;
        });
        Store.socket.on('shoot', (event: any, ...args: any) => {
            this.entityHandler.makeShoot(this.field.mapObjects.tanks[1 - this.socketId]);
        });

        Store.socket.once('opponent disconnected', (event: any, ...args: any) => {
            backToMainMenu('Your opponent disconnected.');
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
        if (Store.isSinglePlayer) {
            if (this.bot) {
                this.bot.handleBotActions(dt);
            }
            return;
        } else {
            Store.socket.emit('move', { player: this.field.mapObjects.tanks[this.socketId] });
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
                    Store.socket.emit('shoot', {
                        player: this.currentPlayer.direction,
                    });
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

    handleMovements(button: any, step: Point) {
        if (this.InputHandler.isDown(button)) {
            this.entityHandler.handleTankMovements(this.currentPlayer, buttonsToDirections[button], step);
            return true;
        }
        return false;
    }
}

export default ModelHandler;
