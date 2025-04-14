/*
    TO DO LIST:
    5) Sound and Effects:
        -מוזיקת רקע למשחק
        -צליל פגיעה של השחקן בחללית רעה
        -צליל פסילה של השחקן
    6) Points:
        -כל פגיעה בחללית מעלה את הניקוד בהתאם (בתחילת כל משחק הניקוד הוא 0) 
        -כל פסילה של השחקן מספר החיים שיש לו יורד בהתאם (בתחילת כל משחק הוא 3)
        -להפוך את זה החיים של השחקן לעיצוב נורמלי ולא מספרי (לב,חללית...)
        -לוודא שפסילה (שאינה סיום משחק) לא מאפסת את הניקוד של השחקן
        - 3 פסילות מסיימות את המשחק או בתום הזמן
        -At the end of the game, the player's final score will be displayed.
            If the game ends due to disqualifications, the message "You Lost!" will be displayed. 
            If it ends due to timeout, then: If the player has scored less than 100 points, 
            "You can do better" will be written with the number of points he has scored, otherwise it will be written "Winner!"
            If the game ends because the player has managed to eliminate all the bad spaceships, the message "Champion!" will be displayed.
        -At the end of the game, the player will be shown his personal highscore table 
            (the player's game history will be saved and at the end of each game a list will be shown with the score history and his current position 
            in the table after the last game). If the player changes (a new player arrives) then the previous player's score history is deleted.
        -An option should be added to "-New Game" that, when clicked, will result in a new game - the previous game (which was stopped in the middle) 
            will not be saved in the highscore table.
    7) Read.Me file:
    שיכיל פירוט על העבודה (כל מה שתרצו שהבודק ידע, על מי האתר וכו'...) + מספר תעודת זהות + קישור למקום בו רץ האתר שלכם.
    
    בונוס:
    לסטודנטים אשר יממשו תנועה אלכסונית של כל האלמנטים במשחק (התנועה של כל החלליות והתנועה של כל היריות).

*/

// Audio elements
const audioElements = {
    backgroundMusic: new Audio('sounds/background_music.mp3'),
    playerHit: new Audio('sounds/shooting.mp3'),
    enemyHit: new Audio('sounds/enemy.wav')
};

// Function to hide all screens
function hideAllScreens() {
    document.querySelectorAll('.screen').forEach(function(screen) {
        screen.style.display = 'none';
    });
}

// Show specific screen by ID
function showScreen(screenId) {
    hideAllScreens();
    document.getElementById(screenId).style.display = 'block';

    if (typeof audioElements !== 'undefined' && audioElements.backgroundMusic) {
        if (screenId !== 'gameScreen') {
            audioElements.backgroundMusic.pause();
        }
    }
}

// Show welcome screen initially
showScreen("welcomeScreen");

// Navigation logic from one screen to the other using the buttons
document.getElementById("goToWelcome").addEventListener("click", function() {
    showScreen("welcomeScreen");
});

document.getElementById("goToLogin").addEventListener("click", function() {
    document.getElementById("loginUsername").value = "";
    document.getElementById("loginPassword").value = "";
    showScreen("loginScreen");
});

document.getElementById("goToRegister").addEventListener("click", function() {
    clearRegistrationForm();
    showScreen("registrationScreen");
});


// Register page navigation
document.getElementById("registerButton").addEventListener("click", function() {
    clearRegistrationForm();
    showScreen("registrationScreen");
});

document.getElementById("loginButton").addEventListener("click", function() {
    document.getElementById("loginUsername").value = "";
    document.getElementById("loginPassword").value = "";
    showScreen("loginScreen");
});

// To navigate to login page from registration form
document.getElementById("toLogin").addEventListener("click", function() {
    document.getElementById("loginUsername").value = "";
    document.getElementById("loginPassword").value = "";
    showScreen("loginScreen");
});

// To navigate to registration form from login page
document.getElementById("toRegister").addEventListener("click", function() {
    clearRegistrationForm();
    showScreen("registrationScreen");
});

// A function to clear the register form so when the user click it again all the text boxes will be empty
function clearRegistrationForm() {
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("confirmPassword").value = "";
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("email").value = "";

    // Reset birth date dropdowns to first option
    document.getElementById("birthYear").selectedIndex = 0;
    document.getElementById("birthMonth").selectedIndex = 0;
    populateDays(); // Refresh day list
    document.getElementById("birthDay").selectedIndex = 0;
}

