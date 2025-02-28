
// Sample data - in a real application, this would come from a server
const marketplaceItems = [
    {
        id: 1,
        name: "Blood Red M4A1",
        category: "weapons",
        description: "An M4A1 with a crimson blood pattern and black accents.",
        price: 10,
        image: "https://i.imgur.com/JE2zF3v.jpg" // placeholder image
    },
    {
        id: 2,
        name: "Arctic Wolf Plate Carrier",
        category: "clothing",
        description: "A plate carrier with a snow camo pattern.",
        price: 8,
        image: "https://i.imgur.com/JE2zF3v.jpg" // placeholder image
    },
    {
        id: 3,
        name: "Apocalypse SUV",
        category: "vehicles",
        description: "An SUV with post-apocalyptic styling and rust accents.",
        price: 15,
        image: "https://i.imgur.com/JE2zF3v.jpg" // placeholder image
    },
    {
        id: 4,
        name: "Skull Tent",
        category: "base",
        description: "A tent with skull and bones pattern for your base.",
        price: 6,
        image: "https://i.imgur.com/JE2zF3v.jpg" // placeholder image
    }
];

// Sample queue data
const queueData = {
    standard: { length: 12, waitTime: "7 days" },
    priority: { length: 4, waitTime: "2 days" },
    express: { length: 1, waitTime: "24 hours" }
};

// Sample user requests
const userRequests = [
    {
        id: 101,
        item: "AKM",
        specificItem: "AKM Assault Rifle",
        description: "Forest camo with gold accents",
        status: "pending",
        queueType: "standard",
        submitDate: "2023-11-10",
        estimatedCompletion: "2023-11-17"
    },
    {
        id: 102,
        item: "clothing",
        specificItem: "Combat Jacket",
        description: "Urban digital camo pattern",
        status: "in-progress",
        queueType: "priority",
        submitDate: "2023-11-12",
        estimatedCompletion: "2023-11-14"
    }
];

// DOM Elements
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let tabButtons;
let tabContents;
let categoryFilter;
let searchInput;
let itemsContainer;

// Sample priority queue packages data
const priorityPackages = {
    bronze: {
        name: "Bronze",
        price: 5,
        duration: "1 week",
        features: [
            "Server join priority",
            "Skip 50% of regular queue",
            "Special bronze name tag"
        ]
    },
    silver: {
        name: "Silver",
        price: 12,
        duration: "1 month",
        features: [
            "High server join priority",
            "Skip 75% of regular queue",
            "Special silver name tag",
            "1 free item retexture"
        ]
    },
    gold: {
        name: "Gold",
        price: 25,
        duration: "3 months",
        features: [
            "Highest server join priority",
            "Skip 100% of regular queue",
            "Special gold name tag",
            "3 free item retextures",
            "Custom spawn loadout"
        ]
    }
};

// Sample user priority status
const userPriorityStatus = {
    active: false,
    package: null,
    purchaseDate: null,
    expiryDate: null
};

// Initialize page after DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    loadMarketplaceItems();
    loadQueueStatus();
    setupEventListeners();
    checkUserLoggedIn();
    loadPriorityStatus();
});

// Initialize tab functionality
function initializeTabs() {
    tabButtons = document.querySelectorAll('.tab-btn');
    tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            // Toggle active class on buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Toggle active class on content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabName) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// Load marketplace items
function loadMarketplaceItems() {
    itemsContainer = document.querySelector('.items-grid');
    categoryFilter = document.getElementById('category-filter');
    searchInput = document.getElementById('search-items');
    
    renderItems(marketplaceItems);
}

// Render items to the grid
function renderItems(items) {
    if (!itemsContainer) return;
    
    itemsContainer.innerHTML = '';
    
    if (items.length === 0) {
        itemsContainer.innerHTML = '<p class="no-items">No items found matching your criteria.</p>';
        return;
    }
    
    items.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        
        itemCard.innerHTML = `
            <div class="item-image" style="background-image: url(${item.image})">
                <span class="item-category">${item.category}</span>
            </div>
            <div class="item-details">
                <h3 class="item-name">${item.name}</h3>
                <p class="item-description">${item.description}</p>
                <div class="item-price">
                    <span class="price">${item.price} Credits</span>
                    <button class="item-button" data-id="${item.id}">Purchase</button>
                </div>
            </div>
        `;
        
        itemsContainer.appendChild(itemCard);
    });
    
    // Add event listeners to purchase buttons
    document.querySelectorAll('.item-button').forEach(button => {
        button.addEventListener('click', handlePurchase);
    });
}

// Handle item purchase
function handlePurchase(e) {
    const itemId = e.target.getAttribute('data-id');
    const item = marketplaceItems.find(i => i.id == itemId);
    
    if (!currentUser) {
        alert('Please login first to purchase items.');
        return;
    }
    
    // In a real application, this would handle the purchase process
    alert(`You've requested to purchase ${item.name} for ${item.price} Credits.`);
}

// Filter items based on category and search term
function filterItems() {
    const category = categoryFilter.value;
    const searchTerm = searchInput.value.toLowerCase();
    
    let filteredItems = marketplaceItems;
    
    if (category !== 'all') {
        filteredItems = filteredItems.filter(item => item.category === category);
    }
    
    if (searchTerm) {
        filteredItems = filteredItems.filter(item => 
            item.name.toLowerCase().includes(searchTerm) || 
            item.description.toLowerCase().includes(searchTerm)
        );
    }
    
    renderItems(filteredItems);
}

