import GameObject from '../gameClasses/gameObject';
import GameEntity from '../gameRules/gameEntity';
import Point from '../gameClasses/Point';
import InputHandler from './inputHandler';
import Figure from '../gameClasses/figure';
import Shell from '../gameObjects/shell';
import Particle from '../gameObjects/particle';

class MovementHandler {
    gameEntity: GameEntity;
    canvas: HTMLCanvasElement;
    InputHandler: InputHandler;
    lastShooted: number = 0;
    constructor(gameEntity: GameEntity, canvas: HTMLCanvasElement) {
        this.gameEntity = gameEntity;
        this.canvas = canvas;
        this.InputHandler = new InputHandler();
    }
    keyPressEngine(dt: number) {
        const playerSpeed = 20;
        const shift = Math.round(playerSpeed * dt * 10);
        const movement: { [index: string]: Point } = {
            ArrowDown: new Point(0, shift),
            ArrowUp: new Point(0, -shift),
            ArrowLeft: new Point(-shift, 0),
            ArrowRight: new Point(shift, 0),
        };
        // TODO: Создать единую сущность
        const directions: { [index: number]: Point } = {
            '180': new Point(0, shift),
            '0': new Point(0, -shift),
            '-90': new Point(-shift, 0),
            '90': new Point(shift, 0),
        };
        for (const move in movement) {
            if (this.handleMovements(move, movement[move])) break;
        }
        this.handleShoot(' ', this.gameEntity.player.direction); // Выстрели если надо
        for (const shell of this.gameEntity.shell) {
            this.handleShellMovements(shell, directions[shell.direction]);
        }
        for (const particle of this.gameEntity.particles) {
            this.handleParticle(particle, dt);
        }
    }
    handleMovements(button: any, step: Point) {
        if (this.InputHandler.isDown(button)) {
            let availableStep = this.getMinimalStep(step, this.gameEntity.player);
            this.gameEntity.player.applyStep(availableStep);
            this.gameEntity.player.changeDirection(button);
            return true;
        }
        return false;
    }
    handleShellMovements(shell: Shell, step: Point) {
        let availableStep = this.getMinimalStep(step, shell);
        if (availableStep.x === 0 && availableStep.y === 0) {
            this.gameEntity.shell.splice(this.gameEntity.shell.indexOf(shell), 1);
            let particle = new Particle(shell.x, shell.y);
            this.gameEntity.particles.push(particle);
        } else {
            shell.applyStep(availableStep);
        }
    }
    handleShoot(button: string, shootDirection: number) {
        if (this.InputHandler.isDown(button)) {
            let now = Date.now();
            if ((now - this.lastShooted) / 1000 < 1) {
                return;
            } else {
                this.lastShooted = now;
            }
            let spawnPoint = new Point(0, 0);
            let playerCenter = new Point(
                this.gameEntity.player.x + this.gameEntity.player.width / 2,
                this.gameEntity.player.y + this.gameEntity.player.height / 2
            );

            switch (this.gameEntity.player.direction) {
                case 0:
                    spawnPoint = new Point(playerCenter.x, playerCenter.y - this.gameEntity.player.height / 2);
                    break;
                case 90:
                    spawnPoint = new Point(playerCenter.x + this.gameEntity.player.width / 2, playerCenter.y);
                    break;
                case 180:
                    spawnPoint = new Point(playerCenter.x, playerCenter.y + this.gameEntity.player.height / 2);
                    break;
                case -90:
                    spawnPoint = new Point(playerCenter.x - this.gameEntity.player.width / 2, playerCenter.y);
                    break;
            }
            let shell = new Shell(spawnPoint.x, spawnPoint.y, shootDirection);
            this.gameEntity.shell.push(shell);
            return true;
        }
        return false;
    }
    handleParticle(particle: Particle, dt: number) {
        particle.changeStep(dt);
        console.log(dt);

        if (particle.animationOver) {
            this.gameEntity.particles.splice(this.gameEntity.particles.indexOf(particle), 1);
        }
    }
    getMinimalStep(step: Point, gameObject: GameObject) {
        let minimalStep = Object.assign({}, step);
        // let minimalStep = { ...step };
        while (
            this.gameEntity.obsacle.some((obsacle) => this.hasObstacleCollision(gameObject, minimalStep, obsacle)) ||
            this.hasBoundsCollision(gameObject, minimalStep, this.canvas)
        ) {
            if (minimalStep.x !== 0) {
                minimalStep.x -= Math.sign(minimalStep.x);
            } else {
                minimalStep.y -= Math.sign(minimalStep.y);
            }
        }
        return minimalStep;
    }
    hasBoundsCollision(player: GameObject, step: Point, canvas: HTMLCanvasElement) {
        return (
            player.x + step.x < 0 ||
            player.x + step.x > canvas.width - player.width ||
            player.y + step.y < 0 ||
            player.y + step.y > canvas.height - player.height
        );
    }

    hasObstacleCollision(player: GameObject, step: Point, obsacle: GameObject): boolean {
        return this.hasIntersects(player, step, obsacle);
    }

    hasIntersects = function (firstRect: GameObject, step: Point, secondRect: GameObject): boolean {
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
    };
}

export default MovementHandler;
