import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyDHAQNOMMsN4OfyE3V14tdcXZczWHMAahc",
  authDomain: "flocka-time.firebaseapp.com",
  databaseURL: "https://flocka-time.firebaseio.com",
  projectId: "flocka-time",
  storageBucket: "flocka-time.appspot.com",
  messagingSenderId: "176647479098",
  appId: "1:176647479098:web:e0ca3801e5b6cfb4"
};

firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const auth = firebase.auth();
const fbProvider = new firebase.auth.FacebookAuthProvider();

export {
  database, 
  auth,
  fbProvider
}