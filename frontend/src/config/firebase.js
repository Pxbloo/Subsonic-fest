// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDM2xxqeg2PwsCc-vMWs7DJciTAIN-kl9c",
  authDomain: "subsonic-pi.firebaseapp.com",
  projectId: "subsonic-pi",
  storageBucket: "subsonic-pi.firebasestorage.app",
  messagingSenderId: "38196160517",
  appId: "1:38196160517:web:73bef24669fa8bbc17d46c",
  measurementId: "G-PF4VHMTVCX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app); 
export const googleProvider = new GoogleAuthProvider();