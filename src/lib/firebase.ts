
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

// Vérification que toutes les variables sont bien présentes COTE CLIENT
// Cette vérification est cruciale pour le débogage en production.
if (typeof window !== 'undefined' && !firebaseConfig.apiKey) {
    console.error(`
      ============================================================
      ERREUR CRITIQUE: Configuration Firebase incomplète.
      La variable NEXT_PUBLIC_FIREBASE_API_KEY n'est pas définie.

      Actions possibles:
      1. Localement: Avez-vous un fichier .env.local avec les bonnes clés ?
         Avez-vous redémarré le serveur ('npm run dev') après modification ?
      2. En Production (Firebase App Hosting): Avez-vous ajouté les
         variables secrètes dans les paramètres de votre backend ?
         Avez-vous redéployé votre site APRES avoir ajouté les secrets ?
      ============================================================
    `);
}


// Initialiser Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const storage = getStorage(app);
