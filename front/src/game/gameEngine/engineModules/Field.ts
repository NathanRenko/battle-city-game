import GameObject from '../../gameClasses/gameObject';
import Point from '../../gameClasses/Point';
import Particle from '../../gameObjects/particle';
import Shell from '../../gameObjects/shell';
import Tank from '../../gameObjects/tank';
import SteelWall from '../../gameObjects/steel-wall';
import Figure from '../../gameClasses/figure';
import BrickWall from '../../gameObjects/brick-wall';
import Base from '../../gameObjects/base';

class Field {
    tanks: Tank[];
    player: Tank;
    obstacle: (SteelWall | BrickWall | Base | Tank)[];
    shell: Shell[] = [];
    particles: Particle[] = [];
    mapSize = { width: 600, height: 400 };
    lastShooted: number = 0;
    constructor() {
        this.tanks = [new Tank(121, 100), new Tank(300, 150)];
        this.obstacle = [
            new SteelWall(100, 100),
            new SteelWall(100, 116),
            new SteelWall(100, 132),
            new SteelWall(100, 148),
            new SteelWall(100, 164),
            new BrickWall(200, 100),
            new BrickWall(200, 108),
            new BrickWall(200, 116),
            new BrickWall(200, 124),
            new BrickWall(200, 132),
            new BrickWall(200, 140),
            new BrickWall(200, 148),
            new BrickWall(200, 156),
            new BrickWall(200, 164),
            new Base(240, 150),
        ];
        this.player = this.tanks[0];
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
            if (collisionBlock.constructor.name === 'BrickWall') {
                parentCollection.splice(parentCollection.indexOf(collisionBlock), 1);
            } else if ('hp' in collisionBlock) {
                if (collisionBlock.hp !== 0) {
                    collisionBlock.hp--;
                }
                if (collisionBlock.hp === 0) {
                    parentCollection.splice(parentCollection.indexOf(collisionBlock), 1);
                }
            }
        }
        return minimalStep;
    }

    findCollisionBlock(minimalStep: Point, gameObject: GameObject) {
        return (
            this.obstacle.find((obstacle) => this.hasObstacleCollision(gameObject, minimalStep, obstacle)) ||
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
    getParentCollection(child: GameObject) {
        switch (child.constructor.name) {
            case 'SteelWall':
            case 'BrickWall':
            case 'Base':
                return this.obstacle;
            case 'Tank':
                return this.tanks;
            case 'Shell':
                return this.shell;
            case 'Particle':
                return this.particles;
            default:
                alert(child.constructor.name);
                throw Error('Unknown type');
        }
    }
}

export default Field;
