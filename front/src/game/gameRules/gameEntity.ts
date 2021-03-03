import GameObject from '../gameClasses/gameObject';
import Point from '../gameClasses/Point';
import Particle from '../gameObjects/particle';
import Shell from '../gameObjects/shell';
import Tank from '../gameObjects/tank';
import SteelWall from '../gameObjects/steel-wall';

class GameEntity {
    player: Tank;
    obsacle: SteelWall[];
    shell: Shell[] = []
    particles: Particle[] = []
    constructor() {
        this.player = new Tank(121, 100);
        this.obsacle = [new SteelWall(100, 100), new SteelWall(100, 116), new SteelWall(100, 132), new SteelWall(100, 148), new SteelWall(100, 164)];
    }
}

export default GameEntity;
