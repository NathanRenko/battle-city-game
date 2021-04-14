import Base from '../../../gameObjects/base';
import BrickWall from '../../../gameObjects/brick-wall';
import House from '../../../gameObjects/house';
import Particle from '../../../gameObjects/particle';
import Shell from '../../../gameObjects/shell';
import SteelWall from '../../../gameObjects/steel-wall';
import Tank from '../../../gameObjects/tank';
import Water from '../../../gameObjects/water';

enum EntityClasses {
    Base,
    BrickWall,
    SteelWall,
    Tank,
    Shell,
    Particle,
    House,
    Water,
}

enum EntityGroups {
    tanks,
    obstacle,
    shell,
    base,
    particles,
}

type obstacleType = SteelWall | BrickWall | House;

function isObstacle(entity: obstacleType): entity is obstacleType {
    return entity.constructor === SteelWall || entity.constructor === BrickWall || entity.constructor === House;
}

export { EntityClasses, EntityGroups, isObstacle };
export type { obstacleType };
