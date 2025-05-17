// Import from Firebase NPM packages (not from URLs)
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db, storage } from "../lib/firebaseConfig.js";

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
        const  category = document.getElementById('categories').value;
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
          await addDoc(collection(db, 'product_requests'), {
            userId: user.uid,
            name,
            price,
            weight,
            quantity,
            category,
            description,
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

document.getElementById("closeBtn").addEventListener("click", () => {
    window.location.href = "seller_dashboard.html"; 
  });