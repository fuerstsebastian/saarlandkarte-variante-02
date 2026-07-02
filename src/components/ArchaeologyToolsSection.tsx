import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Hammer, 
  Ruler, 
  Radar, 
  Camera, 
  RotateCcw, 
  Compass, 
  Activity, 
  Eye, 
  ChevronRight, 
  Cpu, 
  Layers, 
  Target, 
  Sparkles, 
  Database,
  ArrowRight,
  Crosshair,
  Wifi,
  Scan,
  RefreshCw
} from 'lucide-react';
import { Language } from '../data/translations';

interface ArchaeologyToolsSectionProps {
  language: Language;
}

const LOCAL_TRANSLATIONS = {
  de: {
    sectionTitle: 'Werkzeuge & Methoden der modernen Archäologie',
    sectionSubtitle: 'Interaktive Werkstatt: Testen Sie die High-Tech-Methoden der saarländischen Archäologie',
    tabTrowel: 'Kelle & Vermessung',
    tabGeomagnetics: 'Geomagnetik & Prospektion',
    tabDrone: 'Drohnen & Photogrammetrie',
    
    // Trowel Tab
    trowelTitle: 'Präzision bei der Grabung: Kelle und Tachymeter',
    trowelDesc: 'Die Archäologie beginnt mit der Freilegung. Mit der Kelle legen Sie Funde vorsichtig frei. Mit dem Tachymeter (Vermessungsgerät) messen Sie die Funde millimetergenau ein, um ihren Fundzusammenhang dreidimensional zu dokumentieren.',
    toolSelect: 'Werkzeug wählen:',
    toolTrowel: 'Kelle (Freilegen)',
    toolTachymeter: 'Tachymeter (Einmessen)',
    soilGridTitle: 'Ausgrabungsfeld (Klicken zum Ausgraben oder Einmessen)',
    dirtStatusClean: 'Freigelegt',
    dirtStatusLayer: 'Erdschicht {level}',
    measured: 'Eingemessen!',
    coordinates: 'Koord.',
    findLogTitle: 'Fundbuch (Eingemessene Funde)',
    findLogEmpty: 'Noch keine Funde eingemessen. Nutze zuerst die Kelle zum Freilegen und dann das Tachymeter!',
    artifactCoin: 'Römische Bronzemünze',
    artifactRing: 'Keltischer Goldreif',
    artifactSherd: 'Römische Tonscherbe',
    resetGrid: 'Neue Grabung im Feld',
    successTrowel: 'Klasse! Du hast das Objekt freigelegt. Wähle nun das Tachymeter, um es einzumessen.',
    successTachy: 'Hervorragend! Das Objekt wurde digital erfasst und im Fundbuch eingetragen.',

    // Geomagnetics Tab
    geoTitle: 'Zerstörungsfreier Blick: Geomagnetik',
    geoDesc: 'Geomagnetische Sonden messen winzige Abweichungen im Erdmagnetfeld, die durch im Boden verborgene Strukturen (wie verbrannte Mauern, Gräben oder Öfen) verursacht werden. So können wir Fundstellen wie Schwarzenacker kartieren, ohne zu graben.',
    btnStartScan: 'Geomagnetischen Scan starten',
    scanning: 'Scan läuft...',
    scanned: 'Scan abgeschlossen!',
    scanGridInstructions: 'Bewege den Sensor über das Feld, um magnetische Anomalien zu analysieren:',
    probeReadout: 'Sensor-Echtzeitdaten',
    magneticFieldStrength: 'Magnetfeldstärke:',
    anomalyDetection: 'Anomalie-Erkennung:',
    interpretation: 'Interpretation:',
    interpGrass: 'Unauffälliger Mutterboden',
    interpWall: 'Steinmauer-Fundament (Römische Villa)',
    interpIron: 'Starke magnetische Anomalie (Eisenhaltiges Objekt)',
    interpHearth: 'Thermisches Signal (Antike Herdstelle)',
    noData: 'Sensor offline. Bitte starten Sie zuerst den Scan.',
    scanOverlayText: 'Klicken Sie auf "Scan starten", um das Feld geomagnetisch zu prospektieren.',

    // Drone Tab
    droneTitle: 'Aus der Luft: Drohnen-Photogrammetrie',
    droneDesc: 'Mithilfe von Drohnen erstellen wir hunderte hochauflösende Luftbilder. Die Photogrammetrie berechnet daraus dichte Punktwolken und schließlich fotorealistische, dreidimensionale Modelle, um Befunde millimetergenau zu dokumentieren.',
    step1: '1. Drohnen-Flug',
    step2: '2. Punktwolke',
    step3: '3. 3D-Modell',
    btnCapture: '8 Fotos aus der Luft aufnehmen',
    capturing: 'Fotos werden erfasst...',
    captured: '8 Luftaufnahmen erfolgreich gespeichert!',
    btnGeneratePoints: 'Punktwolke berechnen',
    generatingPoints: 'Berechne Punktwolke aus Fotodaten...',
    pointsGenerated: 'Punktwolke (320 Punkte) erfolgreich generiert!',
    btnApplyTexture: '3D-Modell texturieren',
    texturing: 'Berechne photorealistisches Mesh...',
    textured: '3D-Modell erfolgreich gerendert!',
    textureSlider: 'Lichtwinkel anpassen:',
    droneStatusReady: 'Drohne startbereit über dem Befund.',
    reconstructSuccess: 'Hervorragend! Du hast erfolgreich eine römische Amphore rekonstruiert.'
  },
  en: {
    sectionTitle: 'Tools & Methods of Modern Archaeology',
    sectionSubtitle: 'Interactive Workshop: Test the high-tech methods of Saarland archaeology',
    tabTrowel: 'Trowel & Surveying',
    tabGeomagnetics: 'Geomagnetics & Prospection',
    tabDrone: 'Drones & Photogrammetry',

    // Trowel Tab
    trowelTitle: 'Precision in the Dirt: Trowel and Total Station',
    trowelDesc: 'Archaeology begins with uncovering. Use the trowel to carefully expose finds. Use the total station (surveying instrument) to measure the finds with millimeter precision to document their three-dimensional context.',
    toolSelect: 'Select Tool:',
    toolTrowel: 'Trowel (Uncovering)',
    toolTachymeter: 'Total Station (Surveying)',
    soilGridTitle: 'Excavation Field (Click to dig or measure)',
    dirtStatusClean: 'Exposed',
    dirtStatusLayer: 'Soil layer {level}',
    measured: 'Measured!',
    coordinates: 'Coords',
    findLogTitle: 'Find Book (Measured Finds)',
    findLogEmpty: 'No finds measured yet. First use the trowel to uncover, then use the total station to measure!',
    artifactCoin: 'Roman Bronze Coin',
    artifactRing: 'Celtic Golden Torc',
    artifactSherd: 'Roman Pottery Sherd',
    resetGrid: 'Re-bury field',
    successTrowel: 'Great! You have exposed the object. Now select the Total Station to measure it.',
    successTachy: 'Excellent! The object has been digitally recorded and logged in the find book.',

    // Geomagnetics Tab
    geoTitle: 'Non-Destructive Insight: Geomagnetics',
    geoDesc: 'Geomagnetic probes measure tiny fluctuations in the Earth\'s magnetic field caused by structures hidden in the soil (such as burned walls, ditches, or ovens). This allows us to map sites like Schwarzenacker without digging.',
    btnStartScan: 'Start Geomagnetic Scan',
    scanning: 'Scanning...',
    scanned: 'Scan completed!',
    scanGridInstructions: 'Move the sensor over the field to analyze magnetic anomalies:',
    probeReadout: 'Sensor Real-Time Data',
    magneticFieldStrength: 'Magnetic field strength:',
    anomalyDetection: 'Anomaly detection:',
    interpretation: 'Interpretation:',
    interpGrass: 'Inconspicuous topsoil',
    interpWall: 'Stone wall foundation (Roman Villa)',
    interpIron: 'Strong magnetic anomaly (Ferrous object)',
    interpHearth: 'Thermal signal (Ancient hearth)',
    noData: 'Sensor offline. Please start the scan first.',
    scanOverlayText: 'Click "Start Scan" to geomagnetically prospect the field.',

    // Drone Tab
    droneTitle: 'From the Air: Drone Photogrammetry',
    droneDesc: 'Using drones, we take hundreds of high-resolution aerial photographs. Photogrammetry computes dense point clouds from them, and finally photorealistic, three-dimensional models to document features with millimeter precision.',
    step1: '1. Drone Flight',
    step2: '2. Point Cloud',
    step3: '3. 3D Model',
    btnCapture: 'Capture 8 Aerial Photos',
    capturing: 'Capturing photos...',
    captured: '8 aerial images successfully stored!',
    btnGeneratePoints: 'Calculate Point Cloud',
    generatingPoints: 'Computing point cloud from photo data...',
    pointsGenerated: 'Point cloud (320 points) successfully generated!',
    btnApplyTexture: 'Texture 3D Model',
    texturing: 'Computing photorealistic mesh...',
    textured: '3D model successfully rendered!',
    textureSlider: 'Adjust light angle:',
    droneStatusReady: 'Drone ready for takeoff over the feature.',
    reconstructSuccess: 'Excellent! You have successfully reconstructed a Roman amphora.'
  },
  fr: {
    sectionTitle: 'Outils et méthodes de l\'archéologie moderne',
    sectionSubtitle: 'Atelier interactif : Testez les méthodes de pointe de l\'archéologie sarroise',
    tabTrowel: 'Truelle et topographie',
    tabGeomagnetics: 'Géomagnétisme et prospection',
    tabDrone: 'Drones et photogrammétrie',

    // Trowel Tab
    trowelTitle: 'La précision dans la terre : Truelle et Tachéomètre',
    trowelDesc: 'L\'archéologie commence par le dégagement. Utilisez la truelle pour dégager délicatement les objets. Utilisez le tachéomètre (appareil de topographie) pour mesurer précisément au millimètre près l\'emplacement tridimensionnel des découvertes.',
    toolSelect: 'Choisir l\'outil :',
    toolTrowel: 'Truelle (Dégager)',
    toolTachymeter: 'Tachéomètre (Mesurer)',
    soilGridTitle: 'Chantier de fouilles (Cliquer pour creuser ou mesurer)',
    dirtStatusClean: 'Dégagé',
    dirtStatusLayer: 'Couche de terre {level}',
    measured: 'Mesuré !',
    coordinates: 'Coord.',
    findLogTitle: 'Journal des découvertes (Objets mesurés)',
    findLogEmpty: 'Aucun objet mesuré pour l\'instant. Utilisez d\'abord la truelle pour dégager, puis le tachéomètre pour mesurer !',
    artifactCoin: 'Monnaie romaine en bronze',
    artifactRing: 'Torque d\'or celtique',
    artifactSherd: 'Tesson de poterie romaine',
    resetGrid: 'Ensevelir à nouveau',
    successTrowel: 'Super ! Vous avez dégagé l\'objet. Sélectionnez maintenant le tachéomètre pour le mesurer.',
    successTachy: 'Excellent ! L\'objet a été enregistré numériquement dans le journal des découvertes.',

    // Geomagnetics Tab
    geoTitle: 'Regard non destructif : Le Géomagnétisme',
    geoDesc: 'Les sondes géomagnétiques mesurent les infimes variations du champ magnétique terrestre causées par des structures enfouies (murs en pierre, fossés ou foyers). Cela permet de cartographier des sites comme Schwarzenacker sans fouiller.',
    btnStartScan: 'Lancer le scan géomagnétique',
    scanning: 'Scan en cours...',
    scanned: 'Scan terminé !',
    scanGridInstructions: 'Déplacez le capteur sur le terrain pour analyser les anomalies magnétiques :',
    probeReadout: 'Données du capteur en direct',
    magneticFieldStrength: 'Champ magnétique :',
    anomalyDetection: 'Détection d\'anomalie :',
    interpretation: 'Interprétation :',
    interpGrass: 'Terre végétale homogène',
    interpWall: 'Fondations de mur en pierre (Villa romaine)',
    interpIron: 'Forte anomalie magnétique (Objet ferreux)',
    interpHearth: 'Signal thermique (Foyer antique)',
    noData: 'Capteur hors ligne. Veuillez d\'abord lancer le scan.',
    scanOverlayText: 'Cliquez sur "Lancer le scan" pour prospecter magnétiquement le terrain.',

    // Drone Tab
    droneTitle: 'Depuis le ciel : Photogrammétrie par drone',
    droneDesc: 'À l\'aide de drones, nous prenons des centaines de photos aériennes haute résolution. La photogrammétrie calcule des nuages de points denses à partir de ces images pour concevoir des modèles 3D photoréalistes d\'une précision millimétrique.',
    step1: '1. Vol de drone',
    step2: '2. Nuage de points',
    step3: '3. Modèle 3D',
    btnCapture: 'Prendre 8 photos aériennes',
    capturing: 'Prise de photos...',
    captured: '8 photos aériennes enregistrées avec succès !',
    btnGeneratePoints: 'Calculer le nuage de points',
    generatingPoints: 'Calcul du nuage de points à partir des photos...',
    pointsGenerated: 'Nuage de points (320 points) généré avec succès !',
    btnApplyTexture: 'Appliquer la texture 3D',
    texturing: 'Calcul du maillage photoréaliste...',
    textured: 'Modèle 3D rendu avec succès !',
    textureSlider: 'Ajuster l\'angle de lumière :',
    droneStatusReady: 'Drone prêt au décollage au-dessus du vestige.',
    reconstructSuccess: 'Excellent ! Vous avez reconstitué avec succès une amphore romaine.'
  },
  nl: {
    sectionTitle: 'Gereedschappen & methoden van moderne archeologie',
    sectionSubtitle: 'Interactieve workshop: Test de hightech-methoden van de Saarlandse archeologie',
    tabTrowel: 'Troffel & Landmeten',
    tabGeomagnetics: 'Geomagnetisme & Prospectie',
    tabDrone: 'Drones & Fotogrammetrie',

    // Trowel Tab
    trowelTitle: 'Precisie in de Modder: Troffel en Total Station',
    trowelDesc: 'Archeologie begint met het blootleggen. Met de troffel legt u vondsten voorzichtig bloot. Met het total station (landmeettoestel) meet u de vondsten tot op de millimeter nauwkeurig in om de driedimensionale samenhang te documenteren.',
    toolSelect: 'Gereedschap selecteren:',
    toolTrowel: 'Troffel (Blootleggen)',
    toolTachymeter: 'Total Station (Inmeten)',
    soilGridTitle: 'Opgravingsveld (Klik om te graven of in te meten)',
    dirtStatusClean: 'Blootgelegd',
    dirtStatusLayer: 'Grondlaag {level}',
    measured: 'Ingemeten!',
    coordinates: 'Coord.',
    findLogTitle: 'Vondstenboek (Ingemeten vondsten)',
    findLogEmpty: 'Nog geen vondsten ingemeten. Gebruik eerst de troffel om bloot te leggen en daarna het total station om in te meten!',
    artifactCoin: 'Romeinse bronzen munt',
    artifactRing: 'Keltische gouden torque',
    artifactSherd: 'Romeinse aardwerkscherf',
    resetGrid: 'Veld opnieuw begraven',
    successTrowel: 'Klasse! Je hebt het object blootgelegd. Selecteer nu het total station om het in te meten.',
    successTachy: 'Uitstekend! Het object is digitaal geregistreerd en in het vondstenboek opgeslagen.',

    // Geomagnetics Tab
    geoTitle: 'Schadevrije blik: Geomagnetisme',
    geoDesc: 'Geomagnetische sondes meten minieme afwijkingen in het magnetisch veld van de aarde veroorzaakt door structuren in de grond (zoals muren, grachten of ovens). Zo kunnen we sites zoals Schwarzenacker in kaart brengen zonder te graven.',
    btnStartScan: 'Start geomagnetische scan',
    scanning: 'Scannen...',
    scanned: 'Scan voltooid!',
    scanGridInstructions: 'Beweeg de sensor over het veld om magnetische anomalieën te analyseren:',
    probeReadout: 'Sensor real-time gegevens',
    magneticFieldStrength: 'Magneetveldsterkte:',
    anomalyDetection: 'Anomaliedetectie:',
    interpretation: 'Interpretatie:',
    interpGrass: 'Onopvallende bovengrond',
    interpWall: 'Stenen muurfundering (Romeinse Villa)',
    interpIron: 'Sterke magnetische afwijking (Ijzerhoudend object)',
    interpHearth: 'Thermisch signaal (Antieke haardplaats)',
    noData: 'Sensor offline. Start eerst de scan.',
    scanOverlayText: 'Klik op "Start scan" om het veld geomagnetisch te prospecteren.',

    // Drone Tab
    droneTitle: 'Vanuit de lucht: Drone-fotogrammetrie',
    droneDesc: 'Met behulp van drones maken we honderden hoge-resolutie luchtfoto\'s. Fotogrammetrie berekent daaruit dichte puntwolken en uiteindelijk fotorealistische 3D-modellen om opgravingen tot op de millimeter nauwkeurig te documenteren.',
    step1: '1. Dronevlucht',
    step2: '2. Puntwolk',
    step3: '3. 3D-model',
    btnCapture: 'Neem 8 luchtfoto\'s op',
    capturing: 'Foto\'s opnemen...',
    captured: '8 luchtfoto\'s succesvol opgeslagen!',
    btnGeneratePoints: 'Bereken puntwolk',
    generatingPoints: 'Puntwolk berekenen uit fotogegevens...',
    pointsGenerated: 'Puntwolk (320 punten) succesvol gegenereerd!',
    btnApplyTexture: '3D-model textureren',
    texturing: 'Berekenen van fotorealistisch mesh...',
    textured: '3D-model succesvol gerenderd!',
    textureSlider: 'Lichtval aanpassen:',
    droneStatusReady: 'Drone klaar voor opstijgen boven de opgraving.',
    reconstructSuccess: 'Uitstekend! Je hebt met succes een Romeinse amfora gereconstrueerd.'
  }
};

