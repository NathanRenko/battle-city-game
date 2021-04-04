import './mainMenu.css';
import ReactDOM from 'react-dom';
import GameSection from '../gameSection/gameSection';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Store from '../../game/gameEngine/store';
import MapChooser from '../mapChooser/mapChooser';

function MainMenu() {
    const startGame = () => {
        findPlayer();
    };
    const startTestGame = () => {
        Store.isSinglePlayer = true;
        ReactDOM.render(<GameSection></GameSection>, document.getElementById('root'));
    };
    return (
        <div className='mainMenuContainer'>
            <label htmlFor=''>
                Enter you're name:
                <input className='nameInput' type='text' />
            </label>
            <button className='playButton' onClick={startTestGame}>
                Test Game
            </button>
            <button className='playButton' onClick={startGame}>
                Find Game
            </button>
        </div>
    );
}

function WaitingTable() {
    let [seconds, changeSeconds] = useState(10);

    useEffect(() => {
        if (seconds > 0) {
            setTimeout(() => changeSeconds(seconds - 1), 1000);
        } else {
            Store.socket.emit('voteEnd', 'test');
        }
    }, [seconds]);

    return (
        <div>
            <p>{'Игрок найден, до начала боя осталось ' + seconds + ' секунд'}</p>
            <MapChooser></MapChooser>
        </div>
    );
}

function startGame() {
    ReactDOM.render(<GameSection></GameSection>, document.getElementById('root'));
}

function findPlayer() {
    Store.socket = io('ws://localhost:3001', {
        reconnectionDelayMax: 10000,
        auth: {
            token: '123',
            username: Math.random(),
        },
        query: {},
    });
    Store.socket.on('connection', (args: any) => {
        Store.socketID = args;
    });
    Store.socket.on('vote', (args: any) => {
        console.log(args);
        lightUpEnemySelectedCard(args);
    });
    Store.socket.on('voteEnd', (args: any) => {
        console.log('start');
        console.log(args);
        Store.choosenMap = args;
        startGame();
    });
    ReactDOM.render(<p>Поиск игрока...</p>, document.querySelector('.mainMenuContainer'));
    Store.socket.on('start', () => {
        Store.isSinglePlayer = false;
        ReactDOM.render(<WaitingTable />, document.querySelector('.mainMenuContainer'));
    });
}

function lightUpEnemySelectedCard(choise: string) {
    let allOverlays = Array.from(document.querySelectorAll('.overlay'));
    console.log(allOverlays);
    allOverlays.forEach((item) => (item.textContent = ''));
    let choosenMap = document.querySelector('#overlay_' + choise);
    //@ts-ignore
    choosenMap.textContent = 'Выбор вашего оппонента';
}

export default MainMenu;
