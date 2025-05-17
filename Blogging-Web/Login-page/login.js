// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
// import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// const firebaseConfig = {
//     apiKey: "AIzaSyCWZbSrCiUkv79a34xlk52ZLUJjxtzSzL8",
//     authDomain: "paperface-eab52.firebaseapp.com",
//     projectId: "paperface-eab52",
//     storageBucket: "paperface-eab52.firebasestorage.app",
//     messagingSenderId: "875161798862",
//     appId: "1:875161798862:web:2981b408ced69263c8689f"
//   };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// const loginTab = document.getElementById("loginTab");
// const signupTab = document.getElementById("signupTab");
// const loginForm = document.getElementById("loginForm");
// const signupForm = document.getElementById("signupForm");
// const adminLoginTab = document.getElementById("adminLoginTab");
// const adminLoginModal = document.getElementById("adminLoginModal");
// const adminSignInButton = document.getElementById("admin-sign-in-button");
// const cancelAdminLogin = document.getElementById("cancel-admin-login");

// // Toggle between login & signup
// loginTab.addEventListener("click", () => {
//     loginForm.classList.remove("hidden");
//     signupForm.classList.add("hidden");
//     loginTab.classList.add("bg-yellow-500", "text-white");
//     signupTab.classList.remove("bg-yellow-500", "text-white");
//     signupTab.classList.add("bg-gray-200", "text-gray-700");
// });

// signupTab.addEventListener("click", () => {
//     signupForm.classList.remove("hidden");
//     loginForm.classList.add("hidden");
//     signupTab.classList.add("bg-yellow-500", "text-white");
//     loginTab.classList.remove("bg-yellow-500", "text-white");
//     loginTab.classList.add("bg-gray-200", "text-gray-700");
// });

// // Show admin login modal
// adminLoginTab.addEventListener("click", () => {
//     adminLoginModal.classList.remove("hidden");
// });

// // Cancel admin login
// cancelAdminLogin.addEventListener("click", () => {
//     adminLoginModal.classList.add("hidden");
// });

// // Admin login
// adminSignInButton.addEventListener("click", async (event) => {
//     event.preventDefault();
//     const email = document.getElementById("admin-email").value;
//     const password = document.getElementById("admin-password").value;

//     if (email !== "admin@paperface.com") {
//         alert("This email is not registered as an admin. Please use a different email.");
//         return;
//     }

//     try {
//         const userCredential = await signInWithEmailAndPassword(auth, email, password);
//         const user = userCredential.user;

//         // Ensure admin status in Firestore
//         await setDoc(doc(db, "users", user.uid), {
//             email: email,
//             isAdmin: true,
//             createdAt: new Date()
//         }, { merge: true });

//         adminLoginModal.classList.add("hidden");
//         window.location.href = "/Admin/admin.html"; // Fixed redirect path
//     } catch (error) {
//         console.error("Admin login error:", error); // For debugging
//         if (error.code === "auth/wrong-password") {
//             alert("Incorrect password. Please try again.");
//         } else if (error.code === "auth/user-not-found") {
//             alert("No admin account found with this email. Please sign up first.");
//         } else if (error.code === "auth/invalid-email") {
//             alert("Please enter a valid email address.");
//         } else {
//             alert("Admin login failed: " + error.message);
//         }
//     }
// });

// // Regular signup
// async function signUp(event) {
//     event.preventDefault();
//     const email = document.getElementById("signup-email").value;
//     const password = document.getElementById("signup-password").value;
//     const fullName = document.getElementById("signup-name").value;

//     try {
//         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//         const user = userCredential.user;

//         await setDoc(doc(db, "users", user.uid), {
//             displayName: fullName,
//             email: email,
//             createdAt: new Date(),
//             isAdmin: email === "admin@paperface.com" ? true : false
//         });

//         window.location.href = "../index.html";
//     } catch (error) {
//         console.error("Signup error:", error); // For debugging
//         if (error.code === "auth/email-already-in-use") {
//             alert("This email is already registered. Please log in.");
//         } else if (error.code === "auth/invalid-email") {
//             alert("Please enter a valid email address.");
//         } else if (error.code === "auth/weak-password") {
//             alert("Password should be at least 6 characters long.");
//         } else {
//             alert("Signup failed: " + error.message);
//         }
//     }
// }

// // Regular login
// async function signIn(event) {
//     event.preventDefault();
//     const email = document.getElementById("signIn-email").value;
//     const password = document.getElementById("signIn-password").value;

//     try {
//         const userCredential = await signInWithEmailAndPassword(auth, email, password);
//         window.location.href = "../index.html";
//     } catch (error) {
//         console.error("Login error:", error); // For debugging
//         if (error.code === "auth/wrong-password") {
//             alert("Incorrect password. Please try again.");
//         } else if (error.code === "auth/user-not-found") {
//             alert("No account found with this email. Please sign up.");
//         } else if (error.code === "auth/invalid-email") {
//             alert("Please enter a valid email address.");
//         } else {
//             alert("Login failed: " + error.message);
//         }
//     }
// }

// document.getElementById("sign-up-button").addEventListener("click", signUp);
// document.getElementById("sign-in-button").addEventListener("click", signIn);


