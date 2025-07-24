// src/firebase/firebaseAdmin.ts
import admin from 'firebase-admin';
import firebaseConfig from './firebaseConfig';

// Ce fichier est destiné à une exécution côté serveur uniquement.

// Initialisation robuste pour tous les environnements (local, Cloud Run, etc.)
if (!admin.apps.length) {
  try {
    // Utilise les Application Default Credentials (ADC) de Google Cloud,
    // qui est la méthode standard pour les environnements hébergés par Google.
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: firebaseConfig.projectId,
    });
    console.log("Firebase Admin SDK initialisé avec succès via Application Default Credentials.");
  } catch (e) {
    console.error('Erreur critique lors de l\'initialisation de Firebase Admin SDK:', e);
  }
}

// Initialise les services nécessaires.
// On vérifie que admin.apps.length > 0 avant d'essayer d'accéder aux services.
const db = admin.apps.length ? admin.firestore() : null;
const auth = admin.apps.length ? admin.auth() : null;

if (!db) {
    console.error("Échec de l'initialisation de Firestore (db). Les sauvegardes échoueront.");
}
if (!auth) {
    console.error("Échec de l'initialisation de Firebase Auth (auth). La validation des utilisateurs échouera.");
}

// Exporte les services pour qu'ils soient utilisés par d'autres parties du serveur.
export { admin, db, auth };
