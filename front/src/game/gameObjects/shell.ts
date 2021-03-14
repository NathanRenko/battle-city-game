import GameObject from '../gameClasses/gameObject';
import Point from '../gameClasses/Point';
import EntitySkins from '../gameEngine/engineModules/entitySkins';

class Shell extends GameObject {
    width = 8;
    height = 8;
    direction: number;
    skin = EntitySkins.Shell;
    constructor(x: number, y: number, shootDirection: number) {
        super(x, y);
        this.direction = shootDirection;
    }
    applyStep(shift: Point) {
        this.x += shift.x;
        this.y += shift.y;
    }
    changeDirection(direction: string) {
        const movementDirection: { [index: string]: number } = {
            ArrowDown: 180,
            ArrowUp: 0,
            ArrowLeft: -90,
            ArrowRight: 90,
        };

        this.direction = movementDirection[direction];
    }
    getPlayerPosition() {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }
}

export default Shell;
