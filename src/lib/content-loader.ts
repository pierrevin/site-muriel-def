import { db } from '@/firebase/firebaseAdmin';
import { unstable_noStore as noStore } from 'next/cache';
import initialContent from '@/data/content.json';

const FIRESTORE_DOC_ID = 'main';
const FIRESTORE_COLLECTION = 'content';

// Structure par défaut robuste pour éviter les crashs si des champs sont manquants.
const getDefaultContent = () => JSON.parse(JSON.stringify(initialContent));


export async function getContent() {
  noStore();

  const defaults = getDefaultContent();

  if (!db) {
    console.error("CRITICAL: Firestore connection failed. Returning initial file content.");
    // Retourne le contenu du fichier JSON si la base de données est indisponible.
    return defaults;
  }

  try {
    const docRef = db.collection(FIRESTORE_COLLECTION).doc(FIRESTORE_DOC_ID);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const firestoreData = docSnap.data();
      // Fusionne les données de Firestore avec les données par défaut.
      // Cela garantit que si un champ de premier niveau (ex: "creations") est manquant
      // dans Firestore, la structure par défaut est utilisée, évitant un crash.
      return {
        ...defaults,
        ...firestoreData,
      };
    } else {
      console.warn(`Document '${FIRESTORE_DOC_ID}' not found in collection '${FIRESTORE_COLLECTION}'. Populating with initial data from content.json.`);
      // Si le document n'existe pas du tout, on le crée avec le contenu complet du fichier.
      await docRef.set(defaults);
      return defaults;
    }
  } catch (error) {
    console.error("Critical error accessing Firestore. Returning initial file content.", error);
    return defaults;
  }
}
