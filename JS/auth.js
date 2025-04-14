// dictionary of users
const users = {
    "p": "testuser"
};

// clearing all form values
function clearRegistrationForm() {
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("confirmPassword").value = "";
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("email").value = "";

    // clear BD
    document.getElementById("birthYear").selectedIndex = 0;
    document.getElementById("birthMonth").selectedIndex = 0;
    populateDays();
    document.getElementById("birthDay").selectedIndex = 0;
}

document.addEventListener('DOMContentLoaded', function() {
    // validate login cardentials 
    document.getElementById("loginForm").addEventListener("submit", function(event) {
        event.preventDefault();
        const username = document.getElementById("loginUsername").value;
        const password = document.getElementById("loginPassword").value;

        if (users.hasOwnProperty(username) && users[username] === password) {
            setCurrentPlayer(username);
            clearPreviousPlayerScores();
            setTimeout(() => {
                showScreen("configScreen");
                if (typeof loginMsg !== "undefined") {
                    loginMsg.remove();
                }
            }, 500);
        } else {
            alert("שם משתמש או סיסמה שגויים, נסה שוב.");
        }
    });

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

        // regex
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

        if (users[username]) {
            alert("שם המשתמש כבר קיים במערכת.");
            return;
        }

        users[username] = password;
        alert("נרשמת בהצלחה! כעת תוכל להתחבר.");
        showScreen("loginScreen");
    });

    const yearSelect = document.getElementById('birthYear');
    const monthSelect = document.getElementById('birthMonth');
    const daySelect = document.getElementById('birthDay');
    const currentYear = new Date().getFullYear();

    for (let i = currentYear; i >= 1950; i--) {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
    }

    for (let i = 1; i <= 12; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = i < 10 ? `0${i}` : i;
        monthSelect.appendChild(option);
    }

    populateDays();

    monthSelect.addEventListener('change', populateDays);
    yearSelect.addEventListener('change', populateDays);
    const toggleButtons = document.querySelectorAll('.toggle-password');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.parentElement.querySelector('input');
            
            // Toggle the type attribute
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.textContent = '🔒'; 
                this.title = 'Hide password';
            } else {
                passwordInput.type = 'password';
                this.textContent = '👁️'; 
                this.title = 'Show password';
            }
        });
    });
});

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