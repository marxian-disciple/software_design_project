import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js';
import { collection, addDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { auth, db, storage } from './../lib/firebaseConfig.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

import { addButton, form, name, price, weight, quantity, category, description, image, closeBtn , isNameValid, isImageValid, isPriceValid, isWeightValid, isQuantityValid, isCategoryValid } from './../scripts/add_product.js';

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

        let errors = [];

        if(!isNameValid(productName)){
          errors.push('Please enter a valid name for your product.')
        }

        if(!isPriceValid(productPrice)){
          errors.push('Please enter a valid price for your product.')
        }

        if(!isWeightValid(productWeight)){
          errors.push('Please enter a valid weight for your product.')
        }

        if(!isQuantityValid(productQuantity)){
          errors.push('Please enter a valid quantity for your product.')
        }

        if(!isCategoryValid(productCategory)){
          errors.push('Please select a category for your product.')
        }

        if(!isImageValid(productImage)){
          errors.push('Please provide a valid image for your product.')
        }

        if (errors.length > 0) {
          alert(errors.join('\n'));
          return;
        }

        try {
          // Upload the image to Firebase Storage
          const storageRef = ref(storage, `product-images/${Date.now()}-${productImage.name}`);
          await uploadBytes(storageRef, productImage);
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
