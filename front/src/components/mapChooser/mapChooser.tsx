import Store from '../../game/gameEngine/store';
import Map from '../map/map';
import './mapChooser.css';
import ReactDOM from 'react-dom';
import React from 'react';
import GameSection from '../gameSection/gameSection';

function MapChooser(props: any) {
    const firstMap = Store.isSinglePlayer? './assets/images/map1.png' : './assets/images/multi1_map.png';
    const secondMap = Store.isSinglePlayer? './assets/images/map2.png' : './assets/images/multi2_map.png';
    return (
        <div className={'cardChoseContainer'}>
            <Map src={firstMap} onClick={chooseMap} change={chooseMap} value={'first'} />
            <Map src={secondMap} onClick={chooseMap} change={chooseMap} value={'second'} />
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
