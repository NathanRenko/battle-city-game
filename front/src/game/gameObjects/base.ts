import GameObject from '../gameClasses/gameObject'
import { CollisionHandler, ICollision, ICollisionHandler } from '../gameEngine/engineModules/handlers/CollisionHandler'
import { HpHandler, IHpHandler } from '../gameEngine/engineModules/handlers/HpHandler'
import MapHandler from '../gameEngine/engineModules/handlers/MapHandler'
import { getAudio } from '../gameEngine/engineModules/Utils/audioFunctions'
import EntitySkins from '../gameEngine/engineModules/Utils/entitySkins'

export class Base extends GameObject implements IHpHandler, ICollisionHandler {
    static size = 50
    size = Base.size
    team: 0 | 1
    deathAudio: HTMLAudioElement
    hpHandler: HpHandler
    collisionHandler: CollisionHandler

    constructor(x: number, y: number, team: 0 | 1, field: MapHandler) {
        super(x, y)
        this.team = team
        if (team === 0) {
            this.skin = EntitySkins.BaseStar
        } else {
            this.skin = EntitySkins.Base
        }
        this.hpHandler = new HpHandler(5, () => this.deathHandler(field), false)
        this.collisionHandler = new CollisionHandler(this.onCollision.bind(this))
        this.deathAudio = getAudio('./assets/sounds/explosion1.mp3')
    }

    onCollision(collision: ICollision) {
        if (collision.type === 'damage') {
            this.hpHandler.decreaseHp()
        }
    }

    setDeathState() {
        if (this.team === 0) {
            this.skin = EntitySkins.BaseStarHit
        } else {
            this.skin = EntitySkins.BaseHit
        }
    }

    deathHandler(field: MapHandler) {
        this.deathAudio.play()
        this.setDeathState()
    }
}
