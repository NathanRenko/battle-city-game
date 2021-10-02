import GameObject from '../gameClasses/gameObject'
import EntitySkins from '../gameEngine/engineModules/constObjects/entitySkins'

class Foliage extends GameObject {
    size = 50

    constructor(x: number, y: number, color: 'g' | 'y') {
        super(x, y)
        if (color === 'g') {
            this.skin = EntitySkins.foilageGreen
        } else {
            this.skin = EntitySkins.foilageYellow
        }
    }
}

export default Foliage
