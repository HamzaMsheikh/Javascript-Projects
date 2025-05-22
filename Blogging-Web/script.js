// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
// import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
// import { getFirestore, collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// const firebaseConfig = {
//     apiKey: "AIzaSyCWZbSrCiUkv79a34xlk52ZLUJjxtzSzL8",
//     authDomain: "paperface-eab52.firebaseapp.com",
//     projectId: "paperface-eab52",
//     storageBucket: "paperface-eab52.firebasestorage.app",
//     messagingSenderId: "875161798862",
//     appId: "1:875161798862:web:2981b408ced69263c8689f"
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// // Cache for blog data
// let blogCache = null;

// document.addEventListener("DOMContentLoaded", () => {
//     // Set current year in footer
//     document.getElementById('current-year').textContent = new Date().getFullYear();

//     // Hero section, blog card, and footer animations
//     const heroSections = document.querySelectorAll('.animate-slide-up');
//     const heroObserver = new IntersectionObserver((entries) => {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 entry.target.classList.add('visible');
//             } else {
//                 entry.target.classList.remove('visible');
//             }
//         });
//     }, { threshold: 0.1 });
//     heroSections.forEach(section => heroObserver.observe(section));

//     const blogObserver = new IntersectionObserver((entries) => {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 entry.target.classList.add('visible');
//             }
//         });
//     }, { threshold: 0.1 });
//     const observeBlogCards = () => {
//         const blogCards = document.querySelectorAll('.animate-blog-card');
//         blogCards.forEach(card => blogObserver.observe(card));
//     };
//     const blogFeed = document.getElementById('featured-blogs-container');
//     const mutationObserver = new MutationObserver(observeBlogCards);
//     mutationObserver.observe(blogFeed, { childList: true });

//     const footer = document.querySelector('.animate-footer');
//     const footerObserver = new IntersectionObserver((entries) => {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 entry.target.classList.add('visible');
//             }
//         });
//     }, { threshold: 0.1 });
//     footerObserver.observe(footer);

//     // Existing script.js logic
//     const featuredBlogsContainer = document.getElementById("featured-blogs-container");
//     const loginNavItem = document.getElementById('loginNavItem');
//     const logoutNavItem = document.getElementById('logoutNavItem');
//     const logoutButton = document.getElementById('logoutButton');
//     const exploreBlogsBtn = document.getElementById('exploreBlogsBtn');
//     const createBlogsBtn = document.getElementById('createBlogsBtn');
//     const joinNowBtn = document.getElementById('joinNowBtn');

//     // Check auth state
//     onAuthStateChanged(auth, async (user) => {
//         if (user) {
//             // User is logged in
//             loginNavItem.classList.add('hidden');
//             logoutNavItem.classList.remove('hidden');
//             exploreBlogsBtn.classList.add('hidden');
//             createBlogsBtn.classList.remove('hidden');
//             joinNowBtn.classList.add('hidden');
//         } else {
//             // User is logged out
//             loginNavItem.classList.remove('hidden');
//             logoutNavItem.classList.add('hidden');
//             exploreBlogsBtn.classList.remove('hidden');
//             createBlogsBtn.classList.add('hidden');
//             joinNowBtn.classList.remove('hidden');
//         }
//     });

//     // Handle logout
//     logoutButton?.addEventListener('click', (e) => {
//         e.preventDefault();
//         signOut(auth).then(() => {
//             window.location.href = "./Login-page/login.html";
//         }).catch((error) => {
//             console.error("Logout error:", error);
//             alert("Failed to log out. Please try again.");
//         });
//     });

//     // Load featured blogs
//     loadFeaturedBlogs();

//     async function loadFeaturedBlogs() {
//         try {
//             if (!featuredBlogsContainer) {
//                 console.error("Featured blogs container not found");
//                 return;
//             }

//             featuredBlogsContainer.innerHTML = "<div class='animate-spin-loader'></div>";

//             // Check cache first
//             if (blogCache) {
//                 renderBlogs(blogCache);
//                 return;
//             }

//             const blogsRef = collection(db, 'blogs');
//             const blogsQuery = query(blogsRef, orderBy('likes', 'desc'), limit(4));
//             const querySnapshot = await getDocs(blogsQuery);

//             if (querySnapshot.empty) {
//                 featuredBlogsContainer.innerHTML = "<p class='text-center text-gray-500'>No blogs found</p>";
//                 return;
//             }

//             const blogs = [];
//             querySnapshot.forEach((doc) => {
//                 blogs.push({ id: doc.id, ...doc.data() });
//             });

//             // Cache the results
//             blogCache = blogs;

//             renderBlogs(blogs);
//         } catch (error) {
//             console.error("Error loading featured blogs:", error);
//             featuredBlogsContainer.innerHTML = "<p class='text-center text-red-500'>Error loading blogs. Please try again later.</p>";
//         }
//     }

//     function renderBlogs(blogs) {
//         featuredBlogsContainer.innerHTML = "";

//         blogs.forEach((blog) => {
//             const blogId = blog.id;
//             const blogCard = document.createElement('div');
//             blogCard.className = 'animate-blog-card bg-white p-4 rounded-lg shadow-md hover:scale-105 hover:shadow-xl transition-transform flex-none w-[300px] min-w-[300px]';

