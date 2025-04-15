// // game.js
// // Core game mechanics

// // Game initialization flag
// let gameInitialized = false;
// let scoreSaved = false;

// // Game constants
// const GAME_WIDTH = 600;
// const GAME_HEIGHT = 450;
// const PLAYER_AREA_HEIGHT = GAME_HEIGHT * 0.4; // 40% of game area for player movement
// const PLAYER_WIDTH = 35;
// const PLAYER_HEIGHT = 35;
// const ENEMY_WIDTH = 30;
// const ENEMY_HEIGHT = 30;
// const ENEMY_ROWS = 4;
// const ENEMY_COLS = 5;
// const ENEMY_PADDING = 12;
// const ENEMY_TOP_MARGIN = 30;
// const BULLET_WIDTH = 5;
// const BULLET_HEIGHT = 15;
// const ENEMY_MOVE_SPEED_INITIAL = 1;
// const MAX_SPEED_MULTIPLIER = 5; // After 4 accelerations (initial + 4 = 5)

// // Game state
// let player;
// let enemies = [];
// let playerBullets = [];
// let enemyBullets = [];
// let score = 0;
// let lives = 3;
// let gameRunning = false;
// let enemyMoveDirection = 1; // 1 for right, -1 for left
// let enemyMoveSpeed = ENEMY_MOVE_SPEED_INITIAL;
// let lastEnemyBulletTime = 0;
// let speedMultiplier = 1;
// let gameInterval;
// let speedIncreaseInterval;
// let canEnemyShoot = true;

// // Game elements
// const gameArea = document.getElementById('game-area');
// const scoreElement = document.getElementById('score');
// const livesElement = document.getElementById('lives');
// const gameOverElement = document.getElementById('game-over');
// const gameWinElement = document.getElementById('game-win');
// const finalScoreElement = document.getElementById('final-score');
// const winScoreElement = document.getElementById('win-score');
// const restartButton = document.getElementById('restart-button');
// const restartWinButton = document.getElementById('restart-win-button');

// // Update enemy image mapping
// const enemyImages = [
//     'photos/blue.png',   // top row (index 0)
//     'photos/red.png',    // second row (index 1)
//     'photos/pink.png',   // third row (index 2)
//     'photos/orange.png'  // bottom row (index 3)
// ];

// document.addEventListener('DOMContentLoaded', function() {
//     // Restart game button handlers
//     document.getElementById('restart-button').addEventListener('click', function() {
//         initGame();
//     });

//     document.getElementById('restart-win-button').addEventListener('click', function() {
//         initGame();
//     });

//     // New game button handlers (won't save the score)
//     document.getElementById('new-game-button').addEventListener('click', function() {
//         showScreen("configScreen");
//     });

//     document.getElementById('new-win-game-button').addEventListener('click', function() {
//         showScreen("configScreen");
//     });
    
//     // Set up keyboard event listeners
//     document.addEventListener('keydown', (event) => {
//         // List of keys used for game controls
//         const gameControlKeys = [
//             'ArrowUp', 
//             'ArrowDown', 
//             'ArrowLeft', 
//             'ArrowRight', 
//             ' ', // Spacebar
//             gameConfig.leftKey, 
//             gameConfig.rightKey, 
//             gameConfig.shootKey
//         ];
        
//         // If the pressed key is used in the game, prevent default browser behavior
//         if (gameControlKeys.includes(event.key)) {
//             event.preventDefault();
//         }
        
//         // Only process game controls if the game is running
//         if (!gameRunning) return;
        
//         const moveStep = 10;
        
