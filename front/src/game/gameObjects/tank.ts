import { Particle } from './particle'
import { TankShell } from './tankShell'
import GameObject from '../gameClasses/gameObject'
import Point from '../gameClasses/Point'
import { CollisionHandler, ICollision, ICollisionHandler } from '../gameEngine/engineModules/handlers/CollisionHandler'
import { HpHandler, IHpHandler } from '../gameEngine/engineModules/handlers/HpHandler'
import MapHandler from '../gameEngine/engineModules/handlers/MapHandler'
import { IDirection, IRespawnable } from '../gameEngine/engineModules/interfaces/interfaces'
import { getAudio } from '../gameEngine/engineModules/Utils/audioFunctions'
import { entityDirections } from '../gameEngine/engineModules/Utils/DirectionHandler'
import EntitySkins from '../gameEngine/engineModules/Utils/entitySkins'
import { KnownSections } from '../gameEngine/engineModules/Utils/GameObjectsConfiguration'

export class Tank extends GameObject implements IHpHandler, IDirection, IRespawnable, ICollisionHandler {
    direction: entityDirections = entityDirections.Up
    size = 35

    respawnCount = 2
    lastShooted: number = 0
    spawnPoint: Point
    team: 0 | 1
    shootAudio: HTMLAudioElement
    deathAudio: HTMLAudioElement
    hpHandler: HpHandler
    collisionHandler: CollisionHandler

    constructor(x: number, y: number, team: 0 | 1, field: MapHandler) {
        super(x, y)
        this.spawnPoint = new Point(x, y)
        this.team = team
        if (team === 0) {
            this.skin = EntitySkins.TankFirst
        } else {
            this.skin = EntitySkins.TankSecond
        }
        this.hpHandler = new HpHandler(2, () => this.deathHandler(field), false)
        this.collisionHandler = new CollisionHandler(this.onCollision.bind(this))
        this.shootAudio = getAudio('./assets/sounds/shoot1.wav')
        this.deathAudio = getAudio('./assets/sounds/explosion3.wav')
    }

    onTick() {

    }

    onCollision(collision: ICollision) {
        if (collision.type === 'damage') {
            this.hpHandler.decreaseHp()
        }
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
        const particle = new Particle(this.x, this.y, this.direction, field)
        field.gameMap.addEntity(KnownSections.particles, particle)
        this.respawnEntity(field)
    }

    respawnEntity(field: MapHandler) {
        if (this.respawnCount > 0) {
            this.x = this.spawnPoint.x
            this.y = this.spawnPoint.y
            this.hpHandler.hp = this.hpHandler.maxHp
            this.respawnCount--
        } else {
            field.gameMap.deleteEntity(this)
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

// class ShootHandler {
//     lastShooted: number
//     shootAudio: HTMLAudioElement
//
//     constructor(shootAudio: HTMLAudioElement) {
//         this.shootAudio = getAudio('./assets/sounds/shoot1.wav')
//         this.lastShooted = 0
//     }
//
//     private canShoot() {
//         const now = Date.now()
//         if ((now - this.lastShooted) / 1000 < 1) {
//             return false
//         } else {
//             this.lastShooted = now
//             return true
//         }
//     }
//
//     private makeShoot(field: MapHandler, tank: Tank) {
//         this.shootAudio.play()
//         let spawnPoint = new Point(0, 0)
//         const shellSize = 8
//         const sizeDelta = tank.size - shellSize
//         switch (tank.direction) {
//         case entityDirections.Up:
//             spawnPoint = new Point(tank.x + sizeDelta / 2, tank.y - shellSize)
//             break
//         case entityDirections.Right:
//             spawnPoint = new Point(tank.x + tank.size, tank.y + sizeDelta / 2)
//             break
//         case entityDirections.Down:
//             spawnPoint = new Point(tank.x + sizeDelta / 2, tank.y + tank.size)
//             break
//         case entityDirections.Left:
//             spawnPoint = new Point(tank.x - shellSize, tank.y + sizeDelta / 2)
//             break
//         }
//         const shell = new TankShell(spawnPoint.x, spawnPoint.y, tank.direction, tank.team)
//         field.gameMap.addEntity(KnownSections.tankShell, shell)
//     }
//
//     tryToShoot(field: MapHandler, tank: Tank) {
//         if (this.canShoot()) {
//             this.makeShoot(field, tank)
//         }
//     }
// }

// class RespawnHandler {
//     respawnCount: number
//
//     constructor(respawnCount: number) {
//         this.respawnCount = respawnCount
//     }
//
//     respawnEntity(field: MapHandler, entity: HpHandler & GameObject) {
//         if (this.respawnCount > 0) {
//             this.respawnCount--
//             this.onRespawn()
//         } else {
//             this.onRespawnsEnd()
//         }
//     }
//
//     onRespawn() {
//         entity.x = entity.spawnPoint.x
//         entity.y = entity.spawnPoint.y
//         entity.hp = entity.maxHp
//     }
//
//     onRespawnsEnd() {
//         field.gameMap.deleteEntity(this)
//     }
// }
