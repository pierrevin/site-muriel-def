
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { LoaderCircle } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si le chargement est terminé et qu'il n'y a pas d'utilisateur,
    // on redirige vers la page de connexion.
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Pendant le chargement, on affiche un spinner.
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-secondary">
        <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Si le chargement est terminé et qu'un utilisateur est connecté, on affiche le contenu.
  if (user) {
      return (
        <div className="min-h-screen bg-secondary">
            <main>{children}</main>
        </div>
      );
  }

  // Si pas d'utilisateur et pas en chargement (le useEffect va rediriger), on n'affiche rien.
  return null;
}
