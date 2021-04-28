import GameObject from '../gameClasses/gameObject';
import EntitySkins from '../gameEngine/engineModules/constObjects/entitySkins';

class Tree extends GameObject {
    size = 50;

    constructor(x: number, y: number, color: 'o' | 'a') {
        super(x, y);
        if (color === 'o') {
            this.skin = EntitySkins.treeOak;
        } else {
            this.skin = EntitySkins.treeApple;
        }
    }
}

export default Tree;