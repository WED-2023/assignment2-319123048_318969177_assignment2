// This JS file handle all the game functions from start to end including the score table and using the configuration that the user
// choose for the game, handling the movments, shooting, music (if needed), keeping the top-bar updated

// game started flag
let gameinit = false;
let scoresaved = false;

// game settings
const gamewidth = 600;
const gameheight = 450;
const playerareaheight = gameheight * 0.4; 
const playerwidth = 35;
const playerheight = 35;
const enemywidth = 30;
const enemyheight = 30;
const enemyrows = 4;
const enemycols = 5;
const enemyspace = 12;
const enemytop = 30;
const bulletwidth = 10;
const bulletheight = 10;
const badguyspeedfirst = 0.6;
const maxspeed = 5; 

// game stuff
let player;
let enemies = [];
let playerbullets = [];
let enemybullets = [];
let score = 0;
let lives = 3;
let gameactive = false;
let enemydir = 1; 
let enemyspeed = badguyspeedfirst;
let lastenemyshot = 0;
let speedup = 1;
let gameloop;
let speeduploop;
let enemycanshoot = true;

// game parts
let gamebox, scorebox, livesbox, gameoverbox, gamewinbox, finalscore, winscore, restartbtn, restartwinbtn;

// enemy image list
const enemyimages = [
    'photos/blue.png',   
    'photos/red.png',    
    'photos/pink.png',   
    'photos/orange.png'  
];

document.addEventListener('DOMContentLoaded', function() {
    // get page elements after page loads
    gamebox = document.getElementById('game-area');
    scorebox = document.getElementById('score');
    livesbox = document.getElementById('lives');
    gameoverbox = document.getElementById('game-over');
    gamewinbox = document.getElementById('game-win');
    finalscore = document.getElementById('final-score');
    winscore = document.getElementById('win-score');
    restartbtn = document.getElementById('restart-button');
    restartwinbtn = document.getElementById('restart-win-button');
    
    document.getElementById('restart-button').addEventListener('click', function() {
        startgame();
    });

    document.getElementById('restart-win-button').addEventListener('click', function() {
        startgame();
    });

    
    document.getElementById('new-game-button').addEventListener('click', function() {
        showscreen("configScreen");
    });

    document.getElementById('new-win-game-button').addEventListener('click', function() {
        showscreen("configScreen");
    });
});

// keyboard controls setup
document.addEventListener('keydown', (event) => {
    // list of keys for game
    const gamekeys = [
        'ArrowUp', 
        'ArrowDown', 
        'ArrowLeft', 
        'ArrowRight', 
        ' ',
        gameconfig.leftkey, 
        gameconfig.rightkey, 
        gameconfig.upkey,
        gameconfig.downkey,
        gameconfig.shootkey
    ];
    
    // stop browser from doing things with these keys
    if (gamekeys.includes(event.key)) {
        event.preventDefault();
    }
    
    // only do stuff if game is running
    if (!gameactive) return;
    
    const movespeed = 10;
    
    // movement controls
    if (event.key === gameconfig.leftkey) {
        // go left
        player.x = Math.max(0, player.x - movespeed);
    } else if (event.key === gameconfig.rightkey) {
        // go right
        player.x = Math.min(gamewidth - playerwidth, player.x + movespeed);
    } else if (event.key === gameconfig.upkey) {
        // go up
        const topline = gameheight - playerareaheight;
        // don't go above boundary
        player.y = Math.max(topline, player.y - movespeed);
    } else if (event.key === gameconfig.downkey) {
        // go down
        player.y = Math.min(gameheight - playerheight - 20, player.y + movespeed);
    } else if (event.key === gameconfig.shootkey) {
        // shoot
        playershoot();
    }
    
    // update player on screen
    player.element.style.left = `${player.x}px`;
    player.element.style.top = `${player.y}px`;
});

