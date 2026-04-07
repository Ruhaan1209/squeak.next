"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import supabase from '@/lib/supabase/client';

interface AuthContextType {
  jwtToken: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({ jwtToken: null, isLoading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setJwtToken(session?.access_token || null);
      setIsLoading(false);
    };
    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setJwtToken(session?.access_token || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ jwtToken, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
