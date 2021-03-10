import Point from "../../gameClasses/Point";
import Particle from "../../gameObjects/particle";
import Shell from "../../gameObjects/shell";
import Field from "./Field";

class EntityHandlers {
    field:Field

    constructor(field:Field){
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
        this.field.player.changeDirection(button);
    }
    handleShellMovements(shell: Shell, step: Point) {
        let availableStep = this.field.getMinimalStep(step, shell);
        if (availableStep.x === 0 && availableStep.y === 0) {
            this.field.shell.splice(this.field.shell.indexOf(shell), 1);
            let particle = new Particle(shell.x, shell.y);
            this.field.particles.push(particle);
        } else {
            shell.applyStep(availableStep);
        }
    }
    handleShoot(shootDirection: number) {
        let now = Date.now();
        if ((now - this.field.lastShooted) / 1000 < 1) {
            return;
        } else {
            this.field.lastShooted = now;
        }
        let spawnPoint = new Point(0, 0);
        let playerCenter = new Point(this.field.player.x + this.field.player.width / 2, this.field.player.y + this.field.player.height / 2);
        let halfShellSize = 4;
        switch (this.field.player.direction) {
            case 0:
                spawnPoint = new Point(playerCenter.x - halfShellSize, playerCenter.y - this.field.player.height / 2);
                break;
            case 90:
                spawnPoint = new Point(playerCenter.x + this.field.player.width / 2, playerCenter.y - halfShellSize);
                break;
            case 180:
                spawnPoint = new Point(playerCenter.x - halfShellSize, playerCenter.y + this.field.player.height / 2);
                break;
            case -90:
                spawnPoint = new Point(playerCenter.x - this.field.player.width / 2 - halfShellSize, playerCenter.y - halfShellSize);
                break;
        }
        let shell = new Shell(spawnPoint.x, spawnPoint.y, shootDirection);
        this.field.shell.push(shell);
    }
}

export default EntityHandlers;
