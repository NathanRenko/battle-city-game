import GameObject from '../gameClasses/gameObject';
import EntitySkins from '../gameEngine/engineModules/constObjects/entitySkins';

class BrickWall extends GameObject {
    width = 8;
    height = 8;
    skin = EntitySkins.BrickWall;
    hp = 1;
}

export default BrickWall;
