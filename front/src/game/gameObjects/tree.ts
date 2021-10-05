import GameObject from '../gameClasses/gameObject'
import EntitySkins from '../gameEngine/engineModules/constObjects/entitySkins'

export class Tree extends GameObject {
    size = 50

    constructor(x: number, y: number, type: 'o' | 'a') {
        super(x, y)
        if (type === 'o') {
            this.skin = EntitySkins.treeOak
        } else {
            this.skin = EntitySkins.treeApple
        }
    }
}
