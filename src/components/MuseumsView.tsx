import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  Globe, 
  Sparkles, 
  Search, 
  Compass, 
  ArrowRight,
  Info,
  Clock,
  Accessibility,
  Ticket,
  Map as MapIcon,
  Landmark,
  Compass as CompassIcon,
  Image as ImageIcon,
  Plus,
  Trash2,
  AlertTriangle,
  Phone,
  Mail,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Map, Overlay } from 'pigeon-maps';
import { Museum, Site, Artifact } from '../types';
import { Language, getMaleVoice, getVoicePitch, getTranslation } from '../data/translations';

// --- Museums Dataset ---
export const MUSEUMS_DATA: Museum[] = [
  {
    id: 'mvf-saarbruecken',
    name: 'Museum für Vor- und Frühgeschichte Saarbrücken',
    location: 'Saarbrücken',
    stateCountry: 'Saarland',
    street: 'Schloßplatz 16',
    preciseLocation: 'Ehemaliges Kreisständehaus direkt am Saarbrücker Schlossplatz',
    openingHours: 'Di - So: 10:00 - 18:00 Uhr | Mi: 10:00 - 20:00 Uhr | Mo: Geschlossen',
    wheelchairAccessible: true,
    accessibilityDetails: 'Barrierefreier Zugang über Rampe; Aufzug zu allen Ausstellungsetagen vorhanden; behindertengerechte Toiletten verfügbar.',
    entranceFee: 'Erwachsene: 5,00 € | Ermäßigt: 3,00 € | Jugendliche unter 18 Jahren freier Eintritt',
    lat: 49.2302,
    lng: 6.9926,
    imageUrl: 'images/dummy-003-museum-vor-fruehgeschichte.jpg',
    description: 'Das zentrale Landesmuseum im Saarland bewahrt die archäologischen Epochen von der Steinzeit bis zum frühen Mittelalter. Seine architektonischen Glanzlichter und weltberühmten Keltengoldschätze zählen zu den kostbarsten Hinterlassenschaften der Region.',
    websiteUrl: 'https://www.saarland-museum.de/de/vor-und-fruehgeschichte',
    artifacts: [
      {
        id: 'art-reinheim-goldschmuck',
        name: 'Goldschmuck der keltischen Fürstin',
        originSiteId: 'reinheim-grab',
        originSiteName: 'Keltisches Fürstinnengrab Reinheim',
        period: 'Eisenzeit (Frühlatènezeit, ca. 370 v. Chr.)',
        description: 'Einzigartiger Goldschmuck bestehend aus einem kunstvoll verzierten Halsring (Torques) mit figürlichen Enden und einem passenden goldenen Armreif. Meisterwerke keltischer Goldschmiedekunst.',
        imageUrl: 'images/dummy-005-kulturpark-bliesbruck-reinheim.jpg',
        status: 'In Ausstellung'
      },
      {
        id: 'art-reinheim-kanne',
        name: 'Die Reinheimer Röhrenkanne',
        originSiteId: 'reinheim-grab',
        originSiteName: 'Keltisches Fürstinnengrab Reinheim',
        period: 'Eisenzeit (Frühlatènezeit, ca. 370 v. Chr.)',
        description: 'Eine prachtvolle Schnabelkanne aus Bronze. Sie diente als keltisches Prunktrinkgefäß und ist mit einer filigranen, mystischen Fabelwesen-Figur auf dem Deckel verziert.',
        imageUrl: 'images/dummy-005-kulturpark-bliesbruck-reinheim.jpg',
        status: 'In Ausstellung'
      },
      {
        id: 'art-reinheim-reitermaske',
        name: 'Reinheimer römische Reitermaske',
        originSiteId: 'reinheim-villa',
        originSiteName: 'Römische Villa Reinheim',
        period: 'Römerzeit (Kaiserzeit, 2. Jh. n. Chr.)',
        description: 'Eine spektakuläre eiserne römische Gesichtsmaske eines Reiterhelms (Reitermaske), die auf dem Areal der Villa gefunden wurde. Sie diente sportlichen und repräsentativen Zwecken römischer Kavalleristen.',
        imageUrl: 'images/dummy-005-kulturpark-bliesbruck-reinheim.jpg',
        status: 'In Ausstellung'
      },
      {
        id: 'art-reinheim-fabelwesen',
        name: 'Mystisches Fabelwesen (Reinheimer Röhrenkanne Detail)',
        originSiteId: 'reinheim-grab',
        originSiteName: 'Keltisches Fürstinnengrab Reinheim',
        period: 'Eisenzeit (Frühlatènezeit, ca. 370 v. Chr.)',
        description: 'Detail-Darstellung des mystischen Fabelwesens (Mischwesen), das den Deckel der bronzenen Röhrenkanne ziert. Ein faszinierendes Zeugnis keltischer Mythologie.',
        imageUrl: 'images/dummy-005-kulturpark-bliesbruck-reinheim.jpg',
        status: 'In Ausstellung'
      },
      {
        id: 'art-pachten-sitzsteine',
        name: 'Pachten Sitzsteine / Altarsteine',
        originSiteId: 'pachten-contiomagus',
        originSiteName: 'Vicus & Kastell Contiomagus',
        period: 'Römerzeit (3. Jahrhundert n. Chr.)',
        description: 'Römische Inschriftensteine und Göttersitzsteine aus dem Vicus Contiomagus (Pachten), die im Museum Saarbrücken ausgestellt sind.',
        imageUrl: 'images/dummy-003-museum-vor-fruehgeschichte.jpg',
        status: 'In Ausstellung'
      },
      {
        id: 'art-merowinger-reiterausstattung',
        name: 'Pferdegeschirr & Waffen aus dem Kriegergrab',
        originSiteId: 'reinheim-merowinger',
        originSiteName: 'Merowingergrab Homerich',
        period: 'Frühmittelalter (Merowingerzeit, 6.–7. Jh. n. Chr.)',
        description: 'Kostbare Grabbeigaben des merowingischen Reiterkriegers vom Homerich, darunter eiserne Steigbügel, verzierte Schnallen und ein langes zweischneidiges Spatha-Schwert.',
        imageUrl: 'https://images.unsplash.com/photo-1599727494396-857ce7fdbe67?auto=format&fit=crop&q=80&w=600',
        status: 'In Ausstellung'
      },
      {
        id: 'art-gollenstein-neolith-beil',
        name: 'Feingeschliffene Steinaxt vom Gollenstein-Umfeld',
        originSiteId: 'gollenstein',
        originSiteName: 'Der Gollenstein',
        period: 'Steinzeit (Neolithikum, ca. 2500 v. Chr.)',
        description: 'Eine im Umfeld des Menhrs gefundene, makellos geschliffene Steinaxt aus saarländischem Kieselschiefer, die wahrscheinlich rituell niedergelegt wurde.',
        imageUrl: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=600',
        status: 'Im Depot'
      }
    ]
  },
  {
    id: 'landesmuseum-trier',
    name: 'Rheinisches Landesmuseum Trier',
    location: 'Trier',
    stateCountry: 'Rheinland-Pfalz',
    street: 'Weimarer Allee 1',
    preciseLocation: 'Am Rande der Trierer Innenstadt, unmittelbar an den antiken Kaiserthermen',
    openingHours: 'Di - So: 10:00 - 17:00 Uhr | Mo: Geschlossen',
    wheelchairAccessible: true,
    accessibilityDetails: 'Vollständig barrierefrei zugänglich; alle Ausstellungsräume sind über Rampen und Aufzüge erreichbar; Rollstuhlverleih und behindertengerechte Toiletten verfügbar.',
    entranceFee: 'Erwachsene: 8,00 € (inkl. Audioguide) | Ermäßigt: 6,00 € | Kinder (6-18 Jahre): 4,00 €',
    lat: 49.7516,
    lng: 6.6436,
    imageUrl: 'https://images.unsplash.com/photo-1599110906800-4b95d033973c?auto=format&fit=crop&q=80&w=1200',
    description: 'Eines der bedeutendsten archäologischen Museen in Deutschland. Als kaiserliche Residenzstadt der Spätantike beherbergt Trier die herausragendsten Funde der römischen Zivilisation entlang der Mosel, darunter auch spektakuläre Stücke saarländischer Fundorte.',
    websiteUrl: 'https://www.landesmuseum-trier.de/',
    artifacts: [
      {
        id: 'art-nennig-original-mosaikstudien',
        name: 'Fragmente und Fundstücke der Palastvilla Nennig',
        originSiteId: 'nennig',
        originSiteName: 'Römische Villa Nennig',
        period: 'Römerzeit (Spätes 2. bis 3. Jh. n. Chr.)',
        description: 'Wandmalereifragmenten, Münzhorte und Architekturteile, die während der ersten systematischen Freilegung der prächtigen Mosaikvilla im 19. Jahrhundert gesichert wurden.',
        status: 'In Ausstellung'
      },
      {
        id: 'art-borg-bronzen',
        name: 'Bronze-Appliken & Essgeschirr aus Borg',
        originSiteId: 'borg',
        originSiteName: 'Römische Villa Borg',
        period: 'Römerzeit (Kaiserzeit, 1.–4. Jh. n. Chr.)',
        description: 'Hochelegante bronzene Beschläge von Repräsentationsmöbeln sowie wertvolles römisches Tafelaufsatzgeschirr, das den luxuriösen Lebensstil des Gutsbesitzers dokumentiert.',
        status: 'Im Depot'
      },
      {
        id: 'art-wareswald-mosaikstifter',
        name: 'Kultstatue und Weihebezirk-Inschriften',
        originSiteId: 'wareswald',
        originSiteName: 'Archäologische Stätte Wareswald',
        period: 'Römerzeit (Gallo-römischer Epoche, 2. Jh. n. Chr.)',
        description: 'Architektonische Fundstücke des gallo-römischen Heiligtums im Wareswald bei Tholey, welches der Götterverehrung an der strategischen Straßenkreuzung diente.',
        status: 'Teilrekonstruiert'
      }
    ]
  },
  {
    id: 'roemermuseum-schwarzenacker',
    name: 'Römermuseum Homburg-Schwarzenacker',
    location: 'Homburg-Schwarzenacker',
    stateCountry: 'Saarland',
    street: 'Homburger Straße 38',
    preciseLocation: 'Homburg-Schwarzenacker, Edelhaus und angrenzendes weitläufiges Freigelände',
    openingHours: 'April bis Oktober: Täglich 09:00 - 17:00 Uhr | November bis März: Täglich 10:00 - 16:00 Uhr',
    wheelchairAccessible: false,
    accessibilityDetails: 'Das barocke Edelhaus ist rollstuhlgerecht ausgebaut (Aufzug vorhanden). Das historische Freigelände (römische Ruinenstraßen) ist aufgrund des Kopfsteinpflasters und Kiesbelags nur bedingt barrierefrei befahrbar.',
    entranceFee: 'Erwachsene: 6,00 € | Ermäßigt: 4,50 € | Schüler & Studenten: 3,00 € | Kinder unter 6 Jahren freier Eintritt',
    lat: 49.2831,
    lng: 7.3168,
    imageUrl: 'images/dummy-008-roemermuseum-schwarzenacker.jpg',
    description: 'Ein einzigartiges Freilichtmuseum direkt auf dem Areal des antiken gallo-römischen Vicus. Neben freigelegten Straßenfassaden zeigt das barocke Edelhaus unzählige Originalfunde des alltäglichen Lebens vor 2000 Jahren.',
    websiteUrl: 'https://www.roemermuseum-schwarzenacker.de/',
    artifacts: [
      {
        id: 'art-schwarzenacker-arztbesteck',
        name: 'Chirurgisches Besteck des Augenarztes',
        originSiteId: 'schwarzenacker',
        originSiteName: 'Römermuseum Schwarzenacker',
        period: 'Römerzeit (2. Jahrhundert n. Chr.)',
        description: 'Ein weltberühmtes Set aus feinen kupfernen Skalpellgriffen, Sonden und Salbenreibsteinen des gallo-römischen Arztes von Schwarzenacker.',
        status: 'In Ausstellung'
      },
      {
        id: 'art-schwarzenacker-goetterstatuetten',
        name: 'Bronzestatuetten der Laren und Hausgötter',
        originSiteId: 'schwarzenacker',
        originSiteName: 'Römermuseum Schwarzenacker',
        period: 'Römerzeit (2. Jahrhundert n. Chr.)',
        description: 'Exquisit geformte Bronze-Miniaturen antiker Schutzgötter (darunter Merkur und Minerva), die in den Hausaltaren des Stadtviertels verehrt wurden.',
        status: 'In Ausstellung'
      }
    ]
  },
  {
    id: 'mvf-berlin',
    name: 'Museum für Vor- und Frühgeschichte Berlin',
    location: 'Berlin',
    stateCountry: 'Berlin',
    street: 'Bodestraße 1-3',
    preciseLocation: 'Museumsinsel Berlin, im Gebäude des herrschaftlichen Neuen Museums',
    openingHours: 'Di - So: 10:00 - 18:00 Uhr | Mo: Geschlossen',
    wheelchairAccessible: true,
    accessibilityDetails: 'Vollständig rollstuhlgerecht; geräumige Aufzüge zu allen Stockwerken; Rollstühle und Buggys können an der Garderobe kostenfrei ausgeliehen werden.',
    entranceFee: 'Erwachsene: 14,00 € | Ermäßigt: 7,00 € | Kinder & Jugendliche unter 18 Jahren freier Eintritt',
    lat: 52.5206,
    lng: 13.3976,
    imageUrl: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&q=80&w=1200',
    description: 'Als eine der weltweit größten Sammlungen zur prähistorischen Archäologie beherbergt das Museum im Neuen Museum Berlin herausragende Ensembles prähistorischen Metallhandwerks der Bronze- und Eisenzeit aus ganz Mitteleuropa.',
    websiteUrl: 'https://www.smb.museum/museen-einrichtungen/museum-fuer-vor-und-fruehgeschichte/home/',
    artifacts: [
      {
        id: 'art-wallerfangen-bronze-depot',
        name: 'Schaftlappenbeile & Bronzeurnen-Schmuck',
        originSiteId: 'bronzezeit-wallerfangen-eichenborn',
        originSiteName: 'Wallerfangen – Depotfund',
        period: 'Bronzezeit (Spätbronzezeit, ca. 1000 v. Chr.)',
        description: 'Ein spektakulärer prähistorischer Metalldepotfund aus dem saarländischen Wallerfangen, bestehend aus rituell niedergelegten Beilen und Nadeln der Urnenfelderkultur, überführt im 19. Jahrhundert in die kaiserliche Sammlung.',
        status: 'In Ausstellung'
      },
      {
        id: 'art-speyer-bronzebeil',
        name: 'Dosenfibel und Ziernadeln der Saar-Bronzezeit',
        originSiteId: 'bronzezeit-saarlouis-roden-depot',
        originSiteName: 'Saarlouis-Roden – Hortfund',
        period: 'Bronzezeit (Urnenfelderkultur, ca. 900 v. Chr.)',
        description: 'Ein im kaiserlichen Berlin archivierter Bronzeschatz aus Saarlouis-Roden, der Zeugnis über die weitreichenden prähistorischen Handelswege der späten Bronzezeit ablegt.',
        status: 'Im Depot'
      }
    ]
  },
  {
    id: 'pfalzmuseum-speyer',
    name: 'Historisches Museum der Pfalz Speyer',
    location: 'Speyer',
    stateCountry: 'Rheinland-Pfalz',
    street: 'Domplatz 4',
    preciseLocation: 'Speyerer Altstadt direkt am Domplatz',
    openingHours: 'Di - So: 10:00 - 18:00 Uhr | An Feiertagen auch montags geöffnet',
    wheelchairAccessible: true,
    accessibilityDetails: 'Barrierefreier Zugang über den beschilderten Seiteneingang; Aufzüge erschließen barrierefrei alle Ausstellungsetagen; rollstuhlgerechte Sanitäranlagen vorhanden.',
    entranceFee: 'Erwachsene: 10,00 € | Ermäßigt: 8,00 € | Schüler & Studenten: 4,00 € | Kinder unter 6 Jahren freier Eintritt',
    lat: 49.3162,
    lng: 8.4417,
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1200',
    description: 'Durch langjährige historische und administrative Verbindungen wurden bedeutende frühe Ausgrabungskampagnen des Saarpfalz-Raumes von Speyerer Archäologen dokumentiert. Die Sammlungen beherbergen wertvolle Zeugnisse keltischer Bestattungskultur.',
    websiteUrl: 'https://www.museum.speyer.de/',
    artifacts: [
      {
        id: 'art-boeckweiler-urnen',
        name: 'Prunkurnen aus den Böckweiler Grabhügeln',
        originSiteId: 'bronzezeit-boeckweiler-grabhuegel',
        originSiteName: 'Böckweiler – Hügelgräber',
        period: 'Bronzezeit / Hallstattzeit (ca. 800 v. Chr.)',
        description: 'Ausgezeichnet erhaltene, reich verzierte Halskeramikgefäße (Scheiben- und Riefenurnen) aus den monumentalen Grabhügelgruppen der Saarpfalz-Region.',
        status: 'In Ausstellung'
      },
      {
        id: 'art-erfweiler-ringe',
        name: 'Bronzener Halskragen & Armbänder aus dem Depot I',
        originSiteId: 'bronzezeit-erfweiler-ehlingen-hort-1',
        originSiteName: 'Erfweiler-Ehlingen – Hortfund I',
        period: 'Bronzezeit (Spätbronzezeit, ca. 1000 v. Chr.)',
        description: 'Einige der edelsten Stücke des berühmten Erfweiler Hortfunds, darunter massiv gegossene Bronzearmringe mit geometrischen Strichgruppenverzierungen.',
        status: 'In Ausstellung'
      }
    ]
  },
  {
    id: 'museum-pachten',
    name: 'Römermuseum Pachten (Römer- und Prähistorisches Museum)',
    location: 'Dillingen-Pachten',
    stateCountry: 'Saarland',
    street: 'Fischerstraße 2, 66763 Dillingen / Saar',
    preciseLocation: 'Historisches altes Bauernhaus im Stadtteil Pachten',
    openingHours: 'Derzeit wegen Renovierung geschlossen (gebaut/renoviert, Angebote auf Anfrage)',
    wheelchairAccessible: false,
    accessibilityDetails: 'Eingeschränkt zugänglich; durch die historische Bauweise des alten Bauernhauses ist kein Aufzug zu den oberen Etagen vorhanden.',
    entranceFee: 'Eintritt frei (Spenden zum Erhalt des Museums sind herzlich willkommen)',
    lat: 49.3547,
    lng: 6.7099,
    imageUrl: 'images/dummy-003-museum-vor-fruehgeschichte.jpg',
    description: 'Das Museum Pachten bewahrt und dokumentiert die reichhaltige römische und prähistorische Epoche des Dillingen-Pachtener Raumes (antiker Vicus Contiomagus). Einzigartig sind die Fundstücke aus den weiten Kastellgrabungen und Gräberfeldern.',
    websiteUrl: 'https://www.roemermuseum-pachten.de/',
    phone: '06831 709 212',
    email: 'info@roemermuseum-pachten.de',
    artifacts: [
      {
        id: 'art-pachten-merkurstein',
        name: 'Der Pachtener Merkur-Reliefstein',
        originSiteId: 'pachten-contiomagus',
        originSiteName: 'Vicus Contiomagus (Pachten)',
        period: 'Römerzeit (Kaiserzeit, 2. Jahrhundert n. Chr.)',
        description: 'Ein gut erhaltenes gallo-römisches Relief des Gottes Merkur mit Geldbeutel und Heroldstab, das den ausgeprägten lokalen Handel und die religiöse Verehrung dokumentiert.',
        imageUrl: 'https://images.unsplash.com/photo-1582559934353-2e47140e7501?auto=format&fit=crop&q=80&w=600',
        status: 'In Ausstellung'
      },
      {
        id: 'art-pachten-glasurne',
        name: 'Spatenglas-Urne aus dem Brandgräberfeld',
        originSiteId: 'pachten-contiomagus',
        originSiteName: 'Vicus Contiomagus (Pachten)',
        period: 'Römerzeit (Spätrömisch, 3.–4. Jh. n. Chr.)',
        description: 'Eine wunderbar erhaltene quadratische Glasurne einer spätrömischen Brandbestattung, die unbeschädigt mitsamt den eingeäscherten Knochenresten überliefert wurde.',
        imageUrl: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&q=80&w=600',
        status: 'In Ausstellung'
      }
    ]
  },
  {
    id: 'museum-theulegium',
    name: 'Theulegium – Kulturhistorisches Museum Tholey',
    location: 'Tholey',
    stateCountry: 'Saarland',
    street: 'Rathausplatz 1',
    preciseLocation: 'Im barocken ehemaligen Amtsgebäude direkt auf dem Tholeyer Rathausplatz',
    openingHours: 'Di - So: 11:00 - 17:00 Uhr | Mo: Geschlossen',
    wheelchairAccessible: true,
    accessibilityDetails: 'Barrierefreier Zugang über den beschilderten Seiteneingang möglich; Aufzüge zu den oberen Ausstellungsbereichen vorhanden.',
    entranceFee: 'Erwachsene: 3,00 € | Ermäßigt / Gruppen: 1,50 € | Kinder unter 6 Jahren freier Eintritt',
    lat: 49.4812,
    lng: 7.0315,
    imageUrl: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&q=80&w=1200',
    description: 'Das Theulegium entführt in die reiche Kulturgeschichte der ältesten Abteilandgemeinde des Saarlandes. Der Schwerpunkt liegt auf den unerschöpflichen römischen und keltischen Funden des Wareswaldes (vicus) und des Schaumburger Raumes.',
    websiteUrl: 'https://www.tholey.de/theulegium/',
    artifacts: [
      {
        id: 'art-theulegium-jupiter',
        name: 'Jupitergigantensäule vom Wareswald',
        originSiteId: 'wareswald',
        originSiteName: 'Archäologische Stätte Wareswald',
        period: 'Römerzeit (Spätes 2. Jahrhundert n. Chr.)',
        description: 'Rekonstruierte originale Steinelemente einer aufwendigen Jupitergigantensäule, inklusive einer plastischen Darstellung des thronenden Himmelsvaters.',
        status: 'In Ausstellung'
      },
      {
        id: 'art-theulegium-fibeln',
        name: 'Spätlatènezeitliche Bronzefibeln',
        originSiteId: 'wareswald',
        originSiteName: 'Archäologische Stätte Wareswald',
        period: 'Eisenzeit (Spätlatènezeit, ca. 1. Jahrhundert v. Chr.)',
        description: 'Fein ziselierte Gewandnadeln und metallener Schmuck, die im Übergangsbereich der altkeltischen Epochen im Wareswald ausgegraben wurden.',
        status: 'In Ausstellung'
      }
    ]
  }
];

