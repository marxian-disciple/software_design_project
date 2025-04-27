let cart = JSON.parse(localStorage.getItem('cart')) || [];

const cartItemsContainer = document.getElementById('cart-items');
const cartTotalContainer = document.getElementById('cart-total');

// Function to remove item
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

// Function to render the cart
function renderCart() {
  cartItemsContainer.innerHTML = ''; // Clear first
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    cartTotalContainer.innerText = '0.00';
    return;
  }

  cart.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.classList.add('cart-item');

    itemElement.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-details">
        <h3>${item.name}</h3>
        <p>Price: $${item.price.toFixed(2)}</p>
        <p>Quantity: ${item.quantity}</p>
        <button class="remove-button" data-id="${item.id}">Remove</button>
      </div>
    `;

    cartItemsContainer.appendChild(itemElement);

    total += item.price * item.quantity;
  });

  cartTotalContainer.innerText = total.toFixed(2);

  // Set up remove button listeners
  const removeButtons = document.querySelectorAll('.remove-button');
  removeButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const productId = event.target.getAttribute('data-id');
      removeFromCart(productId);
    });
  });
}

// Call it immediately
renderCart();