export default function ArchaeologyToolsSection({ language }: ArchaeologyToolsSectionProps) {
  const [activeTab, setActiveTab] = useState<'trowel' | 'geomagnetics' | 'drone'>('trowel');
  const t = LOCAL_TRANSLATIONS[language] || LOCAL_TRANSLATIONS.de;

  // --- 1. Trowel Simulator State ---
  const [selectedTool, setSelectedTool] = useState<'trowel' | 'tachymeter'>('trowel');
  // 3x3 Grid
  // Indices:
  // 2 -> Coin, 4 -> Golden Ring, 6 -> Tonscherbe
  const [soilGrid, setSoilGrid] = useState<Array<{
    id: number;
    dirtLevel: number; // 3 to 0
    measured: boolean;
    artifact: 'coin' | 'ring' | 'sherd' | null;
  }>>([
    { id: 0, dirtLevel: 3, measured: false, artifact: null },
    { id: 1, dirtLevel: 3, measured: false, artifact: null },
    { id: 2, dirtLevel: 3, measured: false, artifact: 'coin' },
    { id: 3, dirtLevel: 3, measured: false, artifact: null },
    { id: 4, dirtLevel: 3, measured: false, artifact: 'ring' },
    { id: 5, dirtLevel: 3, measured: false, artifact: null },
    { id: 6, dirtLevel: 3, measured: false, artifact: 'sherd' },
    { id: 7, dirtLevel: 3, measured: false, artifact: null },
    { id: 8, dirtLevel: 3, measured: false, artifact: null },
  ]);
  const [findLog, setFindLog] = useState<Array<{
    name: string;
    coords: string;
    depth: string;
  }>>([]);
  const [trowelFeedback, setTrowelFeedback] = useState<string>('');

  const handleSoilCellClick = (index: number) => {
    const cell = soilGrid[index];
    if (selectedTool === 'trowel') {
      if (cell.dirtLevel > 0) {
        const newGrid = [...soilGrid];
        newGrid[index].dirtLevel -= 1;
        setSoilGrid(newGrid);
        
        if (newGrid[index].dirtLevel === 0 && newGrid[index].artifact) {
          setTrowelFeedback(t.successTrowel);
        } else {
          setTrowelFeedback('');
        }
      }
    } else if (selectedTool === 'tachymeter') {
      if (cell.dirtLevel === 0 && cell.artifact && !cell.measured) {
        const newGrid = [...soilGrid];
        newGrid[index].measured = true;
        setSoilGrid(newGrid);

        // Add to find book
        let name = '';
        let coords = '';
        let depth = '';
        if (cell.artifact === 'coin') {
          name = t.artifactCoin;
          coords = 'N 49° 29\' 47.4", E 6° 27\' 29.8"';
          depth = '-0.85 m';
        } else if (cell.artifact === 'ring') {
          name = t.artifactRing;
          coords = 'N 49° 08\' 06.0", E 7° 11\' 06.0"';
          depth = '-1.20 m';
        } else if (cell.artifact === 'sherd') {
          name = t.artifactSherd;
          coords = 'N 49° 16\' 51.6", E 7° 17\' 16.8"';
          depth = '-0.45 m';
        }

        setFindLog(prev => [...prev, { name, coords, depth }]);
        setTrowelFeedback(t.successTachy);
      }
    }
  };

  const handleResetTrowel = () => {
    setSoilGrid([
      { id: 0, dirtLevel: 3, measured: false, artifact: null },
      { id: 1, dirtLevel: 3, measured: false, artifact: null },
      { id: 2, dirtLevel: 3, measured: false, artifact: 'coin' },
      { id: 3, dirtLevel: 3, measured: false, artifact: null },
      { id: 4, dirtLevel: 3, measured: false, artifact: 'ring' },
      { id: 5, dirtLevel: 3, measured: false, artifact: null },
      { id: 6, dirtLevel: 3, measured: false, artifact: 'sherd' },
      { id: 7, dirtLevel: 3, measured: false, artifact: null },
      { id: 8, dirtLevel: 3, measured: false, artifact: null },
    ]);
    setFindLog([]);
    setTrowelFeedback('');
  };

  // --- 2. Geomagnetics State ---
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'completed'>('idle');
  const [scanProgress, setScanProgress] = useState(0);
  const [activeGeoCell, setActiveGeoCell] = useState<number | null>(null);

  // 5x5 Grid
  // Pre-configured magnetic map data
  // Values representing nT (nanotesla) deviations
  const geoMapData = [
    { nT: 0.2, type: 'grass' },  { nT: -0.5, type: 'grass' }, { nT: 25.4, type: 'wall' }, { nT: 0.1, type: 'grass' }, { nT: -0.2, type: 'grass' },
    { nT: -0.8, type: 'grass' }, { nT: 23.8, type: 'wall' },  { nT: 28.1, type: 'wall' }, { nT: 22.0, type: 'wall' },  { nT: 1.2, type: 'grass' },
    { nT: 120.5, type: 'iron' }, { nT: -0.3, type: 'grass' }, { nT: 26.5, type: 'wall' }, { nT: -0.4, type: 'grass' }, { nT: 35.8, type: 'hearth' },
    { nT: 0.5, type: 'grass' },  { nT: 24.3, type: 'wall' },  { nT: 27.2, type: 'wall' }, { nT: 25.1, type: 'wall' },  { nT: 0.8, type: 'grass' },
    { nT: -0.1, type: 'grass' }, { nT: 0.2, type: 'grass' },  { nT: 24.9, type: 'wall' }, { nT: 0.3, type: 'grass' },  { nT: -0.9, type: 'grass' },
  ];

  const handleStartScan = () => {
    setScanStatus('scanning');
    setScanProgress(0);
  };

  useEffect(() => {
    if (scanStatus === 'scanning') {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setScanStatus('completed');
            return 100;
          }
          return prev + 10;
        });
      }, 250);
      return () => clearInterval(interval);
    }
  }, [scanStatus]);

  const getGeoDetails = (index: number | null) => {
    if (index === null) return null;
    const data = geoMapData[index];
    let interp = t.interpGrass;
    if (data.type === 'wall') interp = t.interpWall;
    if (data.type === 'iron') interp = t.interpIron;
    if (data.type === 'hearth') interp = t.interpHearth;

    return {
      nT: data.nT,
      type: data.type,
      interp
    };
  };

  const geoDetails = getGeoDetails(activeGeoCell);

  // --- 3. Drone Photogrammetry State ---
  const [droneStep, setDroneStep] = useState<1 | 2 | 3>(1);
  const [droneActionState, setDroneActionState] = useState<'idle' | 'running' | 'done'>('idle');
  const [droneAngle, setDroneAngle] = useState(0);

  const handleDroneAction = () => {
    setDroneActionState('running');
    setTimeout(() => {
      setDroneActionState('done');
    }, 2000);
  };

  // Reset drone steps
  const handleResetDrone = () => {
    setDroneStep(1);
    setDroneActionState('idle');
  };

  return (
    <div id="archaeology-tools" className="w-full bg-stone-100/40 rounded-3xl border border-stone-200/60 p-6 md:p-10 my-16 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-stone-200/50 pb-6">
        <div>
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-[0.25em] block mb-1">
            {language === 'de' ? 'Forschung vor Ort' : language === 'en' ? 'Local Research' : language === 'fr' ? 'Recherche locale' : 'Lokaal onderzoek'}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight">
            {t.sectionTitle}
          </h2>
          <p className="text-stone-500 text-sm mt-1">
            {t.sectionSubtitle}
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-2 bg-stone-200/50 p-1.5 rounded-2xl shrink-0 border border-stone-200/30">
          <button
            onClick={() => setActiveTab('trowel')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'trowel' ? 'bg-white text-emerald-800 shadow-sm' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/30'}`}
          >
            <Hammer size={14} />
            {t.tabTrowel}
          </button>
          <button
            onClick={() => setActiveTab('geomagnetics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'geomagnetics' ? 'bg-white text-emerald-800 shadow-sm' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/30'}`}
          >
            <Radar size={14} />
            {t.tabGeomagnetics}
          </button>
          <button
            onClick={() => setActiveTab('drone')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'drone' ? 'bg-white text-emerald-800 shadow-sm' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/30'}`}
          >
            <Camera size={14} />
            {t.tabDrone}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* --- TAB 1: Trowel & Surveying --- */}
        {activeTab === 'trowel' && (
          <motion.div
            key="trowel-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100">
                    <Hammer size={16} />
                  </div>
                  <h3 className="font-bold text-stone-900 text-lg">{t.trowelTitle}</h3>
                </div>
                <p className="text-stone-600 text-sm leading-relaxed mb-6">
                  {t.trowelDesc}
                </p>

                {/* Tool Selection */}
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 mb-6">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-3">
                    {t.toolSelect}
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => { setSelectedTool('trowel'); setTrowelFeedback(''); }}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer ${selectedTool === 'trowel' ? 'border-emerald-800 bg-emerald-50/40 text-emerald-800' : 'border-stone-200 bg-white hover:border-stone-300 text-stone-600'}`}
                    >
                      <Hammer size={14} />
                      {t.toolTrowel}
                    </button>
                    <button
                      onClick={() => { setSelectedTool('tachymeter'); setTrowelFeedback(''); }}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer ${selectedTool === 'tachymeter' ? 'border-emerald-800 bg-emerald-50/40 text-emerald-800' : 'border-stone-200 bg-white hover:border-stone-300 text-stone-600'}`}
                    >
                      <Ruler size={14} />
                      {t.toolTachymeter}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                {/* Feedback Alert */}
                {trowelFeedback && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold mb-4 flex items-center gap-3"
                  >
                    <Sparkles className="text-emerald-700 shrink-0" size={16} />
                    <span>{trowelFeedback}</span>
                  </motion.div>
                )}

                <button
                  onClick={handleResetTrowel}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-stone-300 hover:bg-stone-100 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <RotateCcw size={14} />
                  {t.resetGrid}
                </button>
              </div>
            </div>

            {/* Soil Grid Simulator */}
            <div className="lg:col-span-4">
              <div className="bg-stone-900 p-4 rounded-3xl border border-stone-800 shadow-xl">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-3 text-center">
                  {t.soilGridTitle}
                </span>

                <div className="grid grid-cols-3 gap-2 aspect-square">
                  {soilGrid.map((cell, idx) => (
                    <button
                      key={cell.id}
                      onClick={() => handleSoilCellClick(idx)}
                      disabled={selectedTool === 'tachymeter' && cell.dirtLevel > 0}
                      className="relative rounded-2xl overflow-hidden aspect-square border border-stone-800 flex items-center justify-center transition-all group focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
                      style={{
                        backgroundColor: 
                          cell.dirtLevel === 3 ? '#543d2b' : // Deep loam
                          cell.dirtLevel === 2 ? '#6e513a' : // Mid loam
                          cell.dirtLevel === 1 ? '#8c6c53' : // Sandy silt
                          '#a88970' // Revealed ground color
                      }}
                    >
                      {/* Grid overlay lines */}
                      <div className="absolute inset-0 border border-stone-800/10 pointer-events-none"></div>

                      {/* Display Soil Layer Level */}
                      {cell.dirtLevel > 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-1 bg-stone-900/10 hover:bg-stone-900/0 transition-colors">
                          <span className="text-[9px] font-mono font-bold text-stone-200/70 drop-shadow-md">
                            {t.dirtStatusLayer.replace('{level}', String(cell.dirtLevel))}
                          </span>
                        </div>
                      )}

                      {/* Revealed Artifact */}
                      {cell.dirtLevel === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center p-2 bg-stone-100/10">
                          {cell.artifact === 'coin' && (
                            <div className="w-10 h-10 rounded-full bg-amber-600/40 border border-amber-500/80 shadow-md flex items-center justify-center relative">
                              <span className="text-amber-100 font-extrabold text-[9px]">AUREUS</span>
                              <div className="absolute inset-0 rounded-full border border-amber-400/20 animate-ping"></div>
                            </div>
                          )}
                          {cell.artifact === 'ring' && (
                            <div className="w-10 h-10 rounded-full border-4 border-amber-400 flex items-center justify-center relative shadow-lg">
                              <div className="w-6 h-6 rounded-full border-2 border-stone-800/20"></div>
                              <span className="absolute text-[8px] font-extrabold text-amber-100 font-mono drop-shadow-md">GOLD</span>
                            </div>
                          )}
                          {cell.artifact === 'sherd' && (
                            <div className="w-10 h-10 bg-orange-700/60 border border-orange-500 rounded-tr-3xl rounded-bl-3xl flex items-center justify-center shadow-md">
                              <span className="text-[7.5px] font-bold text-orange-100 leading-tight">TERRA</span>
                            </div>
                          )}
                          {!cell.artifact && (
                            <span className="text-[9px] text-stone-200/50 uppercase tracking-widest font-bold">
                              {t.dirtStatusClean}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Surveying Tachymeter laser target overlay */}
                      {cell.measured && (
                        <div className="absolute inset-0 bg-emerald-950/40 flex items-center justify-center">
                          <Crosshair className="text-emerald-400 animate-pulse" size={32} />
                          <span className="absolute bottom-1 right-1 text-[8px] font-mono text-emerald-300 font-bold bg-stone-900/80 px-1 rounded">
                            {t.measured}
                          </span>
                        </div>
                      )}

                      {/* Highlight border on hover if tool is valid */}
                      {selectedTool === 'trowel' && cell.dirtLevel > 0 && (
                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-400/40 pointer-events-none transition-colors"></div>
                      )}
                      {selectedTool === 'tachymeter' && cell.dirtLevel === 0 && cell.artifact && !cell.measured && (
                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-emerald-400 pointer-events-none transition-colors"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Findings Log Column */}
            <div className="lg:col-span-3">
              <div className="bg-white border border-stone-200 rounded-3xl p-5 h-full flex flex-col">
                <h4 className="font-bold text-stone-900 text-sm mb-4 border-b border-stone-100 pb-2 flex items-center gap-2">
                  <Database size={16} className="text-emerald-800" />
                  {t.findLogTitle}
                </h4>

                {findLog.length === 0 ? (
                  <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
                    <Ruler size={24} className="text-stone-300 mb-2" />
                    <p className="text-stone-400 text-xs leading-normal">
                      {t.findLogEmpty}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 overflow-y-auto max-h-[220px] flex-grow pr-1">
                    {findLog.map((log, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-stone-50 border border-stone-200/60 p-3 rounded-xl flex flex-col gap-1 shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-stone-800 text-[11px] leading-tight">
                            {log.name}
                          </span>
                          <span className="font-mono text-[8.5px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                            {log.depth}
                          </span>
                        </div>
                        <span className="font-mono text-[8px] text-stone-500 flex items-center gap-1 mt-0.5">
                          <Compass size={8} /> {t.coordinates}: {log.coords}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* --- TAB 2: Geomagnetics --- */}
        {activeTab === 'geomagnetics' && (
          <motion.div
            key="geomagnetics-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100">
                    <Radar size={16} />
                  </div>
                  <h3 className="font-bold text-stone-900 text-lg">{t.geoTitle}</h3>
                </div>
                <p className="text-stone-600 text-sm leading-relaxed mb-6">
                  {t.geoDesc}
                </p>

                {/* Scan Control Button */}
                <div className="space-y-3 mb-6">
                  {scanStatus === 'idle' && (
                    <button
                      onClick={handleStartScan}
                      className="w-full flex items-center justify-center gap-2 py-4 bg-stone-900 hover:bg-emerald-800 text-white font-bold rounded-2xl transition-all shadow-md text-sm cursor-pointer"
                    >
                      <Radar size={16} className="animate-pulse" />
                      {t.btnStartScan}
                    </button>
                  )}

                  {scanStatus === 'scanning' && (
                    <div className="w-full bg-stone-100 border border-stone-200 rounded-2xl p-4">
                      <div className="flex items-center justify-between text-xs font-bold text-stone-700 mb-2">
                        <span className="flex items-center gap-2">
                          <RefreshCw size={14} className="animate-spin text-emerald-800" />
                          {t.scanning}
                        </span>
                        <span>{scanProgress}%</span>
                      </div>
                      <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-800 h-full transition-all duration-200"
                          style={{ width: `${scanProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {scanStatus === 'completed' && (
                    <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-xs font-bold">
                        <Sparkles size={16} className="text-emerald-700" />
                        <span>{t.scanned}</span>
                      </div>
                      <button
                        onClick={handleStartScan}
                        className="px-3 py-1.5 bg-white border border-emerald-200 text-emerald-800 text-[10px] font-bold rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
                      >
                        {t.btnStartScan}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Grid instructions */}
              {scanStatus === 'completed' && (
                <p className="text-stone-500 text-xs leading-normal italic pl-1">
                  {t.scanGridInstructions}
                </p>
              )}
            </div>

            {/* Geomagnetic Scan Grid */}
            <div className="lg:col-span-4">
              <div className="bg-stone-900 p-5 rounded-3xl border border-stone-800 shadow-xl relative overflow-hidden">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-3 text-center">
                  PROSPEKTIONS-RASTER (SÜDAREAL)
                </span>

                <div className="grid grid-cols-5 gap-1.5 aspect-square relative">
                  {geoMapData.map((cell, idx) => (
                    <div
                      key={idx}
                      onMouseEnter={() => scanStatus === 'completed' && setActiveGeoCell(idx)}
                      onMouseLeave={() => setActiveGeoCell(null)}
                      onClick={() => scanStatus === 'completed' && setActiveGeoCell(idx)}
                      className="relative rounded-lg overflow-hidden aspect-square border border-stone-800/40 flex items-center justify-center transition-all cursor-crosshair"
                      style={{
                        backgroundColor: 
                          scanStatus !== 'completed'
                            ? '#2d5a27' // Solid grass green prior to scan
                            : cell.type === 'wall'
                            ? '#4b4b4b' // Anomaly (stone foundation wall)
                            : cell.type === 'iron'
                            ? '#0f0f0f' // Very high magnetic value
                            : cell.type === 'hearth'
                            ? '#8c3d1d' // Thermal feature (fireplace)
                            : '#7a8c71', // Standard scanned soil
                        opacity: scanStatus === 'scanning' ? 0.3 + (scanProgress / 140) : 1
                      }}
                    >
                      {/* Grid index label */}
                      <span className="absolute top-0.5 left-1 font-mono text-[6px] text-stone-300/30">
                        {String.fromCharCode(65 + Math.floor(idx / 5))}{(idx % 5) + 1}
                      </span>

                      {/* Highlight cursor on hover */}
                      {activeGeoCell === idx && (
                        <div className="absolute inset-0 border-2 border-amber-400 pointer-events-none z-10 flex items-center justify-center bg-amber-400/10">
                          <Target size={16} className="text-amber-400 animate-pulse" />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Non-scanned dark overlay */}
                  {scanStatus === 'idle' && (
                    <div className="absolute inset-0 bg-stone-950/85 flex flex-col items-center justify-center text-center p-6 rounded-2xl z-20 backdrop-blur-xs border border-stone-800">
                      <Radar size={32} className="text-stone-500 mb-2" />
                      <p className="text-stone-400 text-xs font-semibold leading-normal">
                        {t.scanOverlayText}
                      </p>
                    </div>
                  )}

                  {/* Scanning sweep bar animation */}
                  {scanStatus === 'scanning' && (
                    <motion.div
                      className="absolute left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_15px_#34d399] z-20"
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Live readout screen */}
            <div className="lg:col-span-3">
              <div className="bg-stone-950 text-emerald-400 border border-stone-800 rounded-3xl p-5 h-full flex flex-col font-mono shadow-2xl relative">
                {/* Simulated LCD glare effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none rounded-3xl"></div>

                <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-4 shrink-0">
                  <h4 className="font-bold text-[11px] uppercase tracking-wider flex items-center gap-2 text-emerald-300">
                    <Activity size={14} className="text-emerald-400 animate-pulse" />
                    {t.probeReadout}
                  </h4>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-[8px] font-bold text-emerald-500">LIVE</span>
                  </div>
                </div>

                {geoDetails ? (
                  <div className="space-y-4 flex-grow text-xs">
                    <div>
                      <span className="text-emerald-500/70 text-[9px] uppercase block mb-0.5">{t.magneticFieldStrength}</span>
                      <span className="text-lg font-bold text-stone-50">
                        {geoDetails.nT > 0 ? `+${geoDetails.nT}` : geoDetails.nT} nT
                      </span>
                      {/* Dynamic Signal meter */}
                      <div className="w-full bg-stone-900 h-2 rounded mt-1.5 overflow-hidden border border-stone-800">
                        <div 
                          className="h-full bg-emerald-500 transition-all duration-150"
                          style={{ 
                            width: `${Math.min(100, Math.abs(geoDetails.nT) * (geoDetails.type === 'iron' ? 0.7 : 2.5))}%`,
                            backgroundColor: geoDetails.type === 'iron' ? '#ef4444' : geoDetails.type === 'hearth' ? '#f97316' : '#10b981'
                          }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <span className="text-emerald-500/70 text-[9px] uppercase block mb-0.5">{t.anomalyDetection}</span>
                      <span className={`font-bold uppercase tracking-wider text-[10px] ${geoDetails.type !== 'grass' ? 'text-amber-300 animate-pulse' : 'text-emerald-400'}`}>
                        {geoDetails.type !== 'grass' ? 'POS-ALERT' : 'NEG-CLEAR'}
                      </span>
                    </div>

                    <div>
                      <span className="text-emerald-500/70 text-[9px] uppercase block mb-0.5">{t.interpretation}</span>
                      <p className="text-stone-100 font-sans leading-relaxed text-[11px] font-medium border-l-2 border-emerald-500 pl-2 py-0.5">
                        {geoDetails.interp}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
                    <Wifi size={20} className="text-stone-700 mb-2 animate-bounce" />
                    <p className="text-stone-500 text-[10px] font-sans">
                      {scanStatus === 'completed' ? 'Fahre mit dem Zeiger über das Raster.' : t.noData}
                    </p>
                  </div>
                )}

                <div className="border-t border-stone-900 pt-3 mt-4 shrink-0 flex items-center justify-between text-[8px] text-stone-500">
                  <span>SYS: MAG-X1 PROBE</span>
                  <span>SIG: 100%</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- TAB 3: Drone Photogrammetry --- */}
        {activeTab === 'drone' && (
          <motion.div
            key="drone-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100">
                    <Camera size={16} />
                  </div>
                  <h3 className="font-bold text-stone-900 text-lg">{t.droneTitle}</h3>
                </div>
                <p className="text-stone-600 text-sm leading-relaxed mb-6">
                  {t.droneDesc}
                </p>

                {/* Drone Steps Progress buttons */}
                <div className="space-y-2 mb-6">
                  {[
                    { nr: 1, label: t.step1 },
                    { nr: 2, label: t.step2 },
                    { nr: 3, label: t.step3 }
                  ].map((step) => (
                    <button
                      key={step.nr}
                      onClick={() => { setDroneStep(step.nr as 1 | 2 | 3); setDroneActionState('idle'); }}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${droneStep === step.nr ? 'border-emerald-800 bg-emerald-50/40 text-emerald-800 shadow-xs' : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'}`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${droneStep === step.nr ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-600'}`}>
                          {step.nr}
                        </span>
                        {step.label}
                      </span>
                      {droneStep > step.nr && (
                        <Sparkles size={14} className="text-emerald-700" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                {/* Reset button */}
                <button
                  onClick={handleResetDrone}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-stone-300 hover:bg-stone-100 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <RotateCcw size={14} />
                  {language === 'de' ? 'Ablauf zurücksetzen' : 'Reset Process'}
                </button>
              </div>
            </div>

            {/* Render Step View Box */}
            <div className="lg:col-span-4">
              <div className="bg-stone-900 p-5 rounded-3xl border border-stone-800 shadow-xl flex flex-col justify-between aspect-square overflow-hidden relative text-center">
                
                {/* Step Content: 1. Photo Capture */}
                {droneStep === 1 && (
                  <div className="h-full flex flex-col justify-between relative">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-2 shrink-0">
                      DRONE FEED: MULTI-ANGLE CAPTURE
                    </span>

                    {/* Camera view simulation */}
                    <div className="flex-grow flex items-center justify-center relative bg-stone-950 rounded-2xl border border-stone-800 overflow-hidden min-h-[160px]">
                      {/* Reticle / Viewfinder */}
                      <div className="absolute inset-6 border border-stone-700/30 pointer-events-none rounded-xl flex items-center justify-center">
                        <div className="w-8 h-8 border border-emerald-400/20 rounded-full animate-ping pointer-events-none"></div>
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                      </div>
                      
                      {/* Amphora outline representation */}
                      <svg viewBox="0 0 100 100" className="w-24 h-24 text-stone-700" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M40 20 h20 M45 20 v10 M55 20 v10 M35 30 h30 C65 30, 75 50, 50 90 C25 50, 35 30, 35 30 Z" />
                        <path d="M35 30 Q30 35 35 45 Q40 50 45 48" />
                        <path d="M65 30 Q70 35 65 45 Q60 50 55 48" />
                      </svg>

                      {/* Flashing click on captures */}
                      {droneActionState === 'running' && (
                        <motion.div 
                          className="absolute inset-0 bg-white"
                          animate={{ opacity: [0, 1, 0, 1, 0] }}
                          transition={{ duration: 1 }}
                        />
                      )}

                      {/* Display captured photo targets */}
                      {droneActionState === 'done' && (
                        <div className="absolute inset-0 grid grid-cols-4 grid-rows-2 p-2 gap-1 bg-stone-950/80">
                          {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="bg-stone-900 border border-emerald-500/30 rounded flex flex-col items-center justify-center relative p-0.5">
                              <svg viewBox="0 0 100 100" className="w-6 h-6 text-emerald-400/40" fill="none" stroke="currentColor" strokeWidth="3">
                                <path d="M40 20 h20 M45 20 v10 M55 20 v10 M35 30 h30 C65 30, 75 50, 50 90 C25 50, 35 30, 35 30 Z" />
                              </svg>
                              <span className="text-[5.5px] font-mono text-emerald-400 font-bold absolute bottom-0.5">IMG_{102 + i}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 shrink-0">
                      {droneActionState === 'idle' && (
                        <button
                          onClick={handleDroneAction}
                          className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                        >
                          <Camera size={14} />
                          {t.btnCapture}
                        </button>
                      )}
                      {droneActionState === 'running' && (
                        <span className="text-stone-400 text-xs font-semibold block py-2">
                          {t.capturing}
                        </span>
                      )}
                      {droneActionState === 'done' && (
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-emerald-400 text-xs font-bold text-left leading-tight">
                            {t.captured}
                          </span>
                          <button
                            onClick={() => { setDroneStep(2); setDroneActionState('idle'); }}
                            className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold rounded-lg text-[10px] transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            {t.step2} <ArrowRight size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step Content: 2. Point Cloud */}
                {droneStep === 2 && (
                  <div className="h-full flex flex-col justify-between relative">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-2 shrink-0">
                      3D CLOUD GENERATOR: 320 DENSE POINTS
                    </span>

                    <div className="flex-grow flex items-center justify-center relative bg-stone-950 rounded-2xl border border-stone-800 overflow-hidden min-h-[160px]">
                      {/* Grid representation */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:10px_10px] opacity-20"></div>

                      {droneActionState === 'done' ? (
                        <div className="relative w-28 h-28 flex items-center justify-center">
                          {/* Point cloud nodes */}
                          {/* Standard amphora shape plotted as points */}
                          {[
                            { x: 50, y: 15 }, { x: 45, y: 15 }, { x: 55, y: 15 },
                            { x: 50, y: 25 }, { x: 46, y: 25 }, { x: 54, y: 25 },
                            { x: 38, y: 32 }, { x: 42, y: 32 }, { x: 50, y: 32 }, { x: 58, y: 32 }, { x: 62, y: 32 },
                            { x: 33, y: 44 }, { x: 40, y: 44 }, { x: 50, y: 44 }, { x: 60, y: 44 }, { x: 67, y: 44 },
                            { x: 36, y: 56 }, { x: 42, y: 56 }, { x: 50, y: 56 }, { x: 58, y: 56 }, { x: 64, y: 56 },
                            { x: 42, y: 68 }, { x: 50, y: 68 }, { x: 58, y: 68 },
                            { x: 46, y: 80 }, { x: 50, y: 80 }, { x: 54, y: 80 },
                            { x: 50, y: 90 }
                          ].map((pt, i) => (
                            <div
                              key={i}
                              className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_#34d399]"
                              style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                            ></div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center p-4">
                          <Cpu size={24} className="text-stone-700 mb-2 mx-auto" />
                          <span className="text-[10px] text-stone-500 font-mono">PCD_ENGINE: STANDBY</span>
                        </div>
                      )}

                      {/* Calculating overlay animation */}
                      {droneActionState === 'running' && (
                        <div className="absolute inset-0 bg-stone-950/80 flex flex-col items-center justify-center">
                          <div className="relative w-12 h-12 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border-2 border-emerald-800/20 border-t-emerald-400 animate-spin"></div>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400 font-semibold mt-2 animate-pulse">
                            CALCULATING COORDS...
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 shrink-0">
                      {droneActionState === 'idle' && (
                        <button
                          onClick={handleDroneAction}
                          className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                        >
                          <Cpu size={14} />
                          {t.btnGeneratePoints}
                        </button>
                      )}
                      {droneActionState === 'running' && (
                        <span className="text-stone-400 text-xs font-semibold block py-2">
                          {t.generatingPoints}
                        </span>
                      )}
                      {droneActionState === 'done' && (
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-emerald-400 text-xs font-bold text-left leading-tight">
                            {t.pointsGenerated}
                          </span>
                          <button
                            onClick={() => { setDroneStep(3); setDroneActionState('idle'); }}
                            className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold rounded-lg text-[10px] transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            {t.step3} <ArrowRight size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step Content: 3. textured 3D model */}
                {droneStep === 3 && (
                  <div className="h-full flex flex-col justify-between relative">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-2 shrink-0">
                      MESH PROCESSOR: TEXTURED 3D ASSET
                    </span>

                    <div className="flex-grow flex items-center justify-center relative bg-stone-950 rounded-2xl border border-stone-800 overflow-hidden min-h-[160px]">
                      {droneActionState === 'done' ? (
                        <div className="relative w-full h-full flex flex-col items-center justify-center">
                          {/* Beautiful simulated rotating textured amphora */}
                          <motion.svg 
                            viewBox="0 0 100 100" 
                            className="w-32 h-32" 
                            fill="none" 
                            stroke="none"
                            animate={{ rotateY: 360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                            style={{ perspective: 1000 }}
                          >
                            {/* Linear Gradient for clay texturing */}
                            <defs>
                              <linearGradient id="clay-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#8c4323" />
                                <stop offset={`${droneAngle}%`} stopColor="#e57a44" />
                                <stop offset="100%" stopColor="#6e3116" />
                              </linearGradient>
                            </defs>
                            
                            {/* Amphora Body and shadow */}
                            <path 
                              d="M38 20 h24 M43 20 v10 M57 20 v10 M33 30 h34 C67 30, 77 55, 50 92 C23 55, 33 30, 33 30 Z" 
                              fill="url(#clay-grad)" 
                            />
                            {/* Amphora Handles */}
                            <path 
                              d="M33 30 C20 33, 25 45, 36 44" 
                              stroke="url(#clay-grad)" 
                              strokeWidth="4"
                              strokeLinecap="round"
                            />
                            <path 
                              d="M67 30 C80 33, 75 45, 64 44" 
                              stroke="url(#clay-grad)" 
                              strokeWidth="4"
                              strokeLinecap="round"
                            />
                            {/* Clay rib details */}
                            <path d="M34 40 q16 4 32 0" stroke="#54230e" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
                            <path d="M35 50 q15 5 30 0" stroke="#54230e" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
                            <path d="M37 60 q13 5 26 0" stroke="#54230e" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
                          </motion.svg>
                        </div>
                      ) : (
                        <div className="text-center p-4">
                          <Layers size={24} className="text-stone-700 mb-2 mx-auto animate-bounce" />
                          <span className="text-[10px] text-stone-500 font-mono">TEXTURE_MAPPER: IDLE</span>
                        </div>
                      )}

                      {/* Texturing loader */}
                      {droneActionState === 'running' && (
                        <div className="absolute inset-0 bg-stone-950/80 flex flex-col items-center justify-center">
                          <div className="relative w-12 h-12 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border-2 border-emerald-800/20 border-t-emerald-400 animate-spin"></div>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400 font-semibold mt-2 animate-pulse">
                            MAPPING TEXTURE...
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 shrink-0">
                      {droneActionState === 'idle' && (
                        <button
                          onClick={handleDroneAction}
                          className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                        >
                          <Layers size={14} />
                          {t.btnApplyTexture}
                        </button>
                      )}
                      {droneActionState === 'running' && (
                        <span className="text-stone-400 text-xs font-semibold block py-2">
                          {t.texturing}
                        </span>
                      )}
                      {droneActionState === 'done' && (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between text-[10px] font-bold text-emerald-400">
                            <span>{t.textured}</span>
                            <span>{droneAngle}° Light</span>
                          </div>
                          <input 
                            type="range" 
                            min="10" 
                            max="90" 
                            value={droneAngle} 
                            onChange={(e) => setDroneAngle(Number(e.target.value))}
                            className="w-full accent-emerald-500 h-1 bg-stone-700 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Drone Description column */}
            <div className="lg:col-span-3">
              <div className="bg-white border border-stone-200 rounded-3xl p-5 h-full flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-stone-900 text-sm mb-3 border-b border-stone-100 pb-2 flex items-center gap-2">
                    <Sparkles size={16} className="text-emerald-800 animate-pulse" />
                    {language === 'de' ? 'Virtuelles Labor' : 'Virtual Lab'}
                  </h4>
                  <p className="text-stone-500 text-xs leading-relaxed">
                    {language === 'de' 
                      ? 'In der Feldarchäologie im Saarland werden Fundobjekte aus römischen und keltischen Gräberfeldern noch am Grabungsort vollständig digital erfasst. Dies nennt sich "Structure-from-Motion". Das resultierende interaktive 3D-Modell kann direkt ins Web-Archiv hochgeladen werden.' 
                      : 'In field archaeology in Saarland, found objects from Roman and Celtic burial sites are fully recorded digitally right at the excavation site. This is called "Structure-from-Motion". The resulting interactive 3D model can be uploaded directly to the web archive.'}
                  </p>
                </div>

                {droneStep === 3 && droneActionState === 'done' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl text-[10px] font-bold mt-4 flex items-center gap-2"
                  >
                    <Sparkles size={14} className="text-emerald-700 shrink-0" />
                    <span>{t.reconstructSuccess}</span>
                  </motion.div>
                )}

                <div className="border-t border-stone-100 pt-3 mt-4 text-[9px] text-stone-400 font-mono">
                  <span>CAMERA: 45MP FULLFRAME</span><br />
                  <span>OUTPUT: .OBJ / .GLTF</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
