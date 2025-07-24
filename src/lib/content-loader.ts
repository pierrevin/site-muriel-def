
'use server';

import { unstable_noStore as noStore } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';
import { db } from '@/firebase/firebaseAdmin';

// Chemin vers le fichier JSON local, utilisé pour la migration et comme fallback.
const contentFilePath = path.join(process.cwd(), 'src', 'data', 'content.json');

// Structure de données par défaut pour éviter les crashs si tout échoue.
const getDefaultContent = () => ({
  general: { logoUrl: '/logo-placeholder.png' },
  hero: { title: 'Titre par défaut', subtitle: 'Sous-titre', imageUrl: 'https://placehold.co/1920x1080.png' },
  features: { title: 'Engagements', subtitle: 'Description', items: [] },
  about: { title: 'À propos', paragraph1: 'Paragraphe 1', paragraph2: 'Paragraphe 2', paragraph3: 'Paragraphe 3', imageUrl: 'https://placehold.co/800x1000.png' },
  creations: { title: 'Créations', subtitle: 'Description', items: [], categories: [] },
  testimonials: { title: 'Témoignages', items: [] },
  contact: { title: 'Contact', subtitle: 'Description', detailsTitle: 'Coordonnées', formTitle: 'Formulaire', details: { phone: 'N/A', address: 'N/A' } },
});


/**
 * Récupère le contenu du site.
 * Stratégie :
 * 1. Tente de lire le contenu depuis le document 'site' dans la collection 'content' de Firestore.
 * 2. Si le document n'existe pas sur Firestore (première exécution), il lit le content.json local,
 *    le sauvegarde sur Firestore pour l'avenir, puis le renvoie. (Migration automatique)
 * 3. Si la connexion à Firestore échoue, il se rabat sur la lecture du content.json local.
 * 4. Si la lecture du fichier local échoue aussi, il renvoie un contenu par défaut.
 */
export async function getContent() {
  // Indique à Next.js de ne jamais mettre en cache le résultat de cette fonction.
  noStore();

  if (db) {
    const contentDocRef = db.collection('content').doc('site');
    try {
      const doc = await contentDocRef.get();

      if (doc.exists) {
        // Cas idéal : le document existe sur Firestore, on le renvoie.
        console.log('Contenu chargé depuis Firestore.');
        return doc.data();
      } else {
        // Cas de migration : le document n'existe pas sur Firestore.
        console.warn('Document non trouvé sur Firestore. Tentative de migration depuis content.json local...');
        try {
          const localContent = JSON.parse(await fs.readFile(contentFilePath, 'utf-8'));
          // On écrit le contenu local sur Firestore pour les prochaines lectures.
          await contentDocRef.set(localContent);
          console.log('Migration réussie. Le contenu de content.json a été sauvegardé sur Firestore.');
          return localContent;
        } catch (fileError) {
          console.error("Échec de la migration : le fichier content.json local est introuvable ou corrompu.", fileError);
          // Si la migration échoue, on crée un document par défaut sur Firestore pour éviter les futures tentatives.
          const defaultContent = getDefaultContent();
          await contentDocRef.set(defaultContent);
          return defaultContent;
        }
      }
    } catch (error) {
      console.error("Erreur de connexion à Firestore. Le contenu sera chargé depuis le fichier local de secours.", error);
      // Fallback vers le fichier local si Firestore n'est pas accessible.
    }
  } else {
     console.warn("La connexion à Firestore n'est pas configurée. Le contenu sera chargé depuis le fichier local.");
  }
  
  // Fallback final : lecture du fichier local si Firestore a échoué ou n'est pas configuré.
  try {
    const fileContent = await fs.readFile(contentFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("CRITIQUE: Échec de la lecture du fichier local content.json. Utilisation du contenu par défaut.", error);
    return getDefaultContent();
  }
}
