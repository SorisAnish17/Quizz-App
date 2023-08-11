// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApOxs7HApPxrqcegSOZFV7CeaQ-gpGzFU",
  authDomain: "quizz-app-bc537.firebaseapp.com",
  projectId: "quizz-app-bc537",
  storageBucket: "quizz-app-bc537.appspot.com",
  messagingSenderId: "345950629884",
  appId: "1:345950629884:web:64442f672ce2ffb6244c79",
  measurementId: "G-0DNYPR0VVK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
