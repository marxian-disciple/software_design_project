import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js';
import { collection, addDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { auth, db, storage } from '../local_artisan/lib/firebaseConfig.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { addButton, form, name, price, weight, quantity, category, description, image, closeBtn} from './../scripts/add_product.js';
let formInitialized = false;

export function initializeForm() {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      alert('User not logged in!');
    } else if (!formInitialized) {
      formInitialized = true;
      
      
      // Add the event listener to the button
      addButton.addEventListener('click', async (e) => {
        e.preventDefault();

        const productName = name.value;
        const productPrice = price.value;
        const productWeight = weight.value;
        const productQuantity = quantity.value;
        const productCategory = category.value;
        const productDescription = description.value;
        const productImage = image.files[0];

        // Make sure an image is selected
        if (!image) {
          alert('Please upload an image.');
          return;
        }

        try {
          // Upload the image to Firebase Storage
          const storageRef = ref(storage, `product-images/${Date.now()}-${productImagemage.name}`);
          await uploadBytes(storageRef, productImagemage);
          const imageUrl = await getDownloadURL(storageRef);

          // Add product data to Firestore
          await addDoc(collection(db, 'product_requests'), {
            userId: user.uid,
            name: productName,
            price: productPrice,
            weight: productWeight,
            quantity: productQuantity,
            category: productCategory,
            description: productDescription,
            imageUrl,
            createdAt: new Date(),
          });

          alert('A request has been sent to an Admin to add your product/s to your shop! Please check your shop later.');
          window.location.href = "../html/seller_dashboard.html"
        } catch (err) {
          console.error(`Error adding product request to database: ${err}`);
        }
      });
    }
  });
}

// Initialize the form when the document is ready
document.addEventListener('DOMContentLoaded', initializeForm);

closeBtn.addEventListener("click", () => {
    window.location.href = "seller_dashboard.html"; 
  });