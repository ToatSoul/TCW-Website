
// Simulated database for tickets (would be replaced by a real backend)
let ticketsDB = JSON.parse(localStorage.getItem('tickets')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Admin usernames - in a real implementation, this would be stored securely on the server
const admins = ['admin', 'moderator'];

// DOM Elements
const loginForm = document.getElementById('login-form');
const ticketDashboard = document.getElementById('ticket-dashboard');
const ticketLogin = document.getElementById('ticket-login');
const ticketsList = document.getElementById('tickets-list');
const ticketForm = document.getElementById('ticket-form');
const submitTicketForm = document.getElementById('submit-ticket-form');
const newTicketBtn = document.getElementById('new-ticket-btn');
const backToListBtn = document.getElementById('back-to-list');
const ticketDetails = document.getElementById('ticket-details');
const backToListFromDetailsBtn = document.getElementById('back-to-list-from-details');
const adminPanel = document.getElementById('admin-panel');

// Check if user is logged in
function init() {
    if (currentUser) {
        showDashboard();
        loadUserTickets();
        
        // Check if user is admin
        if (admins.includes(currentUser.username.toLowerCase())) {
            adminPanel.style.display = 'block';
            loadAdminTickets('open');
        }
    }
}

// Event Listeners
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    
    // Simple validation
    if (username && email) {
        currentUser = { username, email };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        showDashboard();
        loadUserTickets();
        
        // Check if admin
        if (admins.includes(username.toLowerCase())) {
            adminPanel.style.display = 'block';
            loadAdminTickets('open');
        }
    }
});

newTicketBtn.addEventListener('click', function() {
    ticketDashboard.style.display = 'none';
    ticketForm.style.display = 'block';
});

backToListBtn.addEventListener('click', function() {
    ticketForm.style.display = 'none';
    ticketDashboard.style.display = 'block';
});

backToListFromDetailsBtn.addEventListener('click', function() {
    ticketDetails.style.display = 'none';
    ticketDashboard.style.display = 'block';
});

submitTicketForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const subject = document.getElementById('ticket-subject').value.trim();
    const category = document.getElementById('ticket-category').value;
    const priority = document.getElementById('ticket-priority').value;
    const message = document.getElementById('ticket-message').value.trim();
    
    if (subject && category && priority && message) {
        const ticket = {
            id: Date.now().toString(),
            subject,
            category,
            priority,
            message,
            status: 'open',
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            user: currentUser,
            replies: []
        };
        
        // Add ticket to database
        ticketsDB.push(ticket);
        saveTickets();
        
        // Reset form and go back to dashboard
        submitTicketForm.reset();
        ticketForm.style.display = 'none';
        ticketDashboard.style.display = 'block';
        
        // Reload tickets
        loadUserTickets();
    }
});

// Handle ticket item clicks
document.addEventListener('click', function(e) {
    if (e.target.closest('.ticket-item')) {
        const ticketId = e.target.closest('.ticket-item').dataset.id;
        showTicketDetails(ticketId);
    }
});

// Handle reply submission
document.getElementById('submit-reply').addEventListener('click', function() {
    const replyMessage = document.getElementById('reply-message').value.trim();
    const ticketId = document.getElementById('ticket-info').dataset.id;
    
    if (replyMessage && ticketId) {
        const ticket = ticketsDB.find(t => t.id === ticketId);
        
        if (ticket) {
            const isAdmin = admins.includes(currentUser.username.toLowerCase());
            
            const reply = {
                id: Date.now().toString(),
                message: replyMessage,
                created: new Date().toISOString(),
                user: currentUser.username,
                isAdmin
            };
            
            ticket.replies.push(reply);
            ticket.status = isAdmin ? 'pending' : 'open';
            ticket.updated = new Date().toISOString();
            
            saveTickets();
            showTicketDetails(ticketId); // Refresh the view
            document.getElementById('reply-message').value = '';
        }
    }
});

// Tab switching in admin panel
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const tab = this.dataset.tab;
        
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        loadAdminTickets(tab);
    });
});

