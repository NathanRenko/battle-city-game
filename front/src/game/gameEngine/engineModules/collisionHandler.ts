import GameObject from '../../gameClasses/gameObject';
import Point from '../../gameClasses/Point';
import Base from '../../gameObjects/base';
import BrickWall from '../../gameObjects/brick-wall';
import Particle from '../../gameObjects/particle';
import Shell from '../../gameObjects/shell';
import SteelWall from '../../gameObjects/steel-wall';
import Tank from '../../gameObjects/tank';
import { entityDirections } from './constObjects/DirectionHandler';
import Field from './Field';

export default class CollisionHandler {
    handleShellСollision(
        collisionBlock: Tank | SteelWall | BrickWall | Base | undefined,
        gameObject: Shell,
        field: Field
    ) {
        this.shellToParticle(gameObject, field);
        if (collisionBlock) {
            let parentCollection = field.getParentCollection(collisionBlock);
            if ('hp' in collisionBlock) {
                if (collisionBlock.hp !== 0) {
                    collisionBlock.hp--;
                }
                if (collisionBlock.hp === 0) {
                    if ('team' in collisionBlock) {
                        collisionBlock.setDeathState();
                    } else if ('respawnCount' in collisionBlock) {
                        // TODO make respawn logic
                        if (collisionBlock.respawnCount !== 0) {
                            collisionBlock.x = collisionBlock.spawnPoint.x;
                            collisionBlock.y = collisionBlock.spawnPoint.y;
                            collisionBlock.hp = collisionBlock.maxHp;
                            collisionBlock.respawnCount--;
                        }

                        console.log('now: ' + collisionBlock.respawnCount);
                    } else {
                        parentCollection.splice(parentCollection.indexOf(collisionBlock), 1);
                    }
                }
            }
        }
    }

    shellToParticle(shell: Shell, field: Field) {
        field.shell.splice(field.shell.indexOf(shell), 1);
        let spawnPoint = new Point(0, 0);
        const particleWidth = new Particle(spawnPoint.x, spawnPoint.y, shell.direction).size;
        const sizeDelta = particleWidth - shell.size;
        switch (shell.direction) {
            case entityDirections.Up:
                spawnPoint = new Point(shell.x - sizeDelta / 2, shell.y);
                break;
            case entityDirections.Right:
                spawnPoint = new Point(shell.x - sizeDelta, shell.y - sizeDelta / 2);
                break;
            case entityDirections.Down:
                spawnPoint = new Point(shell.x - sizeDelta / 2, shell.y - sizeDelta);
                break;
            case entityDirections.Left:
                spawnPoint = new Point(shell.x, shell.y - sizeDelta / 2);
                break;
            default:
                throw new Error();
                break;
        }
        let particle = new Particle(spawnPoint.x, spawnPoint.y, shell.direction);
        field.particles.push(particle);
    }
}