//         // Check which key was pressed
//         if (event.key === gameConfig.leftKey) {
//             // Move left
//             player.x = Math.max(0, player.x - moveStep);
//         } else if (event.key === gameConfig.rightKey) {
//             // Move right
//             player.x = Math.min(GAME_WIDTH - PLAYER_WIDTH, player.x + moveStep);
//         } else if (event.key === 'ArrowUp') {
//             // Move up (restricted to bottom 40% of screen)
//             // Calculate the boundary line (60% from top)
//             const upperBoundary = GAME_HEIGHT - PLAYER_AREA_HEIGHT;
//             // Ensure the player doesn't move above the boundary
//             player.y = Math.max(upperBoundary, player.y - moveStep);
//         } else if (event.key === 'ArrowDown') {
//             // Move down (but not off the bottom of the screen)
//             player.y = Math.min(GAME_HEIGHT - PLAYER_HEIGHT - 20, player.y + moveStep);
//         } else if (event.key === gameConfig.shootKey) {
//             // Shoot
//             playerShoot();
//         }
        
//         // Update player position
//         player.element.style.left = `${player.x}px`;
//         player.element.style.top = `${player.y}px`;
//     });
// });

// // Initialize the game
// function initGame() {
//     // Reset game state
//     clearGameElements();
    
//     // Reset game variables
//     score = 0;
//     lives = 3;
//     playerBullets = [];
//     enemyBullets = [];
//     gameRunning = true;
//     enemyMoveDirection = 1;
//     enemyMoveSpeed = ENEMY_MOVE_SPEED_INITIAL;
//     speedMultiplier = 1;
//     scoreSaved = false;
    
//     let playerElement = document.getElementById('player');
//     if (!playerElement) {
//         playerElement = document.createElement('div');
//         playerElement.id = 'player';
//         gameArea.appendChild(playerElement);
//     }
    
//     // Reset the game timer with the configured duration
//     gameConfig.timeRemaining = gameConfig.gameDuration * 60;
    
//     // Set up player
//     player = {
//         x: (GAME_WIDTH - PLAYER_WIDTH) / 2,
//         y: GAME_HEIGHT - PLAYER_HEIGHT - 20,
//         width: PLAYER_WIDTH,
//         height: PLAYER_HEIGHT,
//         element: playerElement
//     };
    
//     // Make sure the player element has proper styling
//     playerElement.style.width = `${PLAYER_WIDTH}px`;
//     playerElement.style.height = `${PLAYER_HEIGHT}px`;
//     playerElement.style.position = 'absolute';
//     playerElement.style.backgroundImage = "url('photos/player.png')"; // Ensure this path is correct
//     playerElement.style.backgroundSize = 'contain';
//     playerElement.style.backgroundRepeat = 'no-repeat';
//     playerElement.style.backgroundPosition = 'center';
    

//     // Update player position
//     player.element.style.left = `${player.x}px`;
//     player.element.style.top = `${player.y}px`;

//     // Create enemies
//     createEnemies();

//     // Update UI
//     updateHUD();
    
//     // Hide game over and win screens
//     gameOverElement.classList.add('hidden');
//     gameWinElement.classList.add('hidden');
    
//     // Add the new game button
//     addNewGameButton();
    
//     // Create the boundary indicator
//     createBoundaryIndicator();
    
//     // Start game loop
//     if (gameInterval) clearInterval(gameInterval);
//     if (speedIncreaseInterval) clearInterval(speedIncreaseInterval);
    
//     gameInterval = setInterval(gameLoop, 1000 / 60); // 60 FPS
//     speedIncreaseInterval = setInterval(increaseSpeed, 5000); // Every 5 seconds
    
//     // Start background music if enabled
//     playBackgroundMusic();
    
//     // Start the game timer with the fresh duration
//     startGameTimer();
// }

// // Function to update the game's HUD (heads-up display)
// function updateHUD() {
//     // Update score
//     scoreElement.textContent = score;
    
//     // Update lives
//     livesElement.textContent = lives;
// }

// // Clear game elements
// function clearGameElements() {
//     // Clear all bullets
//     document.querySelectorAll('.bullet, .enemy-bullet, .enemy').forEach(el => el.remove());
    
//     // Remove any existing timer elements
//     document.querySelectorAll('.timer').forEach(timer => timer.remove());
    
//     // Reset arrays
//     playerBullets = [];
//     enemyBullets = [];
//     enemies = [];
// }

