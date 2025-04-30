document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const productTypes = document.getElementById("productTypes");
  const categories = document.getElementById("categories");
  const maxCategories = 3;

  // Character counter for product types
  const charCounter = document.createElement("small");
  productTypes.parentNode.insertBefore(charCounter, productTypes.nextSibling);

  productTypes.addEventListener("input", () => {
    charCounter.textContent = `${productTypes.value.length} characters`;
  });

  // Limit selection to 3 categories
  categories.addEventListener("change", () => {
    const selected = [...categories.options].filter(option => option.selected);
    if (selected.length > maxCategories) {
      selected[selected.length - 1].selected = false;
      alert(`You can only select up to ${maxCategories} categories.`);
    }
  });

  // Confirmation popup
  form.addEventListener("Submit Application", (e) => {
    e.preventDefault(); // Remove this if you're ready to actually submit
    alert("Thank you! Your application has been submitted.");
    form.reset();
    charCounter.textContent = "";
  });

});
