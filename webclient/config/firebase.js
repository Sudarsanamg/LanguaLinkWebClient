// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGx0A-W2pitlJrK5fAJbSceIFxpWy-3dk",
  authDomain: "langualink.firebaseapp.com",
  projectId: "langualink",
  storageBucket: "langualink.firebasestorage.app",
  messagingSenderId: "623753292290",
  appId: "1:623753292290:web:2496e069753ebfab88551b",
  measurementId: "G-7F45BTYBNF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);