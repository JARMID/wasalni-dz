import React, { useState } from 'react';
import { 
  MapPin, 
  Car, 
  Clock, 
  Train, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Building2,
  Navigation
} from 'lucide-react';
import type { AppLang } from '../utils/i18n';
import { soundEngine } from '../utils/audio';

interface DairaData {
  id: string;
  nameFr: string;
  nameAr: string;
  communes: string[];
  stations: string[];
  activeTaxis: number;
  avgEta: string;
  typicalKmToCenter: number;
  transportLinks: string;
  hubBadge: string;
}

const ALGIERS_DAIRAS: DairaData[] = [
  {
    id: 'sidi-mhamed',
    nameFr: 'Sidi M\'Hamed (Alger-Centre)',
    nameAr: 'سيدي امحمد (الجزائر الوسطى)',
    communes: ['Alger-Centre', 'Sidi M\'Hamed', 'El Madania', 'El Mouradia'],
    stations: ['Grande Poste', 'Place du 1er Mai', 'Tafourah', 'Port d\'Alger', 'Hôpital Mustapha'],
    activeTaxis: 52,
    avgEta: '2.1 min',
    typicalKmToCenter: 3.5,
    transportLinks: 'Métro L1 (Tafourah, Khelifa Boukhalfa), Téléphérique El Madania, Gare SNTF Agha',
    hubBadge: 'Cœur Métropolitain',
  },
  {
    id: 'dar-el-beida',
    nameFr: 'Dar El Beïda (Aéroport & Affaires)',
    nameAr: 'الدار البيضاء (المطار والأعمال)',
    communes: ['Dar El Beïda', 'Bab Ezzouar', 'Bordj El Kiffan', 'El Mohammadia', 'Bordj El Bahri', 'El Marsa'],
    stations: ['Aéroport T4 International', 'Centre d\'Affaires Bab Ezzouar', 'Campus USTHB', 'SAFEX Pins Maritimes'],
    activeTaxis: 64,
    avgEta: '2.0 min',
    typicalKmToCenter: 18.0,
    transportLinks: 'Ligne Tramway T1 (38 stations), Gare SNTF Bab Ezzouar, Navettes Express T4',
    hubBadge: 'Pôle Aérien & Tertiaire',
  },
  {
    id: 'hussein-dey',
    nameFr: 'Hussein Dey (Kouba & Ruisseau)',
    nameAr: 'حسين داي (القبة والرويسو)',
    communes: ['Hussein Dey', 'Kouba', 'El Magharia', 'Bourouba'],
    stations: ['Place de Kouba', 'Hôpital Parnet', 'Ruisseau (Pôle Multimodal)', 'Calvaire'],
    activeTaxis: 44,
    avgEta: '2.3 min',
    typicalKmToCenter: 8.5,
    transportLinks: 'Métro L1 (Les Fusillés, Mer et Soleil), Tramway Ruisseau, Téléphérique Kouba',
    hubBadge: 'Nœud Multimodal Sud',
  },
  {
    id: 'bouzareah',
    nameFr: 'Bouzaréah (Hauts d\'Alger)',
    nameAr: 'بوزريعة (أعالي العاصمة)',
    communes: ['Bouzaréah', 'El Biar', 'Ben Aknoun', 'Béni Messous'],
    stations: ['Place Kennedy (El Biar)', 'Campus Ben Aknoun', 'Hôpital Béni Messous', 'Chevalley'],
    activeTaxis: 39,
    avgEta: '3.0 min',
    typicalKmToCenter: 7.2,
    transportLinks: 'Téléphérique Oued Koriche vers Bouzaréah, Lignes Express ETUSA',
    hubBadge: 'Hauteurs Universitaires',
  },
  {
    id: 'bir-mourad-rais',
    nameFr: 'Bir Mourad Raïs (Hydra & Sources)',
    nameAr: 'بئر مراد رايس (حيدرة والمصادر)',
    communes: ['Bir Mourad Raïs', 'Hydra', 'Birkhadem', 'Saoula', 'Djasr Kasentina'],
    stations: ['Place d\'Hydra', 'Station Les Sources', 'Station Birkhadem', 'Aïn Naâdja'],
    activeTaxis: 46,
    avgEta: '2.5 min',
    typicalKmToCenter: 9.0,
    transportLinks: 'Métro L1 (Aïn Naâdja, Gué de Constantine), Rocade Sud',
    hubBadge: 'Quartier d\'Affaires & Ambassades',
  },
  {
    id: 'cheraga',
    nameFr: 'Chéraga (Ouest Métropolitain)',
    nameAr: 'شراقة (الغرب الحضري)',
    communes: ['Chéraga', 'Dely Ibrahim', 'Ouled Fayet', 'Aïn Benian', 'El Hammamet'],
    stations: ['Rond-Point Chéraga', 'Bois des Cars', 'Port de La Madrague', 'Opéra d\'Alger'],
    activeTaxis: 35,
    avgEta: '3.2 min',
    typicalKmToCenter: 14.5,
    transportLinks: 'Connexion directe Autoroute Ouest et Rocade Sud',
    hubBadge: 'Artère Résidentielle & Côtière',
  },
  {
    id: 'bab-el-oued',
    nameFr: 'Bab El Oued (Façade Maritime)',
    nameAr: 'باب الوادي (الواجهة البحرية)',
    communes: ['Bab El Oued', 'Casbah', 'Bologhine', 'Oued Koriche', 'Raïs Hamidou'],
    stations: ['Place des Martyrs', 'Triolet', 'Esplanade Kitani', 'Notre-Dame d\'Afrique'],
    activeTaxis: 38,
    avgEta: '2.6 min',
    typicalKmToCenter: 2.8,
    transportLinks: 'Métro L1 (Place des Martyrs), Téléphérique Notre-Dame d\'Afrique',
    hubBadge: 'Patrimoine & Histoire',
  },
  {
    id: 'zeralda',
    nameFr: 'Zéralda & Staouéli (Pôle Littoral)',
    nameAr: 'زرالدة وسطاوالي (القطب الساحلي)',
    communes: ['Zéralda', 'Staouéli', 'Souidania', 'Rahmania', 'Mahelma'],
    stations: ['Gare SNTF Zéralda', 'Port de Sidi Fredj', 'Club des Pins', 'Palm Beach'],
    activeTaxis: 29,
    avgEta: '3.6 min',
    typicalKmToCenter: 28.5,
    transportLinks: 'Ligne ferroviaire rapide Birtouta vers Zéralda, Desserte Rocade Ouest',
    hubBadge: 'Littoral & Balnéaire',
  },
  {
    id: 'sidi-abdellah',
    nameFr: 'Sidi Abdellah (Pôle Technologique)',
    nameAr: 'سيدي عبد الله (المدينة التكنولوجية)',
    communes: ['Sidi Abdellah', 'Cyberparc', 'Cité Universitaire 10 000 lits', 'Zaâtria'],
    stations: ['Gare SNTF Cyberparc', 'Institut National des Télécommunications', 'Cité 5000 Logements'],
    activeTaxis: 26,
    avgEta: '3.4 min',
    typicalKmToCenter: 32.0,
    transportLinks: 'RER direct Sidi Abdellah vers Alger Agha',
    hubBadge: 'Pôle Innovation & Étudiant',
  },
  {
    id: 'baraki',
    nameFr: 'Baraki (Grande Banlieue Sud)',
    nameAr: 'براقي (الضاحية الجنوبية الكبرى)',
    communes: ['Baraki', 'Les Eucalyptus', 'Sidi Moussa'],
    stations: ['Stade Nelson Mandela', 'Centre Baraki', 'Route de Larbaa'],
    activeTaxis: 27,
    avgEta: '3.3 min',
    typicalKmToCenter: 15.0,
    transportLinks: 'Desserte Rocade Sud et accès Stade Nelson Mandela',
    hubBadge: 'Complexe Sportif & Échangeur',
  },
  {
    id: 'rouiba',
    nameFr: 'Rouïba & Reghaïa (Zone Industrielle)',
    nameAr: 'الرويبة والرغاية (المنطقة الصناعية)',
    communes: ['Rouïba', 'Reghaïa', 'Hraoua'],
    stations: ['Zone Industrielle SNVI', 'Gare SNTF Rouïba', 'Centre Commercial Reghaïa'],
    activeTaxis: 31,
    avgEta: '3.5 min',
    typicalKmToCenter: 24.0,
    transportLinks: 'RER Banlieue Est (Alger Agha vers Thenia), Autoroute de l\'Est',
    hubBadge: 'Pôle Industriel & Logistique',
  },
  {
    id: 'birtouta',
    nameFr: 'Birtouta (Carrefour Ferroviaire)',
    nameAr: 'بئر توتة (مفترق السكك الحديدية)',
    communes: ['Birtouta', 'Ouled Chebel', 'Tessala El Merdja'],
    stations: ['Gare de Jonction Birtouta', 'Centre Ouled Chebel'],
    activeTaxis: 22,
    avgEta: '3.8 min',
    typicalKmToCenter: 22.5,
    transportLinks: 'Gare SNTF de correspondance triple (Alger, Blida, Zéralda)',
    hubBadge: 'Porte Sud de la Capitale',
  },
  {
    id: 'draria',
    nameFr: 'Draria & Douéra (Sud-Ouest)',
    nameAr: 'الدرارية والدويرة (الجنوب الغربي)',
    communes: ['Draria', 'Baba Hassen', 'Douéra', 'El Achour', 'Khraïcia'],
    stations: ['Place Centrale de Draria', 'Stade de Douéra', 'Résidences El Achour'],
    activeTaxis: 33,
    avgEta: '3.1 min',
    typicalKmToCenter: 16.5,
    transportLinks: 'Boulevard Sud-Ouest et liaisons directes vers Ben Aknoun',
    hubBadge: 'Zone Résidentielle Émergente',
  },
];

