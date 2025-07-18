
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// ====================================================================================
// Configuration Firebase sécurisée avec des variables d'environnement
// ====================================================================================
// Les clés sont chargées depuis les variables d'environnement.
// Pour être accessibles côté client, elles doivent être préfixées par NEXT_PUBLIC_.

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Vérification que toutes les variables sont bien présentes
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain) {
    console.error("Les variables d'environnement Firebase (NEXT_PUBLIC_*) ne sont pas correctement configurées.");
}


// Initialiser Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const storage = getStorage(app);
