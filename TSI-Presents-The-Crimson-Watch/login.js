
// Switch between login and signup tabs
document.addEventListener('DOMContentLoaded', function() {
    // Get tab buttons and content divs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const authForms = document.querySelectorAll('.auth-form');
    
    // Add click event to each tab button
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and forms
            tabButtons.forEach(btn => btn.classList.remove('active'));
            authForms.forEach(form => form.classList.remove('active'));
            
            // Add active class to clicked button and corresponding form
            button.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });
    
    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const rememberMe = document.getElementById('remember-me').checked;
            
            // Here you would normally make an API call to your backend
            console.log('Login attempt:', { email, rememberMe });
            
            // For demo purposes, simulate a successful login
            simulateLogin(email);
        });
    }
    
    // Signup form submission
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('signup-email').value;
            const username = document.getElementById('signup-username').value;
            const steamUID = document.getElementById('signup-steam-uid').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;
            const termsAccepted = document.getElementById('terms').checked;
            
            // Validate passwords match
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            // Here you would normally make an API call to your backend
            console.log('Signup attempt:', { email, username, steamUID, termsAccepted });
            
            // For demo purposes, simulate a successful signup
            simulateSignup(email, username);
        });
    }
});

// Toggle password visibility
function togglePassword(inputId) {
    const passwordInput = document.getElementById(inputId);
    const icon = passwordInput.nextElementSibling.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Simulate login success (demo only)
function simulateLogin(email) {
    // Create a user object that would normally come from your backend
    const user = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        email: email,
        username: email.split('@')[0], // Just for demo
        isLoggedIn: true
    };
    
    // Save to localStorage (in a real app, you'd use a more secure method with tokens)
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Redirect to homepage or dashboard
    alert('Login successful! Redirecting...');
    window.location.href = 'index.html';
}

// Simulate signup success (demo only)
function simulateSignup(email, username) {
    // Create a user object that would normally come from your backend
    const user = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        email: email,
        username: username,
        isLoggedIn: true
    };
    
    // Save to localStorage (in a real app, you'd use a more secure method with tokens)
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Redirect to homepage or dashboard
    alert('Account created successfully! Redirecting...');
    window.location.href = 'index.html';
}
