
'use client';

import { useState, useEffect } from 'react';
import { AdminEditor } from './editor';
import { LoaderCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

async function getContent() {
  const res = await fetch('/api/content', { cache: 'no-store' });
  if (!res.ok) {
     console.error("Failed to fetch content, returning default structure.");
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
  return res.json();
}

export default function AdminPage() {
  const [content, setContent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchContent = async () => {
      const fetchedContent = await getContent();
      setContent(fetchedContent);
      setLoading(false);
    };

    fetchContent();
  }, []);

  const handleLogout = () => {
    // Redirige simplement vers la page d'accueil
    router.push('/');
  };
  

  if (loading) {
    return (
       <div className="flex h-screen items-center justify-center bg-secondary">
          <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold font-headline">Administration du site</h1>
        <div className="flex items-center gap-2">
           <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Retour au site / Déconnexion
           </Button>
        </div>
      </div>
      {content && <AdminEditor initialContent={content} />}
    </div>
  );
}
