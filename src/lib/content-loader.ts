
// Ce fichier centralise la logique de récupération du contenu du site
// pour assurer une source de données unique et une revalidation cohérente.
'use server';

import { promises as fs } from 'fs';
import path from 'path';

// L'utilisation de 'unstable_noStore' est une mesure forte pour s'assurer
// que les données sont toujours lues depuis le fichier, contournant les caches
// de Next.js qui pourraient causer des incohérences.
import { unstable_noStore as noStore } from 'next/cache';

const defaultContent = {
  general: { logoUrl: '' },
  hero: { title: 'Les Trucs de Mumu', subtitle: 'Créations artisanales', imageUrl: 'https://placehold.co/1920x1080.png' },
  features: { title: 'Mes engagements', subtitle: 'La promesse d\'un art authentique', items: Array(3).fill({ title: 'Titre', description: 'Description' }) },
  about: { title: 'À propos', paragraph1: '', paragraph2: '', paragraph3: '', imageUrl: 'https://placehold.co/800x1000.png' },
  creations: { title: 'Mes créations', subtitle: 'Un aperçu de mon univers', categories: [], items: [] },
  testimonials: { title: 'Témoignages', items: [] },
  contact: { 
    title: 'Parlons de votre projet', 
    subtitle: 'Une question, une idée ? Contactez-moi.',
    detailsTitle: 'Mes coordonnées',
    formTitle: 'Formulaire de contact',
    details: { phone: '', address: '' }
  },
};

export async function getContent() {
  // Dit explicitement à Next.js de ne pas mettre en cache le résultat de cette fonction.
  noStore();
  try {
    const contentPath = path.join(process.cwd(), 'src', 'data', 'content.json');
    const fileContent = await fs.readFile(contentPath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Échec de la lecture du fichier de contenu, renvoi de la structure par défaut.", error);
    return defaultContent;
  }
}
