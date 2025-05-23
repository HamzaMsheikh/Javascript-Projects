import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc, setDoc, getDoc, increment } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

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

// Track page views
async function trackPageView() {
    const analyticsRef = doc(db, "analytics", "siteStats");
    const analyticsDoc = await getDoc(analyticsRef);
    if (!analyticsDoc.exists()) {
        await setDoc(analyticsRef, { pageViews: 0, uniqueVisitors: 0 });
    }
    await updateDoc(analyticsRef, { pageViews: increment(1) });
    const updatedDoc = await getDoc(analyticsRef);
    const data = updatedDoc.data();
    document.getElementById('page-views').textContent = data.pageViews || 0;
    document.getElementById('analytics-page-views').textContent = data.pageViews || 0;
    document.getElementById('analytics-unique-visitors').textContent = data.uniqueVisitors || 0;
}

document.addEventListener("DOMContentLoaded", async () => {
    const sidebar = document.getElementById('sidebar');
    const toggleSidebar = document.getElementById('toggle-sidebar');
    const closeSidebar = document.getElementById('close-sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    // Toggle sidebar on mobile with overlay
    if (toggleSidebar && sidebarOverlay) {
        toggleSidebar.addEventListener('click', () => {
            sidebar.classList.toggle('close');
            sidebarOverlay.classList.toggle('active');
        });
    }

    // Close sidebar with close button or overlay click
    if (closeSidebar && sidebarOverlay) {
        closeSidebar.addEventListener('click', () => {
            sidebar.classList.add('close');
            sidebarOverlay.classList.remove('active');
        });
        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.add('close');
            sidebarOverlay.classList.remove('active');
        });
    }

    // Logout functionality (placeholder)
    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            alert('Logged out successfully');
            window.location.href = '../Login-page/login.html';
        });
    }

    // Load dashboard stats
    async function loadDashboardStats() {
        // Total Blogs
        const blogsSnapshot = await getDocs(collection(db, "blogs"));
        const totalBlogs = blogsSnapshot.size;
        const publishedBlogs = blogsSnapshot.docs.filter(doc => doc.data().status === 'Published').length;
        const draftBlogs = totalBlogs - publishedBlogs;
        document.getElementById('total-blogs').textContent = totalBlogs;
        document.getElementById('published-blogs').textContent = publishedBlogs;
        document.getElementById('draft-blogs').textContent = draftBlogs;

        // Total Users
        const usersSnapshot = await getDocs(collection(db, "users"));
        document.getElementById('total-users').textContent = usersSnapshot.size;

        // Total Messages
        const messagesSnapshot = await getDocs(collection(db, "contactMessages"));
        document.getElementById('total-messages').textContent = messagesSnapshot.size;
    }

    // Fetch and display blogs
    async function loadBlogs(searchTerm = '') {
        const blogsTable = document.querySelector('#blogs-table-body');
        if (blogsTable) {
            const snapshot = await getDocs(collection(db, "blogs"));
            blogsTable.innerHTML = '';
            snapshot.forEach(doc => {
                const data = doc.data();
                if (searchTerm && !data.title?.toLowerCase().includes(searchTerm.toLowerCase())) return;
                const row = document.createElement('tr');
                row.classList.add('border-b');
                row.innerHTML = `
                    <td class="p-1 sm:p-2">${data.title || 'Untitled'}</td>
                    <td class="p-1 sm:p-2">${data.author || 'Unknown'}</td>
                    <td class="p-1 sm:p-2">${data.category || 'Uncategorized'}</td>
                    <td class="p-1 sm:p-2">${data.status || 'Draft'}</td>
                    <td class="p-1 sm:p-2 flex space-x-2 flex-wrap">
                        <button class="text-blue-500 hover:text-blue-700 edit-blog" data-id="${doc.id}">Edit</button>
                        <button class="text-red-500 hover:text-red-700 delete-blog" data-id="${doc.id}">Delete</button>
                    </td>
                `;
                blogsTable.appendChild(row);
            });

            // Add delete functionality
            document.querySelectorAll('.delete-blog').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const id = e.target.getAttribute('data-id');
                    if (confirm('Are you sure you want to delete this blog?')) {
                        await deleteDoc(doc(db, "blogs", id));
                        loadBlogs(searchTerm);
                        loadDashboardStats();
                    }
                });
            });
        }
    }

    // Fetch and display users
    async function loadUsers(searchTerm = '') {
        const usersTable = document.querySelector('#users-table-body');
        if (usersTable) {
            const snapshot = await getDocs(collection(db, "users"));
            const users = [];
            snapshot.forEach(doc => {
                users.push({ id: doc.id, ...doc.data() });
            });

            // Find most active user
            let mostActiveUser = { name: 'None', postCount: 0 };
            const blogsSnapshot = await getDocs(collection(db, "blogs"));
            const postCounts = {};
            blogsSnapshot.forEach(doc => {
                const author = doc.data().author;
                postCounts[author] = (postCounts[author] || 0) + 1;
            });
            for (const user of users) {
                const postCount = postCounts[user.name] || 0;
                if (postCount > mostActiveUser.postCount) {
                    mostActiveUser = { name: user.name, postCount };
                }
            }
            document.getElementById('most-active-user').textContent = `${mostActiveUser.name} (${mostActiveUser.postCount} posts)`;

            // Display users
            usersTable.innerHTML = '';
            users.forEach(user => {
                if (searchTerm && !user.name?.toLowerCase().includes(searchTerm.toLowerCase())) return;
                const isBlocked = user.isBlocked || false;
                const postBlockUntil = user.postBlockUntil ? new Date(user.postBlockUntil) : null;
                const now = new Date();
                const canPost = !postBlockUntil || now > postBlockUntil;
                const row = document.createElement('tr');
                row.classList.add('border-b');
                row.innerHTML = `
                    <td class="p-1 sm:p-2">${user.name || 'Unknown'}</td>
                    <td class="p-1 sm:p-2">${user.email || 'No email'}</td>
                    <td class="p-1 sm:p-2">${user.role || 'User'}</td>
                    <td class="p-1 sm:p-2">${isBlocked ? 'Blocked' : 'Active'}</td>
                    <td class="p-1 sm:p-2">${canPost ? 'Allowed' : 'Blocked until ' + postBlockUntil.toLocaleString()}</td>
                    <td class="p-1 sm:p-2 flex space-x-2 flex-wrap">
                        <button class="text-blue-500 hover:text-blue-700 block-user" data-id="${user.id}" data-blocked="${isBlocked}">${isBlocked ? 'Unblock' : 'Block'}</button>
                        <button class="text-yellow-500 hover:text-yellow-700 block-post" data-id="${user.id}" data-canpost="${canPost}">${canPost ? 'Block Post (24h)' : 'Unblock Post'}</button>
                        <button class="text-red-500 hover:text-red-700 delete-user" data-id="${user.id}">Delete</button>
                    </td>
                `;
                usersTable.appendChild(row);
            });

            // Add block/unblock functionality
            document.querySelectorAll('.block-user').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const id = e.target.getAttribute('data-id');
                    const isBlocked = e.target.getAttribute('data-blocked') === 'true';
                    await updateDoc(doc(db, "users", id), { isBlocked: !isBlocked });
                    loadUsers(searchTerm);
                });
            });

            // Add block/unblock post functionality
            document.querySelectorAll('.block-post').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const id = e.target.getAttribute('data-id');
                    const canPost = e.target.getAttribute('data-canpost') === 'true';
                    if (canPost) {
                        const blockUntil = new Date();
                        blockUntil.setHours(blockUntil.getHours() + 24); // Block for 24 hours
                        await updateDoc(doc(db, "users", id), { postBlockUntil: blockUntil.toISOString() });
                    } else {
                        await updateDoc(doc(db, "users", id), { postBlockUntil: null });
                    }
                    loadUsers(searchTerm);
                });
            });

            // Add delete functionality
            document.querySelectorAll('.delete-user').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const id = e.target.getAttribute('data-id');
                    if (confirm('Are you sure you want to delete this user?')) {
                        await deleteDoc(doc(db, "users", id));
                        loadUsers(searchTerm);
                        loadDashboardStats();
                    }
                });
            });
        }
    }

    // Fetch and display contact messages
    async function loadMessages() {
        const messagesTable = document.querySelector('#messages-table-body');
        if (messagesTable) {
            const snapshot = await getDocs(collection(db, "contactMessages"));
            messagesTable.innerHTML = '';
            snapshot.forEach(doc => {
                const data = doc.data();
                const row = document.createElement('tr');
                row.classList.add('border-b');
                row.innerHTML = `
                    <td class="p-1 sm:p-2">${data.name || 'Anonymous'}</td>
                    <td class="p-1 sm:p-2">${data.email || 'No email'}</td>
                    <td class="p-1 sm:p-2">${data.message || 'No message'}</td>
                    <td class="p-1 sm:p-2">${data.timestamp?.toDate().toLocaleDateString() || 'N/A'}</td>
                    <td class="p-1 sm:p-2 flex space-x-2 flex-wrap">
                        <button class="text-blue-500 hover:text-blue-700 view-message" data-id="${doc.id}">View</button>
                        <button class="text-red-500 hover:text-red-700 delete-message" data-id="${doc.id}">Delete</button>
                    </td>
                `;
                messagesTable.appendChild(row);
            });

            // Add delete functionality
            document.querySelectorAll('.delete-message').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const id = e.target.getAttribute('data-id');
                    if (confirm('Are you sure you want to delete this message?')) {
                        await deleteDoc(doc(db, "contactMessages", id));
                        loadMessages();
                        loadDashboardStats();
                    }
                });
            });
        }
    }

    // Search functionality for blogs
    const blogSearch = document.getElementById('blog-search');
    if (blogSearch) {
        blogSearch.addEventListener('input', (e) => {
            loadBlogs(e.target.value);
        });
    }

    // Search functionality for users
    const userSearch = document.getElementById('user-search');
    if (userSearch) {
        userSearch.addEventListener('input', (e) => {
            loadUsers(e.target.value);
        });
    }

    // Initial load
    await trackPageView();
    await loadDashboardStats();
    await loadBlogs();
    await loadUsers();
    await loadMessages();
});