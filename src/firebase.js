import firebase from 'firebase'
// import auth from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDVSAVDmRiOtoqylORoih-YoC0shIsCUW0",
    authDomain: "missioned-891c8.firebaseapp.com",
    projectId: "missioned-891c8",
    storageBucket: "missioned-891c8.appspot.com",
    messagingSenderId: "55139331955",
    appId: "1:55139331955:web:e67973405bd2ca204c1f06"
  };

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const userdb = firebase.firestore().collection('users');
const auth = firebase.auth();

export {auth,userdb,db}
export default app;