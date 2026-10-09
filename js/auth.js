// Authentication storage keys
const USERS_KEY = "digitalClosetUsers";
const CURRENT_USER_KEY = "digitalClosetCurrentUser";


// Get registered demo users
function getUsers() {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
}


// Get the currently logged-in user
function getCurrentUser() {
    const userId = getCurrentUserId();

    if (!userId) {
        return null;
    }

    return getUsers().find(
        user => user.id === userId
    ) || null;
}


// Get the current user's ID
function getCurrentUserId() {
    return localStorage.getItem(CURRENT_USER_KEY);
}


// Register a new demo user
function registerUser(name, email, password) {
    const users = getUsers();

    const normalizedEmail = email.trim().toLowerCase();

    const alreadyExists = users.some(
        user => user.email === normalizedEmail
    );

    if (alreadyExists) {
        return {
            success: false,
            message: "An account with this email already exists."
        };
    }

    const user = {
        id: crypto.randomUUID(),
        name: name.trim(),
        email: normalizedEmail,
        password: password
    };

    users.push(user);

    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );

    return {
        success: true,
        message: "Account created successfully!"
    };
}


// Log in a demo user

function loginUser(email, password) {
    // Clear any previous session before checking credentials.
    localStorage.removeItem(CURRENT_USER_KEY);

    const normalizedEmail = email.trim().toLowerCase();

    const user = getUsers().find(
        user =>
            user.email === normalizedEmail &&
            user.password === password
    );

    if (!user) {
        return {
            success: false,
            message: "Invalid email or password."
        };
    }

    localStorage.setItem(CURRENT_USER_KEY, user.id);

    return {
        success: true,
        message: "Login successful!"
    };
}



// Log out the current user
function logoutUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.href = "login.html";
}


function requireLogin() {
    if (!getCurrentUser()) {
        window.location.replace("login.html");
        return false;
    }

    return true;
}


// Sign-up form handling
document.addEventListener("DOMContentLoaded", () => {

    const currentUserName =
        document.getElementById("currentUserName");

    if (currentUserName) {
        const currentUser = getCurrentUser();

        if (currentUser) {
            currentUserName.textContent =
                `👤 ${currentUser.name}`;
        }
    }

    const isSignupPage =
        document.getElementById("signupForm");

    const isLoginPage =
        document.getElementById("loginForm");

    if (!isSignupPage && !isLoginPage) {
        if (!getCurrentUser()) {
            window.location.replace("login.html");
            return;
        }
    }

    const signupForm = document.getElementById("signupForm");

    if (signupForm) {
        signupForm.addEventListener("submit", event => {
            event.preventDefault();

            const name =
                document.getElementById("signupName").value.trim();

            const email =
                document.getElementById("signupEmail").value.trim();

            const password =
                document.getElementById("signupPassword").value;

            const confirmPassword =
                document.getElementById("confirmPassword").value;

            const message =
                document.getElementById("signupMessage");

            if (password !== confirmPassword) {
                message.textContent = "Passwords do not match.";
                return;
            }

            const result = registerUser(name, email, password);

            message.textContent = result.message;

            if (result.success) {
                signupForm.reset();

                setTimeout(() => {
                    window.location.href = "login.html";
                }, 800);
            }
        });
    }


    // Login form handling
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", event => {
            event.preventDefault();

            const email =
                document.getElementById("loginEmail").value.trim();

            const password =
                document.getElementById("loginPassword").value;

            const message =
                document.getElementById("loginMessage");

            const result = loginUser(email, password);

            message.textContent = result.message;

            if (result.success) {
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 500);
            }
        });
    }

    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", logoutUser);
    }
});
