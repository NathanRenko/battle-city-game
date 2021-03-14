import GameObject from '../../gameClasses/gameObject';
import Point from '../../gameClasses/Point';
import Particle from '../../gameObjects/particle';
import Shell from '../../gameObjects/shell';
import Tank from '../../gameObjects/tank';
import SteelWall from '../../gameObjects/steel-wall';
import Figure from '../../gameClasses/figure';
import BrickWall from '../../gameObjects/brick-wall';
import Base from '../../gameObjects/base';
import EntityClasses from './entityClasses';

class Field {
    tanks: Tank[];
    player: Tank;
    obstacle: (SteelWall | BrickWall | Base | Tank)[];
    shell: Shell[] = [];
    base: Base[] = [];
    particles: Particle[] = [];
    mapSize: { width: number; height: number };
    lastShooted: number = 0;
    constructor(mapWidth: number, mapHeight: number) {
        this.mapSize = { width: mapWidth, height: mapHeight };
        this.tanks = [new Tank(120, 200), new Tank(350, 40)];
        this.obstacle = [];
        for (let index = 0; index < 5; index++) {
            this.obstacle.push(new SteelWall(50, 200 + index * 16));
        }
        for (let index = 0; index < 65; index++) {
            this.obstacle.push(new BrickWall(index * 8, 100));
        }
        for (let index = 0; index < 65; index++) {
            this.obstacle.push(new BrickWall(index * 8, 130));
        }
        this.player = this.tanks[0];
        this.base = [new Base(240, 350, 0), new Base(240, 40, 1)];
    }

    getMinimalStep(step: Point, gameObject: GameObject) {
        let minimalStep = Object.assign({}, step);
        // let minimalStep = { ...step };
        let collisionBlock = this.findCollisionBlock(minimalStep, gameObject);
        while (
            (collisionBlock && this.hasObstacleCollision(gameObject, minimalStep, collisionBlock)) ||
            this.hasBoundsCollision(gameObject, minimalStep, this.mapSize)
        ) {
            if (minimalStep.x === 0 && minimalStep.y === 0) {
                break;
            }
            if (minimalStep.x !== 0) {
                minimalStep.x -= Math.sign(minimalStep.x);
            } else {
                minimalStep.y -= Math.sign(minimalStep.y);
            }
        }
        if (collisionBlock && gameObject.constructor.name === 'Shell' && minimalStep.x === 0 && minimalStep.y === 0) {
            let parentCollection = this.getParentCollection(collisionBlock);
            if ('hp' in collisionBlock) {
                if (collisionBlock.hp !== 0) {
                    collisionBlock.hp--;
                }
                if (collisionBlock.hp === 0) {
                    if ('team' in collisionBlock) {
                        collisionBlock.setDeathState();
                    } else {
                        parentCollection.splice(parentCollection.indexOf(collisionBlock), 1);
                    }
                }
            }
        }
        return minimalStep;
    }

    findCollisionBlock(minimalStep: Point, gameObject: GameObject) {
        return (
            this.obstacle.find((obstacle) => this.hasObstacleCollision(gameObject, minimalStep, obstacle)) ||
            this.base.find((base) => this.hasObstacleCollision(gameObject, minimalStep, base)) ||
            this.tanks.find((tank) => tank !== gameObject && this.hasObstacleCollision(gameObject, minimalStep, tank))
        );
    }

    hasBoundsCollision(player: GameObject, step: Point, mapSize: { width: number; height: number }) {
        return (
            player.x + step.x < 0 ||
            player.x + step.x > mapSize.width - player.width ||
            player.y + step.y < 0 ||
            player.y + step.y > mapSize.height - player.height
        );
    }

    hasObstacleCollision(player: GameObject, step: Point, obstacle: GameObject): boolean {
        return this.hasIntersects(player, step, obstacle);
    }

    hasIntersects(firstRect: GameObject, step: Point, secondRect: GameObject): boolean {
        let shiftedRectangle = new Figure(
            firstRect.x + step.x,
            firstRect.y + step.y,
            firstRect.width,
            firstRect.height
        );
        return !(
            shiftedRectangle.y > secondRect.getY1() ||
            shiftedRectangle.getY1() < secondRect.y ||
            shiftedRectangle.getX1() < secondRect.x ||
            shiftedRectangle.x > secondRect.getX1()
        );
    }
    getParentCollection(child: GameObject | string) {
        let className = typeof child === 'string' ? child : child.constructor.name;

        switch (className) {
            case EntityClasses.SteelWall:
            case EntityClasses.BrickWall:
                return this.obstacle;
            case EntityClasses.Base:
                return this.base;
            case EntityClasses.Tank:
                return this.tanks;
            case EntityClasses.Shell:
                return this.shell;
            case EntityClasses.Particle:
                return this.particles;
            default:
                alert(child.constructor.name);
                throw Error('Unknown type');
        }
    }
    createEntity(entityClass: string, coords: Array<[number, number]>) {
        switch (entityClass) {
            case EntityClasses.SteelWall:
            case EntityClasses.BrickWall:
            case EntityClasses.Base:
                // for (const coord of coords) {
                //     this.obstacle.push;
                // }
                break;
            case EntityClasses.Tank:
                return this.tanks;
            case EntityClasses.Shell:
                return this.shell;
            case EntityClasses.Particle:
                return this.particles;
            default:
                alert(entityClass);
                throw Error('Unknown type');
        }
    }
}

export default Field;
