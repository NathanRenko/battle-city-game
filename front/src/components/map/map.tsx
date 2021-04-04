import './map.css';

function Card(props: any) {
    return (
        <label className={'cardLabel'}>
            <input type='radio' name='test' value={props.value} onChange={props.change} />
            <div className={'cardContainer'}>
                <img className={'card'} src={props.src}></img>
                <div id={'overlay_' + props.value} className={'overlay'}></div>
            </div>
        </label>
    );
}

export default Card;
