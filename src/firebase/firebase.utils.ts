import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import Axios from 'axios';

const config: any = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASEURL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: "",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGESENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID
};

export const createUserProfileDocument = 
  async (userAuth: any, additionalData: any) => {
    if(!userAuth) return;

    try {
      const userRef = await Axios.get(
        `${process.env.REACT_APP_TASK_URL}/external/auth/${userAuth.uid}?apiKey=${process.env.REACT_APP_API_KEY}`
      );

      if(!userRef || !userRef.data || userRef.status !== 200) {
        console.log('hit here'); 
      }

      return userRef.data;
    } catch (error) { 

      const {
        displayName, 
        email, 
        photoURL,
        uid
      } = userAuth;

      const newUserData = {
        displayName, 
        email, 
        photoURL, 
        uid
      };

      try {
        const newUser = await Axios.post(
          `${process.env.REACT_APP_TASK_URL}/external/user?apiKey=${process.env.REACT_APP_API_KEY}`, 
          newUserData
        );

       return newUser.data;
      } catch (error) {
        console.error(error);
      }

      console.log(error);
    }
}

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((userAuth: any) => {
      unsubscribe();
      resolve(userAuth);
    }, reject);
  });
}


export const googleProvider = new firebase.auth.GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const signInWithGoogle = () => auth.signInWithPopup(googleProvider)

export default firebase;