// highscores.js
// High score and player statistics management

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