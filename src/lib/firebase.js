import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCUKxRDHG2fKTckFHB8Y6g6d4Fnrnb9oxI",
  authDomain: "nexchat-c6c51.firebaseapp.com",
  projectId: "nexchat-c6c51",
  storageBucket: "nexchat-c6c51.appspot.com",
  messagingSenderId: "205592496326",
  appId: "1:205592496326:web:d98564bf47ba8b533eefc7",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
