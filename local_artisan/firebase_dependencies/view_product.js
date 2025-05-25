import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  query,
  collection,
  where,
  getDocs
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import {
  urlParams,
  firebaseConfig,
  product_description,
  product_image,
  product_price,
  product_title,
  add_to_cart
} from './../scripts/view_product.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const productId = urlParams.get('id');

const showToast = (message) => {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
};

async function getSellerName(userId) {
  if (!userId) return "Unknown Seller";

  const sellersQuery = query(
    collection(db, "sellers"),
    where("userId", "==", userId)
  );
  const querySnapshot = await getDocs(sellersQuery);

  if (!querySnapshot.empty) {
    const sellerDoc = querySnapshot.docs[0];
    const sellerData = sellerDoc.data();
    return sellerData.businessName || "Unnamed Seller";
  }

  return "Unknown Seller";
}

async function loadProduct() {
  if (!productId) return;

  const docRef = doc(db, "products", productId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    alert("Product not found.");
    return;
  }

  const product = docSnap.data();

  const sellerName = await getSellerName(product.userId);

  product_image.src = product.imageUrl || product.image;
  product_image.alt = product.name;
  product_title.textContent = product.name;
  product_description.textContent = `Description: ${product.description}`;
  product_price.textContent = new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR'
  }).format(product.price);

  // Inject seller name into the page
  const sellerInfo = document.createElement("p");
  sellerInfo.textContent = `Sold by: ${sellerName}`;
  product_description.insertAdjacentElement("afterend", sellerInfo);

  add_to_cart.addEventListener('click', async () => {
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
}

onAuthStateChanged(auth, () => loadProduct());