//             const imageUrl = blog.image || "https://via.placeholder.com/300x200?text=No+Image";

//             blogCard.innerHTML = `
//                 <img src="${imageUrl}" alt="${blog.title}" class="w-full h-48 rounded-lg object-cover" loading="lazy">
//                 <h3 class="text-lg font-semibold mt-2 text-gray-800">${blog.title}</h3>
//                 <p class="text-base text-gray-600 mt-1">${blog.content.substring(0, 80)}${blog.content.length > 80 ? '...' : ''}</p>
//                 <div class="flex justify-between items-center mt-2">
//                     <span class="text-sm text-gray-500">👍 ${blog.likes || 0}</span>
//                     <span class="text-sm text-gray-500">❤️ ${blog.favorites || 0}</span>
//                 </div>
//                 <a href="./BlogPage/blog-detail.html?id=${blogId}" class="text-yellow-500 font-bold mt-2 block text-sm hover:text-yellow-600">Read More</a>
//             `;

//             blogCard.addEventListener('click', () => {
//                 window.location.href = `./BlogPage/blog-detail.html?id=${blogId}`;
//             });

//             featuredBlogsContainer.appendChild(blogCard);
//         });
//     }
// });


import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore, collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

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

// Cache for blog data
let blogCache = null;

document.addEventListener("DOMContentLoaded", () => {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Hero section, blog card, and footer animations
    const heroSections = document.querySelectorAll('.animate-slide-up');
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, { threshold: 0.1 });
    heroSections.forEach(section => heroObserver.observe(section));

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
    const blogFeed = document.getElementById('featured-blogs-container');
    const mutationObserver = new MutationObserver(observeBlogCards);
    mutationObserver.observe(blogFeed, { childList: true });

    const footer = document.querySelector('.animate-footer');
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    footerObserver.observe(footer);

    // Existing script.js logic
    const featuredBlogsContainer = document.getElementById("featured-blogs-container");
    const loginNavItem = document.getElementById('loginNavItem');
    const logoutNavItem = document.getElementById('logoutNavItem');
    const logoutButton = document.getElementById('logoutButton');
    const exploreBlogsBtn = document.getElementById('exploreBlogsBtn');
    const createBlogsBtn = document.getElementById('createBlogsBtn');
    const joinNowBtn = document.getElementById('joinNowBtn');

    // Check auth state
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // User is logged in
            loginNavItem.classList.add('hidden');
            logoutNavItem.classList.remove('hidden');
            exploreBlogsBtn.classList.add('hidden');
            createBlogsBtn.classList.remove('hidden');
            joinNowBtn.classList.add('hidden');
        } else {
            // User is logged out
            loginNavItem.classList.remove('hidden');
            logoutNavItem.classList.add('hidden');
            exploreBlogsBtn.classList.remove('hidden');
            createBlogsBtn.classList.add('hidden');
            joinNowBtn.classList.remove('hidden');
        }
    });

    // Handle logout
    logoutButton?.addEventListener('click', (e) => {
        e.preventDefault();
        signOut(auth).then(() => {
            window.location.href = "./Login-page/login.html";
        }).catch((error) => {
            console.error("Logout error:", error);
            alert("Failed to log out. Please try again.");
        });
    });

    // Load featured blogs
    loadFeaturedBlogs();

    async function loadFeaturedBlogs() {
        try {
            if (!featuredBlogsContainer) {
                console.error("Featured blogs container not found");
                return;
            }

            featuredBlogsContainer.innerHTML = "<div class='animate-spin-loader'></div>";

            // Check cache first
            if (blogCache) {
                renderBlogs(blogCache);
                return;
            }

            const blogsRef = collection(db, 'blogs');
            const blogsQuery = query(blogsRef, orderBy('likes', 'desc'), limit(4));
            const querySnapshot = await getDocs(blogsQuery);

            if (querySnapshot.empty) {
                featuredBlogsContainer.innerHTML = "<p class='text-center text-gray-500'>No blogs found</p>";
                return;
            }

            const blogs = [];
            querySnapshot.forEach((doc) => {
                blogs.push({ id: doc.id, ...doc.data() });
            });

            // Cache the results
            blogCache = blogs;

            renderBlogs(blogs);
        } catch (error) {
            console.error("Error loading featured blogs:", error);
            featuredBlogsContainer.innerHTML = "<p class='text-center text-red-500'>Error loading blogs. Please try again later.</p>";
        }
    }

    function renderBlogs(blogs) {
        featuredBlogsContainer.innerHTML = "";

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
                <a href="./BlogPage/blog-detail.html?id=${blogId}" class="text-yellow-500 font-bold mt-2 block text-sm hover:text-yellow-600">Read More</a>
            `;

            blogCard.addEventListener('click', () => {
                window.location.href = `./BlogPage/blog-detail.html?id=${blogId}`;
            });

            featuredBlogsContainer.appendChild(blogCard);
        });
    }

    // Navbar toggle logic
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
        });
    }

    // Sync mobile menu Login/Logout with desktop
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
    });