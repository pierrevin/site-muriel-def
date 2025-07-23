
'use client';

import { Button } from '@/components/ui/button';
import { getAuth } from 'firebase/auth';
import { Home, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { app } from '@/firebase/firebaseClient';

// Ce composant encapsule la logique qui doit s'exécuter côté client,
// comme la gestion de la déconnexion et la navigation.
export function AdminClientWrapper() {
  const router = useRouter();
  const auth = getAuth(app);

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/');
    // On force un rechargement complet pour s'assurer que tout l'état est nettoyé.
    router.refresh();
  };
  
  return (
      <div className="flex items-center gap-2">
           <Button variant="outline" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Revenir au site
              </Link>
           </Button>
           <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
           </Button>
      </div>
  )
}
