import GameObject from '../../gameClasses/gameObject';
import Point from '../../gameClasses/Point';
import Base from '../../gameObjects/base';
import BrickWall from '../../gameObjects/brick-wall';
import Particle from '../../gameObjects/particle';
import Shell from '../../gameObjects/shell';
import SteelWall from '../../gameObjects/steel-wall';
import Tank from '../../gameObjects/tank';
import CollisionHandler from './collisionHandler';
import { entityDirections, buttonsToDirections } from './constObjects/DirectionHandler';
import Field from './Field';

class EntityHandlers {
    field: Field;
    currentPlayer: Tank;
    collisionHandler: CollisionHandler;

    constructor(field: Field, currentPlayer: Tank) {
        this.field = field;
        this.currentPlayer = currentPlayer;
        this.collisionHandler = new CollisionHandler();
    }

    handleParticle(particle: Particle, dt: number) {
        particle.changeStep(dt);
        if (particle.animationOver) {
            this.field.mapObjects.particles.splice(this.field.mapObjects.particles.indexOf(particle), 1);
        }
    }

    handleTankMovements(tank: Tank, direction: entityDirections, step: Point) {
        let [availableStep, collisionBlock] = this.field.getMinimalStep(step, tank);
        if (availableStep.x === 0 && availableStep.y === 0) {
            // this.handleСollision();
        } else {
            tank.applyStep(availableStep);
        }
        tank.changeDirection(direction);
    }

    handleShellMovements(shell: Shell, step: Point) {
        let [availableStep, collisionBlock] = this.field.getMinimalStep(step, shell);
        if (availableStep.x === 0 && availableStep.y === 0) {
            this.collisionHandler.handleShellСollision(collisionBlock, shell, this.field);
        } else {
            shell.applyStep(availableStep);
        }
    }

    canShoot(tank: Tank) {
        let now = Date.now();
        if ((now - tank.lastShooted) / 1000 < 1) {
            return false;
        } else {
            tank.lastShooted = now;
            return true;
        }
    }

    makeShoot(shootPlayer: Tank) {
        shootPlayer.shootAudio.play();
        let spawnPoint = new Point(0, 0);
        const shellSize = 8;
        const sizeDelta = shootPlayer.size - shellSize;
        switch (shootPlayer.direction) {
            case entityDirections.Up:
                spawnPoint = new Point(shootPlayer.x + sizeDelta / 2, shootPlayer.y - shellSize);
                break;
            case entityDirections.Right:
                spawnPoint = new Point(shootPlayer.x + shootPlayer.size, shootPlayer.y + sizeDelta / 2);
                break;
            case entityDirections.Down:
                spawnPoint = new Point(shootPlayer.x + sizeDelta / 2, shootPlayer.y + shootPlayer.size);
                break;
            case entityDirections.Left:
                spawnPoint = new Point(shootPlayer.x - shellSize, shootPlayer.y + sizeDelta / 2);
                break;
        }
        let shell = new Shell(spawnPoint.x, spawnPoint.y, shootPlayer.direction);
        this.field.mapObjects.shell.push(shell);
    }
}

export default EntityHandlers;
