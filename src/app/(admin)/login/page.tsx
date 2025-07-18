
'use client';

import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LoaderCircle, LogIn, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { allowedEmails } from '@/lib/authorized-users';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [authLoading, setAuthLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    // Bypass credentials
    const BYPASS_EMAIL = 'bypass@studio.dev';
    const BYPASS_PASSWORD = 'bypass';

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (sessionStorage.getItem('bypass-auth') === 'true') {
                 router.push('/admin');
            } else if (user && user.email && allowedEmails.includes(user.email)) {
                router.push('/admin');
            } else {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setAuthLoading(true);

        // Bypass logic
        if (email === BYPASS_EMAIL && password === BYPASS_PASSWORD) {
            sessionStorage.setItem('bypass-auth', 'true');
            toast({ title: 'Connexion de secours réussie', description: 'Redirection...' });
            router.push('/admin');
            return;
        }

        if (!allowedEmails.includes(email)) {
            toast({
                variant: 'destructive',
                title: 'Accès refusé',
                description: 'Cet utilisateur n\'est pas autorisé à accéder à l\'espace d\'administration.',
            });
            setAuthLoading(false);
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast({
                title: 'Connexion réussie',
                description: 'Redirection vers le panneau d\'administration...',
            });
            // Redirection gérée par onAuthStateChanged
        } catch (error: any) {
            console.error("Erreur lors de la connexion :", error);
            let description = "Une erreur est survenue lors de la tentative de connexion.";
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
                description = "L'adresse e-mail ou le mot de passe est incorrect. Veuillez réessayer.";
            } else if (error.code === 'auth/api-key-not-valid') {
                description = "La clé API Firebase n'est pas valide. Veuillez utiliser les identifiants de secours.";
            }
            toast({
                variant: 'destructive',
                title: 'Erreur de connexion',
                description: description,
            });
        } finally {
            setAuthLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-secondary">
                <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex h-screen items-center justify-center bg-secondary p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-2xl">Accès à l'espace d'administration</CardTitle>
                    <CardDescription>Veuillez vous connecter pour continuer.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="votre.email@exemple.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={authLoading}
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
                                disabled={authLoading}
                            />
                        </div>
                        <Button type="submit" className="w-full" variant="secondary" disabled={authLoading}>
                            {authLoading ? (
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <LogIn className="mr-2 h-4 w-4" />
                            )}
                            {authLoading ? 'Connexion en cours...' : 'Se connecter'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter>
                    <Alert variant="destructive" className="w-full">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Connexion de secours</AlertTitle>
                        <AlertDescription className="text-xs">
                           En cas de problème, utilisez :<br />
                           Email: <strong>{BYPASS_EMAIL}</strong><br />
                           Mot de passe: <strong>{BYPASS_PASSWORD}</strong>
                        </AlertDescription>
                    </Alert>
                </CardFooter>
            </Card>
        </div>
    );
}
