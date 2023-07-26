import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyAhSLyN3Tk-q8G3oS5mq7uDSQ5WrxNojbs",
    authDomain: "storytent-e609d.firebaseapp.com",
    projectId: "storytent-e609d",
    storageBucket: "storytent-e609d.appspot.com",
    messagingSenderId: "451080537233",
    appId: "1:451080537233:web:41fe55cf2fcdf49758ab30",
    measurementId: "G-NL4MHWNQ9B"
};
  
  firebase.initializeApp(firebaseConfig);

  let auth = firebase.auth();
  export { auth, firebase };