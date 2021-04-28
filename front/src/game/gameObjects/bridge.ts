import GameObject from '../gameClasses/gameObject';
import EntitySkins from '../gameEngine/engineModules/constObjects/entitySkins';

class Bridge extends GameObject {
    size = 50;

    constructor(x: number, y: number, color: 'l' | 'u') {
        super(x, y);
        if (color === 'l') {
            this.skin = EntitySkins.bridgeLeft;
        } else {
            this.skin = EntitySkins.bridgeUp;
        }
    }
}

export default Bridge;