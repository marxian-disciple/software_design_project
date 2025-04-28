const { db, auth } = require('../lib/firebaseConfig');
const { addDoc, collection } = require('firebase/firestore');
const { onAuthStateChanged } = require('firebase/auth');

onAuthStateChanged(auth, (user) => {
    if (user) {
        const form = document.querySelector('.add-product'); // selects the first element with class 'add-product'
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('product-name').value;
            const price = document.getElementById('price').value;
            const weight = document.getElementById('weight').value;
            const quantity = document.getElementById('quantity').value;
            const description = document.getElementById('description').value;
            const image = document.getElementById('image').value;

            try {
                await addDoc(collection(db, 'products'), {
                    userId: user.uid,
                    name,
                    price,
                    weight,
                    quantity,
                    description,
                    image,
                    createdAt: new Date()
                });
                alert('Product added successfully!');
                form.reset();
            } catch (err) {
                console.error(`Error adding product to database: ${err}`);
            }
        });
    } else {
        alert('User not logged in!');
    }
});
