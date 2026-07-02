import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  Clock, 
  ArrowLeft, 
  Download, 
  MapPin, 
  Navigation, 
  Info, 
  ExternalLink, 
  SlidersHorizontal, 
  Footprints, 
  Route, 
  Mountain, 
  CheckCircle, 
  AlertCircle,
  Map as MapIcon,
  Sparkles,
  Ticket,
  ChevronRight,
  Printer,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Map, Overlay, ZoomControl } from 'pigeon-maps';
import { Site, Tour } from '../types';
import { MapRouteLine } from './RoutingInterface';
import { TOURS } from '../data/toursData';
import { Language, getMaleVoice, getVoicePitch, getTranslation } from '../data/translations';

interface ToursViewProps {
  allSites: Site[];
  onSelectSite: (site: Site) => void;
  onNavigateToMap: (site: Site) => void;
  initialTourId?: string | null;
  language?: Language;
}

export default function ToursView({ allSites, onSelectSite, onNavigateToMap, initialTourId, language = 'de' }: ToursViewProps) {
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

  // VOICE / SPEECH SYNTHESIS STATE
  const [speakingMessageId, setSpeakingMessageId] = useState<string | number | null>(null);
  const isSpeechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const speak = (text: string, id: string | number) => {
    if (!isSpeechSupported) return;

    // Toggle speech if clicked again on the active speaker
    if (speakingMessageId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Standardize & clean text from emojis, markdown symbols for smooth audio
    const cleanText = text
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/[•📍🗺️⏳🏛️🥾🧭🏺🛡️🏹🏰🌲🧗🚨]/g, '')
      .replace(/\bSalvete\b/gi, 'Sal-weh-te')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const langCode = language === 'de' ? 'de-DE' : language === 'en' ? 'en-US' : language === 'fr' ? 'fr-FR' : 'nl-NL';
    utterance.lang = langCode;

    // Find proper voice matching language
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = getMaleVoice(voices, language);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Set pitch and rate to sound clear and natural
    utterance.pitch = getVoicePitch(selectedVoice);
    utterance.rate = 0.95;

    utterance.onend = () => {
      setSpeakingMessageId(null);
    };

    utterance.onerror = () => {
      setSpeakingMessageId(null);
    };

    setSpeakingMessageId(id);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (initialTourId) {
      const found = TOURS.find(t => t.id === initialTourId);
      if (found) {
        setSelectedTour(found);
      }
    }
  }, [initialTourId]);

  // Stop speaking when opening/closing or changing tour
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
    }
  }, [selectedTour]);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [activeActivity, setActiveActivity] = useState<'All' | 'Wandern' | 'Radfahren'>('All');
  const [showPrintPreview, setShowPrintPreview] = useState<boolean>(false);

  // Filters the list of tours by search text, difficulty, and activity
  const filteredTours = TOURS.filter(tour => {
    const matchesActivity = activeActivity === 'All' || (tour.activity || 'Wandern') === activeActivity;
    const matchesDifficulty = difficultyFilter === 'All' || tour.difficulty === difficultyFilter;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || 
      tour.name.toLowerCase().includes(query) ||
      tour.description.toLowerCase().includes(query) || 
      tour.type.toLowerCase().includes(query) ||
      tour.startPoint.toLowerCase().includes(query);
    return matchesActivity && matchesDifficulty && matchesSearch;
  });

  // Generates real XML-formatted GPX download on the fly for authentic trails
  const generateGPX = (tour: Tour) => {
    const gpxHeader = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Archaeologie Saarland Tour Planner" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${tour.name}</name>
    <desc>${tour.description}</desc>
    <author>
      <name>Universitaet des Saarlandes Archäologie</name>
    </author>
  </metadata>
  <trk>
    <name>${tour.name} - Track</name>
    <trkseg>`;

    const gpxPoints = tour.pathCoordinates.map(coord => 
      `      <trkpt lat="${coord[0]}" lon="${coord[1]}">
        <ele>250</ele>
      </trkpt>`
    ).join('\n');

    const gpxFooter = `
    </trkseg>
  </trk>
</gpx>`;

    const element = document.createElement("a");
    const file = new Blob([gpxHeader + gpxPoints + gpxFooter], {type: 'application/gpx+xml'});
    element.href = URL.createObjectURL(file);
    element.download = `${tour.id}-route.gpx`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12" id="tours-section">
      <AnimatePresence mode="wait">
        {!selectedTour ? (
          // --- List of Tours (Tourenübersicht) ---
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            {/* Header Area mimicking touren.saarland branding with modern aesthetic */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-stone-200/60 pb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3">
                  <Sparkles size={11} className="animate-spin-slow" /> {getTranslation('tours.subTitle', language)}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-stone-900">
                    {getTranslation('tours.title', language)}
                  </h1>
                  {isSpeechSupported && (
                    <button
                      onClick={() => {
                        const textToSpeak = getTranslation('tours.speakMain', language);
                        speak(textToSpeak, 'tours-main');
                      }}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer border flex items-center gap-2 shadow-xs active:scale-95 shrink-0 ${
                        speakingMessageId === 'tours-main'
                          ? 'bg-amber-500 border-amber-400 text-stone-900 animate-pulse font-black shadow-md'
                          : 'bg-amber-50 hover:bg-amber-500 border-amber-200 hover:border-amber-400 text-amber-800 hover:text-stone-900 shadow-xs'
                      }`}
                      title={speakingMessageId === 'tours-main' ? getTranslation('btn.stopSpeak', language) : getTranslation('btn.flaviusSpeak', language)}
                    >
                      {speakingMessageId === 'tours-main' ? (
                        <>
                          <VolumeX size={12} className="shrink-0" />
                          <span>⏹️ {getTranslation('btn.stop', language)}</span>
                        </>
                      ) : (
                        <>
                          <Volume2 size={12} className="shrink-0 animate-pulse" />
                          <span>🔊 {getTranslation('btn.flaviusSpeak', language)}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
                <p className="text-stone-500 font-medium tracking-wide mt-2 max-w-2xl">
                  {getTranslation('tours.desc', language)}
                </p>
              </div>

              {/* Dynamic Quick Buttons to tourist networks */}
              <div className="flex flex-wrap gap-2">
                <a 
                  href="https://www.touren.saarland/de/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 hover:border-stone-300 rounded-xl text-xs font-bold text-stone-700 flex items-center gap-2 transition-all"
                >
                  <Compass size={14} className="text-emerald-700" />
                  {getTranslation('tours.originalSaarland', language)}
                </a>
              </div>
            </div>

            {/* Activity Type Navigation Tabs */}
            <div className="flex gap-2 p-1 bg-stone-100/80 rounded-2xl w-full max-w-md mb-8 border border-stone-200/50">
              <button
                type="button"
                onClick={() => setActiveActivity('All')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all text-center uppercase tracking-wider ${
                  activeActivity === 'All'
                    ? 'bg-emerald-800 text-white shadow-md'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-white/50'
                }`}
              >
                {getTranslation('tours.all', language)}
              </button>
              <button
                type="button"
                onClick={() => setActiveActivity('Wandern')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all text-center uppercase tracking-wider flex items-center justify-center gap-1.5 ${
                  activeActivity === 'Wandern'
                    ? 'bg-emerald-800 text-white shadow-md'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-white/50'
                }`}
              >
                🥾 {getTranslation('tours.hiking', language)}
              </button>
              <button
                type="button"
                onClick={() => setActiveActivity('Radfahren')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all text-center uppercase tracking-wider flex items-center justify-center gap-1.5 ${
                  activeActivity === 'Radfahren'
                    ? 'bg-emerald-800 text-white shadow-md'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-white/50'
                }`}
              >
                🚲 {getTranslation('tours.cycling', language)}
              </button>
            </div>

            {/* Filter and Search Panel */}
            <div className="glass-panel p-6 rounded-3xl mb-8 flex flex-col gap-4 shadow-md bg-stone-50/50">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                {/* Text Search */}
                <div className="relative grow lg:max-w-md">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={getTranslation('tours.searchPlaceholder', language)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/30 rounded-2xl text-xs font-semibold tracking-wide transition-all text-stone-800"
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
                    <Compass size={14} />
                  </div>
                </div>

                {/* Desktop Difficulty Buttons */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mr-2 flex items-center gap-1">
                    <SlidersHorizontal size={12} /> {getTranslation('tours.difficulty', language)}:
                  </span>
                  {['All', 'Leicht', 'Mittel', 'Schwer'].map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setDifficultyFilter(diff)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                        difficultyFilter === diff
                          ? 'bg-emerald-800 text-white shadow-md'
                          : 'bg-white hover:bg-stone-100 border border-stone-200 text-stone-600'
                      }`}
                    >
                      {diff === 'All' ? getTranslation('tours.allDifficulty', language) : diff === 'Leicht' ? getTranslation('tours.easy', language) : diff === 'Mittel' ? getTranslation('tours.medium', language) : getTranslation('tours.hard', language)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tours Grid rendering */}
            {filteredTours.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredTours.map((tour) => {
                  const difficultyColor = 
                    tour.difficulty === 'Leicht' ? 'bg-green-50 text-green-800 border-green-200' :
                    tour.difficulty === 'Mittel' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                    'bg-rose-50 text-rose-800 border-rose-200';

                  const stopsCount = tour.stopIds.length;

                  return (
                    <motion.div
                      key={tour.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -6 }}
                      className="group bg-white rounded-3xl overflow-hidden border border-stone-150 shadow-sm hover:shadow-xl transition-all flex flex-col cursor-pointer"
                      onClick={() => setSelectedTour(tour)}
                    >
                      {/* Image container with subtle visual overlay */}
                      <div className="h-56 relative overflow-hidden bg-stone-100">
                        <img 
                          src={tour.imageUrl} 
                          alt={tour.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        {/* Tags floating on image */}
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-lg border backdrop-blur-md ${difficultyColor}`}>
                            {tour.difficulty === 'Leicht' ? getTranslation('tours.easy', language) : tour.difficulty === 'Mittel' ? getTranslation('tours.medium', language) : getTranslation('tours.hard', language)}
                          </span>
                          <span className="px-2.5 py-1 bg-white/90 text-stone-800 border border-stone-100 rounded-lg text-[9px] font-bold uppercase tracking-wider backdrop-blur-md">
                            {tour.type}
                          </span>
                        </div>

                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                          <div className="flex gap-4 text-white text-xs font-semibold">
                            <span className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm">
                              <Route size={12} className="text-emerald-400" /> {tour.distance} km
                            </span>
                            <span className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm">
                              <Clock size={12} className="text-amber-400" /> {tour.duration}
                            </span>
                            <span className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm">
                              <Mountain size={12} className="text-sky-400" /> {tour.elevationUp} m
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Content panel */}
                      <div className="p-6 flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-stone-900 group-hover:text-emerald-800 transition-colors leading-snug">
                            {tour.name}
                          </h3>
                          <p className="text-stone-500 text-xs font-medium tracking-wide leading-relaxed mt-2.5 line-clamp-3">
                            {tour.description}
                          </p>
                        </div>

                        {/* Archaeological sites counter */}
                        <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-500">
                          <span className="flex items-center gap-1.5 text-stone-600">
                            <MapPin size={14} className="text-emerald-700" />
                            {stopsCount} {stopsCount === 1 ? getTranslation('tours.station', language) : getTranslation('tours.stations', language)}
                          </span>
                          <span className="text-emerald-800 flex items-center gap-1 font-bold group-hover:translate-x-1 transition-transform">
                            {getTranslation('tours.viewDetails', language)} <ChevronRight size={14} />
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-stone-50 rounded-3xl border-2 border-dashed border-stone-200">
                <AlertCircle className="mx-auto text-stone-400 mb-2" size={32} />
                <h3 className="font-bold text-stone-800">{getTranslation('tours.noToursTitle', language)}</h3>
                <p className="text-stone-500 text-xs mt-1">{getTranslation('tours.noToursDesc', language)}</p>
                <button
                  onClick={() => { setDifficultyFilter('All'); setSearchQuery(''); }}
                  className="mt-4 px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  {getTranslation('tours.resetFilters', language)}
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          // --- Detailed view of a single tour (Einzeltouren-Ansicht) ---
          <motion.div
            key="detail"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Back Button and share controls */}
            <div className="lg:col-span-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
              <button
                onClick={() => setSelectedTour(null)}
                className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-950 font-bold transition-all bg-white hover:bg-stone-50 border border-stone-200 hover:border-stone-300 py-2.5 px-4 rounded-xl text-xs cursor-pointer"
              >
                <ArrowLeft size={14} /> {getTranslation('tours.backToOverview', language)}
              </button>

              <div className="flex flex-wrap gap-2 items-center">
                <button
                  onClick={handleShare}
                  className="bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer"
                >
                  {copiedLink ? getTranslation('tours.copied', language) : getTranslation('tours.share', language)}
                </button>
                <button
                  onClick={() => setShowPrintPreview(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-stone-950 text-xs font-black py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                  title="Layout-optimierten Wander-Flyer (max. 2 A4-Seiten) drucken"
                >
                  <Printer size={14} /> {getTranslation('tours.printFlyer', language)}
                </button>
                <button
                  onClick={() => generateGPX(selectedTour)}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                  title="Valide GPX-Datei für Garmin/Komoot generieren"
                >
                  <Download size={14} /> {getTranslation('tours.gpxDownload', language)}
                </button>
              </div>
            </div>

            {/* Left side: Detailed Content Panel (7 columns) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Cover Photo */}
              <div className="h-80 rounded-3xl overflow-hidden bg-stone-100 relative shadow-sm">
                <img 
                  src={selectedTour.imageUrl} 
                  alt={selectedTour.name} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest block mb-1.5">
                    {selectedTour.type}
                  </span>
                  <h2 className="text-3xl font-extrabold text-white leading-tight">
                    {selectedTour.name}
                  </h2>
                </div>
              </div>

              {/* Highlights/Key statistics bar resembling Touren-Saarland interface */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-stone-50 p-6 rounded-3xl border border-stone-200/80">
                <div className="flex flex-col items-center justify-center text-center p-2">
                  <Route className="text-emerald-700 mb-1" size={20} />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-stone-400">{getTranslation('tours.distance', language)}</span>
                  <span className="text-lg font-extrabold text-stone-900 mt-0.5">{selectedTour.distance} km</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center p-2 border-l border-stone-200">
                  <Clock className="text-amber-600 mb-1" size={20} />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-stone-400">{getTranslation('tours.duration', language)}</span>
                  <span className="text-lg font-extrabold text-stone-900 mt-0.5">{selectedTour.duration}</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center p-2 border-l border-stone-200">
                  <Mountain className="text-sky-600 mb-1" size={20} />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-stone-400">{getTranslation('tours.elevation', language)}</span>
                  <span className="text-lg font-extrabold text-stone-900 mt-0.5">{selectedTour.elevationUp} m</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center p-2 border-l border-stone-200">
                  <Footprints className="text-rose-600 mb-1" size={20} />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-stone-400">{getTranslation('tours.difficulty', language)}</span>
                  <span className="text-base font-extrabold text-stone-900 mt-0.5">{selectedTour.difficulty === 'Leicht' ? getTranslation('tours.easy', language) : selectedTour.difficulty === 'Mittel' ? getTranslation('tours.medium', language) : getTranslation('tours.hard', language)}</span>
                </div>
              </div>

              {/* Description Body */}
              <div className="glass-panel p-6 rounded-3xl text-stone-850">
                <h3 className="text-lg font-bold text-stone-900 mb-3">{getTranslation('tours.description', language)}</h3>
                <p className="text-xs leading-relaxed text-stone-600 font-medium whitespace-pre-line">
                  {selectedTour.longDescription}
                </p>
                
                <div className="mt-6 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-800/10 flex items-start gap-3">
                  <Info className="text-emerald-800 shrink-0 mt-0.5" size={16} />
                  <div className="text-xs">
                    <span className="font-bold text-emerald-950">{getTranslation('tours.startPoint', language)}</span>
                    <p className="text-stone-600 mt-0.5">{selectedTour.startPoint}</p>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedTour.startCoords[0]},${selectedTour.startCoords[1]}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-800 hover:underline font-bold mt-1.5 inline-flex items-center gap-1 focus:outline-none"
                    >
                      <Navigation size={12} /> {getTranslation('tours.directionsToStart', language)} <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Altitude Profile (Höhenprofil) area chart generated via custom SVG */}
              <div className="glass-panel p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Mountain size={18} className="text-stone-700" /> {getTranslation('tours.altitudeProfile', language)}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    {getTranslation('tours.maxSlope', language)} {selectedTour.difficulty === 'Schwer' ? '12%' : '6%'}
                  </span>
                </div>

                <div className="relative w-full h-40 bg-stone-50/60 rounded-2xl border border-stone-200/50 p-3 overflow-hidden flex flex-col justify-between">
                  <div className="w-full h-24 relative mt-2">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                      <div className="w-full border-t border-stone-900" />
                      <div className="w-full border-t border-stone-900" />
                      <div className="w-full border-t border-stone-900" />
                    </div>

                    {/* SVG Height Plot Area (Terrain path is allowed to stretch safely) */}
                    {(() => {
                      const elevationsList = selectedTour.elevationProfile.map(p => p.elevation);
                      const minElevVal = Math.min(...elevationsList);
                      const maxElevVal = Math.max(...elevationsList);
                      const elevRange = maxElevVal - minElevVal;
                      const paddingVal = elevRange > 10 ? elevRange * 0.15 : 10;
                      const minElev = Math.max(0, minElevVal - paddingVal);
                      const maxElev = maxElevVal + paddingVal;

                      return (
                        <>
                          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                            <defs>
                              <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#047857" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#047857" stopOpacity="0.0" />
                              </linearGradient>
                            </defs>
                            
                            {/* Polygon representation of altitudes */}
                            <polygon
                              points={`0,100 ${selectedTour.elevationProfile.map((pt, i) => {
                                const x = (i / (selectedTour.elevationProfile.length - 1)) * 100;
                                const y = 90 - ((pt.elevation - minElev) / (maxElev - minElev)) * 80;
                                return `${x},${y}`;
                              }).join(' ')} 100,100`}
                              fill="url(#elevationGrad)"
                            />

                            {/* Top boundary line */}
                            <polyline
                              points={selectedTour.elevationProfile.map((pt, i) => {
                                const x = (i / (selectedTour.elevationProfile.length - 1)) * 100;
                                const y = 90 - ((pt.elevation - minElev) / (maxElev - minElev)) * 80;
                                return `${x},${y}`;
                              }).join(' ')}
                              fill="none"
                              stroke="#047857"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                            />
                          </svg>

                          {/* Render custom crisp HTML markers & labels over the SVG to prevent stretching or blurriness */}
                          <div className="absolute inset-0 pointer-events-none">
                            {selectedTour.elevationProfile.map((pt, i) => {
                              const xPercent = (i / (selectedTour.elevationProfile.length - 1)) * 100;
                              const yPercent = 90 - ((pt.elevation - minElev) / (maxElev - minElev)) * 80;
                              
                              return (
                                <div 
                                  key={i} 
                                  className="absolute flex flex-col items-center"
                                  style={{ 
                                    left: `${xPercent}%`, 
                                    top: `${yPercent}%`, 
                                    transform: 'translate(-50%, -50%)' 
                                  }}
                                >
                                  {/* Crisp constant size Dot */}
                                  <div className="w-2.5 h-2.5 rounded-full bg-white border-2 border-emerald-700 shadow-sm shrink-0" />
                                  
                                  {/* Crisp constant size text label */}
                                  <div className="absolute -top-7 bg-stone-900/95 text-white font-mono px-1.5 py-0.5 rounded text-[8px] font-bold shadow-md whitespace-nowrap border border-stone-800">
                                    {pt.elevation} m
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Horizontal Distance markings */}
                  <div className="flex justify-between text-[9px] font-bold text-stone-500 font-mono pt-1.5 border-t border-stone-200 mt-2">
                    <span>0 km</span>
                    <span>{Math.round(selectedTour.distance / 2)} km</span>
                    <span>{selectedTour.distance} km</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Map and Highlights list (5 columns) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Interactive map representing route track and archaeological marker spots */}
              <div className="h-80 rounded-3xl overflow-hidden bg-stone-100 border border-stone-200 relative shadow-inner">
                <Map 
                  center={selectedTour.startCoords} 
                  zoom={12} 
                  mouseEvents={false}
                  touchEvents={false}
                >
                  <ZoomControl />
                  
                  {/* Draw the track line */}
                  <MapRouteLine coordinates={selectedTour.pathCoordinates} />

                  {/* Highlight locations markers */}
                  {allSites
                    .filter(site => selectedTour.stopIds.includes(site.id))
                    .map(site => {
                      return (
                        <Overlay 
                          // @ts-ignore
                          key={site.id} 
                          anchor={[site.lat, site.lng]} 
                          offset={[12, 12]}
                        >
                          <button
                            onClick={() => onSelectSite(site)}
                            className="bg-emerald-800 hover:bg-emerald-900 border border-white text-white p-2 text-xs rounded-full shadow-lg font-bold flex items-center justify-center transition-all scale-100 hover:scale-110 shrink-0"
                            title={site.name}
                          >
                            <MapPin size={14} />
                          </button>
                        </Overlay>
                      );
                    })}

                  {/* Start Point Marker logo */}
                  <Overlay anchor={selectedTour.startCoords} offset={[10, 10]}>
                    <div className="bg-stone-900 text-white border border-white text-[9px] uppercase tracking-wider font-extrabold px-2 py-1 rounded-md shadow-md">
                      S / Z
                    </div>
                  </Overlay>
                </Map>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm shadow-md rounded-xl px-2.5 py-1 text-[9px] font-extrabold text-stone-850 uppercase tracking-widest pointer-events-none z-10">
                  {getTranslation('tours.mapPreview', language)}
                </div>
              </div>

              {/* Highlights along the way list ("Sehenswürdigkeiten am Wegesrand") */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-stone-950 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin size={16} className="text-emerald-700" /> {getTranslation('tours.highlights', language)}
                </h3>
                
                <div className="flex flex-col gap-3">
                  {allSites
                    .filter(site => selectedTour.stopIds.includes(site.id))
                    .map((site) => {
                      return (
                        <div 
                          key={site.id}
                          className="group bg-white hover:bg-emerald-50/20 border border-stone-200/80 hover:border-emerald-700/20 rounded-2xl p-4 transition-all flex gap-4 items-stretch shadow-sm"
                        >
                          <div className="w-16 h-16 min-w-16 min-h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                            <img src={site.imageUrl} alt={site.name} className="w-full h-full object-cover" />
                          </div>
                          
                          <div className="flex flex-col justify-between grow">
                            <div>
                              <div className="flex justify-between items-start gap-1">
                                <h4 className="text-[13px] font-bold text-stone-900 group-hover:text-emerald-800 transition-colors leading-snug">
                                  {site.name}
                                </h4>
                                <span className="text-[9px] font-bold uppercase tracking-wider bg-stone-100 px-1.5 py-0.5 rounded text-stone-500 shrink-0">
                                  {site.era}
                                </span>
                              </div>
                              <p className="text-[11px] text-stone-500 leading-normal mt-1 line-clamp-2">
                                {site.description}
                              </p>
                            </div>

                            {/* Options to click */}
                            <div className="flex justify-end gap-3 mt-3 pt-2 border-t border-stone-100 text-[10px] font-extrabold uppercase tracking-wide">
                              <button
                                onClick={() => onSelectSite(site)}
                                className="text-stone-600 hover:text-stone-950 flex items-center gap-1 hover:underline cursor-pointer"
                              >
                                {getTranslation('tours.siteFile', language)}
                              </button>
                              <button
                                onClick={() => onNavigateToMap(site)}
                                className="text-emerald-800 hover:text-emerald-990 flex items-center gap-1 hover:underline cursor-pointer"
                              >
                                <MapIcon size={12} /> {getTranslation('tours.showMap', language)}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Equipment and Safety panels */}
              <div className="bg-stone-50/60 p-5 rounded-3xl border border-stone-200 flex flex-col gap-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-stone-800 flex items-center gap-1 mb-2">
                    <CheckCircle size={14} className="text-emerald-700" /> {getTranslation('tours.recommendedEquipment', language)}
                  </h4>
                  <ul className="text-xs text-stone-600 space-y-1 pl-1 list-none font-medium">
                    {selectedTour.equipment.map((eq, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-800 shrink-0" /> {eq}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-3 border-t border-stone-200">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-stone-800 flex items-center gap-1 mb-1.5">
                    <AlertCircle size={14} className="text-amber-600" /> {getTranslation('tours.safetyInstructions', language)}
                  </h4>
                  <p className="text-xs text-stone-600 leading-normal font-medium">
                    {selectedTour.safetyTips}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Printable Flyer (Portal injected at document.body for flawless A4 print layout) */}
      {selectedTour && createPortal(
        <div className={`print-container-wrapper ${showPrintPreview ? 'fixed inset-0 bg-stone-950/90 backdrop-blur-md z-[9999] overflow-y-auto p-4 md:p-8 flex flex-col items-center' : 'hidden print:block'}`} id="print-guide-portal">
          {showPrintPreview && (
            <div className="w-full max-w-[210mm] mb-6 flex flex-col sm:flex-row justify-between items-center bg-stone-900 border border-stone-800 p-4 rounded-2xl gap-4 shadow-xl no-print">
              <div>
                <h4 className="text-sm font-bold text-stone-100 flex items-center gap-2">
                  <Printer size={16} className="text-amber-400" /> {getTranslation('tours.printFlyer', language)}: {selectedTour.name}
                </h4>
                <p className="text-stone-400 text-[10px] mt-0.5">{getTranslation('tours.printNotice', language)}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => window.print()}
                  className="bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-black py-2 px-4 rounded-xl flex items-center gap-1.5 shadow transition-all cursor-pointer"
                >
                  <Printer size={14} /> {getTranslation('tours.printStart', language)}
                </button>
                <button
                  onClick={() => setShowPrintPreview(false)}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 text-xs font-bold py-2 px-4 rounded-xl transition-all cursor-pointer"
                >
                  {getTranslation('tours.close', language)}
                </button>
              </div>
            </div>
          )}

          <div className={`${showPrintPreview ? 'flex flex-col gap-8 shadow-2xl pb-12' : ''}`}>
            {/* PAGE 1: VORDERSEITE */}
            <div className="print-page bg-white text-stone-900 flex flex-col justify-between" style={{ fontFamily: 'Inter, sans-serif' }}>
              {/* Header with emblem */}
              <div className="border-b-2 border-stone-900 pb-4 flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-black tracking-widest text-emerald-800 uppercase block mb-1">
                    {getTranslation('tours.officialGuide', language)}
                  </span>
                  <h3 className="text-xl font-extrabold text-stone-900 uppercase tracking-tight font-serif">
                    {getTranslation('tours.saarlandMonuments', language)}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-mono font-bold text-stone-500 uppercase block">{getTranslation('tours.edition', language)}</span>
                  <span className="text-xs text-stone-800 font-serif italic">{getTranslation('tours.cultureArch', language)}</span>
                </div>
              </div>

              {/* Title Block */}
              <div className="my-6">
                <div className="inline-block bg-stone-900 text-amber-400 text-[9px] uppercase tracking-widest font-black px-2.5 py-1 rounded mb-3">
                  {getTranslation('tours.wanderFlyer', language)} &bull; {selectedTour.type}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h1 className="text-3xl font-black text-stone-950 font-serif leading-tight tracking-tight">
                    {selectedTour.name}
                  </h1>
                  {isSpeechSupported && (
                    <button
                      onClick={() => {
                        const textToSpeak = getTranslation('tours.speakTour', language)
                          .replace('{name}', selectedTour.name)
                          .replace('{description}', selectedTour.description)
                          .replace('{distance}', String(selectedTour.distance))
                          .replace('{duration}', String(selectedTour.duration))
                          .replace('{startPoint}', selectedTour.startPoint);
                        speak(textToSpeak, selectedTour.id);
                      }}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer border flex items-center gap-2 shadow-xs active:scale-95 shrink-0 ${
                        speakingMessageId === selectedTour.id
                          ? 'bg-amber-500 border-amber-400 text-stone-900 animate-pulse font-black shadow-md'
                          : 'bg-amber-50 hover:bg-amber-500 border-amber-200 hover:border-amber-400 text-amber-800 hover:text-stone-900 shadow-xs'
                      }`}
                      title={speakingMessageId === selectedTour.id ? getTranslation('btn.stopSpeak', language) : getTranslation('btn.speak', language)}
                    >
                      {speakingMessageId === selectedTour.id ? (
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
                  )}
                </div>
                <p className="text-stone-600 font-serif italic text-sm mt-2">
                  {getTranslation('tours.entdeckungsreise', language)}
                </p>
              </div>

              {/* Large Cover Image with elegant print frame */}
              <div className="grow h-64 min-h-[240px] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm relative">
                <img 
                  src={selectedTour.imageUrl} 
                  alt={selectedTour.name} 
                  className="w-full h-full object-cover animate-fade-in"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex justify-between items-end">
                  <span className="text-[9px] text-stone-300 font-mono font-extrabold uppercase bg-stone-900/50 backdrop-blur-sm px-2 py-0.5 rounded">
                    {getTranslation('tours.startPoint', language).replace(/:/g, '')}: {selectedTour.startPoint.slice(0, 45)}...
                  </span>
                  <div className="flex bg-amber-400 text-stone-950 p-1.5 rounded-lg shadow-lg">
                    <Compass size={14} />
                  </div>
                </div>
              </div>

              {/* Key Metrics block */}
              <div className="grid grid-cols-5 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200 my-6">
                <div className="text-center">
                  <span className="block text-[8px] font-black text-stone-400 uppercase tracking-wider">{getTranslation('tours.length', language)}</span>
                  <span className="text-sm font-black text-stone-950">{selectedTour.distance} km</span>
                </div>
                <div className="text-center border-l border-stone-200">
                  <span className="block text-[8px] font-black text-stone-400 uppercase tracking-wider">{getTranslation('tours.duration', language)}</span>
                  <span className="text-sm font-black text-stone-950">{selectedTour.duration}</span>
                </div>
                <div className="text-center border-l border-stone-200">
                  <span className="block text-[8px] font-black text-stone-400 uppercase tracking-wider">{getTranslation('tours.elevationUp', language)}</span>
                  <span className="text-sm font-black text-stone-950">+{selectedTour.elevationUp} Hm</span>
                </div>
                <div className="text-center border-l border-stone-200">
                  <span className="block text-[8px] font-black text-stone-400 uppercase tracking-wider">{getTranslation('tours.elevationDown', language)}</span>
                  <span className="text-sm font-black text-stone-950">-{selectedTour.elevationDown} Hm</span>
                </div>
                <div className="text-center border-l border-stone-200">
                  <span className="block text-[8px] font-black text-stone-400 uppercase tracking-wider">{getTranslation('tours.condition', language)}</span>
                  <span className="text-xs font-black text-emerald-900 bg-emerald-100 px-1.5 py-0.5 rounded">{selectedTour.difficulty === 'Leicht' ? getTranslation('tours.easy', language) : selectedTour.difficulty === 'Mittel' ? getTranslation('tours.medium', language) : getTranslation('tours.hard', language)}</span>
                </div>
              </div>

              {/* Way description and Brief Info */}
              <div className="mb-6">
                <h4 className="text-xs font-black uppercase tracking-wider text-stone-900 mb-2 border-b border-stone-150 pb-1 font-serif">
                  {getTranslation('tours.overviewDesc', language)}
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed font-medium">
                  {selectedTour.description}
                </p>
              </div>

              {/* Elevation profile & map info */}
              <div className="grid grid-cols-2 gap-6 pt-3 border-t border-stone-200 items-center">
                <div>
                  <h5 className="text-[10px] font-black uppercase tracking-wider text-stone-700 mb-1">{getTranslation('tours.elevationProfileFull', language)}</h5>
                  <div className="h-10 bg-stone-50 border border-stone-200 rounded-lg p-1.5 flex items-end">
                    <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                      <path
                        d={`M 0 20 ${selectedTour.elevationProfile.map((pt, i) => {
                          const x = (i / (selectedTour.elevationProfile.length - 1)) * 100;
                          const minEle = Math.min(...selectedTour.elevationProfile.map(p => p.elevation));
                          const maxEle = Math.max(...selectedTour.elevationProfile.map(p => p.elevation));
                          const eleDiff = maxEle - minEle || 1;
                          const y = 20 - ((pt.elevation - minEle) / eleDiff) * 16 - 2;
                          return `L ${x} ${y}`;
                        }).join(' ')} L 100 20 Z`}
                        fill="rgba(4, 120, 87, 0.15)"
                        stroke="#047857"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                </div>
                
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 border-2 border-stone-300 p-1 bg-stone-50 rounded shrink-0 flex flex-wrap gap-0.5 relative">
                    <div className="w-2 h-2 bg-stone-950" />
                    <div className="w-2 h-2 bg-transparent" />
                    <div className="w-2 h-2 bg-transparent" />
                    <div className="w-2 h-2 bg-stone-950" />
                    <div className="w-2 h-2 bg-transparent" />
                    <div className="w-2 h-2 bg-stone-950" />
                    <div className="w-2 h-2 bg-stone-950" />
                    <div className="w-2 h-2 bg-transparent" />
                    <div className="w-2 h-2 bg-stone-950" />
                    <div className="w-2 h-2 bg-transparent" />
                    <div className="w-2 h-2 bg-transparent" />
                    <div className="w-2 h-2 bg-stone-950" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-4 bg-white border border-stone-300 flex items-center justify-center text-[6px] font-black text-rose-700">GPS</div>
                    </div>
                  </div>
                  <div>
                    <span className="text-[8px] font-bold uppercase tracking-wider text-stone-500 block">{getTranslation('tours.mapSync', language)}</span>
                    <span className="text-[9px] font-black text-stone-850">{getTranslation('tours.scanLiveTracker', language)}</span>
                  </div>
                </div>
              </div>

              {/* Letterpress Footer */}
              <div className="border-t border-stone-900 pt-3 mt-6 flex justify-between items-center text-[9px] font-bold text-stone-600 tracking-wider">
                <span>{getTranslation('tours.assocName', language)}</span>
                <span className="uppercase font-mono font-extrabold text-stone-950">{getTranslation('tours.page1of2', language)}</span>
              </div>
            </div>

            {/* PAGE 2: RÜCKSEITE */}
            <div className="print-page bg-white text-stone-900 flex flex-col justify-between" style={{ fontFamily: 'Inter, sans-serif' }}>
              <div className="border-b-2 border-stone-900 pb-3 flex justify-between items-end">
                <span className="text-xs text-stone-800 font-serif italic">{getTranslation('tours.tourDetailsHighlights', language)}</span>
                <span className="text-[9px] font-mono font-bold text-stone-500 uppercase">{getTranslation('tours.tourGuideSaar', language)}</span>
              </div>

              {/* Detailed narrative */}
              <div className="my-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-stone-900 mb-1.5 border-b border-stone-150 pb-1 font-serif">
                  {getTranslation('tours.detailedDescHistory', language)}
                </h4>
                <p className="text-[10px] text-stone-755 leading-relaxed mb-4 text-justify">
                  {selectedTour.longDescription}
                </p>
              </div>

              {/* Historical stations list */}
              <div className="my-4 grow">
                <h4 className="text-xs font-black uppercase tracking-wider text-stone-900 mb-2 border-b border-stone-150 pb-1 font-serif">
                  {getTranslation('tours.archWaystations', language)}
                </h4>
                <div className="flex flex-col gap-2.5">
                  {allSites
                    .filter(site => selectedTour.stopIds.includes(site.id))
                    .slice(0, 3)
                    .map((site, index) => {
                      return (
                        <div key={site.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex gap-3">
                          <div className="w-12 h-12 bg-stone-200 rounded-lg overflow-hidden shrink-0">
                            <img src={site.imageUrl} alt={site.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="bg-emerald-800 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">
                                {getTranslation('tours.station', language)} {index + 1}
                              </span>
                              <h5 className="text-[10.5px] font-bold text-stone-950 leading-none">{site.name}</h5>
                            </div>
                            <p className="text-[9.5px] text-stone-500 font-serif italic mt-0.5">{site.era} &bull; Koordinaten: {site.lat.toFixed(4)}, {site.lng.toFixed(4)}</p>
                            <p className="text-[9.5px] text-stone-600 line-clamp-1 mt-1 font-medium">{site.description}</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Equipment advice & safety checklist */}
              <div className="grid grid-cols-2 gap-6 my-4 border-t border-b border-stone-200 py-4">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-stone-900 mb-1.5 font-serif">
                    {getTranslation('tours.recommendedEquipment', language)}
                  </h4>
                  <ul className="text-[9px] text-stone-600 space-y-1 list-none font-medium">
                    {selectedTour.equipment.map((eq, i) => (
                      <li key={i} className="flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-emerald-800 shrink-0" /> {eq}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-amber-900 mb-1.5 font-serif">
                    {getTranslation('tours.safetyHeritageCode', language)}
                  </h4>
                  <p className="text-[9px] text-stone-600 leading-normal font-medium">
                    {selectedTour.safetyTips}
                  </p>
                  <p className="text-[8px] text-rose-800 mt-1.5 font-bold leading-tight uppercase tracking-wider">
                    {getTranslation('tours.safetyHeritageWarning', language)}
                  </p>
                </div>
              </div>

              {/* Roman greetings footer / Flavius quote */}
              <div className="bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-xl flex items-center gap-3">
                <div className="w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center shrink-0 border border-amber-600 font-serif text-stone-900 font-extrabold text-[10px]">
                  FS
                </div>
                <div>
                  <p className="text-[8.5px] font-serif italic text-emerald-950">
                    {getTranslation('tours.flaviusQuoteText', language)}
                  </p>
                  <span className="text-[7.5px] font-bold text-emerald-850 uppercase tracking-widest block mt-0.5">
                    {getTranslation('tours.flaviusQuoteAuthor', language)}
                  </span>
                </div>
              </div>

              {/* Page 2 Footer */}
              <div className="border-t border-stone-900 pt-3 mt-4 flex justify-between items-center text-[9px] font-bold text-stone-600 tracking-wider">
                <span>{getTranslation('tours.infoPortalArch', language)}</span>
                <span className="uppercase font-mono font-extrabold text-stone-950">{getTranslation('tours.page2of2', language)}</span>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
