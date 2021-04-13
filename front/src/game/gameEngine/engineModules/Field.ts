import GameObject from '../../gameClasses/gameObject';
import Point from '../../gameClasses/Point';
import Particle from '../../gameObjects/particle';
import Shell from '../../gameObjects/shell';
import Tank from '../../gameObjects/tank';
import SteelWall from '../../gameObjects/steel-wall';
import Figure from '../../gameClasses/figure';
import BrickWall from '../../gameObjects/brick-wall';
import Base from '../../gameObjects/base';
import { EntityClasses, EntityGroups, isObstacle, obstacleType } from './constObjects/entityClasses';
import House from '../../gameObjects/house';
import Water from '../../gameObjects/water';

class Field {
    mapObjects: {
        tanks: Tank[];
        obstacle: obstacleType[];
        shell: Shell[];
        base: Base[];
        particles: Particle[];
    } = { tanks: [], obstacle: [], shell: [], base: [], particles: [] };

    // player: Tank;

    mapSize: { width: number; height: number };
    constructor(mapWidth: number, mapHeight: number, choosenMap: string) {
        // TODO choosenMap
        this.mapSize = { width: mapWidth, height: mapHeight };
        if (choosenMap) {
            // insert some logic
        }
        this.buildFirstTypeMap();
    }

    getAllMapObjects(): [Base[], obstacleType[], Tank[], Shell[], Particle[]] {
        return [
            this.mapObjects.base,
            this.mapObjects.obstacle,
            this.mapObjects.tanks,
            this.mapObjects.shell,
            this.mapObjects.particles,
        ];
    }

    buildFirstTypeMap = () => {
        this.mapObjects.tanks = [new Tank(120, 700), new Tank(350, 20)];
        this.mapObjects.obstacle = [];

        let steelWallSize = new SteelWall(0, 0).size;
        let brickWallSize = new SteelWall(0, 0).size;

        for (let index = 0; index < 5; index++) {
            this.mapObjects.obstacle.push(new SteelWall(350 + index * steelWallSize, 670));
        }
        for (let index = 0; index < 5; index++) {
            this.mapObjects.obstacle.push(new SteelWall(350 + index * steelWallSize, 80));
        }
        for (let index = 0; index < 65; index++) {
            this.mapObjects.obstacle.push(new BrickWall(index * brickWallSize, 620));
        }
        for (let index = 0; index < 65; index++) {
            this.mapObjects.obstacle.push(new BrickWall(index * brickWallSize, 130));
        }
        // this.player = this.tanks[0];
        this.mapObjects.base = [new Base(450, 730, 0), new Base(450, 10, 1)];
        this.mapObjects.obstacle.push(new House(450, 350));
    };

    getMinimalStep(step: Point, gameObject: GameObject): [Point, GameObject | undefined] {
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
        return [minimalStep, collisionBlock];
    }

    findCollisionBlock(minimalStep: Point, gameObject: GameObject) {
        return (
            this.mapObjects.obstacle.find((obstacle) => this.hasObstacleCollision(gameObject, minimalStep, obstacle)) ||
            this.mapObjects.base.find((base) => this.hasObstacleCollision(gameObject, minimalStep, base)) ||
            this.mapObjects.tanks.find(
                (tank) => tank !== gameObject && this.hasObstacleCollision(gameObject, minimalStep, tank)
            )
        );
    }

    hasBoundsCollision(player: GameObject, step: Point, mapSize: { width: number; height: number }) {
        return (
            player.x + step.x < 0 ||
            player.x + step.x > mapSize.width - player.size ||
            player.y + step.y < 0 ||
            player.y + step.y > mapSize.height - player.size
        );
    }

    hasObstacleCollision(player: GameObject, step: Point, obstacle: GameObject): boolean {
        return this.hasIntersects(player, step, obstacle);
    }

    hasIntersects(firstRect: GameObject, step: Point, secondRect: GameObject): boolean {
        let shiftedRectangle = new Figure(firstRect.x + step.x, firstRect.y + step.y, firstRect.size, firstRect.size);
        return !(
            shiftedRectangle.y > secondRect.getY1() ||
            shiftedRectangle.getY1() < secondRect.y ||
            shiftedRectangle.getX1() < secondRect.x ||
            shiftedRectangle.x > secondRect.getX1()
        );
    }

    getParentCollection(child: obstacleType): obstacleType[];
    getParentCollection(child: Shell): Shell[];
    getParentCollection(child: Base): Base[];
    getParentCollection(child: Particle): Particle[];
    getParentCollection(child: Tank): Tank[];
    getParentCollection(
        child: obstacleType | Shell | Base | Particle | Tank
    ): obstacleType[] | Shell[] | Base[] | Particle[] | Tank[] {
        // if (isObstacle(child)) {
        //     let a = child;
        //     return this.mapObjects.obstacle;
        // }

        // TODO

        if (
            child.constructor === SteelWall ||
            child.constructor === BrickWall ||
            child.constructor === House ||
            child.constructor === Water
        ) {
            return this.mapObjects.obstacle;
        }

        if (child.constructor === Base) {
            return this.mapObjects.base;
        }
        if (child.constructor === Tank) {
            return this.mapObjects.tanks;
        }
        if (child.constructor === Shell) {
            return this.mapObjects.shell;
        }
        if (child.constructor === Particle) {
            return this.mapObjects.particles;
        }
        alert(child.constructor.name);
        throw Error('Unknown type');
    }

    // createEntity(entityClass: string, coords: Array<[number, number]>) {
    //     switch (entityClass) {
    //         case EntityClasses.SteelWall:
    //         case EntityClasses.BrickWall:
    //         case EntityClasses.House:
    //         case EntityClasses.Base:
    //             // for (const coord of coords) {
    //             //     this.obstacle.push;
    //             // }
    //             break;
    //         case EntityClasses.Tank:
    //             return this.mapObjects.tanks;
    //         case EntityClasses.Shell:
    //             return this.mapObjects.shell;
    //         case EntityClasses.Particle:
    //             return this.mapObjects.particles;

    //         default:
    //             alert(entityClass);
    //             throw Error('Unknown type');
    //     }
    // }
}

export default Field;
