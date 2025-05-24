export const addButton = document.querySelector('.add-btn');
export const form = document.querySelector('.add-product');
export const name = document.getElementById('product_name');
export const price = document.getElementById('price');
export const weight = document.getElementById('weight');
export const quantity = document.getElementById('quantity');
export const category = document.getElementById('categories');
export const description = document.getElementById('description');
export const image = document.getElementById('image');
export const closeBtn = document.getElementById("closeBtn");

export function isNameValid(name){
    return typeof name === 'string' && name.trim().length > 0;
};

export function isPriceValid(price) {
    const numPrice = Number(price);
    if (/^[+]?\d+(\.\d+)?$/.test(price) && numPrice > 0){
        return true;
    }
    return false;
}

export function isWeightValid(weight) {
    const numWeight = Number(weight);
    if(/^[+]?\d+(\.\d+)?$/.test(weight) && numWeight > 0){
        return true;
    }
    return false;
}

export function isQuantityValid(quantity) {
    const numQuantity = Number(quantity);
    if(/^[+]?\d+$/.test(quantity) && numQuantity > 0){
        return true;
    }
    return false;
}

export function isImageValid(image){
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    if (!image || !allowedTypes.includes(image.type)) {
      return false;
    }
    return true;
};

export function isCategoryValid(category){
    return category && category !== "Select Option";
};
