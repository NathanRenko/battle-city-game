import GameObject from '../gameClasses/gameObject'
import MapHandler from '../gameEngine/engineModules/handlers/MapHandler'
import { IHealth } from '../gameEngine/engineModules/interfaces/interfaces'
import EntitySkins from '../gameEngine/engineModules/Utils/entitySkins'

export class BrickWall extends GameObject implements IHealth {
    size = 50
    skin = EntitySkins.BrickWall
    hp = 1
    deathHandler(field: MapHandler) {
        field.gameMap.deleteEntity(this)
    }

    decreaseHp(field: MapHandler) {
        if (this.hp !== 0) {
            this.hp--
        }

        if (this.hp === 0) {
            this.deathHandler(field)
        }
    }
}
