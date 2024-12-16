// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyASHRBGFoG_8uUqCZ55YT0DsiRCL6R0sRk",
  authDomain: "solid-groove-409606.firebaseapp.com",
  projectId: "solid-groove-409606",
  storageBucket: "solid-groove-409606.appspot.com",
  messagingSenderId: "182848565365",
  appId: "1:182848565365:web:2c23f620846fa17d23483c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app