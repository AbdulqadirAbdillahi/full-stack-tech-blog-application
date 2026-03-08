let token = localStorage.getItem("authToken");

function register() {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  fetch("http://localhost:3001/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if(data.errors) {
        alert(data.errors[0].message);
      } else{
         alert("User registered successfully");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  fetch("http://localhost:3001/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      // Save the token in the local storage
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("username", data.username);
        token = data.token;

        alert("User Logged In successfully");

        // Fetch the posts list
        fetchPosts();

        // Hide the auth container and show the app container as we're now logged in
        document.getElementById("auth-container").classList.add("hidden");
        document.getElementById("app-container").classList.remove("hidden");
        alert(data.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function logout() {
  fetch("http://localhost:3001/api/users/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  }).then(() => {
    // Clear the token from the local storage as we're now logged out
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    token = null;
    document.getElementById("auth-container").classList.remove("hidden");
    document.getElementById("app-container").classList.add("hidden");
  });
}

function fetchPosts(category) {

  console.log("Category clicked:", category);

  let url = "http://localhost:3001/api/posts";

  // If a category is selected, add query parameter
  if (category) {
    url += `?category=${category}`;
  }
  console.log("Fetching from:", url);

 
  fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((posts) => {
       console.log("POSTS RECEIVED:", posts);
      const postsContainer = document.getElementById("posts");
      postsContainer.innerHTML = "";
      
      posts.forEach((post) => {
        const div = document.createElement("div");
        div.className = "post-card";
        

        div.innerHTML = `
          <h3>${post.title}</h3>
          <p>${post.content}</p>
          <small>By: ${post.postedBy || 'User'}</small>
          <div class="post-actions">
            <button onclick="editPost(${post.id})">Edit ✍️</button>
            <button onclick="deletePost(${post.id})" style="color: red;">Delete 🗑️</button>
          </div>
          <hr>
        `;
        postsContainer.appendChild(div);
      });
    });
  
}

function createPost() {
  const title = document.getElementById("post-title").value;
  const content = document.getElementById("post-content").value;
  const categoryId = parseInt(document.getElementById("post-category").value);
 
  fetch("http://localhost:3001/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content,categoryId, postedBy: "User" }),
  })
    .then((res) => res.json())
    .then(() => {
      alert("Post created successfully");
      fetchPosts();
    });
}


/////////////

async function deletePost(postId) {
  // 1. Double check with the user
  if (!confirm("Delete this football post?")) return;

  // 2. Send the delete request to the server
  const response = await fetch(`http://localhost:3001/api/posts/${postId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });

  // 3. If it worked, refresh the list
  if (response.ok) {
    alert("Post removed!");
    fetchPosts(); 
  } else {
    alert("Error: You might not have permission.");
  }
}



async function editPost(id) {

  const newTitle = prompt("Enter new title:");
  const newContent = prompt("Enter new content:");

  if (newTitle && newContent) {
    const response = await fetch(`http://localhost:3001/api/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ title: newTitle, content: newContent })
    });

    // 3. Refresh the page if successful
    if (response.ok) {
      alert("Updated!");
      fetchPosts();
    }
  }
}
  

