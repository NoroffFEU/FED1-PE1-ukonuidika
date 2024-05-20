const passwordInput = document.getElementById("password");
const togglePasswordButton = document.getElementById("toggle-password");
const toggleIcon =
  togglePasswordButton.getElementsByClassName("toggle-password");

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

async function handleRegisterFormSubmission(event) {
  event.preventDefault();

  const form = event.target;

  const name = form.querySelector("#userName").value;
  const email = form.querySelector("#email").value;
  const password = form.querySelector("#password").value;
  const loadingSpinner = document.getElementById("loadingSpinner");
  const errorMessage = document.getElementById("errorMessage");
  const submitButton = form.querySelector("button[type='submit']");

  loadingSpinner.style.display = "block";
  errorMessage.style.display = "none";
  submitButton.disabled = true;
  const registerData = {
    name,
    email,
    password,
  };

  try {
    const response = await fetch("https://v2.api.noroff.dev/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Registration successful:", result);
      alert("Registration successful! Redirecting to login...");
      window.location.href = "login.html";
    } else {
      throw new Error("Registration failed");
    }
  } catch (error) {
    console.error("Error:", error);
    errorMessage.innerText = `Registration failed: ${error.message}`;
    errorMessage.style.display = "block";
  } finally {
    loadingSpinner.style.display = "none";
    submitButton.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#registerForm");
  form.addEventListener("submit", handleRegisterFormSubmission);
});
