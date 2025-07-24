import fs from 'fs/promises';
import path from 'path';

// Force Next.js à ré-exécuter cette fonction à chaque requête,
// désactivant ainsi le cache de données qui empêchait la synchronisation
// dans l'aperçu de Firebase Studio.
export const dynamic = 'force-dynamic';

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

export async function getContent() {
  try {
    const fileContent = await fs.readFile(contentFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("CRITIQUE: Échec de la lecture du fichier local content.json. Utilisation du contenu par défaut.", error);
    return getDefaultContent();
  }
}