// start the game
function startgame() {
    cleargame();
    score = 0;
    lives = 3;
    playerbullets = [];
    enemybullets = [];
    gameactive = true;
    enemydir = 1;
    enemyspeed = badguyspeedfirst;
    speedup = 1;
    scoresaved = false;
    
    let playerelement = document.getElementById('player');
    if (!playerelement) {
        playerelement = document.createElement('div');
        playerelement.id = 'player';
        gamebox.appendChild(playerelement);
    }
    
    gameconfig.timeleft = gameconfig.gamelength * 60;
    
    player = {
        x: (gamewidth - playerwidth) / 2,
        y: gameheight - playerheight - 20,
        width: playerwidth,
        height: playerheight,
        element: playerelement
    };
    
    playerelement.style.width = `${playerwidth}px`;
    playerelement.style.height = `${playerheight}px`;
    playerelement.style.position = 'absolute';
    playerelement.style.backgroundImage = "url('photos/pacman.png')";
    playerelement.style.backgroundSize = 'contain';
    playerelement.style.backgroundRepeat = 'no-repeat';
    playerelement.style.backgroundPosition = 'center';
    playerelement.style.zIndex = "10"; 

    // player position on screen
    player.element.style.left = `${player.x}px`;
    player.element.style.top = `${player.y}px`;

    // create enemies
    makeenemies();
    updatescreen();
    
    gameoverbox.classList.add('hidden');
    gamewinbox.classList.add('hidden');
    
    
    addnewgamebutton();

    makeboundary();
    
    // start game timers
    if (gameloop) clearInterval(gameloop);
    if (speeduploop) clearInterval(speeduploop);
    
    gameloop = setInterval(update, 1000 / 60); 
    speeduploop = setInterval(makefaster, 5000);
    
    playmusic();
    starttimer();
}

// update score and lives
function updatescreen() {
    scorebox.textContent = score;
    livesbox.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        const heart = document.createElement('span');
        heart.className = 'heart-icon';
        livesbox.appendChild(heart);
    }
}

// clean up game stuff
function cleargame() {
    document.querySelectorAll('.bullet, .enemy-bullet, .enemy').forEach(el => el.remove());
    document.querySelectorAll('.timer').forEach(timer => timer.remove());

    playerbullets = [];
    enemybullets = [];
    enemies = [];
}

// make enemies
function makeenemies() {
    const totalenemywidth = enemycols * (enemywidth + enemyspace) - enemyspace;
    
    const startx = (gamewidth - totalenemywidth) / 2;

    for (let row = 0; row < enemyrows; row++) {
        for (let col = 0; col < enemycols; col++) {
            
            const enemy = document.createElement('div');
            enemy.className = 'enemy'; 
            gamebox.appendChild(enemy);

            // figure out where to put the enemy
            const x = startx + col * (enemywidth + enemyspace);
            const y = enemytop + row * (enemyheight + enemyspace);

            // set up the enemy
            enemy.style.left = `${x}px`;
            enemy.style.top = `${y}px`;
            enemy.style.backgroundImage = `url('${enemyimages[row]}')`; // use image based on row
            enemy.style.backgroundSize = 'contain'; 
            enemy.style.backgroundRepeat = 'no-repeat'; 
            enemy.style.backgroundPosition = 'center'; 
            enemy.style.width = `${enemywidth}px`;
            enemy.style.height = `${enemyheight}px`;
            enemy.style.position = 'absolute';

            // add enemy to our list
            enemies.push({
                x: x,
                y: y,
                width: enemywidth,
                height: enemyheight,
                element: enemy,
                row: row // remember row for points when killed
            });
        }
    }
}

// main game loop
function update() {
    if (!gameactive) return;

    // move all the things
    moveenemies();
    moveplayerbullets();
    moveenemybullets();

    // random enemy shooting
    tryenemyshoot();

    // check if things hit each other
    checkhits();

    // check if all enemies are dead
    if (enemies.length === 0) {
        wingame();
    }
}

// move the enemies
function moveenemies() {
    let hitedge = false;
    
    // check if any enemy reached the edge
    for (const enemy of enemies) {
        if (
            (enemydir === 1 && enemy.x + enemywidth >= gamewidth) ||
            (enemydir === -1 && enemy.x <= 0)
        ) {
            hitedge = true;
            break;
        }
    }
    
    // change direction if hit edge
    if (hitedge) {
        enemydir *= -1;
    }
    
    // move all enemies
    for (const enemy of enemies) {
        enemy.x += enemydir * enemyspeed * speedup;
        enemy.element.style.left = `${enemy.x}px`;
    }
}

// move player bullets
function moveplayerbullets() {
    for (let i = playerbullets.length - 1; i >= 0; i--) {
        const bullet = playerbullets[i];
        bullet.y -= 5; // bullet speed
        bullet.element.style.top = `${bullet.y}px`;
        
        // remove bullet if it goes off screen
        if (bullet.y + bulletheight < 0) {
            bullet.element.remove();
            playerbullets.splice(i, 1);
        }
    }
}

// move enemy bullets
function moveenemybullets() {
    for (let i = enemybullets.length - 1; i >= 0; i--) {
        const bullet = enemybullets[i];
        bullet.y += 4 * speedup;
        bullet.element.style.top = `${bullet.y}px`;

        // check if bullet went down 75% of screen
        if (bullet.y > gameheight * 0.75) {
            enemycanshoot = true;
        }

        // remove bullet if it goes off screen
        if (bullet.y > gameheight) {
            bullet.element.remove();
            enemybullets.splice(i, 1);
        }
    }
}

