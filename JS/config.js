let gameconfig = {
    leftkey: "ArrowLeft", 
    rightkey: "ArrowRight", 
    upkey: "ArrowUp", 
    downkey: "ArrowDown", 
    shootkey: " ",
    bulletcolor: "#FFFF00", 
    gamelength: 2, 
    backgroundmusic: true, 
    musicvolume: 50, 
    soundeffects: true, 
    effectsvolume: 70, 
    timer: null, 
    timeleft: 0, 
};

document.addEventListener('DOMContentLoaded', function() {
    // start the config screen when page loads
    setupconfigscreen();
});


function setupconfigscreen() {
    fillkeyoptions();
    setupsound();
    document.getElementById('leftKey').value = gameconfig.leftkey;
    document.getElementById('rightKey').value = gameconfig.rightkey;
    document.getElementById('upKey').value = gameconfig.upkey;
    document.getElementById('downKey').value = gameconfig.downkey;
    document.getElementById('shootKey').value = gameconfig.shootkey;
    document.getElementById('bulletColor').value = gameconfig.bulletcolor;
    document.getElementById('gameDuration').value = gameconfig.gamelength;
    document.getElementById('backgroundMusic').checked = gameconfig.backgroundmusic;
    document.getElementById('musicVolume').value = gameconfig.musicvolume;
    document.getElementById('musicVolumeValue').textContent = `${gameconfig.musicvolume}%`;
    document.getElementById('soundEffects').checked = gameconfig.soundeffects;
    document.getElementById('effectsVolume').value = gameconfig.effectsvolume;
    document.getElementById('effectsVolumeValue').textContent = `${gameconfig.effectsvolume}%`;
    
    document.getElementById('bulletColor').addEventListener('change', function() {
        const color = this.value;
        document.getElementById('bulletColorPreview').style.backgroundColor = color;
    });
    
    document.getElementById('backgroundMusic').addEventListener('change', function() {
        const toggletext = this.parentElement.querySelector('.toggle-text');
        toggletext.textContent = this.checked ? 'On' : 'Off';
    });
    
    document.getElementById('soundEffects').addEventListener('change', function() {
        const toggletext = this.parentElement.querySelector('.toggle-text');
        toggletext.textContent = this.checked ? 'On' : 'Off';
    });
    
    document.getElementById('musicVolume').addEventListener('input', function () {
        const volume = this.value;
        document.getElementById('musicVolumeValue').textContent = `${volume}%`;
        setmusicvolume(volume); 
    });
    
    document.getElementById('effectsVolume').addEventListener('input', function () {
        const volume = this.value;
        document.getElementById('effectsVolumeValue').textContent = `${volume}%`;
        seteffectsvolume(volume); 
    });
    
    document.getElementById('startGameButton').addEventListener('click', function() {
        const duration = parseInt(document.getElementById('gameDuration').value);
        
        if (duration < 2) {
            alert("Time duaration must be at least 2 minutes");
            document.getElementById('gameDuration').value = 2; 
            return; 
        }
        
        const leftkey = document.getElementById('leftKey').value;
        const rightkey = document.getElementById('rightKey').value;
        const upkey = document.getElementById('upKey').value;
        const downkey = document.getElementById('downKey').value;
        const shootkey = document.getElementById('shootKey').value;
        
        const keys = [leftkey, rightkey, upkey, downkey, shootkey];
        const uniquekeys = [];
        
        for (let i = 0; i < keys.length; i++) {
          if (!uniquekeys.includes(keys[i])) {
            uniquekeys.push(keys[i]);
          }
        }
        
        if (keys.length !== uniquekeys.length) {
            alert("Please select different keys for all movement and shooting controls.");
            return;
        }
        
        gameconfig.leftkey = leftkey;
        gameconfig.rightkey = rightkey;
        gameconfig.upkey = upkey;
        gameconfig.downkey = downkey;
        gameconfig.shootkey = shootkey;
        gameconfig.bulletcolor = document.getElementById('bulletColor').value;
        gameconfig.gamelength = duration;
        gameconfig.backgroundmusic = document.getElementById('backgroundMusic').checked;
        gameconfig.musicvolume = parseInt(document.getElementById('musicVolume').value);
        gameconfig.soundeffects = document.getElementById('soundEffects').checked;
        gameconfig.effectsvolume = parseInt(document.getElementById('effectsVolume').value);
        
        setmusicvolume(gameconfig.musicvolume);
        seteffectsvolume(gameconfig.effectsvolume);
        
        gameconfig.timeleft = gameconfig.gamelength * 60;
        
        showscreen("gameScreen");
        
        if (!gameinit) {
            startgame();
            gameinit = true;
        } else {
            startgame();
        }
        
        playmusic();
    });
}

function fillkeyoptions() {
    const keydropdowns = [
        document.getElementById('leftKey'),
        document.getElementById('rightKey'),
        document.getElementById('upKey'),
        document.getElementById('downKey'),
        document.getElementById('shootKey')
    ];
    
    keydropdowns.forEach((dropdown, index) => {
        if (index !== 4) { 
            const spaceoption = document.createElement('option');
            spaceoption.value = " ";
            spaceoption.textContent = "Spacebar";
            dropdown.appendChild(spaceoption);
        }
    });
    
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    
    keydropdowns.forEach(dropdown => {
        letters.forEach(letter => {
            const option = document.createElement('option');
            option.value = letter.toLowerCase();
            option.textContent = letter;
            dropdown.appendChild(option);
        });
    });
}