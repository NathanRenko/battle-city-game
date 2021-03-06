import GameObject from '../../gameClasses/gameObject';
import Point from '../../gameClasses/Point';
import Particle from '../../gameObjects/particle';
import Shell from '../../gameObjects/shell';
import Tank from '../../gameObjects/tank';
import SteelWall from '../../gameObjects/steel-wall';
import Figure from '../../gameClasses/figure';
import BrickWall from '../../gameObjects/brick-wall';

class Field {
    player: Tank;
    obsacle: SteelWall[];
    shell: Shell[] = [];
    particles: Particle[] = [];
    mapSize = { width: 600, height: 400 };
    lastShooted: number = 0;
    constructor() {
        this.player = new Tank(121, 100);
        this.obsacle = [
            new SteelWall(100, 100),
            new SteelWall(100, 116),
            new SteelWall(100, 132),
            new SteelWall(100, 148),
            new SteelWall(100, 164),
            new BrickWall(200, 100),
            new BrickWall(200, 116),
            new BrickWall(200, 132),
            new BrickWall(200, 148),
            new BrickWall(200, 164),
        ];
    }
    
    getMinimalStep(step: Point, gameObject: GameObject) {
        let minimalStep = Object.assign({}, step);
        // let minimalStep = { ...step };
        while (
            this.obsacle.some((obsacle) => this.hasObstacleCollision(gameObject, minimalStep, obsacle)) ||
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
        return minimalStep;
    }
    hasBoundsCollision(player: GameObject, step: Point, mapSize: { width: number; height: number }) {
        return (
            player.x + step.x < 0 ||
            player.x + step.x > mapSize.width - player.width ||
            player.y + step.y < 0 ||
            player.y + step.y > mapSize.height - player.height
        );
    }

    hasObstacleCollision(player: GameObject, step: Point, obsacle: GameObject): boolean {
        return this.hasIntersects(player, step, obsacle);
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
}

export default Field;
