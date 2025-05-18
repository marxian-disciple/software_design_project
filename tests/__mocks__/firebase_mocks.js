// tests/__mocks__/firebase.js

export const initializeApp = jest.fn();
export const getAuth = jest.fn();
export const onAuthStateChanged = jest.fn();

export const getFirestore = jest.fn();
export const collection = jest.fn();
export const getDocs = jest.fn();
export const addDoc = jest.fn();
export const deleteDoc = jest.fn();

export const getStorage = jest.fn();
export const ref = jest.fn();
export const uploadBytes = jest.fn();
export const getDownloadURL = jest.fn();

export const GoogleAuthProvider = jest.fn().mockImplementation(() => ({ /* Mock any methods/properties if needed */ }));
export const isSupported = jest.fn().mockResolvedValue(true);
export const getAnalytics = jest.fn();