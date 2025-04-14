const audioElements = {
    backgroundMusic: new Audio('sounds/background_music.mp3'),
    playerHit: new Audio('sounds/shooting.mp3'),
    enemyHit: new Audio('sounds/enemy.wav')
};

function initAudio() {
    audioElements.backgroundMusic.loop = true;
    setMusicVolume(gameConfig.musicVolume);
    setEffectsVolume(gameConfig.effectsVolume);
}

// music volume
function setMusicVolume(volume) {
    const normalizedVolume = volume / 100;
    audioElements.backgroundMusic.volume = normalizedVolume;
}

// effects volume
function setEffectsVolume(volume) {
    const normalizedVolume = volume / 100;
    audioElements.playerHit.volume = normalizedVolume;
    audioElements.enemyHit.volume = normalizedVolume;
}

// Play a sound effect
function playSoundEffect(soundName) {
    if (!gameConfig.soundEffects) return;
    
    const sound = audioElements[soundName];
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(error => {
            console.log(`Error playing sound ${soundName}:`, error);
        });
    }
}

//  background music
function toggleBackgroundMusic() {
    if (gameConfig.backgroundMusic) {
        playBackgroundMusic();
    } else {
        stopBackgroundMusic();
    }
}

// play music
function playBackgroundMusic() {
    if (!gameConfig.backgroundMusic) return;     
    audioElements.backgroundMusic.play().catch(error => {
        console.log('Error playing background music:', error);
    });
}

// stop music
function stopBackgroundMusic() {
    audioElements.backgroundMusic.pause();
    audioElements.backgroundMusic.currentTime = 0;
}