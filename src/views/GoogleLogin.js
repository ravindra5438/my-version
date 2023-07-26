// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// client-id => 451080537233-13u9n6v75ssu68gb5nukkl94qfopnosk.apps.googleusercontent.com

const firebaseConfig = {
  apiKey: "AIzaSyAhSLyN3Tk-q8G3oS5mq7uDSQ5WrxNojbs",
  authDomain: "storytent-e609d.firebaseapp.com",
  projectId: "storytent-e609d",
  storageBucket: "storytent-e609d.appspot.com",
  messagingSenderId: "451080537233",
  appId: "1:451080537233:web:41fe55cf2fcdf49758ab30",
  measurementId: "G-NL4MHWNQ9B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);