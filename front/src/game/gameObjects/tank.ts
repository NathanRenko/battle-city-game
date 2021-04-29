import { textChangeRangeIsUnchanged } from 'typescript';
import GameObject from '../gameClasses/gameObject';
import Point from '../gameClasses/Point';
import { entityDirections } from '../gameEngine/engineModules/constObjects/DirectionHandler';
import EntitySkins from '../gameEngine/engineModules/constObjects/entitySkins';
import { IDirection, IHealth } from '../gameEngine/engineModules/interfaces/interfaces';
import { getAudio } from '../gameEngine/engineModules/Utils';

class Tank extends GameObject implements IHealth, IDirection {
    direction: entityDirections = entityDirections.Up;
    size = 35;

    respawnCount = 2;
    hp = 2;
    maxHp = this.hp;
    lastShooted: number = 0;
    spawnPoint: Point;
    team: 0 | 1;
    shootAudio: HTMLAudioElement;
    deathAudio: HTMLAudioElement;

    constructor(x: number, y: number, team: 0 | 1) {
        super(x, y);
        this.spawnPoint = new Point(x, y);
        this.team = team;
        if (team === 0) {
            this.skin = EntitySkins.TankFirst;
        } else {
            this.skin = EntitySkins.TankSecond;
        }

        this.shootAudio = getAudio('./assets/sounds/shoot1.wav');
        this.deathAudio = getAudio('./assets/sounds/explosion3.wav');
    }

    applyStep(shift: Point) {
        this.x += shift.x;
        this.y += shift.y;
    }

    changeDirection(direction: entityDirections) {
        this.direction = direction;
    }

    getPlayerPosition() {
        return { x: this.x, y: this.y, width: this.size, height: this.size };
    }
}

export default Tank;
