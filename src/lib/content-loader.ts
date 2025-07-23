// Ce fichier centralise la logique de récupération du contenu du site
// pour assurer une source de données unique et une revalidation cohérente.
'use server';

import { db, isFirebaseAdminConfigured } from '@/firebase/firebaseAdmin';
import { unstable_noStore as noStore } from 'next/cache';

const defaultContent = {
  general: {
    logoUrl: 'https://firebasestorage.googleapis.com/v0/b/les-trucs-de-mumu-g9rzm.firebasestorage.app/o/uploads%2FJmt1vFlq3UeVzjvpiTwBJ56dWu93%2F1752737122228-Logo_LTDM_V2%20jaune.png?alt=media&token=52cf14b4-f786-4f90-a790-39458b13f8ff'
  },
  hero: {
    title: 'Les Trucs de Mumu',
    subtitle: 'Créations artisanales uniques en métal et vitrail',
    imageUrl: 'https://placehold.co/1920x1080.png'
  },
  features: {
    title: 'Mes engagements d\'artisane',
    subtitle: 'La promesse d\'un art authentique, local et durable',
    items: [
      {
        title: 'Pièces Uniques & Signées',
        description: 'Chaque création est le fruit d\'une inspiration spontanée. Je conçois et réalise chaque pièce à la main, garantissant une œuvre que vous ne retrouverez nulle part ailleurs.'
      },
      {
        title: 'Artisanat Local',
        description: 'Installée à Olonzac, au cœur de l\'Aude, mon atelier est un espace de création ancré dans le territoire. Je privilégie les matériaux et les savoir-faire locaux.'
      },
      {
        title: 'Création Sur-Mesure',
        description: 'Votre intérieur est unique, vos envies aussi. Je suis à votre écoute pour concevoir avec vous la pièce qui s\'intégrera parfaitement à votre univers et racontera votre histoire.'
      }
    ]
  },
  about: {
    title: 'L\'art du métal, la magie du verre',
    paragraph1: 'Je suis Muriel Fauthoux, artisan créatrice passionnée par la transformation de la matière brute en objets d\'art qui captent la lumière et racontent une histoire. Mon univers est fait de métal sculpté, de vitrail coloré et de curiosité sans cesse renouvelée.',
    paragraph2: 'Chaque pièce qui naît dans mon atelier est le fruit d\'un dialogue entre le métal, que je tords, soude et façonne, et le verre, que je choisis pour ses couleurs et ses textures uniques. Luminaires, sculptures, objets décoratifs... mes créations sont des invitations à voir le monde autrement.',
    paragraph3: 'Plus qu\'une simple décoration, je cherche à créer des émotions, des atmosphères. Une lumière qui danse sur un mur, une sculpture qui dialogue avec votre espace... C\'est cette petite étincelle de magie que je souhaite apporter dans votre quotidien.',
    imageUrl: 'https://placehold.co/800x1000.png'
  },
  creations: {
    title: 'Mes créations',
    subtitle: 'Explorez un univers où la matière brute rencontre la poésie de la lumière. Chaque pièce est unique, faite à la main dans mon atelier.',
    categories: ["Luminaire", "Sculpture", "Décoration"],
    items: []
  },
  testimonials: {
    title: 'Ce qu\'ils en disent',
    items: [
        {
          quote: "La lampe que Muriel a créée pour notre salon est tout simplement magnifique. Elle a su capter l'ambiance que nous souhaitions et la traduire en une œuvre d'art qui illumine nos soirées. Un talent incroyable !",
          author: "Sophie et Marc L.",
          company: "Particuliers, Narbonne"
        },
        {
          quote: "Nous avons fait appel à Muriel pour une sculpture sur-mesure pour notre restaurant. Le résultat a dépassé nos attentes. C'est une pièce maîtresse qui suscite l'admiration de tous nos clients. Professionnalisme et créativité au rendez-vous.",
          author: "Julien R.",
          company: "Gérant, Le Bistrot d'Olonzac"
        }
    ]
  },
  contact: {
    title: 'Parlons de votre projet',
    subtitle: 'Que vous ayez une idée précise ou une simple envie de beau, je suis à votre écoute pour discuter, créer et donner vie à vos projets les plus personnels.',
    detailsTitle: 'Mes coordonnées',
    formTitle: 'Formulaire de contact',
    details: {
      phone: '06 12 34 56 78',
      address: 'Mon Atelier, 12 Rue de la Création, 34210 Olonzac'
    }
  }
};

export async function getContent() {
  // Dit explicitement à Next.js de ne pas mettre en cache le résultat de cette fonction.
  noStore();
  
  if (!isFirebaseAdminConfigured || !db) {
    console.error("Configuration Firebase Admin manquante, utilisation du contenu par défaut.");
    return defaultContent;
  }

  try {
    const docRef = db.collection('content').doc('site');
    const doc = await docRef.get();

    if (!doc.exists) {
      console.warn('Aucun document de contenu trouvé dans Firestore, création avec les données par défaut.');
      // Le document n'existe pas, on le crée avec le contenu par défaut complet
      await docRef.set(defaultContent);
      return defaultContent;
    }

    const firestoreData = doc.data();
    // On fusionne les données de Firestore avec le contenu par défaut.
    // Cela garantit que si des nouvelles clés sont ajoutées au defaultContent,
    // le site ne plantera pas. La donnée de Firestore a toujours la priorité.
    return { ...defaultContent, ...firestoreData };

  } catch (error) {
    console.error("Échec de la lecture depuis Firestore, renvoi du contenu par défaut.", error);
    // En cas d'erreur de connexion à Firestore, on renvoie les données par défaut
    // pour que le site puisse quand même s'afficher.
    return defaultContent;
  }
}
