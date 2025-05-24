// toggle light <-> dark
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("modeToggle");
  if (!btn) return;

  // track 0 = light, 1 = dark
  let isDark = false;

  // dark theme variables
  const dark = {
    bg: "#3B5249",
    text: "#FAD4D8",
    accent: "#231942"
  };

  const light = {
    bg: "#FAD4D8",
    text: "#231942",
    accent: "#3B5249"
  };

  const apply = ({ bg, text, accent }) => {
    const root = document.documentElement;
    root.style.setProperty("--primary-bg", bg);
    root.style.setProperty("--primary-text", text);
    root.style.setProperty("--accent-color", accent);
  };

  btn.addEventListener("click", () => {
    isDark = !isDark;
    apply(isDark ? dark : light);

    // optional: swap the icon between sun and moon
    btn.textContent = isDark ? "🌙" : "☀";
  });
});
