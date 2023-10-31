import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const app = initializeApp({
    apiKey: "AIzaSyD6xmcRawzfBM4iBb3Zz9FwP3BYEc6jxdc",
    authDomain: "badmintonelo.firebaseapp.com",
    projectId: "badmintonelo",
    storageBucket: "badmintonelo.appspot.com",
    messagingSenderId: "330195930910",
    appId: "1:330195930910:web:e3e6da3b0a55aeb4fb830f",
});

export const auth = getAuth(app);
export const firestore = getFirestore(app);