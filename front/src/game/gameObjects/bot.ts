import Point from '../gameClasses/Point';
import { buttonsToDirections } from '../gameEngine/engineModules/constObjects/DirectionHandler';
import EntityHandlers from '../gameEngine/engineModules/entityHandlers';
import Field from '../gameEngine/engineModules/Field';
import Tank from './tank';

class Bot {
    tank: Tank;
    way: string = '';
    pathLeft: number = 0;
    field: Field;
    entityHandler: EntityHandlers;
    algorithm: 'chaotic' | 'playerPursuing';

    constructor(tank: Tank, field: Field, entityHandler: EntityHandlers, algorithm: 'chaotic' | 'playerPursuing') {
        this.tank = tank;
        this.field = field;
        this.entityHandler = entityHandler;
        this.algorithm = algorithm;
    }

    findBestWay(dt: number) {
        let start = { x: this.tank.x, y: this.tank.y };
        let target = { x: this.field.mapObjects.tanks[0].x, y: this.field.mapObjects.tanks[0].y };
        // if (Math.random() > 0.99) {
        //     console.log('-----------');
        //     console.log(start);
        //     console.log(target);
        //     console.log('-----------');
        // }
        let deltaX = Math.abs(target.x - start.x);
        let deltaY = Math.abs(target.y - start.y);
        let moves = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'];

        if (deltaX > deltaY) {
            if (start.x > target.x) {
                // if (!this.field.findCollisionBlock(movement[moves[2]], this.field.mapObjects.tanks[1])) {
                //     return moves[2];
                // }
                return moves[2];
            } else {
                // if (this.field.findCollisionBlock(movement[moves[3]], this.field.mapObjects.tanks[1])) {
                //     return moves[3];
                // }
                return moves[3];
            }
        } else {
            if (start.y < target.y) {
                // this.needDestroy = this.field.findCollisionBlock(movement[moves[0]], this.field.mapObjects.tanks[1])
                // if (this.field.findCollisionBlock(movement[moves[0]], this.field.mapObjects.tanks[1])) {
                //     return moves[0];
                // }
                return moves[0];
            } else {
                // if (!this.field.findCollisionBlock(movement[moves[1]], this.field.mapObjects.tanks[1])) {
                //     return moves[1];
                // }
                return moves[1];
            }
        }
    }

    handleBotActions(dt: number) {
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

        //@ts-ignore
        if (this.algorithm === 'chaotic') {
            if (this.pathLeft <= 0) {
                let percent = Math.random() * 100;
                switch (true) {
                    case percent < 50:
                        this.way = moves[0];
                        break;
                    case percent < 70:
                        this.way = moves[2];
                        break;
                    case percent < 90:
                        this.way = moves[3];
                        break;
                    case percent <= 100:
                        this.way = moves[1];
                        break;
                    default:
                        break;
                }
                // this.bot.way = moves[Math.floor(Math.random() * moves.length)];
                let max = 200;
                let min = 100;
                this.pathLeft = Math.floor(Math.random() * (max - min + 1)) + min;
            }
            this.pathLeft -= shift;
        }

        if (this.algorithm === 'playerPursuing') {
            this.way = this.findBestWay(dt) || 'ArrowDown';
        }

        this.entityHandler.handleTankMovements(this.tank, buttonsToDirections[this.way], movement[this.way]);

        let percent = Math.random() * 100;
        if (this.entityHandler.canShoot(this.tank) && percent > 70) {
            this.entityHandler.makeShoot(this.tank);
        }
    }
}

export default Bot;
