// import {
//     Base,
//     BrickWall,
//     Bridge,
//     Foliage,
//     House,
//     Particle,
//     SteelWall,
//     Tank,
//     TankShell,
//     Tree,
//     Water
// } from '../../gameObjects'

import { BrickWall, House, SteelWall, Tree } from '../../../gameObjects'

export type obstacleType = SteelWall | BrickWall | House | Tree

export enum KnownSections {
    Base = 'Base',
    obstacle = 'obstacle',
    water = 'water',
    bridges = 'bridges',
    foliage = 'foliage',
    tanks = 'tanks',
    particles = 'particles',
    tankShell = 'TankShell'
}

export const configuration: Record<KnownSections, {classes: any, layer: number}> = {
    [KnownSections.Base]: { classes: ['Base'], layer: 1 },
    [KnownSections.obstacle]: { classes: ['BrickWall', 'SteelWall', 'House', 'Tree'], layer: 1 },
    [KnownSections.water]: { classes: ['Water'], layer: 0 },
    [KnownSections.bridges]: { classes: ['Bridge'], layer: 0 },
    [KnownSections.foliage]: { classes: ['Foliage'], layer: 2 },
    [KnownSections.tanks]: { classes: ['Tank'], layer: 1 },
    [KnownSections.particles]: { classes: ['Particle'], layer: 1 },
    [KnownSections.tankShell]: { classes: ['TankShell'], layer: 1 },
}

// export const configuration: Record<KnownSections, {classes: any, layer: number}> = {
//     [KnownSections.Base]: { classes: [Base], layer: 1 },
//     [KnownSections.obstacle]: { classes: [BrickWall, SteelWall, House, Tree], layer: 1 },
//     [KnownSections.water]: { classes: [Water], layer: 0 },
//     [KnownSections.bridges]: { classes: [Bridge], layer: 0 },
//     [KnownSections.foliage]: { classes: [Foliage], layer: 2 },
//     [KnownSections.tanks]: { classes: [Tank], layer: 1 },
//     [KnownSections.particles]: { classes: [Particle], layer: 1 },
//     [KnownSections.tankShell]: { classes: [TankShell], layer: 1 },
// }
