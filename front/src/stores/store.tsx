import { createContext, FC, RefObject, useContext } from 'react'

import { useLocalObservable } from 'mobx-react-lite'

const GameContext = createContext<IGameStore>(null!)

export interface ITextInfo {
    respawnCount: string
    enemyCount: string
    opponentRespawnCount: string
    opponentName: string
}

export interface IGameStore {
    socket?: SocketIOClient.Socket
    playerNumber?: number
    isSinglePlayer: boolean
    choosenMap?: string
    playerName: string
    opponentName: string
    openModal?: (message: string) => unknown
    canvasRef: RefObject<HTMLCanvasElement> | null
    textInfo: ITextInfo
}

export const GameContextProvider: FC<{}> = (props) => {
    const store: IGameStore = useLocalObservable(() => ({
        socket: undefined,
        playerNumber: undefined,
        isSinglePlayer: true,
        choosenMap: undefined,
        playerName: '',
        opponentName: '',
        canvasRef: null,
        textInfo: {
            enemyCount: '0',
            respawnCount: '0',
            opponentRespawnCount: '0',
            opponentName: ''
        }
    }))

    return (
        <GameContext.Provider value={store}>
            {props.children}
        </GameContext.Provider>
    )
}

export function useGameLocalStore() {
    return useContext(GameContext)
}
