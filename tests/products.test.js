const products = [
    {
        id: "1",
        name: "Handmade Ceramic Mug",
        price: 25.00,
        description: "This beautifully crafted ceramic mug is perfect for coffee lovers. Handmade by local artisans with eco-friendly materials.",
        image: "../images/ceramic_mug.png",
        type: "Stationery & Paper Goods" 
    },
    {
        id: "2",
        name: "Wooden Jewelry Box",
        price: 45.00,
        description: "A finely crafted jewelry box made from sustainable wood, featuring intricate carvings.",
        image: "../images/wooden_jewelry_box.png",
        type : "Ceramics"
    },
    {
        id: "3",
        name: "Handmade Ceramic Mug",
        price: 25.00,
        description: "This beautifully crafted ceramic mug is perfect for coffee lovers. Handmade by local artisans with eco-friendly materials.",
        image: "../images/ceramic_mug.png",
        type: "Glass"
    },
    {
        id: "4",
        name: "Wooden Jewelry Box",
        price: 45.00,
        description: "A finely crafted jewelry box made from sustainable wood, featuring intricate carvings.",
        image: "../images/wooden_jewelry_box.png",
        type : "Leather"
    }
];

describe('Products Array', () => {

    test('should contain 4 products', () => {
        expect(products.length).toBe(4);
    });

    test('each product should have required properties', () => {
        products.forEach(product => {
            expect(product).toHaveProperty('id');
            expect(product).toHaveProperty('name');
            expect(product).toHaveProperty('price');
            expect(product).toHaveProperty('description');
            expect(product).toHaveProperty('image');
            expect(product).toHaveProperty('type');
        });
    });

    test('each product should have a non-empty name and description', () => {
        products.forEach(product => {
            expect(product.name).not.toEqual('');
            expect(product.description).not.toEqual('');
        });
    });

    test('price should be a number greater than 0', () => {
        products.forEach(product => {
            expect(typeof product.price).toBe('number');
            expect(product.price).toBeGreaterThan(0);
        });
    });

    test('ids should be unique', () => {
        const ids = products.map(p => p.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
    });

    test('image paths should include .png extension', () => {
        products.forEach(product => {
            expect(product.image.endsWith('.png')).toBe(true);
        });
    });

});
