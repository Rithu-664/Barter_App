import firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyB2vUsXMPKMcaduW-yLxL_qDs5vvQL4mIM",
  authDomain: "barter-app-17272.firebaseapp.com",
  databaseURL: "https://barter-app-17272-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "barter-app-17272",
  storageBucket: "barter-app-17272.appspot.com",
  messagingSenderId: "597254337169",
  appId: "1:597254337169:web:5182b6be4f4510ff908530",
  measurementId: "G-RBTGEVZV7E"
};

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig)
}

export default firebase.auth()