import EntitySkins from './entitySkins'

class SkinCollection {
    cache = new Map()

    load() {
        for (const skin in EntitySkins) {
            const img = new Image()
            img.src = EntitySkins[skin]
            this.cache.set(EntitySkins[skin], img)
        }
    }

    get(skin: string): HTMLImageElement {
        return this.cache.get(skin)
    }
}

export default SkinCollection
