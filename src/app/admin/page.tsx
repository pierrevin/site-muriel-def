
'use server';

import { AdminEditor } from './editor';
import { LogOut, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';
import { AdminClientWrapper } from './client-wrapper';


// Cette fonction est maintenant exécutée sur le serveur à chaque rendu de la page.
// C'est la garantie d'avoir toujours les données les plus à jour.
async function getContent() {
  try {
    const contentPath = path.join(process.cwd(), 'src', 'data', 'content.json');
    const fileContent = await fs.readFile(contentPath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
     console.error("Failed to fetch content, returning default structure.", error);
     return {
      general: { logoUrl: '' },
      hero: { title: 'Titre par défaut', subtitle: 'Sous-titre par défaut', imageUrl: '' },
      features: { title: 'Titre par défaut', subtitle: 'Sous-titre par défaut', items: [] },
      about: { title: 'Titre par défaut', paragraph1: '', paragraph2: '', paragraph3: '', imageUrl: '' },
      creations: { title: 'Titre par défaut', subtitle: 'Sous-titre par défaut', categories: [], items: [] },
      testimonials: { title: 'Titre par défaut', items: [] },
      contact: { 
        title: 'Parlons de votre projet', 
        subtitle: 'Une question, une idée, une envie de création unique ? Contactez-moi.',
        detailsTitle: 'Mes coordonnées',
        formTitle: 'Formulaire de contact',
        details: {
            phone: '06 12 34 56 78',
            address: 'Olonzac, 34210, Aude, France'
        }
      },
    };
  }
}

// La page est maintenant un Server Component asynchrone.
export default async function AdminPage() {
  // Les données sont récupérées directement ici, sur le serveur.
  const content = await getContent();

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold font-headline">Administration du site</h1>
        {/* Le bouton de déconnexion a besoin d'interactivité, donc on l'isole dans un Client Component. */}
        <AdminClientWrapper />
      </div>
      {/* L'éditeur reste un Client Component, mais il reçoit les données fraîches du serveur. */}
      <AdminEditor initialContent={content} />
    </div>
  );
}
