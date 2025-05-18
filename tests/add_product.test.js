/**
 * @jest-environment jsdom
 */

beforeEach(async () => {
  // Set up a mock HTML structure
  document.body.innerHTML = `
    <button class="add-btn"></button>
    <form class="add-product"></form>
    <input id="product_name" />
    <input id="price" />
    <input id="weight" />
    <input id="quantity" />
    <select id="categories"></select>
    <textarea id="description"></textarea>
    <input id="image" type="file" />
    <span id="closeBtn"></button>
  `;

  // Reset modules so next import reflects new DOM
  jest.resetModules();
});

test('should export valid DOM elements', async () => {
  const {
    addButton,
    form,
    name,
    price,
    weight,
    quantity,
    category,
    description,
    image,
    closeBtn
  } = await import('../local_artisan/scripts/add_product.js');

  expect(addButton).toBeInstanceOf(HTMLElement);
  expect(form).toBeInstanceOf(HTMLElement);
  expect(name).toBeInstanceOf(HTMLElement);
  expect(price).toBeInstanceOf(HTMLElement);
  expect(weight).toBeInstanceOf(HTMLElement);
  expect(quantity).toBeInstanceOf(HTMLElement);
  expect(category).toBeInstanceOf(HTMLElement);
  expect(description).toBeInstanceOf(HTMLElement);
  expect(image).toBeInstanceOf(HTMLElement);
  expect(closeBtn).toBeInstanceOf(HTMLElement);
});