// // Create enemy spaceships
// function createEnemies() {
//     // Calculate the total width of the enemies' grid
//     const totalEnemyWidth = ENEMY_COLS * (ENEMY_WIDTH + ENEMY_PADDING) - ENEMY_PADDING;
    
//     // Calculate the starting X position for the first enemy to center them in the game area
//     const startX = (GAME_WIDTH - totalEnemyWidth) / 2;

//     // Loop through each row and column to create enemies
//     for (let row = 0; row < ENEMY_ROWS; row++) {
//         for (let col = 0; col < ENEMY_COLS; col++) {
//             // Create a div element for each enemy
//             const enemy = document.createElement('div');
//             enemy.className = 'enemy'; // Add the 'enemy' class for styling
//             gameArea.appendChild(enemy); // Add the enemy element to the game area

//             // Calculate the X and Y positions for the enemy
//             const x = startX + col * (ENEMY_WIDTH + ENEMY_PADDING);
//             const y = ENEMY_TOP_MARGIN + row * (ENEMY_HEIGHT + ENEMY_PADDING);

//             // Set the enemy's position and background image
//             enemy.style.left = `${x}px`;
//             enemy.style.top = `${y}px`;
//             enemy.style.backgroundImage = `url('${enemyImages[row]}')`; // Assign image based on row
//             enemy.style.backgroundSize = 'contain'; // Ensure the image fits the enemy element
//             enemy.style.backgroundRepeat = 'no-repeat'; // Prevent image repetition
//             enemy.style.backgroundPosition = 'center'; // Center the image inside the enemy div

//             // Push the newly created enemy into the enemies array
//             enemies.push({
//                 x: x,
//                 y: y,
//                 width: ENEMY_WIDTH,
//                 height: ENEMY_HEIGHT,
//                 element: enemy,
//                 row: row // Store the row to determine the points awarded when destroyed
//             });
//         }
//     }
// }

// // Game loop
// function gameLoop() {
//     if (!gameRunning) return;

//     // Move enemies
//     moveEnemies();

//     // Move bullets
//     movePlayerBullets();
//     moveEnemyBullets();

//     // Random enemy shooting
//     tryEnemyShooting();

//     // Check collisions
//     checkCollisions();

//     // Check if all enemies are destroyed
//     if (enemies.length === 0) {
//         gameWin();
//     }
// }

// // Move the enemies
// function moveEnemies() {
//     let reachedEdge = false;
    
//     // Check if any enemy reached the edge
//     for (const enemy of enemies) {
//         if (
//             (enemyMoveDirection === 1 && enemy.x + ENEMY_WIDTH >= GAME_WIDTH) ||
//             (enemyMoveDirection === -1 && enemy.x <= 0)
//         ) {
//             reachedEdge = true;
//             break;
//         }
//     }
    
//     // Change direction if reached edge
//     if (reachedEdge) {
//         enemyMoveDirection *= -1;
//     }
    
//     // Move all enemies
//     for (const enemy of enemies) {
//         enemy.x += enemyMoveDirection * enemyMoveSpeed * speedMultiplier;
//         enemy.element.style.left = `${enemy.x}px`;
//     }
// }

// // Move player bullets
// function movePlayerBullets() {
//     for (let i = playerBullets.length - 1; i >= 0; i--) {
//         const bullet = playerBullets[i];
//         bullet.y -= 5; // Bullet speed
//         bullet.element.style.top = `${bullet.y}px`;
        
//         // Remove bullet if it goes out of bounds
//         if (bullet.y + BULLET_HEIGHT < 0) {
//             bullet.element.remove();
//             playerBullets.splice(i, 1);
//         }
//     }
// }

// // Move enemy bullets
// function moveEnemyBullets() {
//     for (let i = enemyBullets.length - 1; i >= 0; i--) {
//         const bullet = enemyBullets[i];
//         bullet.y += 4 * speedMultiplier;
//         bullet.element.style.top = `${bullet.y}px`;

