import Figure from '../gameClasses/figure';
import Point from '../gameClasses/Point';

class GameEntity {
    player: Figure;
    obsacle: Figure;

    constructor() {
        this.player = new Figure(121, 100, 20, 20);
        this.obsacle = new Figure(100, 100, 20, 200);
    }
    applyStep(shift: Point) {
        this.player.x += shift.x;
        this.player.y += shift.y;
    }
    getPlayerPosition() {
        return this.player;
    }
}

export default GameEntity;
