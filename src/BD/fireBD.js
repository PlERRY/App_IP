// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1XepqZF0hvj3BKyvowrT6LtbA6vaj5AA",
  authDomain: "appip-7c886.firebaseapp.com",
  projectId: "appip-7c886",
  storageBucket: "appip-7c886.appspot.com",
  messagingSenderId: "872485554787",
  appId: "1:872485554787:web:ea35229eb38e383a2a0656"
};

// Initialize Firebase
const bd = initializeApp(firebaseConfig);
export default bd;