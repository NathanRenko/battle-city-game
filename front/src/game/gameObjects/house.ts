import GameObject from '../gameClasses/gameObject'
import { CollisionHandler, ICollision, ICollisionHandler } from '../gameEngine/engineModules/handlers/CollisionHandler'
import { HpHandler, IHpHandler } from '../gameEngine/engineModules/handlers/HpHandler'
import MapHandler from '../gameEngine/engineModules/handlers/MapHandler'
import { IAnimated } from '../gameEngine/engineModules/interfaces/interfaces'
import EntitySkins from '../gameEngine/engineModules/Utils/entitySkins'

export class House extends GameObject implements IHpHandler, IAnimated, ICollisionHandler {
    animationList: string[][]
    size = 100
    animationOver = false
    animationStep = 0
    timePassed = 0
    hpHandler: HpHandler
    collisionHandler: CollisionHandler

    constructor(x: number, y: number, chosenMap: string, field: MapHandler) {
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
        this.hpHandler = new HpHandler(4, () => this.deathHandler(field))
        this.collisionHandler = new CollisionHandler(this.onCollision.bind(this))
    }

    changeAnimationStep(dt: number) {
        this.timePassed += dt
        if (this.timePassed > 0.1) {
            // TODO fractional index
            const animationStateNumber = this.animationList.length * (1 - this.hpHandler.hpPercentage)
            if (this.animationList[animationStateNumber].length < 2) {
                return
            }
            this.animationStep = 1 - this.animationStep
            this.skin = this.animationList[animationStateNumber][this.animationStep]
            this.timePassed = 0
        }
    }

    deathHandler(field: MapHandler) {
        field.gameMap.deleteEntity(this)
    }

    handleAnimation(field: MapHandler, dt: number) {
        // TODO
        // if (this.stateNumber !== 0) {
        //     this.changeAnimationStep(dt)
        // }
        this.changeAnimationStep(dt)
    }

    onCollision(collision: ICollision) {
        if (collision.type === 'damage') {
            this.hpHandler.decreaseHp()
        }
    }
}
