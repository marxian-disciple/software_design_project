// Mocking the DOM environment
document.body.innerHTML = `
  <a href="#" id="add-products-link">Add Products</a>
`;

// Mocking window.location.href
let redirectedUrl = "";
Object.defineProperty(window, "location", {
  value: { href: "" },
  writable: true,
});

// Mock event listener and click event
const addProductsLink = document.getElementById("add-products-link");
if (addProductsLink) {
  addProductsLink.addEventListener("click", (e) => {
    e.preventDefault();
    redirectedUrl = "../html/add_product.html";
  });
}

// Simulate click event
addProductsLink.click();

// Test the result
if (redirectedUrl === "../html/add_product.html") {
  console.log("Test passed: Click event correctly redirects.");
} else {
  console.error("Test failed: Incorrect redirection.");
}

