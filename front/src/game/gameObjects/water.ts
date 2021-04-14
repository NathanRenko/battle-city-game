import GameObject from '../gameClasses/gameObject';
import EntitySkins from '../gameEngine/engineModules/constObjects/entitySkins';
import Point from '../gameClasses/Point';
import { entityDirections } from '../gameEngine/engineModules/constObjects/DirectionHandler';

class Water extends GameObject {
    animationStep = [EntitySkins.water, EntitySkins.water, EntitySkins.water];
    size = 50;
    skin = this.animationStep[0];
    timeCreation = 0;
    animationOver = false;

    constructor(x: number, y: number) {
        super(x, y);
    }

    changeStep(dt: number) {
        this.timeCreation += dt * 9;
        if (this.timeCreation > 2) {
            this.animationOver = true;
        } else {
            this.skin = this.animationStep[Math.round(this.timeCreation)];
        }
    }
}

export default Water;