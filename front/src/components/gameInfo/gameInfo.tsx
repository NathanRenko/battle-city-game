import './gameInfo.css'
import { FC } from 'react'

import { useObserver } from 'mobx-react-lite'

import { ITextInfo, useGameLocalStore } from '../../stores/store'

function GameInfo() {
    const store = useGameLocalStore()
    return useObserver(() =>
        <div className={'infoContainer'}>
            {getTextInfoProps(store.textInfo, store.isSinglePlayer).map((textInfoItem, i) =>
                <LabeledSpan key={i} label={textInfoItem.label} value={textInfoItem.value}/>
            )}
        </div>
    )
}

function getTextInfoProps(textInfo: ITextInfo, isSinglePlayer: boolean): IProps[] {
    if (isSinglePlayer) {
        return [
            { label: 'Осталось возрождений:', value: textInfo.respawnCount },
            { label: 'Осталось врагов:', value: textInfo.enemyCount },
        ]
    }

    return [
        { label: 'Осталось возрождений:', value: textInfo.respawnCount },
        { label: 'Возрождений у оппонента:', value: textInfo.opponentRespawnCount },
        { label: 'Имя оппонента:', value: textInfo.opponentName },
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
