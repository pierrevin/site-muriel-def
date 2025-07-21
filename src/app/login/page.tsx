
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '@/firebase/firebaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle, LogIn } from 'lucide-react';
import Image from 'next/image';

// On garde cette page en 'use client' car elle gère l'état du formulaire et les interactions.
// Cependant, on ne peut pas charger les données du fichier directement ici comme sur une page serveur.
// Une solution simple est de hardcoder le chemin si on veut éviter de faire un appel API juste pour le logo.
// Mais comme le logo est déjà dans le storage, on va plutôt utiliser une url statique temporaire ou
// attendre une version plus avancée. Pour l'instant, on va chercher le logo côté client.
// NOTE: This approach is not ideal, a better way would be to fetch this from an API route or pass it as props if the layout allowed.
// For now, to solve the immediate problem, this will work.

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState('/logo-dark.png'); // Fallback logo
  const router = useRouter();
  const { toast } = useToast();
  const auth = getAuth(app);

  useEffect(() => {
    // We fetch the content on the client side to get the logo
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        if (data?.general?.logoUrl) {
          setLogoUrl(data.general.logoUrl);
        }
      })
      .catch(err => {
        console.error("Could not fetch logo for login page:", err);
      });
  }, []);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin');
    } catch (error: any) {
        console.error("Firebase Login Error:", error); // Log complet pour le débogage
        let errorMessage = "Une erreur est survenue. Veuillez réessayer.";
        
        // Analyse du code d'erreur Firebase pour un message plus précis
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            errorMessage = 'Email ou mot de passe incorrect.';
        } else if (error.code === 'auth/api-key-not-valid') {
            errorMessage = "La configuration du site est incorrecte. La clé d'API est invalide."
        }
        
        toast({
            variant: 'destructive',
            title: 'Erreur de connexion',
            description: errorMessage,
        });
        setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
            <div className="mx-auto h-20 w-48 relative mb-4">
               <Image 
                    src={logoUrl} 
                    alt="Logo Les Trucs de Mumu" 
                    fill
                    sizes="192px"
                    className="object-contain"
                    priority
                />
            </div>
          <CardTitle className="text-2xl font-headline">Accès Administration</CardTitle>
          <CardDescription>Veuillez vous connecter pour continuer.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse e-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  <span>Connexion...</span>
                </>
              ) : (
                <>
                  <LogIn />
                  <span>Se connecter</span>
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
