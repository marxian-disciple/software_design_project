import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js';
import { collection, addDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { auth, db, storage } from '../lib/firebaseConfig.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

let formInitialized = false;

export function initializeForm() {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      alert('User not logged in!');
    } else if (!formInitialized) {
      formInitialized = true;
      const addButton = document.querySelector('.add-btn');
      const form = document.querySelector('.add-product');
      
      // Add the event listener to the button
      addButton.addEventListener('click', async (e) => {
        e.preventDefault();

        const name = document.getElementById('product_name').value;
        const price = document.getElementById('price').value;
        const weight = document.getElementById('weight').value;
        const quantity = document.getElementById('quantity').value;
        const description = document.getElementById('description').value;
        const image = document.getElementById('image').files[0];

        // Make sure an image is selected
        if (!image) {
          alert('Please upload an image.');
          return;
        }

        try {
          // Upload the image to Firebase Storage
          const storageRef = ref(storage, `product-images/${Date.now()}-${image.name}`);
          await uploadBytes(storageRef, image);
          const imageUrl = await getDownloadURL(storageRef);

          // Add product data to Firestore
          await addDoc(collection(db, 'products'), {
            userId: user.uid,
            name,
            price,
            weight,
            quantity,
            description,
            imageUrl,
            createdAt: new Date(),
          });

          alert('Product added successfully!');
          window.location.href = "../html/seller_dashboard.html"
        } catch (err) {
          console.error(`Error adding product to database: ${err}`);
        }
      });
    }
  });
}

// Initialize the form when the document is ready
document.addEventListener('DOMContentLoaded', initializeForm);
