// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBGJy-QhZVVGRDSyNCL3Q0dJ38BYIYGCE8",
    authDomain: "portfolio-reviews-61da7.firebaseapp.com",
    databaseURL: "https://portfolio-reviews-61da7-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "portfolio-reviews-61da7",
    storageBucket: "portfolio-reviews-61da7.firebasestorage.app",
    messagingSenderId: "223840413523",
    appId: "1:223840413523:web:ad07b66a10f982332f23a6",
    measurementId: "G-3MVPQ248VF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export { database, analytics }; 