import Figure from '../gameClasses/figure';
import Point from '../gameClasses/Point';

class Player extends Figure {
    applyStep(shift: Point) {
        this.x += shift.x;
        this.y += shift.y;
    }
    getPlayerPosition() {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }
}

export default Player;
