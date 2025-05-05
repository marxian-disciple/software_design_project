/**
 * @jest-environment jsdom
 */

const fs = require("fs");
const path = require("path");

// Load the HTML into jsdom
const html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf8");

describe("script.js integration tests", () => {
  let container;

  beforeEach(() => {
    document.documentElement.innerHTML = html.toString();
    require("../scripts/script.js"); // load script after setting up DOM
  });

  test("should update character counter as user types", () => {
    const input = document.getElementById("productTypes");
    const counter = input.nextElementSibling;

    input.value = "Handmade candles";
    input.dispatchEvent(new Event("input"));

    expect(counter.textContent).toBe("16 characters");
  });

  test("should limit category selection to 3", () => {
    const select = document.getElementById("categories");

    // Simulate selecting 4 options
    [...select.options].forEach((opt, i) => opt.selected = i < 4);
    select.dispatchEvent(new Event("change"));

    const selectedCount = [...select.options].filter(opt => opt.selected).length;
    expect(selectedCount).toBeLessThanOrEqual(3);
  });

  test("should show alert on form submit", () => {
    const form = document.querySelector("form");
    window.alert = jest.fn(); // mock alert

    form.dispatchEvent(new Event("submit"));

    expect(window.alert).toHaveBeenCalledWith("Thank you! Your application has been submitted.");
  });
});
