import BrickWall from '../../../gameObjects/brick-wall'
import House from '../../../gameObjects/house'
import SteelWall from '../../../gameObjects/steel-wall'
import Tree from '../../../gameObjects/tree'

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

type obstacleType = SteelWall | BrickWall | House | Tree

function isObstacle(entity: obstacleType): entity is obstacleType {
    return (
        entity.constructor === SteelWall
        || entity.constructor === BrickWall
        || entity.constructor === House
        || entity.constructor === Tree
    )
}

export { EntityClasses, EntityGroups, isObstacle }
export type { obstacleType }
