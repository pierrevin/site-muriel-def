import fs from 'fs/promises';
import path from 'path';
import { db } from '@/firebase/firebaseAdmin';
import { revalidatePath } from 'next/cache';
import { unstable_noStore as noStore } from 'next/cache';


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
  noStore();

  if (!db) {
    console.error("CRITIQUE : La connexion à Firestore a échoué. Impossible de récupérer le contenu du site.");
    // En dernier recours absolu, on retourne un contenu vide pour éviter un crash complet.
    return getDefaultContent();
  }

  try {
    const docRef = db.collection(FIRESTORE_COLLECTION).doc(FIRESTORE_DOC_ID);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      // Le document existe, on retourne ses données. C'est le cas nominal.
      return docSnap.data();
    } else {
      // Le document n'existe pas. C'est probablement le premier lancement.
      // On le crée à partir du fichier local `content.json`.
      console.log("Document Firestore non trouvé. Lancement de la migration initiale depuis content.json...");
      
      try {
        const localContent = await readLocalContent();
        await docRef.set(localContent);
        console.log("Migration vers Firestore réussie. Le contenu initial a été sauvegardé.");
        revalidatePath('/'); // On s'assure que la page d'accueil est rafraîchie avec les bonnes données.
        return localContent;
      } catch (migrationError) {
          console.error("ERREUR CRITIQUE lors de la migration du contenu local vers Firestore.", migrationError);
          return getDefaultContent();
      }
    }
  } catch (error) {
    console.error("Erreur critique lors de l'accès à Firestore. Impossible de charger le contenu.", error);
    return getDefaultContent();
  }
}

// Fonction helper pour lire le fichier local, utilisée uniquement pour la migration.
async function readLocalContent() {
    try {
        const fileContent = await fs.readFile(contentFilePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (fileError) {
        console.error("CRITIQUE: Échec de la lecture du fichier local content.json pour la migration.", fileError);
        // Si la lecture du fichier échoue, on renvoie le contenu par défaut pour la migration.
        return getDefaultContent();
    }
}
