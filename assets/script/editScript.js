// Function to get the query parameter by name
function getQueryParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

const postId = getQueryParameter("id"); // Extract post ID from the URL
const username = localStorage.getItem("username");

// Fetch the existing blog post and pre-populate the form
function fetchBlogPost(postId, username) {
  const apiUrl = `https://v2.api.noroff.dev/blog/posts/${username}/${postId}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const post = data.data; // Extract the post data

      document.getElementById("title").value = post.title;
      document.getElementById("image").value = post.media.url || ""; // Pre-populate fields
      document.getElementById("content").value = post.body;
      document.getElementById("author").value = post.author.name;
      document.getElementById("publish").innerHTML = post.created;
    })
    .catch((error) => {
      console.error("Error fetching blog post:", error);
      document.getElementById("errorMessage").innerText =
        "Failed to fetch the post.";
      document.getElementById("errorMessage").style.display = "block"; // Display error message
    });
}

document.addEventListener("DOMContentLoaded", () => {
  if (postId && username) {
    fetchBlogPost(postId, username);
  } else {
    alert("Invalid post ID or username."); // Basic error handling
  }
});

function updateBlogPost(postId, username, updatedPost) {
  const apiUrl = `https://v2.api.noroff.dev/blog/posts/${username}/${postId}`;
  const token = localStorage.getItem("token");
  fetch(apiUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedPost),
  })
    .then((response) => {
      if (response.ok) {
        alert("Blog post updated successfully!");
        window.location.href = "../index.html";
      } else {
        alert("Failed to update the post.");
      }
    })
    .catch((error) => {
      console.error("Error updating the post:", error);
      alert("Error updating the post.");
    });
}

document.getElementById("editPostForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const updatedPost = {
    title: document.getElementById("title").value,
    media: {
      url: document.getElementById("image").value,
    },
    body: document.getElementById("content").value,
  };

  if (postId && username) {
    updateBlogPost(postId, username, updatedPost);
  } else {
    alert("Invalid post ID or username.");
  }
});
