const products = [
    {
        id: "1",
        name: "Handmade Ceramic Mug",
        price: 25.00,
        description: "This beautifully crafted ceramic mug is perfect for coffee lovers. Handmade by local artisans with eco-friendly materials.",
        image: "../images/ceramic_mug.png"
    },
    {
        id: "2",
        name: "Wooden Jewelry Box",
        price: 45.00,
        description: "A finely crafted jewelry box made from sustainable wood, featuring intricate carvings.",
        image: "../images/wooden_jewelry_box.png"
    }
];
// Get the product ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// Find the product in the list
const product = products.find(p => p.id === productId); 

if (product) {
    // Populate the page dynamically
    document.getElementById('product-image').src = product.image;
    document.getElementById('product-image').alt = product.name;
    document.getElementById('product-title').textContent = product.name;
    document.getElementById('product-description').textContent = product.description;
    document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;
} else {
    // If product not found
    alert("Product not found!");
}

const addToCartButton = document.getElementById('add-to-cart');

addToCartButton.addEventListener('click', () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the product is already in the cart
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        // If exists, just increase quantity
        existingItem.quantity += 1;
    } else {
        // Else add as new item
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    alert(`${product.name} added to cart!`);
});