// try to make an enemy shoot
function tryenemyshoot() {
    if (!enemycanshoot || enemies.length === 0) return;
    
    // if no bullets, let an enemy shoot
    if (enemybullets.length === 0) {
        // pick random enemy
        const randomenemy = Math.floor(Math.random() * enemies.length);
        const shooter = enemies[randomenemy];
        
        makeenemybullet(shooter.x + enemywidth / 2 - bulletwidth / 2, shooter.y + enemyheight);
        
        // stop shooting for now
        enemycanshoot = false;
    } 
    // check if all bullets are far down the screen
    else if (enemybullets.every(bullet => bullet.y > (gameheight * 0.75))) {
        // pick random enemy
        const randomenemy = Math.floor(Math.random() * enemies.length);
        const shooter = enemies[randomenemy];
        
        makeenemybullet(shooter.x + enemywidth / 2 - bulletwidth / 2, shooter.y + enemyheight);
        
        // stop shooting for now
        enemycanshoot = false;
    }
}

// make an enemy bullet
function makeenemybullet(x, y) {
    const bullet = document.createElement('div');
    bullet.className = 'enemy-bullet';
    bullet.style.width = `${bulletwidth}px`;
    bullet.style.height = `${bulletheight}px`;
    bullet.style.position = 'absolute';
    bullet.style.backgroundColor = 'red';
    gamebox.appendChild(bullet);
    
    bullet.style.left = `${x}px`;
    bullet.style.top = `${y}px`;
    
    enemybullets.push({
        x: x,
        y: y,
        width: bulletwidth,
        height: bulletheight,
        element: bullet
    });
}

// player shooting
function playershoot() {
    const bullet = document.createElement('div');
    bullet.className = 'bullet';
    bullet.style.width = `${bulletwidth}px`;
    bullet.style.height = `${bulletheight}px`;
    bullet.style.position = 'absolute';
    
    // use bullet color from settings
    bullet.style.backgroundColor = gameconfig.bulletcolor;
    
    gamebox.appendChild(bullet);
    
    const bulletx = player.x + playerwidth / 2 - bulletwidth / 2;
    const bullety = player.y;
    
    bullet.style.left = `${bulletx}px`;
    bullet.style.top = `${bullety}px`;
    
    playerbullets.push({
        x: bulletx,
        y: bullety,
        width: bulletwidth,
        height: bulletheight,
        element: bullet
    });
}

// check all hits
function checkhits() {
    // check player bullets hitting enemies
    for (let i = playerbullets.length - 1; i >= 0; i--) {
        const bullet = playerbullets[i];
        
        for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];
            
            if (ishitting(bullet, enemy)) {
                // play sound
                playsound('playerhit');
                
                // figure out points based on row
                let points;
                switch (enemy.row) {
                    case 0: points = 20; break; // top row
                    case 1: points = 15; break;
                    case 2: points = 10; break;
                    case 3: points = 5; break;  // bottom row
                    default: points = 5;
                }
                
                // add score
                score += points;
                updatescreen();
                
                // remove enemy
                enemy.element.remove();
                enemies.splice(j, 1);
                
                // remove bullet
                bullet.element.remove();
                playerbullets.splice(i, 1);
                break;
            }
        }
    }
    
    // check enemy bullets hitting player
    for (let i = enemybullets.length - 1; i >= 0; i--) {
        const bullet = enemybullets[i];
        
        if (ishitting(bullet, player)) {
            // play sound
            playsound('enemyhit');
            
            // player got hit
            lives--;
            updatescreen();
            
            // remove bullet
            bullet.element.remove();
            enemybullets.splice(i, 1);
            
            // move player back to center
            player.x = (gamewidth - playerwidth) / 2; // center position
            player.element.style.left = `${player.x}px`;
            
            // check if dead
            if (lives <= 0) {
                endgame("lives");
            }
            
            break;
        }
    }
    
    // check if all enemies are gone
    if (enemies.length === 0) {
        wingame();
    }
}

// check if two things are hitting each other
function ishitting(thing1, thing2) {
    return (
        thing1.x < thing2.x + thing2.width &&
        thing1.x + thing1.width > thing2.x &&
        thing1.y < thing2.y + thing2.height &&
        thing1.y + thing1.height > thing2.y
    );
}

// make bad guys faster
function makefaster() {
    if (speedup < maxspeed) {
        speedup += 1;
    }
}

