import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  Sparkles, 
  User, 
  MessageSquare, 
  Footprints, 
  Users, 
  MapPin, 
  Map, 
  ExternalLink, 
  ArrowRight, 
  RotateCcw, 
  BookOpen, 
  Calendar,
  AlertTriangle,
  HelpCircle,
  Clock,
  Navigation,
  Globe,
  Grid,
  TrendingUp,
  Bookmark,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Site } from '../types';
import { Language, getTranslation, getMaleVoice, getVoicePitch } from '../data/translations';

interface ChatAction {
  label: string;
  page?: string;
  chatTrigger?: string;
  callbackType?: 'planner';
}

interface ChatMessage {
  sender: 'user' | 'flavius';
  text: string;
  actions?: ChatAction[];
}

interface TravelGuideViewProps {
  allSites: Site[];
  onSelectSite: (site: Site) => void;
  onNavigateToMap: (site: Site) => void;
  onSelectTour: (tourId: string) => void;
  onNavigateToTours: () => void;
  onNavigateToPage: (page: string) => void;
  language: Language;
}

export default function TravelGuideView({
  allSites,
  onSelectSite,
  onNavigateToMap,
  onSelectTour,
  onNavigateToTours,
  onNavigateToPage,
  language
}: TravelGuideViewProps) {
  const [activeTab, setActiveTab] = useState<'planner' | 'qa'>('qa'); // Prioritize chat view as requested
  
  // VOICE / SPEECH SYNTHESIS STATE
  const [speakingMessageId, setSpeakingMessageId] = useState<string | number | null>(null);
  const isSpeechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Pre-load voices if necessary and handle cleanup
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      const handleVoicesChanged = () => {
        // Voices loaded asynchronously
      };
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
        window.speechSynthesis.cancel();
      };
    }
  }, []);

  // Stop speaking when switching tabs
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
    }
  }, [activeTab]);

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
  
  // STEP-BY-STEP PLANNER STATE
  const [plannerStep, setPlannerStep] = useState<1 | 2 | 3 | 4 | 'result'>(1);
  const [selectedEra, setSelectedEra] = useState<'Eisenzeit' | 'Römerzeit' | 'Mittelalter' | 'Mix' | null>(null);
  const [selectedFitness, setSelectedFitness] = useState<'Leicht' | 'Mittel' | 'Schwer' | null>(null);
  const [selectedCompanion, setSelectedCompanion] = useState<'Solo' | 'Group' | 'Family' | null>(null);
  const [selectedFocus, setSelectedFocus] = useState<'Nature' | 'Culture' | 'Adventure' | null>(null);

  // CHAT STATE
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Update chat history with translated initial greeting on language change
  useEffect(() => {
    setChatHistory([
      { 
        sender: 'flavius', 
        text: getTranslation('guide.flaviusGreeting', language),
        actions: [
          { label: getTranslation('guide.actionExplain', language), chatTrigger: 'funktionen' },
          { label: getTranslation('guide.actionEpochs', language), chatTrigger: 'epochen' },
          { label: getTranslation('guide.actionPlan', language), callbackType: 'planner' }
        ]
      }
    ]);
  }, [language]);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatHistory]);

  // LOCAL COPY OF TOURS DATA (FOR ALIGNMENT WITH TOURSVIEW)
  const toursData = [
    {
      id: 'tour-bliesgau',
      name: 'Biosphären-Pfad Bliesgau (Archäologische Zeitreise)',
      difficulty: 'Mittel',
      distance: 12.8,
      duration: '3:45 h',
      elevationUp: 240,
      description: 'Ein herrlicher Kultur-Rundweg im UNESCO-Biosphärenreservat Bliesgau. Er verbindet das römische Erbe von Reinheim mit prähistorischen Grabmonumenten.',
      epoch: 'Römerzeit',
      eraLabel: 'Römerzeit & Keltengräber',
      sites: ['site-bliesbruck', 'site-graeberfeld-reinheim'],
      imageUrl: 'images/dummy-005-kulturpark-bliesbruck-reinheim.jpg'
    },
    {
      id: 'tour-otzenhausen',
      name: 'Hunnenring-Dollberg Steig',
      difficulty: 'Schwer',
      distance: 8.4,
      duration: '3:15 h',
      elevationUp: 315,
      description: 'Anspruchsvoller Steig zum monumentalen keltischen Ringwall (Hunnenring) an der Kuppe des Dollbergs. Atemberaubende Aussichten und epische Ringwallreste.',
      epoch: 'Eisenzeit',
      eraLabel: 'Keltische Eisenzeit',
      sites: ['site-ringwall-otzenhausen'],
      imageUrl: 'images/dummy-004-hunnenring.jpg'
    },
    {
      id: 'tour-mandelbachtal',
      name: 'Rodenwald-Schatzpfad Erfweiler',
      difficulty: 'Leicht',
      distance: 6.5,
      duration: '2:00 h',
      elevationUp: 100,
      description: 'Schattiger, idyllischer Waldpfad zu mystischen Grabhügeln und historischen Steinmalen im waldreichen Mandelbachtal. Ideal für Gemütliche.',
      epoch: 'Mix',
      eraLabel: 'Bunter Epochenmix',
      sites: ['site-menhir-st-ingbert', 'site-gollenstein'],
      imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'tour-limberg',
      name: 'Vauban- & Limberg-Geschichtspfad',
      difficulty: 'Mittel',
      distance: 9.6,
      duration: '3:00 h',
      elevationUp: 160,
      description: 'Spannender Gang durch das Mittelalter und die barocke Festungsära auf dem waldreichen Limbergrücken oberhalb der Saar.',
      epoch: 'Mittelalter',
      eraLabel: 'Mittelalter & Festungsgeschichte',
      sites: ['site-siersburg', 'site-teufelsburg'],
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'tour-blies-cycling',
      name: 'Blies-Kultur-Radweg (Römermuseum- & Kulturpark-Runde)',
      difficulty: 'Leicht',
      distance: 18.2,
      duration: '2:30 h',
      elevationUp: 50,
      description: 'Eine entspannte, ebene Radrunde entlang der Blies, die das Römermuseum Schwarzenacker mit dem Kulturpark Bliesbruck-Reinheim verbindet.',
      epoch: 'Römerzeit',
      eraLabel: 'Römische Infrastruktur',
      sites: ['site-schwarzenacker', 'site-bliesbruck'],
      imageUrl: 'images/dummy-008-roemermuseum-schwarzenacker.jpg'
    }
  ];

  // RECOMMENDATION LOGIC based on filters
  const getRecommendation = () => {
    let candidates = toursData;
    if (selectedEra) {
      candidates = toursData.filter(t => t.epoch === selectedEra);
    }

    if (candidates.length === 0 || candidates.length === toursData.length) {
      if (selectedFitness) {
        candidates = toursData.filter(t => t.difficulty === selectedFitness);
      }
    }

    const recommendedTour = candidates[0] || toursData[0];
    const matchedSites = allSites.filter(s => recommendedTour.sites.includes(s.id) || s.era === recommendedTour.epoch);

    return {
      tour: recommendedTour,
      sites: matchedSites.slice(0, 3)
    };
  };

  const recommendation = getRecommendation();

  // RESET PLANNER
  const handleResetPlanner = () => {
    setSelectedEra(null);
    setSelectedFitness(null);
    setSelectedCompanion(null);
    setSelectedFocus(null);
    setPlannerStep(1);
  };

  // HANDLES AUTOMATIC EXPLANATION TRIGGERS 
  const handleActionClick = (action: ChatAction) => {
    if (action.page) {
      onNavigateToPage(action.page);
    } else if (action.callbackType === 'planner') {
      setActiveTab('planner');
      setPlannerStep(1);
    } else if (action.chatTrigger) {
      setChatHistory(prev => [...prev, { sender: 'user', text: action.label }]);
      
      const triggerKey = action.chatTrigger.toLowerCase();
      setTimeout(() => {
        let replyText = '';
        let replyActions: ChatAction[] = [];

        if (triggerKey === 'funktionen') {
          replyText = 'Als euer kaiserlicher Mentor habe ich dieses Portal vermessen. Jede Funktion dient eurem Verständnis unserer Kulturlandschaft:\n\n' +
            '1. 🗺️ **Interaktive Karte**: Zeigt euch alle archäologischen Bodendenkmäler mit detaillierten Schilderungen, Rekonstruktionen und GPS-Standorten.\n' +
            '2. ⏳ **Epochen**: Führt euch chronologisch durch die Zeitstufen des Saarlandes von der Urgeschichte bis heute.\n' +
            '3. 🏛️ **Museen**: Präsentiert euch herausragende Erholungs- und Forschungsstandorte wie das Römische Landgut Villa Borg oder das Freilichtmuseum Schwarzenacker.\n' +
            '4. 🥾 **Wandertouren**: Liebevoll kartografierte Wege für euren echten Marsch durch die Hügel.\n' +
            '5. 🧭 **Wegefinder**: Mein geodätischer Planer. Teilt mir eure Stärke mit, und ich schlage euch einen fertigen Weg vor!\n\n' +
            'Drückt einfach auf einen der Buttons unten, und ich führe euch direkt dorthin!';
          replyActions = [
            { label: '🗺️ Zur Interaktiven Karte', page: 'sites' },
            { label: '⏳ Epochen-Zeitleiste', page: 'epochs' },
            { label: '🏛️ Museen erkunden', page: 'museen' },
            { label: '🥾 Wandertouren durchsehen', page: 'tours' },
            { label: '🧭 Wegefinder starten', callbackType: 'planner' }
          ];
        } else if (triggerKey === 'epochen') {
          replyText = 'Unsere Hügel tragen die Spuren zahlloser Ahnengenerationen, die wir wissenschaftlich in fünf Großepochen einteilen. Zu jeder halten wir kostbare Funde bereit:\n\n' +
            '• **Steinzeit** (Menhire, Faustkeile & die ersten sesshaften Kulturen)\n' +
            '• **Bronzezeit** (Filigrane Beile & mächtige Hügelgräbergruppen)\n' +
            '• **Eisenzeit / Kelten** (Königliche Fürstinnengräber & gewaltige Ringwallburgen)\n' +
            '• **Römerzeit** (Gallo-römischer Luxus, Villenlandschaften & Fernstraßen)\n' +
            '• **Mittelalter** (Ritterburgen wie die Teufelsburg & wehrhafte Frankenherrschaft)\n\n' +
            'Zu welcher geschichtlichen Epoche soll ich euch nähere Details offenbaren? Oder möchtet ihr das große chronologische Epochen-Portal öffnen?';
          replyActions = [
            { label: '🗿 Steinzeit erklären', chatTrigger: 'steinzeit' },
            { label: '🛡️ Bronzezeit erklären', chatTrigger: 'bronzezeit' },
            { label: '🏹 Keltische Eisenzeit', chatTrigger: 'eisenzeit' },
            { label: '🏛️ Römische Kaiserzeit', chatTrigger: 'roemerzeit' },
            { label: '🏰 Mittelalter erklären', chatTrigger: 'mittelalter' },
            { label: '⏳ Epochen-Portal öffnen', page: 'epochs' }
          ];
        } else if (triggerKey === 'steinzeit') {
          replyText = 'Die **Steinzeit** (ca. 450.000 v. Chr. – ca. 2.200 v. Chr.) ist der älteste Abschnitt der Menschheit. Im Saarland zeugen gigantische, rituell aufgerichtete Steinstelen von der Megalithkultur. \n\nDer eindrucksvolle **Gollenstein** bei Blieskastel ist mit stolzen 6,6 Metern der größte Menhir ganz Mitteleuropas. Ein monumentaler Gedenkort, der bereits vor fast 5000 Jahren aufgerichtet wurde. Öffnet die Karte, um ihn zu lokalisieren!';
          replyActions = [
            { label: '📍 Gollenstein auf Karte finden', page: 'sites' },
            { label: '⏳ Steinzeit-Zeitleiste ansehen', page: 'epochs' }
          ];
        } else if (triggerKey === 'bronzezeit') {
          replyText = 'Die **Bronzezeit** (ca. 2.200 v. Chr. – ca. 800 v. Chr.) bringt mit der Legierung von Kupfer und Zinn einen rasanten Technologiebruch. \n\nEs etabliert sich eine mächtige Elite, deren Reichtum wir heute in Grabhügelfeldern (wie in Böckweiler und Biesingen) bewundern können. Auch rituell vergrabene Metalllager wie die berühmten bronzezeitlichen Prachtdepots bei Erfweiler-Ehlingen zeugen von kostbarem Beilschmuck tief im Waldboden.';
          replyActions = [
            { label: '📍 Grabhügel Böckweiler zeigen', page: 'sites' },
            { label: '⏳ Bronzezeit-Details ansehen', page: 'epochs' }
          ];
        } else if (triggerKey === 'eisenzeit') {
          replyText = 'Die **Eisenzeit** (ca. 800 v. Chr. – ca. 15 v. Chr.) steht völlig im Glanz unserer stolzen Vorgänger – den **Kelten**!\n\nIm saarländischen Bliestal könnt ihr in das begehbare Grabmonument der **Keltischen Fürstin von Reinheim** eintreten, das mit kostbarstem Goldschmuck bester Handwerkskunst gefüllt war. Und am Dollberg bei Otzenhausen ragt der monumentale keltische Ringwall (der "Hunnenring") auf – eine Fliehburg von sagenhafter Wehrkraft, deren meterdicke Steinwälle vor Caesars Zeiten ganze Horden abwehrten!';
          replyActions = [
            { label: '📍 Fürstinnengrab Reinheim zeigen', page: 'sites' },
            { label: '🥾 Hunnenring-Wanderung anzeigen', page: 'tours' },
            { label: '⏳ Kelten-Epochenblatt öffnen', page: 'epochs' }
          ];
        } else if (triggerKey === 'roemerzeit') {
          replyText = 'Meine Epoche! Die **Römerzeit** (ca. 15 v. Chr. – ca. 450 n. Chr.) verband das Saarland fest mit dem Römischen Weltreich. \n\nEs bildete sich eine exzellent organisierte gallo-römische Kultur aus. Wir pflasterten Straßen und errichteten prächtige Gutsanlagen im agrarischen Hinterland des Saargaus, wie die vollständig rekonstruierte **Villa Borg** mit warmen herrschaftlichen Badebecken (Thermen) und reich bepflanzten Gärten. Oder besucht das Römermuseum **Schwarzenacker**, eine wieder ausgegrabene Händlerstadt mit echten antiken Straßenresten!';
          replyActions = [
            { label: '🏛️ Römische Villa Borg erkunden', page: 'museen' },
            { label: '📍 Vicus Schwarzenacker auf Karte', page: 'sites' },
            { label: '⏳ Römerzeit-Timeline ansehen', page: 'epochs' }
          ];
        } else if (triggerKey === 'mittelalter') {
          replyText = 'Im **Mittelalter** (ca. 450 – ca. 1500 n. Chr.) übernahmen die Franken das Zepter. Reiterschichten bauten wehrhafte Befestigungslinien entlang des wichtigen Flusstales der Saar.\n\nHeute trohnen Ruinen wie die stolze **Teufelsburg** bei Felsberg oder die **Siersburg** hoch über den Hügeln. Ihre weiten Kellergewölbe, hohen Bergfriede und dicken Schutzmauern laden Wanderer zu wackeren Expeditionen ein.';
          replyActions = [
            { label: '🥾 Mittelalter-Pfad anzeigen', page: 'tours' },
            { label: '📍 Teufelsburg auf Karte zeigen', page: 'sites' },
            { label: '⏳ Mittelalter-Timeline öffnen', page: 'epochs' }
          ];
        }

        setChatHistory(prev => [...prev, { sender: 'flavius', text: replyText, actions: replyActions }]);
      }, 700);
    }
  };

  // PRE-CONFIGURED QUESTION HANDLING VIA QUICK CLICK BOARD
  const askFlaviusQuestion = (question: string, keyWordResponse: string, customActions?: ChatAction[]) => {
    setChatHistory(prev => [
      ...prev,
      { sender: 'user', text: question },
      { sender: 'flavius', text: keyWordResponse, actions: customActions }
    ]);
  };

  // USER FREE TEXT QUESTION HANDLING WITH SMART DETECTIONS
  const handleSendChat = () => {
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setChatHistory(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');

    // Simulated parsing engine for keyword matches in character
    setTimeout(() => {
      const lower = userText.toLowerCase();
      let flaviusReply = '';
      let replyActions: ChatAction[] = [];

      if (lower.includes('funktion') || lower.includes('feature') || lower.includes('was kann') || lower.includes('hilfe') || lower.includes('app') || lower.includes('anleitung') || lower.includes('erklär')) {
        flaviusReply = 'Als euer kaiserlicher Mentor leite ich euch gerne durch dieses prächtige digitale Portal! Folgende Funktionen habe ich für euch bereitgestellt:\n\n' +
          '• **Interaktive Karte**: Findet alle historischen Monumente des Saarlandes mit exakten GPS-Punkten.\n' +
          '• **Epochen**: Ein übersichtlicher Zeitstrahl von der Steinzeit bis zum Mittelalter.\n' +
          '• **Museen**: Detaillierte Berichte über Freilichtmuseen und Parkanlagen.\n' +
          '• **Wandertouren**: Ausgearbeitete Pfade mit GPS-Distanzen, Dauer & Höhenmetern.\n' +
          '• **Wegefinder**: Beantwortet 4 kurze Fragen im "Planer"-Tab, und ich empfehle euch euren optimalen Pfad!';
        replyActions = [
          { label: '🗺️ Zur Karte springen', page: 'sites' },
          { label: '⏳ Zu den Epochen reisen', page: 'epochs' },
          { label: '🏛️ Zum Museen-Portal wechseln', page: 'museen' },
          { label: '🥾 Wandertouren öffnen', page: 'tours' },
          { label: '🧭 Wegefinder-Planer aufrufen', callbackType: 'planner' }
        ];
      } else if (lower.includes('epoche') || lower.includes('zeiten') || lower.includes('geschichte') || lower.includes('zeitreise')) {
        flaviusReply = 'Das Saarland birgt Spuren jahrtausendealter Epochen. Drückt auf einen der Buttons unten, und ich erkläre euch die entsprechende Ära im Detail, oder reist direkt zum interaktiven Zeitstrahl!';
        replyActions = [
          { label: '🗿 Steinzeit', chatTrigger: 'steinzeit' },
          { label: '🛡️ Bronzezeit', chatTrigger: 'bronzezeit' },
          { label: '🏹 Keltische Eisenzeit', chatTrigger: 'eisenzeit' },
          { label: '🏛️ Römische Kaiserzeit', chatTrigger: 'roemerzeit' },
          { label: '🏰 Mittelalter', chatTrigger: 'mittelalter' },
          { label: '⏳ Epochen-Zeitleiste öffnen', page: 'epochs' }
        ];
      } else if (lower.includes('steinzeit') || lower.includes('menhir') || lower.includes('gollenstein')) {
        flaviusReply = 'Die **Steinzeit** (ca. 450.000 v. Chr. – ca. 2.200 v. Chr.) ist geprägt von eiszeitlichen Jägern und den ersten sesshaften Bauern im Neolithikum. \n\nDas Prunkstück unserer Region ist der massive **Gollenstein** bei Blieskastel – mit 6,6 Metern der größte vorgeschichtliche Hinkelstein ganz Mitteleuropas. Ein fantastisches Relikt unserer frühesten Ahnen!';
        replyActions = [
          { label: '📍 Gollenstein auf der Karte finden', page: 'sites' },
          { label: '⏳ Steinzeit-Highlights ansehen', page: 'epochs' }
        ];
      } else if (lower.includes('bronzezeit') || lower.includes('hügelgrab') || lower.includes('ehlingen')) {
        flaviusReply = 'In der **Bronzezeit** (ca. 2.200 v. Chr. – ca. 800 v. Chr.) breitete sich das Metallgießen rasant aus. \n\nMächtige Elitengräber säumen das Biosphärenreservat Bliesgau (Grabhügel Böckweiler und Biesingen) und hüteten kostbare Beigaben. Auch vergrabene Schätze wie der Metalldepot-Fund Erfweiler-Ehlingen stammen aus dieser rituellen Epoche.';
        replyActions = [
          { label: '📍 Grabhügel Böckweiler auf Karte', page: 'sites' },
          { label: '⏳ Bronzezeit-Timeline ansehen', page: 'epochs' }
        ];
      } else if (lower.includes('kelten') || lower.includes('eisenzeit') || lower.includes('reinheim') || lower.includes('ringwall') || lower.includes('otzenhausen') || lower.includes('hunnenring')) {
        flaviusReply = 'Die stolzen **Kelten** beherrschten die **Eisenzeit** (ca. 800 v. Chr. – ca. 15 v. Chr.)! In Reinheim wurde das unberührte Grab der sagenhaften **Keltischen Fürstin** mit reichem Goldschmuck ausgegraben. \n\nAm bergigen Dollberg bei Otzenhausen ragt der gigantische keltische Ringwall empor – dessen gewaltige Steinwälle einst bis zu zehn Meter hoch waren. Ein absolutes Abenteuer-Erlebnis!';
        replyActions = [
          { label: '🥾 Hunnenring-Wanderung ansehen', page: 'tours' },
          { label: '📍 Keltengräber Reinheim zeigen', page: 'sites' },
          { label: '⏳ Keltische Eisenzeit-Chronik', page: 'epochs' }
        ];
      } else if (lower.includes('römer') || lower.includes('rom') || lower.includes('borg') || lower.includes('nennig') || lower.includes('villas') || lower.includes('villa') || lower.includes('kaiserzeit')) {
        flaviusReply = 'Salvete! Unter der **Römerzeit** (ca. 15 v. Chr. – ca. 450 n. Chr.) blühte unsere Provinz massiv auf. \n\nEs bildete sich die prachtvolle gallo-römische Kultur heraus. Besucht das perfekt rekonstruierte antike Landgut **Villa Borg** mit herrschaftlichen Badehäusern und Gärten, oder bestaunt das größte römische Gladiatorenmosaik nördlich der Alpen in **Nennig**. Ein wahrer Traum für Senatoren!';
        replyActions = [
          { label: '🏛️ Villa Borg genauer ansehen', page: 'museen' },
          { label: '📍 Römermosaik Nennig zeigen', page: 'sites' },
          { label: '⏳ Römerzeit-Mappe öffnen', page: 'epochs' }
        ];
      } else if (lower.includes('mittelalter') || lower.includes('burg') || lower.includes('burgen') || lower.includes('teufelsburg') || lower.includes('siersburg')) {
        flaviusReply = 'Das **Mittelalter** (ca. 450 n. Chr. – ca. 1500 n. Chr.) brachte sagenhafte Ritterburgen über die Hügel. \n\nDie imposante Ruine der **Teufelsburg** lässt euch herrschaftliche Gräben, Burgmauern und Verliese erforschen. Ein hervorragender Kulturweg führt euch auch über den Vauban- und Limberg-Geschichtspfad entlang trutziger Zinnen!';
        replyActions = [
          { label: '🥾 Limberg-Burgenpfad ansehen', page: 'tours' },
          { label: '📍 Teufelsburg auf Karte lokalisieren', page: 'sites' },
          { label: '⏳ Mittelalter-Timeline ansehen', page: 'epochs' }
        ];
      } else if (lower.includes('wein') || lower.includes('trinken') || lower.includes('alkohol')) {
        flaviusReply = 'Ah, der edle Saft des Dionysos! Die Römer kultivierten an den schattigen Schleifen der Saar vorzügliche Rebsorten (Schnittlinge des Elbling). Wir verdünnten unseren Wein traditionell mit kaltem Quellwasser und aromatisierten ihn manchmal mit Honig. Die reichen Gutsbesitzer des Bliesgals importierten feine Amphoren direkt aus Campanien. Für die einfachen Wandersandalen heute empfinde ich den leichten, kühlen Saar-Riesling als echten Göttertrunk!';
      } else if (lower.includes('schuh') || lower.includes('stiefel') || lower.includes('sandale') || lower.includes('ausrüstung')) {
        flaviusReply = 'Ein Soldat ist nur so gut wie seine Füße! Als römischer Marschierer verließ ich mich auf unsere Caligae – schwere, genagelte Ledersandalen mit dicken Sohlen für Matsch und Fels. Für eure heutigen Wege im Biosphärenreservat Bliesgau solltet ihr solide, moderne Wanderschuhe mit gutem Profil tragen. Insbesondere der Aufstieg zur keltischen Festung Otzenhausen über glitschiges Vulkangestein verlangt Trittsicherheit und starke Knöchelstützen!';
      } else if (lower.includes('kind') || lower.includes('familie') || lower.includes('spiel')) {
        flaviusReply = 'Für die jungen Rekruten haben wir wahre Prachtstücke! Ich empfehle euch den Keltischen Ringwall Otzenhausen. Dort wurde ein komplettes Keltenndorf rekonstruiert. Kinder lieben es, das hölzerne Palisadentor zu erforschen und in den Hütten den Lehmgeruch der Vorzeit zu riechen. Schaut auch im Mitmachbereich des Europäischen Kulturparks Reinheim vorbei – dort können kleine Entdecker römische Mosaike legen oder römische Gewänder ausprobieren!';
      } else if (lower.includes('essen') || lower.includes('proviant') || lower.includes('wasser') || lower.includes('hunger')) {
        flaviusReply = 'Wandern macht hungrig wie eine Wölfin! Ein ordentlicher Legionär rationsert sein panis militaris (Militärbrot) und nimmt getrocknete Feigen, Walnüsse und harten Käse mit. Im Bliesgau findet ihr herrliche Schattelflecken für ein kaiserliches Picknick. Vergesst nicht, reichlich Wasser mitzunehmen, denn der stramme Hunnenring-Wanderweg hat keine Tabernen unterwegs!';
      } else if (lower.includes('schatz') || lower.includes('gold') || lower.includes('ausgrabung')) {
        flaviusReply = 'Der wertvollste Hort liegt oft tief begraben! Zu unseren Glanzpunkten gehört das Grab der Keltischen Fürstin von Reinheim. Ihre Bestattung war gefüllt mit unvorstellbarem Luxus: Eine filigrane goldene Halskette (Torques), bronzene Kannen voll feinstem Met, prachtvoller Bernsteinschmuck. Die Originale ruhen heute im Museum in Speyer, doch am Originalschauplatz Reinheim könnt ihr in das begehbare Grabmonument eintreten. Ein unübertroffener mystischer Kraftort!';
        replyActions = [
          { label: '📍 Fürstinnengrab Reinheim zeigen', page: 'sites' }
        ];
      } else if (lower.includes('schwarzenacker') || lower.includes('homburg')) {
        flaviusReply = 'Das römische Freilichtmuseum Homburg-Schwarzenacker ist eine echte Perle unseres Imperiums! Hier spaziert ihr auf echten römischen Straßen, flankiert von Rekonstruktionen prächtiger Wohnhäuser ritterlicher Händler. Schaut euch das Handwerkerhaus des Augenarztes an – ihr werdet staunen, wie hochpräzise unsere Medizin damals schon war!';
        replyActions = [
          { label: '🏛️ Römermuseum Schwarzenacker besehen', page: 'museen' }
        ];
      } else if (lower.includes('speyer')) {
        flaviusReply = 'Durch weitsichtige Kooperationen und Ausgrabungen gelangten die allerersten, prachtvollen keltischen Grabungsfunde der Saarpfalz in das Historische Museum der Pfalz in Speyer. Ein herrlicher Ort, um die originalen Goldschätze, reich verzierten Halsringe und Urnen im Detail zu bestaunen, bevor man die Ruinen im Saarland bewandert!';
      } else {
        flaviusReply = 'Darüber berichtet meine geliebte Tabula Peutingeriana (die antike Straßenkarte) leider nur unvollständig! Aber fragt mich gerne nach den geschichtlichen Epochen (Steinzeit, Bronzezeit, Eisenzeit, Römerzeit, Mittelalter) oder lasst euch die Hauptfunktionen der Webseite erklären!';
        replyActions = [
          { label: '📱 App-Funktion erklären', chatTrigger: 'funktionen' },
          { label: '⏳ Epochen erklären', chatTrigger: 'epochen' }
        ];
      }

      setChatHistory(prev => [...prev, { sender: 'flavius', text: flaviusReply, actions: replyActions }]);
    }, 800);
  };

  // PRE-BAKED QUESTIONS BOARD
  const preBakedQuestions = [
    {
      q: "📱 Was kann ich in diesem Portal tun?",
      trigger: 'funktionen'
    },
    {
      q: "⏳ Erkläre mir die geschichtlichen Epochen",
      trigger: 'epochen'
    },
    {
      q: "🏺 Wo finde ich römische Schätze im Saarland?",
      trigger: 'roemerzeit'
    },
    {
      q: "🏹 Wer waren die Kelten im Saarland?",
      trigger: 'eisenzeit'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 text-left">
      {/* HEADER SECTION IN LAND CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 sm:p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden mb-12 border border-emerald-800/10"
      >
        <div className="absolute top-0 right-0 p-6 opacity-5 flex gap-4 text-emerald-800">
          <BookOpen size={160} />
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 relative z-10">
          {/* Avatar Area styled like Roman bust or medal */}
          <div className="relative">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-stone-950 flex items-center justify-center shadow-2xl border-4 border-stone-100 ring-4 ring-emerald-800/20 shrink-0">
              <img 
                src="images/dummy-003-museum-vor-fruehgeschichte.jpg" 
                alt="Flavius Secundus Pulcher" 
                className="w-full h-full object-contain p-1"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-stone-900 text-[10px] sm:text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md leading-none border-2 border-white">
              Guide
            </div>
          </div>

          <div className="text-center md:text-left flex-1">
            <span className="inline-block px-3 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-extrabold uppercase tracking-widest rounded-full mb-3 border border-emerald-200">
              Antike Expertise
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight leading-none mb-2 font-serif">
              Flavius Secundus Pulcher
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm font-medium uppercase tracking-wider mb-3">
              Kaiserlicher Feldvermesser & Euer Archäologischer Travelguide
            </p>
            <p className="text-stone-600 max-w-2xl text-xs sm:text-sm leading-relaxed font-normal">
              "Wer die Gegenwart begreifen will, muss die Pfade der Ahnen kennen. Ich stehe euch zur Seite, um euer Abenteuer durch die Jahrtausende zu lenken – sei es über anspruchsvolle Keltengipfel oder zu prachtvollen römischen Villenbädern."
            </p>
          </div>
        </div>
      </motion.div>

      {/* TAB SELECTOR */}
      <div className="flex gap-4 border-b border-stone-200/60 pb-1 mb-8">
        <button
          onClick={() => setActiveTab('qa')}
          className={`flex items-center gap-2 pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider relative transition-colors ${
            activeTab === 'qa' ? 'text-emerald-800 font-extrabold' : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          <MessageSquare size={16} />
          Frag Flavius (Wissensschatz & Navigation)
          {activeTab === 'qa' && (
            <motion.div layoutId="guideActiveTab" className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-800 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('planner')}
          className={`flex items-center gap-2 pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider relative transition-colors ${
            activeTab === 'planner' ? 'text-emerald-800 font-extrabold' : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          <Compass size={16} />
          Wegefinder (Planer)
          {activeTab === 'planner' && (
            <motion.div layoutId="guideActiveTab" className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-800 rounded-full" />
          )}
        </button>
      </div>

      {/* TAB CONTENT WITH ANIMATIONS */}
      <AnimatePresence mode="wait">
        {activeTab === 'planner' ? (
          <motion.div
            key="planner-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* PLANNING STEPS SCREEN */}
            {plannerStep === 1 && (
              <div className="glass-panel p-6 sm:p-10 rounded-3xl bg-white shadow-xl">
                <div className="max-w-2xl mb-8">
                  <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 leading-none inline-block mb-3">
                    Schritt 1 von 4
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mb-2">
                    Welche Epoche weckt deinen Entdeckergeist am meisten?
                  </h2>
                  <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
                    Wähle ein geschichtliches Fundament für deine Wanderung. Ob geheimnisvolle Keltensteine, straff geplante Römerstraßen oder mittelalterliche Trutzburgen.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 'Eisenzeit', title: 'Keltische Eisenzeit', desc: 'Sichere Festungsmauern auf Bergkuppen, Fürstengräber mit üppigem Goldschmuck.', icon: '🛡️', color: 'border-amber-400 hover:bg-amber-50/30' },
                    { id: 'Römerzeit', title: 'Römische Kaiserzeit', desc: 'Spaziere auf asphaltartigen Viae, bestaune herrschaftliche Landgüter & Handwerksorte.', icon: '🏛️', color: 'border-red-400 hover:bg-red-50/30' },
                    { id: 'Mittelalter', title: 'Mittelalterliche Wehrkraft', desc: 'Ritterburgen, Grenzzinnen auf steilen Sandsteinfelsen & barocke Festungen.', icon: '🏰', color: 'border-stone-400 hover:bg-stone-50/30' },
                    { id: 'Mix', title: 'Bunter Epochen-Mix', desc: 'Ideal, wenn du dich nicht festlegen magst und Menhire mit Keltenndörfern kreuzen willst.', icon: '🗺️', color: 'border-emerald-400 hover:bg-emerald-50/30' }
                  ].map(era => (
                    <button
                      key={era.id}
                      onClick={() => {
                        setSelectedEra(era.id as any);
                        setPlannerStep(2);
                      }}
                      className={`p-5 rounded-2xl border text-left transition-all duration-300 hover:scale-[1.01] hover:shadow-md cursor-pointer ${
                        selectedEra === era.id ? 'bg-emerald-50/60 border-emerald-800 ring-2 ring-emerald-800/10' : 'bg-stone-50 border-stone-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{era.icon}</span>
                        <h3 className="font-bold text-stone-900 text-base">{era.title}</h3>
                      </div>
                      <p className="text-stone-500 text-xs leading-relaxed">{era.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {plannerStep === 2 && (
              <div className="glass-panel p-6 sm:p-10 rounded-3xl bg-white shadow-xl">
                <div className="max-w-2xl mb-8">
                  <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 leading-none inline-block mb-3">
                    Schritt 2 von 4
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mb-2">
                    Wie stramm stehen deine Füße im Futter? (Marschbereitschaft)
                  </h2>
                  <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
                    Wähle die passende Distanz und Schwierigkeit für deinen Ausflug. Keine Scham, selbst Halbtages-Expeditionen bergen prächtige Funde!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'Leicht', title: 'Spaziergänger', range: 'Bis 7 km', desc: 'Flache, breite Erlebniswege. Ideal für Gemütliche oder Ausflüge mit geringer Last.', icon: '🚶' },
                    { id: 'Mittel', title: 'Wackere Wanderer', range: '7 - 12 km', desc: 'Sanfte Hügel, teils schmalere Pfade. Die goldene Mitte der saarländischen Pfade.', icon: '🥾' },
                    { id: 'Schwer', title: 'Eiserner Legionär', range: 'Über 12 km / Radweg', desc: 'Lange Belastungen, kernige Anstiege auf Bergrücken oder weite Rad-Tagestouren.', icon: '🚴' }
                  ].map(lvl => (
                    <button
                      key={lvl.id}
                      onClick={() => {
                        setSelectedFitness(lvl.id as any);
                        setPlannerStep(3);
                      }}
                      className={`p-6 rounded-2xl border text-left transition-all duration-300 hover:scale-[1.01] hover:shadow-md cursor-pointer ${
                        selectedFitness === lvl.id ? 'bg-emerald-50/60 border-emerald-800 ring-2 ring-emerald-800/10' : 'bg-stone-50 border-stone-200'
                      }`}
                    >
                      <div className="text-3xl mb-3">{lvl.icon}</div>
                      <div className="flex items-baseline justify-between mb-2">
                        <h3 className="font-bold text-stone-900 text-base">{lvl.title}</h3>
                        <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded leading-none font-mono">{lvl.range}</span>
                      </div>
                      <p className="text-stone-500 text-xs leading-relaxed">{lvl.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="mt-8 flex justify-between items-center pt-4 border-t border-stone-100">
                  <button
                    onClick={() => setPlannerStep(1)}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-stone-850 flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw size={14} /> Zurück
                  </button>
                </div>
              </div>
            )}

            {plannerStep === 3 && (
              <div className="glass-panel p-6 sm:p-10 rounded-3xl bg-white shadow-xl">
                <div className="max-w-2xl mb-8">
                  <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 leading-none inline-block mb-3">
                    Schritt 3 von 4
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mb-2">
                    Mit welcher Begleitung ziehst du durch das Geländ?
                  </h2>
                  <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
                    Die Erlebnisse entfalten sich je nach Gruppe unterschiedlich. Flavius kümmert sich um die passende Dynamik.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'Solo', title: 'Solo-Eremit / Geistreich', desc: 'Ruhe, Kontemplation, viel ungestörte Natur & historisches Innehalten an Kultpfaden.', icon: <User size={24} className="text-blue-700" /> },
                    { id: 'Group', title: 'Die Legion (Mit Freunden)', desc: 'Geselliger Austausch, Picknick an prächtigen Aussichtspunkten & historischer Spurensuche.', icon: <Users size={24} className="text-amber-700" /> },
                    { id: 'Family', title: 'Junge Gallier (Familie)', desc: 'Spannende, geschlossene Wehranlagen mit viel Platz zum Klettern und haptischen Objekten zum Staunen.', icon: <Footprints size={24} className="text-emerald-700" /> }
                  ].map(companion => (
                    <button
                      key={companion.id}
                      onClick={() => {
                        setSelectedCompanion(companion.id as any);
                        setPlannerStep(4);
                      }}
                      className={`p-6 rounded-2xl border text-left transition-all duration-300 hover:scale-[1.01] hover:shadow-md cursor-pointer ${
                        selectedCompanion === companion.id ? 'bg-emerald-50/60 border-emerald-800 ring-2 ring-emerald-800/10' : 'bg-stone-50 border-stone-200'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center mb-4">
                        {companion.icon}
                      </div>
                      <h3 className="font-bold text-stone-900 text-base mb-1.5">{companion.title}</h3>
                      <p className="text-stone-500 text-xs leading-relaxed">{companion.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="mt-8 flex justify-between items-center pt-4 border-t border-stone-100">
                  <button
                    onClick={() => setPlannerStep(2)}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-stone-850 flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw size={14} /> Zurück
                  </button>
                </div>
              </div>
            )}

            {plannerStep === 4 && (
              <div className="glass-panel p-6 sm:p-10 rounded-3xl bg-white shadow-xl">
                <div className="max-w-2xl mb-8">
                  <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 leading-none inline-block mb-3">
                    Schritt 4 von 4
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mb-2">
                    Worauf liegt dein Hauptaugenmerk?
                  </h2>
                  <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
                    Setze die finale Schattierung für Flavius\' geodeätische Auswertung.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'Nature', title: 'Tiefe Wälder & Stille', desc: 'Atemberaubende Aussichtspunkte oberhalb der wilden Flussläufe & tiefe Pfade im Biosphärenpark Bliesgau.', icon: '🌲' },
                    { id: 'Culture', title: 'Museen & Rekonstruktionen', desc: 'Direktes Berühren von Geschichte! Römische Originalstraßen, Tempelbezirke und prunkvolle Fundstätten.', icon: '🏺' },
                    { id: 'Adventure', title: 'Abenteuer & Klettern', desc: 'Stramme Abschnitte, Klettern auf urigen Steilhängen & grandiose Landmarken.', icon: '🧗' }
                  ].map(focus => (
                    <button
                      key={focus.id}
                      onClick={() => {
                        setSelectedFocus(focus.id as any);
                        setPlannerStep('result');
                      }}
                      className={`p-6 rounded-2xl border text-left transition-all duration-300 hover:scale-[1.01] hover:shadow-md cursor-pointer ${
                        selectedFocus === focus.id ? 'bg-emerald-50/60 border-emerald-800 ring-2 ring-emerald-800/10' : 'bg-stone-50 border-stone-200'
                      }`}
                    >
                      <div className="text-3xl mb-3">{focus.icon}</div>
                      <h3 className="font-bold text-stone-900 text-base mb-1.5">{focus.title}</h3>
                      <p className="text-stone-500 text-xs leading-relaxed">{focus.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="mt-8 flex justify-between items-center pt-4 border-t border-stone-100">
                  <button
                    onClick={() => setPlannerStep(3)}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-stone-850 flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw size={14} /> Zurück
                  </button>
                </div>
              </div>
            )}

            {/* PLANNER EVALUATION / RESULT DISPLAY */}
            {plannerStep === 'result' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                {/* Eval text from Flavius in high-craft stone theme */}
                <div className="glass-panel p-6 sm:p-10 rounded-3xl bg-emerald-950 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5 text-emerald-100">
                    <Compass size={220} />
                  </div>
                  
                  <span className="inline-block px-2.5 py-0.5 bg-amber-500/20 text-amber-300 text-[9px] font-extrabold uppercase tracking-widest rounded mb-4 border border-amber-500/30">
                    Auswertung beendet
                  </span>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug font-serif">
                      Flavius\' Geodätische Empfehlung
                    </h2>
                    {isSpeechSupported && (
                      <button
                        onClick={() => {
                          const eraLabel = selectedEra === 'Mix'
                            ? (language === 'de' ? 'Epochen-Mix' : language === 'en' ? 'Epoch Mix' : language === 'fr' ? 'mélange d\'époques' : 'tijdperken-mix')
                            : selectedEra;
                          const fitnessLabelMap = {
                            de: { Leicht: 'Leicht', Mittel: 'Mittel', Schwer: 'Schwer' },
                            en: { Leicht: 'Gentle', Mittel: 'Moderate', Schwer: 'Strenuous' },
                            fr: { Leicht: 'Facile', Mittel: 'Moyen', Schwer: 'Difficile' },
                            nl: { Leicht: 'Gemakkelijk', Mittel: 'Gemiddeld', Schwer: 'Zwaar' }
                          };
                          const fitnessLabel = selectedFitness ? (fitnessLabelMap[language]?.[selectedFitness] || selectedFitness) : '';
                          const textToSpeak = getTranslation('guide.speakRecommendation', language)
                            .replace('{era}', eraLabel || '')
                            .replace('{fitness}', fitnessLabel)
                            .replace('{name}', recommendation.tour.name)
                            .replace('{description}', recommendation.tour.description);
                          speak(textToSpeak, 'recommendation');
                        }}
                        className={`px-5 py-3 rounded-2xl text-sm font-black uppercase tracking-wider flex items-center gap-2.5 transition-all duration-300 active:scale-95 cursor-pointer shadow-lg border ${
                          speakingMessageId === 'recommendation'
                            ? 'bg-amber-500 border-amber-400 text-stone-900 animate-pulse scale-[1.02]'
                            : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 border-amber-400 text-stone-900 shadow-amber-900/20'
                        }`}
                        title={speakingMessageId === 'recommendation' ? getTranslation('btn.stopSpeak', language) : getTranslation('btn.flaviusSpeak', language)}
                      >
                        {speakingMessageId === 'recommendation' ? (
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
                    )}
                  </div>
                  
                  <p className="text-sm text-stone-300 font-serif italic mb-6 leading-relaxed max-w-3xl">
                    "Per Jovem! Ich habe meine Tabula Peutingeriana befragt, den Sonnenstand genommen und eure Wünsche verrechnet. Für eure Sehnsucht nach der Epoche <span className="text-amber-400 font-bold font-sans not-italic bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">{selectedEra === 'Mix' ? 'Epochen-Mix' : selectedEra}</span> bei einer steten Marschstärke <span className="text-amber-400 font-bold font-sans not-italic bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">{selectedFitness}</span> empfehle ich euch folgenden ruhmreichen Pfad im Saarpfalz-Raum..."
                  </p>

                  {/* Recommendation Card */}
                  <div className="bg-white text-stone-900 rounded-2xl p-6 shadow-2xl flex flex-col lg:flex-row gap-6 items-stretch border border-stone-200">
                    {/* Tour image */}
                    <div className="lg:w-1/3 min-h-[140px] rounded-xl overflow-hidden relative shadow-md">
                      <img 
                        src={recommendation.tour.imageUrl} 
                        alt={recommendation.tour.name}
                        onClick={onNavigateToTours}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 bg-stone-900/85 text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                        {recommendation.tour.difficulty}
                      </div>
                    </div>

                    {/* Tour data details */}
                    <div className="flex-1 flex flex-col justify-between text-left">
                      <div>
                        <span className="text-[10px] font-black uppercase text-indigo-700 tracking-widest block mb-1">
                          Empfohlener Wanderweg
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold text-stone-900 leading-tight mb-2">
                          {recommendation.tour.name}
                        </h3>
                        <p className="text-stone-500 text-xs sm:text-sm leading-relaxed mb-4">
                          {recommendation.tour.description}
                        </p>
                      </div>

                      {/* Stat badges */}
                      <div className="flex flex-wrap gap-4 pt-4 border-t border-stone-100">
                        <div className="flex items-center gap-1.5 text-stone-700">
                          <Footprints size={14} className="text-emerald-700" />
                          <span className="text-xs font-bold font-mono">{recommendation.tour.distance} km</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-stone-700">
                          <Clock size={14} className="text-emerald-700" />
                          <span className="text-xs font-bold font-mono">{recommendation.tour.duration}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-stone-700">
                          <Navigation size={14} className="text-emerald-700" />
                          <span className="text-xs font-bold font-mono">+{recommendation.tour.elevationUp} Hm</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons for recommended tour */}
                  <div className="mt-8 flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/10">
                    <button
                      onClick={() => {
                        onSelectTour(recommendation.tour.id);
                        onNavigateToTours();
                        window.scrollTo(0, 0);
                      }}
                      className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Map size={14} /> Detaillierte Tour-Mappe öffnen
                    </button>
                    <button
                      onClick={handleResetPlanner}
                      className="px-5 py-3 border border-white/20 hover:border-white/50 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw size={14} /> Neu berechnen
                    </button>
                  </div>
                </div>

                {/* Grounding Landmarks Along the Recommended Route */}
                {recommendation.sites.length > 0 && (
                  <div className="glass-panel p-6 sm:p-10 rounded-3xl bg-white shadow-lg space-y-6">
                    <h3 className="text-lg font-black text-stone-900 uppercase tracking-widest border-b border-stone-200 pb-2 font-serif">
                      📍 Flavius\' Empfohlene Zwischenstopps am Wegesrand
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {recommendation.sites.map(site => (
                        <div 
                          key={site.id} 
                          className="border border-stone-200/60 rounded-2xl overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between"
                        >
                          <div>
                            <div className="h-36 overflow-hidden relative">
                              <img 
                                src={site.imageUrl} 
                                alt={site.name} 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-800 text-white rounded text-[8px] font-black uppercase tracking-wider">
                                {site.era}
                              </div>
                            </div>
                            <div className="p-4">
                              <h4 className="font-bold text-stone-900 text-sm leading-tight mb-2 truncate">
                                {site.name}
                              </h4>
                              <p className="text-stone-500 text-[11px] leading-relaxed line-clamp-3">
                                {site.description}
                              </p>
                            </div>
                          </div>
                          
                          <div className="p-4 pt-0 flex gap-2">
                            <button
                              onClick={() => {
                                onSelectSite(site);
                                window.scrollTo(0, 0);
                              }}
                              className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 hover:text-emerald-950 flex items-center gap-1 transition-all flex-1 cursor-pointer"
                            >
                              Details <ArrowRight size={10} />
                            </button>
                            <button
                              onClick={() => {
                                onNavigateToMap(site);
                                window.scrollTo(0, 0);
                              }}
                              className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400 hover:text-stone-850 flex items-center gap-1 transition-all cursor-pointer"
                            >
                              Auf Karte <MapPin size={10} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Flavius' Camp Tips (Marschgepäck-Tipps) */}
                <div className="bg-amber-50/50 border border-amber-200 rounded-3xl p-6 sm:p-8 text-stone-850 bg-white">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 shrink-0 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm sm:text-base mb-2">
                        Flavius\' Marschgepäck-Tipps für diese Tour
                      </h4>
                      <ul className="space-y-2 text-xs sm:text-sm list-disc pl-4 text-stone-600">
                        {recommendation.tour.id === 'tour-otzenhausen' && (
                          <>
                            <li><strong>Schuhwerk:</strong> Der Anstieg zum Dollberg hat steile Schotterhalden. Tragt unbedingt feste Knöchel-Wanderschuhe. Römische Marschsandalen rutschen hier weg!</li>
                            <li><strong>Wasservorrat:</strong> Auf dem Bergkamm gibt es keine Brunnenstuben. Nehmt mindestens 1,5 Liter kühles Wasser pro Legionär mit.</li>
                            <li><strong>Für Kinder:</strong> Der Spiel- und Forscherbereich am nahegelegenen keltischen Rekonstruktionsndorf beim Parkplatz ist ein Traum. Plant dort mindestens 1 Stunde Puffer ein!</li>
                          </>
                        )}
                        {recommendation.tour.id === 'tour-bliesgau' && (
                          <>
                            <li><strong>Ausrüstung:</strong> Der Weg hat sonnige, offene Abschnitte auf Feldterrassen. Sonnenhut und römische Sonnenöl-Salben dringend empfohlen!</li>
                            <li><strong>Kulturzeit:</strong> Am Anfang oder Ende liegt das Museum in Bliesbruck-Reinheim. Das begehbare Hügelgrab der Fürstin müsst ihr euch unbedingt ansehen. Der Eintritt lohnt im Detail.</li>
                            <li><strong>Einkehrstopp:</strong> Im Parkareal gibt es wunderbare Rastbänke für Proviant. Eine Packung Nüsse bringt altertümliche Energie.</li>
                          </>
                        )}
                        {recommendation.tour.id === 'tour-mandelbachtal' && (
                          <>
                            <li><strong>Wegbeschaffenheit:</strong> Hervorragend ausgebauter, schattiger Waldweg, den selbst junge Rekruten (Kinder) und altersschwache Senatoren locker bewältigen.</li>
                            <li><strong>Mystischer Halt:</strong> Der Gollenstein Menhir am Rande des Pfades ist der größte vorgeschichtliche Hinkelstein Mitteleuropas. Berührt die jahrtausendealte Rinde – sie gibt Kraft!</li>
                          </>
                        )}
                        {recommendation.tour.id === 'tour-limberg' && (
                          <>
                            <li><strong>Geschichte:</strong> Auf der Teufelsburg und dem Limbergrücken erfahrt ihr viel über Befestigungswehrwerke. Taschenlampe für finstere Schlosskeller empfehle ich gern!</li>
                            <li><strong>Pfadverlauf:</strong> Die Hangpfade können nach Regen rutischig sein. Geht mit wachem Tritt und haltzsuchendem Stock voran.</li>
                          </>
                        )}
                        {recommendation.tour.id === 'tour-blies-cycling' && (
                          <>
                            <li><strong>Fortbewegung:</strong> Dieser Radweg ist asphaltiert und flach. Ideal für schnellen Vorwärtsmarsch mit zweirädrigen Drahteseln.</li>
                            <li><strong>Schwarzenacker Besuch:</strong> Zieht am Römermuseum Homburg-Schwarzenacker unbedingt eure Schuhe aus und lauft ein paar Schritte auf der echten römischen Pflasterstraße aus dem 2. Jahrhundert. Atemberaubendes Gefühl!</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          /* CHAT / QA INTERACTIVE DATABASE TAB */
          <motion.div
            key="qa-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch"
          >
            {/* Quick Questions board Column */}
            <div className="lg:col-span-1 space-y-4 flex flex-col justify-start">
              <h3 className="text-sm font-black text-stone-900 uppercase tracking-[0.22em] border-b border-stone-200 pb-2 flex items-center gap-1.5 font-serif">
                <HelpCircle size={15} className="text-emerald-700" /> Vorbereitete Fragen an Flavius
              </h3>
              <p className="text-stone-500 text-xs leading-relaxed mb-2">
                Klickt auf eine Frage, um sofort eine historisch exakte, atmosphärische Antwort unseres römischen Geographen zu erhalten und zu den Seiten geführt zu werden:
              </p>
              
              <div className="space-y-2">
                {preBakedQuestions.map((fb, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleActionClick({ label: fb.q, chatTrigger: fb.trigger })}
                    className="w-full text-left p-3.5 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-700/40 border border-stone-200 rounded-xl transition-all font-semibold text-xs text-stone-850 cursor-pointer flex items-start gap-2.5 shadow-xs"
                  >
                    <span className="text-emerald-800 text-sm mt-0.5">💬</span>
                    <span>{fb.q}</span>
                  </button>
                ))}
              </div>

              <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 flex gap-2 items-start mt-6">
                <Sparkles size={16} className="text-emerald-700 mt-0.5 shrink-0" />
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  <strong>Interaktives Chat-Feld:</strong> Gebt Wörter wie <strong>Funktion</strong>, <strong>Borg</strong>, <strong>Römer</strong>, <strong>Kelten</strong>, <strong>Grabhügel</strong>, <strong>Mittelalter</strong>, <strong>Speyer</strong>, <strong>Kinder</strong> oder <strong>Wein</strong> ein, um spannende Erläuterungen und weisende Aktionsknöpfe zu erhalten!
                </p>
              </div>
            </div>

            {/* Chat column */}
            <div className="lg:col-span-2 glass-panel rounded-3xl bg-white border border-stone-200/60 shadow-xl overflow-hidden flex flex-col h-[580px] justify-between">
              {/* Chat header bar */}
              <div className="bg-stone-900 p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-stone-950 flex items-center justify-center shadow">
                    <img 
                      src="images/dummy-003-museum-vor-fruehgeschichte.jpg" 
                      alt="Flavius Secundus Pulcher" 
                      className="w-full h-full object-contain p-0.5"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm tracking-tight font-serif">Geographischer Senat - Dialogkanal</h4>
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block leading-none">Flavius Pulcher ist online</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-white/10 rounded-md text-[10px] font-bold tracking-wider uppercase">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </div>
              </div>

              {/* Chat bubbles area */}
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-stone-50/40 custom-scrollbar">
                {chatHistory.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl p-4 shadow-xs text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-emerald-800 text-white rounded-tr-none' 
                        : 'bg-white border border-stone-200/80 text-stone-850 rounded-tl-none font-serif relative'
                    }`}>
                      {msg.sender === 'flavius' && (
                        <div className="flex items-center justify-between gap-4 mb-3 pb-2 border-b border-stone-100">
                          <span className="block text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 font-sans flex items-center gap-1">
                            🏛️ Flavius Secundus Pulcher
                          </span>
                          {isSpeechSupported && (
                            <button
                              onClick={() => speak(msg.text, i)}
                              className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer border flex items-center gap-2 shadow-xs active:scale-95 ${
                                speakingMessageId === i
                                  ? 'bg-amber-500 border-amber-400 text-stone-900 animate-pulse font-black shadow-md'
                                  : 'bg-amber-50 hover:bg-amber-500 border-amber-200 hover:border-amber-400 text-amber-800 hover:text-stone-900 shadow-xs'
                              }`}
                              title={speakingMessageId === i ? getTranslation('btn.stopSpeak', language) : getTranslation('btn.speak', language)}
                            >
                              {speakingMessageId === i ? (
                                <>
                                  <VolumeX size={14} className="shrink-0" />
                                  <span>⏹️ {getTranslation('btn.stop', language)}</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 size={14} className="shrink-0 animate-pulse" />
                                  <span>🔊 {getTranslation('btn.speak', language)}</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      )}
                      
                      <div className="whitespace-pre-line leading-relaxed">
                        {msg.text}
                      </div>

                      {/* ACTIONS RENDERER */}
                      {msg.sender === 'flavius' && msg.actions && msg.actions.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-stone-100">
                          {msg.actions.map((act, index) => (
                            <button
                              key={index}
                              onClick={() => handleActionClick(act)}
                              className="px-3 py-2 bg-emerald-50 hover:bg-emerald-800 hover:text-white border border-emerald-800/20 text-emerald-800 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1 shadow-sm uppercase tracking-wider"
                            >
                              <span>{act.label}</span>
                              <ArrowRight size={12} />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Chat input box */}
              <div className="p-4 border-t border-stone-200/80 bg-white">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendChat();
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Stellt Flavius eine Frage zu Epochen oder App-Funktionen..."
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-stone-850 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 placeholder-stone-400"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 bg-stone-900 hover:bg-emerald-900 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-colors cursor-pointer"
                  >
                    Senden
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
