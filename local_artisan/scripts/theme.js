document.addEventListener('DOMContentLoaded', () => {
  const modeToggle = document.getElementById('modeToggle');
  let darkMode = false;

  document.body.style.backgroundColor = '#FADAD8';
  header.style.backgroundColor = '#FFE5E0';
  modeToggle.textContent = '☀';  
  modeToggle.style.color = 'black';

  modeToggle.addEventListener('click', () => {
    if (!darkMode) {
      document.body.style.backgroundColor = '#231942';
      header.style.backgroundColor = '#E1D9D1';
      modeToggle.style.color = 'white';
    } else {
      document.body.style.backgroundColor = '#FADAD8';
      header.style.backgroundColor = '#FFE5E0';
      modeToggle.style.color = 'black';
    }
    darkMode = !darkMode;
  });
});