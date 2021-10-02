import Point from '../gameClasses/Point'
import { buttonsToDirections } from '../gameEngine/engineModules/constObjects/DirectionHandler'
import EntityHandlers from '../gameEngine/engineModules/entityHandlers'
import Field from '../gameEngine/engineModules/Field'
import Tank from './tank'

class Bot {
    tank: Tank
    way: string = ''
    pathLeft: number = 0
    field: Field
    entityHandler: EntityHandlers
    algorithm: 'chaotic' | 'playerPursuing'

    constructor(tank: Tank, field: Field, entityHandler: EntityHandlers, algorithm: 'chaotic' | 'playerPursuing') {
        this.tank = tank
        this.field = field
        this.entityHandler = entityHandler
        this.algorithm = algorithm
    }

    handleBotActions(dt: number) {
        const playerSpeed = 5
        const shift = Math.round(playerSpeed * dt * 10)
        const moves = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight']
        const movement: { [index: string]: Point } = {
            ArrowDown: new Point(0, shift),
            ArrowUp: new Point(0, -shift),
            ArrowLeft: new Point(-shift, 0),
            ArrowRight: new Point(shift, 0),
        }

        if (this.algorithm === 'chaotic') {
            if (this.pathLeft <= 0 || this.hasCollision(movement[this.way])) {
                this.pathLeft = 0
                const percent = Math.random() * 100
                switch (true) {
                case percent < 50 && !this.hasCollision(movement[moves[0]]):
                    this.way = moves[0]
                    break
                case percent < 70 && !this.hasCollision(movement[moves[2]]):
                    this.way = moves[2]
                    break
                case percent < 90 && !this.hasCollision(movement[moves[3]]):
                    this.way = moves[3]
                    break
                case percent <= 100:
                    this.way = moves[1]
                    break
                default:
                    break
                }
                const max = 200
                const min = 100
                const distanceList = [100, 150, 200, 250]
                const selectedDistance = distanceList[Math.floor(Math.random() * distanceList.length)]
                this.pathLeft = Math.floor(Math.random() * (max - min + 1)) + min
                this.pathLeft = selectedDistance
            }
            this.pathLeft -= shift
        }

        if (this.algorithm === 'playerPursuing') {
            this.way = this.findBestWay(dt) || 'ArrowDown'
        }

        this.entityHandler.handleTankMovements(this.tank, buttonsToDirections[this.way], movement[this.way])

        const percent = Math.random() * 100
        if (this.entityHandler.canShoot(this.tank) && percent > 70) {
            this.entityHandler.makeShoot(this.tank)
        }
    }

    hasCollision(move: Point) {
        return (
            this.field.findCollisionBlock(move, this.tank) !== undefined
            || this.field.hasBoundsCollision(this.tank, move, this.field.mapSize)
        )
    }

    findBestWay(dt: number) {
        const start = { x: this.tank.x, y: this.tank.y }
        const target = { x: this.field.mapObjects.tanks[0].x, y: this.field.mapObjects.tanks[0].y }
        const deltaX = Math.abs(target.x - start.x)
        const deltaY = Math.abs(target.y - start.y)
        const moves = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight']

        if (deltaX > deltaY) {
            if (start.x > target.x) {
                return moves[2]
            } else {
                return moves[3]
            }
        } else {
            if (start.y < target.y) {
                return moves[0]
            } else {
                return moves[1]
            }
        }
    }
}

export default Bot
