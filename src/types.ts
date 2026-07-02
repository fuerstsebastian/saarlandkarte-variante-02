export interface CopyrightInfo {
  urheber: string;
  lizenz: string;
  quelle: string;
}

export interface Site {
  id: string;
  name: string;
  era: 'Eisenzeit' | 'Römerzeit' | 'Mittelalter' | 'Steinzeit' | 'Neuzeit' | 'Bronzezeit' | 'Altsteinzeit' | 'Jungsteinzeit' | 'Frühmittelalter' | 'Mehrere Epochen';
  subEra?: string;
  location: string;
  lat: number;
  lng: number;
  imageUrl: string;
  description: string;
  longDescription: string;
  archaeologicalDescription?: string;
  galleryIds?: string[];
  literatur?: string;

  // New fields from fundstellen.json
  gemeinde?: string;
  zeitstellung?: string;
  kategorie_attraktion?: 'Museum' | 'Rekonstruktion' | 'Bodendenkmal' | 'Freilichtmuseum' | 'Gedenkstätte';
  kategorie_befund?: 'Siedlung' | 'Villa / Gutshof' | 'Grabstätte' | 'Befestigung / Ringwall' | 'Kultplatz' | 'Bergwerk' | 'Straße / Infrastruktur' | 'Sonstiges';
  sichtbarkeit?: 'sichtbar' | 'eingeschränkt sichtbar' | 'nicht sichtbar';
  barrierefreiheit?: boolean;
  oeffnungszeiten?: string | null;
  eintrittspreis?: string;
  maps_link?: string | null;
  denkmalschutzstatus?: string | null;
  thumbnail?: string | null;
  copyright?: CopyrightInfo | null;
}

export interface Artifact {
  id: string;
  name: string;
  originSiteId: string;
  originSiteName: string;
  period: string;
  description: string;
  imageUrl?: string;
  status: 'In Ausstellung' | 'Im Depot' | 'Teilrekonstruiert';
}

export interface Museum {
  id: string;
  name: string;
  location: string;
  stateCountry: string; // e.g. "Saarland", "Rheinland-Pfalz", "Berlin"
  street: string;
  preciseLocation?: string;
  openingHours: string;
  wheelchairAccessible: boolean;
  accessibilityDetails: string;
  entranceFee: string;
  lat: number;
  lng: number;
  description: string;
  imageUrl: string;
  websiteUrl: string;
  phone?: string;
  email?: string;
  artifacts: Artifact[];
}

export interface Tour {
  id: string;
  name: string;
  difficulty: 'Leicht' | 'Mittel' | 'Schwer';
  distance: number; // in km
  duration: string; // duration formatted
  elevationUp: number; // in m
  elevationDown: number; // in m
  description: string;
  longDescription: string;
  type: 'Rundwanderweg' | 'Streckenwanderung';
  activity?: 'Wandern' | 'Radfahren'; // Activity mode optional for backwards compatibility
  startPoint: string;
  startCoords: [number, number];
  equipment: string[];
  safetyTips: string;
  imageUrl: string;
  stopIds: string[]; // archaeological site IDs connected to the tour
  pathCoordinates: [number, number][]; // actual trail loop points
  elevationProfile: { distance: number; elevation: number }[]; // custom coordinates for height rendering
}

