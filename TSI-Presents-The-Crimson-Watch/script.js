
// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Add fade-in animation for sections
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',


// User authentication status check
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Update navigation based on login status
    updateNavigation(currentUser);
    
    // Check if there's a logout button and add event listener
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
});

// Update navigation based on user login status
function updateNavigation(user) {
    const loginLink = document.querySelector('nav a[href="login.html"]');
    
    if (loginLink) {
        if (user && user.isLoggedIn) {
            // Change login link to show username and logout option
            loginLink.innerHTML = `<i class="fas fa-user"></i> ${user.username} <i class="fas fa-caret-down"></i>`;
            loginLink.href = "#";
            
            // Create dropdown menu
            const dropdown = document.createElement('div');
            dropdown.className = 'dropdown-menu';
            dropdown.innerHTML = `
                <a href="profile.html"><i class="fas fa-id-card"></i> Profile</a>
                <a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a>
            `;
            
            // Add the dropdown to the parent li element
            const parentLi = loginLink.parentElement;
            parentLi.style.position = 'relative';
            parentLi.appendChild(dropdown);
            
            // Toggle dropdown on click
            loginLink.addEventListener('click', function(e) {
                e.preventDefault();
                dropdown.classList.toggle('show');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function(e) {
                if (!parentLi.contains(e.target)) {
                    dropdown.classList.remove('show');
                }
            });
        }
    }
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    alert('You have been logged out successfully!');
    window.location.reload();
}


        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
});

// Update server time
function updateServerTime() {
    const now = new Date();
    const timeElement = document.getElementById('server-time');
    
    if (timeElement) {
        timeElement.textContent = now.toLocaleTimeString();
    }
}

// Run the updateServerTime function every second
setInterval(updateServerTime, 1000);
