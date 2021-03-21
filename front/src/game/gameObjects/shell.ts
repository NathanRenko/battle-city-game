import GameObject from "../gameClasses/gameObject";
import Point from "../gameClasses/Point";
import EntitySkins from "../gameEngine/engineModules/constObjects/entitySkins";

class Shell extends GameObject {
  size = 6;
  direction: string;
  skin = EntitySkins.Shell;
  constructor(x: number, y: number, shootDirection: string) {
    super(x, y);
    this.direction = shootDirection;
  }
  applyStep(shift: Point) {
    this.x += shift.x;
    this.y += shift.y;
  }
  changeDirection(direction: string) {
    this.direction = direction;
  }
  getPlayerPosition() {
    return { x: this.x, y: this.y, width: this.size, height: this.size };
  }
}

export default Shell;
