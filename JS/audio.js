// This JS file handle all the functions for aduio in the game

// sound files
const sounds = {
    backgroundmusic: new Audio('sounds/background_music.mp3'),
    playerhit: new Audio('sounds/shooting.mp3'),
    enemyhit: new Audio('sounds/enemy.wav')
};

function setupsound() {
    sounds.backgroundmusic.loop = true;
    setmusicvolume(gameconfig.musicvolume);
    seteffectsvolume(gameconfig.effectsvolume);
}

// set music volume
function setmusicvolume(volume) {
    const realvolume = volume / 100;
    sounds.backgroundmusic.volume = realvolume;
}

// set sound effects volume
function seteffectsvolume(volume) {
    const realvolume = volume / 100;
    sounds.playerhit.volume = realvolume;
    sounds.enemyhit.volume = realvolume;
}

// play a sound effect
function playsound(soundname) {
    if (!gameconfig.soundeffects) return;
    
    const sound = sounds[soundname];
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(error => {
            console.log(`Error playing sound ${soundname}:`, error);
        });
    }
}

// turn music on/off
function togglemusic() {
    if (gameconfig.backgroundmusic) {
        playmusic();
    } else {
        stopmusic();
    }
}

// start playing music
function playmusic() {
    if (!gameconfig.backgroundmusic) return;
    
    sounds.backgroundmusic.play().catch(error => {
        console.log('Error playing background music:', error);
    });
}

// stop the music
function stopmusic() {
    sounds.backgroundmusic.pause();
    sounds.backgroundmusic.currentTime = 0;
}