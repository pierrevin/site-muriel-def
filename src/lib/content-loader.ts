
'use server';

import { unstable_noStore as noStore } from 'next/cache';
import { db, isFirebaseAdminConfigured } from '@/firebase/firebaseAdmin';
import fs from 'fs/promises';
import path from 'path';

const defaultContent = {
  general: {
    logoUrl: 'https://firebasestorage.googleapis.com/v0/b/les-trucs-de-mumu-g9rzm.firebasestorage.app/o/uploads%2FJmt1vFlq3UeVzjvpiTwBJ56dWu93%2F1752737122228-Logo_LTDM_V2%20jaune.png?alt=media&token=52cf14b4-f786-4f90-a790-39458b13f8ff',
  },
  hero: {
    title: 'Les Trucs de Mumu',
    subtitle: 'Créations artisanales uniques en métal et vitrail',
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/les-trucs-de-mumu-g9rzm.firebasestorage.app/o/uploads%2F1752737222340-atelier-mumu.jpg?alt=media&token=8777197a-c32f-488b-a675-9e6e4a29a59b',
  },
  features: {
    title: 'Mes engagements d\'artisane',
    subtitle: 'La promesse d\'un art authentique, local et durable',
    items: [
      {
        title: 'Pièces Uniques & Signées',
        description: 'Chaque création est le fruit d\'une inspiration spontanée. Je conçois et réalise chaque pièce à la main, garantissant une œuvre que vous ne retrouverez nulle part ailleurs.',
      },
      {
        title: 'Artisanat Local',
        description: 'Installée à Olonzac, au cœur de l\'Aude, mon atelier est un espace de création ancré dans le territoire. Je privilégie les matériaux et les savoir-faire locaux.',
      },
      {
        title: 'Création Sur-Mesure',
        description: 'Votre intérieur est unique, vos envies aussi. Je suis à votre écoute pour concevoir avec vous la pièce qui s\'intégrera parfaitement à votre univers et racontera votre histoire.',
      },
    ],
  },
  about: {
    title: 'L\'art du métal, la magie du verre',
    paragraph1: 'Je suis Muriel Fauthoux, artisan créatrice passionnée par la transformation de la matière brute en objets d\'art qui captent la lumière et racontent une histoire. Mon univers est fait de métal sculpté, de vitrail coloré et de curiosité sans cesse renouvelée.',
    paragraph2: 'Chaque pièce qui naît dans mon atelier est le fruit d\'un dialogue entre le métal, que je tords, soude et façonne, et le verre, que je choisis pour ses couleurs et ses textures uniques. Luminaires, sculptures, objets décoratifs... mes créations sont des invitations à voir le monde autrement.',
    paragraph3: 'Plus qu\'une simple décoration, je cherche à créer des émotions, des atmosphères. Une lumière qui danse sur un mur, une sculpture qui dialogue avec votre espace... C\'est cette petite étincelle de magie que je souhaite apporter dans votre quotidien.',
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/les-trucs-de-mumu-g9rzm.firebasestorage.app/o/uploads%2F1752737237943-mumu-portrait.jpg?alt=media&token=b7189178-5a4e-4f36-9a25-a1c2269a8459',
  },
  creations: {
    title: 'Mes créations',
    subtitle: 'Explorez un univers où la matière brute rencontre la poésie de la lumière. Chaque pièce est unique, faite à la main dans mon atelier.',
    items: [
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/les-trucs-de-mumu-g9rzm.firebasestorage.app/o/uploads%2F1752737299065-lampe-poisson.jpg?alt=media&token=c426e849-c1f5-46f1-a1bf-4f056d3e3810',
        title: 'Lampe Poisson',
        description: 'Vitrail et métal soudé',
        category: 'Luminaire',
      },
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/les-trucs-de-mumu-g9rzm.firebasestorage.app/o/uploads%2F1752737311103-sculpture-femme.jpg?alt=media&token=c2d5e5c7-e851-4089-9e8c-55c3289052d9',
        title: 'La Penseuse',
        description: 'Sculpture en métal',
        category: 'Sculpture',
      },
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/les-trucs-de-mumu-g9rzm.firebasestorage.app/o/uploads%2F1752737320509-lampe-fleur.jpg?alt=media&token=c06631b5-1250-4d56-b072-273a0e6371a3',
        title: 'Fleur de Lumière',
        description: 'Lampe d\'ambiance',
        category: 'Luminaire',
      },
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/les-trucs-de-mumu-g9rzm.firebasestorage.app/o/uploads%2F1752737330737-miroir-vitrail.jpg?alt=media&token=8660ab28-77c8-472d-8697-3ad7a5996b34',
        title: 'Miroir Mosaïque',
        description: 'Cadre en vitrail coloré',
        category: 'Décoration',
      },
    ],
    categories: ['Luminaire', 'Sculpture', 'Décoration'],
  },
  testimonials: {
    title: 'Ce qu\'ils en disent',
    items: [
      {
        quote: 'La lampe que Muriel a créée pour notre salon est tout simplement magnifique. Elle a su capter l\'ambiance que nous souhaitions et la traduire en une œuvre d\'art qui illumine nos soirées. Un talent incroyable !',
        author: 'Sophie et Marc L.',
        company: 'Particuliers, Narbonne',
      },
      {
        quote: 'Nous avons fait appel à Muriel pour une sculpture sur-mesure pour notre restaurant. Le résultat a dépassé nos attentes. C\'est une pièce maîtresse qui suscite l\'admiration de tous nos clients. Professionnalisme et créativité au rendez-vous.',
        author: 'Julien R.',
        company: 'Gérant, Le Bistrot d\'Olonzac',
      },
    ],
  },
  contact: {
    title: 'Parlons de votre projet',
    subtitle: 'Que vous ayez une idée précise ou une simple envie de beau, je suis à votre écoute pour discuter, créer et donner vie à vos projets les plus personnels.',
    detailsTitle: 'Mes coordonnées',
    formTitle: 'Formulaire de contact',
    details: {
      phone: '06 12 34 56 78',
      address: 'Mon Atelier, 12 Rue de la Création, 34210 Olonzac',
    },
  },
};