//         // Check if bullet passed 75% of screen height
//         if (bullet.y > GAME_HEIGHT * 0.75) {
//             canEnemyShoot = true;
//         }

//         // Remove bullet if it goes out of bounds
//         if (bullet.y > GAME_HEIGHT) {
//             bullet.element.remove();
//             enemyBullets.splice(i, 1);
//         }
//     }
// }

// // Try enemy shooting based on requirements
// function tryEnemyShooting() {
//     if (!canEnemyShoot || enemies.length === 0) return;
    
//     // If there are no enemy bullets, allow shooting
//     if (enemyBullets.length === 0) {
//         // Select a random enemy to shoot
//         const randomIndex = Math.floor(Math.random() * enemies.length);
//         const shootingEnemy = enemies[randomIndex];
        
//         createEnemyBullet(shootingEnemy.x + ENEMY_WIDTH / 2 - BULLET_WIDTH / 2, shootingEnemy.y + ENEMY_HEIGHT);
        
//         // Set flag to prevent continuous shooting
//         canEnemyShoot = false;
//     } 
//     // Check if all bullets have traveled 3/4 of the screen
//     else if (enemyBullets.every(bullet => bullet.y > (GAME_HEIGHT * 0.75))) {
//         // Select a random enemy to shoot
//         const randomIndex = Math.floor(Math.random() * enemies.length);
//         const shootingEnemy = enemies[randomIndex];
        
//         createEnemyBullet(shootingEnemy.x + ENEMY_WIDTH / 2 - BULLET_WIDTH / 2, shootingEnemy.y + ENEMY_HEIGHT);
        
//         // Reset flag to prevent continuous shooting
//         canEnemyShoot = false;
//     }
// }

// // Create enemy bullet
// function createEnemyBullet(x, y) {
//     const bullet = document.createElement('div');
//     bullet.className = 'enemy-bullet';
//     gameArea.appendChild(bullet);
    
//     bullet.style.left = `${x}px`;
//     bullet.style.top = `${y}px`;
    
//     enemyBullets.push({
//         x: x,
//         y: y,
//         width: BULLET_WIDTH,
//         height: BULLET_HEIGHT,
//         element: bullet
//     });
// }

// // Player shooting
// function playerShoot() {
//     const bullet = document.createElement('div');
//     bullet.className = 'bullet';
    
//     // Apply custom bullet color from game configuration
//     bullet.style.backgroundColor = gameConfig.bulletColor;
    
//     gameArea.appendChild(bullet);
    
//     const bulletX = player.x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2;
//     const bulletY = player.y;
    
//     bullet.style.left = `${bulletX}px`;
//     bullet.style.top = `${bulletY}px`;
    
//     playerBullets.push({
//         x: bulletX,
//         y: bulletY,
//         width: BULLET_WIDTH,
//         height: BULLET_HEIGHT,
//         element: bullet
//     });
// }

// // Check all collisions
// function checkCollisions() {
//     // Check player bullets hitting enemies
//     for (let i = playerBullets.length - 1; i >= 0; i--) {
//         const bullet = playerBullets[i];
        
//         for (let j = enemies.length - 1; j >= 0; j--) {
//             const enemy = enemies[j];
            
//             if (isColliding(bullet, enemy)) {
//                 // Play enemy hit sound effect
//                 playSoundEffect('enemyHit');
                
//                 // Calculate score based on enemy row
//                 let points;
//                 switch (enemy.row) {
//                     case 0: points = 20; break; // Top row
//                     case 1: points = 15; break;
//                     case 2: points = 10; break;
//                     case 3: points = 5; break;  // Bottom row
//                     default: points = 5;
//                 }
                
//                 // Update score
//                 score += points;
//                 updateHUD();
                
//                 // Remove enemy
//                 enemy.element.remove();
//                 enemies.splice(j, 1);
                
//                 // Remove bullet
//                 bullet.element.remove();
//                 playerBullets.splice(i, 1);
//                 break;
//             }
//         }
//     }
    
