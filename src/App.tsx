import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Map, Overlay, ZoomControl } from 'pigeon-maps';
import { 
  MapPin, 
  ExternalLink, 
  ShieldCheck, 
  ShieldAlert,
  ChevronRight, 
  ChevronLeft,
  ChevronDown,
  BookOpen,
  Filter,
  History,
  X,
  Compass,
  Navigation,
  Search,
  Download,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Landmark,
  Clock,
  Accessibility,
  Ticket,
  Globe,
  ArrowRight,
  Footprints,
  Menu,
  Sun,
  Moon,
  Smartphone,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Site, Museum } from './types';
import { MapRouteLine, RoutingSidebar } from './components/RoutingInterface';
import { SaarlandBoundary } from './components/SaarlandBoundary';
import MuseumsView, { MUSEUMS_DATA } from './components/MuseumsView';
import fundstellenData from '../fundstellen.json';
import ToursView from './components/ToursView';
import TravelGuideView from './components/TravelGuideView';
import { Language, getTranslation, getMaleVoice, getVoicePitch } from './data/translations';
import { SAARLAND_HISTORY } from './data/saarlandHistory';
import ArchaeologyToolsSection from './components/ArchaeologyToolsSection';

// --- Data ---

function eraFromZeitstellung(z: string): Site['era'] {
  if (z === 'Römerzeit') return 'Römerzeit';
  if (z === 'Eisenzeit') return 'Eisenzeit';
  if (z === 'Bronzezeit') return 'Bronzezeit';
  if (z === 'Mittelalter' || z === 'Frühmittelalter') return 'Mittelalter';
  if (z === 'Altsteinzeit' || z === 'Jungsteinzeit') return 'Steinzeit';
  if (z === 'Neuzeit') return 'Neuzeit';
  return 'Mehrere Epochen';
}

function fundstellenToSites(fundstellenList: any[]): Site[] {
  return fundstellenList.map((fs) => ({
    id: fs.id,
    name: fs.name,
    era: eraFromZeitstellung(fs.zeitstellung),
    subEra: fs.zeitstellung,
    location: fs.gemeinde || '',
    lat: fs.lat,
    lng: fs.lng,
    imageUrl: fs.thumbnail || '',
    description: fs.beschreibung || '',
    longDescription: fs.beschreibung || '',
    literatur: Array.isArray(fs.literatur) ? fs.literatur.join('\n') : fs.literatur,
    gemeinde: fs.gemeinde,
    zeitstellung: fs.zeitstellung,
    kategorie_attraktion: fs.kategorie_attraktion,
    kategorie_befund: fs.kategorie_befund,
    sichtbarkeit: fs.sichtbarkeit,
    barrierefreiheit: fs.barrierefreiheit,
    oeffnungszeiten: fs.oeffnungszeiten,
    eintrittspreis: fs.eintrittspreis,
    maps_link: fs.maps_link,
    denkmalschutzstatus: fs.denkmalschutzstatus,
    thumbnail: fs.thumbnail,
    copyright: fs.copyright || null
  }));
}

const SITES: Site[] = fundstellenToSites(fundstellenData.fundstellen);

// Helper to get image or placeholder
const getSiteImage = (site: Site) => {
  if (site.thumbnail) return site.thumbnail;
  const imageMap: Record<string, string> = {
    'dummy-001-gollenstein': 'images/dummy-001-gollenstein.jpg',
    'dummy-002-spellenstein': 'images/dummy-002-spellenstein.jpg',
    'dummy-003-museum-vor-fruehgeschichte': 'images/dummy-003-museum-vor-fruehgeschichte.jpg',
    'dummy-004-hunnenring': 'images/dummy-004-hunnenring.jpg',
    'dummy-005-kulturpark-bliesbruck-reinheim': 'images/dummy-005-kulturpark-bliesbruck-reinheim.jpg',
    'dummy-006-villa-borg': 'images/dummy-006-villa-borg.jpg',
    'dummy-007-villa-nennig': 'images/dummy-007-villa-nennig.jpg',
    'dummy-008-roemermuseum-schwarzenacker': 'images/dummy-008-roemermuseum-schwarzenacker.jpg',
    'dummy-010-emilianus-stollen': 'images/dummy-010-emilianus-stollen.jpg',
    'dummy-011-mithras-heiligtum': 'images/dummy-011-mithras-heiligtum.jpg',
    'dummy-012-burg-montclair': 'images/dummy-012-burg-montclair.jpg',
    'dummy-013-abtei-tholey': 'images/dummy-013-abtei-tholey.jpg',
    'dummy-014-voelklinger-huette': 'images/dummy-014-voelklinger-huette.jpg',
  };
  if (imageMap[site.id]) return imageMap[site.id];
  if (site.imageUrl && site.imageUrl.trim()) return site.imageUrl;
  return `https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200`;
};

// Helper to get era theme colors and tailwind classes
export const getEraTheme = (era: string) => {
  const normEra = era.trim().toLowerCase();
  
  if (normEra.includes('vorge') || normEra.includes('stein')) {
    return {
      name: 'Steinzeit',
      colorCode: '#d97706',
      badgeBgClass: 'bg-amber-100 text-amber-900 border-amber-250',
      buttonBgClass: 'bg-amber-600 text-white shadow-amber-600/30 shadow-lg',
      accentTextClass: 'text-amber-700 hover:text-amber-800',
      borderAccentClass: 'border-amber-600',
      glowRingClass: 'bg-amber-500/30',
      ringHoverClass: 'group-hover:ring-amber-500',
      tooltipBorderClass: 'border-amber-500',
      markerDotClass: 'bg-amber-500',
      bulletColor: 'bg-amber-500'
    };
  }
  if (normEra.includes('bronze')) {
    return {
      name: 'Bronzezeit',
      colorCode: '#c2410c',
      badgeBgClass: 'bg-orange-100 text-orange-950 border-orange-200',
      buttonBgClass: 'bg-orange-600 text-white shadow-orange-600/30 shadow-lg',
      accentTextClass: 'text-orange-700 hover:text-orange-850',
      borderAccentClass: 'border-orange-600',
      glowRingClass: 'bg-orange-600/30',
      ringHoverClass: 'group-hover:ring-orange-600',
      tooltipBorderClass: 'border-orange-600',
      markerDotClass: 'bg-orange-600',
      bulletColor: 'bg-orange-500'
    };
  }
  if (normEra.includes('kelt') || normEra.includes('eisen')) {
    return {
      name: 'Eisenzeit',
      colorCode: '#059669',
      badgeBgClass: 'bg-emerald-100 text-emerald-900 border-emerald-200',
      buttonBgClass: 'bg-emerald-700 text-white shadow-emerald-700/30 shadow-lg',
      accentTextClass: 'text-emerald-700 hover:text-emerald-850',
      borderAccentClass: 'border-emerald-700',
      glowRingClass: 'bg-emerald-600/30',
      ringHoverClass: 'group-hover:ring-emerald-500',
      tooltipBorderClass: 'border-emerald-500',
      markerDotClass: 'bg-emerald-600',
      bulletColor: 'bg-emerald-500'
    };
  }
  if (normEra.includes('röm') || normEra.includes('roem')) {
    return {
      name: 'Römerzeit',
      colorCode: '#dc2626',
      badgeBgClass: 'bg-red-100 text-red-900 border-red-200',
      buttonBgClass: 'bg-red-650 text-white shadow-red-650/30 shadow-lg',
      accentTextClass: 'text-red-700 hover:text-red-850',
      borderAccentClass: 'border-red-650',
      glowRingClass: 'bg-red-500/30',
      ringHoverClass: 'group-hover:ring-red-500',
      tooltipBorderClass: 'border-red-500',
      markerDotClass: 'bg-red-600',
      bulletColor: 'bg-red-500'
    };
  }
  if (normEra.includes('mittel')) {
    return {
      name: 'Mittelalter',
      colorCode: '#8b5cf6',
      badgeBgClass: 'bg-violet-100 text-violet-900 border-violet-200',
      buttonBgClass: 'bg-violet-650 text-white shadow-violet-650/30 shadow-lg',
      accentTextClass: 'text-violet-700 hover:text-violet-850',
      borderAccentClass: 'border-violet-600',
      glowRingClass: 'bg-violet-600/30',
      ringHoverClass: 'group-hover:ring-violet-500',
      tooltipBorderClass: 'border-violet-500',
      markerDotClass: 'bg-violet-600',
      bulletColor: 'bg-violet-500'
    };
  }
  if (normEra.includes('neu')) {
    return {
      name: 'Neuzeit',
      colorCode: '#0ea5e9',
      badgeBgClass: 'bg-sky-100 text-sky-900 border-sky-200',
      buttonBgClass: 'bg-sky-600 text-white shadow-sky-600/30 shadow-lg',
      accentTextClass: 'text-sky-750 hover:text-sky-850',
      borderAccentClass: 'border-sky-600',
      glowRingClass: 'bg-sky-500/30',
      ringHoverClass: 'group-hover:ring-sky-500',
      tooltipBorderClass: 'border-sky-500',
      markerDotClass: 'bg-sky-600',
      bulletColor: 'bg-sky-500'
    };
  }
  // All / default
  return {
    name: 'Sonstige',
    colorCode: '#78716c',
    badgeBgClass: 'bg-stone-100 text-stone-850 border-stone-250',
    buttonBgClass: 'bg-stone-900 text-white shadow-stone-850/30 shadow-lg',
    accentTextClass: 'text-stone-700 hover:text-stone-850',
    borderAccentClass: 'border-stone-700',
    glowRingClass: 'bg-stone-500/20',
    ringHoverClass: 'group-hover:ring-stone-550',
    tooltipBorderClass: 'border-stone-500',
    markerDotClass: 'bg-stone-600',
    bulletColor: 'bg-stone-500'
  };
};

// Helper to get dynamic map marker class and offsets based on zoom level to reduce overlap and scaling neatly
const getMarkerStyles = (zoom: number) => {
  if (zoom >= 13) {
    return {
      sizeClass: 'w-12 h-12 ring-2 ring-white',
      imgClass: 'w-full h-full object-cover opacity-100',
      textClass: 'text-[9px]',
      glowScale: [1, 1.15, 1],
      offset: [24, 24] as [number, number],
      showContent: true
    };
  }
  if (zoom >= 11) {
    return {
      sizeClass: 'w-10 h-10 ring-2 ring-white',
      imgClass: 'w-full h-full object-cover opacity-100',
      textClass: 'text-[7px]',
      glowScale: [1, 1.1, 1],
      offset: [20, 20] as [number, number],
      showContent: true
    };
  }
  if (zoom >= 9) {
    return {
      sizeClass: 'w-8 h-8 ring-[1.5px] ring-white',
      imgClass: 'w-full h-full object-cover opacity-100',
      textClass: 'text-[6px]',
      glowScale: [1, 1.05, 1],
      offset: [16, 16] as [number, number],
      showContent: true
    };
  }
  // Highly zoomed out: Keep the image fully visible but render it finely at a smaller size
  return {
    sizeClass: 'w-6 h-6 ring-[1px] ring-white',
    imgClass: 'w-full h-full object-cover opacity-100',
    textClass: 'text-[5px]',
    glowScale: [1, 1, 1],
    offset: [12, 12] as [number, number],
    showContent: true
  };
};

// --- Components ---

const Navbar = ({ 
  onNavigate, 
  currentPage,
  isDarkMode,
  setIsDarkMode,
  isLandscape,
  setIsLandscape,
  language,
  setLanguage
}: { 
  onNavigate: (page: string) => void, 
  currentPage: string,
  isDarkMode: boolean,
  setIsDarkMode: (val: boolean) => void,
  isLandscape: boolean,
  setIsLandscape: (val: boolean) => void,
  language: Language,
  setLanguage: (val: Language) => void
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [speakingItem, setSpeakingItem] = useState<string | null>(null);

  const navItems = [
    { id: 'home', key: 'nav.home' },
    { id: 'travelguide', key: 'nav.travelguide' },
    { id: 'sites', key: 'nav.sites' },
    { id: 'epochs', key: 'nav.epochs' },
    { id: 'museen', key: 'nav.museen' },
    { id: 'tours', key: 'nav.tours' },
    { id: 'about', key: 'nav.about' }
  ];

  const speakMenu = (itemId: string, label: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (speakingItem === itemId) {
      window.speechSynthesis.cancel();
      setSpeakingItem(null);
      return;
    }

    window.speechSynthesis.cancel();

    let description = getTranslation(`speak.${itemId}`, language);

    const utterance = new SpeechSynthesisUtterance(description);
    const langCode = language === 'de' ? 'de-DE' : language === 'en' ? 'en-US' : language === 'fr' ? 'fr-FR' : 'nl-NL';
    utterance.lang = langCode;

    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = getMaleVoice(voices, language);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.pitch = getVoicePitch(selectedVoice);
    utterance.rate = 0.95;

    utterance.onend = () => {
      setSpeakingItem(null);
    };

    utterance.onerror = () => {
      setSpeakingItem(null);
    };

    setSpeakingItem(itemId);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[150] glass-nav h-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-full flex items-center justify-between">
        <div 
          className="flex items-center gap-2 sm:gap-4 cursor-pointer group" 
          onClick={() => onNavigate('home')}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-xl flex items-center justify-center text-stone-900 font-bold transition-transform group-hover:scale-110 shadow-lg shrink-0">
            A
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="font-bold text-xs sm:text-base md:text-lg tracking-tight text-white leading-none truncate">
              {getTranslation('nav.archaeologySaarland', language)}
            </h1>
            <span className="hidden sm:inline-block text-[9px] font-bold text-emerald-400 mt-1 uppercase tracking-[0.2em] truncate">
              {getTranslation('nav.universityProject', language)}
            </span>
          </div>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6 text-[11px] font-bold">
          {navItems.map(item => {
            const isSpeaking = speakingItem === item.id;
            const translatedLabel = getTranslation(item.key, language);
            return (
              <div key={item.id} className="flex items-center gap-1 group relative">
                <button 
                  onClick={() => onNavigate(item.id)} 
                  className={`${currentPage === item.id ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-stone-300'} hover:text-white transition-all uppercase tracking-[0.2em] py-2`}
                >
                  {translatedLabel}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    speakMenu(item.id, translatedLabel);
                  }}
                  className={`p-1 rounded-full transition-all duration-300 ${
                    isSpeaking 
                      ? 'bg-amber-500 text-stone-900 scale-110 animate-pulse' 
                      : 'text-stone-400 hover:text-amber-400 hover:bg-white/10'
                  }`}
                  title={getTranslation('btn.speakTitle', language).replace('{label}', translatedLabel)}
                >
                  <Volume2 size={10} className={isSpeaking ? "animate-bounce" : ""} />
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Always-Visible Language Select Pulldown Menu */}
          <div className="relative flex items-center">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="appearance-none bg-stone-900 hover:bg-stone-850 text-stone-100 hover:text-white border border-stone-800 rounded-full py-1 sm:py-1.5 pl-2.5 pr-7 text-[11px] sm:text-xs font-bold cursor-pointer transition-all focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-inner"
              title="Sprache auswählen / Select Language"
            >
              <option value="de" className="bg-stone-900 text-stone-100 font-bold">DE</option>
              <option value="en" className="bg-stone-900 text-stone-100 font-bold">EN</option>
              <option value="fr" className="bg-stone-900 text-stone-100 font-bold">FR</option>
              <option value="nl" className="bg-stone-900 text-stone-100 font-bold">NL</option>
            </select>
            <div className="pointer-events-none absolute right-2 flex items-center text-stone-400">
              <ChevronDown size={12} />
            </div>
          </div>

          {/* Light/Dark Toggle - Always visible on all screen sizes */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors text-stone-300 hover:text-white cursor-pointer"
            title={isDarkMode ? "Licht-Modus aktivieren" : "Dunkel-Modus aktivieren"}
          >
            {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
          </button>

          {/* Landscape Simulation Trigger - Hidden on mobile */}
          <button 
            onClick={() => setIsLandscape(!isLandscape)}
            className={`hidden lg:flex w-10 h-10 items-center justify-center hover:bg-white/10 rounded-full transition-colors cursor-pointer ${isLandscape ? 'text-emerald-400 bg-emerald-500/10' : 'text-stone-300 hover:text-white'}`}
            title={isLandscape ? "Normalansicht aktivieren" : "Mobil-Querformat simulieren"}
          >
            <Smartphone size={18} className={isLandscape ? "rotate-90 text-emerald-400 transition-transform duration-300" : "transition-transform duration-300"} />
          </button>

          {/* Privacy Button - Hidden on mobile */}
          <button 
            onClick={() => onNavigate('privacy')}
            className={`hidden lg:flex w-10 h-10 items-center justify-center hover:bg-white/10 rounded-full transition-colors cursor-pointer ${currentPage === 'privacy' ? 'text-emerald-400' : 'text-stone-300'}`}
            title={getTranslation('nav.privacy', language)}
          >
            <ShieldCheck size={20} />
          </button>
          
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors text-white cursor-pointer z-50"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-stone-900/95 dark:bg-stone-950/95 backdrop-blur-xl border-b border-stone-850 overflow-y-auto max-h-[calc(100vh-5rem)] shadow-2xl"
          >
            <div className="flex flex-col p-4 gap-2">
              {navItems.map(item => {
                const isSpeaking = speakingItem === item.id;
                const translatedLabel = getTranslation(item.key, language);
                return (
                  <div key={item.id} className="flex items-center justify-between px-3 py-1 bg-stone-800/40 dark:bg-stone-900/40 rounded-xl border border-stone-850/20">
                    <button 
                      onClick={() => {
                        onNavigate(item.id);
                        setIsMenuOpen(false);
                      }} 
                      className={`grow py-3 text-left font-bold uppercase tracking-[0.2em] text-xs transition-colors ${currentPage === item.id ? 'text-emerald-400 font-extrabold' : 'text-stone-300 hover:text-white'}`}
                    >
                      {translatedLabel}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakMenu(item.id, translatedLabel);
                      }}
                      className={`p-2 rounded-xl transition-all duration-300 border ${
                        isSpeaking 
                          ? 'bg-amber-500 border-amber-400 text-stone-900 scale-105 animate-pulse' 
                          : 'bg-stone-800/50 hover:bg-stone-800 border-stone-700/50 text-stone-400 hover:text-amber-400'
                      }`}
                      title={getTranslation('btn.speakTitle', language).replace('{label}', translatedLabel)}
                    >
                      {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    </button>
                  </div>
                );
              })}

              {/* Mobile Settings Row */}
              <div className="flex justify-around items-center pt-2 mt-1">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-stone-800 hover:bg-stone-750/80 rounded-xl text-xs font-bold text-stone-200 transition-all border border-stone-700/50"
                >
                  {isDarkMode ? <Sun size={14} className="text-amber-400 animate-pulse" /> : <Moon size={14} />} {isDarkMode ? "Licht-Modus" : "Dark-Mode"}
                </button>

                <button
                  onClick={() => setIsLandscape(!isLandscape)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    isLandscape 
                      ? 'bg-emerald-800 text-white border-emerald-700' 
                      : 'bg-stone-800 hover:bg-stone-750/80 text-stone-200 border-stone-700/50'
                  }`}
                >
                  <Smartphone size={14} className={isLandscape ? "rotate-90 text-emerald-400" : ""} /> {isLandscape ? "Hochformat" : "Querformat"}
                </button>
              </div>

              {/* Mobile Legal Footer Row */}
              <div className="flex justify-center gap-6 pt-3 mt-2 border-t border-stone-800/40 text-[10px] uppercase font-bold text-stone-400">
                <button 
                  onClick={() => {
                    onNavigate('privacy');
                    setIsMenuOpen(false);
                  }}
                  className="hover:text-white transition-colors"
                >
                  {getTranslation('nav.privacy', language)}
                </button>
                <button 
                  onClick={() => {
                    onNavigate('impressum');
                    setIsMenuOpen(false);
                  }}
                  className="hover:text-white transition-colors"
                >
                  {getTranslation('impressum.title', language)}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const SiteCard = ({ site, onClick }: { site: Site, onClick: () => void, key?: string }) => (
  <motion.button 
    type="button"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ y: -4 }}
    whileTap={{ scale: 0.98 }}
    className="group glass-panel rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col text-left w-full border-none outline-none focus:ring-2 focus:ring-emerald-700/50"
    onClick={onClick}
  >
    <div className="aspect-[16/10] w-full overflow-hidden relative">
      <img 
        src={getSiteImage(site)} 
        alt={site.name} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        referrerPolicy="no-referrer"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          if (!target.src.includes('unsplash') && !target.src.includes('placehold.co')) {
            target.src = site.imageUrl;
          } else if (target.src.includes('unsplash')) {
            target.src = `https://placehold.co/600x400/1c1917/a8a29e?text=${encodeURIComponent(site.name)}`;
          }
        }}
      />
      <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
        <div className="bg-stone-900/85 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest text-white border border-white/10 flex items-center gap-1.5 shadow-md">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: getEraTheme(site.era).colorCode }} />
          {site.era}
        </div>
        {site.subEra && (
          <div className="bg-stone-900/85 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-emerald-400 border border-white/10 shadow-md">
            {site.subEra}
          </div>
        )}
      </div>
      <div className="absolute bottom-4 right-4">
        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-emerald-700/80 transition-colors">
          <MapPin size={16} />
        </div>
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-lg font-bold text-stone-900 mb-2 leading-tight">{site.name}</h3>
      <p className="text-stone-500 text-[10px] font-bold uppercase tracking-widest mb-3">{site.location}</p>
      <p className="text-stone-600 text-sm line-clamp-2 leading-relaxed mb-6">{site.description}</p>
      
      <div className="flex items-center justify-between">
        <div className={`flex items-center text-[10px] font-bold uppercase tracking-[0.2em] gap-2 ${getEraTheme(site.era).accentTextClass}`}>
          Details ansehen <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </div>
        <div className="px-4 py-2 bg-stone-100 rounded-xl text-[9px] font-bold uppercase tracking-widest text-stone-400">
          Standort: Aktiv
        </div>
      </div>
    </div>
  </motion.button>
);