// מילון משתמשים לדוגמה
const users = {
        "p": "testuser"
};

// Login form validation 
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    // checking if the user is in the dictionary
    if (users.hasOwnProperty(username) && users[username] === password) {
        // Set current player
        setCurrentPlayer(username);
        
        // Clear previous player's scores from memory (not storage)
        clearPreviousPlayerScores();
        
        // if yes, move to the configoration screen
        setTimeout(() => {
            showScreen("configScreen");
            
            // if there is an error
            if (typeof loginMsg !== "undefined") {
                loginMsg.remove();
            }
        }, 500);
    } else {
        // if the user is not in the dictoinary 
        alert("שם משתמש או סיסמה שגויים, נסה שוב.");
    }
});


// Function to update the game's HUD (heads-up display)
function updateHUD() {
    // Update score
    scoreElement.textContent = score;
    
    // Update lives
    livesElement.textContent = lives;
    
}

// Registration form validation
document.getElementById("registerSubmitButton").addEventListener("click", function () {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const email = document.getElementById("email").value.trim();
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const birthYear = document.getElementById("birthYear").value;
    const birthMonth = document.getElementById("birthMonth").value;
    const birthDay = document.getElementById("birthDay").value;

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    const nameRegex = /^[A-Za-z\u0590-\u05FF\s'-]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!firstName || !lastName || !email || !username || !password || !confirmPassword || !birthYear || !birthMonth || !birthDay) {
        alert("אנא מלא את כל השדות לפני ההרשמה.");
        return;
    }

    if (!emailRegex.test(email)) {
        alert("כתובת אימייל לא חוקית.");
        return;
    }

    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
        alert("שם פרטי ושם משפחה חייבים להכיל רק אותיות.");
        return;
    }

    if (!passwordRegex.test(password)) {
        alert("הסיסמה חייבת להכיל לפחות 8 תווים, לפחות אות אחת ולפחות ספרה אחת.");
        return;
    }

    if (password !== confirmPassword) {
        alert("הסיסמאות אינן תואמות.");
        return;
    }

    // if (users[username]) {
    //     alert("שם המשתמש כבר קיים במערכת.");
    //     return;
    // }

    users[username] = password;
    alert("נרשמת בהצלחה! כעת תוכל להתחבר.");
    showScreen("loginScreen");
});

// Populate birth date selects (year, month, day)
const yearSelect = document.getElementById('birthYear');
const monthSelect = document.getElementById('birthMonth');
const daySelect = document.getElementById('birthDay');
const currentYear = new Date().getFullYear();

// Populate years
for (let i = currentYear; i >= 1900; i--) {
    let option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    yearSelect.appendChild(option);
}

// Populate months
for (let i = 1; i <= 12; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.textContent = i < 10 ? `0${i}` : i;
    monthSelect.appendChild(option);
}

// Populate days based on selected year and month
function populateDays() {
    const month = monthSelect.value;
    const year = yearSelect.value;

    const daysInMonth = new Date(year, month, 0).getDate();
    daySelect.innerHTML = '';

    for (let i = 1; i <= daysInMonth; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = i < 10 ? `0${i}` : i;
        daySelect.appendChild(option);
    }
}

monthSelect.addEventListener('change', populateDays);
yearSelect.addEventListener('change', populateDays);

// Initialize the days when month or year is selected
populateDays();


// about-modal.js

$(document).ready(function() {
    // open the about screen
    $("#openAboutBtn").click(function() {
        $("#aboutModal").css("display", "block");
    });
    
    // closing it with the X button
    $(".about-close").click(function() {
        $("#aboutModal").css("display", "none");
    });
    
    // closing it with clicking on anything outside of it
    $(window).click(function(event) {
        if ($(event.target).is("#aboutModal")) {
            $("#aboutModal").css("display", "none");
        }
    });
    
    // closing by clicking on ESC
    $(document).keydown(function(event) {
        if (event.keyCode == 27) { // ESC button in ASCII
            $("#aboutModal").css("display", "none");
        }
    });
});

