import GameObject from '../gameClasses/gameObject'
import MapHandler from '../gameEngine/engineModules/handlers/MapHandler'
import { IAnimated } from '../gameEngine/engineModules/interfaces/interfaces'
import { entityDirections } from '../gameEngine/engineModules/Utils/DirectionHandler'
import EntitySkins from '../gameEngine/engineModules/Utils/entitySkins'

export class Water extends GameObject implements IAnimated {
    animationList = [EntitySkins.water1, EntitySkins.water2]
    animationStep = 0
    size = 50
    skin = this.animationList[0]
    timePassed = 0
    animationOver = false
    direction: entityDirections

    constructor(x: number, y: number, direction: entityDirections) {
        super(x, y)
        this.direction = direction
    }

    changeAnimationStep(dt: number) {
        this.timePassed += dt
        if (this.timePassed > 0.1) {
            this.animationStep = 1 - this.animationStep
            this.skin = this.animationList[this.animationStep]
            this.timePassed = 0
        }
    }

    handleAnimation(field: MapHandler, dt: number) {
        this.changeAnimationStep(dt)
    }
}
