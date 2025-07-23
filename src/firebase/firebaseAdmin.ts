// src/firebase/firebaseAdmin.ts
import admin from 'firebase-admin';

let isFirebaseAdminConfigured = false;
let db: admin.firestore.Firestore | null = null;

try {
  // Vérifie si une app Firebase a déjà été initialisée
  if (admin.apps.length === 0) {
    // Récupération sécurisée des credentials depuis les variables d'environnement
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (serviceAccountKey) {
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(serviceAccountKey))
      });
      isFirebaseAdminConfigured = true;
      console.log('Firebase Admin SDK initialisé avec succès.');
    } else {
      console.warn("Variable d'environnement FIREBASE_SERVICE_ACCOUNT_KEY manquante. Le SDK Admin n'est pas initialisé.");
    }
  } else {
    // Si une app existe déjà, on considère que la config est bonne.
    isFirebaseAdminConfigured = true;
    console.log('Une instance de Firebase Admin SDK existait déjà.');
  }
} catch (error: any) {
  console.error('Erreur critique lors de l\'initialisation du Firebase Admin SDK:', error.stack);
}

// On assigne l'instance de la base de données uniquement si l'initialisation a réussi.
if (isFirebaseAdminConfigured) {
  db = admin.firestore();
}

export { db, isFirebaseAdminConfigured };
