import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore, collection, getDocs, query, orderBy, limit, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

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

document.addEventListener("DOMContentLoaded", () => {
    const featuredBlogsContainer = document.getElementById("featured-blogs-container");

    // Check auth state
    onAuthStateChanged(auth, async (user) => {
        const loginNavItem = document.getElementById('loginNavItem');
        const logoutNavItem = document.getElementById('logoutNavItem');
        const logoutButton = document.getElementById('logoutButton');
        const exploreBlogsBtn = document.getElementById('exploreBlogsBtn');
        const createBlogsBtn = document.getElementById('createBlogsBtn');

        if (user) {
            // User is logged in
            loginNavItem.classList.add('hidden');
            logoutNavItem.classList.remove('hidden');
            exploreBlogsBtn.classList.add('hidden');
            createBlogsBtn.classList.remove('hidden');
            
        } else {
            // User is logged out
            loginNavItem.classList.remove('hidden');
            logoutNavItem.classList.add('hidden');
            exploreBlogsBtn.classList.remove('hidden');
            createBlogsBtn.classList.add('hidden');
        }
    });

    // Load featured blogs from Firestore
    loadFeaturedBlogs();

    // Handle logout
    document.getElementById('logoutButton')?.addEventListener('click', (e) => {
        e.preventDefault();
        signOut(auth).then(() => {
            window.location.href = "./Login-page/login.html";
        }).catch((error) => {
            console.error("Logout error:", error);
            alert("Failed to log out. Please try again.");
        });
    });

    // Function to load featured blogs
    async function loadFeaturedBlogs() {
        try {
            if (!featuredBlogsContainer) {
                console.error("Featured blogs container not found");
                return;
            }

            // Clear any existing content
            featuredBlogsContainer.innerHTML = "<p class='text-center text-gray-500'>Loading...</p>";

            // Create a query to get the top 3 most liked blogs
            const blogsRef = collection(db, 'blogs');
            const blogsQuery = query(blogsRef, orderBy('likes', 'desc'), limit(3));

            const querySnapshot = await getDocs(blogsQuery);

            // Check if we got any results
            if (querySnapshot.empty) {
                featuredBlogsContainer.innerHTML = "<p class='text-center text-gray-500'>No blogs found</p>";
                return;
            }

            // Clear loading message
            featuredBlogsContainer.innerHTML = "";

            // Loop through results and create blog cards
            querySnapshot.forEach((doc) => {
                const blog = doc.data();
                const blogId = doc.id;

                // Create blog card element
                const blogCard = document.createElement('div');
                blogCard.className = 'w-80 bg-white p-4 rounded-lg shadow-md';

                // Set image or a placeholder
                const imageUrl = blog.image || "https://via.placeholder.com/300x200?text=No+Image";

                // Add content to the card
                blogCard.innerHTML = `
                    <img src="${imageUrl}" alt="${blog.title}" class="w-full h-48 object-cover rounded-lg">
                    <h3 class="text-xl font-semibold mt-3">${blog.title}</h3>
                    <p class="text-gray-600">${blog.content.substring(0, 80)}${blog.content.length > 80 ? '...' : ''}</p>
                    <div class="flex justify-between items-center mt-2">
                        <span class="text-sm text-gray-500">👍 ${blog.likes || 0}</span>
                        <span class="text-sm text-gray-500">❤️ ${blog.favorites || 0}</span>
                    </div>
                    <a href="./BlogPage/blog-detail.html?id=${blogId}" class="text-yellow-500 font-bold mt-2 block">Read More</a>
                `;

                // Make the entire card clickable
                blogCard.addEventListener('click', () => {
                    window.location.href = `./BlogPage/blog-detail.html?id=${blogId}`;
                });

                // Add card to container
                featuredBlogsContainer.appendChild(blogCard);
            });
        } catch (error) {
            console.error("Error loading featured blogs:", error);
            featuredBlogsContainer.innerHTML = "<p class='text-center text-red-500'>Error loading blogs. Please try again later.</p>";
        }
    }
});