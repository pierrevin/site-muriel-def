
// Ce fichier initialise les services Firebase pour une utilisation
// côté client (dans le navigateur).

import { initializeApp, getApp, getApps } from "firebase/app";
import firebaseConfig from "./firebaseConfig";
import { getStorage } from "firebase/storage";

// Initialise Firebase de manière sécurisée (idempotente).
// Cela empêche l'initialisation de se produire plusieurs fois.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Exporte uniquement les services nécessaires.
const storage = getStorage(app);

export { app, storage };
