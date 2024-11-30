document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const signupBtn = document.getElementById("signup-btn");
  const profileIcon = document.getElementById("profile-icon");

  // Mock authentication status (replace with actual logic in real application)
  let isAuthenticated = false;

  // Simulate login action
  loginBtn.addEventListener("click", () => {
    isAuthenticated = true;
    updateAuthUI();
  });

  // Simulate signup action
  signupBtn.addEventListener("click", () => {
    isAuthenticated = true;
    updateAuthUI();
  });

  // Function to update UI based on authentication status
  function updateAuthUI() {
    if (isAuthenticated) {
      loginBtn.classList.add("hidden");
      signupBtn.classList.add("hidden");
      profileIcon.classList.remove("hidden");
    } else {
      loginBtn.classList.remove("hidden");
      signupBtn.classList.remove("hidden");
      profileIcon.classList.add("hidden");
    }
  }

  // Initialize the UI
  updateAuthUI();
});
