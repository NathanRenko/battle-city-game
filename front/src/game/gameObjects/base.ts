import GameObject from '../gameClasses/gameObject'
import EntitySkins from '../gameEngine/engineModules/constObjects/entitySkins'
import { IHealth } from '../gameEngine/engineModules/interfaces/interfaces'
import { getAudio } from '../gameEngine/engineModules/Utils'

class Base extends GameObject implements IHealth {
    static size = 50
    size = Base.size

    hp = 5
    maxHp = this.hp
    team: 0 | 1
    deathAudio: HTMLAudioElement

    constructor(x: number, y: number, team: 0 | 1) {
        super(x, y)
        this.team = team
        if (team === 0) {
            this.skin = EntitySkins.BaseStar
        } else {
            this.skin = EntitySkins.Base
        }
        this.deathAudio = getAudio('./assets/sounds/explosion1.mp3')
    }

    setDeathState() {
        if (this.team === 0) {
            this.skin = EntitySkins.BaseStarHit
        } else {
            this.skin = EntitySkins.BaseHit
        }
    }
}

export default Base
