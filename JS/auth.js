// auth.js
// Handles user authentication, registration, and session management

// Dictionary of sample users
const users = {
    "p": "testuser"
};

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

document.addEventListener('DOMContentLoaded', function() {
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
            
            // if yes, move to the configuration screen
            setTimeout(() => {
                showScreen("configScreen");
                
                // if there is an error
                if (typeof loginMsg !== "undefined") {
                    loginMsg.remove();
                }
            }, 500);
        } else {
            // if the user is not in the dictionary 
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

    // Initialize the days when month or year is selected
    populateDays();

    monthSelect.addEventListener('change', populateDays);
    yearSelect.addEventListener('change', populateDays);

    // Add event listeners to toggle password visibility
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

// Populate days based on selected year and month
function populateDays() {
    const monthSelect = document.getElementById('birthMonth');
    const yearSelect = document.getElementById('birthYear');
    const daySelect = document.getElementById('birthDay');
    
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