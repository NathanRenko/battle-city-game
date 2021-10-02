import Point from '../../gameClasses/Point'
import House from '../../gameObjects/house'
import Particle from '../../gameObjects/particle'
import Shell from '../../gameObjects/shell'
import Tank from '../../gameObjects/tank'
import CollisionHandler from './collisionHandler'
import { entityDirections } from './constObjects/DirectionHandler'
import Field from './Field'

class EntityHandlers {
    field: Field
    collisionHandler: CollisionHandler

    constructor(field: Field) {
        this.field = field
        this.collisionHandler = new CollisionHandler()
    }

    handleParticle(particle: Particle, dt: number) {
        particle.changeStep(dt)
        if (particle.animationOver) {
            this.field.mapObjects.particles.splice(this.field.mapObjects.particles.indexOf(particle), 1)
        }
    }

    handleTankMovements(tank: Tank, direction: entityDirections, step: Point) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [availableStep, collisionBlock] = this.field.getMinimalStep(step, tank)
        if (!(availableStep.x === 0 && availableStep.y === 0)) {
            tank.applyStep(availableStep)
        }
        tank.changeDirection(direction)
    }

    handleShellMovements(shell: Shell, step: Point) {
        const [availableStep, collisionBlock] = this.field.getMinimalStep(step, shell)
        if (availableStep.x === 0 && availableStep.y === 0) {
            this.collisionHandler.handleShellCollision(collisionBlock, shell, this.field)
        } else {
            shell.applyStep(step)
        }
    }

    handleHouseFireAnimation(house: House, dt: number) {
        house.changeAnimationStep(dt)
    }

    canShoot(tank: Tank) {
        const now = Date.now()
        if ((now - tank.lastShooted) / 1000 < 1) {
            return false
        } else {
            tank.lastShooted = now
            return true
        }
    }

    makeShoot(shootPlayer: Tank) {
        shootPlayer.shootAudio.play()
        let spawnPoint = new Point(0, 0)
        const shellSize = 8
        const sizeDelta = shootPlayer.size - shellSize
        switch (shootPlayer.direction) {
        case entityDirections.Up:
            spawnPoint = new Point(shootPlayer.x + sizeDelta / 2, shootPlayer.y - shellSize)
            break
        case entityDirections.Right:
            spawnPoint = new Point(shootPlayer.x + shootPlayer.size, shootPlayer.y + sizeDelta / 2)
            break
        case entityDirections.Down:
            spawnPoint = new Point(shootPlayer.x + sizeDelta / 2, shootPlayer.y + shootPlayer.size)
            break
        case entityDirections.Left:
            spawnPoint = new Point(shootPlayer.x - shellSize, shootPlayer.y + sizeDelta / 2)
            break
        }
        const shell = new Shell(spawnPoint.x, spawnPoint.y, shootPlayer.direction, shootPlayer.team)
        this.field.mapObjects.shell.push(shell)
    }
}

export default EntityHandlers
