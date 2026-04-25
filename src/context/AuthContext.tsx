import React, { createContext, useContext, useState, useCallback } from 'react';
import { demoPatients, type Patient } from '@/data/demoData';

export type UserRole = 'patient' | 'admin' | 'dev';
export type User = Omit<Patient, 'orders'> & {
  role: UserRole;
  gpName: string;
  gpPractice: string;
  memberSince: string;
  entitlementStatus: 'eligible' | 'not_eligible' | 'unknown';
  entitlementTotal: number;
  entitlementUsed: number;
  lastOrderDate: string;
  equipment: {
    machineName: string;
    machineIssued: string;
    warrantyExpiry: string;
    maskName: string;
    maskType: string;
    maskSize: string;
    cushionName: string;
    lastMaskReplaced: string;
    waterChamberReplaced: string;
  };
  orders: Array<{ id: string; date: string; items: string; product: string; status: string; type: string }>;
};

function toUser(patient: Patient, role: UserRole = 'patient'): User {
  return {
    ...patient,
    role,
    gpName: 'Waikato GP',
    gpPractice: 'Waikato Medical Centre',
    memberSince: patient.machine.issued,
    entitlementStatus: patient.eligibilityStatus,
    entitlementTotal: 0,
    entitlementUsed: 0,
    lastOrderDate: patient.orders[0]?.date ?? '',
    equipment: {
      machineName: patient.machine.name,
      machineIssued: patient.machine.issued,
      warrantyExpiry: patient.machine.warrantyExpiry,
      maskName: patient.mask.name,
      maskType: patient.mask.name.includes('Nasal') ? 'Nasal' : 'Full Face',
      maskSize: patient.mask.size,
      cushionName: `${patient.mask.name} Cushion — ${patient.mask.size}`,
      lastMaskReplaced: patient.mask.lastIssued,
      waterChamberReplaced: patient.waterChamber.lastReplaced,
    },
    orders: patient.orders.map((order) => ({
      ...order,
      product: order.items,
      status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
      type: 'Funded',
    })),
  };
}

const emptyPatient: Patient = {
  id: 'system', name: 'Midland Staff', firstName: 'Staff', email: 'admin@midlandsleep.co.nz', phone: '0800 XXX XXX',
  portalId: 'ADMIN', nhi: '', address: '', suburb: '', city: 'Hamilton', postcode: '', eligibilityStatus: 'eligible',
  eligibleText: '', nextEligibleDate: '',
  machine: { name: '', deviceId: '', issued: '', warrantyExpiry: '', safetyDue: '', safetyStatus: 'ok', lastSafetyCheck: '' },
  mask: { name: '', size: '', lastIssued: '' },
  waterChamber: { lastReplaced: '', nextDue: '', status: 'ok' },
  orders: [], equipmentHistory: [], maintenanceTimeline: [],
};

const adminUser = toUser(emptyPatient, 'admin');
const devUser = toUser({ ...emptyPatient, id: 'dev', name: 'Dev Account', firstName: 'Dev', email: 'dev@oneofzero.co.nz', portalId: 'DEV' }, 'dev');

export function getAllPatients(): User[] {
  return Object.values(demoPatients).map(d => toUser(d.user));
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
      setUser(toUser(byPortalId.user));
      return { success: true };
    }
    // Patient login by email
    const byEmail = Object.values(demoPatients).find(d => d.user.email === identifier);
    if (byEmail && byEmail.password === password) {
      setUser(toUser(byEmail.user));
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