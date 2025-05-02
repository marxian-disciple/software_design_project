import { db, auth, storage } from '../lib/firebaseConfig.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

let formInitialized = false;

onAuthStateChanged(auth, (user) => {
    if (!user) {
        alert('User not logged in!');
    }
    else if (user && !formInitialized) {
        formInitialized = true;
        const form = document.querySelector('.add-product');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('product_name').value;
            const price = document.getElementById('price').value;
            const weight = document.getElementById('weight').value;
            const quantity = document.getElementById('quantity').value;
            const description = document.getElementById('description').value;
            const image = document.getElementById('image').files[0];

            try {
                const storageRef = ref(storage, `product-images/${Date.now()}-${image.name}`);
                await uploadBytes(storageRef, image);
                const imageUrl = await getDownloadURL(storageRef);

                await addDoc(collection(db, 'products'), {
                    userId: user.uid,
                    name,
                    price,
                    weight,
                    quantity,
                    description,
                    imageUrl,
                    createdAt: new Date()
                });

                alert('Product added successfully!');
                form.reset();
            } catch (err) {
                console.error(`Error adding product to database: ${err}`);
            }
        });
    }
});
