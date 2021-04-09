import GameObject from '../gameClasses/gameObject';
import EntitySkins from '../gameEngine/engineModules/constObjects/entitySkins';
import { IHealth } from '../gameEngine/engineModules/interfaces/interfaces';

class House extends GameObject implements IHealth {
    stateStep = [EntitySkins.house1, EntitySkins.house2, EntitySkins.house3, EntitySkins.house4];
    size = 50;
    skin = this.stateStep[0];
    hp = 4;
    maxHp = this.hp;
    step = 0;

    constructor(x: number, y: number) {
        super(x, y);
    }

    changeStep() {
        if (this.step < 3) {
            this.step++;
            this.skin = this.stateStep[this.step];
        }
    }
}

export default House;
