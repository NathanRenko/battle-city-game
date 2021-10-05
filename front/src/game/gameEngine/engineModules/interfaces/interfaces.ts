import { entityDirections } from '../constObjects/DirectionHandler'
import MapHandler from '../MapHandler'

export abstract class IHealth {
    abstract hp: number
    abstract deathHandler(field: MapHandler): unknown
    abstract decreaseHp(field: MapHandler): unknown
}

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
