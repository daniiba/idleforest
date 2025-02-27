// context/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  useSession, 
  useProfile, 
  useTeam, 
  useReferralStats, 
  useReferralCode 
} from '~/api/queries';
import type { AuthContextType } from "~api/types";
import Mellowtel from 'Mellowtel'

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, isLoading: sessionLoading } = useSession();
  const { data: profile } = useProfile(session?.user?.id);
  const { data: team } = useTeam(session?.user?.id);
  const { data: referralStats } = useReferralStats(session?.user?.id);
  const { data: referralCode } = useReferralCode(session?.user?.id); 
   const [mellowtel, setMellowtel] = useState<Mellowtel>(null);

   useEffect(() => {
    // Initialize Mellowtel
    const initMellowtel = async () => {
        const mellowtelInstance = new Mellowtel(process.env.PLASMO_PUBLIC_MELLOWTEL);
        setMellowtel(mellowtelInstance);
    };

    initMellowtel();
}, []);

  return (
    <AuthContext.Provider value={{ 
      user: session?.user ?? null, 
      profile, 
      team, 
      referralStats, 
      referralCode,
      loading: sessionLoading,
      mellowtel
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};