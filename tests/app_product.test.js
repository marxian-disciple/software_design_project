import { initializeForm } from '../local_artisan/scripts/add_product';
import { onAuthStateChanged } from 'firebase/auth';
import { uploadBytes, getDownloadURL, ref } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn()
}));

jest.mock('firebase/storage', () => ({
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
  ref: jest.fn()
}));

jest.mock('firebase/firestore', () => ({
  addDoc: jest.fn(),
  collection: jest.fn(),
  getFirestore: jest.fn().mockReturnValue('mockedFirestore')  // Mock getFirestore
}));

jest.mock('../local_artisan/lib/firebaseConfig', () => ({
  auth: {},
  db: 'mockedFirestore',  // Mock db value
  storage: {}
}));

describe('initializeForm', () => {
  beforeEach(() => {
    // Set up fake DOM elements
    document.body.innerHTML = `
      <form class="add-product">
        <input id="product_name" value="Test Product" />
        <input id="price" value="10" />
        <input id="weight" value="1kg" />
        <input id="quantity" value="5" />
        <input id="description" value="A test product" />
        <input id="image" type="file" />
        <button type="submit">Submit</button>
      </form>
    `;

    const fileInput = document.getElementById('image');
    Object.defineProperty(fileInput, 'files', {
      value: [new File(['dummy content'], 'test.png', { type: 'image/png' })],
    });

    global.alert = jest.fn(); // mock alert
  });

  it('submits form and adds product', async () => {
    const mockUser = { uid: '12345' };
    const mockUrl = 'https://fake-url.com/image.png';

    onAuthStateChanged.mockImplementation((auth, callback) => callback(mockUser));
    uploadBytes.mockResolvedValue();
    getDownloadURL.mockResolvedValue(mockUrl);
    addDoc.mockResolvedValue();
    collection.mockReturnValue('collectionRef');

    initializeForm();

    // simulate form submission
    const form = document.querySelector('.add-product');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    // allow promises to resolve
    await new Promise(setImmediate);

    expect(uploadBytes).toHaveBeenCalled();
    expect(getDownloadURL).toHaveBeenCalled();
    expect(addDoc).toHaveBeenCalledWith('collectionRef', expect.objectContaining({
      name: 'Test Product',
      price: '10',
      weight: '1kg',
      quantity: '5',
      description: 'A test product',
      imageUrl: mockUrl,
    }));
    expect(global.alert).toHaveBeenCalledWith('Product added successfully!');
  });
});