// High score management functions
let currentPlayer = null;

// Function to save current player's username
function setCurrentPlayer(username) {
    currentPlayer = username;
    localStorage.setItem('currentPlayer', username);
}

// Function to get the current player's username
function getCurrentPlayer() {
    if (!currentPlayer) {
        currentPlayer = localStorage.getItem('currentPlayer');
    }
    return currentPlayer;
}

// Function to save a high score
function saveHighScore(score, gameResult) {
    const player = getCurrentPlayer();
    if (!player) return; // No player logged in
    
    // Get existing scores
    let highScores = getHighScores();
    
    // Add new score
    const newScore = {
        score: score,
        date: new Date().toLocaleString(),
        result: gameResult
    };
    
    highScores.push(newScore);
    
    // Sort by score (highest first)
    highScores.sort((a, b) => b.score - a.score);
    
    // Save back to localStorage
    localStorage.setItem(`highScores_${player}`, JSON.stringify(highScores));
    
    return getRank(score);
}

// Function to get all high scores for current player
function getHighScores() {
    const player = getCurrentPlayer();
    if (!player) return []; // No player logged in
    
    const scoresJSON = localStorage.getItem(`highScores_${player}`);
    return scoresJSON ? JSON.parse(scoresJSON) : [];
}

// Function to clear high scores when a new player logs in
function clearPreviousPlayerScores() {
    // We don't actually delete - we just don't load them
    // They'll still be in localStorage if the previous player logs back in
}

// Function to get the rank of a score in the high scores
function getRank(score) {
    const scores = getHighScores();
    return scores.findIndex(s => s.score === score) + 1;
}

// Function to display high scores table
function displayHighScoresTable() {
    const highScores = getHighScores();
    
    if (highScores.length === 0) {
        return '<p>No high scores yet. Play a game!</p>';
    }
    
    let tableHTML = `
        <table class="high-scores-table">
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Score</th>
                    <th>Date</th>
                    <th>Result</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    highScores.forEach((score, index) => {
        tableHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${score.score}</td>
                <td>${score.date}</td>
                <td>${score.result}</td>
            </tr>
        `;
    });
    
    tableHTML += `
            </tbody>
        </table>
    `;
    
    return tableHTML;
}





// Restart game button handlers
document.getElementById('restart-button').addEventListener('click', function() {
    initGame();
});

document.getElementById('restart-win-button').addEventListener('click', function() {
    initGame();
});

// New game button handlers (won't save the score)
document.getElementById('new-game-button').addEventListener('click', function() {
    showScreen("configScreen");
});

document.getElementById('new-win-game-button').addEventListener('click', function() {
    showScreen("configScreen");
});




// GAME CODE STARTS HERE
let gameInitialized = false;

// Game constants
const GAME_WIDTH = 600;
const GAME_HEIGHT = 450;
const PLAYER_AREA_HEIGHT = GAME_HEIGHT * 0.4; // 40% of game area for player movement
const PLAYER_WIDTH = 35;
const PLAYER_HEIGHT = 35;
const ENEMY_WIDTH = 30;
const ENEMY_HEIGHT = 30;
const ENEMY_ROWS = 4;
const ENEMY_COLS = 5;
const ENEMY_PADDING = 12;
const ENEMY_TOP_MARGIN = 30;
const BULLET_WIDTH = 5;
const BULLET_HEIGHT = 15;
const ENEMY_MOVE_SPEED_INITIAL = 1;
const MAX_SPEED_MULTIPLIER = 5; // After 4 accelerations (initial + 4 = 5)

// Game state
let player;
let enemies = [];
let playerBullets = [];
let enemyBullets = [];
let score = 0;
let lives = 3;
let gameRunning = false;
let enemyMoveDirection = 1; // 1 for right, -1 for left
let enemyMoveSpeed = ENEMY_MOVE_SPEED_INITIAL;
let lastEnemyBulletTime = 0;
let speedMultiplier = 1;
let gameInterval;
let speedIncreaseInterval;
let canEnemyShoot = true;

