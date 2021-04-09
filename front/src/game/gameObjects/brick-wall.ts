import GameObject from "../gameClasses/gameObject";
import EntitySkins from "../gameEngine/engineModules/constObjects/entitySkins";
import { IHealth } from "../gameEngine/engineModules/interfaces/interfaces";

class BrickWall extends GameObject implements IHealth {
  size = 50;
  skin = EntitySkins.BrickWall;
  hp = 1;
}

export default BrickWall;
