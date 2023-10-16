import GameObject from '../../../gameClasses/gameObject'

interface IAnimationConfig {
    animationSpeed: number
    isCyclicAnimation: boolean
    onAnimationEnd?: () => void
}

export class AnimationHandler {
    private readonly animations: IAnimation[]
    private timePassed: number
    private currentAnimationStep: number
    private currentAnimationStage: number
    private readonly isCyclicAnimation: boolean
    private readonly animationSpeed: number
    private entity: GameObject
    private readonly onAnimationEnd?: () => void
    private readonly animationContext = {
        currentAnimationStage: 0
    }

    constructor(animations: IAnimation[], entity: GameObject, { animationSpeed = 0.1, isCyclicAnimation = false, onAnimationEnd }: IAnimationConfig) {
        this.animations = animations
        this.timePassed = 0
        this.currentAnimationStep = 0
        this.currentAnimationStage = 0
        this.animationSpeed = animationSpeed
        this.isCyclicAnimation = isCyclicAnimation
        this.onAnimationEnd = onAnimationEnd
        this.entity = entity
    }

    changeAnimationStep(dt: number) {
        this.normalizeAnimationStage()
        this.timePassed += dt
        if (this.timePassed > this.animationSpeed) {
            if (this.currentAnimationStep !== this.currentAnimation.animationList.length - 1) {
                this.currentAnimationStep = this.currentAnimationStep + 1
            } else {
                if (this.isCyclicAnimation) {
                    this.currentAnimationStep = 0
                } else {
                    this.onAnimationEnd?.()
                }
            }
            this.entity.skin = this.currentAnimation.animationList[this.currentAnimationStep]
            this.timePassed = 0
        }
    }

    private get currentAnimation() {
        return this.animations[this.currentAnimationStage]
    }

    private normalizeAnimationStage() {
        if (!this.currentAnimation.condition()) {
            this.currentAnimationStage = this.animations.findIndex((animation, i) => animation.condition())
            this.currentAnimationStep = 0
        }
    }
}

export interface IAnimationHandler {
    animationHandler: AnimationHandler
}

export function haveAnimationHandler(entity: any): entity is IAnimationHandler {
    return (entity as IAnimationHandler).animationHandler instanceof AnimationHandler
}

export interface IAnimation {
    condition: () => boolean
    animationList: string[]
}