// Game elements
const gameArea = document.getElementById('game-area');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const gameOverElement = document.getElementById('game-over');
const gameWinElement = document.getElementById('game-win');
const finalScoreElement = document.getElementById('final-score');
const winScoreElement = document.getElementById('win-score');
const restartButton = document.getElementById('restart-button');
const restartWinButton = document.getElementById('restart-win-button');
// Update enemy image mapping
const enemyImages = [
    'photos/blue.png', // top row (index 0)
    'photos/red.png',   // second row (index 1)
    'photos/pink.png',    // third row (index 2)
    'photos/orange.png'    // bottom row (index 3)
];


// Clear game elements
function clearGameElements() {
    // Clear all bullets
    document.querySelectorAll('.bullet, .enemy-bullet, .enemy').forEach(el => el.remove());
    playerBullets = [];
    enemyBullets = [];
    enemies = [];
}


 // Function to create enemy spaceships and place them on the game area.

function createEnemies() {
    // Calculate the total width of the enemies' grid
    const totalEnemyWidth = ENEMY_COLS * (ENEMY_WIDTH + ENEMY_PADDING) - ENEMY_PADDING;
    
    // Calculate the starting X position for the first enemy to center them in the game area
    const startX = (GAME_WIDTH - totalEnemyWidth) / 2;

    // Loop through each row and column to create enemies
    for (let row = 0; row < ENEMY_ROWS; row++) {
        for (let col = 0; col < ENEMY_COLS; col++) {
            // Create a div element for each enemy
            const enemy = document.createElement('div');
            enemy.className = 'enemy'; // Add the 'enemy' class for styling
            gameArea.appendChild(enemy); // Add the enemy element to the game area

            // Calculate the X and Y positions for the enemy
            const x = startX + col * (ENEMY_WIDTH + ENEMY_PADDING);
            const y = ENEMY_TOP_MARGIN + row * (ENEMY_HEIGHT + ENEMY_PADDING);

            // Set the enemy's position and background image
            enemy.style.left = `${x}px`;
            enemy.style.top = `${y}px`;
            enemy.style.backgroundImage = `url('${enemyImages[row]}')`; // Assign image based on row
            enemy.style.backgroundSize = 'contain'; // Ensure the image fits the enemy element
            enemy.style.backgroundRepeat = 'no-repeat'; // Prevent image repetition
            enemy.style.backgroundPosition = 'center'; // Center the image inside the enemy div

            // Push the newly created enemy into the enemies array
            enemies.push({
                x: x,
                y: y,
                width: ENEMY_WIDTH,
                height: ENEMY_HEIGHT,
                element: enemy,
                row: row // Store the row to determine the points awarded when destroyed
            });
        }
    }
}
    
// Game loop
function gameLoop() {
    if (!gameRunning) return;

    // Move enemies
    moveEnemies();

    // Move bullets
    movePlayerBullets();
    moveEnemyBullets();

    // Random enemy shooting
    tryEnemyShooting();

    // Check collisions
    checkCollisions();

    // Check if all enemies are destroyed
    if (enemies.length === 0) {
        gameWin();
    }
}

// Move the enemies
function moveEnemies() {
    let reachedEdge = false;
    
    // Check if any enemy reached the edge
    for (const enemy of enemies) {
        if (
            (enemyMoveDirection === 1 && enemy.x + ENEMY_WIDTH >= GAME_WIDTH) ||
            (enemyMoveDirection === -1 && enemy.x <= 0)
        ) {
            reachedEdge = true;
            break;
        }
    }
    
    // Change direction if reached edge
    if (reachedEdge) {
        enemyMoveDirection *= -1;
    }
    
    // Move all enemies
    for (const enemy of enemies) {
        enemy.x += enemyMoveDirection * enemyMoveSpeed * speedMultiplier;
        enemy.element.style.left = `${enemy.x}px`;
    }
}

// Move player bullets
function movePlayerBullets() {
    for (let i = playerBullets.length - 1; i >= 0; i--) {
        const bullet = playerBullets[i];
        bullet.y -= 5; // Bullet speed
        bullet.element.style.top = `${bullet.y}px`;
        
        // Remove bullet if it goes out of bounds
        if (bullet.y + BULLET_HEIGHT < 0) {
            bullet.element.remove();
            playerBullets.splice(i, 1);
        }
    }
}

