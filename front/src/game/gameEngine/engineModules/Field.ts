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
import { entityDirections } from './constObjects/DirectionHandler';
import Store from '../store';
import mapCollection from './constObjects/mapCollection';
import Foliage from '../../gameObjects/foliage';
import Tree from '../../gameObjects/tree';
import Bridge from '../../gameObjects/bridge';

class Field {
    mapObjects: {
        tanks: Tank[];
        obstacle: obstacleType[];
        shell: Shell[];
        base: Base[];
        particles: Particle[];
        water: Water[];
        foliage: Foliage[];
        bridges: Bridge[];
    } = { tanks: [], obstacle: [], shell: [], base: [], particles: [], water: [], foliage: [], bridges: [] };

    mapSize: { width: number; height: number };
    constructor(mapWidth: number, mapHeight: number, choosenMap: string) {
        this.mapSize = { width: mapWidth, height: mapHeight };

        if (Store.isSinglePlayer) {
            if (choosenMap === 'first') {
                this.generateMap(mapCollection.map1SinglePlayer);
            } else {
                this.generateMap(mapCollection.map2SinglePlayer);
            }
        } else {
            if (choosenMap === 'first') {
                this.generateMap(mapCollection.map1Multiplayer);
            } else {
                this.generateMap(mapCollection.map2Multiplayer);
            }
        }
    }

    generateMap(map: string[][]) {
        const tileSize = 50;
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                let symbol = map[y][x];
                if (symbol === '.') {
                    continue;
                }
                if (symbol.startsWith('bs')) {
                    // @ts-ignore
                    const baseSide: 0 | 1 = parseInt(symbol.split('bs')[1]) - 1;
                    this.mapObjects.base[baseSide] = new Base(x * tileSize, y * tileSize, baseSide);
                    continue;
                }
                if (symbol === 'b') {
                    this.mapObjects.obstacle.push(new BrickWall(x * tileSize, y * tileSize));
                    continue;
                }
                if (symbol === 's') {
                    this.mapObjects.obstacle.push(new SteelWall(x * tileSize, y * tileSize));
                    continue;
                }
                if (symbol === 'h') {
                    this.mapObjects.obstacle.push(new House(x * tileSize, y * tileSize, Store.choosenMap));
                    continue;
                }
                if (symbol === 'w') {
                    this.mapObjects.water.push(new Water(x * tileSize, y * tileSize, entityDirections.Left));
                    continue;
                }
                if (symbol.startsWith('B')) {
                    //@ts-ignore
                    const side: 'l' | 'u' = symbol[1];
                    this.mapObjects.bridges.push(new Bridge(x * tileSize, y * tileSize, side));
                }
                if (symbol.startsWith('T')) {
                    //@ts-ignore
                    const color: 'a' | 'o' = symbol[1];
                    this.mapObjects.obstacle.push(new Tree(x * tileSize, y * tileSize, color));
                }
                if (symbol.startsWith('f')) {
                    //@ts-ignore
                    const color: 'g' | 'y' = symbol[1];
                    this.mapObjects.foliage.push(new Foliage(x * tileSize, y * tileSize, color));
                }
                if (symbol.startsWith('t')) {
                    const tankNumber: number = parseInt(symbol.split('t')[1]);
                    console.log('tank number: ' + (tankNumber - 1));
                    this.mapObjects.tanks[tankNumber - 1] = new Tank(
                        x * tileSize,
                        y * tileSize,
                        tankNumber === 1 ? 0 : 1
                    );
                    continue;
                }
            }
        }
    }

    getAllMapObjects(): [Base[], obstacleType[], Water[], Bridge[], Tank[], Shell[], Particle[], Foliage[]] {
        return [
            this.mapObjects.base,
            this.mapObjects.obstacle,
            this.mapObjects.water,
            this.mapObjects.bridges,
            this.mapObjects.tanks,
            this.mapObjects.shell,
            this.mapObjects.particles,
            this.mapObjects.foliage,
        ];
    }

    getMinimalStep(step: Point, gameObject: GameObject): [Point, GameObject | undefined] {
        let minimalStep = Object.assign({}, step);
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
        const isShell = gameObject.constructor === Shell;
        return (
            this.mapObjects.obstacle.find((obstacle) => this.hasObstacleCollision(gameObject, minimalStep, obstacle)) ||
            this.mapObjects.base.find((base) => this.hasObstacleCollision(gameObject, minimalStep, base)) ||
            this.mapObjects.tanks.find(
                (tank) => tank !== gameObject && this.hasObstacleCollision(gameObject, minimalStep, tank)
            ) ||
            (isShell
                ? undefined
                : this.mapObjects.water.find((water) => this.hasObstacleCollision(gameObject, minimalStep, water)))
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
    getParentCollection(child: Water): Water[];
    getParentCollection(
        child: obstacleType | Shell | Base | Particle | Tank | Water
    ): obstacleType[] | Shell[] | Base[] | Particle[] | Tank[] | Water {
        if (
            child.constructor === SteelWall ||
            child.constructor === BrickWall ||
            child.constructor === House ||
            child.constructor === Tree
        ) {
            return this.mapObjects.obstacle;
        }

        if (child.constructor === Base) {
            return this.mapObjects.base;
        }
        if (child.constructor === Tank) {
            return this.mapObjects.tanks;
        }
        if (child.constructor === Water) {
            return this.mapObjects.water;
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
}

export default Field;
