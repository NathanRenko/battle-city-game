import './mainMenu.css'
import { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { History } from 'history'
import io from 'socket.io-client'

import { IGameStore, useGameLocalStore } from '../../stores/store'
import MapChooser from '../mapChooser/mapChooser'

function MainMenu() {
    const [waitingState, setWaitingState] = useState(false)
    const playerNameRef = useRef<HTMLInputElement>(null)
    const store = useGameLocalStore()
    const history = useHistory()
    const startGame = () => {
        store.playerName = playerNameRef.current?.value || 'Unknown Soldier'
        store.isSinglePlayer = false
        setWaitingState(true)
        findPlayer(store, history)
    }
    const startTestGame = () => {
        store.playerName = playerNameRef.current?.value || 'Unknown Soldier'
        store.isSinglePlayer = true
        history.push('/map-chooser')
    }
    return (
        <div>
            {waitingState && <p>Поиск игрока...</p>}
            {!waitingState && (
                <>
                    <label htmlFor=''>
                        Введите имя:
                        <input className='nameInput' ref={playerNameRef} type='text' id={'playerName'}/>
                    </label>
                    <button type={'submit'} className='playButton' onClick={startTestGame}>
                        Одиночная игра
                    </button>
                    <button type={'submit'} className='playButton' onClick={startGame}>
                        Мультиплеер
                    </button>
                </>
            )}
        </div>
    )
}

export function WaitingTable() {
    const [seconds, changeSeconds] = useState(10)
    const store = useGameLocalStore()
    useEffect(() => {
        if (seconds > 0) {
            setTimeout(() => changeSeconds(seconds - 1), 1000)
        } else {
            store.socket?.emit('voteEnd', 'test')
        }
    }, [seconds])

    return (
        <div>
            <p>{`Игрок найден, до начала боя осталось ${seconds} секунд`}</p>
            <MapChooser/>
        </div>
    )
}

function findPlayer(store: IGameStore, history: History) {
    store.socket = io('ws://localhost:3001', {
        reconnectionDelayMax: 10000,
        auth: {
            token: '123',
            username: store.playerName,
        },
        query: {},
    })
    store.socket.on('connection', (args: any) => {
        store.playerNumber = args
    })
    store.socket.on('vote', (args: any) => {
        console.log(args)
        lightUpEnemySelectedCard(args)
    })
    store.socket.on('voteEnd', (args: any) => {
        console.log('start')
        console.log(args)
        store.choosenMap = args[0]
        history.push('/game-section')
    })
    store.socket.on('start', (args: any) => {
        store.opponentName = args.usernames[store.playerNumber!]
        history.push('/waiting-table')
    })
}

function lightUpEnemySelectedCard(choise: string) {
    const allOverlays = Array.from(document.querySelectorAll('.overlay'))
    console.log(allOverlays)
    allOverlays.forEach((item) => (item.textContent = ''))
    const choosenMap = document.querySelector('#overlay_' + choise)
    // @ts-ignore
    choosenMap.textContent = 'Выбор вашего оппонента'
}

export default MainMenu