// game timer stuff
function starttimer() {
    // clear old timer
    if (gameconfig.timer) {
        clearInterval(gameconfig.timer);
    }
    
    // remove old timer display
    const oldtimers = document.querySelectorAll('.timer');
    oldtimers.forEach(timer => timer.remove());
    
    // add timer to screen
    const timerbox = document.createElement('div');
    timerbox.className = 'timer';
    timerbox.innerHTML = 'Time: <span id="time-remaining">0:00</span>';
    document.querySelector('.game-info').appendChild(timerbox);
    
    // make sure we have correct time
    if (!gameconfig.timeleft || gameconfig.timeleft <= 0) {
        gameconfig.timeleft = gameconfig.gamelength * 60;
    }
    
    // show time
    updatetimer();
    
    // start counting down
    gameconfig.timer = setInterval(function() {
        gameconfig.timeleft--;
        updatetimer();
        
        // check if time ran out
        if (gameconfig.timeleft <= 0) {
            clearInterval(gameconfig.timer);
            timeout();
        }
    }, 1000);
}

// update timer display
function updatetimer() {
    const mins = Math.floor(gameconfig.timeleft / 60);
    const secs = gameconfig.timeleft % 60;
    const timetext = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    document.getElementById('time-remaining').textContent = timetext;
}

// handle time running out
function timeout() {
    endgame("timeout");
}

// game over
function endgame(reason = "lives") {
    stopgame(true); // true = save score
    
    // set right message
    const endtitle = document.getElementById('game-over-title');
    
    // figure out how game ended
    let gameresult = "";
    
    if (reason === "lives" || lives <= 0) {
        endtitle.textContent = "You Lost!";
        gameresult = "Defeated";
    } else if (reason === "timeout") {
        if (score < 100) {
            endtitle.textContent = "You can do better";
            gameresult = "Time's up";
        } else {
            endtitle.textContent = "Winner!";
            gameresult = "Victory";
        }
    }
    
    // show final score and rank
    document.getElementById('final-score').textContent = score;
    document.getElementById('player-rank').textContent = getrank(score);
    
    // show high scores
    document.getElementById('high-scores-table').innerHTML = showhighscores();
    
    // show game over screen
    gameoverbox.classList.remove('hidden');
}

// win game
function wingame() {
    stopgame(true); // true = save score
    
    // set win message
    document.getElementById('game-win-title').textContent = "Champion!";
    
    // show win score and rank
    document.getElementById('win-score').textContent = score;
    document.getElementById('player-win-rank').textContent = getrank(score);
    
    // show high scores
    document.getElementById('win-high-scores-table').innerHTML = showhighscores();
    
    // show win screen
    gamewinbox.classList.remove('hidden');
}

// make boundary line for player area
function makeboundary() {
    // remove old boundary line
    const oldboundary = document.getElementById('player-boundary');
    if (oldboundary) {
        oldboundary.remove();
    }
    
    // make new boundary line
    const boundary = document.createElement('div');
    boundary.id = 'player-boundary';
    
    // make it look right
    boundary.style.position = 'absolute';
    boundary.style.left = '0';
    boundary.style.width = '100%';
    boundary.style.height = '2px';
    boundary.style.backgroundColor = 'rgba(249, 228, 46, 0.3)'; // yellow line
    
    // put it in right place (60% down)
    const boundarypos = gameheight - playerareaheight;
    boundary.style.top = `${boundarypos}px`;
    
    // add to game
    gamebox.appendChild(boundary);
}

// add new game button during play
function addnewgamebutton() {
    // check if button exists
    if (document.getElementById('new-game-button-ingame')) {
        return;
    }
    
    // make button
    const newgamebtn = document.createElement('button');
    newgamebtn.id = 'new-game-button-ingame';
    newgamebtn.className = 'ingame-button';
    newgamebtn.textContent = 'New Game';
    
    // add click handler
    newgamebtn.addEventListener('click', function() {
        // make sure player wants to quit
        if (confirm('Are you sure? your score will not be saved')) {
            // stop game
            stopgame(false); // false = don't save score
            
            // go back to setup screen
            startgame();
        }
    });
    
    // add button near game info
    const gameinfo = document.querySelector('.game-info');
    gameinfo.appendChild(newgamebtn);
}

// stop current game
function stopgame(savescore = true) {
    gameactive = false;
    
    // stop all timers
    if (gameloop) clearInterval(gameloop);
    if (speeduploop) clearInterval(speeduploop);
    
    // stop music
    stopmusic();
    
    // stop timer
    if (gameconfig.timer) clearInterval(gameconfig.timer);
    
    // save score if needed and not already saved
    if (savescore && !scoresaved) {
        scoresaved = true;
        
        // figure out how game ended
        let gameresult = "";
        
        if (lives <= 0) {
            gameresult = "Defeated";
        } else if (enemies.length === 0) {
            gameresult = "Champion";
        } else {
            gameresult = "Quit";
        }
        
        // save high score
        savehighscore(score, gameresult);
    }
}