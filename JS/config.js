let gameConfig = {
    leftKey: "ArrowLeft", 
    rightKey: "ArrowRight", 
    upKey: "ArrowUp", 
    downKey: "ArrowDown", 
    shootKey: " ",
    bulletColor: "#FFFF00", 
    gameDuration: 2, 
    backgroundMusic: true, 
    musicVolume: 50, 
    soundEffects: true, 
    effectsVolume: 70, 
    timer: null, 
    timeRemaining: 0, 
};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the configuration screen when document is ready
    initConfigScreen();
});


function initConfigScreen() {
    populateKeyDropdowns();
    initAudio();
    document.getElementById('leftKey').value = gameConfig.leftKey;
    document.getElementById('rightKey').value = gameConfig.rightKey;
    document.getElementById('upKey').value = gameConfig.upKey;
    document.getElementById('downKey').value = gameConfig.downKey;
    document.getElementById('shootKey').value = gameConfig.shootKey;
    document.getElementById('bulletColor').value = gameConfig.bulletColor;
    document.getElementById('gameDuration').value = gameConfig.gameDuration;
    document.getElementById('backgroundMusic').checked = gameConfig.backgroundMusic;
    document.getElementById('musicVolume').value = gameConfig.musicVolume;
    document.getElementById('musicVolumeValue').textContent = `${gameConfig.musicVolume}%`;
    document.getElementById('soundEffects').checked = gameConfig.soundEffects;
    document.getElementById('effectsVolume').value = gameConfig.effectsVolume;
    document.getElementById('effectsVolumeValue').textContent = `${gameConfig.effectsVolume}%`;
    
    document.getElementById('bulletColor').addEventListener('change', function() {
        const color = this.value;
        document.getElementById('bulletColorPreview').style.backgroundColor = color;
    });
    
    document.getElementById('backgroundMusic').addEventListener('change', function() {
        const toggleText = this.parentElement.querySelector('.toggle-text');
        toggleText.textContent = this.checked ? 'On' : 'Off';
    });
    
    document.getElementById('soundEffects').addEventListener('change', function() {
        const toggleText = this.parentElement.querySelector('.toggle-text');
        toggleText.textContent = this.checked ? 'On' : 'Off';
    });
    
    document.getElementById('musicVolume').addEventListener('input', function () {
        const volume = this.value;
        document.getElementById('musicVolumeValue').textContent = `${volume}%`;
        setMusicVolume(volume); 
    });
    
    document.getElementById('effectsVolume').addEventListener('input', function () {
        const volume = this.value;
        document.getElementById('effectsVolumeValue').textContent = `${volume}%`;
        setEffectsVolume(volume); 
    });
    
    document.getElementById('startGameButton').addEventListener('click', function() {
        const duration = parseInt(document.getElementById('gameDuration').value);
        
        if (duration < 2) {
            alert("זמן המשחק חייב להיות לפחות 2 דקות.");
            document.getElementById('gameDuration').value = 2; 
            return; 
        }
        
        const leftKey = document.getElementById('leftKey').value;
        const rightKey = document.getElementById('rightKey').value;
        const upKey = document.getElementById('upKey').value;
        const downKey = document.getElementById('downKey').value;
        const shootKey = document.getElementById('shootKey').value;
        
        const keys = [leftKey, rightKey, upKey, downKey, shootKey];
        const uniqueKeys = [];
        
        for (let i = 0; i < keys.length; i++) {
          if (!uniqueKeys.includes(keys[i])) {
            uniqueKeys.push(keys[i]);
          }
        }
        
        if (keys.length !== uniqueKeys.length) {
            alert("Please select different keys for all movement and shooting controls.");
            return;
        }
        
        gameConfig.leftKey = leftKey;
        gameConfig.rightKey = rightKey;
        gameConfig.upKey = upKey;
        gameConfig.downKey = downKey;
        gameConfig.shootKey = shootKey;
        gameConfig.bulletColor = document.getElementById('bulletColor').value;
        gameConfig.gameDuration = duration;
        gameConfig.backgroundMusic = document.getElementById('backgroundMusic').checked;
        gameConfig.musicVolume = parseInt(document.getElementById('musicVolume').value);
        gameConfig.soundEffects = document.getElementById('soundEffects').checked;
        gameConfig.effectsVolume = parseInt(document.getElementById('effectsVolume').value);
        
        setMusicVolume(gameConfig.musicVolume);
        setEffectsVolume(gameConfig.effectsVolume);
        
        gameConfig.timeRemaining = gameConfig.gameDuration * 60;
        
        showScreen("gameScreen");
        
        if (!gameInitialized) {
            initGame();
            gameInitialized = true;
        } else {
            initGame();
        }
        
        playBackgroundMusic();
    });
}

function populateKeyDropdowns() {
    const keyDropdowns = [
        document.getElementById('leftKey'),
        document.getElementById('rightKey'),
        document.getElementById('upKey'),
        document.getElementById('downKey'),
        document.getElementById('shootKey')
    ];
    
    keyDropdowns.forEach((dropdown, index) => {
        if (index !== 4) { 
            const spaceOption = document.createElement('option');
            spaceOption.value = " ";
            spaceOption.textContent = "Spacebar";
            dropdown.appendChild(spaceOption);
        }
    });
    
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    
    keyDropdowns.forEach(dropdown => {
        letters.forEach(letter => {
            const option = document.createElement('option');
            option.value = letter.toLowerCase();
            option.textContent = letter;
            dropdown.appendChild(option);
        });
    });
}
