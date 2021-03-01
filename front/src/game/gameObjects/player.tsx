import GameObject from '../gameClasses/gameObject';
import Point from '../gameClasses/Point';

class Player extends GameObject {
    direction: string | undefined;

    applyStep(shift: Point) {
        this.x += shift.x;
        this.y += shift.y;
    }
    changeDirection(direction: string) {
        const movementDirection = {
            ArrowDown: 180,
            ArrowUp: 0,
            ArrowLeft: -90,
            ArrowRight: 90,
        };
        // @ts-ignore
        this.direction = movementDirection[direction];
    }
    getPlayerPosition() {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }
}

export default Player;
