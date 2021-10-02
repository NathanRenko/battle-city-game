import './gameField.css'
import { useEffect, useRef } from 'react'

import GameEngine from '../../game/gameEngine/gameEngine'
import { useGameLocalStore } from '../../stores/store'

function GameField() {
    const store = useGameLocalStore()
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        store.canvasRef = canvasRef
        const engine = new GameEngine(store)
        engine.start()
    }, [])
    return <canvas ref={canvasRef} width="1000" height="800" className="gameField"/>
}

export default GameField