//     // Check enemy bullets hitting player
//     for (let i = enemyBullets.length - 1; i >= 0; i--) {
//         const bullet = enemyBullets[i];
        
//         if (isColliding(bullet, player)) {
//             // Play player hit sound effect
//             playSoundEffect('playerHit');
            
//             // Player hit
//             lives--;
//             updateHUD();
            
//             // Remove bullet
//             bullet.element.remove();
//             enemyBullets.splice(i, 1);
            
//             // Reset player to center position instead of random
//             player.x = (GAME_WIDTH - PLAYER_WIDTH) / 2; // Center horizontally
//             player.element.style.left = `${player.x}px`;
            
//             // Check game over
//             if (lives <= 0) {
//                 gameOver("lives");
//             }
            
//             break;
//         }
//     }
    
//     // Check if all enemies are destroyed
//     if (enemies.length === 0) {
//         gameWin();
//     }
// }

// // Collision detection
// function isColliding(obj1, obj2) {
//     return (
//         obj1.x < obj2.x + obj2.width &&
//         obj1.x + obj1.width > obj2.x &&
//         obj1.y < obj2.y + obj2.height &&
//         obj1.y + obj1.height > obj2.y
//     );
// }

// // Increase enemy speed
// function increaseSpeed() {
//     if (speedMultiplier < MAX_SPEED_MULTIPLIER) {
//         speedMultiplier += 1;
//     }
// }

// // Game timer functions
// function startGameTimer() {
//     // Clear any existing timer
//     if (gameConfig.timer) {
//         clearInterval(gameConfig.timer);
//     }
    
//     // Remove any existing timer elements to prevent duplication
//     const existingTimers = document.querySelectorAll('.timer');
//     existingTimers.forEach(timer => timer.remove());
    
//     // Add timer element to game info
//     const timerElement = document.createElement('div');
//     timerElement.className = 'timer';
//     timerElement.innerHTML = 'Time: <span id="time-remaining">0:00</span>';
//     document.querySelector('.game-info').appendChild(timerElement);
    
//     // Ensure we're using the correct time value from game configuration
//     if (!gameConfig.timeRemaining || gameConfig.timeRemaining <= 0) {
//         gameConfig.timeRemaining = gameConfig.gameDuration * 60;
//     }
    
//     // Update timer display
//     updateTimerDisplay();
    
//     // Start the timer
//     gameConfig.timer = setInterval(function() {
//         gameConfig.timeRemaining--;
//         updateTimerDisplay();
        
//         // Check if time has run out
//         if (gameConfig.timeRemaining <= 0) {
//             clearInterval(gameConfig.timer);
//             handleTimeOut();
//         }
//     }, 1000);
// }

// // Update the timer display
// function updateTimerDisplay() {
//     const minutes = Math.floor(gameConfig.timeRemaining / 60);
//     const seconds = gameConfig.timeRemaining % 60;
//     const timeStr = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
//     document.getElementById('time-remaining').textContent = timeStr;
// }

// // Handle game timeout
// function handleTimeOut() {
//     gameOver("timeout");
// }

// // Game over function
// function gameOver(reason = "lives") {
//     stopCurrentGame(true); // true means save the score
    
//     // Set appropriate game over message
//     const gameOverTitle = document.getElementById('game-over-title');
    
//     // Determine how the game ended
//     let gameResult = "";
    
//     if (reason === "lives" || lives <= 0) {
//         gameOverTitle.textContent = "You Lost!";
//         gameResult = "Defeated";
//     } else if (reason === "timeout") {
//         if (score < 100) {
//             gameOverTitle.textContent = "You can do better";
//             gameResult = "Time's up";
//         } else {
//             gameOverTitle.textContent = "Winner!";
//             gameResult = "Victory";
//         }
//     }
    
//     // Update final score and rank display
//     document.getElementById('final-score').textContent = score;
//     document.getElementById('player-rank').textContent = getRank(score);
    