const SteckbriefOverlay = ({ 
  site, 
  onClose,
  onCalculateRoute,
  onOpenLightbox,
  language
}: { 
  site: Site; 
  onClose: () => void;
  onCalculateRoute: (site: Site) => void;
  onOpenLightbox: (index: number) => void;
  language: Language;
}) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-stone-900/60 backdrop-blur-md cursor-pointer pt-24"
    onClick={onClose}
  >
    <motion.div 
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      className="bg-white/95 backdrop-blur-2xl glass-panel w-full max-w-5xl max-h-[calc(100vh-120px)] overflow-y-auto rounded-[3rem] shadow-2xl relative cursor-default"
      onClick={(e) => e.stopPropagation()}
    >
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 w-12 h-12 glass-nav rounded-2xl flex items-center justify-center text-stone-900 hover:bg-white transition-all shadow-lg z-50 group cursor-pointer"
      >
        <X size={24} className="group-hover:rotate-90 transition-transform" />
      </button>
 
      <div className="p-5 sm:p-10 md:p-20">
        {/* Return / Back Button */}
        <div className="mb-6">
          <button 
            onClick={onClose}
            className="inline-flex items-center gap-2 px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 font-bold rounded-2xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            <ChevronLeft size={14} /> Zurück zur Übersicht / Karte
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          <span 
            className="px-5 py-2 text-white rounded-full text-[10px] font-extrabold uppercase tracking-[0.2em] shadow-lg"
            style={{ backgroundColor: getEraTheme(site.era).colorCode }}
          >
            {site.era}
          </span>
          {site.subEra && (
            <span className="px-5 py-2 glass-nav rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-800 border border-emerald-100 bg-emerald-50 shadow-xs">
              {site.subEra}
            </span>
          )}
          <span className="px-5 py-2 glass-nav rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
            Archäologische Dokumentation
          </span>
        </div>
 
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8">
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-6 md:mb-10 tracking-tight text-stone-900 leading-[1.1] md:leading-[0.9]">
              {site.name}
            </h2>
            
            <div 
              onClick={() => onOpenLightbox(0)}
              className="aspect-[16/7] w-full glass-nav rounded-[2.5rem] shadow-xl mb-12 overflow-hidden bg-stone-200 flex items-center justify-center relative group cursor-zoom-in"
              title="Klicken für Vollansicht"
            >
              <img 
                src={getSiteImage(site)} 
                alt={site.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const safeFallback = site.name.toLowerCase().includes('reinheim') ? 'images/dummy-005-kulturpark-bliesbruck-reinheim.jpg' : 'images/dummy-001-gollenstein.jpg';
                  if (!target.src.includes('unsplash') && !target.src.includes('placehold.co') && site.imageUrl && !site.imageUrl.includes('unsplash')) {
                    target.src = site.imageUrl;
                  } else {
                    target.src = safeFallback;
                  }
                }}
              />
              {/* Eye-catching fullscreen indicator overlay on hover */}
              <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-stone-900/40 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900/80 backdrop-blur-md rounded-2xl p-4 text-white flex items-center gap-2 font-bold text-xs uppercase tracking-widest shadow-2xl">
                  <Maximize2 size={16} /> Vollansicht
                </div>
              </div>
              <div className="absolute bottom-8 left-8">
                <div className="px-4 py-2 bg-black/80 backdrop-blur-md rounded-xl shadow-2xl">
                  <p className="text-[10px] uppercase font-bold text-white tracking-[0.4em] mb-0">Visualisierung</p>
                </div>
              </div>
            </div>

            {site.copyright && (
              <div className="text-[10px] text-stone-400 italic mb-12 -mt-8 pl-2 border-l-2 border-stone-200">
                Bild: {site.copyright.urheber} &bull; {site.copyright.lizenz} &bull; {site.copyright.quelle}
              </div>
            )}
  
            {site.galleryIds && (
              <div className="mb-16">
                <h3 className={`text-stone-400 font-bold uppercase tracking-[0.3em] text-[10px] mb-6 border-l-2 pl-4 ${getEraTheme(site.era).borderAccentClass}`}>
                  Fotografische Funde (Bürgerarchiv)
                </h3>
                <div className="grid grid-cols-5 gap-4">
                  {site.galleryIds.map((id, index) => (
                    <div key={id} className="group relative">
                      <div 
                        onClick={() => onOpenLightbox(index + 1)}
                        className="aspect-square bg-stone-100 rounded-2xl overflow-hidden border-2 border-white shadow-md hover:border-emerald-700 transition-all cursor-zoom-in relative"
                        title="Klicken für Vollansicht"
                      >
                        <img 
                          src={`${id}.jpeg`} 
                          alt={id}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (target.src.endsWith('.jpeg')) {
                              target.src = `${id}.jpg`;
                            } else {
                              target.src = `https://placehold.co/400x400/1c1917/a8a29e?text=${encodeURIComponent(id)}`;
                              target.className = "w-full h-full object-cover opacity-40 grayscale";
                            }
                          }}
                        />
                        {/* subtle hover indicator for gallery items */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-stone-900/20 transition-opacity flex items-center justify-center">
                          <Maximize2 size={14} className="text-white drop-shadow-md" />
                        </div>
                      </div>
                      <p className="mt-2 text-center text-[9px] font-bold text-stone-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        {id}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="prose prose-stone prose-lg max-w-none">
              <p className={`text-3xl text-stone-700 leading-tight font-light mb-12 italic serif-italic border-l-4 pl-10 py-2 ${getEraTheme(site.era).borderAccentClass}`}>
                {site.description}
              </p>
              <div className="space-y-8 text-stone-600 leading-relaxed text-xl font-light">
                {site.longDescription.split('\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            {/* Monument Protection Warning Card */}
            <div className="mt-12 p-6 rounded-[2rem] bg-amber-50/40 border border-amber-200/50 text-amber-900 flex items-start gap-5 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200/60 shadow-xs">
                <ShieldAlert size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider text-amber-800 mb-1.5 flex items-center gap-2">
                  {getTranslation('disclaimer.title', language)}
                </h4>
                <p className="text-sm text-amber-700 font-medium leading-relaxed">
                  {getTranslation('disclaimer.text', language)}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="glass-panel p-5 sm:p-8 md:p-10 rounded-2xl md:rounded-[3rem] bg-white text-stone-900 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-stone-900">
                <Compass size={120} />
              </div>
              <h4 className={`font-bold mb-10 mt-0 uppercase tracking-[0.3em] text-[10px] ${getEraTheme(site.era).accentTextClass}`}>Archiv-Daten</h4>
              <div className="space-y-8 relative z-10">
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 glass-nav rounded-2xl flex items-center justify-center bg-stone-100 ${getEraTheme(site.era).accentTextClass}`}>
                    <History size={24} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-black tracking-widest">Epoche</div>
                    <div className="font-bold text-lg tracking-tight text-stone-900">
                      {site.era} {site.subEra && `– ${site.subEra}`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 glass-nav rounded-2xl flex items-center justify-center bg-stone-100 ${getEraTheme(site.era).accentTextClass}`}>
                    <MapPin size={24} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-black tracking-widest">Fundort</div>
                    <div className="font-bold text-lg tracking-tight text-stone-900">{site.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 glass-nav rounded-2xl flex items-center justify-center bg-stone-100 ${getEraTheme(site.era).accentTextClass}`}>
                    <Compass size={24} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-black tracking-widest">GPS Ref</div>
                    <div className={`font-mono text-xs tabular-nums ${getEraTheme(site.era).accentTextClass}`}>{site.lat.toFixed(4)}°N, {site.lng.toFixed(4)}°E</div>
                  </div>
                </div>

                {/* Compact Legal/Protection Disclaimer in Sidebar */}
                <div className="pt-6 border-t border-amber-200/50 flex gap-4 items-start bg-amber-50/40 p-4 rounded-2xl border border-amber-200/40">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-amber-100 text-amber-800 shrink-0 border border-amber-200/50">
                    <ShieldAlert size={15} />
                  </div>
                  <div>
                    <div className="text-[9px] uppercase font-bold text-amber-800 tracking-wider">
                      {getTranslation('disclaimer.title', language)}
                    </div>
                    <div className="text-[10px] text-amber-700 font-medium leading-relaxed mt-0.5">
                      {getTranslation('disclaimer.text', language)}
                    </div>
                  </div>
                </div>

                {/* Visitor & Schema Information from fundstellen.json */}
                {(site.kategorie_attraktion || site.kategorie_befund || site.sichtbarkeit || site.barrierefreiheit !== undefined || site.oeffnungszeiten || site.eintrittspreis || site.denkmalschutzstatus) && (
                  <div className="pt-6 border-t border-stone-100 space-y-5">
                    <div className="text-[10px] uppercase font-bold text-black tracking-widest">Besucherinformationen</div>
                    
                    {/* Attraction Category & Befund Type */}
                    {(site.kategorie_attraktion || site.kategorie_befund) && (
                      <div className="flex gap-4 items-start">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-stone-50 text-stone-700`}>
                          <Landmark size={15} />
                        </div>
                        <div>
                          <div className="text-[9px] uppercase font-bold text-stone-400">Typ / Befund</div>
                          <div className="text-xs font-semibold text-stone-800">
                            {site.kategorie_attraktion || 'Archäologischer Fundort'} 
                            {site.kategorie_befund && ` (${site.kategorie_befund})`}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Visibility & Protected Status */}
                    {(site.sichtbarkeit || site.denkmalschutzstatus) && (
                      <div className="flex gap-4 items-start">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-stone-50 text-stone-700`}>
                          <ShieldCheck size={15} />
                        </div>
                        <div>
                          <div className="text-[9px] uppercase font-bold text-stone-400">Sichtbarkeit & Denkmalschutz</div>
                          <div className="text-xs font-semibold text-stone-800">
                            <span className="capitalize">{site.sichtbarkeit || 'sichtbar'}</span>
                            {site.denkmalschutzstatus && (
                              <div className="text-[10px] text-stone-500 font-normal mt-0.5">{site.denkmalschutzstatus}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Accessibility */}
                    {site.barrierefreiheit !== undefined && (
                      <div className="flex gap-4 items-start">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-stone-50 text-stone-700`}>
                          <Accessibility size={15} />
                        </div>
                        <div>
                          <div className="text-[9px] uppercase font-bold text-stone-400">Barrierefreiheit</div>
                          <div className="text-xs font-semibold text-stone-800">
                            {site.barrierefreiheit ? '✅ Rollstuhlgerecht / Kinderwagengeeignet' : '❌ Nicht vollständig barrierefrei'}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Opening Hours */}
                    {site.oeffnungszeiten && (
                      <div className="flex gap-4 items-start">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-stone-50 text-stone-700`}>
                          <Clock size={15} />
                        </div>
                        <div>
                          <div className="text-[9px] uppercase font-bold text-stone-400">Öffnungszeiten</div>
                          <div className="text-xs font-semibold text-stone-800 leading-tight">
                            {site.oeffnungszeiten}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Entrance Fee */}
                    {site.eintrittspreis && (
                      <div className="flex gap-4 items-start">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-stone-50 text-stone-700`}>
                          <Ticket size={15} />
                        </div>
                        <div>
                          <div className="text-[9px] uppercase font-bold text-stone-400">Eintritt</div>
                          <div className="text-xs font-semibold text-stone-800">
                            {site.eintrittspreis}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {site.archaeologicalDescription && (
                  <div className="pt-4 border-t border-stone-100">
                    <div className="text-[10px] uppercase font-bold text-black tracking-widest mb-2">Archäologische Beschreibung & Quellen</div>
                    <div className="text-[11px] text-stone-600 leading-relaxed font-medium bg-stone-50 p-4 rounded-2xl border border-stone-100">
                      {site.archaeologicalDescription}
                    </div>
                  </div>
                )}

                {site.literatur && (
                  <div className="pt-4 border-t border-stone-100">
                    <div className="text-[10px] uppercase font-bold text-black tracking-widest mb-2">Literatur</div>
                    <div className="text-[11px] text-stone-600 leading-relaxed font-medium bg-stone-50 p-4 rounded-2xl border border-stone-100">
                      {site.literatur}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-12 relative z-10">
                <button 
                  onClick={() => onCalculateRoute(site)}
                  className="w-full py-5 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-xl uppercase tracking-widest text-[10px] hover:brightness-110"
                  style={{ backgroundColor: getEraTheme(site.era).colorCode }}
                >
                  <MapPin size={16} /> Route berechnen
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

const Footer = ({ onNavigate, language }: { onNavigate: (page: string) => void; language: Language }) => (
  <footer className="relative z-10 w-full px-4 md:px-12 py-12 bg-white/20 backdrop-blur-sm border-t border-white/10 mt-auto">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] text-stone-500 font-medium uppercase tracking-widest">
      <div className="flex flex-col items-center md:items-start gap-1 text-center md:text-left">
        <span className="text-stone-900 font-bold">{getTranslation('footer.copyright', language)}</span>
        <span>{getTranslation('footer.institute', language)}</span>
      </div>
      
      <div className="flex gap-8">
        <button onClick={() => onNavigate('impressum')} className="hover:text-emerald-700 transition-colors">{getTranslation('nav.impressum', language)}</button>
        <button onClick={() => onNavigate('privacy')} className="hover:text-emerald-700 transition-colors">{getTranslation('nav.privacy', language)}</button>
        <button onClick={() => onNavigate('about')} className="hover:text-emerald-700 transition-colors">{getTranslation('nav.about', language)}</button>
      </div>
    </div>
  </footer>
);

export interface EpochItem {
  id: 'Steinzeit' | 'Bronzezeit' | 'Eisenzeit' | 'Römerzeit' | 'Mittelalter' | 'Neuzeit';
  title: string;
  period: string;
  shortDesc: string;
  longDesc: string;
  subEras: { name: string; timeline: string; description: string }[];
  highlights: string[];
}

const EPOCHS_DATA: EpochItem[] = [
  {
    id: 'Steinzeit',
    title: 'Steinzeit',
    period: 'ca. 450.000 v. Chr. – ca. 2.200 v. Chr.',
    shortDesc: 'Die am längsten dauernde Epoche der Menschheitsgeschichte, geprägt von Steinwerkzeugen, Jäger/Sammlern und der neolithischen Revolution.',
    longDesc: 'Die Steinzeit markiert den ältesten Abschnitt der saarländischen Siedlungsgeschichte. Von den eiszeitlichen Jäger- und Sammlergruppen bis hin zu den ersten sesshaften Bauern im Jungneolithikum vollzog sich hier der fundamentale Wandel der menschlichen Lebensweise (Neolithische Revolution). Neben Werkzeugen zeugen monumentale Bodendenkmäler wie Menhire von komplexen rituellen Verhaltungsweisen.',
    subEras: [
      { name: 'Altsteinzeit (Paläolithikum)', timeline: 'ca. 450.000 – 9.600 v. Chr.', description: 'Nomadische Großwildjäger. Älteste Steingeräte aus Flusskiesen.' },
      { name: 'Mittelsteinzeit (Mesolithikum)', timeline: 'ca. 9.600 – 5.500 v. Chr.', description: 'Kleinere Steinwerkzeuge (Mikrolithen). Spezialisierte Jagd im Waldland.' },
      { name: 'Jungsteinzeit (Neolithikum)', timeline: 'ca. 5.500 – 2.200 v. Chr.', description: 'Sesshaftwerdung, Ackerbau, Viehzucht, Keramikherstellung und Bau von Menhiren (Megalithkultur).' }
    ],
    highlights: ['Der Gollenstein bei Blieskastel (mit fast 6,6 m der größte Menhir Mitteleuropas)', 'Späte Jungsteinzeitliche Streufunde und Grabstätten im Bliestal']
  },
  {
    id: 'Bronzezeit',
    title: 'Bronzezeit',
    period: 'ca. 2.200 v. Chr. – ca. 800 v. Chr.',
    shortDesc: 'Technologischer Epochenbruch durch die Einführung der Kupfer-Zinn-Legierung. Entstehung weitreichender Handelsnetze und monumentaler Grabbauten.',
    longDesc: 'Dank der Entdeckung der Metallurgie entsteht eine weitreichende Spezialisierung. Es bilden sich neue soziale Eliten heraus, die ihren Status durch reiche Grabbeigaben (Hügelgräberkultur) oder das Vergraben kostbarer Warenlager (Depot/Hortfunde wie in Erfweiler-Ehlingen) dokumentieren. In der späten Phase entwickelt sich die Urnenfelderkultur mit charakteristischer Brandbestattung.',
    subEras: [
      { name: 'Frühe Bronzezeit', timeline: 'ca. 2.200 – 1.600 v. Chr.', description: 'Erste gegossene Bronzeobjektfunde an Handelsstraßen.' },
      { name: 'Mittlere Bronzezeit', timeline: 'ca. 1.600 – 1.300 v. Chr.', description: 'Etablierung monumentaler Grabhügel über Körperbestattungen.' },
      { name: 'Späte Bronzezeit (Urnenfelderzeit)', timeline: 'ca. 1.300 – 800 v. Chr.', description: 'Einführung der Brandbestattung in Urnen. Ausgedehnte Depot- und Siedlungshinterlassenschaften.' }
    ],
    highlights: ['Böckweiler & Biesingen – Monumentale Grabhügelfelder im Biosphärenreservat Bliesgau', 'Hortfunde Erfweiler-Ehlingen – Spätbronzezeitliche Prachtdepots mit Schmuck und Beilen']
  },
  {
    id: 'Eisenzeit',
    title: 'Eisenzeit',
    period: 'ca. 800 v. Chr. – ca. 15 v. Chr.',
    shortDesc: 'Die Epoche der Kelten. Aufstieg mächtiger Stammesfürsten, monumentales Befestigungshandwerk und reger Fernhandel mit der Mittelmeerwelt.',
    longDesc: 'Die Eisenzeit bringt die Entdeckung der Eisengewinnung. Im Saarland, das im Siedlungsgebiet des keltischen Stammes der Treverer liegt, führt dies zu einer enormen wirtschaftlichen Blüte. Prunkvoll ausgestattete Adelsgräber (wie das Keltische Fürstinnengrab Reinheim) demonstrieren die exzellenten Verbindungen bis nach Etrurien. Eindrucksvolle Befestigungsanlagen wie der Ringwall von Otzenhausen sicherten die herrschaftlichen Zentren.',
    subEras: [
      { name: 'Hallstattzeit (Ha C-D)', timeline: 'ca. 800 – 450 v. Chr.', description: 'Ältere Eisenzeit. Dominanz von Prunkwagenbestattungen und Handelsbeziehungen.' },
      { name: 'Frühlatènezeit (LT A-B)', timeline: 'ca. 450 – 250 v. Chr.', description: 'Großartige Kunststile (Waltham-Stil). Blütezeit des keltischen Fürstinnengrabs Reinheim.' },
      { name: 'Spätlatènezeit (LT C-D)', timeline: 'ca. 250 – 15 v. Chr.', description: 'Entstehung stadtartiger Großsiedlungen (Oppida) und Bau des Hunnenrings Otzenhausen.' }
    ],
    highlights: ['Fürstinnengrab von Reinheim – Keltisches Elitegrab mit Goldschmuck bester Güte', 'Keltenpark Otzenhausen – Monumentaler keltischer Ringwall (Hunnenring)']
  },
  {
    id: 'Römerzeit',
    title: 'Römerzeit',
    period: 'ca. 15 v. Chr. – ca. 450 n. Chr.',
    shortDesc: 'Gallo-römische Hochkultur. Befestigte Städte, weitreichende Fernstraßen, luxuriöse Gutsbetriebe (Villen) und prächtige Mosaikfußböden.',
    longDesc: 'Nach der Eroberung Galliens durch Gaius Iulius Caesar wird das Saarland Teil des Römischen Reiches. Es entwickelt sich eine gallo-römische Mischkultur. Prächtige Gutshöfe (Villae rusticae) entstehen im schier unerschöpflichen Agrarrücken des Saargaus. Die Villa Borg und das monumentale Gladiatorenmosaik der Villa Nennig bezeugen das opulente Niveau des provinzialrömischen Lebensstils.',
    subEras: [
      { name: 'Frühe Kaiserzeit', timeline: 'ca. 15 v. Chr. – 284 n. Chr.', description: 'Ausbau der Infrastruktur (Straßen) und florierender Handelsorte wie des Vicus Schwarzenacker.' },
      { name: 'Spätantike', timeline: 'ca. 284 – 476 n. Chr.', description: 'Zunehmende Germanenvorstöße. Befestigungsbauten, militärische Sicherung der Mosel-Saar-Linie.' }
    ],
    highlights: ['Römische Villa Borg – Weltweit einzigartig rekonstruierte römische Gutsanlage', 'Römische Villa Nennig – Beherbergt das größte erhaltene Gladiatorenmosaik nördlich der Alpen']
  },
  {
    id: 'Mittelalter',
    title: 'Mittelalter',
    period: 'ca. 450 n. Chr. – ca. 1500 n. Chr.',
    shortDesc: 'Vom Zerfall Roms zur herrschaftlichen Zersplitterung. Entstehung der fränkischen Königswürde, prunkvolle Adelsburgen und neue Sakralbauten.',
    longDesc: 'Nach dem Ende des Römischen Reiches übernehmen die Franken die Herrschaft. In der Merowingerzeit bilden kriegerische Reiterschichten die Elite, wovon kostbare Grabfunde mit reichgeschmückten Pferdebestattungen zeugen (wie der Homerich in Reinheim). Im weiteren Verlauf prägen Lehnswesen, christliche Klöster und der Bau trutziger Höhenburgen (wie die Reichsburg Kirkel oder Montclair) die saarländische Landschaft.',
    subEras: [
      { name: 'Frühmittelalter (Merowinger & Karolinger)', timeline: 'ca. 450 – 900 n. Chr.', description: 'Reihengräberzeit, fränkische Landnahme und Christianisierung.' },
      { name: 'Hochmittelalter', timeline: 'ca. 900 – 1250 n. Chr.', description: 'Blütezeit des Burgenbaus und Aufstieg regionaler Grafengeschlechter (z.B. Grafen von Saarbrücken).' },
      { name: 'Spätmittelalter', timeline: 'ca. 1250 – 1500 n. Chr.', description: 'Städtegründungen, Erstarken des Zunftwesens und verheerende Seuchenzüge.' }
    ],
    highlights: ['Merowingergrab Homerich Reinheim – Herausragendes Zeugnis berittener fränkischer Elitengräber', 'Mittelalterliche Höhenburgen Kirkel und Montclair an den Flussschleifen der Saar']
  },
  {
    id: 'Neuzeit',
    title: 'Neuzeit',
    period: 'ab ca. 1500 n. Chr.',
    shortDesc: 'Vom konfessionellen Zeitalter und absolutistischen Festungen zum rasanten Industrialisierungsprozess und der Kohle-Stahl-Ära.',
    longDesc: 'Die Neuzeit im Saarland beginnt mit tiefgreifenden territorialen und Glaubenskonflikten, gipfelnd im barocken Festungsbau durch den französischen Baumeister Vauban (Saarlouis). Der Reichtum an Steinkohle und Eisenerz begründet ab dem 18. und 19. Jahrhundert die fundamentale Wandlung zum industriellen Ballungszentrum Europas, welches im 20. Jahrhundert auch geopolitisch im Fokus stand.',
    subEras: [
      { name: 'Frühe Neuzeit & Barock', timeline: 'ca. 1500 – 1789 n. Chr.', description: 'Gründung der Festungsstadt Saarlouis durch König Ludwig XIV.' },
      { name: 'Moderne & Industrialisierung', timeline: 'ab 1789 n. Chr.', description: 'Aufstieg der Hüttenwerke, Kohleabbau, zwei Weltkriege und die bewegte Geschichte des Saarlandes.' }
    ],
    highlights: ['Barocke Festungsstadt Saarlouis – Sternförmige Befestigungsstruktur nach Plänen Vaubans', 'Weltkulturerbe Völklinger Hütte – Monumentales Industriedenkmal der Hochindustrialisierung']
  }
];

export function getLocalizedEpoch(epoch: EpochItem, language: string): EpochItem {
  if (language === 'de') return epoch;

  const translations: Record<string, Record<string, any>> = {
    en: {
      'Steinzeit': {
        title: 'Stone Age',
        period: 'c. 450,000 BC – c. 2,200 BC',
        shortDesc: 'The longest-lasting epoch of human history, marked by stone tools, hunter-gatherers, and the Neolithic Revolution.',
        longDesc: 'The Stone Age marks the oldest section of Saarland\'s settlement history. From Ice Age hunter-gatherer groups to the first settled farmers in the late Neolithic, the fundamental shift in human lifestyle (Neolithic Revolution) took place here. Alongside tools, monumental landmarks such as menhirs testify to complex ritual behaviors.',
        subEras: [
          { name: 'Paleolithic (Old Stone Age)', timeline: 'c. 450,000 – 9,600 BC', description: 'Nomadic big game hunters. Oldest stone tools made of river gravels.' },
          { name: 'Mesolithic (Middle Stone Age)', timeline: 'c. 9,600 – 5,500 BC', description: 'Smaller stone tools (microliths). Specialized hunting in woodland.' },
          { name: 'Neolithic (New Stone Age)', timeline: 'c. 5,500 – 2,200 BC', description: 'Sessile settlement, agriculture, animal husbandry, pottery production, and the construction of menhirs (megalithic culture).' }
        ],
        highlights: ['The Gollenstein near Blieskastel (at nearly 6.6 m, the largest menhir in Central Europe)', 'Late Neolithic scattered finds and burial sites in the Blies valley']
      },
      'Bronzezeit': {
        title: 'Bronze Age',
        period: 'c. 2,200 BC – c. 800 BC',
        shortDesc: 'Technological epochal break through the introduction of the copper-tin alloy. Emergence of far-reaching trade networks and monumental grave buildings.',
        longDesc: 'Thanks to the discovery of metallurgy, far-reaching specialization emerged. New social elites arose, documenting their status through rich grave goods (Tumulus culture) or the burial of valuable stock (hoards like in Erfweiler-Ehlingen). In the late phase, the Urnfield culture with characteristic cremation burial developed.',
        subEras: [
          { name: 'Early Bronze Age', timeline: 'c. 2,200 – 1,600 BC', description: 'First cast bronze object finds along trade routes.' },
          { name: 'Middle Bronze Age', timeline: 'c. 1,600 – 1,300 BC', description: 'Establishment of monumental burial mounds over inhumation burials.' },
          { name: 'Late Bronze Age (Urnfield Period)', timeline: 'c. 1,300 – 800 BC', description: 'Introduction of cremation burial in urns. Extensive hoard and settlement remnants.' }
        ],
        highlights: ['Böckweiler & Biesingen – Monumental burial mound fields in the Bliesgau Biosphere Reserve', 'Erfweiler-Ehlingen Hoard – Late Bronze Age prestige hoards with jewelry and axes']
      },
      'Eisenzeit': {
        title: 'Iron Age',
        period: 'c. 800 BC – c. 15 BC',
        shortDesc: 'The era of the Celts. The rise of powerful tribal princes, monumental fortification craftsmanship, and active long-distance trade with the Mediterranean world.',
        longDesc: 'The Iron Age brings the discovery of iron extraction. In Saarland, which lies in the settlement area of the Celtic tribe of the Treveri, this led to an enormous economic bloom. Splendidly equipped noble graves (such as the Celtic Princess Grave of Reinheim) demonstrate excellent connections as far as Etruria. Impressive fortifications such as the Otzenhausen Ringwall secured the sovereign centers.',
        subEras: [
          { name: 'Hallstatt Period', timeline: 'c. 800 – 450 BC', description: 'Older Iron Age. Dominance of elite wagon burials and trade relations.' },
          { name: 'Early La Tène Period', timeline: 'c. 450 – 250 BC', description: 'Splendid art styles (Waldalgesheim style). Heyday of the Celtic Princess Grave of Reinheim.' },
          { name: 'Late La Tène Period', timeline: 'c. 250 – 15 BC', description: 'Emergence of city-like major settlements (oppida) and construction of the Otzenhausen Ringwall.' }
        ],
        highlights: ['Reinheim Princess Grave – Celtic elite grave with gold jewelry of the highest quality', 'Otzenhausen Celtic Park – Monumental Celtic ringwall (Hunnenring)']
      },
      'Römerzeit': {
        title: 'Roman Era',
        period: 'c. 15 BC – c. 450 AD',
        shortDesc: 'Gallo-Roman high culture. Fortified cities, extensive long-distance highways, luxurious estates (villas), and magnificent mosaic floors.',
        longDesc: 'After the conquest of Gaul by Julius Caesar, Saarland became part of the Roman Empire. A mixed Gallo-Roman culture developed. Splendid estates (villae rusticae) emerged in the rich agricultural ridge of Saargau. Villa Borg and the monumental gladiatorial mosaic of Villa Nennig bear witness to the opulent level of provincial Roman lifestyle.',
        subEras: [
          { name: 'Early Empire', timeline: 'c. 15 BC – 284 AD', description: 'Expansion of infrastructure (roads) and flourishing trade centers like Vicus Schwarzenacker.' },
          { name: 'Late Antiquity', timeline: 'c. 284 – 476 AD', description: 'Increasing Germanic incursions. Fortifications, military securing of the Moselle-Saar line.' }
        ],
        highlights: ['Roman Villa Borg – Globally unique reconstructed Roman estate', 'Roman Villa Nennig – Houses the largest preserved gladiatorial mosaic north of the Alps']
      },
      'Mittelalter': {
        title: 'Middle Ages',
        period: 'c. 450 AD – c. 1500 AD',
        shortDesc: 'From the collapse of Rome to sovereign fragmentation. Emergence of Frankish kingship, splendid noble castles, and new sacred buildings.',
        longDesc: 'After the end of the Roman Empire, the Franks took over rule. In the Merovingian period, warlike cavalry classes formed the elite, as evidenced by valuable grave finds with richly decorated horse burials (such as Homerich in Reinheim). Subsequently, feudalism, Christian monasteries, and the construction of sturdy hilltop castles (such as Kirkel Imperial Castle or Montclair) shaped the Saarland landscape.',
        subEras: [
          { name: 'Early Middle Ages (Merovingians & Carolingians)', timeline: 'c. 450 – 900 AD', description: 'Row grave period, Frankish land grab, and Christianization.' },
          { name: 'High Middle Ages', timeline: 'c. 900 – 1250 AD', description: 'Heyday of castle building and rise of regional count dynasties (e.g. Counts of Saarbrücken).' },
          { name: 'Late Middle Ages', timeline: 'c. 1250 – 1500 AD', description: 'Foundation of towns, strengthening of guild systems, and devastating plague epidemics.' }
        ],
        highlights: ['Merovingian Grave Homerich Reinheim – Outstanding testimony of mounted Frankish elite graves', 'Medieval hilltop castles Kirkel and Montclair on the bends of the Saar River']
      },
      'Neuzeit': {
        title: 'Modern Era',
        period: 'from c. 1500 AD',
        shortDesc: 'From the denominational age and absolutist fortifications to the rapid process of industrialization and the coal and steel era.',
        longDesc: 'The modern era in Saarland began with profound territorial and religious conflicts, culminating in baroque fortification construction by French builder Vauban (Saarlouis). The abundance of hard coal and iron ore from the 18th and 19th centuries established the fundamental transformation into an industrial European hub, which was also geopolitically in focus in the 20th century.',
        subEras: [
          { name: 'Early Modern & Baroque Period', timeline: 'c. 1500 – 1789 AD', description: 'Foundation of the fortress city of Saarlouis by King Louis XIV.' },
          { name: 'Modern & Industrialization', timeline: 'from 1789 AD', description: 'Rise of the ironworks, coal mining, two world wars, and the turbulent history of Saarland.' }
        ],
        highlights: ['Baroque fortress city Saarlouis – Star-shaped fortification structure designed by Vauban', 'Völklingen Ironworks World Heritage Site – Monumental industrial monument of high industrialization']
      }
    },
    fr: {
      'Steinzeit': {
        title: 'Âge de pierre',
        period: 'env. 450 000 av. J.-C. – env. 2 200 av. J.-C.',
        shortDesc: 'La plus longue époque de l\'histoire humaine, caractérisée par des outils de pierre, des chasseurs-cueilleurs et la révolution néolithique.',
        longDesc: 'L\'âge de pierre marque la partie la plus ancienne de l\'histoire du peuplement de la Sarre. Des groupes de chasseurs-cueilleurs de l\'ère glaciaire aux premiers agriculteurs sédentaires du Néolithique récent, le changement fondamental du mode de vie humain (Révolution néolithique) s\'est produit ici. À côté des outils, des monuments mégalithiques comme les menhirs témoignent de comportements rituels complexes.',
        subEras: [
          { name: 'Paléolithique (Âge de la pierre taillée)', timeline: 'env. 450 000 – 9 600 av. J.-C.', description: 'Chasseurs nomades de grand gibier. Les plus anciens outils de pierre taillés.' },
          { name: 'Mésolithique (Âge de pierre moyen)', timeline: 'env. 9 600 – 5 500 av. J.-C.', description: 'Outils en pierre plus petits (microlithes). Chasse spécialisée en forêt.' },
          { name: 'Néolithique (Âge de la pierre polie)', timeline: 'env. 5 500 – 2 200 av. J.-C.', description: 'Sédentarisation, agriculture, élevage, poterie et érection de menhirs (culture mégalithique).' }
        ],
        highlights: ['Le Gollenstein près de Blieskastel (avec près de 6,6 m, le plus grand menhir d\'Europe centrale)', 'Découvertes dispersées et sépultures du Néolithique récent dans la vallée de la Blies']
      },
      'Bronzezeit': {
        title: 'Âge du bronze',
        period: 'env. 2 200 av. J.-C. – env. 800 av. J.-C.',
        shortDesc: 'Rupture technologique majeure par l\'introduction de l\'alliage cuivre-étain. Émergence de vastes réseaux commerciaux et de sépultures monumentales.',
        longDesc: 'Grâce à la découverte de la métallurgie, une spécialisation poussée apparaît. De nouvelles élites sociales se forment, affirmant leur statut par de riches dépôts funéraires (culture des tumulus) ou l\'enfouissement de trésors précieux (dépôts comme à Erfweiler-Ehlingen). À la fin de cette période se développe la culture des champs d\'urnes avec sa crémation caractéristique.',
        subEras: [
          { name: 'Bronze ancien', timeline: 'env. 2 200 – 1 600 av. J.-C.', description: 'Premières découvertes d\'objets en bronze coulé le long des routes commerciales.' },
          { name: 'Bronze moyen', timeline: 'env. 1 600 – 1 300 av. J.-C.', description: 'Établissement de tumulus monumentaux au-dessus des sépultures à inhumation.' },
          { name: 'Bronze final (champs d\'urnes)', timeline: 'env. 1 300 – 800 av. J.-C.', description: 'Introduction de la crémation en urnes. Nombreux dépôts d\'objets et vestiges d\'habitats.' }
        ],
        highlights: ['Böckweiler & Biesingen – Champs de tumulus monumentaux dans la réserve de biosphère du Bliesgau', 'Dépôt d\'Erfweiler-Ehlingen – Trésor d\'apparat du Bronze final avec bijoux et haches']
      },
      'Eisenzeit': {
        title: 'Âge du fer',
        period: 'env. 800 av. J.-C. – env. 15 av. J.-C.',
        shortDesc: 'L\'époque des Celtes. Essor de puissants princes tribaux, artisanat de fortification monumental et commerce à longue distance actif avec le monde méditerranéen.',
        longDesc: 'L\'âge du fer apporte la découverte de la métallurgie du fer. En Sarre, située sur le territoire de la tribu celtique des Trévires, cela entraîne un essor économique formidable. De riches tombes aristocratiques (comme la tombe de la princesse celtique de Reinheim) témoignent de liens d\'une qualité exceptionnelle jusqu\'en Étrurie. De puissantes fortifications comme le mur d\'enceinte d\'Otzenhausen protégeaient les centres du pouvoir.',
        subEras: [
          { name: 'Période de Hallstatt', timeline: 'env. 800 – 450 av. J.-C.', description: 'Premier âge du fer. Prédominance des sépultures à char d\'apparat et des relations commerciales.' },
          { name: 'La Tène ancienne', timeline: 'env. 450 – 250 av. J.-C.', description: 'Styles artistiques magnifiques (style de Waldalgesheim). Âge d\'or de la sépulture de la princesse celtique de Reinheim.' },
          { name: 'La Tène finale', timeline: 'env. 250 – 15 av. J.-C.', description: 'Émergence de grandes agglomérations proto-urbaines (oppida) et construction du rempart d\'Otzenhausen.' }
        ],
        highlights: ['Tombe de la princesse de Reinheim – Tombe celtique d\'élite avec des bijoux d\'or de la plus haute qualité', 'Parc celtique d\'Otzenhausen – Rempart celtique monumental (Hunnenring)']
      },
      'Römerzeit': {
        title: 'Époque romaine',
        period: 'env. 15 av. J.-C. – env. 450 apr. J.-C.',
        shortDesc: 'Haute culture gallo-romaine. Villes fortifiées, grands réseaux de voies romaines, riches domaines agricoles (villas) et magnifiques mosaïques.',
        longDesc: 'Après la conquête de la Gaule par Jules César, la Sarre est intégrée à l\'Empire romain. Une culture mixte gallo-romaine s\'y développe. De somptueux domaines ruraux (villae rusticae) s\'implantent sur les terres fertiles du Saargau. La Villa Borg et la monumentale mosaïque des gladiateurs de la Villa Nennig témoignent du niveau de vie opulent de la société provinciale romaine.',
        subEras: [
          { name: 'Haut-Empire', timeline: 'env. 15 av. J.-C. – 284 apr. J.-C.', description: 'Développement des infrastructures routières et essor de centres commerciaux comme le vicus de Schwarzenacker.' },
          { name: 'Antiquité tardive', timeline: 'env. 284 – 476 apr. J.-C.', description: 'Incursions germaniques accrues. Fortifications et sécurisation de l\'axe Moselle-Sarre.' }
        ],
        highlights: ['Villa romaine de Borg – Domaine agricole romain reconstitué unique au monde', 'Villa romaine de Nennig – Abrite la plus grande mosaïque de gladiateurs conservée au nord des Alpes']
      },
      'Mittelalter': {
        title: 'Moyen Âge',
        period: 'env. 450 apr. J.-C. – env. 1500 apr. J.-C.',
        shortDesc: 'De l\'effondrement de Rome au morcellement féodal. Naissance du royaume franc, châteaux forts majestueux et nouvelles abbayes chrétiennes.',
        longDesc: 'Après la fin de l\'Empire romain, les Francs prennent le pouvoir. À l\'époque mérovingienne, les élites sont formées de cavaliers guerriers, comme le prouvent les découvertes de sépultures prestigieuses contenant de riches harnachements de chevaux (Homerich à Reinheim). Par la suite, la féodalité, les monastères chrétiens et l\'érection de solides forteresses (comme les châteaux de Kirkel ou Montclair) façonnent le paysage sarrois.',
        subEras: [
          { name: 'Haut Moyen Âge (Mérovingiens & Carolingiens)', timeline: 'env. 450 – 900 apr. J.-C.', description: 'Époque des tombes en rangées, colonisation franque et christianisation.' },
          { name: 'Moyen Âge central', timeline: 'env. 900 – 1250 apr. J.-C.', description: 'Âge d\'or de la construction de châteaux forts et essor des dynasties de comtes régionaux.' },
          { name: 'Moyen Âge tardif', timeline: 'env. 1250 – 1500 apr. J.-C.', description: 'Fondation de villes, renforcement des corporations d\'artisans et grandes épidémies de peste.' }
        ],
        highlights: ['Tombe mérovingienne de Homerich Reinheim – Témoignage exceptionnel des sépultures de cavaliers francs d\'élite', 'Châteaux médiévaux de Kirkel et Montclair au cœur des boucles de la Sarre']
      },
      'Neuzeit': {
        title: 'Époque moderne',
        period: 'depuis env. 1500 apr. J.-C.',
        shortDesc: 'De l\'ère confessionnelle et des citadelles absolutistes à l\'industrialisation effrénée et l\'âge de la houille et de l\'acier.',
        longDesc: 'L\'époque moderne en Sarre s\'ouvre sur de profonds conflits territoriaux et religieux, culminant avec la construction de la forteresse baroque de Saarlouis par l\'ingénieur français Vauban. L\'abondance de charbon et de minerai de fer jette dès les XVIIIe et XIXe siècles les bases d\'une métamorphose totale en un cœur industriel de l\'Europe, au centre des enjeux géopolitiques du XXe siècle.',
        subEras: [
          { name: 'Époque moderne & période baroque', timeline: 'env. 1500 – 1789 apr. J.-C.', description: 'Fondation de la ville fortifiée de Saarlouis par le roi Louis XIV.' },
          { name: 'Révolution industrielle & époque contemporaine', timeline: 'depuis 1789 apr. J.-C.', description: 'Essor de la sidérurgie, extraction minière, deux guerres mondiales et histoire mouvementée de la Sarre.' }
        ],
        highlights: ['Ville fortifiée de Saarlouis – Structure en étoile conçue selon les plans de Vauban', 'Patrimoine mondial de l\'usine sidérurgique de Völklingen – Monument industriel grandiose de l\'âge d\'or de la sidérurgie']
      }
    },
    nl: {
      'Steinzeit': {
        title: 'Steentijd',
        period: 'ca. 450.000 v. Chr. – ca. 2.200 v. Chr.',
        shortDesc: 'Het langst durende tijdperk in de menselijke geschiedenis, gekenmerkt door stenen werktuigen, jagers-verzamelaars en de neolithische revolutie.',
        longDesc: 'De Steentijd markeert de oudste periode van de nederzettingsgeschiedenis van het Saarland. Van de ijstijdjagers tot de eerste boeren in het laat-neolithicum vond hier de fundamentele verandering in de menselijke levenswijze plaats (Neolithische Revolutie). Naast werktuigen getuigen monumentale megalieten zoals menhirs van complexe rituele tradities.',
        subEras: [
          { name: 'Paleolithicum (Oude Steentijd)', timeline: 'ca. 450.000 – 9.600 v. Chr.', description: 'Nomadische jagers op groot wild. Oudste stenen werktuigen van riviergrind.' },
          { name: 'Mesolithicum (Middensteentijd)', timeline: 'ca. 9.600 – 5.500 v. Chr.', description: 'Kleine stenen werktuigen (microlieten). Gespecialiseerde jacht in bossen.' },
          { name: 'Neolithicum (Nieuwe Steentijd)', timeline: 'ca. 5.500 – 2.200 v. Chr.', description: 'Sessiele levenswijze, landbouw, veeteelt, aardewerkproductie en de bouw van menhirs (megalietcultuur).' }
        ],
        highlights: ['De Gollenstein bij Blieskastel (met bijna 6,6 m de grootste menhir van Midden-Europa)', 'Laat-neolithische vondsten en begraafplaatsen in het Bliestal']
      },
      'Bronzezeit': {
        title: 'Bronstijd',
        period: 'ca. 2.200 v. Chr. – ca. 800 v. Chr.',
        shortDesc: 'Technologische doorbraak door de introductie van de koper-tinlegering. Ontstaan van verregaande handelsnetwerken en monumentale grafmonumenten.',
        longDesc: 'Dankzij de uitvinding van metallurgie ontstaat er vergaande specialisatie. Er ontstaan nieuwe sociale elites die hun status aantonen door rijke grafgiften (grafheuvelcultuur) of het begraven van kostbare opslagplaatsen (depotvondsten zoals in Erfweiler-Ehlingen). In de latere fase ontwikkelt zich de urnenveldencultuur met kenmerkende brandbestatting.',
        subEras: [
          { name: 'Vroege Bronstijd', timeline: 'ca. 2.200 – 1.600 v. Chr.', description: 'Eerste vondsten van gegoten bronzen voorwerpen langs handelsroutes.' },
          { name: 'Midden-Bronstijd', timeline: 'ca. 1.600 – 1.300 v. Chr.', description: 'Bouw van monumentale grafheuvels over begravingen.' },
          { name: 'Late Bronstijd (Urnenveldentijd)', timeline: 'ca. 1.300 – 800 v. Chr.', description: 'Introductie van crematiebegravingen in urnen. Omvangrijke depot- en nederzettingsresten.' }
        ],
        highlights: ['Böckweiler & Biesingen – Monumentale grafheuvelvelden in het Bliesgau Biosfeerreservaat', 'Depotvondst Erfweiler-Ehlingen – Late bronstijddepots met sieraden en bijlen']
      },
      'Eisenzeit': {
        title: 'IJzertijd',
        period: 'ca. 800 v. Chr. – ca. 15 v. Chr.',
        shortDesc: 'Het tijdperk van de Kelten. Opkomst van machtige stamhoofden, monumentale vestingbouw en levendige handel met de mediterrane wereld.',
        longDesc: 'De IJzertijd brengt de ontdekking van ijzerwinning met zich mee. In het Saarland, dat in het nederzettingsgebied van de Keltische stam de Treveri ligt, leidt dit tot een enorme economische bloei. Rijkelijk uitgeruste elitegraven (zoals het Keltische Vorstinnengraf van Reinheim) tonen uitstekende verbindingen tot aan Etrurië aan. Indrukwekkende vestingwerken zoals de Ringwall van Otzenhausen beveiligden de adellijke machtscentra.',
        subEras: [
          { name: 'Hallstatt-periode', timeline: 'ca. 800 – 450 v. Chr.', description: 'Oudere ijzertijd. Dominantie van vorstengrafwagons en handelsbetrekkingen.' },
          { name: 'Vroeg-La Tène-periode', timeline: 'ca. 450 – 250 v. Chr.', description: 'Prachtige kunststijlen (Waldalgesheim-stijl). Bloeitijd van het Keltische vorstinnengraf Reinheim.' },
          { name: 'Laat-La Tène-periode', timeline: 'ca. 250 – 15 v. Chr.', description: 'Ontstaan van stedelijke nederzettingen (oppida) en de bouw van de Ringwall van Otzenhausen.' }
        ],
        highlights: ['Vorstinnengraf van Reinheim – Keltisch elitegraf met gouden sieraden van de hoogste kwaliteit', 'Keltenpark Otzenhausen – Monumentale Keltische ringmuur (Hunnenring)']
      },
      'Römerzeit': {
        title: 'Romeinse tijd',
        period: 'ca. 15 v. Chr. – ca. 450 n. Chr.',
        shortDesc: 'Gallo-Romeinse hoogcultuur. Versterkte steden, uitgestrekte heerwegen, luxueuze villabedrijven (villae rusticae) en prachtige mozaïekvloeren.',
        longDesc: 'Na de verovering van Gallië door Julius Caesar werd het Saarland deel van het Romeinse Rijk. Er ontwikkelde zich een gallo-romeinse mengcultuur. Prachtige landgoederen (villae rusticae) ontstonden op de rijke landbouwgrond van de Saargau. De Villa Borg und het monumentale gladiatorenmozaïek van de Villa Nennig getuigen van de weelderige levensstandaard van de provinciaal-Romeinse elite.',
        subEras: [
          { name: 'Vroeg-Romeinse Keizertijd', timeline: 'ca. 15 v. Chr. – 284 n. Chr.', description: 'Uitbouw van infrastructuur (wegen) en bloeiende handelscentra zoals de Vicus Schwarzenacker.' },
          { name: 'Laatantieke tijd', timeline: 'ca. 284 – 476 n. Chr.', description: 'Toenemende Germaanse invallen. Vestingbouw en militaire beveiliging van de Moezel-Saarlinie.' }
        ],
        highlights: ['Romeinse Villa Borg – Uniek gereconstrueerd Romeins landgoed', 'Romeinse Villa Nennig – Herbergt het grootste bewaard gebleven gladiatorenmozaïek ten noorden van de Alpen']
      },
      'Mittelalter': {
        title: 'Middeleeuwen',
        period: 'ca. 450 n. Chr. – ca. 1500 n. Chr.',
        shortDesc: 'Van de ineenstorting van Rome tot adellijke versnippering. Ontstaan van het Frankische koningschap, schitterende kastelen en nieuwe kloosterkerken.',
        longDesc: 'Na het einde van het Romeinse Rijk namen de Franken de macht over. In de Merovingische tijd vormden ruiterschappen de elite, waarvan kostbare grafvondsten met rijkelijk versierde paardengraven getuigen (zoals Homerich in Reinheim). Later bepaalden het leenstelsel, christelijke kloosters en de bouw van burchten (zoals Kirkel of Montclair) het landschap van het Saarland.',
        subEras: [
          { name: 'Vroege Middeleeuwen (Merovingers & Karolings)', timeline: 'ca. 450 – 900 n. Chr.', description: 'Rijengraventijd, Frankische landname en kerstening.' },
          { name: 'Hoge Middeleeuwen', timeline: 'ca. 900 – 1250 n. Chr.', description: 'Bloeitijd van de burchtenbouw en opkomst van regionale gravenhuizen (bijv. graven van Saarbrücken).' },
          { name: 'Late Middeleeuwen', timeline: 'ca. 1250 – 1500 n. Chr.', description: 'Stichting van steden, versterking van gilden en verwoestende pestepidemieën.' }
        ],
        highlights: ['Merovingisch graf Homerich Reinheim – Uitstekend bewijs van bereden Frankische elitegraven', 'Middeleeuwse burchten Kirkel en Montclair in de rivierbochten van de Saar']
      },
      'Neuzeit': {
        title: 'Moderne tijd',
        period: 'vanaf ca. 1500 n. Chr.',
        shortDesc: 'Van het confessionele tijdperk en absolutistische vestingen naar de snelle industriële revolutie en het kolen- en staaltijdperk.',
        longDesc: 'De moderne tijd in het Saarland begon met diepe territoriale en religieuze conflicten, uitmondend in barokke vestingbouw door de Franse bouwmeester Vauban (Saarlouis). De rijkdom aan steenkool en ijzererts legde vanaf de 18e en 19e eeuw de basis voor de transformatie tot het industriële hart van Europa, dat ook in de 20e eeuw geopolitiek centraal stond.',
        subEras: [
          { name: 'Vroegmoderne tijd & Barok', timeline: 'ca. 1500 – 1789 n. Chr.', description: 'Stichting van de vestingstad Saarlouis door koning Lodewijk XIV.' },
          { name: 'Moderne tijd & Industrialisatie', timeline: 'vanaf 1789 n. Chr.', description: 'Opkomst van de staalindustrie, kolenwinning, twee wereldoorlogen en de turbulente geschiedenis van het Saarland.' }
        ],
        highlights: ['Barokke vestingstad Saarlouis – Symmetrische vestingstructuur ontworpen door Vauban', 'Werelderfgoed Völklinger Hütte – Monumentaal industrieel monument van de hoge industrialisatie']
      }
    }
  };

  const localized = translations[language]?.[epoch.id];
  if (!localized) return epoch;

  return {
    ...epoch,
    title: localized.title,
    period: localized.period,
    shortDesc: localized.shortDesc,
    longDesc: localized.longDesc,
    subEras: localized.subEras || epoch.subEras,
    highlights: localized.highlights || epoch.highlights
  };
}

interface LightboxProps {
  images: { src: string; fallbackSrc?: string; title: string }[];
  initialIndex: number;
  onClose: () => void;
}

const ImageLightbox = ({ images, initialIndex, onClose }: LightboxProps) => {
  const [index, setIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(false);
  const [imgSrc, setImgSrc] = useState(images[initialIndex].src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(images[index].src);
    setHasError(false);
    setZoom(false);
  }, [index, images]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && images.length > 1) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && images.length > 1) {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [index, images]);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentImage = images[index];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-stone-900/85 backdrop-blur-2xl flex flex-col justify-between p-4 md:p-8 select-none"
      onClick={onClose}
    >
      {/* Top Bar with actions */}
      <div className="flex items-center justify-between pointer-events-auto gap-4 z-10 w-full px-5 py-3.5 bg-stone-950/80 border border-white/15 rounded-2xl backdrop-blur-xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="text-stone-200 text-xs font-mono font-bold tracking-widest uppercase">
          {images.length > 1 ? `${index + 1} / ${images.length}` : 'Visualisierung'}
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setZoom(!zoom)}
            className="w-10 h-10 hover:bg-white/10 rounded-xl flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
            title={zoom ? "Herauszoomen" : "Herunzoomen"}
          >
            {zoom ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
          </button>

          <a
            href={imgSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 hover:bg-white/10 rounded-xl flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
            title="In neuem Tab / Fenster in Vollansicht öffnen"
          >
            <ExternalLink size={18} />
          </a>

          <button
            onClick={onClose}
            className="w-10 h-10 hover:bg-white/10 rounded-xl flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
            title="Schließen (ESC)"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Image Viewport */}
      <div className="flex-grow flex items-center justify-center relative overflow-hidden my-4">
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-4 md:left-8 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 hover:scale-105 active:scale-95 flex items-center justify-center text-white border border-white/20 transition-all shadow-xl backdrop-blur-md cursor-pointer"
            title="Vorheriges Bild"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div 
          className="max-w-5xl max-h-[75vh] md:max-h-[80vh] w-full h-full flex items-center justify-center pointer-events-auto bg-stone-950/40 rounded-3xl p-4 md:p-6 border border-white/10 shadow-2xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.img
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: zoom ? 1.4 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            src={imgSrc}
            alt={currentImage.title}
            className={`max-w-full max-h-full rounded-2xl shadow-2xl object-contain select-none transition-all duration-300 ${zoom ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
            onClick={() => setZoom(!zoom)}
            onError={() => {
              const safeFallback = currentImage.title.toLowerCase().includes('reinheim') ? 'images/dummy-005-kulturpark-bliesbruck-reinheim.jpg' : 'images/dummy-001-gollenstein.jpg';
              if (!hasError && currentImage.fallbackSrc && !currentImage.fallbackSrc.includes('unsplash')) {
                setHasError(true);
                setImgSrc(currentImage.fallbackSrc);
              } else {
                setHasError(true);
                setImgSrc(safeFallback);
              }
            }}
          />
        </div>

        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 md:right-8 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 hover:scale-105 active:scale-95 flex items-center justify-center text-white border border-white/20 transition-all shadow-xl backdrop-blur-md cursor-pointer"
            title="Nächstes Bild"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      {/* Bottom Bar Caption */}
      <div 
        className="text-center pointer-events-auto max-w-2xl mx-auto z-10 py-3.5 px-6 bg-stone-950/80 border border-white/15 rounded-2xl backdrop-blur-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-white text-base md:text-lg font-bold tracking-tight mb-1">
          {currentImage.title}
        </p>
        <p className="text-stone-300 text-xs font-sans font-medium tracking-wide">
          Zum Vergrößern auf das Bild klicken • <a href={imgSrc} target="_blank" rel="noopener noreferrer" className="text-amber-400 font-bold hover:underline cursor-pointer inline-flex items-center gap-1">In Vollansicht in neuem Fenster öffnen</a>
        </p>
      </div>
    </motion.div>
  );
};

const MuseumSteckbriefOverlay = ({ 
  museum, 
  onClose,
  allSites,
  onFocusSiteOnMap
}: { 
  museum: Museum; 
  onClose: () => void;
  allSites: Site[];
  onFocusSiteOnMap: (siteId: string) => void;
}) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-stone-900/60 backdrop-blur-md cursor-pointer pt-24"
    onClick={onClose}
  >
    <motion.div 
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      className="bg-white/95 backdrop-blur-2xl glass-panel w-full max-w-5xl max-h-[calc(100vh-120px)] overflow-y-auto rounded-[3rem] shadow-2xl relative cursor-default"
      onClick={(e) => e.stopPropagation()}
    >
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 w-12 h-12 glass-nav rounded-2xl flex items-center justify-center text-stone-900 hover:bg-white transition-all shadow-lg z-50 group cursor-pointer"
      >
        <X size={24} className="group-hover:rotate-90 transition-transform" />
      </button>

      <div className="p-5 sm:p-10 md:p-20">
        {/* Return / Back Button */}
        <div className="mb-6">
          <button 
            onClick={onClose}
            className="inline-flex items-center gap-2 px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 font-bold rounded-2xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            <ChevronLeft size={14} /> Zurück
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          <span className="px-5 py-2 bg-indigo-900 text-white rounded-full text-[10px] font-extrabold uppercase tracking-[0.2em] shadow-lg">
            {museum.stateCountry}
          </span>
          <span className="px-5 py-2 glass-nav rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-905 border border-indigo-100 bg-indigo-50 shadow-xs">
            Museum &amp; Ausstellungsort
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8">
            <h2 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-6 md:mb-10 tracking-tight text-stone-900 leading-[1.1]">
              {museum.name}
            </h2>
            
            <div className="aspect-[16/7] w-full glass-nav rounded-[2.5rem] shadow-xl mb-12 overflow-hidden bg-stone-200">
              <img 
                src={museum.imageUrl} 
                alt={museum.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="prose prose-stone prose-lg max-w-none">
              <p className="text-2xl text-stone-700 leading-tight font-light mb-12 italic border-l-4 border-indigo-500 pl-10 py-2">
                {museum.description}
              </p>
            </div>

            <div className="mt-16">
              <h3 className="text-stone-400 font-bold uppercase tracking-[0.3em] text-[10px] mb-6 border-l-2 border-indigo-505 pl-4">
                Exponate aus saarländischen Fundstätten am Ort ({museum.artifacts.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {museum.artifacts.map((art) => {
                  const linkedSite = allSites.find(s => s.id === art.originSiteId);
                  return (
                    <div
                      key={art.id}
                      className="p-6 bg-stone-50 rounded-3xl border border-stone-200/60 flex flex-col justify-between space-y-4"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-805 font-mono">
                            {art.period}
                          </span>
                          <span className="px-2.5 py-1 text-[8px] font-bold uppercase tracking-wider border rounded-md bg-indigo-50/50 text-indigo-700 border-indigo-100">
                            {art.status}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-stone-900 text-sm">
                          {art.name}
                        </h4>
                        <p className="text-stone-600 text-xs leading-relaxed mt-1">
                          {art.description}
                        </p>
                      </div>

                      {linkedSite && (
                        <div className="pt-4 border-t border-stone-200/40 flex justify-between items-center gap-2">
                          <span className="text-[10px] text-stone-400 font-bold uppercase">
                            Fundort: {art.originSiteName}
                          </span>
                          <button
                            onClick={() => {
                              onClose();
                              onFocusSiteOnMap(linkedSite.id);
                            }}
                            className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-700 hover:text-indigo-950 flex items-center gap-1 cursor-pointer"
                          >
                            In Karte lokalisieren <ArrowRight size={10} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="glass-panel p-5 sm:p-8 md:p-10 rounded-2xl md:rounded-[3rem] bg-white text-stone-900 shadow-2xl relative overflow-hidden">
              <h4 className="font-bold mb-10 mt-0 uppercase tracking-[0.3em] text-[10px] text-indigo-505">Service-Daten</h4>
              <div className="space-y-8 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center bg-stone-100 text-indigo-700">
                    <Clock size={20} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-black tracking-widest">Öffnungszeiten</div>
                    <div className="font-bold text-sm text-stone-700 mt-1 leading-tight">{museum.openingHours}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center bg-stone-100 text-indigo-700">
                    <Ticket size={20} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-black tracking-widest">Eintritt &amp; Zugang</div>
                    <div className="font-bold text-sm text-stone-700 mt-1 leading-tight">{museum.entranceFee}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center bg-stone-100 text-indigo-700">
                    <Accessibility size={20} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-black tracking-widest">Barrierefreiheit</div>
                    <div className="font-bold text-sm text-stone-700 mt-1 leading-tight">
                      {museum.wheelchairAccessible ? "Rollstuhlgerecht" : "Eingeschränkt zugänglich"}
                      <p className="font-normal text-xs text-stone-500 mt-1">{museum.accessibilityDetails}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center bg-stone-100 text-indigo-700">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-black tracking-widest">Anschrift</div>
                    <div className="font-bold text-sm text-stone-700 mt-1">{museum.street}, {museum.location}</div>
                    <p className="font-normal text-xs text-stone-500 mt-1">{museum.preciseLocation}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center bg-stone-100 text-indigo-700">
                    <Globe size={20} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-black tracking-widest">Internet</div>
                    <a 
                      href={museum.websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs font-bold text-indigo-700 hover:underline flex items-center gap-1 mt-1"
                    >
                      Website besuchen <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

// --- Flavius Speech Button Component ---
const FlaviusSpeechButton = ({ 
  text, 
  sectionId, 
  speakingSection, 
  onSpeak, 
  isSpeechSupported,
  language
}: { 
  text: string, 
  sectionId: string, 
  speakingSection: string | null, 
  onSpeak: (text: string, id: string) => void,
  isSpeechSupported: boolean,
  language: Language
}) => {
  if (!isSpeechSupported) return null;
  const isSpeaking = speakingSection === sectionId;

  return (
    <button
      onClick={() => onSpeak(text, sectionId)}
      className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer border flex items-center gap-2 shadow-xs active:scale-95 shrink-0 ${
        isSpeaking
          ? 'bg-amber-500 border-amber-400 text-stone-900 animate-pulse font-black shadow-md scale-[1.02]'
          : 'bg-amber-50 hover:bg-amber-500 border-amber-200 hover:border-amber-400 text-amber-800 hover:text-stone-900 shadow-xs'
      }`}
      title={isSpeaking ? getTranslation('btn.stopSpeak', language) : getTranslation('btn.speak', language)}
    >
      {isSpeaking ? (
        <>
          <VolumeX size={12} className="shrink-0" />
          <span>⏹️ {getTranslation('btn.stop', language)}</span>
        </>
      ) : (
        <>
          <Volume2 size={12} className="shrink-0 animate-pulse" />
          <span>🔊 {getTranslation('btn.speak', language)}</span>
        </>
      )}
    </button>
  );
};

// --- Safe Local Storage Wrapper to prevent Iframe Security Errors ---
const safeLocalStorage = {
  getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem(key);
      }
    } catch (e) {
      console.warn('Storage read blocked or unavailable:', e);
    }
    return null;
  },
  setItem(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn('Storage write blocked or unavailable:', e);
    }
  }
};

