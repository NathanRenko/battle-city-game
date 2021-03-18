import GameObject from '../gameClasses/gameObject';
import EntitySkins from '../gameEngine/engineModules/constObjects/entitySkins';

class SteelWall extends GameObject {
    width = 16;
    height = 16;
    skin = EntitySkins.SteelWall;
}

export default SteelWall;
