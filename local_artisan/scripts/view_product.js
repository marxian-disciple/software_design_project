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

    document.getElementById('product-image').src = product.imageUrl || product.image;
    document.getElementById('product-image').alt = product.name;
    document.getElementById('product-title').textContent = product.name;
    document.getElementById('product-description').textContent = product.description;
    document.getElementById('product-price').textContent = `$${parseFloat(product.price).toFixed(2)}`;

   document.getElementById('add-to-cart').addEventListener('click', async () => {
  const user = auth.currentUser;
  if (!user) {
    alert("Please log in to add items to your cart.");
    return;
  }

  const cartRef = doc(db, "carts", user.uid);
  const cartSnap = await getDoc(cartRef);
  let items = [];

  if (cartSnap.exists()) {
    items = cartSnap.data().items || [];
  }

  const existingIndex = items.findIndex(item => item.productId === productId);

  if (existingIndex > -1) {
    items[existingIndex].quantity += 1;
  } else {
    items.push({
      productId,
      name: product.name,
      price: product.price,
      image: product.imageUrl || product.image,
      quantity: 1,
      sellerId: product.userId || "unknown"
    });
  }

  await setDoc(cartRef, { items });
  showToast(`${product.name} added to cart!`);
});

  } else {
    alert("Product not found.");
  }
}

onAuthStateChanged(auth, () => loadProduct());
