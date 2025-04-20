// This JS file handle all screens and navigation from one another, making sure that in any time there is only one screen showing,
// making the navigation smoother

// hide all screens
function hideallscreens() {
    document.querySelectorAll('.screen').forEach(function(screen) {
        screen.style.display = 'none';
    });
}

// show just one screen
function showscreen(screenid) {
    hideallscreens();
    document.getElementById(screenid).style.display = 'block';
    
    if (typeof sounds !== 'undefined' && sounds.backgroundmusic) {
        if (screenid !== 'gameScreen') {
            sounds.backgroundmusic.pause();
        }
    }
}


document.addEventListener('DOMContentLoaded', function() {
    
    showscreen("welcomeScreen");

    document.getElementById("goToWelcome").addEventListener("click", function() {
        showscreen("welcomeScreen");
    });

    document.getElementById("goToLogin").addEventListener("click", function() {
        document.getElementById("loginUsername").value = "";
        document.getElementById("loginPassword").value = "";
        showscreen("loginScreen");
    });

    document.getElementById("goToRegister").addEventListener("click", function() {
        clearform();
        showscreen("registrationScreen");
    });

    document.getElementById("registerButton").addEventListener("click", function() {
        clearform();
        showscreen("registrationScreen");
    });

    document.getElementById("loginButton").addEventListener("click", function() {
        document.getElementById("loginUsername").value = "";
        document.getElementById("loginPassword").value = "";
        showscreen("loginScreen");
    });

    document.getElementById("toLogin").addEventListener("click", function() {
        document.getElementById("loginUsername").value = "";
        document.getElementById("loginPassword").value = "";
        showscreen("loginScreen");
    });

    document.getElementById("toRegister").addEventListener("click", function() {
        clearform();
        showscreen("registrationScreen");
    });
});