// Move enemy bullets
function moveEnemyBullets() {
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        const bullet = enemyBullets[i];
        bullet.y += 5 * speedMultiplier; // Bullet speed increases with enemy speed
        bullet.element.style.top = `${bullet.y}px`;
        
        // Remove bullet if it goes out of bounds
        if (bullet.y > GAME_HEIGHT) {
            bullet.element.remove();
            enemyBullets.splice(i, 1);
        }
    }
}

// Try enemy shooting based on requirements
function tryEnemyShooting() {
    if (!canEnemyShoot || enemies.length === 0) return;
    
    // If there are no enemy bullets, allow shooting
    if (enemyBullets.length === 0) {
        // Select a random enemy to shoot
        const randomIndex = Math.floor(Math.random() * enemies.length);
        const shootingEnemy = enemies[randomIndex];
        
        createEnemyBullet(shootingEnemy.x + ENEMY_WIDTH / 2 - BULLET_WIDTH / 2, shootingEnemy.y + ENEMY_HEIGHT);
        
        // Set flag to prevent continuous shooting
        canEnemyShoot = false;
    } 
    // Check if all bullets have traveled 3/4 of the screen
    else if (enemyBullets.every(bullet => bullet.y > (GAME_HEIGHT * 0.75))) {
        // Select a random enemy to shoot
        const randomIndex = Math.floor(Math.random() * enemies.length);
        const shootingEnemy = enemies[randomIndex];
        
        createEnemyBullet(shootingEnemy.x + ENEMY_WIDTH / 2 - BULLET_WIDTH / 2, shootingEnemy.y + ENEMY_HEIGHT);
        
        // Reset flag to prevent continuous shooting
        canEnemyShoot = false;
    }
}
// Create enemy bullet
function createEnemyBullet(x, y) {
    const bullet = document.createElement('div');
    bullet.className = 'enemy-bullet';
    gameArea.appendChild(bullet);
    
    bullet.style.left = `${x}px`;
    bullet.style.top = `${y}px`;
    
    enemyBullets.push({
        x: x,
        y: y,
        width: BULLET_WIDTH,
        height: BULLET_HEIGHT,
        element: bullet
    });
}


// Player shooting
function playerShoot() {
    const bullet = document.createElement('div');
    bullet.className = 'bullet';
    
    // Apply custom bullet color from game configuration
    bullet.style.backgroundColor = gameConfig.bulletColor;
    
    gameArea.appendChild(bullet);
    
    const bulletX = player.x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2;
    const bulletY = player.y;
    
    bullet.style.left = `${bulletX}px`;
    bullet.style.top = `${bulletY}px`;
    
    playerBullets.push({
        x: bulletX,
        y: bulletY,
        width: BULLET_WIDTH,
        height: BULLET_HEIGHT,
        element: bullet
    });
}

// Check all collisions
function checkCollisions() {
    // Check player bullets hitting enemies
    for (let i = playerBullets.length - 1; i >= 0; i--) {
        const bullet = playerBullets[i];
        
        for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];
            
            if (isColliding(bullet, enemy)) {
                // Play enemy hit sound effect
                playSoundEffect('enemyHit');
                
                // Calculate score based on enemy row
                let points;
                switch (enemy.row) {
                    case 0: points = 20; break; // Top row
                    case 1: points = 15; break;
                    case 2: points = 10; break;
                    case 3: points = 5; break;  // Bottom row
                    default: points = 5;
                }
                
                // Update score
                score += points;
                updateHUD();
                
                // Remove enemy
                enemy.element.remove();
                enemies.splice(j, 1);
                
                // Remove bullet
                bullet.element.remove();
                playerBullets.splice(i, 1);
                break;
            }
        }
    }
    
    // Check enemy bullets hitting player
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        const bullet = enemyBullets[i];
        
        if (isColliding(bullet, player)) {
            // Play player hit sound effect
            playSoundEffect('playerHit');
            
            // Player hit
            lives--;
            updateHUD();
            
            // Remove bullet
            bullet.element.remove();
            enemyBullets.splice(i, 1);
            
            // Reset player to center position instead of random
            player.x = (GAME_WIDTH - PLAYER_WIDTH) / 2; // Center horizontally
            player.element.style.left = `${player.x}px`;
            
            // Check game over
            if (lives <= 0) {
                gameOver("lives");
            }
            
            break;
        }
    }
    
    // Check if all enemies are destroyed
    if (enemies.length === 0) {
        gameWin();
    }
}

