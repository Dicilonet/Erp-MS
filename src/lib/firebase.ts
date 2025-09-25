
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBb_PI32SelARBnTyXqBN6Lo45v9aZ6zS4",
    authDomain: "erp-dicilo.firebaseapp.com",
    projectId: "erp-dicilo",
    storageBucket: "erp-dicilo.appspot.com",
    messagingSenderId: "374571505684",
    appId: "1:374571505684:web:c22f11294fbf837a796f01",
    measurementId: "G-XXXXXXXXXX" // Replace with your actual measurement ID or remove if not using Analytics
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