interface MuseumsViewProps {
  onFocusSiteOnMap: (siteId: string) => void;
  onFocusMuseumOnMap?: (museum: Museum) => void;
  allSites: Site[];
  language?: Language;
}

export default function MuseumsView({ onFocusSiteOnMap, onFocusMuseumOnMap, allSites, language = 'de' }: MuseumsViewProps) {
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedMuseumId, setExpandedMuseumId] = useState<string | null>('mvf-saarbruecken');

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

  // Pre-load galleries particularly for Saarbrücken & Pachten as requested, and fallback defaults for others
  const [museumImages, setMuseumImages] = useState<Record<string, string[]>>({
    'mvf-saarbruecken': [
      'images/dummy-003-museum-vor-fruehgeschichte.jpg',
      'images/dummy-005-kulturpark-bliesbruck-reinheim.jpg',
      'images/dummy-005-kulturpark-bliesbruck-reinheim.jpg',
      'images/dummy-005-kulturpark-bliesbruck-reinheim.jpg',
      'images/dummy-005-kulturpark-bliesbruck-reinheim.jpg',
      'images/dummy-003-museum-vor-fruehgeschichte.jpg',
      'https://images.unsplash.com/photo-1544085311-11a028465b0c?auto=format&fit=crop&q=80&w=1200'
    ],
    'museum-pachten': [
      'images/dummy-003-museum-vor-fruehgeschichte.jpg',
      'images/dummy-003-museum-vor-fruehgeschichte.jpg',
      'images/dummy-003-museum-vor-fruehgeschichte.jpg',
      'images/dummy-003-museum-vor-fruehgeschichte.jpg',
      'https://images.unsplash.com/photo-1544085311-11a028465b0c?auto=format&fit=crop&q=80&w=1200'
    ],
    'landesmuseum-trier': [
      'https://images.unsplash.com/photo-1599110906800-4b95d033973c?auto=format&fit=crop&q=80&w=1200'
    ],
    'roemermuseum-schwarzenacker': [
      'images/dummy-008-roemermuseum-schwarzenacker.jpg',
      'https://images.unsplash.com/photo-1558486012-817176f84c6d?auto=format&fit=crop&q=80&w=1200'
    ],
    'mvf-berlin': [
      'https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&q=80&w=1200'
    ],
    'pfalzmuseum-speyer': [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1200'
    ],
    'museum-theulegium': [
      'https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&q=80&w=1200'
    ]
  });

  const [activeImageIndices, setActiveImageIndices] = useState<Record<string, number>>({});
  const [brokenImageUrls, setBrokenImageUrls] = useState<Record<string, boolean>>({});
  const [customImageInputs, setCustomImageInputs] = useState<Record<string, string>>({});

  const states = ['All', 'Saarland', 'Rheinland-Pfalz', 'Berlin'];

  const filteredMuseums = MUSEUMS_DATA.filter(museum => {
    const matchesState = selectedStateFilter === 'All' || museum.stateCountry === selectedStateFilter;
    
    const query = searchQuery.trim().toLowerCase();
    if (!query) return matchesState;

    const matchesSearch = 
      museum.name.toLowerCase().includes(query) ||
      museum.location.toLowerCase().includes(query) ||
      museum.street.toLowerCase().includes(query) ||
      museum.description.toLowerCase().includes(query) ||
      museum.stateCountry.toLowerCase().includes(query) ||
      museum.artifacts.some(art => 
        art.name.toLowerCase().includes(query) ||
        art.description.toLowerCase().includes(query) ||
        art.originSiteName.toLowerCase().includes(query) ||
        art.period.toLowerCase().includes(query)
      );

    return matchesState && matchesSearch;
  });

  const getStatusBadgeClass = (status: Artifact['status']) => {
    switch (status) {
      case 'In Ausstellung':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Im Depot':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Teilrekonstruiert':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-stone-50 text-stone-600 border-stone-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 animate-fade-in">
      {/* Page Header */}
      <div className="text-center mb-16">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 glass-panel rounded-full text-emerald-800 text-[10px] font-bold uppercase tracking-[0.3em] mb-4 shadow-sm"
        >
          {getTranslation('museums.subTitle', language)}
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-stone-900 leading-tight">
          {getTranslation('museums.title', language)}
        </h1>
        <p className="text-stone-600 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
          {getTranslation('museums.desc', language)}
        </p>

        {isSpeechSupported && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => {
                const textToSpeak = getTranslation('museums.speakMain', language);
                speak(textToSpeak, 'museums-main');
              }}
              className={`px-5 py-3 rounded-2xl text-sm font-black uppercase tracking-wider flex items-center gap-2.5 transition-all duration-300 active:scale-95 cursor-pointer shadow-lg border ${
                speakingMessageId === 'museums-main'
                  ? 'bg-amber-500 border-amber-400 text-stone-900 animate-pulse scale-[1.02]'
                  : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 border-amber-400 text-stone-900 shadow-amber-950/10'
              }`}
              title={speakingMessageId === 'museums-main' ? getTranslation('btn.stopSpeak', language) : getTranslation('btn.flaviusSpeak', language)}
            >
              {speakingMessageId === 'museums-main' ? (
                <>
                  <VolumeX size={18} />
                  <span>⏹️ {getTranslation('btn.stopSpeak', language)}</span>
                </>
              ) : (
                <>
                  <Volume2 size={18} className="animate-bounce" style={{ animationDuration: '1.5s' }} />
                  <span>🔊 {getTranslation('btn.flaviusSpeak', language)}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-6 mb-12 items-stretch md:items-center justify-between">
        {/* State Filters */}
        <div className="glass-panel p-2 rounded-2xl flex flex-wrap gap-1.5 items-center">
          {states.map(state => (
            <button
              key={state}
              onClick={() => setSelectedStateFilter(state)}
              className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${
                selectedStateFilter === state 
                  ? 'bg-stone-900 text-white shadow-md' 
                  : 'hover:bg-stone-100 text-stone-600'
              }`}
            >
              {state === 'All' ? getTranslation('museums.allLocations', language) : state}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[280px] md:min-w-[340px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={getTranslation('museums.searchPlaceholder', language)}
            className="w-full pl-10 pr-10 py-3 bg-stone-100 hover:bg-stone-200/50 focus:bg-white border-2 border-stone-200 focus:border-emerald-700/50 rounded-2xl text-xs font-semibold tracking-wide transition-all shadow-sm focus:ring-0 text-stone-800"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
            <Search size={14} />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-600 transition-colors"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* No Results Fallback */}
      {filteredMuseums.length === 0 ? (
        <div className="text-center py-20 bg-stone-50/50 rounded-[2.5rem] border-2 border-dashed border-stone-200 animate-fade-in">
          <div className="text-stone-300 flex justify-center mb-4">
            <CompassIcon size={48} className="stroke-[1.5]" />
          </div>
          <h3 className="text-lg font-bold text-stone-800 mb-1">{getTranslation('museums.noResultsTitle', language)}</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
            {getTranslation('museums.noResultsDesc', language).replace('{searchQuery}', searchQuery)}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredMuseums.map((museum) => {
            const isExpanded = expandedMuseumId === museum.id;
            const isOutsideSaarland = museum.stateCountry !== 'Saarland';

            return (
              <motion.div
                key={museum.id}
                layout="position"
                className="glass-panel overflow-hidden rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-300 border border-stone-200/50"
              >
                {/* Museum main row */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-5 sm:p-8 md:p-10 items-start">
                  {/* Museum Media and Kartenausschnitt Stack Column (lg:col-span-4) */}
                  <div className="lg:col-span-4 flex flex-col gap-4 self-stretch">
                    {(() => {
                      const initialImages = museumImages[museum.id] || [museum.imageUrl];
                      // Filter out images that are known to be broken
                      const validImages = initialImages.filter(url => !brokenImageUrls[url]);
                      const hasImages = validImages.length > 0;
                      
                      const currentActiveIndex = activeImageIndices[museum.id] || 0;
                      // Fallback index check
                      const activeIndex = currentActiveIndex < validImages.length ? currentActiveIndex : 0;
                      const currentImageUrl = hasImages ? validImages[activeIndex] : null;

                      return (
                        <>
                          {/* Museum Image preview - ONLY render if there are working images. Otherwise, hides automatically! */}
                          {hasImages && currentImageUrl && (
                            <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden relative shadow-md shrink-0 border border-stone-200/50 bg-stone-100 group">
                              <img 
                                src={currentImageUrl} 
                                alt={museum.name}
                                onError={() => {
                                  // Mark this URL as broken so we fallback immediately or hide the block
                                  setBrokenImageUrls(prev => ({ ...prev, [currentImageUrl]: true }));
                                }}
                                className="w-full h-full object-cover grayscale-15 hover:grayscale-0 transition-all duration-500"
                                referrerPolicy="no-referrer"
                              />
                              
                              {/* Overlay Controls */}
                              {validImages.length > 1 && (
                                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                                  <span className="bg-stone-900/80 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-xs select-none pointer-events-auto leading-none">
                                    {activeIndex + 1} / {validImages.length}
                                  </span>
                                  <div className="flex gap-1 pointer-events-auto">
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveImageIndices(prev => ({
                                          ...prev,
                                          [museum.id]: (activeIndex - 1 + validImages.length) % validImages.length
                                        }));
                                      }}
                                      className="w-5 h-5 rounded bg-stone-900/80 hover:bg-stone-950 text-white flex items-center justify-center text-xs font-bold leading-none transition-colors"
                                    >
                                      ‹
                                    </button>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveImageIndices(prev => ({
                                          ...prev,
                                          [museum.id]: (activeIndex + 1) % validImages.length
                                        }));
                                      }}
                                      className="w-5 h-5 rounded bg-stone-900/80 hover:bg-stone-950 text-white flex items-center justify-center text-xs font-bold leading-none transition-colors"
                                    >
                                      ›
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Dynamic "Feld für Bilder" (Manage Images Directly) */}
                          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/50 flex flex-col gap-2.5">
                            <h4 className="text-[10px] font-black uppercase tracking-wider text-stone-500 flex items-center justify-between">
                              <span className="flex items-center gap-1"><ImageIcon size={12} className="text-emerald-700" /> {getTranslation('museums.gallery', language)}</span>
                              {validImages.length > 0 && (
                                <span className="text-[8px] text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded font-mono">
                                  {validImages.length} {validImages.length === 1 ? getTranslation('museums.image', language) : getTranslation('museums.images', language)}
                                </span>
                              )}
                            </h4>

                            {/* Thumbnails row */}
                            {validImages.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {validImages.map((imgUrl, idx) => (
                                  <div key={imgUrl} className="relative group/thumb shrink-0">
                                    <button
                                      onClick={() => setActiveImageIndices(prev => ({ ...prev, [museum.id]: idx }))}
                                      className={`w-9 h-7 rounded-lg overflow-hidden border-2 transition-all block ${
                                        idx === activeIndex 
                                          ? 'border-emerald-700 scale-102 shadow-xs' 
                                          : 'border-stone-200 hover:border-stone-300 opacity-70 hover:opacity-100'
                                      }`}
                                    >
                                      <img src={imgUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    </button>
                                    
                                    {/* Delete option for gallery URLs */}
                                    {!(import.meta as any).env?.PROD && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setMuseumImages(prev => ({
                                            ...prev,
                                            [museum.id]: (prev[museum.id] || []).filter(url => url !== imgUrl)
                                          }));
                                          if (activeIndex >= Math.max(1, validImages.length - 1)) {
                                            setActiveImageIndices(prev => ({ ...prev, [museum.id]: 0 }));
                                          }
                                        }}
                                        className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center text-[8px] font-bold shadow-xs leading-none transition-all scale-90 hover:scale-100"
                                        title={getTranslation('museums.deleteImage', language)}
                                      >
                                        ×
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Graceful fallback warning if we have NO images loading successfully */}
                            {validImages.length === 0 && (
                               <div className="text-[10px] text-amber-800 bg-amber-50/70 border border-amber-200 rounded-xl p-2.5 flex items-start gap-1.5 leading-relaxed">
                                <AlertTriangle size={12} className="text-amber-700 shrink-0 mt-0.5" />
                                <div>
                                  {getTranslation('museums.imageError', language)}
                                </div>
                              </div>
                            )}

                            {/* Easy manual Bild-Eingabe URL Field / Image Manager */}
                            {!(import.meta as any).env?.PROD && (
                              <div className="flex gap-1.5 mt-1">
                                <input
                                  type="text"
                                  placeholder={getTranslation('museums.customUrlPlaceholder', language)}
                                  value={customImageInputs[museum.id] || ''}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setCustomImageInputs(prev => ({ ...prev, [museum.id]: val }));
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      const url = customImageInputs[museum.id]?.trim();
                                      if (url) {
                                        const currentList = museumImages[museum.id] || [museum.imageUrl];
                                        setMuseumImages(prev => ({
                                          ...prev,
                                          [museum.id]: [...currentList, url]
                                        }));
                                        setCustomImageInputs(prev => ({ ...prev, [museum.id]: '' }));
                                        // Remove broken status if they entered it
                                        setBrokenImageUrls(prev => {
                                          const updated = { ...prev };
                                          delete updated[url];
                                          return updated;
                                        });
                                        // Focus the new image
                                        setTimeout(() => {
                                          setActiveImageIndices(prev => ({
                                            ...prev,
                                            [museum.id]: currentList.length
                                          }));
                                        }, 50);
                                      }
                                    }
                                  }}
                                  className="flex-1 bg-white px-2.5 py-1 text-[9px] border border-stone-200 rounded-xl text-stone-700 placeholder-stone-400 focus:outline-hidden focus:border-emerald-700/50"
                                />
                                <button
                                  onClick={() => {
                                    const url = customImageInputs[museum.id]?.trim();
                                    if (url) {
                                      const currentList = museumImages[museum.id] || [museum.imageUrl];
                                      setMuseumImages(prev => ({
                                        ...prev,
                                        [museum.id]: [...currentList, url]
                                      }));
                                      setCustomImageInputs(prev => ({ ...prev, [museum.id]: '' }));
                                      setBrokenImageUrls(prev => {
                                        const updated = { ...prev };
                                        delete updated[url];
                                        return updated;
                                      });
                                      setTimeout(() => {
                                        setActiveImageIndices(prev => ({
                                          ...prev,
                                          [museum.id]: currentList.length
                                        }));
                                      }, 50);
                                    }
                                  }}
                                  className="bg-stone-900 hover:bg-emerald-900 text-white font-bold text-[9px] px-2.5 py-1 rounded-xl transition-all flex items-center gap-0.5 shrink-0"
                                >
                                  <Plus size={10} /> {getTranslation('museums.add', language)}
                                </button>
                              </div>
                            )}
                          </div>
                        </>
                      );
                    })()}

                    {/* Integrated Kartenausschnitt (Mini Map snippet for each museum) */}
                    <div className="h-28 w-full rounded-2xl overflow-hidden relative shadow-md border border-stone-200/80 bg-stone-100 shrink-0 select-none">
                      <Map 
                        height={112} 
                        center={[museum.lat, museum.lng]} 
                        zoom={13}
                      >
                        <Overlay anchor={[museum.lat, museum.lng]} offset={[12, 12]}>
                          <div className="relative group animate-bounce">
                            <div className="w-7 h-7 rounded-full bg-indigo-900 border-2 border-white text-white flex items-center justify-center shadow-md">
                              <Landmark size={11} className="text-indigo-100" />
                            </div>
                          </div>
                        </Overlay>
                      </Map>
                      {/* Floating Indicator */}
                      <div className="absolute bottom-2 right-2 bg-stone-900/85 text-white text-[7px] uppercase tracking-widest font-black px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm leading-none backdrop-blur-xs select-none z-10">
                        <MapPin size={8} className="text-indigo-300" /> {getTranslation('museums.mapSnippet', language)}
                      </div>
                    </div>
                  </div>

                  {/* Museum details text (lg:col-span-8) */}
                  <div className="lg:col-span-8 flex flex-col justify-between h-full space-y-4">
                    <div>
                      {/* State tag as header & Museum name right below it */}
                      <div className="mb-3">
                        <div className="mb-1.5">
                          <span className={`px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest text-white shadow-xs ${
                            isOutsideSaarland 
                              ? 'bg-indigo-900/95 border border-indigo-700/60 shadow-[0_1px_4px_rgba(49,46,129,0.15)]' 
                              : 'bg-emerald-900/95 border border-emerald-700/60 shadow-[0_1px_4px_rgba(6,78,59,0.15)]'
                          }`}>
                            📍 {museum.stateCountry}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <h2 className="text-xl md:text-2xl font-black text-stone-900 tracking-tight leading-snug">
                            {museum.name}
                          </h2>
                          {isSpeechSupported && (
                            <button
                              onClick={() => speak(`${museum.name}. ${museum.description} Befindet sich in ${museum.location}, ${museum.street}. Öffnungszeiten: ${museum.openingHours}.`, museum.id)}
                              className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer border flex items-center gap-2 shadow-xs active:scale-95 shrink-0 ${
                                speakingMessageId === museum.id
                                  ? 'bg-amber-500 border-amber-400 text-stone-900 animate-pulse font-black shadow-md'
                                  : 'bg-amber-50 hover:bg-amber-500 border-amber-200 hover:border-amber-400 text-amber-800 hover:text-stone-900 shadow-xs'
                              }`}
                              title={speakingMessageId === museum.id ? getTranslation('btn.stopSpeak', language) : getTranslation('btn.speak', language)}
                            >
                              {speakingMessageId === museum.id ? (
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
                        
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-1">
                          <span className="flex items-center gap-1 text-emerald-800">
                            <MapPin size={12} className="text-emerald-700 shrink-0" />
                            {museum.location}
                          </span>
                          <span className="text-stone-300">|</span>
                          <span>{museum.street}</span>
                        </div>
                      </div>

                      <p className="text-stone-600 text-sm md:text-base leading-relaxed mb-6">
                        {museum.description}
                      </p>

                      {/* Special Banner if closed due to renovation */}
                      {museum.openingHours.includes('geschlossen') && (
                        <div className="mb-5 p-4 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5 shadow-xs">
                          <AlertTriangle size={16} className="text-amber-700 shrink-0 mt-0.5 animate-pulse" />
                          <div>
                            <p className="font-bold">{getTranslation('museums.renovationNotice', language)}</p>
                            <p className="text-amber-850 mt-0.5 leading-relaxed">{getTranslation('museums.renovationText', language)}</p>
                          </div>
                        </div>
                      )}

                      {/* --- Added specifications: Zugangsdaten, Genauer Standort, Straße, Erreichbarkeit, Öffnungszeiten --- */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-100/50 p-6 rounded-2xl border border-stone-200/40 text-stone-700">
                        <div className="flex gap-3">
                          <Clock size={16} className={`${museum.openingHours.includes('geschlossen') ? 'text-red-600' : 'text-emerald-700'} shrink-0 mt-0.5`} />
                          <div className="flex flex-col items-start">
                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{getTranslation('museums.hours', language)}</span>
                            {museum.openingHours.includes('geschlossen') ? (
                              <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-md leading-normal mt-1 inline-flex items-center gap-1 font-mono">
                                🚧 {museum.openingHours}
                              </span>
                            ) : (
                              <span className="text-xs font-semibold text-stone-800 leading-tight mt-0.5">{museum.openingHours}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Ticket size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{getTranslation('museums.fees', language)}</span>
                            <span className="text-xs font-semibold text-stone-800 leading-tight mt-0.5">{museum.entranceFee}</span>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Accessibility size={16} className={`${museum.wheelchairAccessible ? 'text-emerald-700' : 'text-amber-600'} shrink-0 mt-0.5`} />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{getTranslation('museums.accessibility', language)}</span>
                            <span className="text-xs font-semibold text-stone-800 leading-tight mt-0.5">
                              {museum.wheelchairAccessible ? getTranslation('museums.wheelchairYes', language) : getTranslation('museums.wheelchairPartial', language)} — <span className="text-stone-500 font-normal">{museum.accessibilityDetails}</span>
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Info size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{getTranslation('museums.preciseLocation', language)}</span>
                            <span className="text-xs font-semibold text-stone-800 leading-tight mt-0.5">
                              {museum.preciseLocation || museum.street}
                            </span>
                          </div>
                        </div>

                        {museum.phone && (
                          <div className="flex gap-3">
                            <Phone size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{getTranslation('museums.phone', language)}</span>
                              <a href={`tel:${museum.phone.replace(/\s+/g, '')}`} className="text-xs font-semibold text-stone-800 hover:text-emerald-800 leading-tight mt-0.5">
                                {museum.phone}
                              </a>
                            </div>
                          </div>
                        )}

                        {museum.email && (
                          <div className="flex gap-3">
                            <Mail size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{getTranslation('museums.email', language)}</span>
                              <a href={`mailto:${museum.email}`} className="text-xs font-semibold text-stone-850 hover:text-emerald-800 leading-tight mt-0.5 break-all">
                                {museum.email}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 items-center justify-between pt-4 border-t border-stone-200/40">
                      <div className="flex flex-wrap gap-x-6 gap-y-2 items-center">
                        <a
                          href={museum.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-emerald-800 transition-colors"
                        >
                          {getTranslation('museums.visitWebsite', language)} <Globe size={13} />
                        </a>
                        
                        {onFocusMuseumOnMap && (
                          <button
                            onClick={() => onFocusMuseumOnMap(museum)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-950 transition-colors"
                          >
                            {getTranslation('museums.showOnMainMap', language)} <MapIcon size={13} />
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => setExpandedMuseumId(isExpanded ? null : museum.id)}
                        className="px-6 py-3 bg-stone-900 text-white hover:bg-emerald-800 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all shadow-md hover:-translate-y-0.5"
                      >
                        {isExpanded ? (
                          <>{getTranslation('museums.hideArtifacts', language)} <ChevronUp size={12} /></>
                        ) : (
                          <>{getTranslation('museums.viewArtifacts', language)} ({museum.artifacts.length}) <ChevronDown size={12} /></>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Artifacts Section */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-stone-50/50 border-t border-stone-200/40 overflow-hidden"
                    >
                      <div className="p-5 sm:p-8 md:p-10 space-y-6">
                        <div className="flex items-center gap-2 mb-6">
                          <Sparkles size={16} className="text-emerald-700" />
                          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-stone-400">
                            {getTranslation('museums.artifactsTitle', language)} ({museum.artifacts.length})
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {museum.artifacts.map((art) => {
                            // Find corresponding site in full list to confirm it exists and fetch coordinates
                            const linkedSite = allSites.find(s => s.id === art.originSiteId);

                            return (
                              <div
                                key={art.id}
                                className="p-6 bg-white rounded-3xl border border-stone-200/60 hover:border-emerald-600/30 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                              >
                                <div className="space-y-4">
                                  {art.imageUrl && (
                                    <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden relative shadow-xs border border-stone-200/40 bg-stone-50 shrink-0">
                                      <img 
                                        src={art.imageUrl} 
                                        alt={art.name}
                                        className="w-full h-full object-cover hover:scale-105 transition-all duration-500"
                                        referrerPolicy="no-referrer"
                                      />
                                    </div>
                                  )}

                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 font-mono">
                                        {art.period}
                                      </span>
                                      <span className={`px-2.5 py-1 text-[8px] font-bold uppercase tracking-wider border rounded-md ${
                                        getStatusBadgeClass(art.status)
                                      }`}>
                                        {art.status}
                                      </span>
                                    </div>

                                    <h4 className="font-extrabold text-stone-900 text-base">
                                      {art.name}
                                    </h4>

                                    <p className="text-stone-600 text-xs leading-relaxed">
                                      {art.description}
                                    </p>
                                  </div>
                                </div>

                                {/* Link to original site map location */}
                                {linkedSite && (
                                  <div className="pt-4 border-t border-stone-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                                    <div className="flex items-center gap-1 text-stone-400 text-[10px] font-bold uppercase tracking-wide">
                                      <Info size={12} className="text-stone-300" />
                                      {getTranslation('museums.findspot', language)}: {art.originSiteName}
                                    </div>
                                    <button
                                      onClick={() => onFocusSiteOnMap(linkedSite.id)}
                                      className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 hover:text-emerald-950 transition-colors flex items-center gap-1"
                                    >
                                      {getTranslation('museums.locateOnMap', language)} <ArrowRight size={10} className="hover:translate-x-0.5 transition-transform" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
