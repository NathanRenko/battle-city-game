import { Base } from './base'
import { Particle } from './particle'
import { Tank } from './tank'
import GameObject from '../gameClasses/gameObject'
import Point from '../gameClasses/Point'
import { haveCollisionHandler } from '../gameEngine/engineModules/handlers/CollisionHandler'
import MapHandler from '../gameEngine/engineModules/handlers/MapHandler'
import { IDirection } from '../gameEngine/engineModules/interfaces/interfaces'
import { entityDirections } from '../gameEngine/engineModules/Utils/DirectionHandler'
import EntitySkins from '../gameEngine/engineModules/Utils/entitySkins'
import { KnownSections, obstacleType } from '../gameEngine/engineModules/Utils/GameObjectsConfiguration'

export class TankShell extends GameObject implements IDirection {
    size = 6
    direction: entityDirections
    skin = EntitySkins.TankShell
    team: 0 | 1

    constructor(x: number, y: number, shootDirection: entityDirections, team: 0 | 1) {
        super(x, y)
        this.direction = shootDirection
        this.team = team
    }

    applyStep(shift: Point) {
        this.x += shift.x
        this.y += shift.y
    }

    changeDirection(direction: entityDirections) {
        this.direction = direction
    }

    getPlayerPosition() {
        return { x: this.x, y: this.y, width: this.size, height: this.size }
    }

    handleShellMovements(field: MapHandler, step: Point) {
        const [availableStep, collisionBlock] = field.getMinimalStep(step, this)
        if (availableStep.x === 0 && availableStep.y === 0) {
            this.handleShellCollision(collisionBlock, field)
        } else {
            this.applyStep(step)
        }
    }

    handleShellCollision(collisionBlock: Tank | obstacleType | Base | undefined, field: MapHandler) {
        this.shellToParticle(field)
        if (collisionBlock) {
            if ('team' in collisionBlock) {
                if (collisionBlock.team === this.team) {
                    return
                }
            }

            if (haveCollisionHandler(collisionBlock)) {
                collisionBlock.collisionHandler.onCollision({ type: 'damage' })
            }
        }
    }

    shellToParticle(field: MapHandler) {
        field.gameMap.deleteEntity(this)
        let spawnPoint = new Point(0, 0)
        const particleWidth = new Particle(spawnPoint.x, spawnPoint.y, this.direction, field).size
        const sizeDelta = particleWidth - this.size
        switch (this.direction) {
        case entityDirections.Up:
            spawnPoint = new Point(this.x - sizeDelta / 2, this.y)
            break
        case entityDirections.Right:
            spawnPoint = new Point(this.x - sizeDelta, this.y - sizeDelta / 2)
            break
        case entityDirections.Down:
            spawnPoint = new Point(this.x - sizeDelta / 2, this.y - sizeDelta)
            break
        case entityDirections.Left:
            spawnPoint = new Point(this.x, this.y - sizeDelta / 2)
            break
        default:
            throw new Error()
        }
        const particle = new Particle(spawnPoint.x, spawnPoint.y, this.direction, field)
        field.gameMap.addEntity(KnownSections.particles, particle)
    }
}