interface CommunesExplorerProps {
  lang: AppLang;
  onSelectDistance?: (km: number) => void;
}

export const CommunesExplorer: React.FC<CommunesExplorerProps> = ({
  lang,
  onSelectDistance,
}) => {
  const isAr = lang === 'ar';
  const [selectedDairaId, setSelectedDairaId] = useState<string>('sidi-mhamed');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const activeDaira = ALGIERS_DAIRAS.find(d => d.id === selectedDairaId) || ALGIERS_DAIRAS[0];

  const filteredDairas = ALGIERS_DAIRAS.filter(d => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      d.nameFr.toLowerCase().includes(q) ||
      d.nameAr.includes(q) ||
      d.communes.some(c => c.toLowerCase().includes(q)) ||
      d.stations.some(s => s.toLowerCase().includes(q))
    );
  });

  const totalTaxis = ALGIERS_DAIRAS.reduce((sum, d) => sum + d.activeTaxis, 0);

  const handleApplyToTaximeter = (km: number) => {
    soundEngine.playCashRegisterDing();
    if (onSelectDistance) {
      onSelectDistance(km);
    }
    const el = document.getElementById('taximeter');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="communes" className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="rounded-3xl p-8 sm:p-12 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 shadow-2xl backdrop-blur-xl space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <MapPin className="w-3.5 h-3.5" />
            <span>{isAr ? 'شبكة ولاية الجزائر • 57 بلدية و13 دائرة' : 'Réseau Wilaya d\'Alger • 57 Communes & 13 Daïras'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            {isAr ? 'تغطية تزامنية كاملة لسيارات الأجرة المعتمدة بالعاصمة' : 'Explorateur Télématique des 57 Communes'}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {isAr 
              ? 'تحقق مباشرة من كثافة سيارات الأجرة في دائرتك، محطات التوقف الرسمية، ومعدل زمن وصول السائق إليك وفق معايير مديرية النقل.'
              : 'Consultez la densité de la flotte active dans votre Daïra, les stations homologuées par la DTW 16 et le temps d\'approche moyen calculé en temps réel.'}
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
            <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 font-bold flex items-center space-x-1.5">
              <Car className="w-3.5 h-3.5" />
              <span>{totalTaxis} {isAr ? 'سيارة أجرة نشطة بالشبكة' : 'Taxis Agréés Connectés en Direct'}</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-bold flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>{isAr ? 'معدل الوصول : أقل من 3.2 دقيقة' : 'Délai d\'approche moyen : < 3.2 min'}</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? '13 دائرة مغطاة 100%' : '13 Daïras Couvertes à 100%'}</span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="max-w-md mx-auto">
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder={isAr ? 'ابحث عن بلدية أو محطة (مثال: القبة، حيدرة، المطار...)' : 'Rechercher une Daïra, commune ou station (ex: Kouba, Hydra, Aéroport)...'}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Daïra Selection Pill Matrix */}
        <div className="flex flex-wrap gap-2 justify-center">
          {filteredDairas.map((daira) => {
            const isSelected = daira.id === selectedDairaId;
            return (
              <button
                key={daira.id}
                onClick={() => {
                  soundEngine.playSelection();
                  setSelectedDairaId(daira.id);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/25 scale-105'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-blue-400'
                }`}
              >
                <span>{isAr ? daira.nameAr.split(' ')[0] : daira.nameFr.split(' ')[0]}</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-blue-500/10 text-blue-500'
                }`}>
                  {daira.activeTaxis}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Daïra Detailed Telematics Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-2xl space-y-6 text-left">
          
          {/* Card Top Title & Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {activeDaira.hubBadge}
                </span>
                <span className="text-xs text-slate-400 font-mono">DTW 16 • SECTEUR HOMOLOGUÉ</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                {isAr ? activeDaira.nameAr : activeDaira.nameFr}
              </h3>
            </div>

            {/* Approach and Fleet Counters */}
            <div className="flex items-center space-x-3 shrink-0">
              <div className="p-3 rounded-2xl bg-slate-900 border border-white/10 text-center font-mono">
                <div className="text-[10px] text-slate-400 uppercase">Flotte Active</div>
                <div className="text-lg font-black text-amber-400">{activeDaira.activeTaxis} TAXIS</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-white/10 text-center font-mono">
                <div className="text-[10px] text-slate-400 uppercase">Temps d'Approche</div>
                <div className="text-lg font-black text-blue-400">{activeDaira.avgEta}</div>
              </div>
            </div>
          </div>

          {/* Three-Column Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            
            {/* Communes Rattachées */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                <span>{isAr ? 'البلديات التابعة للدائرة :' : 'Communes Rattachées :'}</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeDaira.communes.map(commune => (
                  <span
                    key={commune}
                    className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-200 font-medium"
                  >
                    {commune}
                  </span>
                ))}
              </div>
            </div>

            {/* Stations Officielles DTW */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Navigation className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? 'محطات التوقف الرسمية المعينة :' : 'Stations Officielles Homologuées :'}</span>
              </span>
              <ul className="space-y-1.5">
                {activeDaira.stations.map(station => (
                  <li key={station} className="flex items-center space-x-1.5 text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Station {station}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Multimodal Transport Connections */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Train className="w-3.5 h-3.5 text-blue-400" />
                <span>{isAr ? 'الربط مع وسائل النقل العمومية :' : 'Correspondances Multimodales :'}</span>
              </span>
              <p className="text-slate-300 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10">
                {activeDaira.transportLinks}
              </p>
            </div>

          </div>

          {/* Action Row: Direct Simulation Link */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span>
                {isAr
                  ? `المسافة التقديرية نحو وسط العاصمة : ${activeDaira.typicalKmToCenter} كم`
                  : `Trajet type vers le Centre d'Alger : ${activeDaira.typicalKmToCenter} km`}
              </span>
            </div>

            <button
              onClick={() => handleApplyToTaximeter(activeDaira.typicalKmToCenter)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>
                {isAr 
                  ? `محاكاة التسعيرة من ${activeDaira.nameAr.split(' ')[0]} بالعداد` 
                  : `Simuler la course depuis ${activeDaira.nameFr.split(' ')[0]} (${activeDaira.typicalKmToCenter} km)`}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
