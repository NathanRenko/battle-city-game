import Point from '../../gameClasses/Point';
import Particle from '../../gameObjects/particle';
import Shell from '../../gameObjects/shell';
import {entityDirections, buttonsToDirections} from './constObjects/DirectionHandler';
import Field from './Field';

class EntityHandlers {
    field: Field;

    constructor(field: Field) {
        this.field = field;
    }

    handleParticle(particle: Particle, dt: number) {
        particle.changeStep(dt);
        if (particle.animationOver) {
            this.field.particles.splice(this.field.particles.indexOf(particle), 1);
        }
    }

    handleMovements(button: any, step: Point) {
        let availableStep = this.field.getMinimalStep(step, this.field.player);
        this.field.player.applyStep(availableStep);
        this.field.player.changeDirection(buttonsToDirections[button]);
    }
    handleShellMovements(shell: Shell, step: Point) {
        let availableStep = this.field.getMinimalStep(step, shell);
        if (availableStep.x === 0 && availableStep.y === 0) {
            this.field.shell.splice(this.field.shell.indexOf(shell), 1);
            let spawnPoint = new Point(0, 0);
            const particleWidth = 32;
            const sizeDelta = particleWidth - shell.width;
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
            let particle = new Particle(spawnPoint.x, spawnPoint.y);
            this.field.particles.push(particle);
        } else {
            shell.applyStep(availableStep);
        }
    }
    handleShoot(shootDirection: string) {
        let now = Date.now();
        if ((now - this.field.lastShooted) / 1000 < 1) {
            return;
        } else {
            this.field.lastShooted = now;
        }
        let spawnPoint = new Point(0, 0);
        const shellSize = 8;
        const sizeDelta = this.field.player.width - shellSize;
        switch (this.field.player.direction) {
            case entityDirections.Up:
                spawnPoint = new Point(this.field.player.x + sizeDelta / 2, this.field.player.y - shellSize);
                break;
            case entityDirections.Right:
                spawnPoint = new Point(
                    this.field.player.x + this.field.player.width,
                    this.field.player.y + sizeDelta / 2
                );
                break;
            case entityDirections.Down:
                spawnPoint = new Point(
                    this.field.player.x + sizeDelta / 2,
                    this.field.player.y + this.field.player.width
                );
                break;
            case entityDirections.Left:
                spawnPoint = new Point(this.field.player.x - shellSize, this.field.player.y + sizeDelta / 2);
                break;
        }
        let shell = new Shell(spawnPoint.x, spawnPoint.y, shootDirection);
        this.field.shell.push(shell);
    }
}

export default EntityHandlers;
