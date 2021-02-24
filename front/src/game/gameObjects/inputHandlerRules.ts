import Figure from '../gameClasses/figure';
import GameEntity from './gameEntity';
import Point from '../gameClasses/Point';

class InputHandlerRules {
    gameEntity: GameEntity;
    canvas: HTMLCanvasElement;

    constructor(gameEntity: GameEntity, canvas: HTMLCanvasElement) {
        this.gameEntity = gameEntity;
        this.canvas = canvas;
    }
    keyPressEngine(keyEvent: any) {
        let key = keyEvent.key;
        this.gameEntity.globalShift = new Point(0, 0);
        let shift = 1;
        switch (key) {
            case 'ArrowUp':
                this.gameEntity.globalShift.y -= shift;
                break;
            case 'ArrowDown':
                this.gameEntity.globalShift.y += shift;
                break;
            case 'ArrowLeft':
                this.gameEntity.globalShift.x -= shift;
                break;
            case 'ArrowRight':
                this.gameEntity.globalShift.x += shift;
                break;
            default:
                break;
        }
        this.checkPlayerBounds(this.gameEntity.player, this.gameEntity.globalShift, this.canvas);
        this.checkPlayerObs(this.gameEntity.player, this.gameEntity.globalShift, this.gameEntity.obsacle);
    }

    checkPlayerBounds(player: Figure, globalShift: Point, canvas: HTMLCanvasElement) {
        if (player.x + globalShift.x < 0) {
            globalShift.x = 0;
        } else if (player.x + globalShift.x > canvas.width - player.width) {
            globalShift.x = 0;
        }

        if (player.y + globalShift.y < 0) {
            globalShift.y = 0;
        } else if (player.y + globalShift.y > canvas.height - player.height) {
            globalShift.y = 0;
        }
    }

    checkPlayerObs(player: Figure, globalShift: Point, obsacle: Figure) {
        if (!this.intersects(player, globalShift, obsacle)) {
            globalShift.x = 0;
            globalShift.y = 0;
        }
    }

    intersects = function (firstRect: Figure, globalShift: Point, secondRect: Figure) {
        let a = new Figure(firstRect.x + globalShift.x, firstRect.y + globalShift.y, firstRect.width, firstRect.height);
        return (
            a.y > secondRect.getY1() || a.getY1() < secondRect.y || a.getX1() < secondRect.x || a.x > secondRect.getX1()
        );
    };
}

export default InputHandlerRules;