// Load queue status information
function loadQueueStatus() {
    document.getElementById('standard-queue-length').textContent = queueData.standard.length;
    document.getElementById('standard-wait-time').textContent = queueData.standard.waitTime;
    
    document.getElementById('priority-queue-length').textContent = queueData.priority.length;
    document.getElementById('priority-wait-time').textContent = queueData.priority.waitTime;
    
    document.getElementById('express-queue-length').textContent = queueData.express.length;
    document.getElementById('express-wait-time').textContent = queueData.express.waitTime;
    
    loadUserRequests();
}

// Load user's requests if logged in
function loadUserRequests() {
    const userRequestsContainer = document.getElementById('user-requests');
    
    if (!currentUser) {
        userRequestsContainer.innerHTML = '<p class="login-prompt">Please login to view your requests</p>';
        return;
    }
    
    if (userRequests.length === 0) {
        userRequestsContainer.innerHTML = '<p class="no-items">You have no active requests.</p>';
        return;
    }
    
    let html = '';
    userRequests.forEach(request => {
        html += `
            <div class="request-card">
                <div class="request-header">
                    <div class="request-title">${request.specificItem}</div>
                    <div class="request-status ${request.status}">${request.status}</div>
                </div>
                <div class="request-meta">
                    <div>Submitted: ${request.submitDate}</div>
                    <div>Queue: ${request.queueType}</div>
                    <div>Est. Completion: ${request.estimatedCompletion}</div>
                </div>
                <div class="request-description">${request.description}</div>
            </div>
        `;
    });
    
    userRequestsContainer.innerHTML = html;
}

// Set up event listeners
function setupEventListeners() {
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterItems);
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', filterItems);
    }
    
    const customRequestForm = document.getElementById('custom-request-form');
    if (customRequestForm) {
        customRequestForm.addEventListener('submit', handleCustomRequest);
    }
    
    // Add event listeners for priority package purchase buttons
    document.querySelectorAll('.purchase-btn').forEach(button => {
        button.addEventListener('click', handlePriorityPurchase);
    });
}

// Handle priority package purchase
function handlePriorityPurchase(e) {
    const packageType = e.target.getAttribute('data-package');
    const packageData = priorityPackages[packageType];
    
    if (!currentUser) {
        alert('Please login first to purchase priority queue packages.');
        return;
    }
    
    // In a real application, this would handle the purchase process
    const confirmPurchase = confirm(`Are you sure you want to purchase the ${packageData.name} package for ${packageData.price} Credits?`);
    
    if (confirmPurchase) {
        // Simulate successful purchase
        const today = new Date();
        let expiryDate = new Date();
        
        if (packageType === 'bronze') {
            expiryDate.setDate(today.getDate() + 7); // 1 week
        } else if (packageType === 'silver') {
            expiryDate.setMonth(today.getMonth() + 1); // 1 month
        } else if (packageType === 'gold') {
            expiryDate.setMonth(today.getMonth() + 3); // 3 months
        }
        
        // Update user priority status
        userPriorityStatus.active = true;
        userPriorityStatus.package = packageType;
        userPriorityStatus.purchaseDate = today.toISOString().split('T')[0];
        userPriorityStatus.expiryDate = expiryDate.toISOString().split('T')[0];
        
        // Update the displayed status
        loadPriorityStatus();
        
        alert(`You've successfully purchased the ${packageData.name} priority package! It will expire on ${userPriorityStatus.expiryDate}.`);
    }
}

// Load and display priority status
function loadPriorityStatus() {
    const statusContainer = document.getElementById('user-priority-status');
    if (!statusContainer) return;
    
    if (!currentUser) {
        statusContainer.innerHTML = '<p class="status-message">Please login to view your priority status.</p>';
        return;
    }
    
    if (!userPriorityStatus.active) {
        statusContainer.innerHTML = '<p class="status-message">You don\'t have any active priority queue packages.</p>';
        return;
    }
    
    const packageInfo = priorityPackages[userPriorityStatus.package];
    
    statusContainer.innerHTML = `
        <div class="active-priority">
            <div>
                <span class="active-priority-type">${packageInfo.name} Priority</span>
                <div class="active-priority-expires">Expires: ${userPriorityStatus.expiryDate}</div>
            </div>
            <div>
                <button class="item-button" id="extend-priority">Extend</button>
            </div>
        </div>
    `;
    
    // Add event listener for extend button
    const extendButton = document.getElementById('extend-priority');
    if (extendButton) {
        extendButton.addEventListener('click', () => {
            alert(`To extend your priority status, please purchase a new package when your current one expires.`);
        });
    }
}

// Handle custom request submission
function handleCustomRequest(e) {
    e.preventDefault();
    
    if (!currentUser) {
        alert('Please login first to submit custom requests.');
        return;
    }
    
    const formData = {
        item: document.getElementById('request-item').value,
        specificItem: document.getElementById('specific-item').value,
        description: document.getElementById('request-description').value,
        queueType: document.getElementById('priority-queue').value
    };
    
    // In a real application, this would send the data to a server
    alert('Your custom retexture request has been submitted!');
    
    // Reset form
    e.target.reset();
}

// Check if user is logged in
function checkUserLoggedIn() {
    if (document.getElementById('username') && currentUser) {
        document.getElementById('username').value = currentUser.username;
    }
}
