//This JS file handle the authentication funcrions, when a user register 

// list of users
const users = {
    "p": "testuser"
};

// clear form inputs
function clearform() {
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("confirmPassword").value = "";
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("email").value = "";

    // reset birthday
    document.getElementById("birthYear").selectedIndex = 0;
    document.getElementById("birthMonth").selectedIndex = 0;
    updatedays();
    document.getElementById("birthDay").selectedIndex = 0;
}

document.addEventListener('DOMContentLoaded', function() {
    // check login info
    document.getElementById("loginForm").addEventListener("submit", function(event) {
        event.preventDefault();
        const username = document.getElementById("loginUsername").value;
        const password = document.getElementById("loginPassword").value;

        if (users.hasOwnProperty(username) && users[username] === password) {
            setplayer(username);
            clearscores();
            setTimeout(() => {
                showscreen("configScreen");
                if (typeof loginMsg !== "undefined") {
                    loginMsg.remove();
                }
            }, 500);
        } else {
            alert("Wrong username or password, try again.");
        }
    });

    document.getElementById("registerSubmitButton").addEventListener("click", function () {
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;
        const confirmpass = document.getElementById("confirmPassword").value;
        const email = document.getElementById("email").value.trim();
        const firstname = document.getElementById("firstName").value.trim();
        const lastname = document.getElementById("lastName").value.trim();
        const birthyear = document.getElementById("birthYear").value;
        const birthmonth = document.getElementById("birthMonth").value;
        const birthday = document.getElementById("birthDay").value;

        // check patterns
        const passcheck = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
        const namecheck = /^[A-Za-z\u0590-\u05FF\s'-]+$/;
        const emailcheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!firstname || !lastname || !email || !username || !password || !confirmpass || !birthyear || !birthmonth || !birthday) {
            alert("Please fill in all fields before registering.");
            return;
        }

        if (!emailcheck.test(email)) {
            alert("Invalid email address.");
            return;
        }

        if (!namecheck.test(firstname) || !namecheck.test(lastname)) {
            alert("First and last name must contain only letters.");
            return;
        }

        if (!passcheck.test(password)) {
            alert("Password must contain at least 8 characters, at least one letter and one number.");
            return;
        }

        if (password !== confirmpass) {
            alert("Passwords do not match.");
            return;
        }

        if (users[username]) {
            alert("Username already exists in the system.");
            return;
        }

        users[username] = password;
        alert("Registration successful! You can now log in.");
        showscreen("loginScreen");
    });

    const yearbox = document.getElementById('birthYear');
    const monthbox = document.getElementById('birthMonth');
    const daybox = document.getElementById('birthDay');
    const currentyear = new Date().getFullYear();

    for (let i = currentyear; i >= 1950; i--) {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        yearbox.appendChild(option);
    }

    for (let i = 1; i <= 12; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = i < 10 ? `0${i}` : i;
        monthbox.appendChild(option);
    }

    updatedays();

    monthbox.addEventListener('change', updatedays);
    yearbox.addEventListener('change', updatedays);
    const togglebtns = document.querySelectorAll('.toggle-password');

    togglebtns.forEach(button => {
        button.addEventListener('click', function() {
            const passinput = this.parentElement.querySelector('input');
            
            // switch input type
            if (passinput.type === 'password') {
                passinput.type = 'text';
                this.textContent = '🔒'; 
                this.title = 'Hide password';
            } else {
                passinput.type = 'password';
                this.textContent = '👁️'; 
                this.title = 'Show password';
            }
        });
    });
});

function updatedays() {
    const monthbox = document.getElementById('birthMonth');
    const yearbox = document.getElementById('birthYear');
    const daybox = document.getElementById('birthDay');
    
    const month = monthbox.value;
    const year = yearbox.value;

    const daysinmonth = new Date(year, month, 0).getDate();
    daybox.innerHTML = '';

    for (let i = 1; i <= daysinmonth; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = i < 10 ? `0${i}` : i;
        daybox.appendChild(option);
    }
}