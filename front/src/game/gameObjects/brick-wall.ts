import GameObject from '../gameClasses/gameObject'
import { CollisionHandler, ICollision, ICollisionHandler } from '../gameEngine/engineModules/handlers/CollisionHandler'
import { HpHandler, IHpHandler } from '../gameEngine/engineModules/handlers/HpHandler'
import MapHandler from '../gameEngine/engineModules/handlers/MapHandler'
import EntitySkins from '../gameEngine/engineModules/Utils/entitySkins'

export class BrickWall extends GameObject implements IHpHandler, ICollisionHandler {
    size = 50
    skin = EntitySkins.BrickWall
    hpHandler: HpHandler
    collisionHandler: CollisionHandler

    constructor(x: number, y: number, field: MapHandler) {
        super(x, y)
        this.hpHandler = new HpHandler(1, () => this.deathHandler(field))
        this.collisionHandler = new CollisionHandler(this.onCollision.bind(this))
    }

    deathHandler(field: MapHandler) {
        field.gameMap.deleteEntity(this)
    }

    onCollision(collision: ICollision) {
        if (collision.type === 'damage') {
            this.hpHandler?.decreaseHp()
        }
    }
}
