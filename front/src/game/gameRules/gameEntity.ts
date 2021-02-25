import Figure from '../gameClasses/figure';
import Point from '../gameClasses/Point';
import Player from '../gameObjects/player';

class GameEntity {
    player: Player;
    obsacle: Figure;

    constructor() {
        this.player = new Player(121, 100, 20, 20);
        this.obsacle = new Figure(100, 100, 20, 200);
    }
}

export default GameEntity;
