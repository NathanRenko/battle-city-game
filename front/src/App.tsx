import './index.css'

import { Game } from './Game'
import { GameContextProvider } from './stores/store'

export function App() {
    return (
        <GameContextProvider>
            <Game/>
        </GameContextProvider>
    )
}
