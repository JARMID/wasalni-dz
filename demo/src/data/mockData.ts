import type { DriverProfile, LocationPoint, WalletBalances, LedgerEntry } from '../types';

export const ALGIERS_LOCATIONS: LocationPoint[] = [
  {
    id: 'loc-1',
    name: 'Grande Poste (Alger Centre)',
    nameAr: 'البريد المركزي (الجزائر الوسطى)',
    commune: 'Alger-Centre',
    lat: 36.7729,
    lng: 3.0583,
  },
  {
    id: 'loc-2',
    name: 'Place du 1er Mai (Hôpital Mustapha)',
    nameAr: 'ساحة أول ماي (مستشفى مصطفى باشا)',
    commune: 'Sidi M\'Hamed',
    lat: 36.7538,
    lng: 3.0588,
  },
  {
    id: 'loc-3',
    name: 'Kouba (Mairie / Place Centrale)',
    nameAr: 'القبة (ساحة البلدية)',
    commune: 'Kouba',
    lat: 36.7262,
    lng: 3.0872,
  },
  {
    id: 'loc-4',
    name: 'Hydra (Place Qods)',
    nameAr: 'حيدرة (ساحة القدس)',
    commune: 'Hydra',
    lat: 36.7456,
    lng: 3.0417,
  },
  {
    id: 'loc-5',
    name: 'Bab El Oued (Place du Marché Triolet)',
    nameAr: 'باب الواد (تريولي)',
    commune: 'Bab El Oued',
    lat: 36.7865,
    lng: 3.0592,
  },
  {
    id: 'loc-6',
    name: 'Aéroport International Houari Boumediene',
    nameAr: 'مطار هواري بومدين الدولي',
    commune: 'Dar El Beïda',
    lat: 36.6961,
    lng: 3.2158,
  },
  {
    id: 'loc-7',
    name: 'Gare Routière Caroubier (Inter-Wilayas)',
    nameAr: 'المحطة البرية الخروبة (ما بين الولايات)',
    commune: 'Hussein Dey',
    lat: 36.7388,
    lng: 3.1098,
  },
];

export const INITIAL_DRIVER: DriverProfile = {
  id: 'drv-016-848',
  fullName: 'Mohamed Amine Benali',
  phone: '0550 12 34 56',
  photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
  rating: 4.94,
  totalTrips: 1842,
  wilayaCode: 16,
  wilayaName: 'Alger',
  agrementNumber: '16/2024/0482',
  livretDePlaceNumber: 'LP-88392-16',
  policeCheckVerified: true,
  vehicleMake: 'Peugeot',
  vehicleModel: '301 Allure (1.6 HDi)',
  licensePlate: '10482-116-16',
  vehicleColor: 'Jaune Taxi Réglementaire',
  isOnline: true,
  currentLat: 36.7320,
  currentLng: 3.0780,
  heading: 42.0,
  speedKmh: 48,
  walletBalanceDzd: 3850.00, // Driver Operational Balance (Account 2020)
};

export const INITIAL_WALLETS: WalletBalances = {
  cashInTransit_1010: 0.00,
  digitalEscrow_1020: 4300.00,
  riderTrustDesk_2010: 450.00,  // Initial Rider balance backed by digital escrow
  driverOperational_2020: 3850.00, // Initial Driver balance backed by digital escrow
  platformRevenue_4010: 0.00,
};

export const INITIAL_LEDGER: LedgerEntry[] = [
  {
    id: 'ledg-101',
    timestamp: '2026-10-14 16:15:20',
    entryType: 'fare_settlement',
    debitAccount: '1010 (Cash in Transit)',
    creditAccount: '2020 (Driver Operational)',
    amountDzd: 800.00,
    description: 'Ride fare settlement (Trip DZ-4819)',
  },
  {
    id: 'ledg-102',
    timestamp: '2026-10-14 16:15:20',
    entryType: 'commission_debit',
    debitAccount: '2020 (Driver Operational)',
    creditAccount: '4010 (Platform Revenue)',
    amountDzd: 100.00,
    description: 'Regulated Frais d\'Approche Booking Fee (CNRC 604103)',
  },
  {
    id: 'ledg-103',
    timestamp: '2026-10-14 15:40:12',
    entryType: 'wallet_topup',
    debitAccount: '1020 (Digital Escrow)',
    creditAccount: '2020 (Driver Operational)',
    amountDzd: 2000.00,
    description: 'Driver operational balance top-up via Chargily Pay (Edahabia card)',
  },
];

export interface MunicipalTaxiVehicle {
  id: string;
  driverName: string;
  agrementNumber: string;
  livretNumber: string;
  plate: string;
  vehicleModel: string;
  commune: string;
  h3Res8Index: string;
  lat: number;
  lng: number;
  speedKmh: number;
  status: 'available' | 'on_trip' | 'patrol';
}

export const ALGIERS_MUNICIPAL_FLEET: MunicipalTaxiVehicle[] = [
  {
    id: 'TX-16-01',
    driverName: 'Mohamed Amine Benali',
    agrementNumber: '16/2024/0482',
    livretNumber: 'LP-88392-16',
    plate: '10482-116-16',
    vehicleModel: 'Peugeot 301 Jaune',
    commune: 'Kouba',
    h3Res8Index: '8839218205fffff',
    lat: 36.7262,
    lng: 3.0872,
    speedKmh: 42,
    status: 'available',
  },
  {
    id: 'TX-16-02',
    driverName: 'Karim Messaoudi',
    agrementNumber: '16/2022/1190',
    livretNumber: 'LP-44102-16',
    plate: '09812-118-16',
    vehicleModel: 'Dacia Logan Jaune',
    commune: 'Bab El Oued',
    h3Res8Index: '8839218251fffff',
    lat: 36.7865,
    lng: 3.0592,
    speedKmh: 35,
    status: 'patrol',
  },
  {
    id: 'TX-16-03',
    driverName: 'Sofiane Cherif',
    agrementNumber: '16/2023/0744',
    livretNumber: 'LP-33921-16',
    plate: '18491-121-16',
    vehicleModel: 'Hyundai Accent Jaune',
    commune: 'Hydra',
    h3Res8Index: '8839218243fffff',
    lat: 36.7456,
    lng: 3.0417,
    speedKmh: 48,
    status: 'available',
  },
  {
    id: 'TX-16-04',
    driverName: 'Yacine Bouzid',
    agrementNumber: '16/2021/0312',
    livretNumber: 'LP-91024-16',
    plate: '04712-119-16',
    vehicleModel: 'Citroën C-Elysée Jaune',
    commune: 'Sidi M\'Hamed',
    h3Res8Index: '8839218217fffff',
    lat: 36.7538,
    lng: 3.0588,
    speedKmh: 28,
    status: 'on_trip',
  },
  {
    id: 'TX-16-05',
    driverName: 'Farouk Hamidi',
    agrementNumber: '16/2025/0089',
    livretNumber: 'LP-12948-16',
    plate: '22910-123-16',
    vehicleModel: 'Peugeot 508 Inter-Wilaya',
    commune: 'Caroubier (Hussein Dey)',
    h3Res8Index: '8839218265fffff',
    lat: 36.7388,
    lng: 3.1098,
    speedKmh: 55,
    status: 'available',
  },
];

