// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import{ getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "vingo-698e1.firebaseapp.com",
  projectId: "vingo-698e1",
  storageBucket: "vingo-698e1.firebasestorage.app",
  messagingSenderId: "968469562244",
  appId: "1:968469562244:web:5a3ad8ba4a1fa9294b13d1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export {auth,app};