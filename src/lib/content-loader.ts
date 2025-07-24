import fs from 'fs/promises';
import path from 'path';
import { db } from '@/firebase/firebaseAdmin';
import { revalidatePath } from 'next/cache';

const contentFilePath = path.join(process.cwd(), 'src', 'data', 'content.json');

const getDefaultContent = () => ({
  general: { logoUrl: '/logo-placeholder.png' },
  hero: { title: 'Titre par défaut', subtitle: 'Sous-titre', imageUrl: 'https://placehold.co/1920x1080.png' },
  features: { title: 'Engagements', subtitle: 'Description', items: [] },
  about: { title: 'À propos', paragraph1: 'Paragraphe 1', paragraph2: 'Paragraphe 2', paragraph3: 'Paragraphe 3', imageUrl: 'https://placehold.co/800x1000.png' },
  creations: { title: 'Créations', subtitle: 'Description', items: [], categories: [] },
  testimonials: { title: 'Témoignages', items: [] },
  contact: { title: 'Contact', subtitle: 'Description', detailsTitle: 'Coordonnées', formTitle: 'Formulaire', details: { phone: 'N/A', address: 'N/A' } },
});

// Le nom du document unique dans la collection 'content'
const FIRESTORE_DOC_ID = 'main';
const FIRESTORE_COLLECTION = 'content';

export async function getContent() {
  // En mode développement, on force la revalidation pour voir les changements
  if (process.env.NODE_ENV === 'development') {
    revalidatePath('/');
  }

  if (!db) {
    console.warn("Firestore n'est pas initialisé. Lecture depuis le fichier local.");
    return readLocalContent();
  }

  try {
    const docRef = db.collection(FIRESTORE_COLLECTION).doc(FIRESTORE_DOC_ID);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      // Le document existe, on retourne ses données
      return docSnap.data();
    } else {
      // Le document n'existe pas. On le crée à partir du fichier local.
      console.log("Document Firestore non trouvé. Tentative de migration depuis content.json...");
      const localContent = await readLocalContent();
      await docRef.set(localContent);
      console.log("Migration vers Firestore réussie. Le contenu a été sauvegardé.");
      return localContent;
    }
  } catch (error) {
    console.error("Erreur critique lors de l'accès à Firestore. Lecture du fichier local de secours.", error);
    return readLocalContent();
  }
}

// Fonction helper pour lire le fichier local
async function readLocalContent() {
    try {
        const fileContent = await fs.readFile(contentFilePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (fileError) {
        console.error("CRITIQUE: Échec de la lecture du fichier local content.json. Utilisation du contenu par défaut.", fileError);
        return getDefaultContent();
    }
}
