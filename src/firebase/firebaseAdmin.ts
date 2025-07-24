
// src/firebase/firebaseAdmin.ts
import admin from 'firebase-admin';
import firebaseConfig from './firebaseConfig';

// Ce fichier est destiné à une exécution côté serveur uniquement.

// Cette approche est la plus robuste pour les environnements gérés par Google
// (comme App Hosting, Cloud Run, etc.) et pour le développement local.
// Le SDK essaiera de trouver les credentials automatiquement via les "Application Default Credentials".
if (!admin.apps.length) {
  try {
    // Utiliser le projectId de la configuration client garantit que le serveur sait à quel projet se connecter.
    admin.initializeApp({
        projectId: firebaseConfig.projectId
    });
    console.log("Firebase Admin SDK initialisé avec succès.");
  } catch (e) {
     console.error('Erreur critique lors de l\'initialisation de Firebase Admin SDK:', e);
  }
}

// Initialise les services nécessaires.
// On vérifie que admin.apps.length > 0 avant d'essayer d'accéder aux services.
const db = admin.apps.length ? admin.firestore() : null;
const auth = admin.apps.length ? admin.auth() : null;

if (!db || !auth) {
    console.error("Échec de l'initialisation des services Firebase (db ou auth). Les fonctionnalités serveur seront compromises.");
}

// Exporte les services pour qu'ils soient utilisés par d'autres parties du serveur.
export { admin, db, auth };
