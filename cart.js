document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const cartItemsContainer = document.querySelector('.cart-items');
    const emptyCartMessage = document.querySelector('.empty-cart');
    const cartItems = document.querySelectorAll('.cart-item');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    // Initialize cart from localStorage or create empty array
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update cart display based on stored data
    function updateCartDisplay() {
      if (cart.length === 0) {
        // Show empty cart message
        emptyCartMessage.hidden = false;
        cartItemsContainer.querySelectorAll('.cart-item').forEach(item => {
          item.style.display = 'none';
        });
        checkoutBtn.disabled = true;
        checkoutBtn.classList.add('disabled');
        return;
      }
      
      // Hide empty cart message
      emptyCartMessage.hidden = true;
      
      // Update each item in the cart
      cart.forEach(item => {
        const cartItemElement = document.querySelector(`.cart-item[data-id="${item.id}"]`);
        if (cartItemElement) {
          cartItemElement.style.display = 'flex';
          cartItemElement.querySelector('.quantity').textContent = item.quantity;
          updateItemTotal(cartItemElement);
        }
      });
      
      // Update summary
      updateCartSummary();
    }
    
    // Update individual item total
    function updateItemTotal(itemElement) {
      const price = parseFloat(itemElement.dataset.price);
      const quantity = parseInt(itemElement.querySelector('.quantity').textContent);
      const total = price * quantity;
      itemElement.querySelector('.item-total').textContent = total.toLocaleString();
    }
    
    // Update cart summary totals
    function updateCartSummary() {
      let subtotal = 0;
      
      document.querySelectorAll('.cart-item').forEach(item => {
        if (item.style.display !== 'none') {
          const price = parseFloat(item.dataset.price);
          const quantity = parseInt(item.querySelector('.quantity').textContent);
          subtotal += price * quantity;
        }
      });
      
      // Calculate other values (these could be made dynamic)
      const shipping = subtotal > 10000 ? 0 : 250; // Free shipping over $10,000
      const tax = subtotal * 0.08; // 8% tax
      const insurance = subtotal > 5000 ? 150 : 50; // Higher insurance for expensive items
      
      // Update DOM
      document.getElementById('subtotal').textContent = subtotal.toLocaleString();
      document.getElementById('shipping').textContent = shipping.toLocaleString();
      document.getElementById('tax').textContent = tax.toLocaleString();
      document.getElementById('insurance').textContent = insurance.toLocaleString();
      
      const total = subtotal + shipping + tax + insurance;
      document.getElementById('total').textContent = total.toLocaleString();
      
      // Enable/disable checkout button
      checkoutBtn.disabled = subtotal <= 0;
      checkoutBtn.classList.toggle('disabled', subtotal <= 0);
    }
    
    // Event delegation for quantity buttons
    cartItemsContainer.addEventListener('click', function(e) {
      const itemElement = e.target.closest('.cart-item');
      if (!itemElement) return;
      
      const itemId = itemElement.dataset.id;
      const quantityElement = itemElement.querySelector('.quantity');
      let quantity = parseInt(quantityElement.textContent);
      
      if (e.target.classList.contains('quantity-increase')) {
        quantity++;
        quantityElement.textContent = quantity;
        updateCartItem(itemId, quantity);
      } else if (e.target.classList.contains('quantity-decrease')) {
        if (quantity > 1) {
          quantity--;
          quantityElement.textContent = quantity;
          updateCartItem(itemId, quantity);
        }
      } else if (e.target.classList.contains('remove-item')) {
        removeCartItem(itemId, itemElement);
      }
      
      updateItemTotal(itemElement);
      updateCartSummary();
    });
    
    // Update cart item in the array
    function updateCartItem(itemId, quantity) {
      const itemIndex = cart.findIndex(item => item.id === itemId);
      if (itemIndex !== -1) {
        cart[itemIndex].quantity = quantity;
        saveCart();
      }
    }
    
    // Remove item from cart
    function removeCartItem(itemId, itemElement) {
      cart = cart.filter(item => item.id !== itemId);
      saveCart();
      itemElement.style.display = 'none';
      updateCartDisplay();
    }
    
    // Save cart to localStorage
    function saveCart() {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // Initialize cart
    function initializeCart() {
      // If localStorage has items but DOM doesn't show them (page refresh)
      if (cart.length > 0 && document.querySelectorAll('.cart-item[style*="display: none"]').length === cart.length) {
        cart.forEach(item => {
          const itemElement = document.querySelector(`.cart-item[data-id="${item.id}"]`);
          if (itemElement) {
            itemElement.style.display = 'flex';
            itemElement.querySelector('.quantity').textContent = item.quantity;
            updateItemTotal(itemElement);
          }
        });
        emptyCartMessage.hidden = true;
      }
      
      updateCartSummary();
    }
    
    // Run initialization
    initializeCart();
  });