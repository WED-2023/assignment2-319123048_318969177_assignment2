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

// Navigation logic
document.getElementById("goToWelcome").addEventListener("click", function() {
    showScreen("welcomeScreen");
});

document.getElementById("goToLogin").addEventListener("click", function() {
    showScreen("loginScreen");
});

document.getElementById("goToRegister").addEventListener("click", function() {
    showScreen("registrationScreen");
});

document.getElementById("goToGame").addEventListener("click", function() {
    showScreen("gameScreen");
    // Initialize game when navigating to game screen
    if (!gameInitialized) {
        initGame();
        gameInitialized = true;
    }
});

// Show welcome screen initially
showScreen("welcomeScreen");

// Register page navigation
document.getElementById("registerButton").addEventListener("click", function() {
    showScreen("registrationScreen");
});

document.getElementById("loginButton").addEventListener("click", function() {
    showScreen("loginScreen");
});

// To navigate to login page from registration form
document.getElementById("toLogin").addEventListener("click", function() {
    showScreen("loginScreen");
});

// To navigate to registration form from login page
document.getElementById("toRegister").addEventListener("click", function() {
    showScreen("registrationScreen");
});

// Login form validation (for now, hardcoded username and password)
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    // Hardcoded valid user (for demonstration)
    const validUsername = "user";
    const validPassword = "password123";

    if (username === validUsername && password === validPassword) {
        alert("Login successful! Redirecting to game...");
        // Show game screen after successful login
        showScreen("gameScreen");
        document.getElementById("goToGame").style.display = "block";
        
        // Initialize game when first loading game screen
        if (!gameInitialized) {
            initGame();
            gameInitialized = true;
        }
    } else {
        alert("Invalid credentials, please try again.");
    }
});

// Registration form validation
document.getElementById("registrationForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
    } else {
        alert("Registration successful! Please login.");
        showScreen("loginScreen");
    }
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
}

// Clear game elements
function clearGameElements() {
    // Clear all bullets
    document.querySelectorAll('.bullet, .enemy-bullet, .enemy').forEach(el => el.remove());
    playerBullets = [];
    enemyBullets = [];
    enemies = [];
}

// Create enemy ships
function createEnemies() {
    // Total width and height for the enemy grid
    const totalEnemyWidth = ENEMY_COLS * (ENEMY_WIDTH + ENEMY_PADDING) - ENEMY_PADDING;
    const startX = (GAME_WIDTH - totalEnemyWidth) / 2;

    // Create enemies in a 4x5 grid
    for (let row = 0; row < ENEMY_ROWS; row++) {
        for (let col = 0; col < ENEMY_COLS; col++) {
            const enemy = document.createElement('div');
            enemy.className = 'enemy';
            gameArea.appendChild(enemy);

            const x = startX + col * (ENEMY_WIDTH + ENEMY_PADDING);
            const y = ENEMY_TOP_MARGIN + row * (ENEMY_HEIGHT + ENEMY_PADDING);

            enemy.style.left = `${x}px`;
            enemy.style.top = `${y}px`;

            // Store enemy properties
            enemies.push({
                x: x,
                y: y,
                width: ENEMY_WIDTH,
                height: ENEMY_HEIGHT,
                element: enemy,
                row: row // To determine score value
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
    
    finalScoreElement.textContent = score;
    gameOverElement.classList.remove('hidden');
}

// Game win
function gameWin() {
    gameRunning = false;
    clearInterval(gameInterval);
    clearInterval(speedIncreaseInterval);
    
    winScoreElement.textContent = score;
    gameWinElement.classList.remove('hidden');
}

// Keyboard controls
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
        case ' ': // Spacebar
            playerShoot();
            break;
    }
    
    // Update player position
    player.element.style.left = `${player.x}px`;
    player.element.style.top = `${player.y}px`;
});

// Restart button event listeners
restartButton.addEventListener('click', initGame);
restartWinButton.addEventListener('click', initGame);