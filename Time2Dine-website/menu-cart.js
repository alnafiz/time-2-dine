// Side Panel Cart Functionality
class CartManager {
    constructor() {
        this.cart = [];
        this.init();
    }

    init() {
        this.createSidePanel();
        this.bindEvents();
        this.loadCartFromStorage();
        this.updateCartDisplay();
    }

    createSidePanel() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'panel-overlay';
        overlay.id = 'panelOverlay';
        document.body.appendChild(overlay);

        // Create side panel
        const sidePanel = document.createElement('div');
        sidePanel.className = 'side-panel';
        sidePanel.id = 'sidePanel';
        sidePanel.innerHTML = `
            <div class="side-panel-header">
                <h3>Your Order</h3>
                <button class="close-panel" id="closePanel">×</button>
            </div>
            <div class="cart-items" id="cartItems">
                <div class="empty-cart">
                    <div class="empty-cart-icon">🛒</div>
                    <p>Your cart is empty</p>
                    <p>Click on food items to add them</p>
                </div>
            </div>
            <div class="cart-total" id="cartTotal" style="display: none;">
                <div class="total-amount" id="totalAmount">Total: Tk 0</div>
                <button class="go-to-reservation-btn" id="goToReservation">Go to Reservation Page</button>
            </div>
        `;
        document.body.appendChild(sidePanel);
    }

    bindEvents() {
        // Close panel events
        document.getElementById('closePanel').addEventListener('click', () => this.closePanel());
        document.getElementById('panelOverlay').addEventListener('click', () => this.closePanel());

        // Go to reservation button
        document.getElementById('goToReservation').addEventListener('click', () => this.goToReservation());

        // Add click events to menu cards
        document.addEventListener('click', (e) => {
            const menuCard = e.target.closest('.menu-card');
            if (menuCard) {
                this.addToCart(menuCard);
            }
        });
    }

    addToCart(menuCard) {
        const menuInfo = menuCard.querySelector('.menu-info');
        const menuImg = menuCard.querySelector('.menu-img img');
        
        const name = menuInfo.querySelector('h3').textContent;
        const priceText = menuInfo.querySelector('.price').textContent;
        const price = this.extractPrice(priceText);
        const image = menuImg ? menuImg.src : '';

        // Check if item already exists in cart
        const existingItem = this.cart.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                name: name,
                price: price,
                quantity: 1,
                image: image
            });
        }

        this.saveCartToStorage();
        this.updateCartDisplay();
        this.openPanel();
    }

    removeFromCart(index) {
        this.cart.splice(index, 1);
        this.saveCartToStorage();
        this.updateCartDisplay();
    }

    updateQuantity(index, change) {
        this.cart[index].quantity += change;
        
        if (this.cart[index].quantity <= 0) {
            this.removeFromCart(index);
        } else {
            this.saveCartToStorage();
            this.updateCartDisplay();
        }
    }

    extractPrice(priceText) {
        // Extract numeric value from price text like "Tk 300" or "Tk 1,480"
        const match = priceText.match(/[\d,]+/);
        return match ? parseInt(match[0].replace(/,/g, '')) : 0;
    }

    updateCartDisplay() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        const totalAmount = document.getElementById('totalAmount');

        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">🛒</div>
                    <p>Your cart is empty</p>
                    <p>Click on food items to add them</p>
                </div>
            `;
            cartTotal.style.display = 'none';
        } else {
            cartItems.innerHTML = this.cart.map((item, index) => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">Tk ${item.price}</div>
                    </div>
                    <div class="cart-item-controls">
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="cartManager.updateQuantity(${index}, -1)">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn" onclick="cartManager.updateQuantity(${index}, 1)">+</button>
                        </div>
                        <button class="remove-btn" onclick="cartManager.removeFromCart(${index})" title="Remove">×</button>
                    </div>
                </div>
            `).join('');

            const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            totalAmount.textContent = `Total: Tk ${total.toLocaleString()}`;
            cartTotal.style.display = 'block';
        }
    }

    openPanel() {
        document.getElementById('sidePanel').classList.add('open');
        document.getElementById('panelOverlay').classList.add('show');
    }

    closePanel() {
        document.getElementById('sidePanel').classList.remove('open');
        document.getElementById('panelOverlay').classList.remove('show');
    }

    goToReservation() {
        // Store cart data in sessionStorage
        sessionStorage.setItem('cartData', JSON.stringify(this.cart));
        
        // Determine which reservation page to redirect to based on current page
        let reservationPage = '';
        const currentPage = window.location.pathname.split('/').pop();
        
        if (currentPage.includes('brew')) reservationPage = 'brew_reservation.html';
        else if (currentPage.includes('chillox')) reservationPage = 'chillox_reservation.html';
        else if (currentPage.includes('kacchi')) reservationPage = 'kacchi_reservation.html';
        else if (currentPage.includes('khanas')) reservationPage = 'khanas_reservation.html';
        else if (currentPage.includes('lueur')) reservationPage = 'lueur_reservation.html';
        else if (currentPage.includes('pizzahut')) reservationPage = 'pizzahut_reservation.html';
        else if (currentPage.includes('kudos')) reservationPage = 'kudos_reservation.html';
        else if (currentPage.includes('sultan')) reservationPage = 'sultan_reservation.html';
        else if (currentPage.includes('chinese')) reservationPage = 'chinese_reservation.html';
        else reservationPage = 'home.html'; // Fallback

        window.location.href = reservationPage;
    }

    saveCartToStorage() {
        sessionStorage.setItem('cartData', JSON.stringify(this.cart));
    }

    loadCartFromStorage() {
        const savedCart = sessionStorage.getItem('cartData');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
    }
}

// Initialize cart manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cartManager = new CartManager();
});
