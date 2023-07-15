// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app'
import { getDatabase } from 'firebase/database'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBUXlt1eFyjIlHCan8zM1k48R4EMVJCB1o",
  authDomain: "appevents-c9f8d.firebaseapp.com",
  projectId: "appevents-c9f8d",
  storageBucket: "appevents-c9f8d.appspot.com",
  messagingSenderId: "291402387033",
  appId: "1:291402387033:web:66c47ab616e2e1a03f6b48",
  measurementId: "G-P2WP7KGE61",
  databaseURL: "https://appevents-c9f8d-default-rtdb.europe-west1.firebasedatabase.app"
};

if (firebase.apps.length === 0){
  firebase.initializeApp (firebaseConfig);
}

const db = getDatabase();

export { db }