// --- Main App ---

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    return safeLocalStorage.getItem('currentPage') || 'home';
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return safeLocalStorage.getItem('theme') === 'dark';
  });
  const [isLandscape, setIsLandscape] = useState(() => {
    return safeLocalStorage.getItem('isLandscape') === 'true';
  });
  const [language, setLanguage] = useState<Language>(() => {
    return (safeLocalStorage.getItem('language') as Language) || 'de';
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const landscapeScrollRef = useRef<HTMLDivElement>(null);

  // VOICE / SPEECH SYNTHESIS GLOBAL STATE
  const [speakingSection, setSpeakingSection] = useState<string | null>(null);
  const isSpeechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    safeLocalStorage.setItem('currentPage', currentPage);
    safeLocalStorage.setItem('language', language);
    safeLocalStorage.setItem('isLandscape', String(isLandscape));

    // Scroll window to top
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    
    // Scroll landscape simulation container to top
    if (landscapeScrollRef.current) {
      landscapeScrollRef.current.scrollTop = 0;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingSection(null);
    }
  }, [currentPage, language, isLandscape]);

  const speakText = (text: string, sectionId: string) => {
    if (!isSpeechSupported) return;

    if (speakingSection === sectionId) {
      window.speechSynthesis.cancel();
      setSpeakingSection(null);
      return;
    }

    window.speechSynthesis.cancel();

    const cleanText = text
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/[•📍🗺️⏳🏛️🥾🧭🏺🛡️🏹🏰🌲🧗🚨]/g, '')
      .replace(/\bSalvete\b/gi, 'Sal-weh-te')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const langCode = language === 'de' ? 'de-DE' : language === 'en' ? 'en-US' : language === 'fr' ? 'fr-FR' : 'nl-NL';
    utterance.lang = langCode;

    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = getMaleVoice(voices, language);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.pitch = getVoicePitch(selectedVoice);
    utterance.rate = 0.95;

    utterance.onend = () => {
      setSpeakingSection(null);
    };

    utterance.onerror = () => {
      setSpeakingSection(null);
    };

    setSpeakingSection(sectionId);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      safeLocalStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      safeLocalStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const [selectedEpochTab, setSelectedEpochTab] = useState<'Steinzeit' | 'Bronzezeit' | 'Eisenzeit' | 'Römerzeit' | 'Mittelalter' | 'Neuzeit'>('Steinzeit');
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [selectedMuseumOnMap, setSelectedMuseumOnMap] = useState<Museum | null>(null);
  const [showMuseumsOnMap, setShowMuseumsOnMap] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLightbox, setActiveLightbox] = useState<{
    images: { src: string; fallbackSrc?: string; title: string }[];
    index: number;
  } | null>(null);
  
  // Routing-Specific States
  const [routeDestination, setRouteDestination] = useState<Site | null>(null);
  const [activeRoute, setActiveRoute] = useState<{
    coordinates: [number, number][];
    distance: number;
    duration: number;
    steps: any[];
  } | null>(null);
  const [mapCenterState, setMapCenterState] = useState<[number, number]>([49.4, 6.9]);
  const mapCenterRef = useRef<[number, number]>([49.4, 6.9]);

  const setMapCenter = (center: [number, number]) => {
    mapCenterRef.current = center;
    setMapCenterState(center);
  };

  const mapCenter = mapCenterState;
  const [mapZoom, setMapZoom] = useState<number>(9);
  const [travelguideTourId, setTravelguideTourId] = useState<string | null>(null);

  const filteredSites = SITES.filter(site => {
    const matchesEra = filter === 'All' || site.era === filter;
    
    const query = searchQuery.trim().toLowerCase();
    if (!query) return matchesEra;

    const matchesSearch = 
      site.name.toLowerCase().includes(query) ||
      site.era.toLowerCase().includes(query) ||
      (site.subEra && site.subEra.toLowerCase().includes(query)) ||
      site.location.toLowerCase().includes(query) ||
      site.description.toLowerCase().includes(query) ||
      site.longDescription.toLowerCase().includes(query) ||
      (site.archaeologicalDescription && site.archaeologicalDescription.toLowerCase().includes(query));

    return matchesEra && matchesSearch;
  });

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <section className="relative min-h-[90vh] flex items-center justify-center px-6 md:px-12 py-12 overflow-hidden text-left">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1599110906800-4b95d033973c?auto=format&fit=crop&q=80&w=2000" 
                alt="Archaeological background" 
                className="w-full h-full object-cover opacity-15 grayscale"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white"></div>
            </div>

            <div className="max-w-6xl w-full relative z-10">
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-block px-5 py-2 glass-panel rounded-full text-emerald-700 text-xs font-bold uppercase tracking-[0.3em] shadow-lg"
                >
                  {getTranslation('home.welcome', language)}
                </motion.div>
                <FlaviusSpeechButton 
                  text={getTranslation('home.flaviusIntro', language)}
                  sectionId="home"
                  speakingSection={speakingSection}
                  onSpeak={speakText}
                  isSpeechSupported={isSpeechSupported}
                  language={language}
                />
              </div>
              <motion.h1 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-stone-900 mb-12 tracking-tighter leading-[1.0] break-words"
              >
                {getTranslation('home.heading', language)} <br />
                <span className="serif-italic font-normal italic text-emerald-800 text-3xl sm:text-5xl md:text-6xl lg:text-7xl block mt-2">
                  {getTranslation('home.headingAccent', language)}
                </span>
              </motion.h1>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                {/* Left column: Button and Slogan + mini 2x2 cm Icon */}
                <div className="lg:col-span-5 flex flex-col items-start gap-3">
                  <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                    <motion.button 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                      onClick={() => setCurrentPage('sites')}
                      className="grow md:grow-0 px-10 py-5 bg-stone-900 text-white hover:bg-emerald-800 rounded-2xl font-bold transition-all shadow-2xl hover:-translate-y-1 text-center text-lg whitespace-nowrap cursor-pointer"
                    >
                      {getTranslation('home.exploreMap', language)}
                    </motion.button>
                    
                    {/* Small 2x2 cm (80x80px) Official Saarland Tourism Icon */}
                    <motion.a
                      href="https://www.urlaub.saarland/"
                      target="_blank"
                      rel="noreferrer"
                      className="w-20 h-20 min-w-20 min-h-20 bg-stone-50 hover:bg-emerald-50 border-2 border-stone-200 hover:border-emerald-800/30 rounded-2xl flex flex-col items-center justify-center relative shadow-md hover:shadow-lg transition-all group cursor-pointer"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 }}
                      title={language === 'de' ? 'Urlaub im Saarland bewerben - Offizielle Tourismus-Website öffnen' : language === 'en' ? 'Promote holiday in Saarland - Open official tourism website' : language === 'fr' ? 'Promouvoir les vacances en Sarre - Ouvrir le site officiel du tourisme' : 'Vakantie in Saarland promoten - Open officiële toerisme website'}
                    >
                      <span className="text-[7.5px] font-bold text-stone-400 group-hover:text-emerald-700/80 uppercase tracking-widest absolute top-2 transition-colors">
                        {language === 'fr' ? 'Vacances' : language === 'nl' ? 'Vakantie' : 'Urlaub'}
                      </span>
                      <Compass size={26} className="text-stone-700 group-hover:text-emerald-800 group-hover:rotate-12 transition-all duration-300 mt-1" />
                      <span className="text-[7.5px] font-extrabold text-stone-600 group-hover:text-emerald-900 uppercase tracking-widest absolute bottom-2 transition-colors">
                        Saarland
                      </span>
                    </motion.a>

                    {/* Small 2x2 cm (80x80px) Saar Pass Button */}
                    <motion.a
                      href="https://www.urlaub.saarland/saar-pass"
                      target="_blank"
                      rel="noreferrer"
                      className="w-20 h-20 min-w-20 min-h-20 bg-stone-50 hover:bg-emerald-50 border-2 border-stone-200 hover:border-emerald-800/30 rounded-2xl flex flex-col items-center justify-center relative shadow-md hover:shadow-lg transition-all group cursor-pointer"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 }}
                      title={language === 'de' ? 'Der Saar Pass für Saarländerinnen und Saarländer öffnen' : language === 'en' ? 'Open the Saar Pass for Saarland residents' : language === 'fr' ? 'Ouvrir le Saar Pass pour les résidents de Sarre' : 'Open de Saar Pass voor inwoners van Saarland'}
                    >
                      <span className="text-[7.5px] font-bold text-stone-400 group-hover:text-emerald-700/80 uppercase tracking-widest absolute top-2 transition-colors">
                        Saar
                      </span>
                      <Ticket size={24} className="text-stone-700 group-hover:text-emerald-800 transition-all duration-300 mt-1" />
                      <span className="text-[7.5px] font-extrabold text-stone-600 group-hover:text-emerald-900 uppercase tracking-widest absolute bottom-2 transition-colors">
                        Pass
                      </span>
                      <ExternalLink size={10} className="absolute top-2 right-2 text-stone-400 group-hover:text-emerald-600 transition-colors" />
                    </motion.a>

                    {/* Small 2x2 cm (80x80px) Saarpfalz Touristik Button */}
                    <motion.a
                      href="https://www.saarpfalz-touristik.de/"
                      target="_blank"
                      rel="noreferrer"
                      className="w-20 h-20 min-w-20 min-h-20 bg-stone-50 hover:bg-emerald-50 border-2 border-stone-200 hover:border-emerald-800/30 rounded-2xl flex flex-col items-center justify-center relative shadow-md hover:shadow-lg transition-all group cursor-pointer"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.85 }}
                      title={language === 'de' ? 'Die Saarpfalz-Touristik öffnen' : language === 'en' ? 'Open Saarpfalz-Touristik' : language === 'fr' ? 'Ouvrir Saarpfalz-Touristik' : 'Open Saarpfalz-Touristik'}
                    >
                      <span className="text-[7px] font-bold text-stone-400 group-hover:text-emerald-700/80 uppercase tracking-wider absolute top-2 transition-colors">
                        Saarpfalz
                      </span>
                      <Globe size={24} className="text-stone-700 group-hover:text-emerald-800 transition-all duration-300 mt-1" />
                      <span className="text-[7px] font-extrabold text-stone-600 group-hover:text-emerald-900 uppercase tracking-wider absolute bottom-2 transition-colors">
                        Touristik
                      </span>
                      <ExternalLink size={10} className="absolute top-2 right-2 text-stone-400 group-hover:text-emerald-600 transition-colors" />
                    </motion.a>
                  </div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-emerald-700 font-semibold tracking-wide text-sm md:text-base pl-1"
                  >
                    {language === 'en' ? 'Your journey can begin!' : language === 'fr' ? 'Votre voyage peut commencer !' : language === 'nl' ? 'Uw reis kan beginnen!' : 'Ihre Reise kann beginnen!'}
                  </motion.p>
                </div>

                {/* Right column: Intro-Text und Projekt entdecken */}
                <div className="lg:col-span-7 flex flex-col items-start gap-6 border-t lg:border-t-0 lg:border-l border-stone-200/50 pt-8 lg:pt-0 lg:pl-16">
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg md:text-xl text-stone-600 font-medium leading-relaxed"
                  >
                    {language === 'en' 
                      ? 'The Saarland is home to archaeological treasures from the Stone Age to modern times - from menhirs and Celtic princely tombs, Roman palace villas to Merovingian horse burials and medieval castles and much more. We take you on an archaeological journey through time!' 
                      : language === 'fr'
                      ? 'La Sarre abrite des trésors archéologiques de l\'âge de pierre à l\'époque moderne - des menhirs et sépultures princières celtiques, des villas de palais romains aux sépultures de chevaux mérovingiennes, châteaux médiévaux et bien plus encore. Nous vous emmenons dans un voyage archéologique à travers le temps !'
                      : language === 'nl'
                      ? 'Het Saarland herbergt archeologische schatten van de steentijd tot de moderne tijd - van menhirs en Keltische vorstengraven, Romeinse paleisvilla\'s tot Merovingische paardenbegrafenissen en middeleeuwse kastelen en nog veel meer. We nemen u mee op een archeologische reis door de tijd!'
                      : 'Das Saarland beheimatet archäologische Schätze aus der Steinzeit bis zur Neuzeit - von Menhiren über keltische Prunkgräber, römischen Palastvillen zu Merowingischen Pferdebestattungen und mittelalterlichen Burgen und vieles mehr. Wir nehmen Sie mit auf eine archäologische Zeitreise !'}
                  </motion.p>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6"
                  >
                    <button 
                      onClick={() => setCurrentPage('about')}
                      className="text-stone-800 hover:text-emerald-800 font-bold flex items-center justify-center gap-2 text-sm border-b-2 border-stone-800/10 hover:border-emerald-800/50 pb-1 transition-all cursor-pointer"
                    >
                      {language === 'en' ? 'Discover project →' : language === 'fr' ? 'Découvrir le projet →' : language === 'nl' ? 'Ontdek project →' : 'Projekt entdecken →'}
                    </button>
                    
                    <button 
                      onClick={() => setCurrentPage('tours')}
                      className="text-emerald-800 hover:text-emerald-990 font-bold flex items-center justify-center gap-2 text-sm border-b-2 border-emerald-800/20 hover:border-emerald-800/80 pb-1 transition-all cursor-pointer"
                    >
                      <Footprints size={14} /> {language === 'en' ? 'Explore hiking tours →' : language === 'fr' ? 'Explorer les randonnées →' : language === 'nl' ? 'Wandeltochten verkennen →' : 'Wandertouren erkunden →'}
                    </button>
                  </motion.div>
                </div>
              </div>

              {/* Archaeology Tools & Methods Section */}
              <ArchaeologyToolsSection language={language} />

              {/* Interactive Saarland History Section */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mt-16 pt-8 border-t border-stone-200/50 w-full"
              >
                <div className="max-w-4xl mx-auto">
                  <button
                    onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                    className="w-full flex items-center justify-between p-6 bg-stone-50 hover:bg-stone-100/80 border border-stone-200 rounded-2xl transition-all duration-300 shadow-sm cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 shadow-xs border border-emerald-100 group-hover:bg-emerald-100 group-hover:text-emerald-900 transition-all">
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-stone-900 leading-tight">
                          {SAARLAND_HISTORY[language].title}
                        </h3>
                        <p className="text-xs text-stone-500 mt-1">
                          {language === 'de' ? 'Klicken zum Aufklappen & Vorlesen' : 
                           language === 'en' ? 'Click to expand & read aloud' : 
                           language === 'fr' ? 'Cliquez pour développer et lire' : 
                           'Klik om uit te vouwen en voor te lezen'}
                        </p>
                      </div>
                    </div>
                    <ChevronDown 
                      size={20} 
                      className={`text-stone-400 group-hover:text-stone-700 transition-transform duration-300 shrink-0 ${isHistoryOpen ? 'rotate-180' : ''}`} 
                    />
                  </button>

                  <AnimatePresence>
                    {isHistoryOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 md:p-8 bg-stone-50/50 border-x border-b border-stone-200 rounded-b-2xl -mt-2 space-y-6">
                          <div className="flex items-center justify-between border-b border-stone-200/60 pb-4 gap-4 flex-wrap">
                            <span className="text-xs font-mono text-emerald-800 uppercase tracking-wider">
                              {language === 'de' ? 'Historischer Überblick' : 
                               language === 'en' ? 'Historical Overview' : 
                               language === 'fr' ? 'Aperçu Historique' : 
                               'Historisch Overzicht'}
                            </span>
                            <FlaviusSpeechButton 
                              text={SAARLAND_HISTORY[language].fullText}
                              sectionId="saarland-history"
                              speakingSection={speakingSection}
                              onSpeak={speakText}
                              isSpeechSupported={isSpeechSupported}
                              language={language}
                            />
                          </div>
                          
                          <div className="prose prose-stone max-w-none text-stone-600 space-y-4 leading-relaxed text-sm md:text-base">
                            {SAARLAND_HISTORY[language].paragraphs.map((p, idx) => (
                              <p key={idx}>{p}</p>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

            </div>
          </section>
        );

      case 'sites':
        return (
          <div className="max-w-7xl mx-auto px-4 py-12">
            {!routeDestination ? (
              // NORMAL MAP VIEW - showing all markers + sidebar grid list
              <>
                <div className="flex flex-col xl:flex-row gap-6 mb-12 items-stretch xl:items-center justify-between">
                  <div className="grow">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
                      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-stone-900">{getTranslation('nav.sites', language)}</h1>
                      <FlaviusSpeechButton 
                        text={getTranslation('sites.speakMain', language)}
                        sectionId="sites"
                        speakingSection={speakingSection}
                        onSpeak={speakText}
                        isSpeechSupported={isSpeechSupported}
                        language={language}
                      />
                    </div>
                    <p className="text-stone-500 font-medium tracking-wide">{getTranslation('sites.subtitle', language)}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                    {/* Search Field */}
                    <div className="relative min-w-[300px]">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Filter-Suche (z.B. Römerzeit, Saarbrücken, Bliesgau)..."
                        className="w-full pl-10 pr-10 py-3 bg-stone-100 hover:bg-stone-200/50 focus:bg-white border-2 border-stone-200 focus:border-emerald-700/50 rounded-2xl text-xs font-semibold tracking-wide transition-all shadow-sm focus:ring-0 text-stone-800"
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                        <Search size={14} />
                      </div>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-600 transition-colors"
                          title="Filter zurücksetzen"
                        >
                          <X size={10} />
                        </button>
                      )}
                    </div>

                    {/* Era Filter Switches */}
                    <div className="glass-panel p-2 rounded-2xl flex flex-wrap gap-1.5 items-center">
                      {['All', 'Steinzeit', 'Bronzezeit', 'Eisenzeit', 'Römerzeit', 'Mittelalter', 'Neuzeit'].map(f => {
                        const theme = getEraTheme(f === 'All' ? 'All' : f);
                        const isActive = filter === f;
                        return (
                          <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 ${
                              isActive 
                              ? theme.buttonBgClass 
                              : 'hover:bg-white/40 text-stone-600'
                            }`}
                          >
                            {f !== 'All' && !isActive && (
                              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: theme.colorCode }} />
                            )}
                            {f === 'All' ? 'Alle' : f}
                          </button>
                        );
                      })}

                      {/* Museums Visibility Switch */}
                      <span className="h-4 w-px bg-stone-300 mx-1 hidden sm:inline" />
                      <button
                        onClick={() => setShowMuseumsOnMap(!showMuseumsOnMap)}
                        className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 ${
                          showMuseumsOnMap 
                          ? 'bg-indigo-900 text-white shadow-md' 
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-600 border border-stone-200/50'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${showMuseumsOnMap ? 'bg-indigo-300' : 'bg-indigo-700 animate-pulse'}`} />
                        🏛️ Museen: {showMuseumsOnMap ? 'Anzeigen' : 'Ausgeblendet'}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-8 min-h-[800px]">
                  {/* Map Container */}
                  <div className="w-full h-[600px] glass-panel rounded-[2.5rem] shadow-2xl relative overflow-hidden transition-all duration-500">
                    <Map 
                      center={mapCenterRef.current} 
                      zoom={mapZoom}
                      onBoundsChanged={({ center, zoom }) => {
                        mapCenterRef.current = center;
                        if (Math.abs(zoom - mapZoom) > 0.01) {
                          setMapZoom(zoom);
                        }
                      }}
                    >
                      <ZoomControl />
                      <SaarlandBoundary />
                      {filteredSites.map(site => {
                        const markerStyles = getMarkerStyles(mapZoom);
                        const theme = getEraTheme(site.era);
                        return (
                          <Overlay 
                            // @ts-ignore
                            key={site.id}
                            anchor={[site.lat, site.lng]} 
                            offset={markerStyles.offset} 
                          >
                            <div 
                              className="group relative cursor-pointer"
                              onClick={() => setSelectedSite(site)}
                            >
                              {/* Outer Glow / Ring */}
                              <motion.div 
                                animate={{ scale: markerStyles.glowScale }}
                                transition={{ repeat: Infinity, duration: 3 }}
                                className={`absolute inset-0 ${theme.glowRingClass} rounded-full blur-md -z-10`}
                              />
                              
                              {/* Main Marker Body */}
                              <div className={`${markerStyles.sizeClass} bg-stone-900 rounded-full flex items-center justify-center text-white shadow-[0_5px_15px_rgba(0,0,0,0.3)] group-hover:scale-125 ${theme.ringHoverClass} transition-all relative overflow-hidden bg-white z-10`}>
                                {markerStyles.showContent && (
                                  <>
                                    <img 
                                      src={getSiteImage(site)} 
                                      alt={site.name}
                                      className={markerStyles.imgClass}
                                      referrerPolicy="no-referrer"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.opacity = '0';
                                      }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center -z-10 bg-stone-100 text-stone-400 font-bold text-[8px]">
                                      {site.name.substring(0, 2).toUpperCase()}
                                    </div>
                                  </>
                                )}
                              </div>

                              {/* Hover Label - High Contrast */}
                              <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-stone-900 text-white text-[10px] px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap font-black uppercase tracking-[0.2em] shadow-2xl pointer-events-none border-2 ${theme.tooltipBorderClass} scale-90 group-hover:scale-100 z-50`}>
                                {site.name}
                              </div>
                            </div>
                          </Overlay>
                        );
                      })}

                      {/* Render Museum Markers if active */}
                      {showMuseumsOnMap && MUSEUMS_DATA.map(museum => {
                        const markerStyles = getMarkerStyles(mapZoom);
                        return (
                          <Overlay 
                            // @ts-ignore
                            key={`mus-${museum.id}`}
                            anchor={[museum.lat, museum.lng]} 
                            offset={markerStyles.offset} 
                          >
                            <div 
                              className="group relative cursor-pointer"
                              onClick={() => setSelectedMuseumOnMap(museum)}
                            >
                              {/* Outer Glow / Ring for Museen */}
                              <motion.div 
                                animate={{ scale: markerStyles.glowScale }}
                                transition={{ repeat: Infinity, duration: 3 }}
                                className="absolute inset-0 bg-indigo-500/20 rounded-full blur-md -z-10"
                              />
                              
                              {/* Main Marker Body */}
                              <div className={`${markerStyles.sizeClass} bg-indigo-900 border-2 border-white rounded-full flex items-center justify-center text-white shadow-[0_5px_15px_rgba(0,0,0,0.3)] group-hover:scale-125 transition-all relative overflow-hidden bg-indigo-900 z-10 hover:bg-indigo-950`}>
                                <Landmark size={markerStyles.showContent ? 14 : 10} className="text-indigo-100 shrink-0" />
                              </div>

                              {/* Hover Label */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-indigo-950 text-white text-[10px] px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap font-black uppercase tracking-[0.2em] shadow-2xl pointer-events-none border-2 border-indigo-500/30 scale-90 group-hover:scale-100 z-50">
                                🏛️ {museum.name}
                              </div>
                            </div>
                          </Overlay>
                        );
                      })}
                    </Map>
                  </div>

                  {/* Sidebar Cards */}
                  <div className="w-full pr-2 space-y-6 transition-all duration-500 custom-scrollbar">
                    <div className="flex items-center justify-between px-2 mb-6">
                      <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-stone-400">Fundstellen ({filteredSites.length})</h3>
                      <div className="h-px grow bg-stone-200 ml-4 hidden md:block"></div>
                    </div>
                    {filteredSites.length === 0 ? (
                      <div className="text-center py-16 px-8 glass-panel rounded-3xl bg-amber-50/20 border border-stone-200/50">
                        <div className="text-stone-400 mb-4 flex justify-center">
                          <Compass size={40} className="stroke-[1.5]" />
                        </div>
                        <h4 className="text-stone-800 font-bold mb-2 text-base">Keine Fundstellen gefunden</h4>
                        <p className="text-xs text-stone-500 mb-6 max-w-md mx-auto leading-relaxed">
                          Es gibt keine Denkmäler, die Ihrer Suche nach <strong className="text-emerald-800">&quot;{searchQuery || filter}&quot;</strong> entsprechen.
                        </p>
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setFilter('All');
                          }}
                          className="px-6 py-3 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-emerald-800 transition-all shadow-md"
                        >
                          Suche zurücksetzen
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSites.map(site => (
                          <SiteCard key={site.id} site={site} onClick={() => setSelectedSite(site)} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              // ROUTE PLANNING VIEW - split view: Routing controller sidebar + interactive path routing map on the right
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[700px] items-stretch animate-fade-in">
                {/* Routing Control Sidebar */}
                <div className="lg:col-span-5 h-[700px] glass-panel rounded-[2.5rem] shadow-2xl overflow-hidden self-stretch">
                  <RoutingSidebar
                    destination={routeDestination}
                    activeRoute={activeRoute}
                    onSelectRoute={(route) => setActiveRoute(route)}
                    onClear={() => {
                      setRouteDestination(null);
                      setActiveRoute(null);
                      // Reset map view after clearing
                      setMapCenter([49.4, 6.9]);
                      setMapZoom(9);
                    }}
                    onSetMapCenter={(lat, lng, zoom) => {
                      setMapCenter([lat, lng]);
                      if (zoom) setMapZoom(zoom);
                    }}
                  />
                </div>

                {/* Map Area */}
                <div className="lg:col-span-7 h-[700px] glass-panel rounded-[2.5rem] shadow-2xl relative overflow-hidden self-stretch">
                  <Map 
                    center={mapCenterRef.current} 
                    zoom={mapZoom}
                    onBoundsChanged={({ center, zoom }) => {
                      mapCenterRef.current = center;
                      if (Math.abs(zoom - mapZoom) > 0.01) {
                        setMapZoom(zoom);
                      }
                    }}
                  >
                    <ZoomControl />
                    <SaarlandBoundary />
                    
                    {/* Render active route lines */}
                    {activeRoute && <MapRouteLine coordinates={activeRoute.coordinates} />}

                    {/* Destination site marker */}
                    {(() => {
                      const theme = getEraTheme(routeDestination.era);
                      return (
                        <Overlay anchor={[routeDestination.lat, routeDestination.lng]} offset={[12, 12]}>
                          <div 
                            className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white font-black text-sm shadow-lg animate-bounce relative z-50"
                            style={{ backgroundColor: theme.colorCode }}
                          >
                            <MapPin size={10} />
                            <span className={`absolute bottom-full mb-2 bg-stone-900 border-2 ${theme.tooltipBorderClass} text-white rounded-xl text-[9px] px-3 py-1 font-black shadow-lg uppercase whitespace-nowrap z-50`}>
                              {routeDestination.name}
                            </span>
                          </div>
                        </Overlay>
                      );
                    })()}

                    {/* Start point marker */}
                    {activeRoute && activeRoute.coordinates.length > 0 && (
                      <Overlay anchor={activeRoute.coordinates[0]} offset={[8, 8]}>
                        <div className="w-4 h-4 rounded-full border border-white bg-stone-900 flex items-center justify-center text-emerald-400 font-bold text-[8px] shadow-lg relative z-45">
                          <Navigation size={8} className="rotate-45" />
                          <span className="absolute top-full mt-2 bg-stone-900 border border-stone-700 text-white rounded-xl text-[8px] px-2 py-0.5 font-bold uppercase whitespace-nowrap">
                            Start
                          </span>
                        </div>
                      </Overlay>
                    )}
                  </Map>
                </div>
              </div>
            )}
          </div>
        );

      case 'epochs': {
        const rawActiveEpoch = EPOCHS_DATA.find(e => e.id === selectedEpochTab) || EPOCHS_DATA[0];
        const activeEpoch = getLocalizedEpoch(rawActiveEpoch, language);
        const activeTheme = getEraTheme(activeEpoch.id);
        const epochSites = SITES.filter(s => s.era === activeEpoch.id);

        return (
          <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
            {/* Header */}
            <div className="text-center mb-16">
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block px-4 py-1.5 glass-panel rounded-full text-emerald-800 text-[10px] font-bold uppercase tracking-[0.3em] mb-4 shadow-sm"
              >
                {getTranslation('epochs.timelineHeader', language)}
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-stone-900 leading-tight">
                {getTranslation('epochs.pageTitle', language)}
              </h1>
              <p className="text-stone-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-6">
                {getTranslation('epochs.pageDesc', language)}
              </p>
              <div className="flex justify-center">
                <FlaviusSpeechButton 
                  text={getTranslation('epochs.speakMain', language)}
                  sectionId="epochs"
                  speakingSection={speakingSection}
                  onSpeak={speakText}
                  isSpeechSupported={isSpeechSupported}
                  language={language}
                />
              </div>
            </div>

            {/* Timeline Navigator (Desktop & Mobile combined) */}
            <div className="mb-16">
              {/* Desktop Timeline Navigator */}
              <div className="hidden lg:block relative py-6">
                <div className="absolute top-1/2 left-[8%] right-[8%] h-0.5 bg-stone-200/80 -translate-y-1/2 z-0" />
                
                <div className="grid grid-cols-6 relative z-10">
                  {EPOCHS_DATA.map((rawEpoch, idx) => {
                    const epoch = getLocalizedEpoch(rawEpoch, language);
                    const isSelected = selectedEpochTab === epoch.id;
                    const epochTheme = getEraTheme(epoch.id);
                    return (
                      <button
                        key={epoch.id}
                        onClick={() => {
                          setSelectedEpochTab(epoch.id);
                          window.scrollTo({ top: 350, behavior: 'smooth' });
                        }}
                        className="flex flex-col items-center group focus:outline-none"
                      >
                        {/* Circle */}
                        <div className="relative mb-3 flex items-center justify-center">
                          {isSelected && (
                            <motion.div 
                              layoutId="activeGlow"
                              className={`absolute -inset-3 rounded-full blur-md opacity-70 ${epochTheme.glowRingClass}`}
                              transition={{ type: "spring", stiffness: 200, damping: 25 }}
                            />
                          )}
                          <div 
                            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-xs font-mono transition-all duration-300 relative z-10 ${
                              isSelected 
                                ? 'border-transparent text-white scale-115 shadow-md shadow-black/15'
                                : 'bg-white border-stone-200 text-stone-400 group-hover:border-stone-400 group-hover:text-stone-700'
                            }`}
                            style={{ backgroundColor: isSelected ? epochTheme.colorCode : undefined }}
                          >
                            0{idx + 1}
                          </div>
                        </div>

                        {/* Title & Date */}
                        <span className={`text-[12px] font-black uppercase tracking-wider transition-colors ${
                          isSelected ? 'text-stone-900 font-extrabold' : 'text-stone-500 group-hover:text-stone-800'
                        }`}>
                          {epoch.title}
                        </span>
                        <span className="text-[9px] font-mono font-medium text-stone-400 mt-0.5 text-center px-2">
                          {epoch.period.split(' – ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Timeline Row */}
              <div className="lg:hidden overflow-x-auto pb-4 custom-scrollbar flex gap-3 px-2 snap-x">
                {EPOCHS_DATA.map((rawEpoch, idx) => {
                  const epoch = getLocalizedEpoch(rawEpoch, language);
                  const isSelected = selectedEpochTab === epoch.id;
                  const epochTheme = getEraTheme(epoch.id);
                  return (
                    <button
                      key={epoch.id}
                      onClick={() => setSelectedEpochTab(epoch.id)}
                      className={`snap-center shrink-0 px-5 py-3 rounded-2xl border text-left transition-all flex flex-col gap-1 min-w-[140px] focus:outline-none ${
                        isSelected 
                          ? 'bg-stone-900 text-white border-stone-900 shadow-lg' 
                          : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <span className={`font-mono text-[9px] font-bold ${isSelected ? 'text-emerald-400' : 'text-stone-400'}`}>
                        0{idx + 1}
                      </span>
                      <span className="font-extrabold text-xs uppercase tracking-wider">
                        {epoch.title}
                      </span>
                      <span className={`text-[8px] font-mono ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                        {epoch.period.split(' – ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* active Era details card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedEpochTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                {/* Left column: Hauptbeschreibung & Highlights */}
                <div className="lg:col-span-7 space-y-8">
                  {/* General Info Card */}
                  <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-shadow relative overflow-hidden">
                    {/* Floating Accent Background */}
                    <div className="absolute -top-12 -right-12 w-48 h-48 opacity-5 rounded-full" style={{ backgroundColor: activeTheme.colorCode }} />

                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                      <span 
                        className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.25em] border ${activeTheme.badgeBgClass}`}
                      >
                        {activeEpoch.period}
                      </span>
                      <span className="font-mono text-sm font-extrabold text-stone-300">{getTranslation('epochs.phase', language)} 0{EPOCHS_DATA.findIndex(e => e.id === activeEpoch.id) + 1}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight flex items-center gap-3">
                        <span className="w-2.5 h-8 rounded-full" style={{ backgroundColor: activeTheme.colorCode }} />
                        {activeEpoch.title}
                      </h2>
                      <FlaviusSpeechButton 
                        text={`${activeEpoch.title}. Zeitspanne: ${activeEpoch.period}. ${activeEpoch.shortDesc} ${activeEpoch.longDesc}`}
                        sectionId={`epoch-detail-${activeEpoch.id}`}
                        speakingSection={speakingSection}
                        onSpeak={speakText}
                        isSpeechSupported={isSpeechSupported}
                        language={language}
                      />
                    </div>

                    <p className="text-stone-800 text-lg font-semibold leading-relaxed mb-6">
                      {activeEpoch.shortDesc}
                    </p>

                    <p className="text-stone-600 text-sm md:text-base leading-relaxed mb-8">
                      {activeEpoch.longDesc}
                    </p>

                    {/* Highlights Sub-block */}
                    <div className="pt-8 border-t border-stone-200/60">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 mb-6 flex items-center gap-2">
                        <History size={12} className={activeTheme.accentTextClass} />
                        {getTranslation('epochs.highlightsTitle', language)}
                      </h4>
                      <div className="space-y-4">
                        {activeEpoch.highlights.map((hlt, i) => (
                          <div key={i} className="flex gap-4 items-start">
                            <div className="w-6 h-6 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold font-mono bg-stone-100 text-stone-700 mt-0.5">
                              {i+1}
                            </div>
                            <p className="text-xs md:text-sm text-stone-700 leading-relaxed font-medium">
                              {hlt}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right column: Unterepochen & Fundorte */}
                <div className="lg:col-span-5 space-y-8">
                  {/* Unterepochen Card */}
                  <div className="glass-panel p-8 rounded-[2rem] shadow-xl">
                    <h3 className="text-stone-900 font-extrabold text-lg mb-6 tracking-tight border-b border-stone-100 pb-3">
                      {getTranslation('epochs.subErasTitle', language)}
                    </h3>
                    <div className="space-y-6">
                      {activeEpoch.subEras.map((sub, i) => (
                        <div key={i} className="relative pl-6 border-l-2 border-stone-200 hover:border-emerald-500/50 transition-colors">
                          <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full border border-white" style={{ backgroundColor: activeTheme.colorCode }} />
                          <div className="text-stone-900 font-bold text-xs uppercase tracking-wider mb-0.5">
                            {sub.name}
                          </div>
                          <div className="text-stone-400 font-mono text-[9px] font-extrabold mb-1">
                            {sub.timeline}
                          </div>
                          <p className="text-stone-600 text-xs leading-relaxed">
                            {sub.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fundorte in der Map */}
                  <div className="glass-panel p-8 rounded-[2rem] shadow-xl">
                    <h3 className="text-stone-900 font-extrabold text-lg mb-2 tracking-tight">
                      {getTranslation('epochs.sitesOnMap', language)} ({epochSites.length})
                    </h3>
                    <p className="text-stone-500 text-xs mb-6">
                      {getTranslation('epochs.mapClickInstructions', language)}
                    </p>

                    {epochSites.length > 0 && (
                      <div className="mb-6 p-4 rounded-2xl bg-stone-50 border border-stone-200/50 flex flex-col gap-3">
                        <p className="text-xs text-stone-600 leading-relaxed">
                          {getTranslation('epochs.downloadJsonDesc', language)}
                        </p>
                        <button
                          onClick={() => {
                            const dataToDownload = epochSites;
                            const blob = new Blob([JSON.stringify(dataToDownload, null, 2)], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${activeEpoch.id.toLowerCase()}_sites.json`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                          }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer focus:outline-none"
                        >
                          <Download size={14} />
                          {getTranslation('epochs.downloadJson', language)}
                        </button>
                      </div>
                    )}

                    {epochSites.length === 0 ? (
                      <div className="text-center py-8 border-2 border-dashed border-stone-200 rounded-2xl bg-stone-50/50">
                        <p className="text-stone-400 text-xs">{getTranslation('epochs.noSites', language)}</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                        {epochSites.map(site => (
                          <div 
                            key={site.id} 
                            className="p-4 bg-white/70 hover:bg-white rounded-xl border border-stone-200/50 hover:border-emerald-500/30 transition-all shadow-xs hover:shadow-md flex flex-col gap-2 group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="font-extrabold text-stone-900 text-xs group-hover:text-emerald-800 transition-colors">
                                  {site.name}
                                </h4>
                                <p className="text-stone-500 text-[9px] font-medium uppercase tracking-wider mt-0.5">
                                  📍 {site.location} {site.subEra ? `(${site.subEra})` : ''}
                                </p>
                              </div>
                              <span className="w-2 h-2 rounded-full mt-1.5 group-hover:scale-125 transition-transform" style={{ backgroundColor: activeTheme.colorCode }} />
                            </div>
                            <p className="text-stone-600 text-[11px] leading-relaxed line-clamp-2">
                              {site.description}
                            </p>
                            <button
                              onClick={() => {
                                setFilter(site.era);
                                setSearchQuery('');
                                setMapCenter([site.lat, site.lng]);
                                setMapZoom(13);
                                setSelectedSite(site);
                                setCurrentPage('sites');
                                window.scrollTo(0, 0);
                              }}
                              className="text-[10px] font-extrabold uppercase mt-1 tracking-widest text-emerald-700 hover:text-emerald-900 flex items-center gap-1.5 transition-colors self-start"
                            >
                              {getTranslation('epochs.showOnMap', language)} <ChevronRight size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        );
      }

      case 'museen':
        return (
          <MuseumsView 
            allSites={SITES}
            onFocusSiteOnMap={(siteId) => {
              const site = SITES.find(s => s.id === siteId);
              if (site) {
                setFilter(site.era);
                setSearchQuery('');
                setMapCenter([site.lat, site.lng]);
                setMapZoom(13);
                setSelectedSite(site);
                setCurrentPage('sites');
                window.scrollTo(0, 0);
              }
            }}
            onFocusMuseumOnMap={(museum) => {
              setMapCenter([museum.lat, museum.lng]);
              setMapZoom(13);
              setSelectedMuseumOnMap(museum);
              setShowMuseumsOnMap(true); // make sure museums are showing
              setCurrentPage('sites');
              window.scrollTo(0, 0);
            }}
            language={language}
          />
        );

      case 'tours':
        return (
          <ToursView 
            allSites={SITES} 
            onSelectSite={(site) => {
              setSelectedSite(site);
              setCurrentPage('sites');
              window.scrollTo(0, 0);
            }} 
            onNavigateToMap={(site) => {
              setFilter('All');
              setSearchQuery('');
              setMapCenter([site.lat, site.lng]);
              setMapZoom(13);
              setSelectedSite(site);
              setCurrentPage('sites');
              window.scrollTo(0, 0);
            }}
            initialTourId={travelguideTourId}
            language={language}
          />
        );

      case 'travelguide':
        return (
          <TravelGuideView
            allSites={SITES}
            onSelectSite={(site) => {
              setSelectedSite(site);
              setCurrentPage('sites');
              window.scrollTo(0, 0);
            }}
            onNavigateToMap={(site) => {
              setFilter('All');
              setSearchQuery('');
              setMapCenter([site.lat, site.lng]);
              setMapZoom(13);
              setSelectedSite(site);
              setCurrentPage('sites');
              window.scrollTo(0, 0);
            }}
            onSelectTour={(tourId) => {
              setTravelguideTourId(tourId);
            }}
            onNavigateToTours={() => {
              setCurrentPage('tours');
              window.scrollTo(0, 0);
            }}
            onNavigateToPage={(page) => {
              setCurrentPage(page);
              window.scrollTo(0, 0);
            }}
            language={language}
          />
        );

      case 'about':
        return (
          <div className="max-w-5xl mx-auto px-4 py-24">
            <div className="glass-panel p-6 sm:p-10 md:p-16 rounded-2xl md:rounded-[3rem] shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 md:mb-12">
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                  {getTranslation('about.heading', language)}
                </h1>
                <FlaviusSpeechButton 
                  text={getTranslation('about.flaviusSpeech', language)}
                  sectionId="about"
                  speakingSection={speakingSection}
                  onSpeak={speakText}
                  isSpeechSupported={isSpeechSupported}
                  language={language}
                />
              </div>
              <div className="prose prose-stone prose-xl text-stone-600 leading-relaxed space-y-10">
                <p className="text-lg sm:text-2xl text-stone-800 font-medium serif-italic italic">
                  "{getTranslation('about.subtitle', language)}"
                </p>
                <p className="text-sm sm:text-base md:text-lg">
                  {getTranslation('about.description', language)}
                </p>
                
                <div className="bg-stone-900 p-6 md:p-12 rounded-2xl md:rounded-[2.5rem] text-white flex flex-col md:flex-row gap-6 md:gap-12 items-center">
                  <div className="w-16 h-16 sm:w-32 sm:h-32 glass-nav rounded-2xl sm:rounded-3xl shrink-0 flex items-center justify-center text-emerald-400">
                    <History size={36} className="sm:hidden" />
                    <History size={48} className="hidden sm:block" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">
                      {getTranslation('about.responsibilityTitle', language)}
                    </h3>
                    <p className="text-stone-300 mb-4 md:mb-6 text-sm md:text-base italic">
                      {getTranslation('about.responsibilityText', language)}
                    </p>
                    <div className="font-bold text-lg">Sebastian Fürst</div>
                    <div className="text-xs uppercase tracking-[0.2em] font-bold text-emerald-400 mt-1">
                      {getTranslation('about.role', language)}
                    </div>
                    <a 
                      href="https://www.uni-saarland.de/fachrichtung/altertum/vor-und-fruehgeschichte.html" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-6 text-xs font-bold uppercase tracking-widest text-white hover:text-emerald-400 transition-colors"
                    >
                      {getTranslation('btn.moreAboutLehrstuhl', language)} <ExternalLink size={14} />
                    </a>
                  </div>
                </div>

                {/* Impressum Integration */}
                <div className="mt-16 pt-12 border-t border-stone-200/50">
                  <h3 className="text-2xl font-bold text-stone-900 mb-8 tracking-tight">
                    {getTranslation('impressum.title', language)}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-stone-600 text-sm">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-bold text-stone-900 uppercase tracking-[0.2em] text-[10px] mb-2 border-b border-stone-200 pb-1">
                          {getTranslation('impressum.responsible', language)}
                        </h4>
                        <p className="leading-relaxed text-stone-850 font-medium whitespace-pre-line">
                          <strong>Sebastian Fürst, MA.</strong><br />
                          {getTranslation('impressum.role', language)}<br />
                          {getTranslation('impressum.institute', language)}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 uppercase tracking-[0.2em] text-[10px] mb-2 border-b border-stone-200 pb-1">
                          {getTranslation('impressum.notice', language)}
                        </h4>
                        <p className="leading-relaxed text-xs">
                          {getTranslation('impressum.noticeText', language)}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-bold text-stone-900 uppercase tracking-[0.2em] text-[10px] mb-2 border-b border-stone-200 pb-1">
                          {getTranslation('impressum.contact', language)}
                        </h4>
                        <p className="leading-relaxed whitespace-pre-line">
                          {getTranslation('impressum.addressBlock', language)}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 uppercase tracking-[0.2em] text-[10px] mb-2 border-b border-stone-200 pb-1">
                          {getTranslation('impressum.participantsTitle', language)}
                        </h4>
                        <p className="leading-relaxed whitespace-pre-line text-xs">
                          {getTranslation('impressum.participantsList', language)}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 uppercase tracking-[0.2em] text-[10px] mb-2 border-b border-stone-200 pb-1">
                          {getTranslation('impressum.copyrightTitle', language)}
                        </h4>
                        <p className="leading-relaxed text-stone-600 text-[11px] whitespace-pre-line">
                          {getTranslation('impressum.copyrightText', language)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="max-w-4xl mx-auto px-4 py-24">
            <div className="glass-panel p-6 sm:p-10 md:p-16 rounded-2xl md:rounded-[3rem] shadow-2xl">
              <div className="flex items-center gap-4 sm:gap-6 mb-8 md:mb-12">
                <div className="w-12 h-12 sm:w-16 sm:h-16 glass-nav rounded-2xl sm:rounded-3xl flex items-center justify-center text-emerald-700 shadow-sm shrink-0">
                  <ShieldCheck size={24} className="sm:hidden" />
                  <ShieldCheck size={32} className="hidden sm:block" />
                </div>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-900">
                  {getTranslation('privacy.title', language)}
                </h1>
              </div>
              <div className="prose prose-stone prose-lg text-stone-600 space-y-12">
                <p className="leading-relaxed text-sm sm:text-base italic">
                  {getTranslation('privacy.intro', language)}
                </p>

                <section>
                  <h3 className="text-stone-900 font-bold text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-6">
                    {getTranslation('privacy.cookiesTitle', language)}
                  </h3>
                  <p className="leading-relaxed text-sm sm:text-base">
                    {getTranslation('privacy.cookiesText', language)}
                  </p>
                </section>

                <section>
                  <h3 className="text-stone-900 font-bold text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-6">
                    {getTranslation('privacy.storageTitle', language)}
                  </h3>
                  <p className="leading-relaxed text-sm sm:text-base">
                    {getTranslation('privacy.storageText', language)}
                  </p>
                </section>

                <section>
                  <h3 className="text-stone-900 font-bold text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-6">
                    {getTranslation('privacy.hostingTitle', language)}
                  </h3>
                  <p className="leading-relaxed text-sm sm:text-base">
                    {getTranslation('privacy.hostingText', language)}
                  </p>
                </section>

                <section>
                  <h3 className="text-stone-900 font-bold text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-6">
                    {getTranslation('privacy.osmTitle', language)}
                  </h3>
                  <p className="leading-relaxed text-sm sm:text-base">
                    {getTranslation('privacy.osmText', language)}
                  </p>
                </section>

                <section>
                  <h3 className="text-stone-900 font-bold text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-6">
                    {getTranslation('privacy.osrmTitle', language)}
                  </h3>
                  <p className="leading-relaxed text-sm sm:text-base">
                    {getTranslation('privacy.osrmText', language)}
                  </p>
                </section>

                <section>
                  <h3 className="text-stone-900 font-bold text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-6">
                    {getTranslation('privacy.rightsTitle', language)}
                  </h3>
                  <p className="leading-relaxed text-sm sm:text-base">
                    {getTranslation('privacy.rightsText', language)}
                  </p>
                </section>
              </div>
            </div>
          </div>
        );

      case 'impressum':
        return (
          <div className="max-w-4xl mx-auto px-4 py-24">
            <div className="glass-panel p-6 sm:p-10 md:p-16 rounded-2xl md:rounded-[3rem] shadow-2xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 md:mb-12 tracking-tight text-stone-900">{getTranslation('impressum.title', language)}</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 text-stone-600">
                <div className="space-y-10">
                  <div>
                    <h4 className="font-bold text-stone-900 uppercase tracking-[0.2em] text-[10px] mb-4 border-b border-stone-200 pb-2">{getTranslation('impressum.responsible', language)}</h4>
                    <p className="text-sm sm:text-base md:text-lg leading-relaxed text-stone-700 whitespace-pre-line">
                      <strong>Sebastian Fürst, MA.</strong><br />
                      {getTranslation('impressum.role', language)}<br />
                      {getTranslation('impressum.institute', language)}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 uppercase tracking-[0.2em] text-[10px] mb-4 border-b border-stone-200 pb-2">{getTranslation('impressum.notice', language)}</h4>
                    <p className="text-sm sm:text-base leading-relaxed text-stone-600">
                      {getTranslation('impressum.noticeText', language)}
                    </p>
                  </div>
                </div>
                <div className="space-y-10">
                  <div>
                    <h4 className="font-bold text-stone-900 uppercase tracking-[0.2em] text-[10px] mb-4 border-b border-stone-200 pb-2">{getTranslation('impressum.contact', language)}</h4>
                    <p className="text-sm sm:text-base md:text-lg leading-relaxed text-stone-700 whitespace-pre-line">
                      {getTranslation('impressum.addressBlock', language)}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 uppercase tracking-[0.2em] text-[10px] mb-4 border-b border-stone-200 pb-2">{getTranslation('impressum.participantsTitle', language)}</h4>
                    <p className="text-sm sm:text-base md:text-lg leading-relaxed text-stone-750 whitespace-pre-line">
                      {getTranslation('impressum.participantsList', language)}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 uppercase tracking-[0.2em] text-[10px] mb-4 border-b border-stone-200 pb-2">{getTranslation('impressum.copyrightTitle', language)}</h4>
                    <p className="text-sm sm:text-base leading-relaxed text-stone-600 whitespace-pre-line">
                      {getTranslation('impressum.copyrightText', language)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col relative text-stone-900 bg-stone-250 dark:text-stone-100 dark:bg-stone-950 transition-colors duration-350 ${isLandscape ? 'bg-stone-900/40 p-3 md:p-8 items-center justify-center' : ''}`}>
      <div className="bg-blobs">
        <div className="blob-1"></div>
        <div className="blob-2"></div>
        <div className="blob-3"></div>
      </div>

      {isLandscape ? (
        /* Render Lansdscape Mobile Simulation Mode */
        <div className="w-full max-w-5xl aspect-[16/10] ring-12 ring-stone-900/90 dark:ring-stone-800 bg-stone-200 dark:bg-stone-900 rounded-[32px] shadow-2xl relative overflow-hidden flex flex-col border border-stone-800">
          {/* Top Bar simulation with info and option to shut it off */}
          <div className="bg-stone-950 text-white text-[10px] py-1 px-6 flex justify-between items-center z-[160] font-sans border-b border-stone-800 select-none">
            <span className="font-bold flex items-center gap-1 text-emerald-400">📱 Querformat-Simulation (Mobilgerät)</span>
            <span className="font-medium opacity-60">Ideal zum Testen der mobilen Kartennavigation</span>
            <button 
              onClick={() => setIsLandscape(false)} 
              className="hover:underline font-bold text-rose-400 self-stretch"
            >
              Simulation Beenden ✕
            </button>
          </div>

          <div ref={landscapeScrollRef} className="flex-grow overflow-y-auto relative h-full custom-scrollbar">
            <Navbar 
              currentPage={currentPage}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
              isLandscape={isLandscape}
              setIsLandscape={setIsLandscape}
              language={language}
              setLanguage={setLanguage}
              onNavigate={(page) => {
                setCurrentPage(page);
                setSelectedSite(null);
                setSelectedMuseumOnMap(null);
                setTravelguideTourId(null);
              }} 
            />
            
            <div className="pt-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      ) : (
        /* Normal web preview layout display */
        <>
          <Navbar 
            currentPage={currentPage}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            isLandscape={isLandscape}
            setIsLandscape={setIsLandscape}
            language={language}
            setLanguage={setLanguage}
            onNavigate={(page) => {
              setCurrentPage(page);
              setSelectedSite(null);
              setSelectedMuseumOnMap(null);
              setTravelguideTourId(null);
              window.scrollTo(0, 0);
            }} 
          />
          
          <main className="flex-grow pt-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </>
      )}

      <AnimatePresence>
        {selectedSite && (
          <SteckbriefOverlay 
            site={selectedSite} 
            language={language}
            onClose={() => setSelectedSite(null)} 
            onCalculateRoute={(site) => {
              setSelectedSite(null);
              setRouteDestination(site);
              setCurrentPage('sites');
              // Zoom out a bit or focus near destination coordinates originally
              setMapCenter([site.lat, site.lng]);
              setMapZoom(11);
              window.scrollTo(0, 0);
            }}
            onOpenLightbox={(index) => {
              const safeFallback = selectedSite.name.toLowerCase().includes('reinheim') ? 'images/dummy-005-kulturpark-bliesbruck-reinheim.jpg' : 'images/dummy-001-gollenstein.jpg';
              const safeSrc = getSiteImage(selectedSite);
              const imgs = [
                {
                  src: safeSrc,
                  fallbackSrc: selectedSite.imageUrl && !selectedSite.imageUrl.includes('unsplash') ? selectedSite.imageUrl : safeFallback,
                  title: `${selectedSite.name} (Visualisierung)`
                }
              ];
              if (selectedSite.galleryIds) {
                selectedSite.galleryIds.forEach(id => {
                  imgs.push({
                    src: `${id}.jpeg`,
                    fallbackSrc: `${id}.jpg`,
                    title: `${selectedSite.name} - ${id}`
                  });
                });
              }
              setActiveLightbox({
                images: imgs,
                index: index
              });
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedMuseumOnMap && (
          <MuseumSteckbriefOverlay
            museum={selectedMuseumOnMap}
            onClose={() => setSelectedMuseumOnMap(null)}
            allSites={SITES}
            onFocusSiteOnMap={(siteId) => {
              const site = SITES.find(s => s.id === siteId);
              if (site) {
                setFilter(site.era);
                setSearchQuery('');
                setMapCenter([site.lat, site.lng]);
                setMapZoom(14);
                setSelectedSite(site);
                setSelectedMuseumOnMap(null); // close museum overlay
                setCurrentPage('sites');
                window.scrollTo(0, 0);
              }
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeLightbox && (
          <ImageLightbox
            images={activeLightbox.images}
            initialIndex={activeLightbox.index}
            onClose={() => setActiveLightbox(null)}
          />
        )}
      </AnimatePresence>

      {currentPage !== 'home' && (
        <Footer 
          language={language}
          onNavigate={(page) => {
            setCurrentPage(page);
            setSelectedSite(null);
            window.scrollTo(0, 0);
          }} 
        />
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}
