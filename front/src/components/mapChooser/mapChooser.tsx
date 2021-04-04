import Store from '../../game/gameEngine/store';
import Map from '../map/map';
import './mapChooser.css';

function MapChooser(props: any) {
    return (
        <div className={'cardChoseContainer'}>
            <Map src={'./assets/map1.png'} onClick={chooseMap} change={chooseMap} value={'first'} />
            <Map src={'./assets/map2.png'} onClick={chooseMap} change={chooseMap} value={'second'} />

            {/* {props.children} */}
            {/* <img className={'card'} src={'./assets/map1.png'} />
            <img className={'card'} src={'./assets/map2.png'} /> */}
        </div>
    );
}

function chooseMap(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.value);
    Store.socket.emit('vote', event.target.value);
}

export default MapChooser;
