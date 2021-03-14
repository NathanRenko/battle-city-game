import GameObject from '../gameClasses/gameObject';
import EntitySkins from '../gameEngine/engineModules/entitySkins';

class Particle extends GameObject {
    animationStep = [EntitySkins.hit1, EntitySkins.hit2, EntitySkins.hit3];
    width = 32;
    height = 32;
    skin = this.animationStep[0];
    timeCreation = 0;
    animationOver = false;
    
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
