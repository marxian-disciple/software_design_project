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

  attachEventListeners(cart);
}

function attachEventListeners(cart) {
  document.querySelectorAll('.remove-button').forEach(button => {
    button.addEventListener('click', async e => {
      const productId = e.target.dataset.id;
      const updatedCart = cart.filter(item => item.productId !== productId);
      await updateCart(updatedCart);
      renderCart(updatedCart);
    });
  });

  document.querySelectorAll('.increment-button').forEach(button => {
    button.addEventListener('click', async e => {
      const productId = e.target.dataset.id;
      const updatedCart = cart.map(item => {
        if (item.productId === productId) item.quantity += 1;
        return item;
      });
      await updateCart(updatedCart);
      renderCart(updatedCart);
    });
  });

  document.querySelectorAll('.decrement-button').forEach(button => {
    button.addEventListener('click', async e => {
      const productId = e.target.dataset.id;
      let updatedCart = cart.map(item => {
        if (item.productId === productId && item.quantity > 1) item.quantity -= 1;
        return item;
      });
      updatedCart = updatedCart.filter(item => item.quantity > 0);
      await updateCart(updatedCart);
      renderCart(updatedCart);
    });
  });
}

async function updateCart(updatedCart) {
  const user = auth.currentUser;
  if (user) {
    const cartRef = doc(db, 'carts', user.uid);
    await setDoc(cartRef, { items: updatedCart });
  }
}

function handleCheckout(totalAmount, userEmail, user, items, total) {
  paypal.Buttons({
    createOrder: (data, actions) => {
      return actions.order.create({
        purchase_units: [{
          amount: { value: totalAmount.toFixed(2) }
        }]
      });
    },
    onApprove: async (data, actions) => {
      const details = await actions.order.capture();
      alert(`Payment successful! Transaction ID: ${details.id}`);

      const orderRef = doc(db, 'orders', `${user.uid}_${Date.now()}`);
      await setDoc(orderRef, {
        buyerId: user.uid,
        buyerEmail: user.email,
        items: items,
        total: total,
        status: 'pending',
        createdAt: new Date()
      });

      const cartRef = doc(db, 'carts', user.uid);
      await setDoc(cartRef, { items: [] });
      renderCart([]);
    },
    onCancel: () => {
      alert("Transaction cancelled.");
    },
    onError: err => {
      console.error("PayPal error:", err);
      alert("Payment failed.");
    }
  }).render('#paypal-button-container');
}

onAuthStateChanged(auth, async user => {
  if (user) {
    const cartRef = doc(db, 'carts', user.uid);
    const cartSnap = await getDoc(cartRef);
    if (cartSnap.exists()) {
      const cart = cartSnap.data().items || [];
      renderCart(cart);

      const total = cart.reduce((sum, item) =>
        sum + parseFloat(item.price) * item.quantity, 0);
      handleCheckout(total, user.email, user, cart, total);
    } else {
      renderCart([]);
    }
  } else {
    cartItemsContainer.innerHTML = '<p>Please log in to view your cart.</p>';
    cartTotalContainer.innerText = '0.00';
  }
});
