
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { unstable_noStore as noStore } from 'next/cache';

// Nom du fichier de contenu
const CONTENT_FILE = 'src/data/content.json';

/**
 * Récupère les données du contenu depuis le fichier JSON local.
 * Si le fichier n'existe pas ou s'il y a une erreur, un contenu par défaut est retourné
 * pour éviter que le site ne plante.
 */
export async function getContent() {
  // Garantit que le contenu est toujours frais à chaque requête.
  noStore();
  
  const filePath = path.join(process.cwd(), CONTENT_FILE);

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Erreur lors de la lecture du fichier de contenu (${filePath}). Le site utilisera les données par défaut.`, error);
    // Retourne un contenu par défaut robuste si la lecture échoue.
    return getDefaultContent();
  }
}

function getDefaultContent() {
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
        text: 'Texte de présentation par défaut.',
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
