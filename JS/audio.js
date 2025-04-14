// audio.js
// Audio management

// Audio elements
const audioElements = {
    backgroundMusic: new Audio('sounds/background_music.mp3'),
    playerHit: new Audio('sounds/shooting.mp3'),
    enemyHit: new Audio('sounds/enemy.wav')
};

// Initialize audio properties
function initAudio() {
    // Set looping for background music
    audioElements.backgroundMusic.loop = true;
    
    // Set initial volumes
    setMusicVolume(gameConfig.musicVolume);
    setEffectsVolume(gameConfig.effectsVolume);
}

// Set music volume
function setMusicVolume(volume) {
    const normalizedVolume = volume / 100; // Convert 0-100 to 0-1
    audioElements.backgroundMusic.volume = normalizedVolume;
}

// Set effects volume
function setEffectsVolume(volume) {
    const normalizedVolume = volume / 100; // Convert 0-100 to 0-1
    audioElements.playerHit.volume = normalizedVolume;
    audioElements.enemyHit.volume = normalizedVolume;
}

// Play a sound effect
function playSoundEffect(soundName) {
    if (!gameConfig.soundEffects) return; // Don't play if effects are disabled
    
    const sound = audioElements[soundName];
    if (sound) {
        // Reset sound to beginning if it's already playing
        sound.currentTime = 0;
        sound.play().catch(error => {
            console.log(`Error playing sound ${soundName}:`, error);
        });
    }
}

// Toggle background music
function toggleBackgroundMusic() {
    if (gameConfig.backgroundMusic) {
        playBackgroundMusic();
    } else {
        stopBackgroundMusic();
    }
}

// Play background music
function playBackgroundMusic() {
    if (!gameConfig.backgroundMusic) return; // Don't play if music is disabled
    
    audioElements.backgroundMusic.play().catch(error => {
        console.log('Error playing background music:', error);
    });
}

// Stop background music
function stopBackgroundMusic() {
    audioElements.backgroundMusic.pause();
    audioElements.backgroundMusic.currentTime = 0;
}