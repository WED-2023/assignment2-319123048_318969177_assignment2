let currentPlayer = null;

// save username
function setCurrentPlayer(username) {
    currentPlayer = username;
    localStorage.setItem('currentPlayer', username);
}

//  get  username
function getCurrentPlayer() {
    if (!currentPlayer) {
        currentPlayer = localStorage.getItem('currentPlayer');
    }
    return currentPlayer;
}

//  save a score
function saveHighScore(score, gameResult) {
    const player = getCurrentPlayer();

    let highScores = getHighScores();
    const newScore = {
        score: score,
        date: new Date().toLocaleString(),
        result: gameResult
    };
    
    highScores.push(newScore);
    
    highScores.sort(function(a, b) {
        return b.score - a.score;
      });
    
    localStorage.setItem(`highScores_${player}`, JSON.stringify(highScores));
    
    return getRank(score);
}

//  get history 
function getHighScores() {
    const player = getCurrentPlayer();
    
    const scoresJSON = localStorage.getItem(`highScores_${player}`);
    return scoresJSON ? JSON.parse(scoresJSON) : [];
}

// Function to clear high scores when a new player logs in
function clearPreviousPlayerScores() {
    // We don't actually delete - we just don't load them
    // They'll still be in localStorage if the previous player logs back in
}

// rank of the score
function getRank(score) {
    const scores = getHighScores();
    return scores.findIndex(s => s.score === score) + 1;
}

// show table
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