//     // Display high scores table
//     document.getElementById('high-scores-table').innerHTML = displayHighScoresTable();
    
//     // Show game over screen
//     gameOverElement.classList.remove('hidden');
// }

// // Game win function
// function gameWin() {
//     stopCurrentGame(true); // true means save the score
    
//     // Set win message
//     document.getElementById('game-win-title').textContent = "Champion!";
    
//     // Update win score and rank display
//     document.getElementById('win-score').textContent = score;
//     document.getElementById('player-win-rank').textContent = getRank(score);
    
//     // Display high scores table
//     document.getElementById('win-high-scores-table').innerHTML = displayHighScoresTable();
    
//     // Show game win screen
//     gameWinElement.classList.remove('hidden');
// }

// // Create boundary indicator for player movement
// function createBoundaryIndicator() {
//     // First, remove any existing boundary indicator
//     const existingIndicator = document.getElementById('player-boundary');
//     if (existingIndicator) {
//         existingIndicator.remove();
//     }
    
//     // Create a new boundary indicator element
//     const boundaryIndicator = document.createElement('div');
//     boundaryIndicator.id = 'player-boundary';
    
//     // Set styles for the boundary line
//     boundaryIndicator.style.position = 'absolute';
//     boundaryIndicator.style.left = '0';
//     boundaryIndicator.style.width = '100%';
//     boundaryIndicator.style.height = '2px';
//     boundaryIndicator.style.backgroundColor = 'rgba(249, 228, 46, 0.3)'; // Subtle yellow line
    
//     // Position at 60% from the top (where the player area begins)
//     const boundaryPosition = GAME_HEIGHT - PLAYER_AREA_HEIGHT;
//     boundaryIndicator.style.top = `${boundaryPosition}px`;
    
//     // Add to game area
//     gameArea.appendChild(boundaryIndicator);
// }

// // Add new game button during gameplay
// function addNewGameButton() {
//     // Check if button already exists
//     if (document.getElementById('new-game-button-ingame')) {
//         return;
//     }
    
//     // Create the button
//     const newGameButton = document.createElement('button');
//     newGameButton.id = 'new-game-button-ingame';
//     newGameButton.className = 'ingame-button';
//     newGameButton.textContent = 'משחק חדש';
    
//     // Add event listener for the button
//     newGameButton.addEventListener('click', function() {
//         // Confirm the user wants to start a new game
//         if (confirm('האם אתה בטוח שברצונך להתחיל משחק חדש? ההתקדמות הנוכחית לא תישמר.')) {
//             // Stop the current game
//             stopCurrentGame(false); // false means don't save the score
            
//             // Return to the configuration screen
//             showScreen("configScreen");
//         }
//     });
    
//     // Find a good place to add the button (next to the game info)
//     const gameInfo = document.querySelector('.game-info');
//     gameInfo.appendChild(newGameButton);
// }

// // Stop the current game
// function stopCurrentGame(saveScore = true) {
//     gameRunning = false;
    
//     // Clear intervals
//     if (gameInterval) clearInterval(gameInterval);
//     if (speedIncreaseInterval) clearInterval(speedIncreaseInterval);
    
//     // Stop background music
//     stopBackgroundMusic();
    
//     // Clear the timer
//     if (gameConfig.timer) clearInterval(gameConfig.timer);
    
//     // Save the score if requested and not already saved
//     if (saveScore && !scoreSaved) {
//         scoreSaved = true;
        
//         // Determine game result based on current state
//         let gameResult = "";
        
//         if (lives <= 0) {
//             gameResult = "Defeated";
//         } else if (enemies.length === 0) {
//             gameResult = "Champion";
//         } else {
//             gameResult = "Abandoned";
//         }
        
//         // Save high score
//         saveHighScore(score, gameResult);
//     }
// }

// Game initialization flag
let gameInitialized = false;
let scoreSaved = false;

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
const BULLET_WIDTH = 10;
const BULLET_HEIGHT = 10;
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
let gameArea, scoreElement, livesElement, gameOverElement, gameWinElement, finalScoreElement, winScoreElement, restartButton, restartWinButton;

