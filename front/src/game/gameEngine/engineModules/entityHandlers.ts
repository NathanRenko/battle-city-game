import Point from '../../gameClasses/Point';
import Particle from '../../gameObjects/particle';
import Shell from '../../gameObjects/shell';
import Tank from '../../gameObjects/tank';
import { entityDirections, buttonsToDirections } from './constObjects/DirectionHandler';
import Field from './Field';

class EntityHandlers {
    field: Field;
    currentPlayer: Tank;

    constructor(field: Field, currentPlayer: Tank) {
        this.field = field;
        this.currentPlayer = currentPlayer;
    }

    handleParticle(particle: Particle, dt: number) {
        particle.changeStep(dt);
        if (particle.animationOver) {
            this.field.particles.splice(this.field.particles.indexOf(particle), 1);
        }
    }

    handleMovements(button: any, step: Point) {
        let availableStep = this.field.getMinimalStep(step, this.currentPlayer);
        this.currentPlayer.applyStep(availableStep);
        this.currentPlayer.changeDirection(buttonsToDirections[button]);
    }
    handleShellMovements(shell: Shell, step: Point) {
        let availableStep = this.field.getMinimalStep(step, shell);
        if (availableStep.x === 0 && availableStep.y === 0) {
            this.field.shell.splice(this.field.shell.indexOf(shell), 1);
            let spawnPoint = new Point(0, 0);
            const particleWidth = new Particle(spawnPoint.x, spawnPoint.y, shell.direction).size;
            const sizeDelta = particleWidth - shell.size;
            switch (shell.direction) {
                case entityDirections.Up:
                    spawnPoint = new Point(shell.x - sizeDelta / 2, shell.y);
                    break;
                case entityDirections.Right:
                    spawnPoint = new Point(shell.x - sizeDelta, shell.y - sizeDelta / 2);
                    break;
                case entityDirections.Down:
                    spawnPoint = new Point(shell.x - sizeDelta / 2, shell.y - sizeDelta);
                    break;
                case entityDirections.Left:
                    spawnPoint = new Point(shell.x, shell.y - sizeDelta / 2);
                    break;
                default:
                    throw new Error();
                    break;
            }
            let particle = new Particle(spawnPoint.x, spawnPoint.y, shell.direction);
            this.field.particles.push(particle);
        } else {
            shell.applyStep(availableStep);
        }
    }
    canShoot() {
        let now = Date.now();
        if ((now - this.field.lastShooted) / 1000 < 1) {
            return false;
        } else {
            this.field.lastShooted = now;
            return true;
        }
    }
    makeShoot(shootPlayer: Tank) {
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
        this.field.shell.push(shell);
    }
}

export default EntityHandlers;
