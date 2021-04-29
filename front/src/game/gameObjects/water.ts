import GameObject from '../gameClasses/gameObject';
import EntitySkins from '../gameEngine/engineModules/constObjects/entitySkins';
import Point from '../gameClasses/Point';
import { entityDirections } from '../gameEngine/engineModules/constObjects/DirectionHandler';

class Water extends GameObject {
    stateList = [EntitySkins.water1, EntitySkins.water2];
    animationStep = 0;
    size = 50;
    skin = this.stateList[0];
    timePassed = 0;
    animationOver = false;
    direction: entityDirections;

    constructor(x: number, y: number, direction: entityDirections) {
        super(x, y);
        this.direction = direction;
    }

    changeAnimationStep(dt: number) {
        this.timePassed += dt;
        if (this.timePassed > 0.1) {
            this.animationStep = 1 - this.animationStep;
            this.skin = this.stateList[this.animationStep];
            this.timePassed = 0;
        }
    }
}

export default Water;
