// src/firebase/firebaseAdmin.ts
import admin from 'firebase-admin';

let isFirebaseAdminConfigured = false;
let db: admin.firestore.Firestore | null = null;

try {
  if (admin.apps.length === 0) {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (serviceAccountKey) {
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(serviceAccountKey))
      });
      db = admin.firestore();
      isFirebaseAdminConfigured = true;
    }
  } else {
    db = admin.firestore();
    isFirebaseAdminConfigured = true;
  }
} catch (error: any) {
  console.error('Erreur critique lors de l\'initialisation du Firebase Admin SDK:', error.stack);
}

export { db, isFirebaseAdminConfigured };
