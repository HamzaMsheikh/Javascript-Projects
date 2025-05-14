import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

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

// Store admin email
const ADMIN_EMAIL = "admin@peperface.com";

const dashboardSection = document.getElementById("dashboard-section");
const postsList = document.getElementById("posts-list");
const logoutButton = document.getElementById("logout-button");

// Check if user is admin
onAuthStateChanged(auth, async (user) => {
    if (user && user.email === ADMIN_EMAIL) {
        dashboardSection.classList.remove("hidden");
        loadPosts();
    } else {
        alert("You are not authorized to access the admin portal.");
        window.location.href = "../index.html";
    }
});

// Handle logout
logoutButton.addEventListener("click", async () => {
    try {
        await signOut(auth);
        window.location.href = "../Login-page/login.html";
    } catch (error) {
        alert("Error logging out: " + error.message);
    }
});

// Load all posts
async function loadPosts() {
    postsList.innerHTML = "<p>Loading posts...</p>";

    try {
        const snapshot = await getDocs(collection(db, "blogs"));
        if (snapshot.empty) {
            postsList.innerHTML = "<p>No posts found.</p>";
            return;
        }

        postsList.innerHTML = "<h2 class='text-2xl font-bold mb-4'>All Posts</h2>";
        snapshot.forEach(doc => {
            const post = doc.data();
            const postDiv = document.createElement("div");
            postDiv.className = "flex justify-between items-center p-2 border-b";
            postDiv.innerHTML = `
                <div>
                    <h3 class="text-lg font-semibold">${post.title}</h3>
                    <p class="text-gray-600">${post.content.substring(0, 50)}...</p>
                </div>
                <button onclick="deletePost('${doc.id}')" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
            `;
            postsList.appendChild(postDiv);
        });
    } catch (error) {
        postsList.innerHTML = "<p>Error loading posts: " + error.message + "</p>";
    }
}

// Delete a post
window.deletePost = async (postId) => {
    if (confirm("Are you sure you want to delete this post?")) {
        try {
            await deleteDoc(doc(db, "blogs", postId));
            loadPosts();
            alert("Post deleted!");
        } catch (error) {
            alert("Error deleting post: " + error.message);
        }
    }
};