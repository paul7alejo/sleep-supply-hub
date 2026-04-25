export type EligibilityStatus = 'eligible' | 'not_eligible';
export type RequestStatus = 'available' | 'future' | 'early';
export type ProductCategory = 'Supplies' | 'Accessories' | 'Machines';

export interface Patient {
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
  eligibilityStatus: EligibilityStatus;
  eligibleText: string;
  nextEligibleDate: string;
  machine: {
    name: string;
    deviceId: string;
    issued: string;
    warrantyExpiry: string;
    safetyDue: string;
    safetyStatus: 'ok' | 'overdue';
    lastSafetyCheck: string;
  };
  mask: {
    name: string;
    size: string;
    lastIssued: string;
  };
  waterChamber: {
    lastReplaced: string;
    nextDue: string;
    status: 'ok' | 'due';
  };
  orders: Array<{ id: string; date: string; items: string; status: 'dispatched' | 'delivered' | 'reviewing' }>;
  equipmentHistory: Array<{ type: string; name: string; date: string; status: string }>;
  maintenanceTimeline: Array<{ date: string; title: string; status: 'complete' | 'upcoming' | 'overdue' }>;
}

export interface ShopProduct {
  slug: string;
  category: ProductCategory;
  name: string;
  brand: string;
  price: number;
  rrp: number;
  imageTone: string;
  features: string[];
  isMachine?: boolean;
}

