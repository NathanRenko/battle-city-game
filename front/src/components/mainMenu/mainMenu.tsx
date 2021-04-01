import './mainMenu.css';
import ReactDOM from 'react-dom';
import GameSection from '../gameSection/gameSection';
import { ReactPropTypes, useState, useEffect } from 'react';
import io from 'socket.io-client';
import Store from '../../game/gameEngine/store';

// socket.onAny((event, ...args) => {
//     console.log(event, args);
// });

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
        let timerID = setInterval(() => {
            changeSeconds((seconds) => seconds - 1);
            if (seconds === 0) {
                clearInterval(timerID);
                ReactDOM.render(<GameSection></GameSection>, document.getElementById('root'));
            }
        }, 1000);

        return () => clearInterval(timerID);
    }, [seconds]);

    return <p>{'Игрок найден, до начала боя осталось ' + seconds + ' секунд'}</p>;
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
    ReactDOM.render(<p>Поиск игрока...</p>, document.querySelector('.mainMenuContainer'));
    // let timerId = setInterval(() => console.log('Игрок не найден'), 1000);
    Store.socket.on('start', () => {
        // clearInterval(timerId);
        Store.isSinglePlayer = false;
        ReactDOM.render(<WaitingTable />, document.querySelector('.mainMenuContainer'));
    });
}

export default MainMenu;
