window.addEventListener("DOMContentLoaded", () => {
    const name = localStorage.getItem("userName");
    const photo = localStorage.getItem("userPhoto");
  
    document.getElementById("user-name").textContent = name ?? "User";
    document.getElementById("user-photo").src = photo ?? "default.jpg";
  });
  