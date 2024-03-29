import { haveHpHandler, IHpHandler } from './engineModules/handlers/HpHandler'
import MapHandler from './engineModules/handlers/MapHandler'
import ModelHandler from './engineModules/handlers/ModelHandler'
import { haveDirection, IDirection } from './engineModules/interfaces/interfaces'
import { directionToAngle, entityDirections } from './engineModules/Utils/DirectionHandler'
import SkinCollection from './engineModules/Utils/skinCollection'
import { IGameStore } from '../../stores/store'
import GameObject from '../gameClasses/gameObject'

class GameEngine {
    canvasContext!: CanvasRenderingContext2D
    field!: MapHandler
    ModelHandler!: ModelHandler
    lastFrameTime!: number
    store: IGameStore
    skinCollection!: SkinCollection
    constructor(store: IGameStore) {
        this.store = store
        // @ts-ignore
        this.canvasContext = this.store.canvasRef?.current?.getContext('2d')
        let backgroundImage: string
        console.log('Store.choosenMap')
        console.log(this.store.choosenMap)
        if (this.store.choosenMap === 'first') {
            backgroundImage = './assets/images/RPG_Nature_Tileset_Autumn.png'
        } else {
            backgroundImage = './assets/images/street.png'
        }
        // @ts-ignore
        this.store.canvasRef.current.style.backgroundImage = `url(${backgroundImage})`
        // @ts-ignore
        this.store.canvasRef.current.style.backgroundRepeat = 'repeat'
        this.initFields()
    }

    start() {
        this.lastFrameTime = Date.now()
        requestAnimationFrame(() => this.doGameEngineCycle())
    }

    doGameEngineCycle() {
        if (this.ModelHandler.gameIsOver) {
            this.finishGame()
        } else {
            this.updateModel()
            this.draw()
            this.updateGameInfo()
            requestAnimationFrame(() => this.doGameEngineCycle())
        }
    }

    initFields() {
        this.field = new MapHandler(this.store.canvasRef!.current!.width, this.store.canvasRef!.current!.height, this.store.choosenMap!, this.store)
        this.ModelHandler = new ModelHandler(this.field, this.store)
        this.lastFrameTime = 0
        this.skinCollection = new SkinCollection()
        this.skinCollection.load()
    }

    finishGame() {
        if (!this.store.isSinglePlayer) {
            // @ts-ignore
            this.store.socket.off('opponent disconnected')
            // @ts-ignore
            this.store.socket.off('move')
            // @ts-ignore
            this.store.socket.off('shoot')
            // @ts-ignore
            this.store.socket.disconnect()
        }

        if (this.ModelHandler.playerBase.hpHandler.hp === 0 || this.ModelHandler.currentPlayer.hpHandler.hp === 0) {
            // @ts-ignore
            this.store.openModal('Поражение.')
        } else {
            // @ts-ignore
            this.store.openModal('Победа!')
        }
    }

    updateGameInfo() {
        this.store.setRespawnCount(this.ModelHandler.currentPlayer.respawnCount.toString())
        if (this.store.isSinglePlayer) {
            this.store.setEnemyCount(this.ModelHandler.bots.length.toString())
        } else {
            this.store.setOpponentRespawnCount(this.ModelHandler.opponent.respawnCount.toString())
        }
    }

    updateModel() {
        const dt = this.getDt()
        this.ModelHandler.frameEngine(dt)
    }

    getDt() {
        const now = Date.now()
        const dt = (now - this.lastFrameTime) / 1000.0
        this.lastFrameTime = now
        return dt
    }

    draw() {
        this.canvasContext?.clearRect(0, 0, this.store.canvasRef!.current!.width, this.store.canvasRef!.current!.height)
        // const collectionDrawParams = {
        //     hasDirection: true,
        //     hasHp: true
        // }
        for (const entityCollection of this.field.gameMap.getObjectsByOrder()) {
            for (const entity of entityCollection) {
                if (haveDirection(entity)) {
                    this.drawRotatedEntity(this.canvasContext, entity)
                } else {
                    this.drawEntity(this.canvasContext, entity)
                }
                if (haveHpHandler(entity)) {
                    this.drawHpBar(this.canvasContext, entity)
                }
            }
            // if (entityCollection.length && isDirectionEnum(entityCollection[0])) {
            //     for (const entity of entityCollection) {
            //         // TODO
            //         // @ts-ignore
            //         this.drawRotatedEntity(this.canvasContext, entity)
            //         if (haveHpHandler(entity)) {
            //             this.drawHpBar(this.canvasContext, entity)
            //         }
            //     }
            // } else {
            //     for (const entity of entityCollection) {
            //         this.drawEntity(this.canvasContext, entity)
            //         if (haveHpHandler(entity)) {
            //             this.drawHpBar(this.canvasContext, entity)
            //         }
            //     }
            // }
        }
    }

    drawRotatedEntity(context: CanvasRenderingContext2D, entity: GameObject & IDirection) {
        if (!entity) {
            return
        }
        context.save()
        context.translate(entity.x + entity.size / 2, entity.y + entity.size / 2)
        context.rotate((directionToAngle[entity.direction] * Math.PI) / 180)
        context.drawImage(
            this.skinCollection.get(entity.skin),
            -entity.size / 2,
            -entity.size / 2,
            entity.size,
            entity.size
        )

        context.restore()
    }

    drawHpBar(context: CanvasRenderingContext2D, entity: IHpHandler & GameObject) {
        if (!entity || entity.hpHandler.hideHp) {
            return
        }
        const hpPercent = entity.hpHandler.hpPercentage
        if (hpPercent > 0.5) {
            context.fillStyle = 'green'
        } else {
            context.fillStyle = 'red'
        }
        const hpBarH = 4
        const margin = 8
        if ('direction' in entity) {
            let x: number
            let y: number
            let width
            let height
            switch (entity.direction) {
            case entityDirections.Up:
                x = entity.x
                y = entity.y + entity.size + margin
                width = hpPercent * entity.size
                height = hpBarH
                break
            case entityDirections.Right:
                x = entity.x - margin
                y = entity.y
                width = hpBarH
                height = hpPercent * entity.size
                break
            case entityDirections.Down:
                x = entity.x
                y = entity.y - margin
                width = hpPercent * entity.size
                height = hpBarH
                break
            case entityDirections.Left:
                x = entity.x + entity.size + margin
                y = entity.y
                width = hpBarH
                height = hpPercent * entity.size
                break
            default:
                throw new Error()
            }

            context.fillRect(x, y, width, height)
        } else {
            context.fillRect(entity.x, entity.y + entity.size + margin, hpPercent * entity.size, hpBarH)
        }
    }

    drawEntity(ctx: CanvasRenderingContext2D, entity: GameObject) {
        ctx.drawImage(this.skinCollection.get(entity.skin), entity.x, entity.y, entity.size, entity.size)
    }
}

export default GameEngine
