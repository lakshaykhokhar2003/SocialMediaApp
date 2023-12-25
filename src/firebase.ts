// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBw_2es1mZ1iBCl4-6aquID-fhMYYWP718",
    authDomain: "algo-bulls-firestore.firebaseapp.com",
    projectId: "algo-bulls-firestore",
    storageBucket: "algo-bulls-firestore.appspot.com",
    messagingSenderId: "529723697425",
    appId: "1:529723697425:web:fae1874db23a0902d7c4b0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default getFirestore();