import { db } from '@/firebase/firebaseAdmin';
import { unstable_noStore as noStore } from 'next/cache';
import initialContent from '@/data/content.json';

const FIRESTORE_DOC_ID = 'main';
const FIRESTORE_COLLECTION = 'content';

const getDefaultContent = () => ({
  general: { logoUrl: '/logo-placeholder.png' },
  hero: { title: 'Titre par défaut', subtitle: 'Sous-titre', imageUrl: 'https://placehold.co/1920x1080.png' },
  features: { title: 'Engagements', subtitle: 'Description', items: [] },
  about: { title: 'À propos', text: 'Texte de présentation.', imageUrl: 'https://placehold.co/800x1000.png' },
  creations: { title: 'Créations', subtitle: 'Description', items: [], categories: [] },
  testimonials: { title: 'Témoignages', items: [] },
  contact: { title: 'Contact', subtitle: 'Description', detailsTitle: 'Coordonnées', formTitle: 'Formulaire', details: { phone: 'N/A', address: 'N/A' } },
});


export async function getContent() {
  noStore();

  if (!db) {
    console.error("CRITICAL: Firestore connection failed. Returning default content.");
    return getDefaultContent();
  }

  try {
    const docRef = db.collection(FIRESTORE_COLLECTION).doc(FIRESTORE_DOC_ID);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      return docSnap.data();
    } else {
      console.warn(`Document 'main' not found in collection 'content'. Populating with initial data from content.json.`);
      await docRef.set(initialContent);
      return initialContent;
    }
  } catch (error) {
    console.error("Critical error accessing Firestore. Returning default content.", error);
    return getDefaultContent();
  }
}