// Collision detection
function isColliding(obj1, obj2) {
    return (
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
    );
}

// Increase enemy speed
function increaseSpeed() {
    if (speedMultiplier < MAX_SPEED_MULTIPLIER) {
        speedMultiplier += 1;
    }
}

function moveEnemyBullets() {
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        const bullet = enemyBullets[i];
        bullet.y += 4 * speedMultiplier;
        bullet.element.style.top = `${bullet.y}px`;

        // ✅ Check if bullet passed 75% of screen height
        if (bullet.y > GAME_HEIGHT * 0.75) {
            canEnemyShoot = true;
        }

        // Remove bullet if it goes out of bounds
        if (bullet.y > GAME_HEIGHT) {
            bullet.element.remove();
            enemyBullets.splice(i, 1);
        }
    }
}


function gameOver(reason = "lives") {
    stopCurrentGame(true); // true means save the score
    
    // Set appropriate game over message
    const gameOverTitle = document.getElementById('game-over-title');
    
    // Determine how the game ended
    let gameResult = "";
    
    if (reason === "lives" || lives <= 0) {
        gameOverTitle.textContent = "You Lost!";
        gameResult = "Defeated";
    } else if (reason === "timeout") {
        if (score < 100) {
            gameOverTitle.textContent = "You can do better";
            gameResult = "Time's up";
        } else {
            gameOverTitle.textContent = "Winner!";
            gameResult = "Victory";
        }
    }
    
    // Update final score and rank display
    document.getElementById('final-score').textContent = score;
    document.getElementById('player-rank').textContent = getRank(score);
    
    // Display high scores table
    document.getElementById('high-scores-table').innerHTML = displayHighScoresTable();
    
    // Show game over screen
    gameOverElement.classList.remove('hidden');
}

function gameWin() {
    stopCurrentGame(true); // true means save the score
    
    // Set win message
    document.getElementById('game-win-title').textContent = "Champion!";
    
    // Update win score and rank display
    document.getElementById('win-score').textContent = score;
    document.getElementById('player-win-rank').textContent = getRank(score);
    
    // Display high scores table
    document.getElementById('win-high-scores-table').innerHTML = displayHighScoresTable();
    
    // Show game win screen
    gameWinElement.classList.remove('hidden');
}

// Update the initGame function to properly reset the timer
function initGame() {
    // Reset game state
    clearGameElements();
    
    // Reset game variables
    score = 0;
    lives = 3;
    playerBullets = [];
    enemyBullets = [];
    gameRunning = true;
    enemyMoveDirection = 1;
    enemyMoveSpeed = ENEMY_MOVE_SPEED_INITIAL;
    speedMultiplier = 1;
    scoreSaved = false;
    
    // Reset the game timer with the configured duration
    gameConfig.timeRemaining = gameConfig.gameDuration * 60;
    
    // Set up player
    player = {
        x: (GAME_WIDTH - PLAYER_WIDTH) / 2, // Center horizontally
        y: GAME_HEIGHT - PLAYER_HEIGHT - 20,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
        element: document.getElementById('player')
    };

    // Update player position
    player.element.style.left = `${player.x}px`;
    player.element.style.top = `${player.y}px`;

    // Create enemies
    createEnemies();

    // Update UI
    scoreElement.textContent = score;
    livesElement.textContent = lives;
    
    // Hide game over and win screens
    gameOverElement.classList.add('hidden');
    gameWinElement.classList.add('hidden');
    
    // Add the new game button
    addNewGameButton();
    
    // Create the boundary indicator
    createBoundaryIndicator();
    
    // Start game loop
    if (gameInterval) clearInterval(gameInterval);
    if (speedIncreaseInterval) clearInterval(speedIncreaseInterval);
    
    gameInterval = setInterval(gameLoop, 1000 / 60); // 60 FPS
    speedIncreaseInterval = setInterval(increaseSpeed, 5000); // Every 5 seconds
    
    // Start background music if enabled
    playBackgroundMusic();
    
    // Start the game timer with the fresh duration
    startGameTimer();
}

