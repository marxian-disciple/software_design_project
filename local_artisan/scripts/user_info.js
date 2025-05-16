import { auth, db } from "../lib/firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const body = document.querySelector("body");

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        body.innerHTML = "<p>You must be logged in to view this page.</p>";
        return;
    }

    try {
        const sellersSnapshot = await getDocs(collection(db, "admin")); // or 'sellers' if that's your main seller DB
        let foundSeller = false;

        sellersSnapshot.forEach(doc => {
            const userData = doc.data();
            if (userData.userId === user.uid) {
                const profileHTML = `
                    <section class="info">
                    <section style="display: block; text-align: center; width: 100%;">
                        <img style="padding-top: 40px;" src="https://raw.githubusercontent.com/marxian-disciple/software_design_project/refs/heads/main/local_artisan/images/logo.png" alt="Artify Logo" class="logo" />
                        <br><br>
                    </section>
                        <strong style="color: #333;">My Full Name: ${userData.fullName || user.displayName || user.email}</strong>
                        <br><br>
                        <p class="business-name"><strong>My Business Name:</strong> ${userData.businessName || 'N/A'}</p>
                        <br><br>
                        <p class="created-at"><strong>Created At:</strong> ${userData.createdAt?.toDate().toLocaleString() || 'N/A'}</p>
                        <br><br>
                        <p class="email"><strong>My Email:</strong> ${userData.email || user.email}</p>
                        <br><br>
                        <p class="reg-number"><strong>My Registration Number:</strong> ${userData.registrationNumber || 'N/A'}</p>
                        <br><br>
                        <p class="phone"><strong>My Phone:</strong> ${userData.phone || 'N/A'}</p>
                        <br><br>
                        <p class="user-id"><strong>My UserID:</strong> ${userData.userId}</p>
                        <br><br>
                        <p class="vat-number"><strong>My VAT Number:</strong> ${userData.vatNumber || 'N/A'}</p>
                        <br><br>
                        <p class="website"><strong>My Business Website:</strong> ${userData.website || 'N/A'}</p>
                    </section>
                `;
                body.appendChild(document.createRange().createContextualFragment(profileHTML));
                foundSeller = true;
            }
        });

        if (!foundSeller) {
            const fallbackHTML = `
                <section class="info">
                    <strong style="color: #333;">User Name: ${user.displayName || 'No display name'}</strong>
                    <p><strong>Email:</strong> ${user.email}</p>
                </section>
            `;
            body.appendChild(document.createRange().createContextualFragment(fallbackHTML));
        }

    } catch (err) {
        console.error("Error fetching user profile:", err);
        body.innerHTML = "<p>Failed to load user profile.</p>";
    }
});

document.getElementById("closeBtn")?.addEventListener("click", () => {
    window.location.href = "./../index.html";
});