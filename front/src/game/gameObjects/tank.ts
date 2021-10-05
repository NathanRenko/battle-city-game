import GameObject from '../gameClasses/gameObject'
import Point from '../gameClasses/Point'
import MapHandler from '../gameEngine/engineModules/handlers/MapHandler'
import { IDirection, IHealth, IRespawnable } from '../gameEngine/engineModules/interfaces/interfaces'
import { getAudio } from '../gameEngine/engineModules/Utils/audioFunctions'
import { entityDirections } from '../gameEngine/engineModules/Utils/DirectionHandler'
import EntitySkins from '../gameEngine/engineModules/Utils/entitySkins'
import { KnownSections } from '../gameEngine/engineModules/Utils/GameObjectsConfiguration'
import { Particle } from './particle'
import { TankShell } from './tankShell'

export class Tank extends GameObject implements IHealth, IDirection, IRespawnable {
    direction: entityDirections = entityDirections.Up
    size = 35

    respawnCount = 2
    hp = 2
    maxHp = this.hp
    lastShooted: number = 0
    spawnPoint: Point
    team: 0 | 1
    shootAudio: HTMLAudioElement
    deathAudio: HTMLAudioElement

    constructor(x: number, y: number, team: 0 | 1) {
        super(x, y)
        this.spawnPoint = new Point(x, y)
        this.team = team
        if (team === 0) {
            this.skin = EntitySkins.TankFirst
        } else {
            this.skin = EntitySkins.TankSecond
        }

        this.shootAudio = getAudio('./assets/sounds/shoot1.wav')
        this.deathAudio = getAudio('./assets/sounds/explosion3.wav')
    }

    handleTankMovements(field: MapHandler, direction: entityDirections, step: Point) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
        const [availableStep, collisionBlock] = field.getMinimalStep(step, this)
        if (!(availableStep.x === 0 && availableStep.y === 0)) {
            this.applyStep(availableStep)
        }
        this.changeDirection(direction)
    }

    applyStep(shift: Point) {
        this.x += shift.x
        this.y += shift.y
    }

    changeDirection(direction: entityDirections) {
        this.direction = direction
    }

    deathHandler(field: MapHandler) {
        this.deathAudio.play()
        const particle = new Particle(this.x, this.y, this.direction)
        field.gameMap.addEntity(KnownSections.particles, particle)
        this.respawnEntity(field)
    }

    respawnEntity(field: MapHandler) {
        if (this.respawnCount > 0) {
            this.x = this.spawnPoint.x
            this.y = this.spawnPoint.y
            this.hp = this.maxHp
            this.respawnCount--
        } else {
            field.gameMap.deleteEntity(this)
        }
    }

    decreaseHp(field: MapHandler) {
        if (this.hp !== 0) {
            this.hp--
        }

        if (this.hp === 0) {
            this.deathHandler(field)
        }
    }

    getPlayerPosition() {
        return { x: this.x, y: this.y, width: this.size, height: this.size }
    }

    makeShoot(field: MapHandler) {
        this.shootAudio.play()
        let spawnPoint = new Point(0, 0)
        const shellSize = 8
        const sizeDelta = this.size - shellSize
        switch (this.direction) {
        case entityDirections.Up:
            spawnPoint = new Point(this.x + sizeDelta / 2, this.y - shellSize)
            break
        case entityDirections.Right:
            spawnPoint = new Point(this.x + this.size, this.y + sizeDelta / 2)
            break
        case entityDirections.Down:
            spawnPoint = new Point(this.x + sizeDelta / 2, this.y + this.size)
            break
        case entityDirections.Left:
            spawnPoint = new Point(this.x - shellSize, this.y + sizeDelta / 2)
            break
        }
        const shell = new TankShell(spawnPoint.x, spawnPoint.y, this.direction, this.team)
        field.gameMap.addEntity(KnownSections.tankShell, shell)
    }

    canShoot() {
        const now = Date.now()
        if ((now - this.lastShooted) / 1000 < 1) {
            return false
        } else {
            this.lastShooted = now
            return true
        }
    }
}
