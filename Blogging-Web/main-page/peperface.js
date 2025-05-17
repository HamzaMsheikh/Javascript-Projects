import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove, increment } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

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
    const postButton = document.getElementById("post-blog");
    const blogFeed = document.getElementById("blog-feed");
    const imageInput = document.getElementById("blog-image");
    const imagePreview = document.getElementById("image-preview");
    const videoInput = document.getElementById("blog-video");
    const videoPreview = document.getElementById("video-preview");
    const logoutButton = document.getElementById("logoutButton");

    let currentUser = null;

    // Check auth state
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            renderBlogs();
        } else {
            window.location.href = "../Login-page/login.html";
        }
    });

    // Handle logout
    logoutButton?.addEventListener('click', (e) => {
        e.preventDefault();
        signOut(auth).then(() => {
            window.location.href = "../Login-page/login.html";
        }).catch((error) => {
            console.error("Logout error:", error);
            alert("Failed to log out. Please try again.");
        });
    });

    // Show Image Preview
    imageInput.addEventListener("change", () => {
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                imagePreview.src = reader.result;
                imagePreview.classList.remove("hidden");
            };
            reader.readAsDataURL(file);
        }
    });

    // Show Video Preview
    videoInput.addEventListener("change", () => {
        const file = videoInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                videoPreview.src = reader.result;
                videoPreview.classList.remove("hidden");
            };
            reader.readAsDataURL(file);
        }
    });

    // Post Blog
    postButton.addEventListener("click", async () => {
        const title = document.getElementById("blog-title").value.trim();
        const content = document.getElementById("blog-content").value.trim();
        const postType = document.getElementById("blog-type").value;
        const image = imagePreview.src && !imagePreview.classList.contains("hidden") ? imagePreview.src : null;
        const videoData = videoPreview.src && !videoPreview.classList.contains("hidden") ? videoPreview.src : null;

        if (title && content) {
            try {
                await addDoc(collection(db, 'blogs'), {
                    title,
                    content,
                    postType,
                    image,
                    videoData, // Note: Storing video as base64 can exceed Firestore's 1MB document limit for large files. Consider Firebase Storage for production.
                    likes: 0,
                    favorites: 0,
                    likedBy: [],
                    favoritedBy: [],
                    author: currentUser.uid,
                    createdAt: new Date()
                });

                // Clear Inputs
                document.getElementById("blog-title").value = "";
                document.getElementById("blog-content").value = "";
                document.getElementById("blog-type").value = "Technology";
                imageInput.value = "";
                imagePreview.classList.add("hidden");
                videoInput.value = "";
                videoPreview.classList.add("hidden");
            } catch (error) {
                console.error("Error adding blog: ", error);
                alert("Error posting blog. Please try again.");
            }
        } else {
            alert("Please enter both title and content");
        }
    });

    // Function to Render Blogs
    function renderBlogs() {
        const blogsRef = collection(db, 'blogs');
        
        onSnapshot(blogsRef, (querySnapshot) => {
            // Clear loader and show blogs
            blogFeed.innerHTML = "";
            
            if (querySnapshot.empty) {
                blogFeed.innerHTML = "<p class='text-center text-gray-500'>No blogs found</p>";
                return;
            }

            querySnapshot.forEach((doc) => {
                const blog = doc.data();
                const blogId = doc.id;

                // Check if current user has liked/favorited this blog
                const hasLiked = blog.likedBy && blog.likedBy.includes(currentUser.uid);
                const hasFavorited = blog.favoritedBy && blog.favoritedBy.includes(currentUser.uid);

                const blogElement = document.createElement("div");
                blogElement.classList.add("blog-card", "bg-white", "p-4", "rounded-lg", "shadow-md", "mb-4");

                // Render video if present
                const videoEmbed = blog.videoData ? `<video src="${blog.videoData}" class="blog-video mt-2 rounded-lg" controls></video>` : "";

                blogElement.innerHTML = `
                    <div onclick="openBlogDetail('${blogId}')" class="cursor-pointer">
                        <h3 class="text-lg font-bold hover:underline">${blog.title}</h3>
                        <span class="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full mt-1">${blog.postType}</span>
                        <p class="text-gray-600 mt-2">${blog.content.substring(0, 100)}${blog.content.length > 100 ? '...' : ''}</p>
                        ${blog.image ? `<img src="${blog.image}" class="blog-image mt-2 rounded-lg" loading="lazy">` : ""}
                        ${videoEmbed}
                    </div>
                    <div class="flex justify-between items-center mt-3">
                        <button onclick="event.stopPropagation(); handleLike('${blogId}', ${hasLiked})" class="${hasLiked ? 'text-blue-700' : 'text-blue-500'} hover:text-blue-600">
                            👍 ${blog.likes || 0}
                        </button>
                        <button onclick="event.stopPropagation(); handleFavorite('${blogId}', ${hasFavorited})" class="${hasFavorited ? 'text-red-700' : 'text-red-500'} hover:text-red-600">
                            ❤️ ${blog.favorites || 0}
                        </button>
                    </div>
                `;
                blogFeed.appendChild(blogElement);
            });
        });
    }

    // Handle Like
    window.handleLike = async (blogId, hasLiked) => {
        try {
            const blogRef = doc(db, 'blogs', blogId);
            
            if (hasLiked) {
                await updateDoc(blogRef, {
                    likes: increment(-1),
                    likedBy: arrayRemove(currentUser.uid)
                });
            } else {
                await updateDoc(blogRef, {
                    likes: increment(1),
                    likedBy: arrayUnion(currentUser.uid)
                });
            }
        } catch (error) {
            console.error("Error updating like: ", error);
            alert("Failed to update like. Please try again.");
        }
    };

    // Handle Favorite
    window.handleFavorite = async (blogId, hasFavorited) => {
        try {
            const blogRef = doc(db, 'blogs', blogId);
            
            if (hasFavorited) {
                await updateDoc(blogRef, {
                    favorites: increment(-1),
                    favoritedBy: arrayRemove(currentUser.uid)
                });
            } else {
                await updateDoc(blogRef, {
                    favorites: increment(1),
                    favoritedBy: arrayUnion(currentUser.uid)
                });
            }
        } catch (error) {
            console.error("Error updating favorite: ", error);
            alert("Failed to update favorite. Please try again.");
        }
    };

    // Open Blog Detail Page
    window.openBlogDetail = (blogId) => {
        window.location.href = `../BlogPage/blog-detail.html?id=${blogId}`;
    };
});