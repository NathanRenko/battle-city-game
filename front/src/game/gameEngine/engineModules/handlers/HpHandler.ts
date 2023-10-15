export class HpHandler {
    hp: number
    maxHp: number
    hideHp: boolean
    onDeath: () => void

    constructor(hp: number, onDeath: () => void, hideHp = true, maxHp?: number) {
        this.hp = hp
        this.maxHp = maxHp ?? hp
        this.hideHp = hideHp
        this.onDeath = onDeath
    }

    decreaseHp() {
        if (this.hp !== 0) {
            this.hp--
        }

        if (this.hp <= 0) {
            this.onDeath()
        }
    }

    get hpPercentage() {
        return this.hp / this.maxHp
    }
}

export interface IHpHandler {
    hpHandler: HpHandler
}

export function haveHpHandler(entity: any): entity is IHpHandler {
    return (entity as IHpHandler).hpHandler instanceof HpHandler
}
