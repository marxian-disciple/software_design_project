import { auth, db, storage } from '../lib/firebaseConfig.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const seller_applications = document.querySelector(".seller_applications");
const active_sellers = document.querySelector(".active_sellers");
const product_requests = document.querySelector(".product_requests");

const seller_applications_content = document.querySelector('.seller_applications');
const active_sellers_content = document.querySelector('.active_sellers');
const product_requests_content = document.querySelector('.product_requests');

async function fetchAndDisplayApplications() {
    try {
        const sel_apps = await getDocs(collection(db, 'applications'));

        sel_apps.forEach(doc => {
            const application = doc.data();
            application.id = doc.id; // Add the document ID if you need it

            const card = document.createElement('section');
            card.classList.add('application');

            const createdAtDate = application.createdAt.toDate(); // Convert Firestore Timestamp to JS Date
            const formattedDate = createdAtDate.toLocaleString();

            card.innerHTML = `
                <p class="business-name">Business Name: ${application.businessName}</p>
                <p class="created-at">Created At: ${formattedDate}</p>
                <p class="email">Email: ${application.email}</p>
                <p class="reg-number">Registration Number: ${application.registrationNumber}</p>
                <p class="name">Full Name of Seller: ${application.fullName}</p>
                <p class="phone">Phone number of Seller: ${application.phone}</p>
                <p class="user-id">Seller's UserID${application.userId}</p>
                <p class="vat-number">Seller's VAT Number: ${application.vatNumber}</p>
                <p class="website">Business Website: ${application.website}</p>
                <button class="approve-seller">Approve Seller</button>
                <br><br>
            `;

            seller_applications.appendChild(card);
        });
    } catch (err) {
        console.error("Error fetching applications:", err);
        seller_applications_content.innerHTML = '<p>Failed to load applications.</p>';
    }
}

async function fetchAndDisplayActiveSellers() {
    try {
        const act_sels = await getDocs(collection(db, 'sellers'));

        act_sels.forEach(doc => {
            const active = doc.data();
            active.id = doc.id; // Add the document ID if you need it

            const card = document.createElement('section');
            card.classList.add('active');

            const createdAtDate = active.createdAt.toDate(); // Convert Firestore Timestamp to JS Date
            const formattedDate = createdAtDate.toLocaleString();

            card.innerHTML = `
                <p class="business-name">Business Name: ${active.businessName}</p>
                <p class="created-at">Created At: ${formattedDate}</p>
                <p class="email">Email: ${active.email}</p>
                <p class="reg-number">Registration Number: ${active.registrationNumber}</p>
                <p class="name">Full Name of Seller: ${active.fullName}</p>
                <p class="phone">Phone number of Seller: ${active.phone}</p>
                <p class="user-id">Seller's UserID${active.userId}</p>
                <p class="vat-number">Seller's VAT Number: ${active.vatNumber}</p>
                <p class="website">Business Website: ${active.website}</p>
                <br><br>
            `;

            active_sellers.appendChild(card);
        });
    } catch (err) {
        console.error("Error fetching active sellers:", err);
        active_sellers_content.innerHTML = '<p>Failed to load active sellers.</p>';
    }
}

async function fetchAndDisplayProductRequests() {
    try {
        const prod_reqs = await getDocs(collection(db, 'product_requests'));

        prod_reqs.forEach(doc => {
            const prod = doc.data();
            prod.id = doc.id; // Add the document ID if you need it

            const card = document.createElement('section');
            card.classList.add('prods');

            const createdAtDate = prod.createdAt.toDate(); // Convert Firestore Timestamp to JS Date
            const formattedDate = createdAtDate.toLocaleString();

            card.innerHTML = `
                <img src="${prod.imageUrl}" alt="${prod.name}" class="product-image">
                <p class="prod-name">Product Name: ${prod.name}</p>
                <p class="price">Product Price: ${prod.price}</p>
                <p class="category">Category of Product: ${prod.category}</p>
                <p class="quantity">Quantity of Product: ${prod.quantity}</p>
                <p class="weight">Weight of Product: ${prod.weight}</p>
                <p class="description">Product Description: ${prod.description}</p>
                <p class="user-id">Seller's UserID: ${prod.userId}</p>
                <p class="created-at">Request Submitted at: ${formattedDate}</p>
                <button class="approve-product">Approve Product</button>
                <br><br>
            `;

            product_requests.appendChild(card);
        });
    } catch (err) {
        console.error("Error fetching product requests:", err);
        product_requests_content.innerHTML = '<p>Failed to load product requests.</p>';
    }
}
fetchAndDisplayApplications();
fetchAndDisplayActiveSellers();
fetchAndDisplayProductRequests();

function approveSeller() {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
        alert('User not logged in!');
        } 
        const approveSellerButton = document.querySelector('.approve-seller');
        
        // Add the event listener to the button
        approveSellerButton.addEventListener('click', async (e) => {

            const businessName = document.querySelector('.business-name').value;
            const registrationNumber = document.querySelector('.reg-number').value;
            const vatNumber = document.getElementById('vat-number').value;
            const  name = document.getElementById('name').value;
            const  email = document.getElementById('email').value;
            const  phone = document.getElementById('phone').value;
            const  website = document.getElementById('website').value;
            const userId = document.querySelector(".user-id");
            const createdAt = document.querySelector(".created-at");

            try {
            await addDoc(collection(db, 'sellers'), {
                userId,
                name,
                businessName,
                registrationNumber,
                vatNumber,
                email,
                phone,
                website,
                createdAt,
            });

            alert('Seller has been approved successfully.');
            } catch (err) {
            console.error(`Error approving seller: ${err}`);
            }
        });
    })
};

// Initialize the form when the document is ready
document.addEventListener('DOMContentLoaded', approveSeller);

function approveProduct() {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            alert('User not logged in!');
            } 
        const approveProductButton = document.querySelector('.approve-product');
        
        // Add the event listener to the button
        approveProductButton.addEventListener('click', async (e) => {
            e.preventDefault();

            const name = document.getElementById('product_name').value;
            const price = document.getElementById('price').value;
            const weight = document.getElementById('weight').value;
            const quantity = document.getElementById('quantity').value;
            const  category = document.getElementById('categories').value;
            const description = document.getElementById('description').value;
            const image = document.getElementById('image').files[0];
            const userId = document.querySelector(".user-id");
            const createdAt = document.querySelector(".created-at");

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
                userId,
                name,
                price,
                weight,
                quantity,
                category,
                description,
                imageUrl,
                createdAt,
            });

            alert('Product successfully approved.');
            } catch (err) {
            console.error(`Error approving product: ${err}`);
            }
        });
    })
};

// Initialize the form when the document is ready
document.addEventListener('DOMContentLoaded', approveProduct);

document.getElementById("closeBtn").addEventListener("click", () => {
    window.location.href = "./../index.html"; 
  });