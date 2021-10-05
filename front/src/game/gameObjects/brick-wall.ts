import GameObject from '../gameClasses/gameObject'
import EntitySkins from '../gameEngine/engineModules/constObjects/entitySkins'
import { IHealth } from '../gameEngine/engineModules/interfaces/interfaces'
import MapHandler from '../gameEngine/engineModules/MapHandler'

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
