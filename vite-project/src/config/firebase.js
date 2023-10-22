// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAjZvIcX0bRqNWEM-jwZtQ-EWFEX3HICe8",
  authDomain: "reactfire-bd1e8.firebaseapp.com",
  projectId: "reactfire-bd1e8",
  storageBucket: "reactfire-bd1e8.appspot.com",
  messagingSenderId: "741275514275",
  appId: "1:741275514275:web:bcd112476ae1f91839d616",
  measurementId: "G-97L48GKY1E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);