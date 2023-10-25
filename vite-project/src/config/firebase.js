// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC96R1yljmWGA8VwqMDCGhZGk3XXkMHAqw",
  authDomain: "newtest-31caa.firebaseapp.com",
  projectId: "newtest-31caa",
  storageBucket: "newtest-31caa.appspot.com",
  messagingSenderId: "42832529334",
  appId: "1:42832529334:web:36270a4fab9c77e60d6317",
  measurementId: "G-ENTER2CTZ4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);