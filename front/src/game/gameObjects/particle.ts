import GameObject from '../gameClasses/gameObject'
import EntitySkins from '../gameEngine/engineModules/constObjects/entitySkins'
import { IAnimated } from '../gameEngine/engineModules/interfaces/interfaces'
import MapHandler from '../gameEngine/engineModules/MapHandler'

export class Particle extends GameObject implements IAnimated {
    animationList = [EntitySkins.hit1, EntitySkins.hit2, EntitySkins.hit3]
    animationStep = 0
    size = 50
    skin = this.animationList[0]
    timePassed = 0
    direction: string
    animationOver = false

    constructor(x: number, y: number, shootDirection: string) {
        super(x, y)
        this.direction = shootDirection
    }

    changeAnimationStep(dt: number) {
        this.timePassed += dt * 9
        if (this.timePassed > 2) {
            this.animationOver = true
        } else {
            this.animationStep = Math.round(this.timePassed)
            this.skin = this.animationList[this.animationStep]
        }
    }

    handleAnimation(field: MapHandler, dt: number) {
        this.changeAnimationStep(dt)
        if (this.animationOver) {
            field.gameMap.deleteEntity(this)
        }
    }
}
