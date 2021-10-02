import './map.css'
import { ChangeEvent } from 'react'

interface IProps {
    src: string
    onClick: (event: ChangeEvent<HTMLInputElement>) => unknown
    change: (event: ChangeEvent<HTMLInputElement>) => unknown
    value: string
}

function Card(props: IProps) {
    return (
        <label className={'cardLabel'}>
            <input type='radio' name='test' value={props.value} onChange={props.change} />
            <div className={'cardContainer'}>
                <img className={'card'} src={props.src}/>
                <div id={`overlay_${props.value}`} className={'overlay'}/>
            </div>
        </label>
    )
}

export default Card