// Admin actions
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('close-ticket')) {
        const ticketId = e.target.dataset.id;
        const ticket = ticketsDB.find(t => t.id === ticketId);
        
        if (ticket && admins.includes(currentUser.username.toLowerCase())) {
            ticket.status = 'closed';
            ticket.updated = new Date().toISOString();
            saveTickets();
            
            if (ticketDetails.style.display === 'block') {
                showTicketDetails(ticketId);
            }
            
            loadAdminTickets('open');
            loadUserTickets();
        }
    } else if (e.target.classList.contains('reopen-ticket')) {
        const ticketId = e.target.dataset.id;
        const ticket = ticketsDB.find(t => t.id === ticketId);
        
        if (ticket && admins.includes(currentUser.username.toLowerCase())) {
            ticket.status = 'open';
            ticket.updated = new Date().toISOString();
            saveTickets();
            
            if (ticketDetails.style.display === 'block') {
                showTicketDetails(ticketId);
            }
            
            loadAdminTickets('closed');
            loadUserTickets();
        }
    }
});

// Functions
function showDashboard() {
    ticketLogin.style.display = 'none';
    ticketDashboard.style.display = 'block';
}

function loadUserTickets() {
    const userTickets = ticketsDB.filter(ticket => 
        ticket.user.username.toLowerCase() === currentUser.username.toLowerCase()
    );
    
    if (userTickets.length === 0) {
        ticketsList.innerHTML = '<p class="no-tickets">You don\'t have any tickets yet.</p>';
        return;
    }
    
    // Sort tickets: open first, then by date
    userTickets.sort((a, b) => {
        if (a.status === 'closed' && b.status !== 'closed') return 1;
        if (a.status !== 'closed' && b.status === 'closed') return -1;
        return new Date(b.updated) - new Date(a.updated);
    });
    
    // Generate HTML
    let html = '';
    userTickets.forEach(ticket => {
        const date = new Date(ticket.updated).toLocaleDateString();
        
        html += `
            <div class="ticket-item priority-${ticket.priority}" data-id="${ticket.id}">
                <div class="ticket-header">
                    <div class="ticket-subject">${ticket.subject}</div>
                    <div class="ticket-status ${ticket.status}">${ticket.status}</div>
                </div>
                <div class="ticket-meta">
                    <div>Category: ${ticket.category}</div>
                    <div>Updated: ${date}</div>
                </div>
            </div>
        `;
    });
    
    ticketsList.innerHTML = html;
}

function loadAdminTickets(status) {
    if (!admins.includes(currentUser.username.toLowerCase())) return;
    
    const adminTicketsList = document.getElementById('admin-tickets-list');
    
    let filteredTickets = ticketsDB;
    if (status === 'open') {
        filteredTickets = ticketsDB.filter(t => t.status !== 'closed');
    } else {
        filteredTickets = ticketsDB.filter(t => t.status === 'closed');
    }
    
    if (filteredTickets.length === 0) {
        adminTicketsList.innerHTML = '<p class="no-tickets">No tickets found.</p>';
        return;
    }
    
    // Sort tickets by priority and date
    filteredTickets.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return new Date(b.updated) - new Date(a.updated);
    });
    
    // Generate HTML
    let html = '';
    filteredTickets.forEach(ticket => {
        const date = new Date(ticket.updated).toLocaleDateString();
        
        html += `
            <div class="ticket-item priority-${ticket.priority}" data-id="${ticket.id}">
                <div class="ticket-header">
                    <div class="ticket-subject">${ticket.subject}</div>
                    <div class="ticket-status ${ticket.status}">${ticket.status}</div>
                </div>
                <div class="ticket-meta">
                    <div>From: ${ticket.user.username}</div>
                    <div>Updated: ${date}</div>
                </div>
                <div class="ticket-actions" style="margin-top: 0.5rem;">
                    ${ticket.status !== 'closed' ? 
                      `<button class="btn btn-secondary close-ticket" data-id="${ticket.id}">Close Ticket</button>` : 
                      `<button class="btn btn-secondary reopen-ticket" data-id="${ticket.id}">Reopen Ticket</button>`
                    }
                </div>
            </div>
        `;
    });
    
    adminTicketsList.innerHTML = html;
}

