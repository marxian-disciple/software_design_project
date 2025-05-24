/**
 * @jest-environment jsdom
 */

describe('Theme Toggle Script', () => {
  let modeToggle;
  let header;

  beforeEach(() => {
    // Set up DOM structure
    document.body.innerHTML = `
      <header id="header"></header>
      <button id="modeToggle"></button>
    `;

    // Simulate the script
    require('../local_artisan/scripts/theme.js'); // Adjust the path as needed

    modeToggle = document.getElementById('modeToggle');
    header = document.getElementById('header');

    // Manually dispatch DOMContentLoaded
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });

  test('initializes in light mode with correct styles', () => {
    expect(document.body.style.backgroundColor).toBe('rgb(250, 218, 216)');
    expect(header.style.backgroundColor).toBe('rgb(255, 229, 224)');
    expect(modeToggle.textContent).toBe('☀');
    expect(modeToggle.style.color).toBe('black');
  });

  test('toggles to dark mode on click', () => {
    modeToggle.click();

    expect(document.body.style.backgroundColor).toBe('rgb(35, 25, 66)');
    expect(header.style.backgroundColor).toBe('rgb(225, 217, 209)');
    expect(modeToggle.style.color).toBe('white');
  });

  test('toggles back to light mode on second click', () => {
    modeToggle.click(); // to dark
    modeToggle.click(); // back to light

    expect(document.body.style.backgroundColor).toBe('rgb(250, 218, 216)');
    expect(header.style.backgroundColor).toBe('rgb(255, 229, 224)');
    expect(modeToggle.style.color).toBe('black');
  });
});
