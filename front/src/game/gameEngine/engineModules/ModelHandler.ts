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

class ModelHandler {
    field: Field;
    InputHandler: InputHandler;
    entityHandler!: EntityHandlers;
    socketId!: number;
    playerBase!: Base;

    needDestroy!: GameObject | undefined;

    constructor(field: Field) {
        this.field = field;
        this.InputHandler = new InputHandler();
        if (Store.isSinglePlayer) {
            this.entityHandler = new EntityHandlers(this.field, this.field.mapObjects.tanks[0]);
            this.playerBase = this.field.mapObjects.base[0];
            return;
        } else {
            // TODO
            this.socketId = Store.playerNumber;
            console.log('socket: ' + this.socketId);

            this.entityHandler = new EntityHandlers(this.field, this.field.mapObjects.tanks[this.socketId]);
            this.playerBase = this.field.mapObjects.base[this.socketId];
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
    }

    findBestWay(dt: number) {
        let start = { x: this.field.mapObjects.tanks[1].x, y: this.field.mapObjects.tanks[1].y };
        let target = { x: this.field.mapObjects.tanks[0].x, y: this.field.mapObjects.tanks[0].y };
        let moves = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'];
        const playerSpeed = 5;
        const shift = Math.round(playerSpeed * dt * 10);

        const movement: { [index: string]: Point } = {
            ArrowDown: new Point(0, shift),
            ArrowUp: new Point(0, -shift),
            ArrowLeft: new Point(-shift, 0),
            ArrowRight: new Point(shift, 0),
        };
        if (start.y < target.y) {
            // this.needDestroy = this.field.findCollisionBlock(movement[moves[0]], this.field.mapObjects.tanks[1])
            if (this.field.findCollisionBlock(movement[moves[0]], this.field.mapObjects.tanks[1])) {
                return moves[0];
            }
        }
        if (start.y > target.y) {
            if (!this.field.findCollisionBlock(movement[moves[1]], this.field.mapObjects.tanks[1])) {
                return moves[1];
            }
        }
        if (start.x > target.x) {
            if (!this.field.findCollisionBlock(movement[moves[2]], this.field.mapObjects.tanks[1])) {
                return moves[2];
            }
        }
        if (start.x < target.x) {
            if (this.field.findCollisionBlock(movement[moves[3]], this.field.mapObjects.tanks[1]) !== undefined) {
                return moves[3];
            }
        }
        return moves[3];
    }

    frameEngine(dt: number) {
        this.handleMovementKeyPressing(dt);
        this.handleShotPress();
        this.handleShellsMovement(dt);
        this.handleParticleChanging(dt);
        let allowBot = false;
        if (Store.isSinglePlayer) {
            if (allowBot) {
                // BOTS
                const playerSpeed = 5;
                const shift = Math.round(playerSpeed * dt * 10);
                let moves = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'];
                const movement: { [index: string]: Point } = {
                    ArrowDown: new Point(0, shift),
                    ArrowUp: new Point(0, -shift),
                    ArrowLeft: new Point(-shift, 0),
                    ArrowRight: new Point(shift, 0),
                };

                // let way = moves[Math.floor(Math.random() * moves.length)];
                let way = this.findBestWay(dt) || 'ArrowDown';
                this.entityHandler.handleTankMovements(
                    this.field.mapObjects.tanks[1],
                    buttonsToDirections[way],
                    movement[way]
                );
                if (this.entityHandler.canShoot(this.field.mapObjects.tanks[1])) {
                    this.entityHandler.makeShoot(this.field.mapObjects.tanks[1]);
                }
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
            if (this.entityHandler.canShoot(this.entityHandler.currentPlayer)) {
                this.entityHandler.makeShoot(this.entityHandler.currentPlayer);
                if (Store.isSinglePlayer) {
                    return;
                } else {
                    Store.socket.emit('shoot', {
                        player: this.entityHandler.currentPlayer.direction,
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
            this.entityHandler.handleTankMovements(this.entityHandler.currentPlayer, buttonsToDirections[button], step);
            return true;
        }
        return false;
    }
}

export default ModelHandler;
