import firebase from 'firebase/app'
import 'firebase/firebase-auth'
import 'firebase/firebase-firestore'
import 'firebase/firebase-storage'
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const userdb = db.collection('users');
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();
export { auth, userdb, db, storage, provider, firebase }
export default app;