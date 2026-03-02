import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCl3iLi07ZCsqb-U49L29NFr2bFHksoE2c",
  authDomain: "metamorphosen.firebaseapp.com",
  projectId: "metamorphosen",
  storageBucket: "metamorphosen.firebasestorage.app",
  messagingSenderId: "831786560271",
  appId: "1:831786560271:web:209cdf84f2d0f13edd2c7a",
  measurementId: "G-SG6HZPCJXT"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
