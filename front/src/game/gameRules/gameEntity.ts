import GameObject from '../gameClasses/gameObject';
import Point from '../gameClasses/Point';
import Player from '../gameObjects/player';

class GameEntity {
    player: Player;
    obsacle: GameObject;

    constructor() {
        this.player = new Player(121, 100, 20, 20);
        this.obsacle = new GameObject(100, 100, 20, 200);
    }
}

export default GameEntity;
