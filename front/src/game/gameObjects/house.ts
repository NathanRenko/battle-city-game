import GameObject from '../gameClasses/gameObject'
import EntitySkins from '../gameEngine/engineModules/constObjects/entitySkins'
import { IAnimated, IHealth } from '../gameEngine/engineModules/interfaces/interfaces'
import MapHandler from '../gameEngine/engineModules/MapHandler'

export class House extends GameObject implements IHealth, IAnimated {
    animationList: string[][]
    size = 100
    animationOver = false
    hp = 4
    stateNumber = 0
    animationStep = 0
    timePassed = 0

    constructor(x: number, y: number, chosenMap: string) {
        super(x, y)
        if (chosenMap === 'first') {
            this.animationList = [
                [EntitySkins.village_house1],
                [EntitySkins.village_house2_A, EntitySkins.village_house2_B],
                [EntitySkins.village_house3_A, EntitySkins.village_house3_B],
                [EntitySkins.village_house4_A, EntitySkins.village_house4_B],
            ]
        } else {
            this.animationList = [
                [EntitySkins.city_house1],
                [EntitySkins.city_house2_A, EntitySkins.city_house2_B],
                [EntitySkins.city_house3_A, EntitySkins.city_house3_B],
                [EntitySkins.city_house4_A, EntitySkins.city_house4_B],
            ]
        }
        this.skin = this.animationList[0][0]
    }

    changeAnimationStep(dt: number) {
        this.timePassed += dt
        if (this.timePassed > 0.1) {
            this.animationStep = 1 - this.animationStep
            this.skin = this.animationList[this.stateNumber][this.animationStep]
            this.timePassed = 0
        }
    }

    changeState() {
        if (this.stateNumber < 3) {
            this.stateNumber++
        }
    }

    deathHandler(field: MapHandler) {
        field.gameMap.deleteEntity(this)
    }

    decreaseHp(field: MapHandler) {
        if (this.hp !== 0) {
            this.hp--
            if ('stateNumber' in this) {
                this.changeState()
            }
        }

        if (this.hp === 0) {
            this.deathHandler(field)
        }
    }

    handleAnimation(field: MapHandler, dt: number) {
        if (this.stateNumber !== 0) {
            this.changeAnimationStep(dt)
        }
    }
}
