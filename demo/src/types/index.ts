// Data models for Algeria Smart Taxi Demo Platform

export type ServiceMode = 
  | 'taxi_individuel_metered'    // Mode 1: Meter + 100 DZD frais d'approche
  | 'taxi_collectif_urbain'      // Mode 2: Urban collective line (50 DZD/seat)
  | 'taxi_collectif_inter_wilayas'; // Mode 3: Inter-wilaya station-to-station

export type RideStatus = 
  | 'idle'
  | 'requesting'
  | 'matching'
  | 'driver_assigned'
  | 'driver_arrived'
  | 'in_progress'
  | 'fare_entry'
  | 'spare_change_prompt'
  | 'completed';

export type PaymentMethod = 'cash' | 'edahabia' | 'cib' | 'trustdesk_wallet';

export type ThermalState = 'NORMAL' | 'MODERATE' | 'SEVERE' | 'CRITICAL';

export interface LocationPoint {
  id: string;
  name: string;
  nameAr: string;
  commune: string;
  lat: number;
  lng: number;
}

export interface DriverProfile {
  id: string;
  fullName: string;
  phone: string;
  photoUrl: string;
  rating: number;
  totalTrips: number;
  wilayaCode: number;
  wilayaName: string;
  agrementNumber: string;        // Numéro d'Agrément DTW
  livretDePlaceNumber: string;    // Livret de Place
  policeCheckVerified: boolean;
  vehicleMake: string;
  vehicleModel: string;
  licensePlate: string;          // Format: 10482-116-16
  vehicleColor: string;
  isOnline: boolean;
  currentLat: number;
  currentLng: number;
  heading: number;
  speedKmh: number;
  walletBalanceDzd: number;      // Account 2020: Driver Operational Balance
}

export interface RideRequest {
  id: string;
  rideCode: string;
  serviceMode: ServiceMode;
  origin: LocationPoint;
  destination: LocationPoint;
  status: RideStatus;
  pickupPin: string;
  seatsBooked: number;
  totalSeats: number;
  estimatedDistanceKm: number;
  estimatedDurationMins: number;
  fraisApprocheDzd: number;      // 100 DZD
  meterFinalDzd: number;
  totalFareDzd: number;
  paymentMethod: PaymentMethod;
  tenderedCashDzd?: number;
  spareChangeCreditedDzd?: number;
  createdAt: string;
}

export interface DashcamIncident {
  id: string;
  timestamp: string;
  rideId: string;
  driverId: string;
  triggerType: 'g_sensor_impact' | 'hard_deceleration' | 'sos_rider' | 'sos_driver' | 'manual_pin';
  peakGForce: number;
  speedKmh: number;
  lat: number;
  lng: number;
  encryptionKeyId: string;
  fileSizeBytes: number;
  status: 'pending_triage' | 'under_investigation' | 'cleared_no_fault' | 'forwarded_to_police';
}

export interface LedgerEntry {
  id: string;
  timestamp: string;
  entryType: 'fare_settlement' | 'commission_debit' | 'spare_change_credit' | 'wallet_topup';
  debitAccount: string;
  creditAccount: string;
  amountDzd: number;
  description: string;
}

export interface WalletBalances {
  cashInTransit_1010: number;    // Driver pockets (Account 1010)
  digitalEscrow_1020: number;    // Chargily clearing (Account 1020)
  riderTrustDesk_2010: number;   // Rider balance (Account 2010)
  driverOperational_2020: number;// Driver operating balance (Account 2020)
  platformRevenue_4010: number;  // Platform booking fees (Account 4010)
}
