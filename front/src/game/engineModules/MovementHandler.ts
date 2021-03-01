import GameObject from '../gameClasses/gameObject';
import GameEntity from '../gameRules/gameEntity';
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
        const playerSpeed = 20;
        const shift = Math.round(playerSpeed * dt * 10);
        const movement = {
            ArrowDown: new Point(0, shift),
            ArrowUp: new Point(0, -shift),
            ArrowLeft: new Point(-shift, 0),
            ArrowRight: new Point(shift, 0),
        };
        for (const move in movement) {
            // @ts-ignore
            if (this.handlePressIfExist(move, movement[move])) break;
        }
    }
    handlePressIfExist(button: any, step: Point) {
        if (this.InputHandler.isDown(button)) {
            let availableStep = this.getMinimalStep(step);
            this.gameEntity.player.applyStep(availableStep);
            this.gameEntity.player.changeDirection(button);
            return true;
        }
        return false;
    }
    getMinimalStep(step: Point) {
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
        let shiftedRectangle = new GameObject(
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
