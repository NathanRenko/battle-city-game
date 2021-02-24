import Figure from '../gameClasses/figure';
import GameEntity from './gameEntity';
import Point from '../gameClasses/Point';
import InputHandler from './inputHandler';

class MovementHandler {
    gameEntity: GameEntity;
    canvas: HTMLCanvasElement;
    InputHandler: InputHandler;

    constructor(gameEntity: GameEntity, canvas: HTMLCanvasElement) {
        this.gameEntity = gameEntity;
        this.canvas = canvas;
        this.InputHandler = new InputHandler();
    }
    keyPressEngine(dt: number) {
        // console.log(this.info);

        let playerSpeed = 2;
        let shift = Math.round(playerSpeed * dt * 100);

        if (this.InputHandler.isDown('ArrowDown')) {
            let step = new Point(0, shift);
            let availableStep = this.getMinimalStep(step);
            this.gameEntity.applyStep(availableStep);
            // return;
        }

        if (this.InputHandler.isDown('ArrowUp')) {
            let step = new Point(0, -shift);
            let availableStep = this.getMinimalStep(step);
            this.gameEntity.applyStep(availableStep);
            // return;
        }

        if (this.InputHandler.isDown('ArrowLeft')) {
            let step = new Point(-shift, 0);
            let availableStep = this.getMinimalStep(step);
            this.gameEntity.applyStep(availableStep);
            // return;
        }

        if (this.InputHandler.isDown('ArrowRight')) {
            let step = new Point(shift, 0);
            let availableStep = this.getMinimalStep(step);
            this.gameEntity.applyStep(availableStep);
            // return;
        }

        // this.checkPlayerBounds(this.gameEntity.player, this.gameEntity.globalShift, this.canvas);
        // this.checkPlayerObs(this.gameEntity.player, this.gameEntity.globalShift, this.gameEntity.obsacle);
    }
    getMinimalStep(step: Point) {
        if (
            !this.hasObstacleCollision(this.gameEntity.player, step, this.gameEntity.obsacle) &&
            !this.hasBoundsCollision(this.gameEntity.player, step, this.canvas)
        ) {
            return step;
        } else {
            while (
                this.hasObstacleCollision(this.gameEntity.player, step, this.gameEntity.obsacle) ||
                this.hasBoundsCollision(this.gameEntity.player, step, this.canvas)
            ) {
                if (step.x !== 0) {
                    step.x -= Math.sign(step.x);
                } else {
                    step.y -= Math.sign(step.y);
                }
            }
            return step;
        }
    }
    hasBoundsCollision(player: Figure, globalShift: Point, canvas: HTMLCanvasElement) {
        return (
            player.x + globalShift.x < 0 ||
            player.x + globalShift.x > canvas.width - player.width ||
            player.y + globalShift.y < 0 ||
            player.y + globalShift.y > canvas.height - player.height
        );
    }

    hasObstacleCollision(player: Figure, globalShift: Point, obsacle: Figure): boolean {
        return !this.intersects(player, globalShift, obsacle);
    }

    intersects = function (firstRect: Figure, globalShift: Point, secondRect: Figure) {
        let a = new Figure(firstRect.x + globalShift.x, firstRect.y + globalShift.y, firstRect.width, firstRect.height);
        return (
            a.y > secondRect.getY1() || a.getY1() < secondRect.y || a.getX1() < secondRect.x || a.x > secondRect.getX1()
        );
    };
}

export default MovementHandler;
