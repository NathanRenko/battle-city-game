import GameObject from "../gameClasses/gameObject";
import EntitySkins from "../gameEngine/engineModules/constObjects/entitySkins";

class BrickWall extends GameObject {
  width = 50;
  height = 50;
  skin = EntitySkins.BrickWall;
  hp = 1;
}

export default BrickWall;
