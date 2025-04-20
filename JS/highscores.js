// This JS file handle the score and save it for the user in a score table in local storage

let currentplayer = null;

// save player name
function setplayer(username) {
    currentplayer = username;
    localStorage.setItem('currentplayer', username);
}

// get player name
function getplayer() {
    if (!currentplayer) {
        currentplayer = localStorage.getItem('currentplayer');
    }
    return currentplayer;
}

// save player score
function savehighscore(score, gameresult) {
    const player = getplayer();

    let highscores = gethighscores();
    const newscore = {
        score: score,
        date: new Date().toLocaleString(),
        result: gameresult
    };
    
    highscores.push(newscore);
    
    highscores.sort(function(a, b) {
        return b.score - a.score;
      });
    
    localStorage.setItem(`highscores_${player}`, JSON.stringify(highscores));
    
    return getrank(score);
}

// get score history 
function gethighscores() {
    const player = getplayer();
    
    const scoredata = localStorage.getItem(`highscores_${player}`);
    return scoredata ? JSON.parse(scoredata) : [];
}

// clear scores for new login
function clearscores() {
    // just don't load them - keep in storage for when player logs in again
}

// get score rank
function getrank(score) {
    const scores = gethighscores();
    return scores.findIndex(s => s.score === score) + 1;
}

// make score table
function showhighscores() {
    const highscores = gethighscores();
    
    if (highscores.length === 0) {
        return '<p>No high scores yet. Play a game!</p>';
    }
    
    let tablehtml = `
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
    
    highscores.forEach((score, index) => {
        tablehtml += `
            <tr>
                <td>${index + 1}</td>
                <td>${score.score}</td>
                <td>${score.date}</td>
                <td>${score.result}</td>
            </tr>
        `;
    });
    
    tablehtml += `
            </tbody>
        </table>
    `;
    
    return tablehtml;
}