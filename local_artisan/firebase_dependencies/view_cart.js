import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { firebaseConfig } from './../scripts/view_cart.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const API_KEY = 'b195bd98af874739810672080225b98d';
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalContainer = document.getElementById('cart-total');

async function fetchExchangeRate() {
  try {
    const response = await fetch(`https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${API_KEY}&symbols=ZAR`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();

    if (!data.rates || !data.rates.ZAR) {
      throw new Error('ZAR rate missing from API response');
    }

    const rateZAR = parseFloat(data.rates.ZAR);
    if (isNaN(rateZAR) || rateZAR === 0) {
      throw new Error('Invalid ZAR rate');
    }

    const rateUSD = 1 / rateZAR;
    return rateUSD;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return null;
  }
}


function renderCart(cart) {
  cartItemsContainer.innerHTML = '';
  let totalZAR = 0;

  if (!cart || cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    cartTotalContainer.innerText = 'R 0.00';
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
        <p>Price: R ${itemPrice.toFixed(2)}</p>
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
    totalZAR += itemTotal;
  });

  cartTotalContainer.innerText = `R ${totalZAR.toFixed(2)}`;
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

function renderPayPalButton(totalZAR, user, items) {
  const paypalContainer = document.getElementById('paypal-button-container');
  if (!paypalContainer) return;

  paypalContainer.innerHTML = '';

  (async () => {
    let exchangeRate = null;
    try {
      exchangeRate = await fetchExchangeRate();
    } catch (err) {
      console.warn("Failed to fetch exchange rate:", err);
    }

    if (!exchangeRate) {
      // Fallback rate if API fails
      exchangeRate = 0.054; // Adjust this to a recent average if needed
      alert("Using fallback exchange rate due to network error.");
    }

    const totalUSD = totalZAR * exchangeRate;

    paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: { value: totalUSD.toFixed(2) }
          }]
        });
      },
      onApprove: async (data, actions) => {
        const details = await actions.order.capture();
        alert(`Payment successful! Transaction ID: ${details.id}`);

        const ordersBySeller = {};
        let valid = true;

        for (const item of items) {
          const productRef = doc(db, 'products', item.productId);
          const productSnap = await getDoc(productRef);

          if (!productSnap.exists()) {
            alert(`Product not found: ${item.name}`);
            valid = false;
            break;
          }

          const productData = productSnap.data();
          const currentStock = productData.quantity ?? 0;

          if (item.quantity > currentStock) {
            alert(`Not enough stock for ${item.name}. Available: ${currentStock}`);
            valid = false;
            break;
          }

          const sellerId = item.sellerId || 'unknown_seller';
          if (!ordersBySeller[sellerId]) ordersBySeller[sellerId] = [];
          ordersBySeller[sellerId].push(item);
        }

        if (!valid) return;

        const batchPromises = Object.entries(ordersBySeller).map(async ([sellerId, sellerItems]) => {
          const orderId = `${user.uid}_${sellerId}_${Date.now()}`;
          const orderRef = doc(db, 'orders', orderId);
          const sellerTotal = sellerItems.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0);

          await setDoc(orderRef, {
            buyerId: user.uid,
            buyerEmail: user.email,
            sellerId: sellerId,
            items: sellerItems,
            total: sellerTotal,
            status: 'pending',
            createdAt: new Date(),
            transactionId: details.id
          });

          await Promise.all(sellerItems.map(async item => {
            const productRef = doc(db, 'products', item.productId);
            const productSnap = await getDoc(productRef);
            if (productSnap.exists()) {
              const productData = productSnap.data();
              const currentStock = productData.quantity ?? 0;
              const newStock = Math.max(0, currentStock - item.quantity);
              await updateDoc(productRef, { quantity: newStock });
            }
          }));
        });

        await Promise.all(batchPromises);

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
  })();
}

onAuthStateChanged(auth, async user => {
  if (user) {
    const cartRef = doc(db, 'carts', user.uid);
    const cartSnap = await getDoc(cartRef);
    if (cartSnap.exists()) {
      const cart = cartSnap.data().items || [];
      renderCart(cart);

      const totalZAR = cart.reduce((sum, item) =>
        sum + parseFloat(item.price) * item.quantity, 0);

      renderPayPalButton(totalZAR, auth.currentUser, cart);
    } else {
      renderCart([]);
    }
  } else {
    cartItemsContainer.innerHTML = '<p>Please log in to view your cart.</p>';
    cartTotalContainer.innerText = 'R 0.00';
  }
});
