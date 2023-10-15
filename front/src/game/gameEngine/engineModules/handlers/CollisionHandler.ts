
export interface ICollision {
    type: 'damage' | 'none'
}

// TODO
type onCollisionType = (collision: ICollision) => void

export class CollisionHandler {
    onCollision: onCollisionType
    constructor(onCollision: onCollisionType) {
        this.onCollision = onCollision
    }
}

export interface ICollisionHandler {
    collisionHandler: CollisionHandler
}

export function haveCollisionHandler(entity: any): entity is ICollisionHandler {
    return (entity as ICollisionHandler).collisionHandler instanceof CollisionHandler
}
