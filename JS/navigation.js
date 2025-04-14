// navigation.js
// Handles all screen navigation and UI transitions

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
    //making sure that when it's not Game screen, the music won't play
    if (typeof audioElements !== 'undefined' && audioElements.backgroundMusic) {
        if (screenId !== 'gameScreen') {
            audioElements.backgroundMusic.pause();
        }
    }
}

// Set up navigation event listeners when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
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
});