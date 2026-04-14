import React, { createContext, useContext, useState, useCallback } from 'react';

export type UserRole = 'patient' | 'admin' | 'dev';

export interface PatientEquipment {
  machineName: string;
  machineIssued: string;
  warrantyExpiry: string;
  maskName: string;
  maskType: string;
  maskSize: string;
  cushionName: string;
  lastMaskReplaced: string;
  waterChamberReplaced: string;
}

export interface PatientOrder {
  id: string;
  product: string;
  date: string;
  status: 'Processing' | 'Dispatched' | 'Delivered';
  type: 'Entitlement' | 'Paid';
}

export interface User {
  id: string;
  name: string;
  firstName: string;
  email: string;
  phone: string;
  portalId: string;
  nhi: string;
  address: string;
  suburb: string;
  city: string;
  postcode: string;
  gpName: string;
  gpPractice: string;
  role: UserRole;
  entitlementStatus: 'eligible' | 'not_eligible' | 'unknown';
  entitlementTotal: number;
  entitlementUsed: number;
  nextEligibleDate: string;
  lastOrderDate: string;
  memberSince: string;
  equipment: PatientEquipment;
  orders: PatientOrder[];
  lastLogin: string;
}

const demoPatients: Record<string, { password: string; user: User }> = {
  '238872': {
    password: 'Demo@1234!',
    user: {
      id: '1', name: 'Paul Henderson', firstName: 'Paul', email: 'paul@demo.co.nz', phone: '027 555 1234',
      portalId: '238872', nhi: 'ZZA1234', address: '14 River Road', suburb: 'Hamilton East', city: 'Hamilton', postcode: '3204',
      gpName: 'Dr Sarah Chen', gpPractice: 'Waikato Medical Centre', role: 'patient',
      entitlementStatus: 'eligible', entitlementTotal: 150, entitlementUsed: 80, nextEligibleDate: '2026-10-01', lastOrderDate: '2025-10-15',
      memberSince: '2023-03-15',
      equipment: {
        machineName: 'ResMed AirSense 11 AutoSet', machineIssued: '2023-03-15', warrantyExpiry: '2028-03-15',
        maskName: 'ResMed AirFit F30i Full Face', maskType: 'Full Face', maskSize: 'Small',
        cushionName: 'AirFit F30i Cushion — Small', lastMaskReplaced: '2025-10-15', waterChamberReplaced: '2025-06-01',
      },
      orders: [
        { id: 'ORD-001', product: 'AirFit F30i Cushion — Small', date: '2025-10-15', status: 'Delivered', type: 'Entitlement' },
        { id: 'ORD-002', product: 'AirFit F30i Headgear', date: '2025-08-20', status: 'Delivered', type: 'Entitlement' },
        { id: 'ORD-003', product: 'AirFit F30i Cushion Clip', date: '2025-06-10', status: 'Delivered', type: 'Entitlement' },
      ],
      lastLogin: '2026-04-12',
    },
  },
  '731204': {
    password: 'Demo@5678!',
    user: {
      id: '2', name: 'Sarah Mitchell', firstName: 'Sarah', email: 'sarah@demo.co.nz', phone: '021 555 5678',
      portalId: '731204', nhi: 'ZZB5678', address: '28 Te Rapa Road', suburb: 'Te Rapa', city: 'Hamilton', postcode: '3200',
      gpName: 'Dr James Wong', gpPractice: 'Te Rapa Health Hub', role: 'patient',
      entitlementStatus: 'not_eligible', entitlementTotal: 150, entitlementUsed: 150, nextEligibleDate: '2026-10-01', lastOrderDate: '2026-01-20',
      memberSince: '2022-06-10',
      equipment: {
        machineName: 'ResMed AirMini', machineIssued: '2022-06-10', warrantyExpiry: '2027-06-10',
        maskName: 'ResMed AirFit P10 Nasal Pillow', maskType: 'Nasal Pillow', maskSize: 'Extra Small',
        cushionName: 'AirFit P10 Nasal Pillow — Extra Small', lastMaskReplaced: '2026-01-20', waterChamberReplaced: '2025-04-15',
      },
      orders: [
        { id: 'ORD-004', product: 'AirFit P10 Nasal Pillow — XS', date: '2026-01-20', status: 'Delivered', type: 'Entitlement' },
        { id: 'ORD-005', product: 'AirFit P10 Headgear', date: '2025-11-05', status: 'Delivered', type: 'Entitlement' },
      ],
      lastLogin: '2026-04-10',
    },
  },
  '956431': {
    password: 'Demo@9012!',
    user: {
      id: '3', name: 'Richard Tāmati', firstName: 'Richard', email: 'richard@demo.co.nz', phone: '022 555 9012',
      portalId: '956431', nhi: 'ZZC9012', address: '5 Lake Crescent', suburb: 'Hillcrest', city: 'Hamilton', postcode: '3216',
      gpName: 'Dr Emily Roberts', gpPractice: 'Hillcrest Medical', role: 'patient',
      entitlementStatus: 'eligible', entitlementTotal: 150, entitlementUsed: 30, nextEligibleDate: '2026-10-01', lastOrderDate: '2025-07-12',
      memberSince: '2021-09-20',
      equipment: {
        machineName: 'ResMed AirSense 10 AutoSet', machineIssued: '2021-09-20', warrantyExpiry: '2026-09-20',
        maskName: 'Philips DreamWear Full Face', maskType: 'Full Face', maskSize: 'Medium',
        cushionName: 'DreamWear Full Face Cushion — Medium', lastMaskReplaced: '2025-07-12', waterChamberReplaced: '2024-12-01',
      },
      orders: [
        { id: 'ORD-006', product: 'DreamWear Full Face Cushion — Medium', date: '2025-07-12', status: 'Delivered', type: 'Entitlement' },
      ],
      lastLogin: '2026-03-28',
    },
  },
};

const adminUser: User = {
  id: 'admin-1', name: 'Midland Admin', firstName: 'Admin', email: 'admin@midlandsleep.co.nz', phone: '0800 123 456',
  portalId: 'ADMIN', nhi: '', address: '', suburb: '', city: 'Hamilton', postcode: '',
  gpName: '', gpPractice: '', role: 'admin',
  entitlementStatus: 'unknown', entitlementTotal: 0, entitlementUsed: 0, nextEligibleDate: '', lastOrderDate: '',
  memberSince: '2024-01-01',
  equipment: { machineName: '', machineIssued: '', warrantyExpiry: '', maskName: '', maskType: '', maskSize: '', cushionName: '', lastMaskReplaced: '', waterChamberReplaced: '' },
  orders: [], lastLogin: '2026-04-14',
};

const devUser: User = {
  id: 'dev-1', name: 'Dev Account', firstName: 'Dev', email: 'dev@oneofzero.co.nz', phone: '',
  portalId: 'DEV', nhi: '', address: '', suburb: '', city: '', postcode: '',
  gpName: '', gpPractice: '', role: 'dev',
  entitlementStatus: 'unknown', entitlementTotal: 0, entitlementUsed: 0, nextEligibleDate: '', lastOrderDate: '',
  memberSince: '2026-01-01',
  equipment: { machineName: '', machineIssued: '', warrantyExpiry: '', maskName: '', maskType: '', maskSize: '', cushionName: '', lastMaskReplaced: '', waterChamberReplaced: '' },
  orders: [], lastLogin: '2026-04-14',
};

export function getAllPatients(): User[] {
  return Object.values(demoPatients).map(d => d.user);
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