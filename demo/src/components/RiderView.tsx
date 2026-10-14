import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation2, 
  ShieldCheck, 
  ShieldAlert,
  Star, 
  Car, 
  Users, 
  Compass, 
  CreditCard, 
  Wallet, 
  Banknote, 
  Copy, 
  Check,
  Zap,
  Calendar,
  Clock,
  UserCheck,
  HeartHandshake,
  Repeat,
  Globe,
  Maximize2,
  Smartphone as SmartphoneIcon,
  Search,
  PhoneCall,
  AlertTriangle
} from 'lucide-react';

import type { 
  LocationPoint, 
  ServiceMode, 
  PaymentMethod, 
  RideRequest, 
  DriverProfile,
  BookingType,
  RecurringDay,
  RecurringSchedule,
  ThirdPartySponsor
} from '../types';
import { ALGIERS_LOCATIONS } from '../data/mockData';
import { ChargilyTopupModal } from './ChargilyTopupModal';
import { BaridiMobModal } from './BaridiMobModal';
import { InteractiveMap } from './InteractiveMap';
import { soundEngine } from '../utils/audio';
import type { AppLang } from '../utils/i18n';
import { getTranslation } from '../utils/i18n';
import { 
  fetchLiveForex, 
  checkPwnedPinOrPassword, 
  reverseGeocodeAlgiers, 
  type ForexRates, 
  type PwnedCheckResult, 
  type GeocodedAddress 
} from '../utils/publicApis';

interface RiderViewProps {
  currentRide: RideRequest | null;
  driver: DriverProfile;
  riderWalletBalanceDzd: number;
  onRequestRide: (
    mode: ServiceMode, 
    origin: LocationPoint, 
    dest: LocationPoint, 
    payment: PaymentMethod,
    options?: {
      bookingType?: BookingType;
      recurringSchedule?: RecurringSchedule;
      sponsor?: ThirdPartySponsor;
    }
  ) => void;
  onCancelRide: () => void;
  onTopupRiderWallet?: (amountDzd: number) => void;
  lang?: AppLang;
}

const RECURRING_DAYS_LIST: { id: RecurringDay; labelFr: string; labelAr: string; labelEn: string }[] = [
  { id: 'dim', labelFr: 'Dim', labelAr: 'أحد', labelEn: 'Sun' },
  { id: 'lun', labelFr: 'Lun', labelAr: 'إثن', labelEn: 'Mon' },
  { id: 'mar', labelFr: 'Mar', labelAr: 'ثلا', labelEn: 'Tue' },
  { id: 'mer', labelFr: 'Mer', labelAr: 'أرب', labelEn: 'Wed' },
  { id: 'jeu', labelFr: 'Jeu', labelAr: 'خم', labelEn: 'Thu' },
  { id: 'ven', labelFr: 'Ven', labelAr: 'جم', labelEn: 'Fri' },
  { id: 'sam', labelFr: 'Sam', labelAr: 'سب', labelEn: 'Sat' },
];

const POPULAR_CHIPS = [
  { id: 'loc-1', name: 'Grande Poste', nameAr: 'البريد المركزي', icon: '🏛️', tag: 'Alger Centre' },
  { id: 'loc-6', name: 'Aéroport Houari Boumediene', nameAr: 'مطار هواري بومدين', icon: '✈️', tag: 'Dar El Beïda' },
  { id: 'loc-4', name: 'Hydra - Ambassades', nameAr: 'حيدرة - السفارات', icon: '🌲', tag: 'Hydra' },
  { id: 'loc-5', name: 'Université USTHB', nameAr: 'جامعة باب الزوار', icon: '🎓', tag: 'Bab Ezzouar' },
  { id: 'loc-7', name: 'Gare Caroubier', nameAr: 'محطة الخروبة', icon: '🚌', tag: 'Hussein Dey' },
  { id: 'loc-3', name: 'Kouba Centre', nameAr: 'وسط القبة', icon: '📍', tag: 'Kouba' },
];

