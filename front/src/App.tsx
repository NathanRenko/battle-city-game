import React from 'react'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'

import GameSection from './components/gameSection/gameSection'
import MainMenu, { WaitingTable } from './components/mainMenu/mainMenu'
import MapChooser from './components/mapChooser/mapChooser'
import './index.css'
import { GameContextProvider } from './stores/store'

export function App() {
    return (
        <div className={'gameContainer'}>
            <GameContextProvider>
                <Router>
                    <Switch>
                        <Route exact path={'/'} component={MainMenu}/>
                        <Route path={'/game-section'} component={GameSection}/>
                        <Route path={'/map-chooser'} component={MapChooser}/>
                        <Route path={'/waiting-table'} component={WaitingTable}/>
                    </Switch>
                </Router>
            </GameContextProvider>
        </div>
    )
}
