import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Navigation, 
  Search, 
  MapPin, 
  Car, 
  Clock, 
  ArrowLeft, 
  Locate, 
  Compass,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { Site } from '../types';
import { 
  geocodeAddress, 
  getOSRMRoute, 
  formatDistance, 
  formatDuration, 
  GeocodeResult, 
  RouteStep 
} from '../utils/routing';

// --- Pigeon Maps Route Line Overlay ---
interface MapRouteLineProps {
  coordinates: [number, number][];
  // Injected by Pigeon Maps automatically when placed inside <Map>
  latLngToPixel?: (latLng: [number, number]) => [number, number];
}

export const MapRouteLine = ({ coordinates, latLngToPixel }: MapRouteLineProps) => {
  if (!coordinates || coordinates.length === 0 || !latLngToPixel) return null;

  try {
    const points = coordinates
      .map(coord => latLngToPixel(coord))
      .map(([x, y]) => `${x},${y}`)
      .join(' ');

    return (
      <svg 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          pointerEvents: 'none',
          zIndex: 40 
        }}
      >
        {/* Background glow line */}
        <polyline
          points={points}
          fill="none"
          stroke="#059669" // emerald-650
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.4"
        />
        {/* Main route line */}
        <polyline
          points={points}
          fill="none"
          stroke="#047857" // emerald-700
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.95"
        />
        {/* Inner core line for depth */}
        <polyline
          points={points}
          fill="none"
          stroke="#34d399" // emerald-400
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="4,6"
        />
      </svg>
    );
  } catch (err) {
    console.error('Error drawing RouteLine polyline:', err);
    return null;
  }
};

// --- Preset start points of major hubs in/around Saarland ---
const PRESET_PLACES: { name: string; lat: number; lng: number }[] = [
  { name: 'Saarbrücken Hbf', lat: 49.2410, lng: 6.9910 },
  { name: 'Homburg (Saar)', lat: 49.3278, lng: 7.3364 },
  { name: 'Saarlouis', lat: 49.3134, lng: 6.7516 },
  { name: 'Merzig', lat: 49.4442, lng: 6.6342 },
  { name: 'Trier Hbf', lat: 49.7596, lng: 6.6508 },
  { name: 'Kaiserslautern', lat: 49.4447, lng: 7.7690 }
];

// --- Routing Sidebar UI panel Component ---
interface RoutingSidebarProps {
  destination: Site;
  activeRoute: {
    coordinates: [number, number][];
    distance: number;
    duration: number;
    steps: RouteStep[];
  } | null;
  onSelectRoute: (route: { coordinates: [number, number][]; distance: number; duration: number; steps: RouteStep[] } | null) => void;
  onClear: () => void;
  onSetMapCenter: (lat: number, lng: number, zoom?: number) => void;
}

