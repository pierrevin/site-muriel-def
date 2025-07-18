
'use client';

import { useState, useEffect } from 'react';
import { AdminEditor } from './editor';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { LoaderCircle, LogOut, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { allowedEmails } from '@/lib/authorized-users';

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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && currentUser.email && allowedEmails.includes(currentUser.email)) {
        setUser(currentUser);
        if (!content) {
          const fetchedContent = await getContent();
          setContent(fetchedContent);
        }
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, content]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };


  if (loading || !content) {
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
           <Button variant="outline" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Retour au site
              </Link>
           </Button>
           <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Se déconnecter
           </Button>
        </div>
      </div>
      <AdminEditor initialContent={content} />
    </div>
  );
}
