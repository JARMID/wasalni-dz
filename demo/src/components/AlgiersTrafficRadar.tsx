import React, { useState } from 'react';
import { 
  Sun, 
  ShieldCheck, 
  Radio, 
  Activity
} from 'lucide-react';
import type { AppLang } from '../utils/i18n';
import { soundEngine } from '../utils/audio';

interface ArteryStatus {
  id: string;
  nameFr: string;
  nameAr: string;
  routeFr: string;
  routeAr: string;
  speedKmH: number;
  condition: 'fluide' | 'modere' | 'dense';
  lengthKm: number;
  traversalMin: number;
}

const ARTERIES_DATA: ArteryStatus[] = [
  {
    id: 'rocade-nord',
    nameFr: 'Rocade Nord d\'Alger',
    nameAr: 'الطريق السريع الشمالي',
    routeFr: 'Bab El Oued vers Caroubier & Pins Maritimes',
    routeAr: 'من باب الوادي إلى الخروبة والصنوبر البحري',
    speedKmH: 68,
    condition: 'fluide',
    lengthKm: 14.2,
    traversalMin: 12,
  },
  {
    id: 'rocade-sud',
    nameFr: 'Rocade Sud (Voie Express)',
    nameAr: 'الطريق السريع الجنوبي',
    routeFr: 'Ben Aknoun vers Dar El Beïda & Aéroport T4',
    routeAr: 'من بن عكنون إلى الدار البيضاء ومطار الجزائر',
    speedKmH: 42,
    condition: 'modere',
    lengthKm: 22.5,
    traversalMin: 32,
  },
  {
    id: 'axe-centre',
    nameFr: 'Axe Central Hassiba Ben Bouali',
    nameAr: 'المحور المركزي حسيبة بن بوعلي',
    routeFr: 'Grande Poste vers Place du 1er Mai & Ruisseau',
    routeAr: 'من البريد المركزي إلى ساحة أول ماي والرويسو',
    speedKmH: 45,
    condition: 'fluide',
    lengthKm: 4.8,
    traversalMin: 6,
  },
  {
    id: 'echangeur-chevalley',
    nameFr: 'Échangeur Chevalley & Hauts d\'Alger',
    nameAr: 'محول شوفالي وأعالي العاصمة',
    routeFr: 'Bouzaréah vers Dely Ibrahim & El Biar',
    routeAr: 'من بوزريعة نحو دالي إبراهيم والأبيار',
    speedKmH: 28,
    condition: 'dense',
    lengthKm: 5.5,
    traversalMin: 12,
  },
];

interface AlgiersTrafficRadarProps {
  lang: AppLang;
}

export const AlgiersTrafficRadar: React.FC<AlgiersTrafficRadarProps> = ({
  lang,
}) => {
  const isAr = lang === 'ar';
  const [selectedArteryId, setSelectedArteryId] = useState<string>('rocade-nord');

  const activeArtery = ARTERIES_DATA.find(a => a.id === selectedArteryId) || ARTERIES_DATA[0];

  return (
    <section id="radar" className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="rounded-3xl p-8 sm:p-12 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 shadow-2xl backdrop-blur-xl space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Radio className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
            <span>{isAr ? 'مرصد السيولة المرورية بالعاصمة' : 'Radar Télématique du Trafic Métropolitain'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            {isAr ? 'رصد حي ومباشر للمحاور الطرقية الكبرى بولاية الجزائر' : 'Vitesse & Fluidité sur les Rocades d\'Alger'}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {isAr
              ? 'توجيه ذكي لأسطول سيارات الأجرة لتفادي الاختناقات المرورية، مع الاستفادة من المسارات المخصصة للنقل العمومي وفق تنظيم مديرية النقل.'
              : 'Supervision en temps réel des vitesses moyennes sur les rocades principales d\'Alger pour garantir des temps d\'approche minimaux aux usagers.'}
          </p>
        </div>

        {/* Arteries Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          {ARTERIES_DATA.map((artery) => {
            const isSelected = artery.id === selectedArteryId;
            return (
              <div
                key={artery.id}
                onClick={() => {
                  soundEngine.playSelection();
                  setSelectedArteryId(artery.id);
                }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 shadow-lg scale-102'
                    : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-white/10 hover:border-blue-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs pb-1">
                    <span className="font-extrabold text-slate-900 dark:text-white text-xs">
                      {isAr ? artery.nameAr : artery.nameFr}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      artery.condition === 'fluide'
                        ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                        : artery.condition === 'modere'
                        ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                        : 'bg-indigo-500/20 text-indigo-400'
                    }`}>
                      {artery.condition === 'fluide' ? 'FLUIDE' : artery.condition === 'modere' ? 'MODÉRÉ' : 'DENSE'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isAr ? artery.routeAr : artery.routeFr}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">Vitesse Moyenne</span>
                    <span className="text-xl font-black font-mono text-slate-900 dark:text-white">
                      {artery.speedKmH} <span className="text-xs text-slate-500">km/h</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-mono">Traversée</span>
                    <span className="text-sm font-black font-mono text-blue-600 dark:text-blue-400">
                      ~{artery.traversalMin} min
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Artery Deep Telematics Bar */}
        <div className="p-6 rounded-2xl bg-slate-950 text-white border border-slate-800 space-y-4 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono font-bold uppercase text-slate-400">Détails Télématiques • Axe Sélectionné :</span>
              <span className="font-bold text-white text-sm">{isAr ? activeArtery.nameAr : activeArtery.nameFr}</span>
            </div>
            <span className="text-xs font-mono text-blue-400">Longueur : {activeArtery.lengthKm} KM</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-white/10 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase">Couloir de Circulation</span>
              <div className="font-bold text-white">Couloirs Bus / Taxis Agréés Autorisés</div>
              <p className="text-[10px] text-slate-400 font-sans">
                Priorité de passage accordée aux artisans détenteurs du Livret de Place DTW.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-white/10 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase">Conditions Météo</span>
              <div className="font-bold text-amber-400 flex items-center space-x-1">
                <Sun className="w-3.5 h-3.5" />
                <span>Chaussée Sèche • 21°C</span>
              </div>
              <p className="text-[10px] text-slate-400 font-sans">
                Zéro surcoût tarifaire appliqué par WASSLANI, conformité Décret 12-230.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-white/10 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase">Contrôle de Sécurité</span>
              <div className="font-bold text-blue-400 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Postes de Contrôle DTW Actifs</span>
              </div>
              <p className="text-[10px] text-slate-400 font-sans">
                Surveillance de la conformité des compteurs scellés ONML par la police.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
