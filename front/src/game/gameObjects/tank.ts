import GameObject from '../gameClasses/gameObject';
import Point from '../gameClasses/Point';
import { entityDirections } from '../gameEngine/engineModules/constObjects/DirectionHandler';
import EntitySkins from '../gameEngine/engineModules/constObjects/entitySkins';
import { IDirection, IHealth } from '../gameEngine/engineModules/interfaces/interfaces';

class Tank extends GameObject implements IHealth, IDirection {
    direction: entityDirections = entityDirections.Up;
    size = 40;
    skin = EntitySkins.Tank;
    respawnCount = 2;
    hp = 2;
    maxHp = this.hp;
    lastShooted: number = 0;
    spawnPoint: Point;

    constructor(x: number, y: number) {
        super(x, y);
        this.spawnPoint = new Point(x, y);
    }

    applyStep(shift: Point) {
        this.x += shift.x;
        this.y += shift.y;
    }

    changeDirection(direction: entityDirections) {
        this.direction = direction;
    }

    getPlayerPosition() {
        return { x: this.x, y: this.y, width: this.size, height: this.size };
    }
}

export default Tank;
