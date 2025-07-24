// src/firebase/firebaseAdmin.ts
import admin from 'firebase-admin';
import firebaseConfig from './firebaseConfig';

// Ce fichier est destiné à une exécution côté serveur uniquement.

// Initialisation robuste pour tous les environnements (local, Cloud Run, App Hosting, etc.)
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      // Utilise les Application Default Credentials (ADC) de Google Cloud,
      // ou le fichier de credentials si la variable d'environnement GOOGLE_APPLICATION_CREDENTIALS est définie.
      credential: admin.credential.applicationDefault(),
      projectId: firebaseConfig.projectId
    });
    console.info('Firebase Admin initialisé avec succès.');
  } catch (e) {
    console.error('Erreur lors de l\'initialisation de Firebase Admin:', e);
  }
}

// Initialise les services nécessaires.
const db = admin.apps.length ? admin.firestore() : null;
const auth = admin.apps.length ? admin.auth() : null;

// Exporte les services pour qu'ils soient utilisés par d'autres parties du serveur.
export { admin, db, auth };
