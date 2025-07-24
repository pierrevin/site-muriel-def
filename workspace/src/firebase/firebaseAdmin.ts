// src/firebase/firebaseAdmin.ts
import admin from 'firebase-admin';

// Ce fichier est destiné à une exécution côté serveur uniquement.

// Récupère les credentials depuis les variables d'environnement.
// C'est la manière sécurisée de le faire sur un serveur.
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : null;

// Vérifie si l'application Firebase Admin a déjà été initialisée
// pour éviter les erreurs, notamment lors du rechargement à chaud en développement.
if (!admin.apps.length) {
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    // Si les credentials ne sont pas disponibles (par exemple, dans un environnement local mal configuré),
    // on l'indique clairement dans les logs du serveur. L'app ne plantera pas.
    console.warn(
      'Firebase Admin SDK: Les credentials du compte de service sont manquants. ' +
      'Les fonctionnalités Firestore ne seront pas disponibles.'
    );
  }
}

// Initialise Firestore. Si l'initialisation a échoué, `db` sera `null`.
const db = admin.apps.length ? admin.firestore() : null;

// Exporte uniquement la base de données pour qu'elle soit utilisée par d'autres parties du serveur.
export { db };