import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCWZbSrCiUkv79a34xlk52ZLUJjxtzSzL8",
    authDomain: "paperface-eab52.firebaseapp.com",
    projectId: "paperface-eab52",
    storageBucket: "paperface-eab52.firebasestorage.app",
    messagingSenderId: "875161798862",
    appId: "1:875161798862:web:2981b408ced69263c8689f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const adminLoginTab = document.getElementById("adminLoginTab");
const adminLoginModal = document.getElementById("adminLoginModal");
const adminSignInButton = document.getElementById("admin-sign-in-button");
const cancelAdminLogin = document.getElementById("cancel-admin-login");

// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Animations for form card, inputs, modal, and footer
document.addEventListener('DOMContentLoaded', () => {
    // Form card
    const formCard = document.querySelector('.animate-slide-up');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    if (formCard) cardObserver.observe(formCard);

    // Form inputs
    const formInputs = document.querySelectorAll('.animate-slide-up-field');
    const inputObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100); // Staggered animation
            }
        });
    }, { threshold: 0.1 });
    formInputs.forEach(input => inputObserver.observe(input));

    // Footer
    const footer = document.querySelector('.animate-footer');
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    if (footer) footerObserver.observe(footer);

    // Re-observe inputs when switching tabs
    loginTab.addEventListener('click', () => {
        formInputs.forEach(input => {
            input.classList.remove('visible');
            inputObserver.observe(input);
        });
    });
    signupTab.addEventListener('click', () => {
        formInputs.forEach(input => {
            input.classList.remove('visible');
            inputObserver.observe(input);
        });
    });
});

// Toggle between login & signup
loginTab.addEventListener("click", () => {
    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
    loginTab.classList.add("bg-yellow-500", "text-white");
    signupTab.classList.remove("bg-yellow-500", "text-white");
    signupTab.classList.add("bg-gray-200", "text-gray-700");
});

signupTab.addEventListener("click", () => {
    signupForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
    signupTab.classList.add("bg-yellow-500", "text-white");
    loginTab.classList.remove("bg-yellow-500", "text-white");
    loginTab.classList.add("bg-gray-200", "text-gray-700");
});

// Show admin login modal
adminLoginTab.addEventListener("click", () => {
    adminLoginModal.classList.remove("hidden");
    setTimeout(() => {
        adminLoginModal.querySelector('.animate-modal').classList.add('visible');
    }, 10); // Small delay to ensure transition triggers
});

// Cancel admin login
cancelAdminLogin.addEventListener("click", () => {
    adminLoginModal.querySelector('.animate-modal').classList.remove('visible');
    setTimeout(() => {
        adminLoginModal.classList.add("hidden");
    }, 300); // Match transition duration
});

// Admin login
adminSignInButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const email = document.getElementById("admin-email").value;
    const password = document.getElementById("admin-password").value;

    if (email !== "admin@paperface.com") {
        alert("This email is not registered as an admin. Please use a different email.");
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Ensure admin status in Firestore
        await setDoc(doc(db, "users", user.uid), {
            email: email,
            isAdmin: true,
            createdAt: new Date()
        }, { merge: true });

        adminLoginModal.querySelector('.animate-modal').classList.remove('visible');
        setTimeout(() => {
            adminLoginModal.classList.add("hidden");
            window.location.href = "/Admin/admin.html"; // Fixed redirect path
        }, 300);
    } catch (error) {
        console.error("Admin login error:", error);
        if (error.code === "auth/wrong-password") {
            alert("Incorrect password. Please try again.");
        } else if (error.code === "auth/user-not-found") {
            alert("No admin account found with this email. Please sign up first.");
        } else if (error.code === "auth/invalid-email") {
            alert("Please enter a valid email address.");
        } else {
            alert("Admin login failed: " + error.message);
        }
    }
});

// Regular signup
async function signUp(event) {
    event.preventDefault();
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const fullName = document.getElementById("signup-name").value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            displayName: fullName,
            email: email,
            createdAt: new Date(),
            isAdmin: email === "admin@paperface.com" ? true : false
        });

        window.location.href = "../index.html";
    } catch (error) {
        console.error("Signup error:", error);
        if (error.code === "auth/email-already-in-use") {
            alert("This email is already registered. Please log in.");
        } else if (error.code === "auth/invalid-email") {
            alert("Please enter a valid email address.");
        } else if (error.code === "auth/weak-password") {
            alert("Password should be at least 6 characters long.");
        } else {
            alert("Signup failed: " + error.message);
        }
    }
}

// Regular login
async function signIn(event) {
    event.preventDefault();
    const email = document.getElementById("signIn-email").value;
    const password = document.getElementById("signIn-password").value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "../index.html";
    } catch (error) {
        console.error("Login error:", error);
        if (error.code === "auth/wrong-password") {
            alert("Incorrect password. Please try again.");
        } else if (error.code === "auth/user-not-found") {
            alert("No account found with this email. Please sign up.");
        } else if (error.code === "auth/invalid-email") {
            alert("Please enter a valid email address.");
        } else {
            alert("Login failed: " + error.message);
        }
    }
}

document.getElementById("sign-up-button").addEventListener("click", signUp);
document.getElementById("sign-in-button").addEventListener("click", signIn);