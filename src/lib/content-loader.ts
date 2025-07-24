import { db } from '@/firebase/firebaseAdmin';
import { unstable_noStore as noStore } from 'next/cache';

const FIRESTORE_DOC_ID = 'main';
const FIRESTORE_COLLECTION = 'content';

const getDefaultContent = () => ({
  general: { logoUrl: '/logo-placeholder.png' },
  hero: { title: 'Titre par défaut', subtitle: 'Sous-titre', imageUrl: 'https://placehold.co/1920x1080.png' },
  features: { title: 'Engagements', subtitle: 'Description', items: [] },
  about: { title: 'À propos', paragraph1: 'Paragraphe 1', paragraph2: 'Paragraphe 2', paragraph3: 'Paragraphe 3', imageUrl: 'https://placehold.co/800x1000.png' },
  creations: { title: 'Créations', subtitle: 'Description', items: [], categories: [] },
  testimonials: { title: 'Témoignages', items: [] },
  contact: { title: 'Contact', subtitle: 'Description', detailsTitle: 'Coordonnées', formTitle: 'Formulaire', details: { phone: 'N/A', address: 'N/A' } },
});


export async function getContent() {
  // Garantit que les données ne sont jamais mises en cache de manière agressive
  noStore();

  if (!db) {
    console.error("CRITIQUE : La connexion à Firestore a échoué. Le contenu par défaut sera retourné.");
    return getDefaultContent();
  }

  try {
    const docRef = db.collection(FIRESTORE_COLLECTION).doc(FIRESTORE_DOC_ID);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      // Le cas nominal : le document existe, on retourne ses données.
      return docSnap.data();
    } else {
      // Le document n'a pas été trouvé. Cela signifie que la migration manuelle n'a pas été faite.
      // On retourne un contenu par défaut pour éviter de crasher le site.
      console.warn(`Le document 'main' n'a pas été trouvé dans la collection 'content'. Veuillez l'importer manuellement dans Firestore.`);
      return getDefaultContent();
    }
  } catch (error) {
    console.error("Erreur critique lors de l'accès à Firestore. Impossible de charger le contenu.", error);
    return getDefaultContent();
  }
}
