// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartCount = document.querySelector('.cart-count');
let cartItemsContainer = document.querySelector('.cart-items');
let totalPriceElement = document.querySelector('.total-price');
let cartSidebar = document.querySelector('.cart-sidebar');

// Modal elements
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const closeModalButtons = document.querySelectorAll('.close-modal');

// Initialize cart count
updateCartCount();

// Add to cart buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        const name = this.getAttribute('data-name');
        const price = parseFloat(this.getAttribute('data-price'));
        const img = this.getAttribute('data-img');
        
        addToCart(id, name, price, img);
        showNotification(`${name} added to cart!`);
    });
});

// Login/Signup buttons
document.querySelector('.login-btn').addEventListener('click', () => {
    loginModal.style.display = 'flex';
});

document.querySelector('.signup-btn').addEventListener('click', () => {
    registerModal.style.display = 'flex';
});

// Close modal buttons
closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        loginModal.style.display = 'none';
        registerModal.style.display = 'none';
    });
});

// Show register form
document.getElementById('showRegister').addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'none';
    registerModal.style.display = 'flex';
});

// Show login form
document.getElementById('showLogin').addEventListener('click', (e) => {
    e.preventDefault();
    registerModal.style.display = 'none';
    loginModal.style.display = 'flex';
});

// Login form submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simple validation
    if (email && password) {
        localStorage.setItem('userEmail', email);
        localStorage.setItem('isLoggedIn', 'true');
        showNotification('Login successful!');
        loginModal.style.display = 'none';
        updateNavButtons();
        this.reset();
    } else {
        showNotification('Please fill in all fields');
    }
});

// Register form submission
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    // Simple validation
    if (!name || !email || !phone || !password || !confirmPassword) {
        showNotification('Please fill in all fields');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match');
        return;
    }
    
    // Save user data
    const userData = {
        name: name,
        email: email,
        phone: phone,
        password: password
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('userEmail', email);
    localStorage.setItem('isLoggedIn', 'true');
    
    showNotification('Registration successful!');
    registerModal.style.display = 'none';
    updateNavButtons();
    this.reset();
});

// Contact form submission
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;
    
    // Simple validation
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all fields');
        return;
    }
    
    // Save contact message (in real app, this would go to a server)
    const contactData = {
        name: name,
        email: email,
        subject: subject,
        message: message,
        timestamp: new Date().toISOString()
    };
    
    // Save to localStorage for demo
    const savedContacts = JSON.parse(localStorage.getItem('contactMessages')) || [];
    savedContacts.push(contactData);
    localStorage.setItem('contactMessages', JSON.stringify(savedContacts));
    
    showNotification('Message sent successfully! We will contact you soon.');
    this.reset();
});

// Cart button click
document.querySelector('.cart-btn').addEventListener('click', () => {
    cartSidebar.classList.add('active');
    updateCartDisplay();
});

// Close cart
document.querySelector('.close-cart').addEventListener('click', () => {
    cartSidebar.classList.remove('active');
});

// FAQ functionality
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        item.classList.toggle('active');
    });
});

// Newsletter subscription
document.querySelector('.newsletter button').addEventListener('click', function() {
    const email = this.parentElement.querySelector('input').value;
    if (email) {
        showNotification('Thank you for subscribing!');
        this.parentElement.querySelector('input').value = '';
    }
});

// Checkout button
document.querySelector('.checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    showNotification('Checkout feature will be implemented soon!');
    cart = [];
    saveCart();
    updateCartCount();
    updateCartDisplay();
    cartSidebar.classList.remove('active');
});

// Functions
function addToCart(id, name, price, img) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            img: img,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    updateCartDisplay();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function updateCartDisplay() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: #666;">Your cart is empty</p>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price} × ${item.quantity} = $${itemTotal.toFixed(2)}</p>
                </div>
                <div class="cart-item-actions">
                    <button onclick="decreaseQuantity(${item.id})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="increaseQuantity(${item.id})">+</button>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">×</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    }
    
    totalPriceElement.textContent = `$${total.toFixed(2)}`;
}

function increaseQuantity(id) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity++;
        saveCart();
        updateCartCount();
        updateCartDisplay();
    }
}

function decreaseQuantity(id) {
    const item = cart.find(item => item.id === id);
    if (item) {
        if (item.quantity > 1) {
            item.quantity--;
        } else {
            removeFromCart(id);
            return;
        }
        saveCart();
        updateCartCount();
        updateCartDisplay();
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartCount();
    updateCartDisplay();
    showNotification('Item removed from cart');
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    
    notificationText.textContent = message;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Navigation to menu dashboard
function goToMenuDashboard(menuType) {
    // Check if user is logged in
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        showNotification('Please login first to view menus');
        loginModal.style.display = 'flex';
        return;
    }
    
    // Save selected menu type
    localStorage.setItem('selectedMenu', menuType);
    
    // Redirect to menu dashboard
    window.location.href = 'menu-dashboard.html';
}

// Go to checkout
function goToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        showNotification('Please login first to checkout');
        loginModal.style.display = 'flex';
        return;
    }
    
    // Redirect to checkout page
    window.location.href = 'checkout.html';
}

// Update navigation buttons based on login status
function updateNavButtons() {
    const loginBtn = document.querySelector('.login-btn');
    const signupBtn = document.querySelector('.signup-btn');
    
    if (localStorage.getItem('isLoggedIn') === 'true') {
        const userEmail = localStorage.getItem('userEmail') || 'User';
        loginBtn.textContent = userEmail.split('@')[0];
        signupBtn.textContent = 'Logout';
        
        // Change logout functionality
        signupBtn.onclick = function() {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userEmail');
            showNotification('Logged out successfully');
            updateNavButtons();
        };
    } else {
        loginBtn.textContent = 'Login';
        signupBtn.textContent = 'Sign Up';
        
        // Reset original functionality
        loginBtn.onclick = function() {
            loginModal.style.display = 'flex';
        };
        signupBtn.onclick = function() {
            registerModal.style.display = 'flex';
        };
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                document.querySelector('.nav-links').style.display = 'none';
            }
        }
    });
});

// Mobile menu toggle
document.querySelector('.menu-toggle').addEventListener('click', () => {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
    } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'white';
        navLinks.style.padding = '20px';
        navLinks.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
    }
});

// Search functionality
document.querySelector('.search-btn').addEventListener('click', () => {
    const searchTerm = document.querySelector('.search-box input').value;
    if (searchTerm) {
        showNotification(`Searching for: ${searchTerm}`);
    }
});

// Close cart when clicking outside
document.addEventListener('click', (e) => {
    if (!cartSidebar.contains(e.target) && 
        !e.target.closest('.cart-btn') && 
        cartSidebar.classList.contains('active')) {
        cartSidebar.classList.remove('active');
    }
    
    // Close modals when clicking outside
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
    if (e.target === registerModal) {
        registerModal.style.display = 'none';
    }
});

// Check login status on page load
window.addEventListener('load', function() {
    updateNavButtons();
});