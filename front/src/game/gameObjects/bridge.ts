import GameObject from '../gameClasses/gameObject'
import EntitySkins from '../gameEngine/engineModules/Utils/entitySkins'

export class Bridge extends GameObject {
    size = 50

    constructor(x: number, y: number, side: 'l' | 'u') {
        super(x, y)
        if (side === 'l') {
            this.skin = EntitySkins.bridgeLeft
        } else {
            this.skin = EntitySkins.bridgeUp
        }
    }
}
