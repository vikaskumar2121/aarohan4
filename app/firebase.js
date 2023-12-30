

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAPI0-lHbpRqtJbAdQtoYLpS3DpbRB9aaA",
    authDomain: "fireaarohan.firebaseapp.com",
    projectId: "fireaarohan",
    storageBucket: "fireaarohan.appspot.com",
    messagingSenderId: "425883579723",
    appId: "1:425883579723:web:df872122937981a29f64ce"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
 const auth = getAuth(app);
export { storage , auth};