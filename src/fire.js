import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyDpZOF2mRPlYAQJC0QGun7-ef6FI_vHN00",
  authDomain: "portafolio-6a269.firebaseapp.com",
  databaseURL: "https://portafolio-6a269.firebaseio.com",
  projectId: "portafolio-6a269",
  storageBucket: "portafolio-6a269.appspot.com",
  messagingSenderId: "285742052145",
  appId: "1:285742052145:web:b03227131ea98040"
};


export const firebaseApp = firebase.initializeApp(firebaseConfig);

export const auth = firebaseApp.auth();