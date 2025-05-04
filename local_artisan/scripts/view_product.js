import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyClkdKaYMnvNRPWbHLviEv_2Rzo5MLV5Uc",
  authDomain: "software-design-project-574a6.firebaseapp.com",
  projectId: "software-design-project-574a6",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

const showToast = (message) => {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
};

async function loadProduct() {
  if (!productId) return;

  const docRef = doc(db, "products", productId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const product = docSnap.data();

    // Populate UI
    document.getElementById('product-image').src = product.imageUrl || product.image;
    document.getElementById('product-image').alt = product.name;
    document.getElementById('product-title').textContent = product.name;
    document.getElementById('product-description').textContent = product.description;
    document.getElementById('product-price').textContent = `$${parseFloat(product.price).toFixed(2)}`;

    // Add to cart logic
    document.getElementById('add-to-cart').addEventListener('click', () => {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];

      const existingItem = cart.find(item => item.id === productId);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id: productId,
          name: product.name,
          price: product.price,
          image: product.imageUrl || product.image,
          quantity: 1
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      showToast(`${product.name} added to cart!`);
    });

  } else {
    alert("Product not found.");
  }
}

loadProduct();
