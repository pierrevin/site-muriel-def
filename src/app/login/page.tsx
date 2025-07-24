
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

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  // Utilisation d'un logo de secours pour éviter l'appel fetch problématique
  const logoUrl = "/logo-dark.png"; 
  const router = useRouter();
  const { toast } = useToast();
  const auth = getAuth(app);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin');
    } catch (error: any) {
        console.error("Firebase Login Error:", error); 
        let errorMessage = "Une erreur est survenue. Veuillez réessayer.";
        
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
                    src="https://firebasestorage.googleapis.com/v0/b/les-trucs-de-mumu-g9rzm.firebasestorage.app/o/uploads%2FJmt1vFlq3UeVzjvpiTwBJ56dWu93%2F1752737122228-Logo_LTDM_V2%20jaune.png?alt=media&token=52cf14b4-f786-4f90-a790-39458b13f8ff"
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
