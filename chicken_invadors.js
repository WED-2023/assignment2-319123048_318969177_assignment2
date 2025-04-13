/*
    TO DO LIST:
    1) About screen:
        * Anything else that we want to add to the game should be written in this page:
        ●	פסילה נוספת.
        ●	סוג יריות שונה לחללית הטובה לפרק זמן מסוים.
        ●	ישנו שעון שרץ ומראה את הזמן הנותר לסיום המשחק.

    4) Add different types of "bad spaceships" depends on the points each line gives to the player:
        פגיעה בחללית רעה מהשורה הכי תחתונה (הרביעית ) מזכה ב-5 נקודות , בשורה השלישית – 10 נקודות ,בשורה השנייה – 15 נקודות ובשורה הרביעית 20 נקודות.
    5) Sound and Effects:
        -לבחור נושא למשחק ועל פי הנושא לצייר שחקן + חלליות ואת היריות שלהם, כולל רקע ולוגו 
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

// Login form validation - FIXED VERSION (only one handler)
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    // בדיקה אם שם המשתמש קיים במילון
    if (users.hasOwnProperty(username) && users[username] === password) {
        // הצלחה: המשך למסך הקונפיגורציה
        setTimeout(() => {
            showScreen("configScreen");
            
            // הסרת הודעה (אם loginMsg מוגדר איפשהו)
            if (typeof loginMsg !== "undefined") {
                loginMsg.remove();
            }
        }, 500);
    } else {
        alert("שם משתמש או סיסמה שגויים, נסה שוב.");
    }
});

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
    // מציג את המודאל בלחיצה על הכפתור
    $("#openAboutBtn").click(function() {
        $("#aboutModal").css("display", "block");
    });
    
    // סוגר את המודאל בלחיצה על X
    $(".about-close").click(function() {
        $("#aboutModal").css("display", "none");
    });
    
    // סוגר את המודאל בלחיצה מחוץ לו
    $(window).click(function(event) {
        if ($(event.target).is("#aboutModal")) {
            $("#aboutModal").css("display", "none");
        }
    });
    
    // סוגר את המודאל בלחיצה על ESC
    $(document).keydown(function(event) {
        if (event.keyCode == 27) { // מקש ESC
            $("#aboutModal").css("display", "none");
        }
    });
});

// GAME CODE STARTS HERE
let gameInitialized = false;

// Game constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PLAYER_AREA_HEIGHT = GAME_HEIGHT * 0.4; // 40% of game area for player movement
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 40;
const ENEMY_WIDTH = 35;
const ENEMY_HEIGHT = 35;
const ENEMY_ROWS = 4;
const ENEMY_COLS = 5;
const ENEMY_PADDING = 15;
const ENEMY_TOP_MARGIN = 40;
const BULLET_WIDTH = 5;
const BULLET_HEIGHT = 15;
const ENEMY_MOVE_SPEED_INITIAL = 2;
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

// Initialize the game
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
    
    // Set up player
    player = {
        x: Math.floor(Math.random() * (GAME_WIDTH - PLAYER_WIDTH)),
        y: GAME_HEIGHT - PLAYER_HEIGHT - 20,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
        element: document.getElementById('player')
    };

    // Update player position
    player.element.style.left = `${player.x}px`;
    player.element.style.bottom = '20px';

    // Create enemies
    createEnemies();

    // Update UI
    scoreElement.textContent = score;
    livesElement.textContent = lives;
    
    // Hide game over and win screens
    gameOverElement.classList.add('hidden');
    gameWinElement.classList.add('hidden');
    
    // Start game loop
    if (gameInterval) clearInterval(gameInterval);
    if (speedIncreaseInterval) clearInterval(speedIncreaseInterval);
    
    gameInterval = setInterval(gameLoop, 1000 / 60); // 60 FPS
    speedIncreaseInterval = setInterval(increaseSpeed, 5000); // Every 5 seconds
    
    // Start the game timer
    startGameTimer();
}

// Clear game elements
function clearGameElements() {
    // Clear all bullets
    document.querySelectorAll('.bullet, .enemy-bullet, .enemy').forEach(el => el.remove());
    playerBullets = [];
    enemyBullets = [];
    enemies = [];
}

//function to create the enemies spaceships
function createEnemies() {
    const totalEnemyWidth = ENEMY_COLS * (ENEMY_WIDTH + ENEMY_PADDING) - ENEMY_PADDING;
    const startX = (GAME_WIDTH - totalEnemyWidth) / 2;

    for (let row = 0; row < ENEMY_ROWS; row++) {
        for (let col = 0; col < ENEMY_COLS; col++) {
            const enemy = document.createElement('div');
            enemy.className = 'enemy';
            gameArea.appendChild(enemy);

            const x = startX + col * (ENEMY_WIDTH + ENEMY_PADDING);
            const y = ENEMY_TOP_MARGIN + row * (ENEMY_HEIGHT + ENEMY_PADDING);

            enemy.style.left = `${x}px`;
            enemy.style.top = `${y}px`;
            enemy.style.backgroundImage = `url('${enemyImages[row]}')`;
            enemy.style.backgroundSize = 'contain';
            enemy.style.backgroundRepeat = 'no-repeat';
            enemy.style.backgroundPosition = 'center';

            enemies.push({
                x: x,
                y: y,
                width: ENEMY_WIDTH,
                height: ENEMY_HEIGHT,
                element: enemy,
                row: row
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
        bullet.y -= 7; // Bullet speed
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
    
    // Check if any enemy bullet has traveled 3/4 of the screen
    const allBulletsPassedThreshold = enemyBullets.every(bullet => {
        return bullet.y > (GAME_HEIGHT * 0.75);
    });
    
    if (allBulletsPassedThreshold || enemyBullets.length === 0) {
        canEnemyShoot = true;
        
        // Select a random enemy to shoot
        const randomIndex = Math.floor(Math.random() * enemies.length);
        const shootingEnemy = enemies[randomIndex];
        
        createEnemyBullet(shootingEnemy.x + ENEMY_WIDTH / 2 - BULLET_WIDTH / 2, shootingEnemy.y + ENEMY_HEIGHT);
        
        // Set flag to prevent continuous shooting
        canEnemyShoot = true;
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
                scoreElement.textContent = score;
                
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
            // Player hit
            lives--;
            livesElement.textContent = lives;
            
            // Remove bullet
            bullet.element.remove();
            enemyBullets.splice(i, 1);
            
            // Reset player position
            player.x = Math.floor(Math.random() * (GAME_WIDTH - PLAYER_WIDTH));
            player.element.style.left = `${player.x}px`;
            
            // Check game over
            if (lives <= 0) {
                gameOver();
            }
            
            break;
        }
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

// Game over
function gameOver() {
    gameRunning = false;
    clearInterval(gameInterval);
    clearInterval(speedIncreaseInterval);
    
    // Clear the timer
    if (gameConfig.timer) clearInterval(gameConfig.timer);
    
    finalScoreElement.textContent = score;
    gameOverElement.classList.remove('hidden');
}

// Game win
function gameWin() {
    gameRunning = false;
    clearInterval(gameInterval);
    clearInterval(speedIncreaseInterval);
    
    // Clear the timer
    if (gameConfig.timer) clearInterval(gameConfig.timer);
    
    winScoreElement.textContent = score;
    gameWinElement.classList.remove('hidden');
}

// Game configuration variables
let gameConfig = {
    shootKey: " ", // Default to spacebar
    gameDuration: 2, // Default to 2 minutes
    playerColor: "#00ff00", // Default player color (green)
    enemyColor: "#ff0000", // Default enemy color (red)
    timer: null, // Game timer
    timeRemaining: 0, // Time remaining in seconds
};

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

// Initialize the configuration screen
function initConfigScreen() {
    populateShootingKeys();
    
    // Set default values
    document.getElementById('shootKey').value = gameConfig.shootKey;
    document.getElementById('gameDuration').value = gameConfig.gameDuration;
    document.getElementById('playerColor').value = gameConfig.playerColor;
    document.getElementById('enemyColor').value = gameConfig.enemyColor;
    
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
        
        // Save the configuration
        gameConfig.shootKey = document.getElementById('shootKey').value;
        gameConfig.gameDuration = duration;
        gameConfig.playerColor = document.getElementById('playerColor').value;
        gameConfig.enemyColor = document.getElementById('enemyColor').value;
        
        // Convert minutes to seconds for the timer
        gameConfig.timeRemaining = gameConfig.gameDuration * 60;
        
        // Show the game screen
        showScreen("gameScreen");
        
        // Initialize and start the game
        if (!gameInitialized) {
            initGame();
            gameInitialized = true;
        } else {
            resetAndStartGame();
        }
    });
}

// Function to validate minimum duration
function validateMinDuration(input) {
    if (input.value < 2) {
        alert("זמן המשחק חייב להיות לפחות 2 דקות.");
        input.value = 2;
    }
}

// Add game timer functions
function startGameTimer() {
    // Clear any existing timer
    if (gameConfig.timer) {
        clearInterval(gameConfig.timer);
    }
    
    // Add timer element to game info if it doesn't exist
    if (!document.getElementById('timer')) {
        const timerElement = document.createElement('div');
        timerElement.className = 'timer';
        timerElement.innerHTML = 'Time: <span id="time-remaining">0:00</span>';
        document.querySelector('.game-info').appendChild(timerElement);
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

// Update the timer display
function updateTimerDisplay() {
    const minutes = Math.floor(gameConfig.timeRemaining / 60);
    const seconds = gameConfig.timeRemaining % 60;
    const timeStr = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    document.getElementById('time-remaining').textContent = timeStr;
}

// Handle game timeout
function handleTimeOut() {
    gameRunning = false;
    clearInterval(gameInterval);
    clearInterval(speedIncreaseInterval);
    
    // Display appropriate message based on score
    const gameOverElement = document.getElementById('game-over');
    const finalScoreElement = document.getElementById('final-score');
    
    finalScoreElement.textContent = score;
    
    const gameOverTitle = gameOverElement.querySelector('h2');
    if (score < 100) {
        gameOverTitle.textContent = "You can do better!";
    } else {
        gameOverTitle.textContent = "Winner!";
    }
    
    gameOverElement.classList.remove('hidden');
}

// Modified initGame function to incorporate configuration
function resetAndStartGame() {
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
    
    // Set up player with custom color
    player = {
        x: Math.floor(Math.random() * (GAME_WIDTH - PLAYER_WIDTH)),
        y: GAME_HEIGHT - PLAYER_HEIGHT - 20,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
        element: document.getElementById('player')
    };

    // Apply player color
    player.element.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,10 20,90 50,70 80,90" fill="${gameConfig.playerColor.replace("#", "%23")}"/></svg>')`;
    
    // Update player position
    player.element.style.left = `${player.x}px`;
    player.element.style.bottom = '20px';

    // Create enemies
    createEnemies();

    // Apply enemy color to all enemies
    document.querySelectorAll('.enemy').forEach(enemy => {
        // Only apply color if not using the chicken image
        if (!enemy.classList.contains('chicken')) {
            enemy.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,10 20,30 10,70 50,90 90,70 80,30" fill="${gameConfig.enemyColor.replace("#", "%23")}"/></svg>')`;
        }
    });

    // Update UI
    scoreElement.textContent = score;
    livesElement.textContent = lives;
    
    // Hide game over and win screens
    gameOverElement.classList.add('hidden');
    gameWinElement.classList.add('hidden');
    
    // Start game loop
    if (gameInterval) clearInterval(gameInterval);
    if (speedIncreaseInterval) clearInterval(speedIncreaseInterval);
    
    gameInterval = setInterval(gameLoop, 1000 / 60); // 60 FPS
    speedIncreaseInterval = setInterval(increaseSpeed, 5000); // Every 5 seconds
    
    // Start the game timer
    startGameTimer();
}

// Modify the keyboard controls to use the configured shooting key
document.addEventListener('keydown', (event) => {
    if (!gameRunning) return;
    
    const moveStep = 10;
    
    switch (event.key) {
        case 'ArrowLeft':
            player.x = Math.max(0, player.x - moveStep);
            break;
        case 'ArrowRight':
            player.x = Math.min(GAME_WIDTH - PLAYER_WIDTH, player.x + moveStep);
            break;
        case 'ArrowUp':
            // Restrict to bottom 40% of screen
            player.y = Math.max(GAME_HEIGHT - PLAYER_AREA_HEIGHT, Math.min(GAME_HEIGHT - PLAYER_HEIGHT, player.y - moveStep));
            break;
        case 'ArrowDown':
            player.y = Math.min(GAME_HEIGHT - PLAYER_HEIGHT, player.y + moveStep);
            break;
        case gameConfig.shootKey: // Use the configured shoot key
            playerShoot();
            break;
    }
    
    // Update player position
    player.element.style.left = `${player.x}px`;
    player.element.style.top = `${player.y}px`;
});

// Initialize configuration screen when document is ready
document.addEventListener('DOMContentLoaded', function() {
    initConfigScreen();
});