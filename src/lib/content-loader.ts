
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { unstable_noStore as noStore } from 'next/cache';

// Le chemin vers le fichier de contenu local.
const CONTENT_FILE = 'src/data/content.json';

/**
 * Récupère les données du contenu en lisant directement le fichier JSON local.
 * C'est la seule source de vérité pour le contenu affiché sur le site.
 * Si le fichier n'existe pas, un contenu par défaut est retourné pour éviter un crash.
 */
export async function getContent() {
  // Garantit que le contenu est toujours lu depuis le fichier à chaque requête,
  // et non servi depuis un cache potentiellement obsolète.
  noStore();
  
  const filePath = path.join(process.cwd(), CONTENT_FILE);

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Erreur lors de la lecture du fichier de contenu (${filePath}). Le site utilisera les données par défaut.`, error);
    // Retourne un contenu par défaut robuste si la lecture du fichier échoue.
    return getDefaultContent();
  }
}

/**
 * Fournit une structure de contenu par défaut pour garantir que le site
 * peut toujours s'afficher même si le fichier content.json est manquant ou corrompu.
 */
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