// Update enemy image mapping
const enemyImages = [
    'photos/blue.png',   // top row (index 0)
    'photos/red.png',    // second row (index 1)
    'photos/pink.png',   // third row (index 2)
    'photos/orange.png'  // bottom row (index 3)
];

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements after document is loaded
    gameArea = document.getElementById('game-area');
    scoreElement = document.getElementById('score');
    livesElement = document.getElementById('lives');
    gameOverElement = document.getElementById('game-over');
    gameWinElement = document.getElementById('game-win');
    finalScoreElement = document.getElementById('final-score');
    winScoreElement = document.getElementById('win-score');
    restartButton = document.getElementById('restart-button');
    restartWinButton = document.getElementById('restart-win-button');
    
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
});

// Set up keyboard event listeners
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
        gameConfig.upKey,
        gameConfig.downKey,
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
    } else if (event.key === gameConfig.upKey) {
        // Move up (restricted to bottom 40% of screen)
        // Calculate the boundary line (60% from top)
        const upperBoundary = GAME_HEIGHT - PLAYER_AREA_HEIGHT;
        // Ensure the player doesn't move above the boundary
        player.y = Math.max(upperBoundary, player.y - moveStep);
    } else if (event.key === gameConfig.downKey) {
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
    scoreSaved = false;
    
    // Make sure player element exists
    let playerElement = document.getElementById('player');
    if (!playerElement) {
        playerElement = document.createElement('div');
        playerElement.id = 'player';
        gameArea.appendChild(playerElement);
    }
    
    // Reset the game timer with the configured duration
    gameConfig.timeRemaining = gameConfig.gameDuration * 60;
    
    // Set up player
    player = {
        x: (GAME_WIDTH - PLAYER_WIDTH) / 2,
        y: GAME_HEIGHT - PLAYER_HEIGHT - 20,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
        element: playerElement
    };
    
    // Make sure the player element has proper styling
    playerElement.style.width = `${PLAYER_WIDTH}px`;
    playerElement.style.height = `${PLAYER_HEIGHT}px`;
    playerElement.style.position = 'absolute';
    playerElement.style.backgroundImage = "url('photos/pacman.png')";
    playerElement.style.backgroundSize = 'contain';
    playerElement.style.backgroundRepeat = 'no-repeat';
    playerElement.style.backgroundPosition = 'center';
    playerElement.style.zIndex = "10"; // Make sure player is on top

    // Update player position
    player.element.style.left = `${player.x}px`;
    player.element.style.top = `${player.y}px`;

    // Create enemies
    createEnemies();

    // Update UI
    updateHUD();
    
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

// Function to update the game's HUD (heads-up display)
function updateHUD() {
    // Update score
    scoreElement.textContent = score;
    
    // Update lives with hearts
    livesElement.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        const heart = document.createElement('span');
        heart.className = 'heart-icon';
        livesElement.appendChild(heart);
    }
}

// Clear game elements
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

// Create enemy spaceships
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
            enemy.style.width = `${ENEMY_WIDTH}px`;
            enemy.style.height = `${ENEMY_HEIGHT}px`;
            enemy.style.position = 'absolute';

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
        bullet.y += 4 * speedMultiplier;
        bullet.element.style.top = `${bullet.y}px`;

        // Check if bullet passed 75% of screen height
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
    bullet.style.width = `${BULLET_WIDTH}px`;
    bullet.style.height = `${BULLET_HEIGHT}px`;
    bullet.style.position = 'absolute';
    bullet.style.backgroundColor = 'red';
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
    bullet.style.width = `${BULLET_WIDTH}px`;
    bullet.style.height = `${BULLET_HEIGHT}px`;
    bullet.style.position = 'absolute';
    
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

// Game timer functions
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

// Game over function
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

// Game win function
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

// Create boundary indicator for player movement
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

// Add new game button during gameplay
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

// Stop the current game
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