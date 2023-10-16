import MapHandler from '../handlers/MapHandler'
import { entityDirections } from '../Utils/DirectionHandler'

export const isSomeEnum = <T extends Record<string, unknown>>(e: T) => {
    return function (token: unknown): token is T[keyof T] {
        return Object.values(e).includes(token as T[keyof T])
    }
}

export abstract class IRespawnable {
    abstract respawnCount: number
    abstract respawnEntity(field: MapHandler): unknown
}

export abstract class IDirection {
    abstract direction: entityDirections
}

export function gameCollectionTypeGuard<T>(typeGuard: (entity: any) => boolean): (collection: any[]) => boolean {
    return function (collection: unknown[]): collection is T[] {
        return typeGuard(collection[0])
    }
}

export function haveDirectionEnum(entity: any): entity is keyof entityDirections {
    return Object.values(entityDirections).includes((entity as IDirection).direction)
}

export function haveDirection(entity: any): entity is IDirection {
    return Object.values(entityDirections).includes((entity as IDirection).direction)
}

export const isDirectionCollection = gameCollectionTypeGuard(haveDirection)

export abstract class IObstacle {

}
