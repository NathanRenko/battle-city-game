import Field from './Field';
import Point from '../../gameClasses/Point';
import InputHandler from './inputHandler';
import EntityHandlers from './entityHandlers';
import { entityDirections } from './constObjects/DirectionHandler';
import io from 'socket.io-client';
import Store from '../store';

class ModelHandler {
    field: Field;
    InputHandler: InputHandler;
    entityHandler!: EntityHandlers;
    socketId!: number;

    constructor(field: Field) {
        this.field = field;
        this.InputHandler = new InputHandler();
        if (Store.isSinglePlayer) {
            this.entityHandler = new EntityHandlers(this.field, this.field.tanks[0]);
            return;
        }
        // TODO
        this.socketId = Store.socketID;
        if (this.socketId === 0) {
            console.log('socket: ' + this.socketId);
            this.entityHandler = new EntityHandlers(this.field, this.field.tanks[0]);

            Store.socket.on('move', (event: any, ...args: any) => {
                if (this.counter === 0) {
                    console.log(event[0].player2);
                    this.counter++;
                }

                this.field.tanks[1].x = event[0].player2.x;
                this.field.tanks[1].y = event[0].player2.y;
                this.field.tanks[1].direction = event[0].player2.direction;
            });
            Store.socket.on('shoot', (event: any, ...args: any) => {
                // this.entityHandler.handleShoot(event[0].player2.direction);
                this.entityHandler.makeShoot(this.field.tanks[1]);
            });
        } else {
            this.entityHandler = new EntityHandlers(this.field, this.field.tanks[1]);
            Store.socket.on('move', (event: any, ...args: any) => {
                if (this.counter === 0) {
                    console.log(event[0].player1);
                    this.counter++;
                }

                this.field.tanks[0].x = event[0].player1.x;
                this.field.tanks[0].y = event[0].player1.y;
                this.field.tanks[0].direction = event[0].player1.direction;
            });
            Store.socket.on('shoot', (event: any, ...args: any) => {
                console.log('shoot1');
                this.entityHandler.makeShoot(this.field.tanks[0]);
            });
        }

        // this.socketId - underfined, т.к. socket.on выполняется позже
        console.log('socket: ' + this.socketId);
    }
    counter = 0;
    frameEngine(dt: number) {
        this.handleMovementKeyPressing(dt);
        this.handleShotPress();
        this.handleShellsMovement(dt);
        this.handleParticleChanging(dt);
        if (Store.isSinglePlayer) {
            return;
        }
        if (this.socketId === 0) {
            Store.socket.emit('move', { player1: this.field.tanks[0] });
        }
        if (this.socketId === 1) {
            Store.socket.emit('move', { player2: this.field.tanks[1] });
        }
    }

    handleMovementKeyPressing(dt: number) {
        const playerSpeed = 20;
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
            if (this.entityHandler.canShoot()) {
                this.entityHandler.makeShoot(this.entityHandler.currentPlayer);
                if (Store.isSinglePlayer) {
                    return;
                }
                if (this.socketId === 0) {
                    console.log('shoot1');
                    Store.socket.emit('shoot', { player1: this.entityHandler.currentPlayer.direction });
                }
                if (this.socketId === 1) {
                    Store.socket.emit('shoot', { player2: this.entityHandler.currentPlayer.direction });
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
        for (const shell of this.field.shell) {
            this.entityHandler.handleShellMovements(shell, directions[shell.direction]);
        }
    }

    handleParticleChanging(dt: number) {
        for (const particle of this.field.particles) {
            this.entityHandler.handleParticle(particle, dt);
        }
    }

    handleMovements(button: any, step: Point) {
        if (this.InputHandler.isDown(button)) {
            this.entityHandler.handleMovements(button, step);
            return true;
        }
        return false;
    }
}

export default ModelHandler;
