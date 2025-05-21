import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import {
  getFirestore, doc, getDoc, updateDoc, arrayUnion, arrayRemove,
  increment, collection, query, where, getDocs, deleteDoc, orderBy, limit
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import {
  getStorage, ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-storage.js";

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
const storage = getStorage(app);

document.addEventListener("DOMContentLoaded", () => {
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
  const relatedBlogsContainer = document.getElementById("related-blogs");
  const logoutButton = document.getElementById("logout-button");

  let currentUser = null;
  let blogId = new URLSearchParams(window.location.search).get("id");
  let blogData = null;
  let isAuthor = false;

  if (!blogId) {
    window.location.href = "../main-page/peperface.html";
    return;
  }

  backButton.addEventListener("click", () => {
    window.location.href = "../main-page/peperface.html";
  });

  logoutButton.addEventListener("click", () => {
    signOut(auth).then(() => {
      window.location.href = "../Login-page/login.html";
    }).catch((error) => {
      console.error("Logout failed:", error);
      alert("Failed to logout. Please try again.");
    });
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user;
      loadBlogData();
    } else {
      window.location.href = "../Login-page/login.html";
    }
  });

  function createEditModal() {
    if (!document.getElementById("edit-modal")) {
      const modalHTML = `
        <div id="edit-modal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 hidden">
          <div class="bg-white w-full max-w-md sm:max-w-xl p-4 sm:p-6 rounded-lg shadow-lg animate-fade-in">
            <h2 class="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Edit Blog</h2>
            <input id="edit-title" type="text" placeholder="Blog Title" class="w-full px-3 py-2 border border-gray-300 rounded text-sm sm:text-base mb-2 focus:ring-yellow-500 focus:border-yellow-500" />
            <select id="edit-post-type" class="w-full px-3 py-2 border border-gray-300 rounded text-sm sm:text-base mb-2 focus:ring-yellow-500 focus:border-yellow-500">
              <option value="Technology">Technology</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Health">Health</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Travel">Travel</option>
              <option value="Food">Food</option>
              <option value="Education">Education</option>
              <option value="Finance">Finance</option>
              <option value="Sports">Sports</option>
              <option value="Fashion">Fashion</option>
              <option value="Fitness">Fitness</option>
              <option value="News">News</option>
              <option value="Politics">Politics</option>
              <option value="Other">Other</option>
            </select>
            <textarea id="edit-content" placeholder="Write your blog..." class="w-full px-3 py-2 border border-gray-300 rounded text-sm sm:text-base h-32 sm:h-40 mb-2 focus:ring-yellow-500 focus:border-yellow-500"></textarea>
            <div class="mb-2">
              <label class="block text-sm sm:text-base text-gray-600 mb-1">Replace Image (optional):</label>
              <input id="edit-image" type="file" accept="image/*" class="text-sm sm:text-base" />
              <img id="edit-image-preview" class="w-full max-h-52 object-contain mt-2 rounded hidden" />
            </div>
            <div class="flex justify-end space-x-2 mt-4">
              <button id="cancel-edit" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm sm:text-base">Cancel</button>
              <button id="save-edit" class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm sm:text-base">Save</button>
            </div>
          </div>
        </div>`;
      const modalContainer = document.createElement("div");
      modalContainer.innerHTML = modalHTML;
      document.body.appendChild(modalContainer);

      document.getElementById("cancel-edit").addEventListener("click", hideEditModal);
      document.getElementById("save-edit").addEventListener("click", saveBlogEdits);
      document.getElementById("edit-image").addEventListener("change", handleEditImagePreview);
    }
  }

  async function loadBlogData() {
    try {
      const blogRef = doc(db, "blogs", blogId);
      const blogSnap = await getDoc(blogRef);

      if (blogSnap.exists()) {
        blogData = blogSnap.data();
        blogTitle.textContent = blogData.title;
        blogContent.textContent = blogData.content;
        blogTitle.classList.remove("skeleton");
        blogContent.classList.remove("skeleton");

        if (blogData.image) {
          blogImage.src = blogData.image;
          blogImage.classList.remove("hidden", "skeleton");
        }

        const date = blogData.createdAt.toDate();
        postDate.textContent = date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
        postDate.classList.remove("skeleton");

        likeCount.textContent = blogData.likes || 0;
        favoriteCount.textContent = blogData.favorites || 0;

        if (blogData.likedBy?.includes(currentUser.uid)) likeButton.classList.add("bg-blue-300");
        if (blogData.favoritedBy?.includes(currentUser.uid)) favoriteButton.classList.add("bg-red-300");

        likeButton.addEventListener("click", handleLike);
        favoriteButton.addEventListener("click", handleFavorite);

        isAuthor = blogData.author === currentUser.uid;
        if (isAuthor) {
          createEditModal();
          showAuthorControls();
        }

        await getAuthorInfo(blogData.author);
        await loadRelatedBlogs(blogData.author);
      } else {
        blogTitle.textContent = "⚠️ Blog not found";
        blogContent.textContent = "This blog either doesn't exist or has been deleted.";
        blogTitle.classList.remove("skeleton");
        blogContent.classList.remove("skeleton");
        blogContent.classList.add("text-red-500");
      }
    } catch (err) {
      console.error("Failed to load blog", err);
      blogTitle.textContent = "⚠️ Error";
      blogContent.textContent = "Failed to load blog. Please try again later.";
      blogTitle.classList.remove("skeleton");
      blogContent.classList.remove("skeleton");
      blogContent.classList.add("text-red-500");
    }
  }

  function showAuthorControls() {
    blogActions.innerHTML = `
      <button id="edit-button" class="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm sm:text-base">Edit</button>
      <button id="delete-button" class="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 text-sm sm:text-base">Delete</button>`;
    document.getElementById("edit-button").addEventListener("click", showEditModal);
    document.getElementById("delete-button").addEventListener("click", confirmDeleteBlog);
  }

  function showEditModal() {
    document.getElementById("edit-title").value = blogData.title;
    document.getElementById("edit-post-type").value = blogData.postType || "Technology";
    document.getElementById("edit-content").value = blogData.content;
    if (blogData.image) {
      document.getElementById("edit-image-preview").src = blogData.image;
      document.getElementById("edit-image-preview").classList.remove("hidden");
    }
    document.getElementById("edit-modal").classList.remove("hidden");
  }

  function hideEditModal() {
    document.getElementById("edit-modal").classList.add("hidden");
    document.getElementById("edit-image").value = "";
    document.getElementById("edit-image-preview").classList.add("hidden");
  }

  function handleEditImagePreview(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const img = document.getElementById("edit-image-preview");
        img.src = evt.target.result;
        img.classList.remove("hidden");
      };
      reader.readAsDataURL(file);
    }
  }

  async function saveBlogEdits() {
    const title = document.getElementById("edit-title").value.trim();
    const postType = document.getElementById("edit-post-type").value;
    const content = document.getElementById("edit-content").value.trim();
    const imageInput = document.getElementById("edit-image");

    if (!title || !content) {
      alert("Title and content are required.");
      return;
    }

    try {
      const updateData = {
        title,
        postType,
        content,
        updatedAt: new Date()
      };

      let imageUpdated = false;
      if (imageInput.files.length > 0) {
        try {
          const file = imageInput.files[0];
          const storageRef = ref(storage, `blog-images/${currentUser.uid}/${Date.now()}_${file.name}`);
          const snapshot = await uploadBytes(storageRef, file);
          updateData.image = await getDownloadURL(snapshot.ref);
          imageUpdated = true;
        } catch (storageError) {
          console.warn("Image upload failed due to CORS or storage issue, skipping image update:", storageError);
          if (blogData.image) {
            updateData.image = blogData.image; // Retain existing image
          }
        }
      } else if (blogData.image) {
        updateData.image = blogData.image; // Retain existing image if no new image
      }

      console.log("Updating blog ID:", blogId);
      console.log("Update data:", updateData);

      const blogRef = doc(db, "blogs", blogId);
      await updateDoc(blogRef, updateData);

      console.log("Blog updated successfully");
      hideEditModal();
      alert("Blog updated successfully!");
      location.reload();
    } catch (error) {
      console.error("Error updating blog:", error);
      alert(`Failed to update blog: ${error.message} ${error.code ? '(' + error.code + ')' : ''}`);
    }
  }

  function confirmDeleteBlog() {
    if (confirm("Are you sure? This action can't be undone.")) deleteBlog();
  }

  async function deleteBlog() {
    try {
      await deleteDoc(doc(db, "blogs", blogId));
      alert("Blog deleted.");
      window.location.href = "../main-page/peperface.html";
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog. Please try again.");
    }
  }

  async function getAuthorInfo(uid) {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      authorName.textContent = userDoc.exists() ? (userDoc.data().displayName || "Anonymous") : "Anonymous";
      authorName.classList.remove("skeleton");
    } catch {
      authorName.textContent = "Anonymous";
      authorName.classList.remove("skeleton");
    }
  }

  async function loadRelatedBlogs(uid) {
    try {
      relatedBlogsContainer.innerHTML = "";

      // Step 1: Fetch blogs by same author and same category
      const currentCategory = blogData.postType || "Other"; // Fallback to "Other" if postType is undefined
      let relatedBlogs = [];

      const sameAuthorQuery = query(
        collection(db, "blogs"),
        where("author", "==", uid),
        where("postType", "==", currentCategory),
        where("__name__", "!=", blogId),
        orderBy("createdAt", "desc"),
        limit(3)
      );
      const sameAuthorSnap = await getDocs(sameAuthorQuery);

      sameAuthorSnap.forEach(docSnap => {
        relatedBlogs.push({ id: docSnap.id, ...docSnap.data() });
      });

      // Step 2: If less than 3 blogs, fetch more blogs from same category (different authors)
      if (relatedBlogs.length < 3) {
        const remainingLimit = 3 - relatedBlogs.length;
        const sameCategoryQuery = query(
          collection(db, "blogs"),
          where("postType", "==", currentCategory),
          where("author", "!=", uid), // Different authors
          where("__name__", "!=", blogId),
          orderBy("author"), // Needed for Firestore compound query
          orderBy("createdAt", "desc"),
          limit(remainingLimit)
        );
        const sameCategorySnap = await getDocs(sameCategoryQuery);

        sameCategorySnap.forEach(docSnap => {
          relatedBlogs.push({ id: docSnap.id, ...docSnap.data() });
        });
      }

      // Step 3: Sort by createdAt and limit to 3
      relatedBlogs.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
      relatedBlogs = relatedBlogs.slice(0, 3);

      // Step 4: Display blogs
      if (relatedBlogs.length === 0) {
        relatedBlogsContainer.innerHTML = "<p class='text-gray-500 text-sm sm:text-base'>No related blogs found.</p>";
        return;
      }

      relatedBlogs.forEach(blog => {
        const blogCard = document.createElement("div");
        blogCard.className = "bg-white p-3 sm:p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col animate-fade-in";

        blogCard.innerHTML = `
          <img src="${blog.image || 'https://via.placeholder.com/300x200'}" class="w-full h-32 sm:h-40 object-cover rounded mb-2" />
          <h3 class="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 mb-1">${blog.title}</h3>
          <p class="text-gray-600 text-xs sm:text-sm line-clamp-3 mb-2">${blog.content.substring(0, 120)}${blog.content.length > 120 ? '...' : ''}</p>
          <a href="./blog-detail.html?id=${blog.id}" class="text-yellow-500 font-bold text-xs sm:text-sm hover:text-yellow-600 mt-auto">Read More →</a>
        `;
        relatedBlogsContainer.appendChild(blogCard);
      });
    } catch (error) {
      console.error("Failed to load related blogs", error);
      relatedBlogsContainer.innerHTML = "<p class='text-gray-500 text-sm sm:text-base'>Error loading related blogs.</p>";
    }
  }

  async function handleLike() {
    const hasLiked = blogData.likedBy?.includes(currentUser.uid);
    const blogRef = doc(db, "blogs", blogId);

    try {
      await updateDoc(blogRef, {
        likes: increment(hasLiked ? -1 : 1),
        likedBy: hasLiked ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid)
      });

      likeCount.textContent = parseInt(likeCount.textContent) + (hasLiked ? -1 : 1);
      likeButton.classList.toggle("bg-blue-300", !hasLiked);
      likeButton.classList.toggle("bg-blue-100", hasLiked);
      blogData.likedBy = hasLiked ? blogData.likedBy.filter(uid => uid !== currentUser.uid) : [...(blogData.likedBy || []), currentUser.uid];
    } catch (error) {
      console.error("Error updating like:", error);
      alert("Failed to update like. Please try again.");
    }
  }

  async function handleFavorite() {
    const hasFavorited = blogData.favoritedBy?.includes(currentUser.uid);
    const blogRef = doc(db, "blogs", blogId);

    try {
      await updateDoc(blogRef, {
        favorites: increment(hasFavorited ? -1 : 1),
        favoritedBy: hasFavorited ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid)
      });

      favoriteCount.textContent = parseInt(favoriteCount.textContent) + (hasFavorited ? -1 : 1);
      favoriteButton.classList.toggle("bg-red-300", !hasFavorited);
      favoriteButton.classList.toggle("bg-red-100", hasFavorited);
      blogData.favoritedBy = hasFavorited ? blogData.favoritedBy.filter(uid => uid !== currentUser.uid) : [...(blogData.favoritedBy || []), currentUser.uid];
    } catch (error) {
      console.error("Error updating favorite:", error);
      alert("Failed to update favorite. Please try again.");
    }
  }
});