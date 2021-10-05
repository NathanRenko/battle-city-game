import { createContext, FC, RefObject, useContext, useRef } from 'react'

import { makeAutoObservable } from 'mobx'
import { useObserver } from 'mobx-react-lite'
import { Socket } from 'socket.io-client'

import { IStage } from '../Game'

const GameContext = createContext<IGameStore>(null!)
export interface ITextInfo {
    respawnCount: string
    enemyCount: string
    opponentRespawnCount: string
}

export class IGameStore {
    socket?: typeof Socket
    playerNumber?: number
    isSinglePlayer: boolean
    choosenMap?: string
    playerName: string
    opponentName: string
    openModal?: (message: string) => unknown
    canvasRef: RefObject<HTMLCanvasElement> | null
    textInfo: ITextInfo
    stage: IStage
    constructor() {
        makeAutoObservable(this)
        this.socket = undefined
        this.playerNumber = undefined
        this.isSinglePlayer = true
        this.choosenMap = undefined
        this.playerName = ''
        this.opponentName = ''
        this.canvasRef = null
        this.textInfo = {
            enemyCount: '0',
            respawnCount: '0',
            opponentRespawnCount: '0'
        }
        this.stage = 'menu'
    }

    setEnemyCount(count: string) {
        this.textInfo.enemyCount = count
    }

    setRespawnCount(count: string) {
        this.textInfo.respawnCount = count
    }

    setOpponentRespawnCount(count: string) {
        this.textInfo.opponentRespawnCount = count
    }

    setStage(stage: IStage) {
        this.stage = stage
    }
}

export const GameContextProvider: FC<{}> = (props) => {
    const store = useRef<IGameStore>(new IGameStore())

    return useObserver(() => {
        if (!store) { return null }
        return (
            <GameContext.Provider value={store.current}>
                {props.children}
            </GameContext.Provider>
        )
    })
}

export function useGameLocalStore() {
    return useContext(GameContext)
}
