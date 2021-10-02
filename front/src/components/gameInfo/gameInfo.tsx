import './gameInfo.css'
import { FC } from 'react'

import { useObserver } from 'mobx-react-lite'

import { IGameStore, useGameLocalStore } from '../../stores/store'

function GameInfo() {
    const store = useGameLocalStore()
    return useObserver(() =>
        <div className={'infoContainer'}>
            {getTextInfoProps(store, store.isSinglePlayer).map((textInfoItem, i) =>
                <LabeledSpan key={i} label={textInfoItem.label} value={textInfoItem.value}/>
            )}
        </div>
    )
}

function getTextInfoProps(store: IGameStore, isSinglePlayer: boolean): IProps[] {
    if (isSinglePlayer) {
        return [
            { label: 'Осталось возрождений:', value: store.textInfo.respawnCount },
            { label: 'Осталось врагов:', value: store.textInfo.enemyCount },
        ]
    }

    return [
        { label: 'Осталось возрождений:', value: store.textInfo.respawnCount },
        { label: 'Возрождений у оппонента:', value: store.textInfo.opponentRespawnCount },
        { label: 'Имя оппонента:', value: store.opponentName },
    ]
}

interface IProps {
    label: string
    value: string | undefined
}

const LabeledSpan: FC<IProps> = (props) => {
    return (
        <>
            <label>{props.label}</label>
            <span className='infoPanel'>
                {props.value}
            </span>
        </>
    )
}

export default GameInfo