// Update the startGameTimer function to ensure it uses the correct duration
function startGameTimer() {
    // Clear any existing timer
    if (gameConfig.timer) {
        clearInterval(gameConfig.timer);
    }
    
    // Remove any existing timer elements to prevent duplication
    const existingTimers = document.querySelectorAll('.timer');
    existingTimers.forEach(timer => timer.remove());
    
    // Add timer element to game info
    const timerElement = document.createElement('div');
    timerElement.className = 'timer';
    timerElement.innerHTML = 'Time: <span id="time-remaining">0:00</span>';
    document.querySelector('.game-info').appendChild(timerElement);
    
    // Ensure we're using the correct time value from game configuration
    // This is redundant with the reset in initGame but serves as a safeguard
    if (!gameConfig.timeRemaining || gameConfig.timeRemaining <= 0) {
        gameConfig.timeRemaining = gameConfig.gameDuration * 60;
    }
    
    // Update timer display
    updateTimerDisplay();
    
    // Start the timer
    gameConfig.timer = setInterval(function() {
        gameConfig.timeRemaining--;
        updateTimerDisplay();
        
        // Check if time has run out
        if (gameConfig.timeRemaining <= 0) {
            clearInterval(gameConfig.timer);
            handleTimeOut();
        }
    }, 1000);
}

function createBoundaryIndicator() {
    // First, remove any existing boundary indicator
    const existingIndicator = document.getElementById('player-boundary');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    // Create a new boundary indicator element
    const boundaryIndicator = document.createElement('div');
    boundaryIndicator.id = 'player-boundary';
    
    // Set styles for the boundary line
    boundaryIndicator.style.position = 'absolute';
    boundaryIndicator.style.left = '0';
    boundaryIndicator.style.width = '100%';
    boundaryIndicator.style.height = '2px';
    boundaryIndicator.style.backgroundColor = 'rgba(249, 228, 46, 0.3)'; // Subtle yellow line
    
    // Position at 60% from the top (where the player area begins)
    const boundaryPosition = GAME_HEIGHT - PLAYER_AREA_HEIGHT;
    boundaryIndicator.style.top = `${boundaryPosition}px`;
    
    // Add to game area
    gameArea.appendChild(boundaryIndicator);
}




// Updated Game configuration variables
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

function startGameTimer() {
    // Clear any existing timer
    if (gameConfig.timer) {
        clearInterval(gameConfig.timer);
    }
    
    // Remove any existing timer elements to prevent duplication
    const existingTimers = document.querySelectorAll('.timer');
    existingTimers.forEach(timer => timer.remove());
    
    // Add timer element to game info
    const timerElement = document.createElement('div');
    timerElement.className = 'timer';
    timerElement.innerHTML = 'Time: <span id="time-remaining">0:00</span>';
    document.querySelector('.game-info').appendChild(timerElement);
    
    // Ensure we're using the correct time value from game configuration
    // This is redundant with the reset in initGame but serves as a safeguard
    if (!gameConfig.timeRemaining || gameConfig.timeRemaining <= 0) {
        gameConfig.timeRemaining = gameConfig.gameDuration * 60;
    }
    
    // Update timer display
    updateTimerDisplay();
    
    // Start the timer
    gameConfig.timer = setInterval(function() {
        gameConfig.timeRemaining--;
        updateTimerDisplay();
        
        // Check if time has run out
        if (gameConfig.timeRemaining <= 0) {
            clearInterval(gameConfig.timer);
            handleTimeOut();
        }
    }, 1000);
}
// Also update clearGameElements to remove timer elements
function clearGameElements() {
    // Clear all bullets
    document.querySelectorAll('.bullet, .enemy-bullet, .enemy').forEach(el => el.remove());
    
    // Remove any existing timer elements
    document.querySelectorAll('.timer').forEach(timer => timer.remove());
    
    // Reset arrays
    playerBullets = [];
    enemyBullets = [];
    enemies = [];
}

// Update the timer display
function updateTimerDisplay() {
    const minutes = Math.floor(gameConfig.timeRemaining / 60);
    const seconds = gameConfig.timeRemaining % 60;
    const timeStr = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    document.getElementById('time-remaining').textContent = timeStr;
}

// Handle game timeout
function handleTimeOut() {
    gameOver("timeout");
}


