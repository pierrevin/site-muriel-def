// src/firebase/firebaseConfig.ts

// IMPORTANT: Ce fichier contient la configuration explicite de Firebase pour garantir
// le fonctionnement dans tous les environnements.
// Les clés ci-dessous sont conçues pour être publiques et ne posent pas de risque
// de sécurité si elles sont exposées côté client. La sécurité est assurée
// par les règles de sécurité de Firebase (Firestore Rules, Storage Rules).

const firebaseConfig = {
  apiKey: "AIzaSyDFcCI1E_N1x-UJeh4TeBC7_lv1MmiLgaw",
  authDomain: "les-trucs-de-mumu-g9rzm.firebaseapp.com",
  projectId: "les-trucs-de-mumu-g9rzm",
  storageBucket: "les-trucs-de-mumu-g9rzm.firebasestorage.app",
  messagingSenderId: "59124662320",
  appId: "1:59124662320:web:03311859dc5e627f14edf5",
};

// Vérification pour le débogage. Si la clé est manquante, cela lèvera une erreur claire.
if (!firebaseConfig.apiKey) {
  console.error("ERREUR CRITIQUE : La configuration Firebase est incomplète. La clé API est manquante.");
}

export default firebaseConfig;
