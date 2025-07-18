// Ce fichier initialise les services Firebase pour une utilisation
// côté client (dans le navigateur).

import { initializeApp, getApp, getApps } from "firebase/app";
import firebaseConfig from "./firebaseConfig";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Initialise Firebase de manière sécurisée (idempotente).
// Cela empêche l'initialisation de se produire plusieurs fois.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Exporte uniquement l'instance de l'application.
// Les services (auth, storage) seront obtenus à la demande dans les composants.
const auth = getAuth(app);
const storage = getStorage(app);

export { app, auth, storage };