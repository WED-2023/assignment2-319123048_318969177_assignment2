// config.js
// Game configuration settings

// Game configuration variables
let gameConfig = {
    leftKey: "ArrowLeft", // Default to left arrow
    rightKey: "ArrowRight", // Default to right arrow
    shootKey: " ", // Default to spacebar
    bulletColor: "#FFFF00", // Default to yellow
    gameDuration: 2, // Default to 2 minutes
    backgroundMusic: true, // Background music enabled by default
    musicVolume: 50, // Default music volume (0-100)
    soundEffects: true, // Sound effects enabled by default
    effectsVolume: 70, // Default effects volume (0-100)
    timer: null, // Game timer
    timeRemaining: 0, // Time remaining in seconds
};

// Initialize the configuration screen
function initConfigScreen() {
    populateShootingKeys();
    
    // Initialize audio
    initAudio();
    
    // Set default values
    document.getElementById('leftKey').value = gameConfig.leftKey;
    document.getElementById('rightKey').value = gameConfig.rightKey;
    document.getElementById('shootKey').value = gameConfig.shootKey;
    document.getElementById('bulletColor').value = gameConfig.bulletColor;
    document.getElementById('gameDuration').value = gameConfig.gameDuration;
    document.getElementById('backgroundMusic').checked = gameConfig.backgroundMusic;
    document.getElementById('musicVolume').value = gameConfig.musicVolume;
    document.getElementById('musicVolumeValue').textContent = `${gameConfig.musicVolume}%`;
    document.getElementById('soundEffects').checked = gameConfig.soundEffects;
    document.getElementById('effectsVolume').value = gameConfig.effectsVolume;
    document.getElementById('effectsVolumeValue').textContent = `${gameConfig.effectsVolume}%`;
    
    // Update bullet color preview on change
    document.getElementById('bulletColor').addEventListener('change', function() {
        const color = this.value;
        document.getElementById('bulletColorPreview').style.backgroundColor = color;
    });
    
    // Toggle background music text
    document.getElementById('backgroundMusic').addEventListener('change', function() {
        const toggleText = this.parentElement.querySelector('.toggle-text');
        toggleText.textContent = this.checked ? 'On' : 'Off';
    });
    
    // Toggle sound effects text
    document.getElementById('soundEffects').addEventListener('change', function() {
        const toggleText = this.parentElement.querySelector('.toggle-text');
        toggleText.textContent = this.checked ? 'On' : 'Off';
    });
    
    // Update music volume display
    document.getElementById('musicVolume').addEventListener('input', function () {
        const volume = this.value;
        document.getElementById('musicVolumeValue').textContent = `${volume}%`;
        setMusicVolume(volume); 
    });
    
    // Update effects volume display
    document.getElementById('effectsVolume').addEventListener('input', function () {
        const volume = this.value;
        document.getElementById('effectsVolumeValue').textContent = `${volume}%`;
        setEffectsVolume(volume); 
    });
    
    // Add event listener for the start game button
    document.getElementById('startGameButton').addEventListener('click', function() {
        // Get the duration value
        const duration = parseInt(document.getElementById('gameDuration').value);
        
        // Validate the duration is at least 2 minutes
        if (duration < 2) {
            alert("זמן המשחק חייב להיות לפחות 2 דקות.");
            document.getElementById('gameDuration').value = 2; // Reset to minimum
            return; // Stop execution of the function
        }
        
        // Check that left and right keys are different
        const leftKey = document.getElementById('leftKey').value;
        const rightKey = document.getElementById('rightKey').value;
        
        if (leftKey === rightKey) {
            alert("Please select different keys for left and right movement.");
            return;
        }
        
        // Save the configuration
        gameConfig.leftKey = leftKey;
        gameConfig.rightKey = rightKey;
        gameConfig.shootKey = document.getElementById('shootKey').value;
        gameConfig.bulletColor = document.getElementById('bulletColor').value;
        gameConfig.gameDuration = duration;
        gameConfig.backgroundMusic = document.getElementById('backgroundMusic').checked;
        gameConfig.musicVolume = parseInt(document.getElementById('musicVolume').value);
        gameConfig.soundEffects = document.getElementById('soundEffects').checked;
        gameConfig.effectsVolume = parseInt(document.getElementById('effectsVolume').value);
        
        // Apply sound settings
        setMusicVolume(gameConfig.musicVolume);
        setEffectsVolume(gameConfig.effectsVolume);
        
        // Convert minutes to seconds for the timer
        gameConfig.timeRemaining = gameConfig.gameDuration * 60;
        
        // Show the game screen
        showScreen("gameScreen");
        
        // Initialize and start the game
        if (!gameInitialized) {
            initGame();
            gameInitialized = true;
        } else {
            initGame();
        }
        
        // Start background music when game starts
        playBackgroundMusic();
    });
}

// Populate the letter keys in the shooting key dropdown
function populateShootingKeys() {
    const shootKeySelect = document.getElementById('shootKey');
    
    // Add all letter keys (A-Z)
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    letters.forEach(letter => {
        const option = document.createElement('option');
        option.value = letter.toLowerCase();
        option.textContent = letter;
        shootKeySelect.appendChild(option);
    });
}

// Function to validate minimum duration
function validateMinDuration(input) {
    if (input.value < 2) {
        alert("זמן המשחק חייב להיות לפחות 2 דקות.");
        input.value = 2;
    }
}