

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyABccvZzuFaXe1olMtqjg3yReJG8Sl3WXQ",
  authDomain: "fireaarohan2.firebaseapp.com",
  projectId: "fireaarohan2",
  storageBucket: "fireaarohan2.appspot.com",
  messagingSenderId: "199380969173",
  appId: "1:199380969173:web:4efcb8b6e7ddebea60645c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
 const auth = getAuth(app);
 const firestore = getFirestore(app);
export { auth, storage, firestore};