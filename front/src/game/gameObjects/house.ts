import GameObject from '../gameClasses/gameObject';
import EntitySkins from '../gameEngine/engineModules/constObjects/entitySkins';
import { IHealth } from '../gameEngine/engineModules/interfaces/interfaces';

class House extends GameObject implements IHealth {
    stateList = [EntitySkins.house1, EntitySkins.house2, EntitySkins.house3, EntitySkins.house4];
    size = 100;
    skin = this.stateList[0];
    hp = 4;
    stateNumber = 0;

    constructor(x: number, y: number) {
        super(x, y);
    }

    changeState() {
        if (this.stateNumber < 3) {
            this.stateNumber++;
            this.skin = this.stateList[this.stateNumber];
        }
    }
}

export default House;
