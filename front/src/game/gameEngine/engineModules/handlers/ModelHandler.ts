import { IGameStore } from '../../../../stores/store'
import Point from '../../../gameClasses/Point'
import { Base, House, Particle, Tank, TankShell } from '../../../gameObjects'
import { Bot } from '../bot'
import { buttonsToDirections, entityDirections } from '../Utils/DirectionHandler'
import { KnownSections } from '../Utils/GameObjectsConfiguration'
import InputHandler from './inputHandler'
import MapHandler from './MapHandler'

class ModelHandler {
    field: MapHandler
    InputHandler: InputHandler
    socketId!: number
    playerBase!: Base
    currentPlayer!: Tank
    opponent!: Tank
    bots!: Bot[]
    store: IGameStore
    gameIsOver: boolean = false
    constructor(field: MapHandler, store: IGameStore) {
        this.field = field
        this.InputHandler = new InputHandler()
        this.store = store
        if (this.store.isSinglePlayer) {
            this.initPlayer(0, 0)
            this.bots = []
            const tankOnMap = this.field.gameMap.getCollectionByClassName(KnownSections.tanks)

            this.bots.push(new Bot(tankOnMap[1], this.field, 'chaotic'))

            this.bots.push(new Bot(tankOnMap[2], this.field, 'chaotic'))

            this.bots.push(new Bot(tankOnMap[3], this.field, 'playerPursuing'))
        } else {
            // @ts-ignore
            this.socketId = this.store.playerNumber
            console.log(`socket: ${this.socketId}`)
            this.initPlayer(this.socketId, this.socketId)
            this.setupSocket()
        }
    }

    initPlayer(playerId: number, baseId: number) {
        const tanksOnMap = this.field.gameMap.getCollectionByClassName(KnownSections.tanks)
        const bases = this.field.gameMap.getCollectionByClassName(KnownSections.Base)
        this.currentPlayer = tanksOnMap[playerId]

        this.opponent = tanksOnMap[1 - playerId]

        this.playerBase = bases[baseId]
    }

    setupSocket() {
        // @ts-ignore
        this.store.socket.on('move', (event: any, ...args: any) => {
            this.opponent.x = event[0].x
            this.opponent.y = event[0].y
            this.opponent.direction = event[0].direction
        })
        // @ts-ignore
        this.store.socket.on('shoot', (event: any, ...args: any) => {
            this.opponent.makeShoot(this.field)
        })
        // @ts-ignore
        this.store.socket.once('opponent disconnected', (event: any, ...args: any) => {
            // @ts-ignore
            this.store.openModal('Оппонент отключился.')
            // @ts-ignore
            this.store.socket.disconnect()
        })
        console.log(`socket: ${this.socketId}`)
    }

    frameEngine(dt: number) {
        this.handleMovementKeyPressing(dt)
        this.handleShotPress()
        this.handleShellsMovement(dt)
        this.handleParticleChanging(dt)
        this.handleHouseCollectionAnimation(dt)
        this.handleWaterAnimation(dt)
        if (this.store.isSinglePlayer) {
            this.handleBotActions(dt)
        } else {
            // @ts-ignore
            this.store.socket.emit('move', {
                x: this.currentPlayer.x,
                y: this.currentPlayer.y,
                direction: this.currentPlayer.direction,
            })
        }
        this.gameIsOver = this.checkIsGameOver()
    }

    handleBotActions(dt: number) {
        const tanksOnMap = this.field.gameMap.getCollectionByClassName(KnownSections.tanks)
        for (const bot of this.bots) {
            if (tanksOnMap.includes(bot.tank)) {
                bot.handleBotActions(dt)
            } else {
                this.bots.splice(this.bots.indexOf(bot), 1)
            }
        }
    }

    checkIsGameOver() {
        const bases = this.field.gameMap.getCollectionByClassName(KnownSections.Base)
        if (this.store.isSinglePlayer) {
            return (

                bases[0].hp === 0

                || bases[1].hp === 0
                || (this.currentPlayer.respawnCount === 0 && this.currentPlayer.hp === 0)
                || this.bots.length === 0
            )
        } else {
            return (

                bases[0].hp === 0

                || bases[1].hp === 0
                || (this.currentPlayer.respawnCount === 0 && this.currentPlayer.hp === 0)
                || (this.opponent.respawnCount === 0 && this.opponent.hp === 0)
            )
        }
    }

    handleMovementKeyPressing(dt: number) {
        const playerSpeed = 15
        const shift = Math.round(playerSpeed * dt * 10)
        const movement: { [index: string]: Point } = {
            ArrowDown: new Point(0, shift),
            ArrowUp: new Point(0, -shift),
            ArrowLeft: new Point(-shift, 0),
            ArrowRight: new Point(shift, 0),
        }
        for (const move in movement) {
            if (this.handleMovements(move, movement[move])) break
        }
    }

    handleShotPress() {
        if (this.InputHandler.isDown(' ')) {
            if (this.currentPlayer.canShoot()) {
                this.currentPlayer.makeShoot(this.field)
                if (!this.store.isSinglePlayer) {
                    // @ts-ignore
                    this.store.socket.emit('shoot')
                }
            }
        }
    }

    handleShellsMovement(dt: number) {
        const shellSpeed = 30
        const shellShift = Math.round(shellSpeed * dt * 10)

        const directions: { [index: string]: Point } = {
            [entityDirections.Down]: new Point(0, shellShift),
            [entityDirections.Up]: new Point(0, -shellShift),
            [entityDirections.Left]: new Point(-shellShift, 0),
            [entityDirections.Right]: new Point(shellShift, 0),
        }

        for (const shell of this.field.gameMap.getCollectionByClassName(KnownSections.tankShell)) {
            (shell as TankShell).handleShellMovements(this.field, directions[shell.direction])
        }
    }

    handleParticleChanging(dt: number) {
        for (const particle of this.field.gameMap.getCollectionByClassName(KnownSections.particles)) {
            (particle as Particle).handleAnimation(this.field, dt)
        }
    }

    handleHouseCollectionAnimation(dt: number) {
        for (const obstacle of this.field.gameMap.getCollectionByClassName(KnownSections.obstacle)) {
            if (obstacle.constructor === House) {
                obstacle.handleAnimation(this.field, dt)
            }
        }
    }

    handleWaterAnimation(dt: number) {
        for (const water of this.field.gameMap.getCollectionByClassName(KnownSections.water)) {
            water.changeAnimationStep(dt)
        }
    }

    handleMovements(button: any, step: Point) {
        if (this.InputHandler.isDown(button)) {
            this.currentPlayer.handleTankMovements(this.field, buttonsToDirections[button], step)
            return true
        }
        return false
    }
}

export default ModelHandler
