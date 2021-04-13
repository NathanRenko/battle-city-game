function getAudio(src: string) {
    let audio = new Audio();
    audio.preload = 'auto';
    audio.src = src;
    return audio;
}

export { getAudio };
