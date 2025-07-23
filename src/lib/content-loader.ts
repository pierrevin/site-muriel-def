// Ce fichier centralise la logique de récupération du contenu du site
// pour assurer une source de données unique et une revalidation cohérente.
'use server';

import { db, isFirebaseAdminConfigured } from '@/firebase/firebaseAdmin';
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
  
  if (!isFirebaseAdminConfigured || !db) {
    console.log("Configuration Firebase Admin manquante, utilisation du contenu par défaut.");
    return defaultContent;
  }

  try {
    const docRef = db.collection('content').doc('site');
    const doc = await docRef.get();

    if (!doc.exists) {
      console.log('Aucun document de contenu trouvé dans Firestore, création avec les données par défaut.');
      await docRef.set(defaultContent);
      return defaultContent;
    }

    // On s'assure que les données récupérées ont la même structure que les données par défaut
    // pour éviter les erreurs si des champs sont manquants dans Firestore.
    const firestoreData = doc.data();
    return { ...defaultContent, ...firestoreData };

  } catch (error) {
    console.error("Échec de la lecture depuis Firestore, renvoi de la structure par défaut.", error);
    // En cas d'erreur de connexion à Firestore, on renvoie les données par défaut
    // pour que le site puisse quand même s'afficher.
    return defaultContent;
  }
}
