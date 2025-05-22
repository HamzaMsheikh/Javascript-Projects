// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
// import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// // Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyCWZbSrCiUkv79a34xlk52ZLUJjxtzSzL8",
//     authDomain: "paperface-eab52.firebaseapp.com",
//     projectId: "paperface-eab52",
//     storageBucket: "paperface-eab52.firebasestorage.app",
//     messagingSenderId: "875161798862",
//     appId: "1:875161798862:web:2981b408ced69263c8689f"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// document.addEventListener("DOMContentLoaded", () => {
//     // Navbar toggle logic
//     const hamburger = document.getElementById('hamburger');
//     const mobileMenu = document.getElementById('mobile-menu');
//     if (hamburger && mobileMenu) {
//         hamburger.addEventListener('click', () => {
//             mobileMenu.classList.toggle('open');
//         });
//     }

//     // Sync mobile menu Login/Logout with desktop
//     const loginNavItem = document.getElementById('loginNavItem');
//     const logoutNavItem = document.getElementById('logoutNavItem');
//     const loginNavItemMobile = document.getElementById('loginNavItemMobile');
//     const logoutNavItemMobile = document.getElementById('logoutNavItemMobile');
//     const observer = new MutationObserver(() => {
//         if (loginNavItemMobile && logoutNavItemMobile) {
//             loginNavItemMobile.classList.toggle('hidden', loginNavItem.classList.contains('hidden'));
//             logoutNavItemMobile.classList.toggle('hidden', logoutNavItem.classList.contains('hidden'));
//         }
//     });
//     if (loginNavItem && logoutNavItem) {
//         observer.observe(loginNavItem, { attributes: true });
//         observer.observe(logoutNavItem, { attributes: true });
//     }

//     // Contact form submission with Firestore save
//     const submitButton = document.getElementById('submit-button');
//     const formMessage = document.getElementById('form-message');
//     if (submitButton && formMessage) {
//         submitButton.addEventListener('click', async () => {
//             const name = document.getElementById('name').value.trim();
//             const email = document.getElementById('email').value.trim();
//             const message = document.getElementById('message').value.trim();

//             if (!name || !email || !message) {
//                 formMessage.textContent = "Please fill in all fields.";
//                 formMessage.classList.remove('hidden', 'text-green-500');
//                 formMessage.classList.add('text-red-500');
//                 return;
//             }

//             try {
//                 // Save to Firestore
//                 await addDoc(collection(db, "contactMessages"), {
//                     name: name,
//                     email: email,
//                     message: message,
//                     timestamp: serverTimestamp()
//                 });

//                 // Show success message and reset form
//                 formMessage.textContent = "Thank you for your message! We'll get back to you soon.";
//                 formMessage.classList.remove('hidden', 'text-red-500');
//                 formMessage.classList.add('text-green-500');
//                 document.getElementById('contact-form').reset();
//             } catch (error) {
//                 console.error("Error saving message to Firestore:", error);
//                 formMessage.textContent = "Failed to send message. Please try again later.";
//                 formMessage.classList.remove('hidden', 'text-green-500');
//                 formMessage.classList.add('text-red-500');
//             }
//         });
//     }

//     // FAQ accordion toggle
//     const faqToggles = document.querySelectorAll('.faq-toggle');
//     faqToggles.forEach(toggle => {
//         toggle.addEventListener('click', () => {
//             const answer = toggle.nextElementSibling;
//             const isOpen = answer.classList.contains('open');
            
//             // Close all other answers
//             document.querySelectorAll('.faq-answer').forEach(item => {
//                 if (item !== answer) {
//                     item.classList.remove('open');
//                     item.previousElementSibling.querySelector('span').textContent = '▼';
//                 }
//             });

//             // Toggle current answer
//             answer.classList.toggle('open', !isOpen);
//             toggle.querySelector('span').textContent = isOpen ? '▼' : '▲';
//         });
//     });
// });


import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCWZbSrCiUkv79a34xlk52ZLUJjxtzSzL8",
    authDomain: "paperface-eab52.firebaseapp.com",
    projectId: "paperface-eab52",
    storageBucket: "paperface-eab52.firebasestorage.app",
    messagingSenderId: "875161798862",
    appId: "1:875161798862:web:2981b408ced69263c8689f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
    // Navbar toggle logic
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
        });
    }

    // Sync mobile menu Login/Logout with desktop
    const loginNavItem = document.getElementById('loginNavItem');
    const logoutNavItem = document.getElementById('logoutNavItem');
    const loginNavItemMobile = document.getElementById('loginNavItemMobile');
    const logoutNavItemMobile = document.getElementById('logoutNavItemMobile');
    const observer = new MutationObserver(() => {
        if (loginNavItemMobile && logoutNavItemMobile) {
            loginNavItemMobile.classList.toggle('hidden', loginNavItem.classList.contains('hidden'));
            logoutNavItemMobile.classList.toggle('hidden', logoutNavItem.classList.contains('hidden'));
        }
    });
    if (loginNavItem && logoutNavItem) {
        observer.observe(loginNavItem, { attributes: true });
        observer.observe(logoutNavItem, { attributes: true });
    }

    // Contact form submission with Firestore save
    const submitButton = document.getElementById('submit-button');
    const formMessage = document.getElementById('form-message');
    const contactForm = document.getElementById('contact-form');
    if (submitButton && formMessage && contactForm) {
        submitButton.addEventListener('click', async () => {
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                formMessage.textContent = "Please fill in all fields.";
                formMessage.classList.remove('hidden', 'text-green-500');
                formMessage.classList.add('text-red-500');
                return;
            }

            try {
                // Save to Firestore
                const docRef = await addDoc(collection(db, "contactMessages"), {
                    name: name,
                    email: email,
                    message: message,
                    timestamp: serverTimestamp()
                });

                // Log the document ID to confirm save
                console.log("Message saved with ID:", docRef.id);

                // Show success message and reset form since save was successful
                formMessage.textContent = "تمہارا پیغام چلا گیا ہے۔";
                formMessage.classList.remove('hidden', 'text-red-500');
                formMessage.classList.add('text-green-500');
                contactForm.reset();
            } catch (error) {
                console.error("Detailed error saving message to Firestore:", {
                    message: error.message,
                    code: error.code,
                    stack: error.stack
                });
                formMessage.textContent = "Failed to send message. Please try again later.";
                formMessage.classList.remove('hidden', 'text-green-500');
                formMessage.classList.add('text-red-500');
            }
        });
    }

    // FAQ accordion toggle
    const faqToggles = document.querySelectorAll('.faq-toggle');
    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const answer = toggle.nextElementSibling;
            const isOpen = answer.classList.contains('open');
            
            // Close all other answers
            document.querySelectorAll('.faq-answer').forEach(item => {
                if (item !== answer) {
                    item.classList.remove('open');
                    item.previousElementSibling.querySelector('span').textContent = '▼';
                }
            });

            // Toggle current answer
            answer.classList.toggle('open', !isOpen);
            toggle.querySelector('span').textContent = isOpen ? '▼' : '▲';
        });
    });
});