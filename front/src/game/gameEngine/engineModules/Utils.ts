function getAudio(src: string) {
    const audio = new Audio()
    audio.preload = 'auto'
    audio.src = src
    return audio
}

export { getAudio }
