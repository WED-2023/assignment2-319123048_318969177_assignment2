//  hide all screens
function hideAllScreens() {
    document.querySelectorAll('.screen').forEach(function(screen) {
        screen.style.display = 'none';
    });
}

// display only a wanted screen
function showScreen(screenId) {
    hideAllScreens();
    document.getElementById(screenId).style.display = 'block';
    
    if (typeof audioElements !== 'undefined' && audioElements.backgroundMusic) {
        if (screenId !== 'gameScreen') {
            audioElements.backgroundMusic.pause();
        }
    }
}


document.addEventListener('DOMContentLoaded', function() {
    
    showScreen("welcomeScreen");

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

    document.getElementById("registerButton").addEventListener("click", function() {
        clearRegistrationForm();
        showScreen("registrationScreen");
    });

    document.getElementById("loginButton").addEventListener("click", function() {
        document.getElementById("loginUsername").value = "";
        document.getElementById("loginPassword").value = "";
        showScreen("loginScreen");
    });

    document.getElementById("toLogin").addEventListener("click", function() {
        document.getElementById("loginUsername").value = "";
        document.getElementById("loginPassword").value = "";
        showScreen("loginScreen");
    });

    document.getElementById("toRegister").addEventListener("click", function() {
        clearRegistrationForm();
        showScreen("registrationScreen");
    });
});