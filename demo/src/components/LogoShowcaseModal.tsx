import React, { useState } from 'react';
import { X, Check, Download, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audio';

export interface LogoConcept {
  id: string;
  number: string;
  fileName: string;
  titleFr: string;
  titleAr: string;
  tagline: string;
  description: string;
  symbolism: string[];
}

export const LOGO_CONCEPTS: LogoConcept[] = [
  {
    id: 'logo-01',
    number: '01',
    fileName: 'logo-01-geometric-star.svg',
    titleFr: "Le Diwan Géométrique (L'Étoile et la Route)",
    titleAr: "الديوان الهندسي • نجمة الطرقات",
    tagline: "Héritage architectural algérien et carrefour autoroutier",
    description: "Étoile islamique à 8 branches (Khatam) stylisée en 8 corridors de circulation bleu saphir convergeant vers un noyau doré lumineux, incarnant la centralisation des transports urbains.",
    symbolism: [
      "Khatam al-Quds / Étoile maghrébine 8 branches",
      "Corridors autoroutiers bleu saphir (#2563EB)",
      "Cœur radiant or taxi (#F59E0B) pour le phare de guidage"
    ]
  },
  {
    id: 'logo-02',
    number: '02',
    fileName: 'logo-02-aerodynamic-w-lantern.svg',
    titleFr: "Le 'W' Aérodynamique & Lanterneau Réglementaire",
    titleAr: "الحرف W والدليل الضوئي المعتمد",
    tagline: "Homologation Décret Exécutif 12-230 et vitesse urbaine",
    description: "Monogramme 'W' dynamique aux lignes fluides, coiffé au centre par le lanterneau lumineux jaune réglementaire obligatoire sur les toits de taxis communaux et inter-wilayas.",
    symbolism: [
      "Lanterneau lumineux de taxi certifié DTW",
      "Monogramme W biseauté à haute vitesse",
      "Arcs de balayage aérodynamique"
    ]
  },
  {
    id: 'logo-03',
    number: '03',
    fileName: 'logo-03-wasla-arabic-loop.svg',
    titleFr: "Wasla (الوصلة) Calligraphie Moderne & Infini",
    titleAr: "الوصلة • خط عربي انسيابي ورابط لا نهائي",
    tagline: "Connexion instantanée passager-chauffeur sans rupture",
    description: "Ruban de Möbius calligraphique réinterprétant la lettre arabe 'و' (Waw) dans un ruban infini doré et saphir, symbolisant l'union fluide entre l'usager et le chauffeur artisanal.",
    symbolism: [
      "Lettre Waw (و) calligraphique contemporaine",
      "Nœud d'infinité topologique",
      "Deux pôles connectés (client et conducteur)"
    ]
  },
  {
    id: 'logo-04',
    number: '04',
    fileName: 'logo-04-trust-shield.svg',
    titleFr: "Le Bouclier de Confiance & Contrôle Réglementaire",
    titleAr: "درع الأمان والمطابقة القانونية",
    tagline: "Sûreté judiciaire, boîte noire et conformité DTW",
    description: "Bouclier héraldique protecteur en bleu saphir arborant la silhouette frontale d'un taxi doré et la coche de validation officielle, garantissant des courses auditées et sécurisées.",
    symbolism: [
      "Bouclier de sécurité institutionnelle",
      "Silhouette frontale de berline de taxi or",
      "Étoile de certification et coche d'agrément"
    ]
  },
  {
    id: 'logo-05',
    number: '05',
    fileName: 'logo-05-solar-taximeter.svg',
    titleFr: "Le Compteur Solaire Horokilométrique",
    titleAr: "العداد الشمسي الرقمي المعتمد",
    tagline: "Transparence tarifaire absolue et fin des litiges",
    description: "Cadran circulaire haute précision inspiré du taximètre horokilométrique légal, avec aiguille de vitesse dorée et double graduation jour/nuit sous le Décret 12-230.",
    symbolism: [
      "Taximètre horokilométrique réglementaire",
      "Aiguille d'accélération et de ponctualité",
      "Couronne graduée tarifaire diurne et nocturne"
    ]
  },
  {
    id: 'logo-06',
    number: '06',
    fileName: 'logo-06-cashless-flywheel.svg',
    titleFr: "Le Volant d'Inertie Monétaire (Cashless Flywheel)",
    titleAr: "الدائرة النقدية الرقمية وحل أزمة الفكة",
    tagline: "Éradication de la crise de la petite monnaie via BaridiMob",
    description: "Deux orbites fluides saphir et or s'entrecroisant autour d'une pièce numérique centrale, illustrant la circulation instantanée des micropaiements et des pourboires numériques.",
    symbolism: [
      "Orbite continue d'échanges sans espèces",
      "Jeton central Dinar Numérique / BaridiMob",
      "Flux bidirectionnel usager-plateforme-conducteur"
    ]
  },
  {
    id: 'logo-07',
    number: '07',
    fileName: 'logo-07-algiers-gateway-arch.svg',
    titleFr: "La Porte d'Alger & Horizon Autoroutier",
    titleAr: "بوابة الجزائر والأفق السيار",
    tagline: "Architecture néo-mauresque et projection d'avenir",
    description: "Arc outrepassé traditionnel d'Alger et de Tlemcen encadrant une autoroute en perspective accélérée qui fuse vers l'étoile d'horizon, alliance de tradition et de modernité.",
    symbolism: [
      "Arc outrepassé néo-mauresque (Bab)",
      "Autoroute en perspective fuyante vers l'horizon",
      "Colonnes jumelles de stabilité réglementaire"
    ]
  },
  {
    id: 'logo-08',
    number: '08',
    fileName: 'logo-08-hexagonal-pin.svg',
    titleFr: "Le Repère Géodésique & Trèfle Autoroutier",
    titleAr: "المؤشر الجغرافي السداسي وتقاطع الطرق",
    tagline: "Précision télématique GPS et algorithme H3",
    description: "Pin de géolocalisation hexagonal aux facettes technologiques intégrant en son cœur un échangeur autoroutier à 4 feuilles doré, symbolisant la précision spatiale au mètre près.",
    symbolism: [
      "Épinglette géodésique hexagonale H3",
      "Échangeur autoroutier en trèfle doré",
      "Cœur radar de géolocalisation satellite"
    ]
  },
  {
    id: 'logo-09',
    number: '09',
    fileName: 'logo-09-interlocking-monogram.svg',
    titleFr: "Le Monogramme Bilingue Entrelacé (W + و)",
    titleAr: "المونوغرام المزدوج المتشابك (W + و)",
    tagline: "Harmonie bilingue et synthèse identitaire nationale",
    description: "Le 'W' latin majuscule en ruban saphir 3D s'entrelace intimement avec la boucle de la lettre arabe 'و' (Waw) en or taxi, créant un sceau contemporain reconnaissable au premier coup d'œil.",
    symbolism: [
      "Fusion typographique latine (W) et arabe (و)",
      "Entrelacs architectural à effet de profondeur 3D",
      "Harmonie biculturelle algérienne"
    ]
  },
  {
    id: 'logo-10',
    number: '10',
    fileName: 'logo-10-celestial-arrow.svg',
    titleFr: "Les Chevrons de Célérité (58 Wilayas)",
    titleAr: "أسهم السرعة وشبكة الـ 58 ولاية",
    tagline: "Dynamisme national, réactivité et couverture intégrale",
    description: "Trois chevrons aérodynamiques étagés en perspective d'accélération, guidés par un nez diamanté doré et veillés par une constellation représentant le réseau des 58 wilayas.",
    symbolism: [
      "Trois chevrons étagés de propulsion",
      "Pointe de diamant or guidant la flotte",
      "Constellation des wilayas connectées"
    ]
  }
];

interface LogoShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLogoId: string;
  onSelectLogo: (concept: LogoConcept) => void;
}