// Fonction pour récupérer le contenu initial depuis l'ancien fichier JSON
// pour la migration unique.
async function getInitialContentForMigration() {
    const dataFilePath = path.join(process.cwd(), 'src', 'data', 'content.json');
    try {
        const fileContents = await fs.readFile(dataFilePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (error) {
        console.warn("Ancien fichier content.json non trouvé pour la migration, utilisation du contenu par défaut.");
        return defaultContent;
    }
}


export async function getContent() {
  // Indique à Next.js de ne pas mettre en cache le résultat de cette fonction.
  noStore();
  
  if (!isFirebaseAdminConfigured) {
    console.error("Le SDK Admin Firebase n'est pas configuré. Impossible de récupérer le contenu depuis Firestore. Utilisation du contenu par défaut.");
    return defaultContent;
  }

  const contentDocRef = db.collection('content').doc('site');

  try {
    const doc = await contentDocRef.get();
    
    if (doc.exists) {
      // Si le document existe, renvoyer ses données.
      return doc.data() as any;
    } else {
      // Si le document n'existe pas, c'est probablement la première exécution après la migration.
      // On lit l'ancien fichier JSON, on le pousse vers Firestore, et on le renvoie.
      console.log("Document de contenu non trouvé dans Firestore. Initialisation depuis la source locale...");
      const initialContent = await getInitialContentForMigration();
      await contentDocRef.set(initialContent);
      console.log("Contenu initialisé dans Firestore avec succès.");
      return initialContent;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du contenu depuis Firestore. Utilisation du contenu par défaut.", error);
    // En cas d'erreur de communication avec Firestore, renvoyer le contenu par défaut pour éviter un crash.
    return defaultContent;
  }
}
