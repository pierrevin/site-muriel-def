
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { app } from '@/firebase/firebaseClient';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// Création du contexte avec une valeur par défaut complète pour éviter les erreurs.
const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // getAuth est appelé à l'intérieur du useEffect pour garantir la fraîcheur de l'instance
    // et éviter les problèmes de cycle de vie.
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // La fonction de nettoyage se charge de détacher le listener quand le composant est démonté.
    return () => unsubscribe();
  }, []); // Le tableau de dépendances est vide pour que l'effet ne s'exécute qu'une fois.

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    // Ce hook simple consomme le contexte.
    // La vérification de null n'est plus nécessaire car le contexte a une valeur par défaut.
    return useContext(AuthContext);
};