export const demoPatients: Record<string, { password: string; user: Patient }> = {
  '238872': {
    password: 'Demo@1234!',
    user: {
      id: '1', name: 'Paul Moreno', firstName: 'Paul', email: 'paul.moreno@example.co.nz', phone: '027 555 1234',
      portalId: '238872', nhi: 'ZZA1234', address: '14 River Road', suburb: 'Hamilton East', city: 'Hamilton', postcode: '3204',
      eligibilityStatus: 'eligible', eligibleText: 'You can request mask supplies', nextEligibleDate: '2026-11-15',
      machine: { name: 'ResMed AirSense 11 AutoSet', deviceId: 'MS-88210', issued: '2023-03-15', warrantyExpiry: '2028-03-15', safetyDue: '2026-03-15', safetyStatus: 'overdue', lastSafetyCheck: '2023-03-15' },
      mask: { name: 'ResMed AirFit F30i Full Face', size: 'Small', lastIssued: '2025-10-15' },
      waterChamber: { lastReplaced: '2026-01-10', nextDue: '2026-07-10', status: 'ok' },
      orders: [
        { id: 'MS-10482', date: '2025-12-12', items: 'F30i cushion, headgear', status: 'delivered' },
        { id: 'MS-09931', date: '2025-10-15', items: 'F30i cushion', status: 'delivered' },
        { id: 'MS-09440', date: '2025-08-20', items: 'Headgear', status: 'dispatched' },
      ],
      equipmentHistory: [
        { type: 'Current machine', name: 'ResMed AirSense 11 AutoSet', date: '15 March 2023', status: 'Active' },
        { type: 'Previous machine', name: 'ResMed AirSense 10', date: '9 February 2018', status: 'Returned' },
        { type: 'Current mask', name: 'ResMed AirFit F30i Full Face — Small', date: '15 October 2025', status: 'Active' },
      ],
      maintenanceTimeline: [
        { date: '15 March 2023', title: 'Machine issued and checked', status: 'complete' },
        { date: '10 January 2026', title: 'Water chamber replaced', status: 'complete' },
        { date: '15 March 2026', title: 'Safety check due', status: 'overdue' },
        { date: '10 July 2026', title: 'Water chamber next due', status: 'upcoming' },
      ],
    },
  },
  '731204': {
    password: 'Demo@5678!',
    user: {
      id: '2', name: 'Sarah Kim', firstName: 'Sarah', email: 'sarah.kim@example.co.nz', phone: '021 555 5678',
      portalId: '731204', nhi: 'ZZB5678', address: '28 Te Rapa Road', suburb: 'Te Rapa', city: 'Hamilton', postcode: '3200',
      eligibilityStatus: 'not_eligible', eligibleText: 'Not yet eligible — available from 15 November 2026', nextEligibleDate: '2026-11-15',
      machine: { name: 'F&P SleepStyle 650', deviceId: 'MS-73144', issued: '2024-08-20', warrantyExpiry: '2029-08-20', safetyDue: '2027-08-20', safetyStatus: 'ok', lastSafetyCheck: '2024-08-20' },
      mask: { name: 'F&P Eson 2 Nasal', size: 'Medium', lastIssued: '2026-01-20' },
      waterChamber: { lastReplaced: '2025-06-01', nextDue: '2025-12-01', status: 'due' },
      orders: [
        { id: 'MS-10702', date: '2026-01-20', items: 'Eson 2 cushion', status: 'delivered' },
        { id: 'MS-10116', date: '2025-11-05', items: 'Eson 2 headgear', status: 'delivered' },
        { id: 'MS-09602', date: '2025-09-12', items: 'Filters', status: 'delivered' },
      ],
      equipmentHistory: [
        { type: 'Current machine', name: 'F&P SleepStyle 650', date: '20 August 2024', status: 'Active' },
        { type: 'Current mask', name: 'F&P Eson 2 Nasal — Medium', date: '20 January 2026', status: 'Active' },
      ],
      maintenanceTimeline: [
        { date: '20 August 2024', title: 'Machine issued and checked', status: 'complete' },
        { date: '1 December 2025', title: 'Water chamber due', status: 'overdue' },
        { date: '20 August 2027', title: 'Safety check due', status: 'upcoming' },
      ],
    },
  },
  '956431': {
    password: 'Demo@9012!',
    user: {
      id: '3', name: "Richard O'Brien", firstName: 'Richard', email: 'richard.obrien@example.co.nz', phone: '022 555 9012',
      portalId: '956431', nhi: 'ZZC9012', address: '5 Lake Crescent', suburb: 'Hillcrest', city: 'Hamilton', postcode: '3216',
      eligibilityStatus: 'eligible', eligibleText: 'You can request mask supplies', nextEligibleDate: '2026-11-15',
      machine: { name: 'ResMed AirSense 10', deviceId: 'MS-54019', issued: '2020-06-12', warrantyExpiry: '2025-06-12', safetyDue: '2023-06-12', safetyStatus: 'overdue', lastSafetyCheck: '2020-06-12' },
      mask: { name: 'ResMed Mirage FX', size: 'Large', lastIssued: '2024-08-02' },
      waterChamber: { lastReplaced: '2024-08-02', nextDue: '2025-02-02', status: 'due' },
      orders: [
        { id: 'MS-08220', date: '2024-08-02', items: 'Mirage FX cushion', status: 'delivered' },
        { id: 'MS-07710', date: '2024-04-18', items: 'Filters', status: 'delivered' },
        { id: 'MS-07032', date: '2023-11-30', items: 'Headgear', status: 'delivered' },
      ],
      equipmentHistory: [
        { type: 'Current machine', name: 'ResMed AirSense 10', date: '12 June 2020', status: 'Active' },
        { type: 'Current mask', name: 'ResMed Mirage FX — Large', date: '2 August 2024', status: 'Active' },
      ],
      maintenanceTimeline: [
        { date: '12 June 2020', title: 'Machine issued and checked', status: 'complete' },
        { date: '12 June 2023', title: 'Safety check due', status: 'overdue' },
        { date: '2 February 2025', title: 'Water chamber due', status: 'overdue' },
      ],
    },
  },
};

export const compatibleSupplies = [
  { id: 'cushion', name: 'Mask cushion', status: 'available' as RequestStatus },
  { id: 'headgear', name: 'Headgear', status: 'available' as RequestStatus },
  { id: 'filters', name: 'Machine filters', status: 'early' as RequestStatus },
  { id: 'mask-kit', name: 'Complete mask kit', status: 'future' as RequestStatus },
];

