import firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyDVSAVDmRiOtoqylORoih-YoC0shIsCUW0",
  authDomain: "missioned-891c8.firebaseapp.com",
  databaseURL: "https://missioned-891c8-default-rtdb.firebaseio.com",
  projectId: "missioned-891c8",
  storageBucket: "missioned-891c8.appspot.com",
  messagingSenderId: "55139331955",
  appId: "1:55139331955:web:a859c24967471be24c1f06"
  };

  const app = firebase.initializeApp(firebaseConfig);
  const analytics = firebase.analytics
  const db = firebase.firestore();
  const userdb = firebase.firestore().collection('users');
  const auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();
  const storage = firebase.storage();
export {auth,userdb,db,storage,provider}
export default app;