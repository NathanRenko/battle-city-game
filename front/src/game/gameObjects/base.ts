import GameObject from '../gameClasses/gameObject';
import EntitySkins from '../gameEngine/engineModules/constObjects/entitySkins';
import { IHealth } from '../gameEngine/engineModules/interfaces/interfaces';
import { getAudio } from '../gameEngine/engineModules/Utils';

class Base extends GameObject implements IHealth {
    static size = 50;
    size = Base.size;
    skin = EntitySkins.Base;
    hp = 5;
    maxHp = this.hp;
    team: 0 | 1;
    deathAudio: HTMLAudioElement;

    constructor(x: number, y: number, team: 0 | 1) {
        super(x, y);
        this.team = team;

        this.deathAudio = getAudio('./assets/sounds/399303__deleted-user-5405837__explosion-012.mp3');
    }

    setDeathState() {
        this.skin = EntitySkins.BaseHit;
    }
}

export default Base;
