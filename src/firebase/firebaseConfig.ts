// Ce fichier contient uniquement la configuration de Firebase,
// chargée à partir des variables d'environnement.
// C'est une bonne pratique pour séparer la configuration de l'initialisation.

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Vérification cruciale pour le débogage côté client (navigateur).
if (typeof window !== 'undefined') {
    if (!firebaseConfig.apiKey) {
        console.error(`
          ============================================================
          ERREUR CRITIQUE: Clé API Firebase non détectée !
          La variable NEXT_PUBLIC_FIREBASE_API_KEY est manquante ou vide.

          CAUSE POSSIBLE :
          Le serveur de développement n'a pas été redémarré après la modification
          du fichier .env.local.

          ACTION REQUISE :
          1. Arrêtez le serveur (Ctrl+C).
          2. Relancez-le avec "npm run dev".
          
          Pour la production : vérifiez que les secrets sont configurés sur
          votre plateforme d'hébergement (Firebase App Hosting, Vercel...).
          ============================================================
        `);
    } else {
         // Débogage pour confirmer que la clé est bien chargée.
         // Cette ligne peut être supprimée une fois le problème résolu.
        console.log("✅ Configuration Firebase chargée. Clé API détectée.");
    }
}


export default firebaseConfig;
