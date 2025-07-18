
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// ====================================================================================
// Configuration Firebase
// ====================================================================================

// La configuration est directement intégrée ici pour garantir qu'elle est
// correctement chargée et utilisée par l'application.

const firebaseConfig = {
  apiKey: "AIzaSyDFCCI1E_N1x-UJeh4TeBC7_lv1MmiLgaw",
  authDomain: "les-trucs-de-mumu-g9rzm.firebaseapp.com",
  projectId: "les-trucs-de-mumu-g9rzm",
  storageBucket: "les-trucs-de-mumu-g9rzm.appspot.com",
  messagingSenderId: "59124662320",
  appId: "1:59124662320:web:d25a2e57c66935b0b2e2d9"
};


// Initialiser Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const storage = getStorage(app);