export const RoutingSidebar = ({
  destination,
  activeRoute,
  onSelectRoute,
  onClear,
  onSetMapCenter
}: RoutingSidebarProps) => {
  const [startQuery, setStartQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [startPoint, setStartPoint] = useState<GeocodeResult | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [routeError, setRouteError] = useState<boolean>(false);
  const [showInstructions, setShowInstructions] = useState(true);
  
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger search on query change (debounced geocoding via Nominatim)
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!startQuery || startQuery.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await geocodeAddress(startQuery);
        setSearchResults(results);
      } catch (err) {
        console.error('Geocoding error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 800);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [startQuery]);

  // Execute routing calculation whenever startPoint or destination changes
  useEffect(() => {
    if (!startPoint) {
      setRouteError(false);
      return;
    }

    const calculateRoute = async () => {
      setRouteError(false);
      try {
        const result = await getOSRMRoute(
          [startPoint.lat, startPoint.lng],
          [destination.lat, destination.lng]
        );
        if (result) {
          onSelectRoute(result);
          // Set center to midpoint of route
          const midLat = (startPoint.lat + destination.lat) / 2;
          const midLng = (startPoint.lng + destination.lng) / 2;
          onSetMapCenter(midLat, midLng, 10);
        } else {
          setRouteError(true);
          onSelectRoute(null);
        }
      } catch (err) {
        console.error(err);
        setRouteError(true);
        onSelectRoute(null);
      }
    };

    calculateRoute();
  }, [startPoint, destination]);

  // Locate user position using Geolocation API
  const handleUseGPS = () => {
    setGpsError(null);
    if (!navigator.geolocation) {
      setGpsError('Ihr Browser unterstützt keine Ortung.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLoc: GeocodeResult = {
          display_name: 'Mein aktueller Standort',
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setStartPoint(userLoc);
        setStartQuery('Mein aktueller Standort');
        setSearchResults([]);
      },
      (error) => {
        console.warn('Geolocation Error:', error);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGpsError('Ortung verweigert. Bitte schalten Sie den Standortzugriff frei.');
            break;
          case error.POSITION_UNAVAILABLE:
            setGpsError('Standortinformationen sind zurzeit nicht verfügbar.');
            break;
          case error.TIMEOUT:
            setGpsError('Die Ortung hat zu lange gedauert.');
            break;
          default:
            setGpsError('Standort konnte nicht ermittelt werden.');
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleSelectPlace = (place: { name: string; lat: number; lng: number } | GeocodeResult) => {
    const parsedPlace: GeocodeResult = {
      display_name: 'display_name' in place ? place.display_name : place.name,
      lat: place.lat,
      lng: place.lng
    };
    setStartPoint(parsedPlace);
    setStartQuery(parsedPlace.display_name.split(',')[0]);
    setSearchResults([]);
  };

  const handleClearRoute = () => {
    setStartQuery('');
    setStartPoint(null);
    setSearchResults([]);
    onSelectRoute(null);
    setRouteError(false);
    setGpsError(null);
  };

  return (
    <div className="flex flex-col h-full bg-white text-stone-900 border-r border-stone-200">
      {/* Header section with destination info */}
      <div className="p-6 md:p-8 border-b border-stone-100 bg-stone-50 rounded-t-[2.5rem]">
        <button 
          onClick={onClear} 
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-emerald-700 transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Routing verlassen
        </button>

        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[9px] font-bold uppercase tracking-widest rounded-full mb-3 inline-block">
          Open-Source-Routenplaner (OSRM)
        </span>
        
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-stone-900 mb-4">
          Route nach {destination.name}
        </h2>
        
        <p className="text-xs text-stone-500 leading-normal">
          Wählen Sie einen Startpunkt, um eine Route zum Denkmal berechnen zu lassen. Alle Daten stammen aus OpenStreetMap.
        </p>
      </div>

      {/* Input / Form segment */}
      <div className="p-6 md:p-8 space-y-6 flex-grow overflow-y-auto custom-scrollbar">
        {/* Startpoint Input */}
        <div>
          <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block mb-3">
            1. Startpunkt eingeben
          </label>
          <div className="relative">
            <input
              type="text"
              value={startQuery}
              onChange={(e) => setStartQuery(e.target.value)}
              placeholder="z.B. Ort, Straße, Bahnhof..."
              className="w-full pl-12 pr-10 py-4 bg-stone-100 focus:bg-white border-2 border-transparent focus:border-emerald-700/50 rounded-2xl text-sm font-medium transition-all shadow-sm focus:ring-0"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
              <Search size={18} />
            </div>
            {startPoint && (
              <button 
                onClick={handleClearRoute}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-600 transition-colors"
                title="Route zurücksetzen"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* GPS Button & Preset Buttons */}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={handleUseGPS}
              className="flex items-center gap-2 py-2 px-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-800 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors shadow-sm"
            >
              <Locate size={14} /> GPS Ortung
            </button>
            {PRESET_PLACES.slice(0, 3).map((place) => (
              <button
                key={place.name}
                onClick={() => handleSelectPlace(place)}
                className="py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors border border-stone-200"
              >
                {place.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* GPS error message */}
          {gpsError && (
            <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-700 font-medium flex items-start gap-2 animate-fade-in">
              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
              <span>{gpsError}</span>
            </div>
          )}

          {/* Geocoding nominatim suggestions dropdown */}
          <AnimatePresence>
            {searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 bg-white border border-stone-200 rounded-2xl shadow-xl overflow-hidden z-20 relative max-h-52 overflow-y-auto custom-scrollbar"
              >
                <div className="px-4 py-2 border-b border-stone-100 bg-stone-50 text-[9px] uppercase font-bold text-stone-400 tracking-widest">
                  Adressvorschläge (OpenStreetMap)
                </div>
                {isSearching ? (
                  <div className="p-4 text-center text-xs text-stone-400 font-medium">
                    Suche läuft...
                  </div>
                ) : (
                  searchResults.map((result) => (
                    <button
                      key={`${result.lat}-${result.lng}`}
                      onClick={() => handleSelectPlace(result)}
                      className="w-full text-left px-5 py-3 hover:bg-stone-50 text-xs font-medium text-stone-700 border-b border-stone-100 last:border-0 truncate block"
                    >
                      {result.display_name}
                    </button>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Status / Errors when route calculator fails */}
        {routeError && (
          <div className="p-4 bg-orange-55 shadow-lg border border-orange-200 rounded-3xl text-sm text-stone-700 flex flex-col gap-2">
            <div className="flex items-center gap-2 font-bold text-orange-850">
              <AlertTriangle size={16} /> Route konnte nicht berechnet werden
            </div>
            <p className="text-xs text-stone-500 leading-relaxed font-medium">
              Es konnte keine Straßenverbindung zwischen Ihrem Startpunkt und {destination.name} gefunden werden. Bitte wählen Sie einen anderen Ort.
            </p>
          </div>
        )}

        {/* Route Stats & Guidance */}
        {activeRoute && (
          <div className="space-y-6 animate-fade-in pt-4 border-t border-stone-100">
            {/* Stats Badge */}
            <div>
              <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block mb-3">
                2. Reisedetails
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-100">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/10 flex items-center justify-center text-emerald-700">
                    <Clock size={20} />
                  </div>
                  <div>
                    <div className="text-[9px] uppercase font-bold text-stone-400">Dauer</div>
                    <div className="text-base font-bold text-stone-900 leading-none mt-1">
                      {formatDuration(activeRoute.duration)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-100">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/10 flex items-center justify-center text-emerald-700">
                    <Car size={20} />
                  </div>
                  <div>
                    <div className="text-[9px] uppercase font-bold text-stone-400">Entfernung</div>
                    <div className="text-base font-bold text-stone-900 leading-none mt-1">
                      {formatDistance(activeRoute.distance)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Travel Route Steps List */}
            <div>
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="w-full flex items-center justify-between text-left text-[10px] uppercase font-bold tracking-widest text-stone-400 mb-3"
              >
                <span>3. Wegbeschreibung ({activeRoute.steps.length} Schritte)</span>
                {showInstructions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              <AnimatePresence>
                {showInstructions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3 pl-2 border-l border-stone-200 mt-2 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                      {activeRoute.steps.map((step, index) => (
                        <div key={index} className="relative pl-6 pb-2 last:pb-0 group">
                          {/* Turn Circle Marker */}
                          <div className={`absolute left-0 top-1.5 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 bg-white transition-all group-hover:scale-125 ${
                            index === 0 
                            ? 'border-emerald-600 bg-emerald-50' 
                            : index === activeRoute.steps.length - 1 
                            ? 'border-red-600 bg-red-50' 
                            : 'border-stone-300'
                          }`} />
                          
                          <div className="text-xs font-semibold text-stone-850">
                            {step.instruction}
                          </div>
                          
                          {step.distance > 0 && (
                            <div className="text-[9px] font-bold uppercase text-stone-400 tracking-wider mt-1">
                              Nach {formatDistance(step.distance)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Footer / Citation */}
      <div className="p-6 md:p-8 bg-stone-50 border-t border-stone-100 rounded-b-[2.5rem] text-[10px] text-stone-400 text-center font-bold uppercase tracking-wider">
        Kartendaten © OpenStreetMap • OSRM API
      </div>
    </div>
  );
};
