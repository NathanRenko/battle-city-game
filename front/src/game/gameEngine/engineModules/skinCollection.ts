import EntitySkins from './entitySkins';

class SkinCollection {
    cache = new Map();

    load() {
        for (const skin in EntitySkins) {
            let img = new Image();
            //@ts-ignore
            img.src = EntitySkins[skin];
            //@ts-ignore
            this.cache.set(EntitySkins[skin], img);
        }
    }
    get(skin: string): HTMLImageElement {
        return this.cache.get(skin);
    }
}

export default SkinCollection;
