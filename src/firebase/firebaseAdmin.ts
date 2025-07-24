// src/firebase/firebaseAdmin.ts
import admin from 'firebase-admin';

// Ce fichier est destiné à une exécution côté serveur uniquement.

// Cette approche est la plus robuste pour les environnements gérés par Google
// (comme App Hosting, Cloud Run, etc.) et pour le développement local.
// Le SDK essaiera de trouver les credentials automatiquement.
if (!admin.apps.length) {
  admin.initializeApp();
}

// Initialise les services nécessaires.
const db = admin.firestore();
const auth = admin.auth();

// Exporte les services pour qu'ils soient utilisés par d'autres parties du serveur.
export { db, auth };
