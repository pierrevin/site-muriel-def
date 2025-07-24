
'use server';

import { unstable_noStore as noStore } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';

// Le chemin vers le fichier de contenu.
const contentFilePath = path.join(process.cwd(), 'src', 'data', 'content.json');

/**
 * Récupère les données du contenu depuis le fichier `content.json`.
 * Si le fichier n'existe pas ou s'il y a une erreur, un contenu par défaut est retourné
 * pour éviter que le site ne plante.
 */
export async function getContent() {
  // Indique à Next.js de ne jamais mettre en cache le résultat de cette fonction.
  // C'est crucial pour que les changements dans l'admin soient visibles immédiatement.
  noStore();
  
  try {
    const fileContent = await fs.readFile(contentFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Erreur critique: Impossible de lire `content.json`. Le site utilisera les données par défaut.", error);
    // Retourne un contenu par défaut robuste si le fichier est manquant ou corrompu.
    // Cela permet au site de continuer à fonctionner.
    return {
      general: {
        logoUrl: '/logo-placeholder.png',
      },
      hero: {
        title: 'Titre par défaut',
        subtitle: 'Sous-titre par défaut',
        imageUrl: 'https://placehold.co/1920x1080.png',
      },
      features: {
        title: 'Engagements par défaut',
        subtitle: 'Sous-titre par défaut',
        items: [],
      },
      about: {
        title: 'À propos par défaut',
        paragraph1: 'Paragraphe 1 par défaut.',
        paragraph2: 'Paragraphe 2 par défaut.',
        paragraph3: 'Paragraphe 3 par défaut.',
        imageUrl: 'https://placehold.co/800x1000.png',
      },
      creations: {
        title: 'Créations par défaut',
        subtitle: 'Sous-titre par défaut',
        items: [],
        categories: [],
      },
      testimonials: {
        title: 'Témoignages par défaut',
        items: [],
      },
      contact: {
        title: 'Contact par défaut',
        subtitle: 'Sous-titre par défaut',
        detailsTitle: 'Détails par défaut',
        formTitle: 'Formulaire par défaut',
        details: {
          phone: 'N/A',
          address: 'N/A',
        },
      },
    };
  }
}
