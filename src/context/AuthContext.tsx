import React, { createContext, useContext, useState, useCallback } from 'react';
import { demoPatients, type Patient } from '@/data/demoData';

export type UserRole = 'patient' | 'admin' | 'dev';
export type User = Patient & { role: UserRole };

export function getAllPatients(): User[] {
  return Object.values(demoPatients).map(d => ({ ...d.user, role: 'patient' }));
}

interface AuthContextType {
  user: User | null;
  login: (identifier: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((identifier: string, password: string) => {
    // Admin login
    if (identifier === 'admin@midlandsleep.co.nz' && password === 'Admin@secure1!') {
      setUser(adminUser);
      return { success: true };
    }
    // Dev login
    if (identifier === 'dev@oneofzero.co.nz' && password === 'Dev@test99!') {
      setUser(devUser);
      return { success: true };
    }
    // Patient login by portal ID
    const byPortalId = demoPatients[identifier];
    if (byPortalId && byPortalId.password === password) {
      setUser(byPortalId.user);
      return { success: true };
    }
    // Patient login by email
    const byEmail = Object.values(demoPatients).find(d => d.user.email === identifier);
    if (byEmail && byEmail.password === password) {
      setUser(byEmail.user);
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials. Please check your Portal ID and password.' };
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}