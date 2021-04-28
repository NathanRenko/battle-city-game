import GameObject from '../gameClasses/gameObject';
import EntitySkins from '../gameEngine/engineModules/constObjects/entitySkins';
import { IHealth } from '../gameEngine/engineModules/interfaces/interfaces';

class House extends GameObject implements IHealth {
    stateList: string[][];
    animationList = [];
    size = 100;

    hp = 4;
    stateNumber = 0;
    animationStep = 0;
    past = 0;

    constructor(x: number, y: number, chosenMap: string) {
        super(x, y);
        if (chosenMap === 'first') {
            this.stateList = [
                [EntitySkins.village_house1],
                [EntitySkins.village_house2_A, EntitySkins.village_house2_B],
                [EntitySkins.village_house3_A, EntitySkins.village_house3_B],
                [EntitySkins.village_house4_A, EntitySkins.village_house4_B],
            ];
        } else {
            this.stateList = [
                [EntitySkins.city_house1],
                [EntitySkins.city_house2_A, EntitySkins.city_house2_B],
                [EntitySkins.city_house3_A, EntitySkins.city_house3_B],
                [EntitySkins.city_house4_A, EntitySkins.city_house4_B],
            ];
        }
        this.skin = this.stateList[0][0];
    }

    changeAnimationStep(dt: number) {
        this.past += dt;
        console.log(dt);
        if (this.past > 0.1) {
            this.animationStep = 1 - this.animationStep;
            this.skin = this.stateList[this.stateNumber][this.animationStep];
            this.past = 0;
        }
    }

    changeState() {
        if (this.stateNumber < 3) {
            this.stateNumber++;
        }
    }
}

export default House;
