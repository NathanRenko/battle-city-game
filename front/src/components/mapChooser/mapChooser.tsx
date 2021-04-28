import Store from '../../game/gameEngine/store';
import Map from '../map/map';
import './mapChooser.css';
import ReactDOM from 'react-dom';
import React from 'react';
import GameSection from '../gameSection/gameSection';

function MapChooser(props: any) {
    return (
        <div className={'cardChoseContainer'}>
            <Map src={'./assets/images/map1.png'} onClick={chooseMap} change={chooseMap} value={'first'} />
            <Map src={'./assets/images/map2.png'} onClick={chooseMap} change={chooseMap} value={'second'} />

            {/* {props.children} */}
            {/* <img className={'card'} src={'./assets/map1.png'} />
            <img className={'card'} src={'./assets/map2.png'} /> */}
        </div>
    );
}

function chooseMap(event: React.ChangeEvent<HTMLInputElement>) {
    if (Store.isSinglePlayer) {
        Store.choosenMap = event.target.value;
        ReactDOM.render(<GameSection></GameSection>, document.getElementById('root'));
    } else {
        console.log(event.target.value);
        Store.socket.emit('vote', event.target.value);
    }
}

export default MapChooser;
