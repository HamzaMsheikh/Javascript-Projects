import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc, arrayUnion, arrayRemove, increment, collection, query, where, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

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
    // Elements
    const blogTitle = document.getElementById("blog-title");
    const blogContent = document.getElementById("blog-content");
    const blogImage = document.getElementById("blog-image");
    const authorName = document.getElementById("author-name");
    const postDate = document.getElementById("post-date");
    const likeButton = document.getElementById("like-button");
    const favoriteButton = document.getElementById("favorite-button");
    const likeCount = document.getElementById("like-count");
    const favoriteCount = document.getElementById("favorite-count");
    const backButton = document.getElementById("back-button");
    const blogActions = document.getElementById("blog-actions");
    
    // Add Edit and Delete buttons container if it doesn't exist
    if (!blogActions) {
        const actionsDiv = document.createElement("div");
        actionsDiv.id = "blog-actions";
        actionsDiv.className = "mt-6 flex space-x-4";
        document.getElementById("blog-detail").appendChild(actionsDiv);
    }
    
    // Edit Modal Elements
    const editModal = document.getElementById("edit-modal");
    const editTitleInput = document.getElementById("edit-title");
    const editContentInput = document.getElementById("edit-content");
    const editImageInput = document.getElementById("edit-image");
    const editImagePreview = document.getElementById("edit-image-preview");
    
    let currentUser = null;
    let blogId = null;
    let blogData = null;
    let isAuthor = false;

    // Get blog ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    blogId = urlParams.get("id");

    if (!blogId) {
        window.location.href = "../main-page/peperface.html";
        return;
    }

    // Back button functionality
    backButton.addEventListener("click", () => {
        window.location.href = "../main-page/peperface.html";
    });

    // Check auth state
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            loadBlogData();
        } else {
            window.location.href = "../Login-page/login.html";
        }
    });

    // Create edit modal if it doesn't exist
    function createEditModal() {
        if (!document.getElementById("edit-modal")) {
            const modalHTML = `
                <div id="edit-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden z-50">
                    <div class="bg-white p-6 rounded-lg w-full max-w-2xl mx-4">
                        <h2 class="text-2xl font-bold mb-4">Edit Blog</h2>
                        <input id="edit-title" type="text" placeholder="Blog Title" class="w-full p-2 border rounded mb-3">
                        <textarea id="edit-content" placeholder="Write your blog..." class="w-full p-2 border rounded mb-3 h-32"></textarea>
                        
                        <!-- Image Upload -->
                        <div class="mb-3">
                            <p class="mb-2">Current image will be kept unless you select a new one:</p>
                            <input type="file" id="edit-image" accept="image/*">
                            <img id="edit-image-preview" class="w-full max-h-60 object-cover rounded-lg mt-2 hidden">
                        </div>
                        
                        <div class="flex justify-end space-x-3">
                            <button id="cancel-edit" class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
                            <button id="save-edit" class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Save Changes</button>
                        </div>
                    </div>
                </div>
            `;
            
            const modalContainer = document.createElement("div");
            modalContainer.innerHTML = modalHTML;
            document.body.appendChild(modalContainer);
            
            // Get references to new modal elements
            const cancelEditBtn = document.getElementById("cancel-edit");
            const saveEditBtn = document.getElementById("save-edit");
            
            // Add event listeners
            cancelEditBtn.addEventListener("click", hideEditModal);
            saveEditBtn.addEventListener("click", saveBlogEdits);
            
            // Image preview for edit modal
            document.getElementById("edit-image").addEventListener("change", handleEditImagePreview);
        }
    }

    // Load blog data
    async function loadBlogData() {
        try {
            const blogRef = doc(db, 'blogs', blogId);
            const blogSnap = await getDoc(blogRef);
            
            if (blogSnap.exists()) {
                blogData = blogSnap.data();
                
                // Display blog content
                blogTitle.textContent = blogData.title;
                blogContent.textContent = blogData.content;
                
                if (blogData.image) {
                    blogImage.src = blogData.image;
                    blogImage.classList.remove("hidden");
                }
                
                // Format date
                const postDateTime = blogData.createdAt.toDate();
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                postDate.textContent = postDateTime.toLocaleDateString(undefined, options);
                
                // Like and favorite counts
                likeCount.textContent = blogData.likes || 0;
                favoriteCount.textContent = blogData.favorites || 0;
                
                // Check if user has liked/favorited
                const hasLiked = blogData.likedBy && blogData.likedBy.includes(currentUser.uid);
                const hasFavorited = blogData.favoritedBy && blogData.favoritedBy.includes(currentUser.uid);
                
                // Update buttons appearance
                if (hasLiked) {
                    likeButton.classList.add("bg-blue-300");
                }
                
                if (hasFavorited) {
                    favoriteButton.classList.add("bg-red-300");
                }
                
                // Add button event listeners
                likeButton.addEventListener("click", handleLike);
                favoriteButton.addEventListener("click", handleFavorite);
                
                // Check if current user is the author
                isAuthor = blogData.author === currentUser.uid;
                
                // Create edit modal
                createEditModal();
                
                // Show edit and delete buttons if user is author
                if (isAuthor) {
                    showAuthorControls();
                }
                
                // Get author info
                getAuthorInfo(blogData.author);
            } else {
                console.error("Blog not found!");
                blogTitle.textContent = "Blog not found!";
                blogContent.textContent = "The blog you're looking for doesn't exist or has been removed.";
            }
        } catch (error) {
            console.error("Error getting blog: ", error);
            blogTitle.textContent = "Error loading blog";
            blogContent.textContent = "There was an error loading this blog. Please try again later.";
        }
    }
    
    // Show author controls (edit & delete buttons)
    function showAuthorControls() {
        const actionsDiv = document.getElementById("blog-actions");
        actionsDiv.innerHTML = `
            <button id="edit-button" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Edit Blog
            </button>
            <button id="delete-button" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Delete Blog
            </button>
        `;
        
        // Add event listeners to new buttons
        document.getElementById("edit-button").addEventListener("click", showEditModal);
        document.getElementById("delete-button").addEventListener("click", confirmDeleteBlog);
    }
    
    // Show edit modal
    function showEditModal() {
        const modal = document.getElementById("edit-modal");
        const titleInput = document.getElementById("edit-title");
        const contentInput = document.getElementById("edit-content");
        
        // Pre-fill form with current blog data
        titleInput.value = blogData.title;
        contentInput.value = blogData.content;
        
        // Show modal
        modal.classList.remove("hidden");
    }
    
    // Hide edit modal
    function hideEditModal() {
        const modal = document.getElementById("edit-modal");
        modal.classList.add("hidden");
    }
    
    // Handle image preview in edit modal
    function handleEditImagePreview(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            const imagePreview = document.getElementById("edit-image-preview");
            
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.classList.remove("hidden");
            }
            
            reader.readAsDataURL(file);
        }
    }
    
    // Save blog edits
    async function saveBlogEdits() {
        try {
            const titleInput = document.getElementById("edit-title");
            const contentInput = document.getElementById("edit-content");
            const imageInput = document.getElementById("edit-image");
            const imagePreview = document.getElementById("edit-image-preview");
            
            const title = titleInput.value.trim();
            const content = contentInput.value.trim();
            
            if (!title || !content) {
                alert("Please fill in both title and content fields.");
                return;
            }
            
            // Prepare update data
            const updateData = {
                title,
                content,
                updatedAt: new Date()
            };
            
            // Add new image if selected
            if (imageInput.files.length > 0 && imagePreview.src) {
                updateData.image = imagePreview.src;
            }
            
            // Update blog in Firestore
            const blogRef = doc(db, 'blogs', blogId);
            await updateDoc(blogRef, updateData);
            
            // Update local data
            blogData = {...blogData, ...updateData};
            
            // Update UI
            blogTitle.textContent = title;
            blogContent.textContent = content;
            
            if (updateData.image) {
                blogImage.src = updateData.image;
                blogImage.classList.remove("hidden");
            }
            
            // Hide modal
            hideEditModal();
            
            alert("Blog updated successfully!");
        } catch (error) {
            console.error("Error updating blog: ", error);
            alert("Failed to update blog. Please try again.");
        }
    }
    
    // Confirm delete blog
    function confirmDeleteBlog() {
        const confirmDelete = confirm("Are you sure you want to delete this blog? This action cannot be undone.");
        
        if (confirmDelete) {
            deleteBlog();
        }
    }
    
    // Delete blog
    async function deleteBlog() {
        try {
            // Delete blog from Firestore
            const blogRef = doc(db, 'blogs', blogId);
            await deleteDoc(blogRef);
            
            alert("Blog deleted successfully!");
            
            // Redirect to main page
            window.location.href = "../main-page/peperface.html";
        } catch (error) {
            console.error("Error deleting blog: ", error);
            alert("Failed to delete blog. Please try again.");
        }
    }
    
    // Get author information
    async function getAuthorInfo(authorId) {
        try {
            const userRef = doc(db, 'users', authorId);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
                const userData = userSnap.data();
                authorName.textContent = userData.displayName || "Anonymous User";
            } else {
                // If user document doesn't exist, try to get display name from auth
                const usersQuery = query(collection(db, 'users'), where("uid", "==", authorId));
                const querySnapshot = await getDocs(usersQuery);
                
                if (!querySnapshot.empty) {
                    const userData = querySnapshot.docs[0].data();
                    authorName.textContent = userData.displayName || "Anonymous User";
                } else {
                    authorName.textContent = "Unknown User";
                }
            }
        } catch (error) {
            console.error("Error getting author info: ", error);
            authorName.textContent = "Unknown User";
        }
    }
    
    // Handle like button click
    async function handleLike() {
        try {
            const blogRef = doc(db, 'blogs', blogId);
            const hasLiked = blogData.likedBy && blogData.likedBy.includes(currentUser.uid);
            
            if (hasLiked) {
                // Unlike
                await updateDoc(blogRef, {
                    likes: increment(-1),
                    likedBy: arrayRemove(currentUser.uid)
                });
                
                likeButton.classList.remove("bg-blue-300");
                likeButton.classList.add("bg-blue-100");
                likeCount.textContent = parseInt(likeCount.textContent) - 1;
                
                // Update local data
                blogData.likes--;
                blogData.likedBy = blogData.likedBy.filter(uid => uid !== currentUser.uid);
            } else {
                // Like
                await updateDoc(blogRef, {
                    likes: increment(1),
                    likedBy: arrayUnion(currentUser.uid)
                });
                
                likeButton.classList.remove("bg-blue-100");
                likeButton.classList.add("bg-blue-300");
                likeCount.textContent = parseInt(likeCount.textContent) + 1;
                
                // Update local data
                blogData.likes = (blogData.likes || 0) + 1;
                blogData.likedBy = [...(blogData.likedBy || []), currentUser.uid];
            }
        } catch (error) {
            console.error("Error updating like: ", error);
            alert("Failed to update like. Please try again.");
        }
    }
    
    // Handle favorite button click
    async function handleFavorite() {
        try {
            const blogRef = doc(db, 'blogs', blogId);
            const hasFavorited = blogData.favoritedBy && blogData.favoritedBy.includes(currentUser.uid);
            
            if (hasFavorited) {
                // Unfavorite
                await updateDoc(blogRef, {
                    favorites: increment(-1),
                    favoritedBy: arrayRemove(currentUser.uid)
                });
                
                favoriteButton.classList.remove("bg-red-300");
                favoriteButton.classList.add("bg-red-100");
                favoriteCount.textContent = parseInt(favoriteCount.textContent) - 1;
                
                // Update local data
                blogData.favorites--;
                blogData.favoritedBy = blogData.favoritedBy.filter(uid => uid !== currentUser.uid);
            } else {
                // Favorite
                await updateDoc(blogRef, {
                    favorites: increment(1),
                    favoritedBy: arrayUnion(currentUser.uid)
                });
                
                favoriteButton.classList.remove("bg-red-100");
                favoriteButton.classList.add("bg-red-300");
                favoriteCount.textContent = parseInt(favoriteCount.textContent) + 1;
                
                // Update local data
                blogData.favorites = (blogData.favorites || 0) + 1;
                blogData.favoritedBy = [...(blogData.favoritedBy || []), currentUser.uid];
            }
        } catch (error) {
            console.error("Error updating favorite: ", error);
            alert("Failed to update favorite. Please try again.");
        }
    }
});