export const RiderView: React.FC<RiderViewProps> = ({
  currentRide,
  driver,
  riderWalletBalanceDzd,
  onRequestRide,
  onCancelRide,
  onTopupRiderWallet,
  lang = 'fr',
}) => {
  // Display Viewport Mode: Smartphone Mockup vs Wide Desktop Canvas
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Booking Type Switch: Instant vs Dedicated Recurring Chauffeur
  const [bookingType, setBookingType] = useState<BookingType>('instant');

  // Service Mode & Route
  const [selectedMode, setSelectedMode] = useState<ServiceMode>('taxi_individuel_metered');
  const [origin, setOrigin] = useState<LocationPoint>(ALGIERS_LOCATIONS[2]); // Kouba
  const [destination, setDestination] = useState<LocationPoint>(ALGIERS_LOCATIONS[0]); // Grande Poste
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');

  // Recurring Chauffeur Configuration
  const [selectedDays, setSelectedDays] = useState<RecurringDay[]>(['dim', 'lun', 'mar', 'mer', 'jeu']);
  const [pickupTime, setPickupTime] = useState<string>('07:45');
  const [hasReturnTrip, setHasReturnTrip] = useState<boolean>(true);
  const [returnTime, setReturnTime] = useState<string>('16:30');
  const [durationWeeks, setDurationWeeks] = useState<number>(2);
  const [purpose, setPurpose] = useState<'school_run' | 'work_commute' | 'medical_regular' | 'custom'>('school_run');

  // Third-Party Sponsored Payment Configuration
  const [isSponsored, setIsSponsored] = useState<boolean>(false);
  const [sponsorName, setSponsorName] = useState<string>('Karim Benali (Père)');
  const [sponsorPhone, setSponsorPhone] = useState<string>('0661 24 88 12');
  const [sponsorRelation, setSponsorRelation] = useState<'parent' | 'enterprise' | 'relative' | 'other'>('parent');
  const [sponsorPaymentMethod, setSponsorPaymentMethod] = useState<'cib' | 'edahabia' | 'baridimob' | 'trustdesk_wallet'>('cib');

  // Modal & PIN states
  const [isTopupOpen, setIsTopupOpen] = useState(false);
  const [isBaridiMobOpen, setIsBaridiMobOpen] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);

  // Zero-Key Public APIs Integration (Frankfurter, HaveIBeenPwned, Nominatim)
  const [currency, setCurrency] = useState<'DZD' | 'EUR' | 'USD'>('DZD');
  const [forexRates, setForexRates] = useState<ForexRates | null>(null);
  const [pinAudit, setPinAudit] = useState<PwnedCheckResult | null>(null);
  const [pickupAddress, setPickupAddress] = useState<GeocodedAddress | null>(null);

  // Fetch ECB live exchange rates (Frankfurter)
  useEffect(() => {
    fetchLiveForex().then(rates => setForexRates(rates));
  }, []);

  // Audit Pickup PIN with HaveIBeenPwned k-Anonymity (Law 18-07 privacy)
  useEffect(() => {
    if (currentRide?.pickupPin) {
      checkPwnedPinOrPassword(currentRide.pickupPin).then(res => setPinAudit(res));
    }
  }, [currentRide?.pickupPin]);

  // Reverse geocode pickup location in Algiers (Nominatim OpenStreetMap)
  useEffect(() => {
    reverseGeocodeAlgiers(origin.lat, origin.lng).then(geo => setPickupAddress(geo));
  }, [origin.lat, origin.lng]);

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);

  // Pricing calculations
  const instantEstimatedFare = selectedMode === 'taxi_individuel_metered' ? 850 : selectedMode === 'taxi_collectif_urbain' ? 50 : 350;
  
  // Recurring Calculations:
  const tripsPerDay = hasReturnTrip ? 2 : 1;
  const tripsPerWeek = selectedDays.length * tripsPerDay;
  const totalTripsCount = tripsPerWeek * durationWeeks;
  const ratePerTripDzd = 700; // Regulated subscriber rate
  const weeklyBaseFareDzd = tripsPerWeek * ratePerTripDzd;
  const totalPackageFareDzd = totalTripsCount * ratePerTripDzd;

  const handleCopyPin = (pin: string) => {
    soundEngine.playClick();
    navigator.clipboard?.writeText(pin);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  const toggleDay = (day: RecurringDay) => {
    soundEngine.playSelection();
    if (selectedDays.includes(day)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter(d => d !== day));
      }
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSelectQuickDestination = (locId: string) => {
    const loc = ALGIERS_LOCATIONS.find(l => l.id === locId);
    if (loc) {
      soundEngine.playSelection();
      setDestination(loc);
    }
  };

  const handleOrder = () => {
    soundEngine.playSuccessChime();

    const recurringSchedule: RecurringSchedule | undefined = bookingType === 'recurring_chauffeur' ? {
      days: selectedDays,
      pickupTime,
      hasReturnTrip,
      returnTime: hasReturnTrip ? returnTime : undefined,
      durationWeeks,
      purpose,
      dedicatedChauffeurName: driver.fullName,
      totalTripsCount,
      weeklyBaseFareDzd,
    } : undefined;

    const sponsor: ThirdPartySponsor | undefined = isSponsored ? {
      isSponsored: true,
      sponsorName,
      sponsorPhone,
      sponsorRelation,
      sponsorPaymentMethod,
      isPaidInAdvance: true,
      satimAuthCode: `SATIM-${Math.floor(100000 + Math.random() * 900000)}`,
    } : undefined;

    const chosenPayment = isSponsored ? sponsorPaymentMethod : paymentMethod;

    onRequestRide(
      selectedMode,
      origin,
      destination,
      chosenPayment,
      {
        bookingType,
        recurringSchedule,
        sponsor,
      }
    );
  };

  // Reusable Top Navigation / Status Header inside the Rider experience
  const renderRiderHeader = () => (
    <div className="border-b border-slate-200 dark:border-white/10 px-4 py-3 flex items-center justify-between bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-20">
      <div>
        <h2 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center space-x-1.5">
          <span>{t('riderPhoneHeader')}</span>
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
        </h2>
        <p className="text-[10px] text-slate-500 dark:text-slate-400">{t('riderSubheader')}</p>
      </div>

      <div className="flex items-center space-x-2">
        {/* Stored-Value Wallet Pill */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-mono font-bold shadow-sm">
          <Wallet className="w-3.5 h-3.5 text-emerald-500" />
          <span>{riderWalletBalanceDzd.toFixed(2)} DA</span>
        </div>

        {/* CIB & BaridiMob Quick Recharge */}
        {onTopupRiderWallet && (
          <div className="flex items-center space-x-1">
            <button
              onClick={() => { soundEngine.playClick(); setIsTopupOpen(true); }}
              title="Recharge par Carte CIB / Edahabia"
              className="px-2 py-1 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-400/30 hover:bg-blue-500/30 transition-colors text-[10px] font-bold cursor-pointer"
            >
              CIB
            </button>
            <button
              onClick={() => { soundEngine.playClick(); setIsBaridiMobOpen(true); }}
              title="Recharge BaridiMob"
              className="px-2 py-1 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-400/30 hover:bg-amber-500/30 transition-colors text-[10px] font-bold cursor-pointer"
            >
              Baridi
            </button>
          </div>
        )}

        {/* Smartphone vs Full Screen Toggle */}
        <button
          onClick={() => { soundEngine.playClick(); setIsFullScreen(!isFullScreen); }}
          className="p-1.5 rounded-xl border border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
          title={isFullScreen ? t('phoneFrame') : t('fullScreen')}
        >
          {isFullScreen ? <SmartphoneIcon className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  // Content for Booking Drawer (Selection of Category, Route, Chauffeur, Payment)
  const renderBookingPanel = () => (
    <div className="space-y-4">
      {/* 1. Quick "Where to?" Destination Chips */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Search className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t('recentPlaces')}</span>
          </span>
          <span className="text-[10px] text-slate-400 font-normal">1-Clic</span>
        </label>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {POPULAR_CHIPS.map(chip => {
            const isSelected = destination.id === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => handleSelectQuickDestination(chip.id)}
                className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-500 text-slate-900 dark:text-white shadow-sm'
                    : 'bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-emerald-500/40'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-base">{chip.icon}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                </div>
                <div className="font-extrabold text-[11px] leading-tight truncate">
                  {lang === 'ar' ? chip.nameAr : chip.name}
                </div>
                <div className="text-[9px] text-slate-400 truncate mt-0.5">
                  {chip.tag}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Service Mode Category Cards (Instant vs Dedicated Recurring) */}
      <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-900 border border-slate-300/60 dark:border-white/10 text-xs font-bold">
        <button
          type="button"
          onClick={() => { soundEngine.playSelection(); setBookingType('instant'); }}
          className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            bookingType === 'instant'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-emerald-500" />
          <span>{t('bookingInstant')}</span>
        </button>
        <button
          type="button"
          onClick={() => { soundEngine.playSelection(); setBookingType('recurring_chauffeur'); }}
          className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            bookingType === 'recurring_chauffeur'
              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{t('bookingRecurring')}</span>
        </button>
      </div>

      {/* 3. If Recurring Chauffeur: Detailed Configuration */}
      {bookingType === 'recurring_chauffeur' && (
        <div className="p-3.5 rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 space-y-3 animate-fadeIn">
          <div>
            <h3 className="font-extrabold text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Repeat className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t('recurringTitle')}</span>
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              {t('recurringSubtitle')}
            </p>
          </div>

          {/* Days of Week Selector */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-bold text-slate-700 dark:text-slate-300">{t('recurringDaysLabel')}</span>
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => { soundEngine.playSelection(); setSelectedDays(['dim', 'lun', 'mar', 'mer', 'jeu']); }}
                  className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[9px] font-bold hover:bg-emerald-500/30 cursor-pointer"
                >
                  Dim-Jeu
                </button>
                <button
                  type="button"
                  onClick={() => { soundEngine.playSelection(); setSelectedDays(['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam']); }}
                  className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[9px] font-bold hover:bg-slate-300 cursor-pointer"
                >
                  7j/7
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {RECURRING_DAYS_LIST.map(day => {
                const isSelected = selectedDays.includes(day.id);
                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => toggleDay(day.id)}
                    className={`py-1.5 rounded-xl text-center text-[10px] font-bold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                        : 'bg-white/60 dark:bg-slate-950/60 text-slate-400 border-slate-200 dark:border-white/10 hover:border-slate-300'
                    }`}
                  >
                    {lang === 'ar' ? day.labelAr : lang === 'en' ? day.labelEn : day.labelFr}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Morning & Return Pickup Times */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 space-y-1">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-500" />
                <span>{t('recurringPickupTime')}</span>
              </label>
              <input 
                type="time" 
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full text-xs font-mono font-bold p-1 bg-transparent border-b border-emerald-400 text-slate-900 dark:text-white"
              />
            </div>

            <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3 h-3 text-blue-500" />
                  <span>{t('recurringReturnTime')}</span>
                </label>
                <input 
                  type="checkbox"
                  checked={hasReturnTrip}
                  onChange={(e) => setHasReturnTrip(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-0 cursor-pointer"
                />
              </div>
              <input 
                type="time" 
                value={returnTime}
                disabled={!hasReturnTrip}
                onChange={(e) => setReturnTime(e.target.value)}
                className={`w-full text-xs font-mono font-bold p-1 bg-transparent border-b text-slate-900 dark:text-white ${
                  hasReturnTrip ? 'border-blue-400' : 'border-slate-300 opacity-40'
                }`}
              />
            </div>
          </div>

          {/* Duration in Weeks */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                {t('recurringDuration')}
              </label>
              <select
                value={durationWeeks}
                onChange={(e) => setDurationWeeks(Number(e.target.value))}
                className="w-full p-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              >
                <option value={1}>{t('recurringDuration1W')}</option>
                <option value={2}>{t('recurringDuration2W')}</option>
                <option value={4}>{t('recurringDuration4W')}</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                Motif du déplacement :
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as any)}
                className="w-full p-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              >
                <option value="school_run">Scolaire / Enfants</option>
                <option value="work_commute">Trajet Travail / Bureau</option>
                <option value="medical_regular">Visites Médicales</option>
                <option value="custom">Autre Déplacement Régulier</option>
              </select>
            </div>
          </div>

          {/* Assigned Driver Profile Card */}
          <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2.5">
              <img src={driver.photoUrl} alt={driver.fullName} className="w-9 h-9 rounded-xl object-contain border border-emerald-500/30 bg-slate-950 p-0.5" />
              <div>
                <div className="font-extrabold text-slate-900 dark:text-white text-[11px] flex items-center gap-1">
                  <span>{driver.fullName}</span>
                  <UserCheck className="w-3 h-3 text-emerald-500" />
                </div>
                <div className="text-[9px] text-slate-500 dark:text-slate-400">
                  Agrément DTW : {driver.agrementNumber} • {driver.vehicleMake} {driver.vehicleModel}
                </div>
              </div>
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
              Titulaire Garanti
            </span>
          </div>
        </div>
      )}

      {/* 4. Instant Vehicles Classification Cards */}
      {bookingType === 'instant' && (
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            {t('riderSelectMode')}
          </label>
          
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => { soundEngine.playSelection(); setSelectedMode('taxi_individuel_metered'); }}
              className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                selectedMode === 'taxi_individuel_metered'
                  ? 'bg-emerald-500/15 border-emerald-500 shadow-md shadow-emerald-500/10'
                  : 'border-slate-200 dark:border-white/10 text-slate-500 hover:border-slate-300 dark:hover:border-white/20'
              }`}
            >
              <Car className={`w-5 h-5 mb-1 ${selectedMode === 'taxi_individuel_metered' ? 'text-emerald-500' : 'text-slate-400'}`} />
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">Individuel</div>
                <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold">+100 DA Approche</div>
              </div>
            </button>

            <button
              onClick={() => { soundEngine.playSelection(); setSelectedMode('taxi_collectif_urbain'); }}
              className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                selectedMode === 'taxi_collectif_urbain'
                  ? 'bg-blue-500/15 border-blue-500 shadow-md shadow-blue-500/10'
                  : 'border-slate-200 dark:border-white/10 text-slate-500 hover:border-slate-300 dark:hover:border-white/20'
              }`}
            >
              <Users className={`w-5 h-5 mb-1 ${selectedMode === 'taxi_collectif_urbain' ? 'text-blue-500' : 'text-slate-400'}`} />
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">Collectif</div>
                <div className="text-[9px] text-blue-600 dark:text-blue-400 font-semibold">50 DA/place</div>
              </div>
            </button>

            <button
              onClick={() => { soundEngine.playSelection(); setSelectedMode('taxi_collectif_inter_wilayas'); }}
              className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                selectedMode === 'taxi_collectif_inter_wilayas'
                  ? 'bg-indigo-500/15 border-indigo-500 shadow-md shadow-indigo-500/10'
                  : 'border-slate-200 dark:border-white/10 text-slate-500 hover:border-slate-300 dark:hover:border-white/20'
              }`}
            >
              <Compass className={`w-5 h-5 mb-1 ${selectedMode === 'taxi_collectif_inter_wilayas' ? 'text-indigo-500' : 'text-slate-400'}`} />
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">Inter-Wilaya</div>
                <div className="text-[9px] text-indigo-600 dark:text-indigo-400 font-semibold">Caroubier</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* 5. Origin & Destination Input Boxes */}
      <div className="space-y-2.5 p-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/40">
        <div className="space-y-1">
          <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t('riderPickup')}</span>
          </label>
          <select 
            value={origin.id}
            onChange={(e) => {
              const loc = ALGIERS_LOCATIONS.find(l => l.id === e.target.value);
              if (loc) setOrigin(loc);
            }}
            className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
          >
            {ALGIERS_LOCATIONS.map(loc => (
              <option key={loc.id} value={loc.id}>
                {lang === 'ar' ? loc.nameAr : loc.name}
              </option>
            ))}
          </select>
          {pickupAddress && (
            <div className="pt-1 text-[9px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center space-x-1 truncate">
              <span className="font-bold">📍 OpenStreetMap :</span>
              <span className="truncate">{pickupAddress.formatted}</span>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <Navigation2 className="w-3.5 h-3.5 text-blue-500" />
            <span>{t('riderDestination')}</span>
          </label>
          <select 
            value={destination.id}
            onChange={(e) => {
              const loc = ALGIERS_LOCATIONS.find(l => l.id === e.target.value);
              if (loc) setDestination(loc);
            }}
            className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
          >
            {ALGIERS_LOCATIONS.map(loc => (
              <option key={loc.id} value={loc.id}>
                {lang === 'ar' ? loc.nameAr : loc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 6. Third-Party Sponsored Payment ("Payer pour un Proche / CB") */}
      <div className="p-3.5 rounded-2xl border border-blue-500/30 bg-blue-500/5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HeartHandshake className="w-4 h-4 text-blue-500" />
            <div>
              <span className="font-extrabold text-xs text-blue-600 dark:text-blue-300 block">
                {t('sponsorToggleLabel')}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                {t('sponsorToggleDesc')}
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={isSponsored}
            onChange={(e) => {
              soundEngine.playSelection();
              setIsSponsored(e.target.checked);
            }}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
        </div>

        {isSponsored && (
          <div className="pt-2 border-t border-blue-500/20 space-y-2.5 animate-fadeIn">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
                  {t('sponsorNameLabel')}
                </label>
                <input
                  type="text"
                  value={sponsorName}
                  onChange={(e) => setSponsorName(e.target.value)}
                  placeholder="Nom du payeur"
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
                  {t('sponsorPhoneLabel')}
                </label>
                <input
                  type="tel"
                  value={sponsorPhone}
                  onChange={(e) => setSponsorPhone(e.target.value)}
                  placeholder="0661..."
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
                  {t('sponsorRelationLabel')}
                </label>
                <select
                  value={sponsorRelation}
                  onChange={(e) => setSponsorRelation(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white font-semibold"
                >
                  <option value="parent">{t('sponsorRelParent')}</option>
                  <option value="enterprise">{t('sponsorRelEnterprise')}</option>
                  <option value="relative">{t('sponsorRelRelative')}</option>
                  <option value="other">{t('sponsorRelOther')}</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
                  {t('sponsorMethodLabel')}
                </label>
                <select
                  value={sponsorPaymentMethod}
                  onChange={(e) => setSponsorPaymentMethod(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white font-semibold"
                >
                  <option value="cib">Carte CIB / Edahabia</option>
                  <option value="baridimob">BaridiMob (CCP)</option>
                  <option value="trustdesk_wallet">Compte Entreprise</option>
                </select>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-700 dark:text-blue-300 leading-snug">
              ✅ Le payeur règle la totalité par carte bancaire. Le passager n'a aucun montant en espèces à débourser.
            </div>
          </div>
        )}
      </div>

      {/* 7. Standard Payment Rail (If not sponsored) */}
      {!isSponsored && (
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            {t('riderPaymentMethod')}
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                paymentMethod === 'cash' 
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-300' 
                  : 'border-slate-200 dark:border-white/10 text-slate-500'
              }`}
            >
              <Banknote className="w-3.5 h-3.5" />
              <span>{t('riderCash')}</span>
            </button>

            <button
              onClick={() => setPaymentMethod('edahabia')}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                paymentMethod === 'edahabia' 
                  ? 'bg-blue-500/20 border-blue-500 text-blue-600 dark:text-blue-300' 
                  : 'border-slate-200 dark:border-white/10 text-slate-500'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>CIB</span>
            </button>

            <button
              onClick={() => setPaymentMethod('trustdesk_wallet')}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                paymentMethod === 'trustdesk_wallet' 
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-300' 
                  : 'border-slate-200 dark:border-white/10 text-slate-500'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Wallet</span>
            </button>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-700 dark:text-emerald-300 leading-snug">
            💡 <strong>Spare Change Flywheel :</strong> Si le chauffeur manque de monnaie, le reliquat est viré sur votre solde digital.
          </div>
        </div>
      )}

      {/* 8. Fare Calculation Summary & Order CTA */}
      <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {bookingType === 'recurring_chauffeur' ? t('recurringEstimatedTotal') : t('fareEstimated')}
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
              ~{currency === 'DZD' 
                ? (bookingType === 'recurring_chauffeur' ? totalPackageFareDzd.toFixed(2) : `${instantEstimatedFare}.00`) + ' DZD'
                : forexRates 
                ? (currency === 'EUR'
                    ? `${((bookingType === 'recurring_chauffeur' ? totalPackageFareDzd : instantEstimatedFare) / forexRates.eurToDzd).toFixed(2)} €`
                    : `$${((bookingType === 'recurring_chauffeur' ? totalPackageFareDzd : instantEstimatedFare) / forexRates.usdToDzd).toFixed(2)}`
                  )
                : (bookingType === 'recurring_chauffeur' ? totalPackageFareDzd.toFixed(2) : `${instantEstimatedFare}.00`) + ' DZD'
              }
            </span>
          </div>
        </div>

        {/* Currency Switcher (Frankfurter ECB Live Reference) */}
        {forexRates && (
          <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-200 dark:border-white/5">
            <span className="text-slate-500 flex items-center gap-1">
              <Globe className="w-3 h-3 text-blue-500" />
              <span>Devise (BCE Frankfurter) :</span>
            </span>
            <div className="flex items-center space-x-1 font-mono">
              {(['DZD', 'EUR', 'USD'] as const).map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => { soundEngine.playClick(); setCurrency(c); }}
                  className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold cursor-pointer transition-colors ${
                    currency === c 
                      ? 'bg-emerald-500 text-white' 
                      : 'text-slate-400 hover:text-white bg-white/5'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {bookingType === 'recurring_chauffeur' ? (
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>{tripsPerWeek} {t('recurringTripsCount')} / sem.</span>
            <span>Forfait {durationWeeks} sem. ({totalTripsCount} courses)</span>
          </div>
        ) : (
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Distance : ~8.4 km</span>
            <span>Durée : ~18 mins</span>
          </div>
        )}

        {isSponsored && (
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-between">
            <span>{t('sponsorPaidBadge')}</span>
            <span>{sponsorName}</span>
          </div>
        )}
      </div>

      <button
        onClick={handleOrder}
        className="w-full py-3.5 rounded-2xl text-white font-extrabold text-sm shadow-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
      >
        {bookingType === 'recurring_chauffeur' ? t('recurringOrderBtn') : t('riderOrderBtn')}
      </button>
    </div>
  );

  // Content for Active Trip Tracking (Searching, Assigned, In-Progress, Completed)
  const renderActiveTripPanel = () => {
    if (!currentRide) return null;

    // A. SEARCHING / MATCHING
    if (currentRide.status === 'requesting' || currentRide.status === 'matching') {
      return (
        <div className="p-6 text-center space-y-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 mx-auto flex items-center justify-center animate-pulse">
            <Car className="w-8 h-8 text-emerald-500 animate-bounce" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            {currentRide.bookingType === 'recurring_chauffeur' 
              ? 'Attribution de votre Chauffeur Titulaire...' 
              : t('riderSearching')}
          </h3>
          <p className="text-xs text-slate-500">
            Course {currentRide.rideCode} • Décret 12-230
          </p>
          <button
            onClick={() => { soundEngine.playClick(); onCancelRide(); }}
            className="text-xs text-rose-500 hover:underline font-bold pt-2 cursor-pointer"
          >
            {t('riderCancelTrip')}
          </button>
        </div>
      );
    }

    // B. DRIVER ASSIGNED / ARRIVED
    if (currentRide.status === 'driver_assigned' || currentRide.status === 'driver_arrived') {
      return (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-between text-xs font-bold">
            <span>
              {currentRide.bookingType === 'recurring_chauffeur'
                ? t('recurringActiveBadge')
                : t('riderAssignedTitle')}
            </span>
            <span className="font-mono">Code : {currentRide.rideCode}</span>
          </div>

          {/* 4-Digit Safety Boarding PIN with k-Anonymity verification */}
          <div className="p-4 rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/5 text-center space-y-2">
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
              {t('riderPinTitle')}
            </span>
            <div className="flex items-center justify-center space-x-3">
              <span className="text-3xl font-black font-mono tracking-widest text-slate-900 dark:text-white">
                {currentRide.pickupPin}
              </span>
              <button
                onClick={() => handleCopyPin(currentRide.pickupPin)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                title={t('riderCopyPin')}
              >
                {copiedPin ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
              </button>
            </div>

            {pinAudit && (
              <div className={`p-2 rounded-xl text-[10px] font-mono flex items-center justify-center space-x-1.5 border ${
                pinAudit.isCompromised 
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold'
              }`}>
                {pinAudit.isCompromised ? (
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                )}
                <span>{pinAudit.statusLabel} • {pinAudit.lawComplianceText}</span>
              </div>
            )}
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {t('riderPinNotice')}
            </p>
          </div>

          {/* Driver Credentials & Vehicle Medallion */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/40 space-y-3">
            <div className="flex items-center space-x-3">
              <img src={driver.photoUrl} alt={driver.fullName} className="w-12 h-12 rounded-xl object-contain border border-emerald-500/30 bg-slate-950 p-0.5" />
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{driver.fullName}</h4>
                <div className="flex items-center space-x-1 text-xs text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{driver.rating}</span>
                  <span className="text-slate-400 font-normal">• {driver.totalTrips} courses</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300">
              <div>
                <span className="text-slate-400 block text-[9px]">Agrément DTW :</span>
                <span className="font-mono font-bold">{driver.agrementNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px]">Livret de Place :</span>
                <span className="font-mono font-bold">{driver.livretDePlaceNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px]">Véhicule :</span>
                <span className="font-semibold">{driver.vehicleMake} {driver.vehicleModel}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px]">Plaque :</span>
                <span className="font-mono font-bold">{driver.licensePlate}</span>
              </div>
            </div>

            {/* Direct Call & SOS Emergency Security Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
              <a
                href={`tel:${driver.phone.replace(/\s+/g, '')}`}
                className="py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-emerald-500/30"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Appeler</span>
              </a>
              <button
                type="button"
                onClick={() => soundEngine.playCrashSonar()}
                className="py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-rose-500/30 cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>SOS 1548</span>
              </button>
            </div>
          </div>

          <button
            onClick={() => { soundEngine.playClick(); onCancelRide(); }}
            className="w-full py-2.5 rounded-xl border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 text-xs font-bold transition-all cursor-pointer"
          >
            {t('riderCancelTrip')}
          </button>
        </div>
      );
    }

    // C. IN PROGRESS
    if (currentRide.status === 'in_progress' || currentRide.status === 'fare_entry' || currentRide.status === 'spare_change_prompt') {
      return (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-300 text-xs font-bold flex items-center justify-between">
            <span>{t('riderTripInProgress')}</span>
            <span className="font-mono">{currentRide.rideCode}</span>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/40 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400 mx-auto flex items-center justify-center">
              <Navigation2 className="w-6 h-6 text-emerald-500 animate-spin" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Vers : {destination.name}
            </h4>
            <p className="text-xs text-slate-500">
              Compteur fiscal et caméra de bord télématique en service
            </p>
          </div>
        </div>
      );
    }

    // D. COMPLETED
    if (currentRide.status === 'completed') {
      return (
        <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-center space-y-4 animate-fadeIn">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500 mx-auto flex items-center justify-center">
            <Check className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="font-extrabold text-base text-emerald-600 dark:text-emerald-400">
            {t('riderTripCompleted')}
          </h3>
          
          <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
            <p>Total réglé : <strong>{currentRide.totalFareDzd.toFixed(2)} DZD</strong></p>
            {currentRide.sponsor?.isSponsored ? (
              <p className="text-emerald-600 dark:text-emerald-400 font-bold">
                Paiement réglé par le sponsor ({currentRide.sponsor.sponsorName}) via CIB SATIM
              </p>
            ) : currentRide.spareChangeCreditedDzd ? (
              <p className="text-emerald-600 dark:text-emerald-400 font-bold">
                Reliquat crédité : +{currentRide.spareChangeCreditedDzd.toFixed(2)} DA sur TrustDesk
              </p>
            ) : null}
          </div>

          <button
            onClick={() => onCancelRide()}
            className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs cursor-pointer shadow-md"
          >
            Nouvelle Course / Navette
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full">
      {/* VIEWPORT MODE 1: FULL SCREEN DESKTOP CANVAS (Integrated Map + Floating Booking Drawer) */}
      {isFullScreen ? (
        <div className="w-full rounded-3xl overflow-hidden glass-panel border border-slate-200 dark:border-white/10 shadow-2xl relative min-h-[760px] flex flex-col">
          {renderRiderHeader()}

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 relative">
            {/* Left Column: Interactive Booking / Trip Tracking Panel (4 cols) */}
            <div className="lg:col-span-4 p-4 lg:p-6 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-white/10 overflow-y-auto max-h-[760px] bg-white/60 dark:bg-slate-950/60 backdrop-blur-md">
              {!currentRide || currentRide.status === 'idle' ? renderBookingPanel() : renderActiveTripPanel()}
            </div>

            {/* Right Column: Expansive Interactive Algiers Map (8 cols) */}
            <div className="lg:col-span-8 h-[500px] lg:h-auto min-h-[500px] relative">
              <InteractiveMap
                origin={origin}
                destination={destination}
                driverLat={driver.currentLat}
                driverLng={driver.currentLng}
                driverHeading={driver.heading}
                rideStatus={currentRide?.status || 'idle'}
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      ) : (
        /* VIEWPORT MODE 2: AUTHENTIC SMARTPHONE FRAME WITH INTEGRATED LIVE MAP */
        <div className="smartphone-frame mx-auto max-w-sm sm:max-w-md">
          <div className="smartphone-screen flex flex-col h-[780px] relative border transition-colors shadow-inner overflow-hidden">
            
            {/* Notch & Status Bar */}
            <div className="px-6 pt-3 pb-2 flex items-center justify-between text-xs text-slate-500 font-mono select-none border-b border-slate-200 dark:border-white/10 bg-slate-100/90 dark:bg-slate-950/90 shrink-0">
              <span className="font-bold text-slate-800 dark:text-white">16:42</span>
              <div className="smartphone-notch">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900 dark:bg-slate-800 border border-slate-700"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              </div>
              <div className="flex items-center space-x-1.5 text-[10px]">
                <span className="text-emerald-500 font-bold">4G Mobilis</span>
                <span>100%</span>
              </div>
            </div>

            {renderRiderHeader()}

            {/* Live Interactive Map Embedded at Top Half of Smartphone (h-[260px]) */}
            <div className="h-[250px] w-full shrink-0 relative border-b border-slate-200 dark:border-white/10 shadow-inner">
              <InteractiveMap
                origin={origin}
                destination={destination}
                driverLat={driver.currentLat}
                driverLng={driver.currentLng}
                driverHeading={driver.heading}
                rideStatus={currentRide?.status || 'idle'}
                className="h-full w-full"
              />
              <div className="absolute top-2 left-2 z-[400] pointer-events-none">
                <span className="px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[9px] font-mono font-bold text-emerald-400 border border-emerald-500/30 shadow-md">
                  GPS Alger • {origin.commune}
                </span>
              </div>
            </div>

            {/* Bottom Half: Scrollable Booking & Status Sheet */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/95 dark:bg-slate-900/95">
              {!currentRide || currentRide.status === 'idle' ? renderBookingPanel() : renderActiveTripPanel()}
            </div>

          </div>
        </div>
      )}

      {/* Top-up Modals */}
      {onTopupRiderWallet && (
        <>
          <ChargilyTopupModal
            isOpen={isTopupOpen}
            onClose={() => setIsTopupOpen(false)}
            onSuccess={(amt) => { onTopupRiderWallet(amt); setIsTopupOpen(false); }}
            targetAccountName="Portefeuille Passager (2010)"
          />
          <BaridiMobModal
            isOpen={isBaridiMobOpen}
            onClose={() => setIsBaridiMobOpen(false)}
            onSuccess={(amt) => { onTopupRiderWallet(amt); setIsBaridiMobOpen(false); }}
            targetAccountName="Portefeuille Passager (2010)"
          />
        </>
      )}
    </div>
  );
};
