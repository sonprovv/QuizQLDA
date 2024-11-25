// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCU-wbOo3QJpAX3GubGGlL6BAWLKRh8UY8",
    authDomain: "qlda-8ec11.firebaseapp.com",
    databaseURL: "https://qlda-8ec11-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "qlda-8ec11",
    storageBucket: "qlda-8ec11.firebasestorage.app",
    messagingSenderId: "292662875699",
    appId: "1:292662875699:web:3708b983c759bbe83ff546",
    measurementId: "G-LJQM6SFFC2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const database = getDatabase(app);