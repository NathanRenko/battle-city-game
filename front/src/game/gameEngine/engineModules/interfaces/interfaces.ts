import MapHandler from '../handlers/MapHandler'
import { entityDirections } from '../Utils/DirectionHandler'

export abstract class IRespawnable {
    abstract respawnCount: number
    abstract respawnEntity(field: MapHandler): unknown
}

export abstract class IAnimated {
    abstract animationStep: number
    abstract animationList: string[] | string[][]
    abstract timePassed: number
    abstract animationOver: boolean
    abstract changeAnimationStep(dt: number): unknown
    abstract handleAnimation(field: MapHandler, dt: number): unknown
}

export abstract class IDirection {
    abstract direction: entityDirections
}

export abstract class IObstacle {

}