// Modify the keyboard event listener to prevent default browser behavior
document.addEventListener('keydown', (event) => {
    // List of keys used for game controls
    const gameControlKeys = [
        'ArrowUp', 
        'ArrowDown', 
        'ArrowLeft', 
        'ArrowRight', 
        ' ', // Spacebar
        gameConfig.leftKey, 
        gameConfig.rightKey, 
        gameConfig.shootKey
    ];
    
    // If the pressed key is used in the game, prevent default browser behavior
    if (gameControlKeys.includes(event.key)) {
        event.preventDefault();
    }
    
    // Only process game controls if the game is running
    if (!gameRunning) return;
    
    const moveStep = 10;
    
    // Check which key was pressed
    if (event.key === gameConfig.leftKey) {
        // Move left
        player.x = Math.max(0, player.x - moveStep);
    } else if (event.key === gameConfig.rightKey) {
        // Move right
        player.x = Math.min(GAME_WIDTH - PLAYER_WIDTH, player.x + moveStep);
    } else if (event.key === 'ArrowUp') {
        // Move up (restricted to bottom 40% of screen)
        // Calculate the boundary line (60% from top)
        const upperBoundary = GAME_HEIGHT - PLAYER_AREA_HEIGHT;
        // Ensure the player doesn't move above the boundary
        player.y = Math.max(upperBoundary, player.y - moveStep);
    } else if (event.key === 'ArrowDown') {
        // Move down (but not off the bottom of the screen)
        player.y = Math.min(GAME_HEIGHT - PLAYER_HEIGHT - 20, player.y + moveStep);
    } else if (event.key === gameConfig.shootKey) {
        // Shoot
        playerShoot();
    }
    
    // Update player position
    player.element.style.left = `${player.x}px`;
    player.element.style.top = `${player.y}px`;
});

// Initialize configuration screen when document is ready
document.addEventListener('DOMContentLoaded', function() {
    initConfigScreen();
});

// Add event listeners to toggle password visibility
document.addEventListener('DOMContentLoaded', function() {
    // Get all password toggle buttons
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    // Add click event to each button
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Find the input field (previous sibling)
            const passwordInput = this.parentElement.querySelector('input');
            
            // Toggle the type attribute
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.textContent = '🔒'; // Change icon to locked
                this.title = 'Hide password';
            } else {
                passwordInput.type = 'password';
                this.textContent = '👁️'; // Change icon to eye
                this.title = 'Show password';
            }
        });
    });
});


function addNewGameButton() {
    // Check if button already exists
    if (document.getElementById('new-game-button-ingame')) {
        return;
    }
    
    // Create the button
    const newGameButton = document.createElement('button');
    newGameButton.id = 'new-game-button-ingame';
    newGameButton.className = 'ingame-button';
    newGameButton.textContent = 'משחק חדש';
    
    // Add event listener for the button
    newGameButton.addEventListener('click', function() {
        // Confirm the user wants to start a new game
        if (confirm('האם אתה בטוח שברצונך להתחיל משחק חדש? ההתקדמות הנוכחית לא תישמר.')) {
            // Stop the current game
            stopCurrentGame(false); // false means don't save the score
            
            // Return to the configuration screen
            showScreen("configScreen");
        }
    });
    
    // Find a good place to add the button (next to the game info)
    const gameInfo = document.querySelector('.game-info');
    gameInfo.appendChild(newGameButton);
}

// Function to handle stopping the current game
function stopCurrentGame(saveScore = true) {
    gameRunning = false;
    
    // Clear intervals
    if (gameInterval) clearInterval(gameInterval);
    if (speedIncreaseInterval) clearInterval(speedIncreaseInterval);
    
    // Stop background music
    stopBackgroundMusic();
    
    // Clear the timer
    if (gameConfig.timer) clearInterval(gameConfig.timer);
    
    // Save the score if requested and not already saved
    if (saveScore && !scoreSaved) {
        scoreSaved = true;
        
        // Determine game result based on current state
        let gameResult = "";
        
        if (lives <= 0) {
            gameResult = "Defeated";
        } else if (enemies.length === 0) {
            gameResult = "Champion";
        } else {
            gameResult = "Abandoned";
        }
        
        // Save high score
        saveHighScore(score, gameResult);
    }
}
