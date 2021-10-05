import { FC } from 'react'

import { useObserver } from 'mobx-react-lite'

import GameSection from './components/gameSection/gameSection'
import MainMenu, { WaitingTable } from './components/mainMenu/mainMenu'
import MapChooser from './components/mapChooser/mapChooser'
import { useGameLocalStore } from './stores/store'

export type IStage = 'menu' | 'map-choose' | 'game' | 'waiting-table'

const routes: Record<IStage, FC> = {
    menu: MainMenu,
    'map-choose': MapChooser,
    'waiting-table': WaitingTable,
    game: GameSection
}

export const Game: FC = () => {
    const store = useGameLocalStore()
    const Component = routes[store.stage]
    return useObserver(() =>
        (
            <>
                {store.stage === 'game'
                    ? <Component/>
                    : (
                        <div className={'gameContainer'}>
                            <Component/>
                        </div>
                    )
                }
            </>
        )
    )
}