function showTicketDetails(ticketId) {
    const ticket = ticketsDB.find(t => t.id === ticketId);
    
    if (!ticket) return;
    
    const isAdmin = admins.includes(currentUser.username.toLowerCase());
    const ticketInfo = document.getElementById('ticket-info');
    const ticketReplies = document.getElementById('ticket-replies');
    
    // Format dates
    const createdDate = new Date(ticket.created).toLocaleString();
    const updatedDate = new Date(ticket.updated).toLocaleString();
    
    // Generate ticket info HTML
    let infoHtml = `
        <div class="ticket-info-header" data-id="${ticket.id}">
            <div class="ticket-info-subject">${ticket.subject}</div>
            <div class="ticket-info-actions">
                ${isAdmin && ticket.status !== 'closed' ? 
                  `<button class="close-ticket" data-id="${ticket.id}"><i class="fas fa-times-circle"></i> Close</button>` : 
                  isAdmin && ticket.status === 'closed' ? 
                  `<button class="reopen-ticket" data-id="${ticket.id}"><i class="fas fa-redo"></i> Reopen</button>` : 
                  ''
                }
            </div>
        </div>
        <div class="ticket-info-meta">
            <div class="meta-item">
                <i class="fas fa-tag"></i> 
                <span>Category: ${ticket.category}</span>
            </div>
            <div class="meta-item">
                <i class="fas fa-exclamation-circle"></i> 
                <span>Priority: ${ticket.priority}</span>
            </div>
            <div class="meta-item">
                <i class="fas fa-clock"></i> 
                <span>Created: ${createdDate}</span>
            </div>
            <div class="meta-item">
                <i class="fas fa-sync-alt"></i> 
                <span>Updated: ${updatedDate}</span>
            </div>
            <div class="meta-item">
                <i class="fas fa-user"></i> 
                <span>Submitted by: ${ticket.user.username}</span>
            </div>
            <div class="meta-item">
                <i class="fas fa-info-circle"></i> 
                <span>Status: <span class="ticket-status ${ticket.status}">${ticket.status}</span></span>
            </div>
        </div>
        <div>
            <h4>Description</h4>
            <div class="ticket-message">${ticket.message}</div>
        </div>
    `;
    
    // Generate replies HTML
    let repliesHtml = '<h4>Replies</h4>';
    
    if (ticket.replies.length === 0) {
        repliesHtml += '<p>No replies yet.</p>';
    } else {
        ticket.replies.forEach(reply => {
            const replyDate = new Date(reply.created).toLocaleString();
            const replyClass = reply.isAdmin ? 'admin' : '';
            
            repliesHtml += `
                <div class="reply ${replyClass}">
                    <div class="reply-header">
                        <div>${reply.isAdmin ? `<i class="fas fa-shield-alt"></i> ${reply.user} (Staff)` : reply.user}</div>
                        <div>${replyDate}</div>
                    </div>
                    <div class="reply-content">${reply.message}</div>
                </div>
            `;
        });
    }
    
    // Update DOM
    ticketInfo.innerHTML = infoHtml;
    ticketInfo.dataset.id = ticket.id;
    ticketReplies.innerHTML = repliesHtml;
    
    // Hide other sections and show details
    ticketDashboard.style.display = 'none';
    ticketForm.style.display = 'none';
    ticketDetails.style.display = 'block';
    
    // Disable reply form if ticket is closed
    const replyForm = document.getElementById('reply-form');
    if (ticket.status === 'closed') {
        replyForm.style.display = 'none';
    } else {
        replyForm.style.display = 'block';
    }
}

function saveTickets() {
    localStorage.setItem('tickets', JSON.stringify(ticketsDB));
}

// Initialize the page
init();
