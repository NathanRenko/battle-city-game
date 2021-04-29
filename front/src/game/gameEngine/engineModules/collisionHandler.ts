import GameObject from '../../gameClasses/gameObject';
import Point from '../../gameClasses/Point';
import Base from '../../gameObjects/base';
import BrickWall from '../../gameObjects/brick-wall';
import House from '../../gameObjects/house';
import Particle from '../../gameObjects/particle';
import Shell from '../../gameObjects/shell';
import SteelWall from '../../gameObjects/steel-wall';
import Tank from '../../gameObjects/tank';
import Water from '../../gameObjects/water';
import { entityDirections } from './constObjects/DirectionHandler';
import { obstacleType } from './constObjects/entityClasses';
import Field from './Field';

export default class CollisionHandler {
    handleShellСollision(collisionBlock: Tank | obstacleType | Base | undefined, shell: Shell, field: Field) {
        this.shellToParticle(shell, field);
        if (collisionBlock) {
            if ('team' in collisionBlock) {
                if (collisionBlock.team === shell.team) {
                    return;
                }
            }
            if ('hp' in collisionBlock) {
                this.decreaseHp(collisionBlock, field);
            }
        }
    }

    decreaseHp(collisionBlock: Tank | BrickWall | Base | House, field: Field) {
        if (collisionBlock.hp !== 0) {
            collisionBlock.hp--;
            if ('stateNumber' in collisionBlock) {
                collisionBlock.changeState();
            }
        }

        if (collisionBlock.hp === 0) {
            this.deathHandler(collisionBlock, field);
        }
    }

    deathHandler(collisionBlock: Base | Tank | obstacleType, field: Field) {
        if (collisionBlock.constructor === Base) {
            collisionBlock.deathAudio.play();
            collisionBlock.setDeathState();
            return;
        }
        if (collisionBlock.constructor === Tank) {
            collisionBlock.deathAudio.play();
            field.mapObjects.particles.push(new Particle(collisionBlock.x, collisionBlock.y, collisionBlock.direction));
            this.respawnEntity(collisionBlock, field);
            return;
        }

        if (
            collisionBlock.constructor === SteelWall ||
            collisionBlock.constructor === BrickWall ||
            collisionBlock.constructor === House
        ) {
            let parentCollection = field.getParentCollection(collisionBlock);
            parentCollection.splice(parentCollection.indexOf(collisionBlock), 1);
            return;
        }

        throw new Error('Not implemented type');
    }

    respawnEntity(entity: Tank, field: Field) {
        if (entity.respawnCount > 0) {
            entity.x = entity.spawnPoint.x;
            entity.y = entity.spawnPoint.y;
            entity.hp = entity.maxHp;
            entity.respawnCount--;
        } else {
            let parentCollection = field.getParentCollection(entity);
            parentCollection.splice(parentCollection.indexOf(entity), 1);
        }
    }

    shellToParticle(shell: Shell, field: Field) {
        field.mapObjects.shell.splice(field.mapObjects.shell.indexOf(shell), 1);
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
        }
        let particle = new Particle(spawnPoint.x, spawnPoint.y, shell.direction);
        field.mapObjects.particles.push(particle);
    }
}
