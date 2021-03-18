import GameObject from '../gameClasses/gameObject';
import Point from '../gameClasses/Point';
import {entityDirections} from '../gameEngine/engineModules/constObjects/DirectionHandler';
import EntitySkins from '../gameEngine/engineModules/constObjects/entitySkins';

class Tank extends GameObject {
    direction: string = entityDirections.Up;
    width = 32;
    height = 32;
    skin = EntitySkins.Tank;
    hp = 2;
    applyStep(shift: Point) {
        this.x += shift.x;
        this.y += shift.y;
    }
    changeDirection(direction: string) {
        this.direction = direction;
    }
    getPlayerPosition() {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }
}

export default Tank;
