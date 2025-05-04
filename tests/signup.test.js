// signup.test.js

import {
  createUserWithEmailAndPassword,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { auth, provider } from "../lib/firebaseConfig.js";

// Mock Firebase functions
jest.mock("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js", () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
}));

// Mock Firebase Config
jest.mock("../lib/firebaseConfig.js", () => ({
  auth: {},
  provider: {},
}));

beforeEach(() => {
  document.body.innerHTML = `
    <form class="login-form">
      <input id="username" value="test@example.com" />
      <input id="password" value="password123" />
      <input id="confirm_pass" value="password123" />
      <button type="submit">Sign Up</button>
    </form>
    <button class="google-btn">Google Sign In</button>
    <a class="login-icon"></a>
  `;
  jest.clearAllMocks();
});

test("should sign up user with email and password", async () => {
  createUserWithEmailAndPassword.mockResolvedValue({
    user: { email: "test@example.com" },
  });

  require("../scripts/signup.js"); // Load your script

  const form = document.querySelector(".login-form");
  form.dispatchEvent(new Event("submit"));

  await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for promises

  expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
    auth,
    "test@example.com",
    "password123"
  );
});

test("should alert on password mismatch", async () => {
  document.getElementById("confirm_pass").value = "wrongPassword";

  const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
  require("../scripts/signup.js");

  const form = document.querySelector(".login-form");
  form.dispatchEvent(new Event("submit"));

  expect(alertMock).toHaveBeenCalledWith("Passwords do not match!");
});

test("should handle signup error", async () => {
  createUserWithEmailAndPassword.mockRejectedValue(new Error("Signup failed"));
  const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

  require("../scripts/signup.js");

  const form = document.querySelector(".login-form");
  form.dispatchEvent(new Event("submit"));

  await new Promise((resolve) => setTimeout(resolve, 0));

  expect(alertMock).toHaveBeenCalledWith("Signup failed: Signup failed");
});

test("should sign in with Google and update profile", async () => {
  signInWithPopup.mockResolvedValue({
    user: {
      displayName: "Test User",
      photoURL: "https://example.com/photo.jpg",
    },
  });

  const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

  require("../scripts/signup.js");

  const btn = document.querySelector(".google-btn");
  btn.click();

  await new Promise((resolve) => setTimeout(resolve, 0));

  expect(alertMock).toHaveBeenCalledWith("Welcome, Test User!");
  expect(signInWithPopup).toHaveBeenCalledWith(auth, provider);
});

test("should handle Google sign-in error", async () => {
  signInWithPopup.mockRejectedValue(new Error("Google error"));

  const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

  require("../scripts/signup.js");

  const btn = document.querySelector(".google-btn");
  btn.click();

  await new Promise((resolve) => setTimeout(resolve, 0));

  expect(alertMock).toHaveBeenCalledWith("Google Sign-In failed. Please try again.");
});
