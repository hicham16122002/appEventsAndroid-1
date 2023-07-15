import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'
import { initializeApp } from "firebase/app";

export const firebaseConfig = {
  apiKey: "AIzaSyBUXlt1eFyjIlHCan8zM1k48R4EMVJCB1o",
  authDomain: "appevents-c9f8d.firebaseapp.com",
  projectId: "appevents-c9f8d",
  storageBucket: "appevents-c9f8d.appspot.com",
  messagingSenderId: "291402387033",
  appId: "1:291402387033:web:66c47ab616e2e1a03f6b48",
  measurementId: "G-P2WP7KGE61",
  databaseURL: "https://appevents-c9f8d-default-rtdb.europe-west1.firebasedatabase.app"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

const app = initializeApp(firebaseConfig);

export {app, firebase}