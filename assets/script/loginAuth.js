const passwordInput = document.getElementById("password");
const togglePasswordButton = document.getElementById("toggle-password");
const toggleIcon = togglePasswordButton.getElementsByClassName("toggle-password");

let isPasswordVisible = false;

togglePasswordButton.addEventListener("click", function () {
  isPasswordVisible = !isPasswordVisible;

  if (isPasswordVisible) {
    passwordInput.type = "text";
    toggleIcon.classList.remove("fa-eye");
    toggleIcon.classList.add("fa-eye-slash");
    togglePasswordButton.setAttribute("aria-label", "Hide Password");
  } else {
    passwordInput.type = "password";
    toggleIcon.classList.remove("fa-eye-slash");
    toggleIcon.classList.add("fa-eye");
    togglePasswordButton.setAttribute("aria-label", "Show Password");
  }
});

async function handleLoginFormSubmission(event) {
  event.preventDefault();

  const form = event.target;

  const email = form.querySelector("#email").value;
  const password = form.querySelector("#password").value;
  const loadingSpinner = document.getElementById("loadingSpinner");
  const errorMessage = document.getElementById("errorMessage");
  const submitButton = form.querySelector("button[type='submit']");

  loadingSpinner.style.display = "block";
  errorMessage.style.display = "none";
  submitButton.disabled = true;
  const loginData = {
    email,
    password,
  };

  try {
    const response = await fetch("https://v2.api.noroff.dev/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Login successful:", result);
      localStorage.setItem("username", result.data.name);
      localStorage.setItem("token", result.data.accessToken);
      window.location.href = "../index.html";
    } else {
      throw new Error("Login failed");
    }
  } catch (error) {
    console.error("Error:", error);
    errorMessage.innerText = `Login failed: ${error.message}`;
    errorMessage.style.display = "block";
  } finally {
    loadingSpinner.style.display = "none";
    submitButton.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#loginForm");
  form.addEventListener("submit", handleLoginFormSubmission);
});
