
'use server';

import { AdminEditor } from './editor';
import { AdminClientWrapper } from './client-wrapper';
import { getContent } from '@/lib/content-loader';


// La page est un Server Component asynchrone.
export default async function AdminPage() {
  // Les données sont récupérées directement ici, sur le serveur,
  // via la fonction centralisée.
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
