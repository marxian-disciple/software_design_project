import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyClkdKaYMnvNRPWbHLviEv_2Rzo5MLV5Uc",
  authDomain: "software-design-project-574a6.firebaseapp.com",
  projectId: "software-design-project-574a6",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const cartItemsContainer = document.getElementById('cart-items');
const cartTotalContainer = document.getElementById('cart-total');

function renderCart(cart) {
  cartItemsContainer.innerHTML = '';
  let total = 0;

  if (!cart || cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    cartTotalContainer.innerText = '0.00';
    return;
  }

  cart.forEach(item => {
    const itemSection = document.createElement('section');
    itemSection.className = 'cart-item';

    const itemPrice = parseFloat(item.price);
    const itemTotal = itemPrice * item.quantity;

    itemSection.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <section class="cart-item-details">
        <h3>${item.name}</h3>
        <p>Price: $${itemPrice.toFixed(2)}</p>
        <p>
          Quantity: 
          <button class="decrement-button" data-id="${item.productId}">➖</button>
          <span class="quantity-display">${item.quantity}</span>
          <button class="increment-button" data-id="${item.productId}">➕</button>
        </p>
        <button class="remove-button" data-id="${item.productId}">Remove</button>
      </section>
    `;

    cartItemsContainer.appendChild(itemSection);
    total += itemTotal;
  });

  cartTotalContainer.innerText = total.toFixed(2);

  // Attach event listeners
  attachEventListeners(cart);
}

function attachEventListeners(cart) {
  const removeButtons = document.querySelectorAll('.remove-button');
  const incrementButtons = document.querySelectorAll('.increment-button');
  const decrementButtons = document.querySelectorAll('.decrement-button');

  removeButtons.forEach(button => {
    button.addEventListener('click', async (event) => {
      const productId = event.target.getAttribute('data-id');
      const updatedCart = cart.filter(item => item.productId !== productId);
      await updateCartInDB(updatedCart);
      renderCart(updatedCart);
    });
  });

  incrementButtons.forEach(button => {
    button.addEventListener('click', async (event) => {
      const productId = event.target.getAttribute('data-id');
      const updatedCart = cart.map(item => {
        if (item.productId === productId) {
          item.quantity += 1;
        }
        return item;
      });
      await updateCartInDB(updatedCart);
      renderCart(updatedCart);
    });
  });

  decrementButtons.forEach(button => {
    button.addEventListener('click', async (event) => {
      const productId = event.target.getAttribute('data-id');
      let updatedCart = cart.map(item => {
        if (item.productId === productId && item.quantity > 1) {
          item.quantity -= 1;
        }
        return item;
      });

      updatedCart = updatedCart.filter(item => item.quantity > 0);
      await updateCartInDB(updatedCart);
      renderCart(updatedCart);
    });
  });
}

async function updateCartInDB(updatedCart) {
  const user = auth.currentUser;
  if (user) {
    const cartRef = doc(db, 'carts', user.uid);
    await setDoc(cartRef, { items: updatedCart });
  }
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const cartRef = doc(db, 'carts', user.uid);
    const cartSnap = await getDoc(cartRef);
    if (cartSnap.exists()) {
      const cartData = cartSnap.data();
      renderCart(cartData.items || []);
    } else {
      renderCart([]);
    }
  } else {
    cartItemsContainer.innerHTML = '<p>Please log in to view your cart.</p>';
    cartTotalContainer.innerText = '0.00';
  }
});