export const LogoShowcaseModal: React.FC<LogoShowcaseModalProps> = ({
  isOpen,
  onClose,
  selectedLogoId,
  onSelectLogo
}) => {
  const [activePreview, setActivePreview] = useState<LogoConcept>(
    LOGO_CONCEPTS.find(c => c.id === selectedLogoId) || LOGO_CONCEPTS[0]
  );

  if (!isOpen) return null;

  const handleSelect = (concept: LogoConcept) => {
    soundEngine.playSelection();
    onSelectLogo(concept);
    setActivePreview(concept);
  };

  const downloadSvg = (concept: LogoConcept) => {
    soundEngine.playClick();
    const link = document.createElement('a');
    link.href = `/logos/${concept.fileName}`;
    link.download = `wasslani-${concept.id}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black text-white tracking-tight">WASSLANI • Identité Visuelle</h2>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full">
                  10 Concepts Officiels
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Palette stricte Bleu Saphir (#2563EB) & Or Taxi (#F59E0B) • Zéro Vert • Conformité Décret 12-230
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Two Column Layout */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
          
          {/* Left Column: Grid of 10 Logos */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {LOGO_CONCEPTS.map((concept) => {
              const isSelected = concept.id === selectedLogoId;
              const isFocused = concept.id === activePreview.id;

              return (
                <div
                  key={concept.id}
                  onClick={() => {
                    soundEngine.playClick();
                    setActivePreview(concept);
                  }}
                  className={`group relative rounded-2xl p-3 border cursor-pointer transition-all ${
                    isFocused
                      ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-500/20 ring-1 ring-blue-500'
                      : isSelected
                      ? 'bg-amber-950/20 border-amber-500/60'
                      : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-500 hover:bg-slate-800/80'
                  }`}
                >
                  {/* Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-950/60 text-slate-300 border border-slate-700/50">
                      #{concept.number}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 flex items-center space-x-1">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                        <span>Actif</span>
                      </span>
                    )}
                  </div>

                  {/* SVG Thumbnail */}
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-2 group-hover:scale-[1.02] transition-transform">
                    <img
                      src={`/logos/${concept.fileName}`}
                      alt={concept.titleFr}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>

                  {/* Caption */}
                  <div className="mt-2 text-left">
                    <p className="text-xs font-bold text-white truncate">{concept.titleFr}</p>
                    <p className="text-[10px] text-amber-400 font-arabic truncate text-right">{concept.titleAr}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Focus Card & Controls */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-slate-950/60 border border-slate-800/80 rounded-2xl p-6">
            <div>
              {/* Large Preview */}
              <div className="relative w-full aspect-square max-w-[280px] mx-auto rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-800 shadow-2xl p-4 flex items-center justify-center">
                <img
                  src={`/logos/${activePreview.fileName}`}
                  alt={activePreview.titleFr}
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-slate-900/90 text-amber-400 font-mono text-xs font-bold border border-slate-700">
                  Concept #{activePreview.number}
                </div>
              </div>

              {/* Title & Narrative */}
              <div className="mt-6 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-white">{activePreview.titleFr}</h3>
                </div>
                <p className="text-sm font-bold text-amber-400 font-arabic text-right">{activePreview.titleAr}</p>
                <p className="text-xs font-semibold text-blue-400">{activePreview.tagline}</p>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {activePreview.description}
                </p>

                {/* Semiotics / Symbolism Points */}
                <div className="pt-3 border-t border-slate-800 space-y-1.5">
                  <p className="text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider">
                    Éléments Sémiotiques :
                  </p>
                  {activePreview.symbolism.map((point, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-800 mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleSelect(activePreview)}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  activePreview.id === selectedLogoId
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25'
                }`}
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>
                  {activePreview.id === selectedLogoId ? 'Logo Actif Sélectionné' : 'Définir comme Logo Actif'}
                </span>
              </button>

              <button
                onClick={() => downloadSvg(activePreview)}
                className="py-3 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center space-x-2 transition-all cursor-pointer"
                title="Télécharger le fichier SVG vectoriel"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger SVG</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
