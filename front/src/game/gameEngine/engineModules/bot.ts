import Point from '../../gameClasses/Point'
import { Tank } from '../../gameObjects'
import MapHandler from './handlers/MapHandler'
import { buttonsToDirections } from './Utils/DirectionHandler'
import { KnownSections } from './Utils/GameObjectsConfiguration'

export class Bot {
    tank: Tank
    way: string = ''
    pathLeft: number = 0
    field: MapHandler
    algorithm: 'chaotic' | 'playerPursuing'

    constructor(tank: Tank, field: MapHandler, algorithm: 'chaotic' | 'playerPursuing') {
        this.tank = tank
        this.field = field
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
        this.tank.handleTankMovements(this.field, buttonsToDirections[this.way], movement[this.way])
        const percent = Math.random() * 100
        if (this.tank.canShoot() && percent > 70) {
            this.tank.makeShoot(this.field)
        }
    }

    private hasCollision(move: Point) {
        return (
            this.field.findCollisionBlock(move, this.tank) !== undefined
            || this.field.hasBoundsCollision(this.tank, move, this.field.mapSize)
        )
    }

    private findBestWay(dt: number) {
        const start = { x: this.tank.x, y: this.tank.y }

        const targetTank = this.field.gameMap.getCollectionByClassName(KnownSections.tanks)[0]
        const target = { x: targetTank.x, y: targetTank.y }
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
