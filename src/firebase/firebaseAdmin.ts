// src/firebase/firebaseAdmin.ts
import admin from 'firebase-admin';

// Indicateur pour savoir si la configuration a été effectuée avec succès.
let isFirebaseAdminConfigured = false;
let db: admin.firestore.Firestore | null = null;

try {
  // S'il n'y a pas déjà d'applications initialisées...
  if (admin.apps.length === 0) {
    // Récupère la clé du compte de service depuis les variables d'environnement.
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    // Si la clé existe, on initialise l'application.
    if (serviceAccountKey) {
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(serviceAccountKey))
      });
      // L'initialisation a réussi, on peut maintenant accéder aux services.
      db = admin.firestore();
      isFirebaseAdminConfigured = true;
    } else {
      // Si la clé est manquante, on logue une erreur claire.
      console.error('Erreur: La variable d\'environnement FIREBASE_SERVICE_ACCOUNT_KEY est manquante.');
    }
  } else {
    // Si une application existe déjà, on récupère simplement l'instance.
    db = admin.firestore();
    isFirebaseAdminConfigured = true;
  }
} catch (error: any) {
  // En cas d'erreur pendant l'initialisation (ex: JSON mal formé), on logue l'erreur.
  console.error('Erreur critique lors de l\'initialisation du Firebase Admin SDK:', error.stack);
}

export { db, isFirebaseAdminConfigured };
