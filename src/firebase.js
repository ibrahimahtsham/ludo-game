import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDkDZCtOcxYTurJG1Rdv2-9dHFUEgPAWlM",
  authDomain: "ludo-game-fdf34.firebaseapp.com",
  databaseURL:
    "https://ludo-game-fdf34-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ludo-game-fdf34",
  storageBucket: "ludo-game-fdf34.firebasestorage.app",
  messagingSenderId: "794946984908",
  appId: "1:794946984908:web:99f5376ca3b85cb0b71b69",
  measurementId: "G-SE8ZDC7DJP",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