export const shopProducts: ShopProduct[] = [
  { slug: 'airfit-f30i-cushion', category: 'Supplies', name: 'AirFit F30i Cushion', brand: 'ResMed', price: 40.50, rrp: 45, imageTone: 'bg-deep-teal-pale', features: ['Compatible with AirFit F30i masks', 'Soft full-face seal', 'Small, medium and large sizes', 'Easy click-in fit', 'For routine replacement', 'Clinic-grade packaging'] },
  { slug: 'airfit-f30i-headgear', category: 'Supplies', name: 'AirFit F30i Headgear', brand: 'ResMed', price: 34.20, rrp: 38, imageTone: 'bg-muted', features: ['Adjustable fit', 'Compatible with F30i frame', 'Soft fabric straps', 'Easy replacement', 'Stable overnight support', 'Patient Price applied'] },
  { slug: 'airfit-f30i-mask-kit', category: 'Supplies', name: 'AirFit F30i Mask Kit', brand: 'ResMed', price: 170.10, rrp: 189, imageTone: 'bg-seafoam/15', features: ['Full mask assembly', 'Under-nose cushion', 'QuietAir venting', 'Multiple cushion sizes', 'Includes frame and elbow', 'For existing CPAP therapy'] },
  { slug: 'airsense-filters', category: 'Supplies', name: 'AirSense Filters', brand: 'ResMed', price: 16.20, rrp: 18, imageTone: 'bg-cream', features: ['Disposable filter pack', 'AirSense compatible', 'Simple replacement', 'Supports airflow quality', 'Compact pack', 'Patient Price applied'] },
  { slug: 'cleaning-wipes', category: 'Accessories', name: 'CPAP Cleaning Wipes', brand: 'Midland Sleep', price: 13.50, rrp: 15, imageTone: 'bg-seafoam/15', features: ['Alcohol-free wipes', 'Daily mask cleaning', 'Travel friendly pack', 'Gentle on cushions', 'No rinsing needed', 'Patient Price applied'] },
  { slug: 'mask-liner-pads', category: 'Accessories', name: 'Mask Liner Pads', brand: 'Midland Sleep', price: 22.50, rrp: 25, imageTone: 'bg-muted', features: ['Soft liner pads', 'Helps reduce marks', 'Fits common masks', 'Single-use hygiene', 'Comfort support', 'Patient Price applied'] },
  { slug: 'travel-bag', category: 'Accessories', name: 'CPAP Travel Bag', brand: 'Midland Sleep', price: 36, rrp: 40, imageTone: 'bg-deep-teal-pale', features: ['Padded travel storage', 'Room for tubing', 'Zip compartments', 'Carry handle', 'Compact size', 'Patient Price applied'] },
  { slug: 'chin-strap', category: 'Accessories', name: 'Chin Strap', brand: 'Midland Sleep', price: 31.50, rrp: 35, imageTone: 'bg-cream', features: ['Adjustable support', 'Soft fabric', 'Helps keep mouth closed', 'Works with nasal masks', 'Washable', 'Patient Price applied'] },
  { slug: 'airsense-11', category: 'Machines', name: 'ResMed AirSense 11', brand: 'ResMed', price: 2069.10, rrp: 2299, imageTone: 'bg-deep-teal-pale', isMachine: true, features: ['AutoSet therapy modes', 'Integrated humidifier', 'Touchscreen controls', 'Quiet operation', 'Connected support capable', 'Patient Price applied'] },
  { slug: 'airmini', category: 'Machines', name: 'ResMed AirMini', brand: 'ResMed', price: 1349.10, rrp: 1499, imageTone: 'bg-muted', isMachine: true, features: ['Travel CPAP device', 'Compact design', 'Waterless humidification compatible', 'App controls', 'Quiet therapy', 'Patient Price applied'] },
  { slug: 'dreamstation-2', category: 'Machines', name: 'DreamStation 2', brand: 'Philips', price: 1709.10, rrp: 1899, imageTone: 'bg-seafoam/15', isMachine: true, features: ['Auto CPAP therapy', 'Integrated humidifier', 'Compact footprint', 'Simple controls', 'Comfort settings', 'Patient Price applied'] },
];

export function formatDate(dateStr: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function getShopProduct(slug = '') {
  return shopProducts.find((p) => p.slug === slug) ?? shopProducts[0];
}
