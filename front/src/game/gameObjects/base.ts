import GameObject from "../gameClasses/gameObject";
import EntitySkins from "../gameEngine/engineModules/constObjects/entitySkins";

class Base extends GameObject {
  size = 50;
  skin = EntitySkins.Base;
  hp = 5;
  team: 0 | 1;

  constructor(x: number, y: number, team: 0 | 1) {
    super(x, y);
    this.team = team;
  }

  setDeathState() {
    this.skin = EntitySkins.BaseHit;
  }
}

export default Base;
