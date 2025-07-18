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

// Vérification cruciale pour le débogage.
// Si ce message apparaît dans la console du navigateur,
// cela signifie que les variables d'environnement ne sont pas chargées.
if (typeof window !== 'undefined' && !firebaseConfig.apiKey) {
    console.error(`
      ============================================================
      ERREUR CRITIQUE: Configuration Firebase incomplète.
      Les variables d'environnement (NEXT_PUBLIC_FIREBASE_...) ne sont pas
      accessibles par le navigateur.

      Actions à vérifier:
      1. Fichier .env.local: Existe-t-il à la racine ? Est-il correctement rempli ?
      2. Serveur de développement: Avez-vous redémarré le serveur ('npm run dev')
         après avoir créé ou modifié le fichier .env.local ?
      3. Déploiement: Avez-vous configuré les "secrets" dans les paramètres
         de votre backend sur Firebase App Hosting ? Avez-vous redéployé
         le site APRES avoir ajouté ces secrets ?
      ============================================================
    `);
}


export default firebaseConfig;
