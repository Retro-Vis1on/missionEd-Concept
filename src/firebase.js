import firebase from 'firebase'
// import auth from 'firebase/auth'

const firebaseConfig = {
      apiKey: "AIzaSyCw2v-GaJLGtufhjjIw_auoX5z8N9eNOkY",
      authDomain: "missioned-forum.firebaseapp.com",
      projectId: "missioned-forum",
      storageBucket: "missioned-forum.appspot.com",
      messagingSenderId: "796663111568",
      appId: "1:796663111568:web:04dd0ec1c15d29a16a5d15",
      measurementId: "G-W9DW5CCGMD"
  };

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const userdb = firebase.firestore().collection('users');
const auth = firebase.auth();
const storage = firebase.storage();
export {auth,userdb,db,storage}
export default app;