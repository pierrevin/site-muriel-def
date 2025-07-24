
// src/firebase/firebaseAdmin.ts
import admin from 'firebase-admin';

// Ce fichier est destiné à une exécution côté serveur uniquement.

// Récupère les credentials depuis les variables d'environnement.
// C'est la manière sécurisée de le faire sur un serveur.
const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;
let serviceAccount;

if (serviceAccountString) {
  try {
    serviceAccount = JSON.parse(serviceAccountString);
  } catch (e) {
    console.error('FIREBASE_SERVICE_ACCOUNT: Failed to parse service account JSON.', e);
  }
}

// Vérifie si l'application Firebase Admin a déjà été initialisée
// pour éviter les erreurs, notamment lors du rechargement à chaud en développement.
if (!admin.apps.length) {
  if (serviceAccount) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.info("Firebase Admin initialisé avec succès via la variable d'environnement.");
    } catch(e) {
       console.error("Erreur lors de l'initialisation de Firebase Admin avec le service account:", e);
    }
  } else {
    // Si les credentials ne sont pas disponibles (par exemple, dans un environnement local mal configuré),
    // on l'indique clairement dans les logs du serveur. L'app ne plantera pas.
    console.warn(
      'Firebase Admin SDK: Les credentials du compte de service sont manquants. ' +
      'Les fonctionnalités qui en dépendent (Auth Admin) ne seront pas disponibles.'
    );
  }
}

// Initialise les services nécessaires.
const db = null; // La base de données n'est plus utilisée pour le contenu.
const auth = admin.apps.length ? admin.auth() : null;

// Exporte les services pour qu'ils soient utilisés par d'autres parties du serveur.
export { admin, db, auth };
