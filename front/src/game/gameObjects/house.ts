import GameObject from '../gameClasses/gameObject'
import { AnimationHandler, IAnimation, IAnimationHandler } from '../gameEngine/engineModules/handlers/AnimationHandler'
import { CollisionHandler, ICollision, ICollisionHandler } from '../gameEngine/engineModules/handlers/CollisionHandler'
import { HpHandler, IHpHandler } from '../gameEngine/engineModules/handlers/HpHandler'
import MapHandler from '../gameEngine/engineModules/handlers/MapHandler'
import EntitySkins from '../gameEngine/engineModules/Utils/entitySkins'

export class House extends GameObject implements IHpHandler, ICollisionHandler, IAnimationHandler {
    animationList: string[][]
    size = 100
    hpHandler: HpHandler
    collisionHandler: CollisionHandler
    animationHandler: AnimationHandler

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
        const animations: IAnimation[] = [
            {
                condition: () => this.hpHandler.hpPercentage === 1,
                animationList: this.animationList[0]
            },
            {
                condition: () => this.hpHandler.hpPercentage >= 0.75,
                animationList: this.animationList[1]
            },
            {
                condition: () => this.hpHandler.hpPercentage >= 0.5,
                animationList: this.animationList[2]
            },
            {
                condition: () => this.hpHandler.hpPercentage >= 0.25,
                animationList: this.animationList[3]
            }
        ]
        this.skin = this.animationList[0][0]
        this.hpHandler = new HpHandler(4, () => this.deathHandler(field))
        this.collisionHandler = new CollisionHandler(this.onCollision.bind(this))
        this.animationHandler = new AnimationHandler(animations, this, { animationSpeed: 0.1, isCyclicAnimation: true })
    }

    deathHandler(field: MapHandler) {
        field.gameMap.deleteEntity(this)
    }

    onTick(dt: number) {
        this.animationHandler.changeAnimationStep(dt)
    }

    onCollision(collision: ICollision) {
        if (collision.type === 'damage') {
            this.hpHandler.decreaseHp()
        }
    }
}
