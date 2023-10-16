import GameObject from '../gameClasses/gameObject'
import { AnimationHandler, IAnimation, IAnimationHandler } from '../gameEngine/engineModules/handlers/AnimationHandler'
import MapHandler from '../gameEngine/engineModules/handlers/MapHandler'
import EntitySkins from '../gameEngine/engineModules/Utils/entitySkins'

export class Particle extends GameObject implements IAnimationHandler {
    size = 50
    direction: string
    animationHandler: AnimationHandler

    constructor(x: number, y: number, shootDirection: string, field: MapHandler) {
        super(x, y)
        this.direction = shootDirection
        const animationList = [EntitySkins.hit1, EntitySkins.hit2, EntitySkins.hit3]
        this.skin = animationList[0]
        const animation: IAnimation[] = [
            {
                condition: () => true,
                animationList: animationList
            }
        ]
        this.animationHandler = new AnimationHandler(
            animation,
            this,
            { animationSpeed: 0.07, isCyclicAnimation: false, onAnimationEnd: () => this.onAnimationEnd(field) }
        )
    }

    onAnimationEnd(field: MapHandler) {
        field.gameMap.deleteEntity(this)
    }

    onTick(dt: number) {
        this.animationHandler.changeAnimationStep(dt)
    }
}
