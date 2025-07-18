// Ce fichier initialise les services Firebase pour une utilisation
// côté client (dans le navigateur).

import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import firebaseConfig from "./firebaseConfig";

// Initialise Firebase de manière sécurisée (idempotente).
// Cela empêche l'initialisation de se produire plusieurs fois.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Exporte les services Firebase dont l'application a besoin.
const auth = getAuth(app);
const storage = getStorage(app);

export { app, auth, storage };
