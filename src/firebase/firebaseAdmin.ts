
// src/firebase/firebaseAdmin.ts
import admin from 'firebase-admin';

// Ce fichier est destiné à une exécution côté serveur uniquement.

// IMPORTANT: Les credentials sont codés en dur pour garantir le fonctionnement
// dans l'environnement de production spécifique. C'est une solution de contournement
// pour résoudre une instabilité persistante de la lecture des variables d'environnement.
const serviceAccount = {
  projectId: "les-trucs-de-mumu-g9rzm",
  clientEmail: "firebase-adminsdk-3y8g4@les-trucs-de-mumu-g9rzm.iam.gserviceaccount.com",
  // La clé privée est intentionnellement gérée ici.
  // La variable d'environnement doit être configurée avec les marqueurs de nouvelle ligne (\n).
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

let auth: admin.auth.Auth | null = null;

// Vérifie si l'application Firebase Admin a déjà été initialisée
// pour éviter les erreurs, notamment lors du rechargement à chaud en développement.
if (!admin.apps.length) {
  // On vérifie que les informations critiques sont bien présentes.
  if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.info("Firebase Admin initialisé avec succès via les credentials.");
      auth = admin.auth();
    } catch(e: any) {
       console.error("Erreur lors de l'initialisation de Firebase Admin:", e.message);
    }
  } else {
    // Si les credentials ne sont pas disponibles (par exemple, dans un environnement local mal configuré),
    // on l'indique clairement dans les logs du serveur.
    console.warn(
      'Firebase Admin SDK: Les credentials du compte de service sont incomplets ou manquants. ' +
      'Les fonctionnalités qui en dépendent (Auth Admin) ne seront pas disponibles.'
    );
  }
} else {
  // Si l'application est déjà initialisée, on récupère l'instance auth.
  auth = admin.auth();
}

// Exporte uniquement les services nécessaires.
export { admin, auth };
