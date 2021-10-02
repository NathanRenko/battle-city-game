import React from 'react'
import { useHistory } from 'react-router-dom'

import { useGameLocalStore } from '../../stores/store'
import Map from '../map/map'
import './mapChooser.css'

function MapChooser(props: any) {
    const store = useGameLocalStore()
    const history = useHistory()
    const firstMap = store.isSinglePlayer ? './assets/images/map1.png' : './assets/images/multi1_map.png'
    const secondMap = store.isSinglePlayer ? './assets/images/map2.png' : './assets/images/multi2_map.png'
    const chooseMap = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (store.isSinglePlayer) {
            store.choosenMap = event.target.value
            history.push('/game-section')
        } else {
            console.log(event.target.value)
            // @ts-ignore
            store.socket.emit('vote', event.target.value)
        }
    }
    return (
        <div className={'cardChoseContainer'}>
            <Map src={firstMap} onClick={chooseMap} change={chooseMap} value={'first'} />
            <Map src={secondMap} onClick={chooseMap} change={chooseMap} value={'second'} />
        </div>
    )
}

export default MapChooser
