import { initializeForm } from '../local_artisan/scripts/add_product.js';

jest.mock('../lib/firebaseConfig.js', () => ({
  auth: {},
  db: {},
  storage: {},
}));

//Mocking auth - jest.fn() is a mock function in jest
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
}));

//Mocking storage
jest.mock('firebase/storage', () => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
}));

//Mocking firestore 
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
}));

/*Why do we mock firebase imports?
We mock those functions to:
Avoid making real network/database calls
Your tests become faster and more reliable.

Control their behavior
You can decide what they return (e.g., mock a successful upload or a failure).

Spy on how they are called
Verify that your code calls them with the right parameters.

So says chat...*/

import { onAuthStateChanged } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

describe('initializeForm', () => {
  let alertMock;
  let locationHref;
  //"These mocks help you test side effects like alerts and redirects safely."

  beforeEach(() => {
    // Setup DOM elements
    document.body.innerHTML = `
      <button class="add-btn"></button>
      <form class="add-product">
        <input id="product_name" value="Test Product" />
        <input id="price" value="10" />
        <input id="weight" value="1" />
        <input id="quantity" value="5" />
        <select id="categories"><option value="category1" selected>category1</option></select>
        <textarea id="description">Test Description</textarea>
        <input id="image" type="file" />
      </form>
    `;

     // Mock file input with a fake file
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    Object.defineProperty(document.getElementById('image'), 'files', {
      value: [file],
    });

    // Mock window alert
    alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    // Mock window.location.href setter
    locationHref = '';
    delete window.location;
    window.location = { set href(url) { locationHref = url; } };

    // Reset mocks
    onAuthStateChanged.mockClear();
    ref.mockClear();
    uploadBytes.mockClear();
    getDownloadURL.mockClear();
    addDoc.mockClear();
  });

  it('should upload image and add product request on button click when user is logged in', async () => {
    const user = { uid: 'user123' };
    
    // Mock onAuthStateChanged to call its callback with user
    onAuthStateChanged.mockImplementation((auth, callback) => callback(user));

    // Mock Firebase storage functions
    ref.mockReturnValue('storage-ref');
    uploadBytes.mockResolvedValue();
    getDownloadURL.mockResolvedValue('http://fakeurl.com/image.png');

    // Mock Firestore addDoc
    addDoc.mockResolvedValue();

    // Initialize form (sets up listener)
    initializeForm();

    // Simulate button click
    const addButton = document.querySelector('.add-btn');
    await addButton.click();

    expect(uploadBytes).toHaveBeenCalledWith('storage-ref', expect.any(File));
    expect(getDownloadURL).toHaveBeenCalledWith('storage-ref');
    expect(addDoc).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      userId: user.uid,
      name: 'Test Product',
      price: '10',
      weight: '1',
      quantity: '5',
      category: 'category1',
      description: 'Test Description',
      imageUrl: 'http://fakeurl.com/image.png',
    }));
    expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('request has been sent'));
    expect(locationHref).toBe('../html/seller_dashboard.html');
  });

  it('should alert when user is not logged in', () => {
    onAuthStateChanged.mockImplementation((auth, callback) => callback(null));
    initializeForm();
    expect(alertMock).toHaveBeenCalledWith('User not logged in!');
  });

  it('should alert when no image selected', async () => {
    const user = { uid: 'user123' };
    onAuthStateChanged.mockImplementation((auth, callback) => callback(user));

    // Remove file from input
    Object.defineProperty(document.getElementById('image'), 'files', {
      value: [],
    });

    initializeForm();

    const addButton = document.querySelector('.add-btn');
    await addButton.click();

    expect(alertMock).toHaveBeenCalledWith('Please upload an image.');
  });
});