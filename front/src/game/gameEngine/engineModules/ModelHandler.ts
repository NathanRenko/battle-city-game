import { IGameStore } from '../../../stores/store'
import Point from '../../gameClasses/Point'
import Base from '../../gameObjects/base'
import Bot from '../../gameObjects/bot'
import House from '../../gameObjects/house'
import Tank from '../../gameObjects/tank'
import { buttonsToDirections, entityDirections } from './constObjects/DirectionHandler'
import EntityHandlers from './entityHandlers'
import Field from './Field'
import InputHandler from './inputHandler'

class ModelHandler {
    field: Field
    InputHandler: InputHandler
    entityHandler!: EntityHandlers
    socketId!: number
    playerBase!: Base
    currentPlayer!: Tank
    opponent!: Tank
    bots!: Bot[]
    store: IGameStore
    constructor(field: Field, store: IGameStore) {
        this.field = field
        this.InputHandler = new InputHandler()
        this.store = store
        if (this.store.isSinglePlayer) {
            this.initPlayer(0, 0)
            this.bots = []
            this.bots.push(new Bot(this.field.mapObjects.tanks[1], this.field, this.entityHandler, 'chaotic'))
            this.bots.push(new Bot(this.field.mapObjects.tanks[2], this.field, this.entityHandler, 'chaotic'))
            this.bots.push(new Bot(this.field.mapObjects.tanks[3], this.field, this.entityHandler, 'playerPursuing'))
        } else {
            // @ts-ignore
            this.socketId = this.store.playerNumber
            console.log(`socket: ${this.socketId}`)
            this.initPlayer(this.socketId, this.socketId)
            this.setupSocket()
        }
    }

    initPlayer(playerId: number, baseId: number) {
        this.entityHandler = new EntityHandlers(this.field)
        this.currentPlayer = this.field.mapObjects.tanks[playerId]
        this.opponent = this.field.mapObjects.tanks[1 - playerId]
        this.playerBase = this.field.mapObjects.base[baseId]
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
            this.entityHandler.makeShoot(this.opponent)
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
            for (const bot of this.bots) {
                if (this.field.mapObjects.tanks.includes(bot.tank)) {
                    bot.handleBotActions(dt)
                } else {
                    this.bots.splice(this.bots.indexOf(bot), 1)
                }
            }
        } else {
            // @ts-ignore
            this.store.socket.emit('move', {
                x: this.currentPlayer.x,
                y: this.currentPlayer.y,
                direction: this.currentPlayer.direction,
            })
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
            if (this.entityHandler.canShoot(this.currentPlayer)) {
                this.entityHandler.makeShoot(this.currentPlayer)
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
        for (const shell of this.field.mapObjects.shell) {
            this.entityHandler.handleShellMovements(shell, directions[shell.direction])
        }
    }

    handleParticleChanging(dt: number) {
        for (const particle of this.field.mapObjects.particles) {
            this.entityHandler.handleParticle(particle, dt)
        }
    }

    handleHouseCollectionAnimation(dt: number) {
        for (const obstacle of this.field.mapObjects.obstacle) {
            if (obstacle.constructor === House) {
                if (obstacle.stateNumber !== 0) {
                    this.entityHandler.handleHouseFireAnimation(obstacle, dt)
                }
            }
        }
    }

    handleWaterAnimation(dt: number) {
        for (const water of this.field.mapObjects.water) {
            water.changeAnimationStep(dt)
        }
    }

    handleMovements(button: any, step: Point) {
        if (this.InputHandler.isDown(button)) {
            this.entityHandler.handleTankMovements(this.currentPlayer, buttonsToDirections[button], step)
            return true
        }
        return false
    }
}

export default ModelHandler
