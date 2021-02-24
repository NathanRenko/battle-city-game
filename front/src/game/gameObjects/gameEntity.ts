import Figure from '../gameClasses/figure';
import Point from '../gameClasses/Point';

class GameEntity {
    player: Figure;
    obsacle: Figure;
    globalShift: Point;

    constructor() {
        this.player = new Figure(120, 100, 20, 20);
        this.obsacle = new Figure(100, 100, 20, 200);
        this.globalShift = new Point(0, 0);
    }
    applyStep() {
        this.player.x += this.globalShift.x;
        this.player.y += this.globalShift.y;
        this.globalShift = new Point(0, 0);
    }
    getPlayerPosition() {
        return this.player;
    }
}

export default GameEntity;
