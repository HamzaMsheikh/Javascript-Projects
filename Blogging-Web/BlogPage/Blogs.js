import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

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
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Animations for header, blog section, filter bar, and footer
    const elementsToAnimate = document.querySelectorAll('.animate-slide-up, .animate-filter-bar');
    const elementObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    elementsToAnimate.forEach(element => elementObserver.observe(element));

    const blogObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    const observeBlogCards = () => {
        const blogCards = document.querySelectorAll('.animate-blog-card');
        blogCards.forEach(card => blogObserver.observe(card));
    };
    const blogsContainer = document.getElementById('blogs-container');
    const mutationObserver = new MutationObserver(observeBlogCards);
    mutationObserver.observe(blogsContainer, { childList: true });

    // Authentication check
    const loginNavItem = document.getElementById('loginNavItem');
    const logoutNavItem = document.getElementById('logoutNavItem');
    const logoutButton = document.getElementById('logoutButton');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            loginNavItem.classList.add('hidden');
            logoutNavItem.classList.remove('hidden');
            loadBlogs();
        } else {
            loginNavItem.classList.remove('hidden');
            logoutNavItem.classList.add('hidden');
            window.location.href = "../Login-page/login.html";
        }
    });

    logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        auth.signOut().then(() => {
            window.location.href = "../Login-page/login.html";
        }).catch((error) => {
            console.error("Logout error:", error);
            alert("Failed to log out. Please try again.");
        });
    });

    // Load blogs
    let allBlogs = []; // Cache blogs
    async function loadBlogs(filter = 'all') {
        const blogsContainer = document.getElementById('blogs-container');
        blogsContainer.innerHTML = "<div class='animate-spin-loader'></div>";

        try {
            if (allBlogs.length === 0) {
                const blogsRef = collection(db, 'blogs');
                const blogsQuery = query(blogsRef, orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(blogsQuery);

                if (querySnapshot.empty) {
                    blogsContainer.innerHTML = "<p class='text-center text-gray-500'>No blogs found</p>";
                    return;
                }

                allBlogs = [];
                querySnapshot.forEach((doc) => {
                    allBlogs.push({ id: doc.id, ...doc.data() });
                });
            }

            renderBlogs(filter === 'all' ? allBlogs : allBlogs.filter(blog => blog.postType === filter));
        } catch (error) {
            console.error("Error loading blogs:", error);
            blogsContainer.innerHTML = "<p class='text-center text-red-500'>Error loading blogs. Please try again later.</p>";
        }
    }

    function renderBlogs(blogs) {
        const blogsContainer = document.getElementById('blogs-container');
        blogsContainer.innerHTML = "";

        if (blogs.length === 0) {
            blogsContainer.innerHTML = "<p class='text-center text-gray-500'>No blogs found for this category</p>";
            return;
        }

        blogs.forEach((blog) => {
            const blogId = blog.id;
            const blogCard = document.createElement('div');
            blogCard.className = 'animate-blog-card bg-white p-4 rounded-lg shadow-md hover:scale-105 hover:shadow-xl transition-transform flex-none w-[300px] min-w-[300px]';

            const imageUrl = blog.image || "https://via.placeholder.com/300x200?text=No+Image";

            blogCard.innerHTML = `
                <img src="${imageUrl}" alt="${blog.title}" class="w-full h-48 rounded-lg object-cover" loading="lazy">
                <h3 class="text-lg font-semibold mt-2 text-gray-800">${blog.title}</h3>
                <p class="text-base text-gray-600 mt-1">${blog.content.substring(0, 80)}${blog.content.length > 80 ? '...' : ''}</p>
                <div class="flex justify-between items-center mt-2">
                    <span class="text-sm text-gray-500">👍 ${blog.likes || 0}</span>
                    <span class="text-sm text-gray-500">❤️ ${blog.favorites || 0}</span>
                </div>
                <a href="./blog-detail.html?id=${blogId}" class="text-yellow-500 font-bold mt-2 block text-sm hover:text-yellow-600">Read More</a>
            `;

            blogCard.addEventListener('click', () => {
                window.location.href = `./blog-detail.html?id=${blogId}`;
            });

            blogsContainer.appendChild(blogCard);
        });
    }

    // Filter bar functionality
    const filterButtons = document.querySelectorAll('#filter-bar button');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            filterButtons.forEach(btn => {
                btn.classList.remove('bg-yellow-500', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-700');
            });
            button.classList.add('bg-yellow-500', 'text-white');
            button.classList.remove('bg-gray-200', 'text-gray-700');
            loadBlogs(filter);
        });
    });
});