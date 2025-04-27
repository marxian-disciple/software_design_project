const content = document.querySelector('.content');

products.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('product-card');

    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-price">$${product.price.toFixed(2)}</p>
        <a href="view_product.html?id=${product.id}" class="view-button">View Product</a>
    `;

    content.appendChild(card);
});
