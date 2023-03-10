//Next.js serverside rendering. Want to make sure we are not running two instances of our app so put check in place. That is what this code is (as opposed to default code from firebase)
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {

  apiKey: "AIzaSyC5-QEudxmiWKt4do1a1P52YZ731iPdd8A",

  authDomain: "netflix-redesign-e6105.firebaseapp.com",

  projectId: "netflix-redesign-e6105",

  storageBucket: "netflix-redesign-e6105.appspot.com",

  messagingSenderId: "20275872790",

  appId: "1:20275872790:web:67c701195b788ba7efe137"
  
  };
  

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore()
const auth = getAuth()

export default app
export { auth, db }


// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBn0ZwJT8-MY3BVulEu8pOf63LXaFvUh40",
//   authDomain: "netflix-redesign-88ad8.firebaseapp.com",
//   projectId: "netflix-redesign-88ad8",
//   storageBucket: "netflix-redesign-88ad8.appspot.com",
//   messagingSenderId: "172575271879",
//   appId: "1:172575271879:web:d945d6788bd62c56fb47e2"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);