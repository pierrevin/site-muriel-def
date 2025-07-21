
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { app } from '@/firebase/firebaseClient';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// Set loading to false by default to avoid blocking render
const AuthContext = createContext<AuthContextType>({ user: null, loading: false });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Still true internally to track initial load
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  // We no longer return a global loader here.
  // The layout will render immediately, and components that need the user
  // can check the `loading` state from the context.
  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
