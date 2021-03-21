import GameObject from '../gameClasses/gameObject';
import EntitySkins from '../gameEngine/engineModules/constObjects/entitySkins';
import Point from '../gameClasses/Point';

class Particle extends GameObject {
    animationStep = [EntitySkins.hit1, EntitySkins.hit2, EntitySkins.hit3];
    size = 50;
    skin = this.animationStep[0];
    timeCreation = 0;
    direction: string;
    animationOver = false;

    constructor(x: number, y: number, shootDirection: string) {
        super(x, y);
        this.direction = shootDirection;
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

export default Particle;
