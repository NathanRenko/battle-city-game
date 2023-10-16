import GameObject from '../gameClasses/gameObject'
import { AnimationHandler, IAnimation, IAnimationHandler } from '../gameEngine/engineModules/handlers/AnimationHandler'
import { entityDirections } from '../gameEngine/engineModules/Utils/DirectionHandler'
import EntitySkins from '../gameEngine/engineModules/Utils/entitySkins'

export class Water extends GameObject implements IAnimationHandler {
    size = 50
    skin: string
    direction: entityDirections
    animationHandler: AnimationHandler

    constructor(x: number, y: number, direction: entityDirections) {
        super(x, y)
        this.direction = direction
        const animationList = [EntitySkins.water1, EntitySkins.water2]
        this.skin = animationList[0]
        const animation: IAnimation[] = [
            {
                condition: () => true,
                animationList: animationList
            }
        ]

        this.animationHandler = new AnimationHandler(animation, this, { animationSpeed: 0.1, isCyclicAnimation: true })
    }

    onTick(dt: number) {
        this.animationHandler.changeAnimationStep(dt)
    }
}
