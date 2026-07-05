import { Tour } from '../types';

export const TOURS: Tour[] = [
  // --- EXISTING TOURS ---
  {
    id: 'tour-bliesgau',
    name: 'Biosphären-Pfad Bliesgau (Archäologische Zeitreise)',
    difficulty: 'Mittel',
    distance: 12.8,
    duration: '3:45 h',
    elevationUp: 240,
    elevationDown: 240,
    description: 'Ein herrlicher Kultur-Rundweg im UNESCO-Biosphärenreservat Bliesgau. Er verbindet das römische Erbe von Reinheim mit prähistorischen Grabmonumenten in den sanften Hügeln.',
    longDescription: 'Diese Premium-Kulturtour führt Sie mitten durch die idyllische Hügelland-Landschaft des saarländischen Bliesgaus. Ausgangspunkt ist das berühmte europäische Kulturzentrum in Reinheim. Von dort wandern Sie auf historischen Höhenwegen der Grenzzone. Sie passieren Grabhügelgruppen aus der Bronzezeit, blicken weit ins französische lothringische Land und entdecken uralte Siedlungslandschaften. Die Strecke zeichnet sich durch üppige Streuobstwiesen, schattige Buchenwälder und weite Ausblicke auf das Bliesthal aus.',
    type: 'Rundwanderweg',
    startPoint: 'Europäischer Kulturpark Bliesbruck-Reinheim, Besucherparkplatz',
    startCoords: [49.1300, 7.1800],
    equipment: [
      'Festes, knöchelhohes Schuhwerk (Wanderschuhe)',
      'Wetterfeste Kleidung und Sonnenschutz',
      'Ausreichend Trinkwasser (mind. 1.5 Liter pro Person)',
      'Smartphone oder GPS-Gerät zur Navigation'
    ],
    safetyTips: 'Einige Steigungen auf Feldwegen können nach Regenfällen rutschig sein. Achten Sie auf landwirtschaftlichen Verkehr auf den befestigten Abschnitten.',
    imageUrl: 'images/dummy-005-kulturpark-bliesbruck-reinheim.jpg',
    stopIds: [
      'bronzezeit-reinheim-hort',
      'bronzezeit-boeckweiler-grabhuegel',
      'bronzezeit-webenheim-urndefelder'
    ],
    pathCoordinates: [
      [49.1300, 7.1800],
      [49.1450, 7.1950],
      [49.1680, 7.2020],
      [49.1920, 7.2180],
      [49.2150, 7.2340],
      [49.2300, 7.2500],
      [49.2420, 7.2720],
      [49.2500, 7.2900],
      [49.2310, 7.2810],
      [49.2080, 7.2600],
      [49.1820, 7.2280],
      [49.1620, 7.2050],
      [49.1410, 7.1890],
      [49.1300, 7.1800]
    ],
    elevationProfile: [
      { distance: 0, elevation: 215 },
      { distance: 2, elevation: 230 },
      { distance: 4, elevation: 285 },
      { distance: 6, elevation: 340 },
      { distance: 8, elevation: 245 },
      { distance: 10, elevation: 290 },
      { distance: 12.8, elevation: 215 }
    ]
  },
  {
    id: 'tour-otzenhausen',
    name: 'Hunnenring-Dollberg Steig',
    difficulty: 'Schwer',
    distance: 8.4,
    duration: '2:45 h',
    elevationUp: 310,
    elevationDown: 310,
    description: 'Ein anspruchsvoller Buchenwald-Steig zum monumentalen, keltischen Ringwall am Dollberg. Atemberaubende frühgeschichtliche Architektur trifft auf Nationalpark-Wildnis.',
    longDescription: 'Diese Waldtour ist ein echtes Highlight für Wander- und Geschichtsbegeisterte gleichermaßen. Sie führt steil bergauf durch den schattigen Nationalpark Hunsrück-Hochwald direkt zu den massiven Steinwällen des "Hunnenrings" von Otzenhausen. Die bis heute über 10 Meter hohen, vorchristlichen Blocksteinwälle zeugen von der wehrhaften eisenzeitlichen Metropole der Treverer. Unterwegs finden sich zudem immer wieder Spuren älterer Besiedlungsreste, die bis in die Bronzezeit zurückreichen. Ein schroffer Pfad mit steinigen Passagen, herrlicher Waldluft und historischer Mystik.',
    type: 'Rundwanderweg',
    startPoint: 'Keltenpark Otzenhausen, 66620 Nonnweiler',
    startCoords: [49.6130, 6.9960],
    equipment: [
      'Robuste Profilsohlen-Wanderschuhe zwingend erforderlich',
      'Trittsicherheit und mäßige Kondition',
      'Kleine Rucksackverpflegung',
      'Kamera für eindrucksvolle Steinwall-Perspektiven'
    ],
    safetyTips: 'Die Steinhalden und Blockschuttfelder der Festungsanlage dürfen aus Naturschutz- und Sicherheitsgründen nicht direkt bestiegen werden. Rutschgefahr bei Raureif oder Nässe.',
    imageUrl: 'images/dummy-004-hunnenring.jpg',
    stopIds: [
      'ringwall-otzenhausen',
      'otzenhausen-keltenpark',
      'otzenhausen'
    ],
    pathCoordinates: [
      [49.6130, 6.9960],
      [49.6220, 7.0050],
      [49.6350, 7.0160],
      [49.6480, 7.0250],
      [49.6500, 7.0300],
      [49.6450, 7.0420],
      [49.6300, 7.0300],
      [49.6200, 7.0120],
      [49.6130, 6.9960]
    ],
    elevationProfile: [
      { distance: 0, elevation: 380 },
      { distance: 2.2, elevation: 470 },
      { distance: 4.5, elevation: 620 },
      { distance: 5.8, elevation: 695 },
      { distance: 7.0, elevation: 510 },
      { distance: 8.4, elevation: 380 }
    ]
  },
  {
    id: 'tour-mandelbachtal',
    name: 'Rodenwald-Schatzpfad Erfweiler',
    difficulty: 'Leicht',
    distance: 6.5,
    duration: '1:45 h',
    elevationUp: 120,
    elevationDown: 120,
    description: 'Ein entspannter Kulturspaziergang über die sonnigen Höhen des Mandelbachtals. Entlang der Fundstellen der berühmten spätbronzezeitlichen Bronzeschätze.',
    longDescription: 'Der landschaftlich milde Rodenwald-Schatzpfad is ideal für Familien und Genusswanderer. Er führt Sie über gut begehbare Feld- und Wiesenwege rund um Erfweiler-Ehlingen. Der Pfad verläuft unmittelbar entlang der sanft ansteigenden Hügelfluren des Standorts "Am Rodenwald", auf dem bei Pflugarbeiten sensationelle spätbronzezeitliche Depot- und Schmuckhorte mit tonnenschweren Bronzen, Ringschmuck und Beilen geborgen wurden. Schautafeln vermitteln lebendige Einblicke in Deponierungsbräuche prähistorischer Kulte.',
    type: 'Rundwanderweg',
    startPoint: 'Pfarrkirche St. Mauritius, Erfweiler-Ehlingen',
    startCoords: [49.1800, 7.1600],
    equipment: [
      'Leichte Wanderschuhe oder Sportschuhe mit Profil',
      'Kopfbedeckung (Weg führt überwiegend über offenes, sonniges Gelände)',
      'Sitzkissen für Pausen an schönen Ausblicken'
    ],
    safetyTips: 'Keine besonderen Gefahrenstellen. Der Weg ist teilweise asphaltiert oder geschottert und sehr gut zugänglich.',
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200',
    stopIds: [
      'bronzezeit-erfweiler-ehlingen-hort-1',
      'bronzezeit-erfweiler-ehlingen-hort-2',
      'bronzezeit-biesingen-bliesgau'
    ],
    pathCoordinates: [
      [49.1800, 7.1600],
      [49.1820, 7.1620],
      [49.1950, 7.1700],
      [49.2100, 7.1850],
      [49.2200, 7.2000],
      [49.2050, 7.1800],
      [49.1910, 7.1680],
      [49.1800, 7.1600]
    ],
    elevationProfile: [
      { distance: 0, elevation: 235 },
      { distance: 1.5, elevation: 240 },
      { distance: 3.2, elevation: 295 },
      { distance: 4.8, elevation: 335 },
      { distance: 5.5, elevation: 270 },
      { distance: 6.5, elevation: 235 }
    ]
  },
  {
    id: 'tour-limberg',
    name: 'Vauban- & Limberg-Geschichtspfad',
    difficulty: 'Mittel',
    distance: 9.6,
    duration: '3:00 h',
    elevationUp: 250,
    elevationDown: 250,
    description: 'Historische Höhentour über das bewaldete Plateau des Wallerfanger Limbergs. Entdecken Sie den Fundort des Eichenborn-Elitehortes.',
    longDescription: 'Der Limberg bei Wallerfangen ragt markant über dem Saartal auf. Diese historische Tour kombiniert barocke Befestigungsspuren des berühmten Baumeisters Vauban mit urzeitlichen Kultplätzen. Sie wandern hinauf zum landschaftlich erhabenen Plateau des bewaldeten Bergrückens. Nahe dem Wanderweg liegt der exakte Fundort des prachtvollen Wallerfanger Hortfundes "Eichenborn" aus dem 9. Jahrhundert v. Chr. mit seinem bemerkenswerten Bronzeschwert und Pferdegeschirrschmuck. Schattige Hohlwege und großartige Überblicke auf die Saarschleife bei Saarlouis runden das Kulturerlebnis ab.',
    type: 'Rundwanderweg',
    startPoint: 'Geschichtsmuseum Wallerfangen / Rathausparkplatz',
    startCoords: [49.3300, 6.7200],
    equipment: [
      'Feste Wanderschuhe',
      'Zeckenschutz für Waldpassagen',
      'Fotoapparat für fantastische Weitblicke auf die Lothringer Höhen'
    ],
    safetyTips: 'Der Aufstieg auf den Limberghang beinhaltet schmale und steilere Waldpfade. Vorsicht bei feuchtem Laub.',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1200',
    stopIds: [
      'bronzezeit-wallerfangen-eichenborn',
      'bronzezeit-wallerfangen-umfeld',
      'bronzezeit-saarlouis-roden-depot'
    ],
    pathCoordinates: [
      [49.3300, 6.7200],
      [49.3400, 6.7200],
      [49.3510, 6.7320],
      [49.3480, 6.7450],
      [49.3350, 7.1500] ,
      [49.3200, 6.7500],
      [49.3150, 6.7350],
      [49.3300, 6.7200]
    ],
    elevationProfile: [
      { distance: 0, elevation: 185 },
      { distance: 2.1, elevation: 290 },
      { distance: 3.5, elevation: 345 },
      { distance: 5.2, elevation: 330 },
      { distance: 7.1, elevation: 190 },
      { distance: 9.6, elevation: 185 }
    ]
  },
  {
    id: 'tour-blies-cycling',
    name: 'Blies-Kultur-Radweg (Römermuseum- & Kulturpark-Runde)',
    difficulty: 'Leicht',
    distance: 18.2,
    duration: '1:15 h',
    elevationUp: 65,
    elevationDown: 45,
    description: 'Ein herrlicher, flacher und perfekt befestigter Kultur-Radweg entlang der Blies. Er verbindet das Römermuseum Schwarzenacker mit den Fundstätten in Reinheim.',
    longDescription: 'Der landschaftlich idyllische und vollständig barrierefreie Radweg verhält sich flach im Herzen des Biosphärenreservates Bliesgau und folgt dem naturnahen Flusslauf der Blies. Sie starten am Europäischen Kulturpark Bliesbruck-Reinheim (mit der rekonstruierten keltischen Fürstinnengrabstätte und dem römischen Handwerkerviertel) und radeln gemütlich flussaufwärts nach Norden. Unterwegs passieren Sie reizvolle Auenlandschaften und historische Ortskerne wie Blickweiler und Breitfurt. Das Ziel und Kultur-Highlight erwartet Sie im Norden: das berühmte Römermuseum Homburg-Schwarzenacker mit seinen rekonstruierten römischen Forums- und Handwerkerhäusern sowie dem prächtigen Edelhaus. Eine wunderbare Entdeckungstour für die ganze Familie!',
    type: 'Streckenwanderung',
    activity: 'Radfahren',
    startPoint: 'Europäischer Kulturpark Bliesbruck-Reinheim, Parkplatz',
    startCoords: [49.1300, 7.1800],
    equipment: [
      'Verkehrssicheres Tourenrad, E-Bike oder Gravelbike',
      'Fahrradhelm (empfohlen)',
      'Ggf. Sonnenschutz für offene Landschaften',
      'Ausreichend Getränke für unterwegs'
    ],
    safetyTips: 'Der Radweg verläuft flach auf gut asphaltierten Wegen abseits des Straßenverkehrs. Ideal auch für Familien und E-Bikes. Vorsicht an Schnittstellen mit landwirtschaftlichem Verkehr.',
    imageUrl: 'images/dummy-008-roemermuseum-schwarzenacker.jpg',
    stopIds: [
      'reinheim',
      'reinheim-villa',
      'schwarzenacker'
    ],
    pathCoordinates: [
      [49.1300, 7.1800],
      [49.1410, 7.1950],
      [49.1670, 7.2340],
      [49.1950, 7.2450],
      [49.2150, 7.2500],
      [49.2450, 7.2750],
      [49.2650, 7.2955],
      [49.2825, 7.3150]
    ],
    elevationProfile: [
      { distance: 0, elevation: 215 },
      { distance: 3.5, elevation: 218 },
      { distance: 7.2, elevation: 220 },
      { distance: 11.0, elevation: 224 },
      { distance: 14.8, elevation: 228 },
      { distance: 18.2, elevation: 235 }
    ]
  },

  // --- NEW TOURS FROM PDFS ---

  // Category 1: Bliesgau (Archäologisch orientierte Wandertouren)
  {
    id: 'tour-gollenstein-runde',
    name: 'Gollenstein-Runde (Blieskastel)',
    difficulty: 'Leicht',
    distance: 8.0,
    duration: '2:15 h',
    elevationUp: 110,
    elevationDown: 110,
    description: 'Bedeutender Menhir (Gollenstein), vorgeschichtliche Kulturlandschaft und weite Ausblicke über den Bliesgau.',
    longDescription: 'Diese gemütliche Rundwanderung im Bliesgau führt Sie zum imposanten Gollenstein bei Blieskastel, dem größten Menhir Mitteleuropas. Die Tour schlängelt sich durch die sanft gewellte Kulturlandschaft des UNESCO-Biosphärenreservats Bliesgau. Neben dem beeindruckenden prähistorischen Steinmonument aus der Jungsteinzeit erwarten Sie wunderschöne Weitblicke über Streuobstwiesen und fruchtbare Felder. Perfekt für einen entspannten, geschichtsreichen Nachmittagsausflug.',
    type: 'Rundwanderweg',
    startPoint: 'Wanderparkplatz am Gollenstein, 66440 Blieskastel',
    startCoords: [49.2770, 7.2620],
    equipment: [
      'Leichte Wanderschuhe',
      'Wetterfeste Kleidung',
      'Kamera für das beeindruckende Steinmonument'
    ],
    safetyTips: 'Der Weg ist größtenteils gut befestigt und verläuft flach über offenes Feld. Ideal auch für weniger geübte Wanderer.',
    imageUrl: 'images/dummy-001-gollenstein.jpg',
    stopIds: [
      'gollenstein',
      'bronzezeit-boeckweiler-grabhuegel',
      'bronzezeit-mimbach-widdumhof',
      'bronzezeit-webenheim-urndefelder'
    ],
    pathCoordinates: [
      [49.2770, 7.2620],
      [49.2820, 7.2680],
      [49.2880, 7.2720],
      [49.2850, 7.2550],
      [49.2770, 7.2620]
    ],
    elevationProfile: [
      { distance: 0, elevation: 280 },
      { distance: 2, elevation: 310 },
      { distance: 4, elevation: 330 },
      { distance: 6, elevation: 290 },
      { distance: 8, elevation: 280 }
    ]
  },
  {
    id: 'tour-reinheim-keltenweg',
    name: 'Reinheim – Keltenweg – Fürstinnengrab',
    difficulty: 'Leicht',
    distance: 6.5,
    duration: '1:45 h',
    elevationUp: 80,
    elevationDown: 80,
    description: 'Archäologisch wichtigste Tour mit Bezug zum Fürstinnengrab von Reinheim und zur Siedlungskammer Bliesbruck-Reinheim.',
    longDescription: 'Der Keltenweg in Reinheim ist die archäologisch bedeutendste Tour der Region. Sie verbindet die sagenumwobene Rekonstruktion des Fürstinnengrabs von Reinheim direkt mit der reichen Siedlungskammer des Europäischen Kulturparks Bliesbruck-Reinheim. Entlang der idyllischen Bliesauen wandern Sie auf den Spuren der kelto-römischen Vorfahren, vorbei an Grabhügeln, Thermenanlagen und dem rekonstruierten herrschaftlichen Wohnbereich.',
    type: 'Rundwanderweg',
    startPoint: 'Europäischer Kulturpark Bliesbruck-Reinheim, Besucherzentrum',
    startCoords: [49.1350, 7.1850],
    equipment: [
      'Bequeme Freizeitschuhe',
      'Trinkflasche',
      'Sonnenschutz an heißen Tagen'
    ],
    safetyTips: 'Sehr flacher, familienfreundlicher Spaziergang auf befestigten Wegen. Der Parkbereich ist weitgehend barrierefrei gestaltet.',
    imageUrl: 'images/dummy-005-kulturpark-bliesbruck-reinheim.jpg',
    stopIds: ['reinheim', 'reinheim-villa', 'reinheim-grab'],
    pathCoordinates: [
      [49.1350, 7.1850],
      [49.1300, 7.1800],
      [49.1290, 7.1900],
      [49.1380, 7.1950],
      [49.1350, 7.1850]
    ],
    elevationProfile: [
      { distance: 0, elevation: 215 },
      { distance: 1.5, elevation: 220 },
      { distance: 3, elevation: 250 },
      { distance: 5, elevation: 230 },
      { distance: 6.5, elevation: 215 }
    ]
  },
  {
    id: 'tour-bliesgau-blicke',
    name: 'Bliesgau-Blicke (Gersheim)',
    difficulty: 'Leicht',
    distance: 6.7,
    duration: '1:45 h',
    elevationUp: 120,
    elevationDown: 120,
    description: 'Schwerpunkt Landschaftsarchäologie, Muschelkalkhochflächen und traditionelle Kulturlandschaft.',
    longDescription: 'Diese landschaftsarchäologisch orientierte Rundwanderung führt Sie über die beeindruckenden Muschelkalkhochflächen rund um Gersheim im Bliesgau. Die jahrtausendealte Kulturlandschaft zeigt eindrucksvoll, wie prähistorische Besiedlung und die geologischen Gegebenheiten der Muschelkalkhügel ineinandergreifen. Entdecken Sie traditionelle Streuobstwiesen, seltene Orchideenarten und atemberaubende Weitblicke, die schon die Menschen der Bronzezeit faszinierten.',
    type: 'Rundwanderweg',
    startPoint: 'Kulturhaus Gersheim, 66453 Gersheim',
    startCoords: [49.1510, 7.2100],
    equipment: [
      'Festes Schuhwerk',
      'Ausreichend Wasser',
      'Wanderkarte oder App'
    ],
    safetyTips: 'Auf den sonnigen Hochflächen gibt es wenig Schatten. Denken Sie an ausreichenden Sonnenschutz.',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1200',
    stopIds: [
      'bronzezeit-gersheim-grosser-acker',
      'bronzezeit-reinheim-hort',
      'bronzezeit-reinheim-bannholz',
      'bronzezeit-walsheim-gemeindewald',
      'reinheim'
    ],
    pathCoordinates: [
      [49.1510, 7.2100],
      [49.1600, 7.2200],
      [49.1680, 7.2020],
      [49.1580, 7.1950],
      [49.1510, 7.2100]
    ],
    elevationProfile: [
      { distance: 0, elevation: 210 },
      { distance: 2, elevation: 280 },
      { distance: 4, elevation: 310 },
      { distance: 5.5, elevation: 240 },
      { distance: 6.7, elevation: 210 }
    ]
  },

  // Category 2: Saargau (Archäologischer Wanderführer rund um Wallerfangen)
  {
    id: 'tour-emilianusstollen',
    name: 'Emilianusstollen – Blauloch – Limberg',
    difficulty: 'Mittel',
    distance: 8.0,
    duration: '2:30 h',
    elevationUp: 220,
    elevationDown: 220,
    description: 'Römischer Kupferbergbau, Emilianusstollen, mittelalterlicher Azuritbergbau, Blauloch, Limberg und weite Ausblicke über das Saartal.',
    longDescription: 'Diese spannende Wanderung führt Sie in die Welt des historischen Bergbaus am Wallerfanger Limberg. Sie besichtigen den berühmten römischen Emilianusstollen, das einzige bekannte Untertage-Kupferbergwerk der Römer nördlich der Alpen mit erhaltener Inschrift. Weiter geht es vorbei am Blauloch, Spuren des mittelalterlichen Azuritbergbaus sowie den Resten bronzezeitlicher Befestigungen auf dem Bergplateau, gekrönt von spektakulären Ausblicken über das weite Saartal.',
    type: 'Rundwanderweg',
    startPoint: 'Wanderparkplatz am Emilianusstollen, St. Barbara, 66798 Wallerfangen',
    startCoords: [49.3410, 6.6910],
    equipment: [
      'Trittsicheres Schuhwerk mit gutem Profil',
      'Taschenlampe für dunkle Ecken',
      'Smartphone/GPS zur Orientierung im Wald'
    ],
    safetyTips: 'Die Bergbaupfade können im Wald feucht und rutschig sein. Bleiben Sie stets auf den ausgewiesenen Wegen.',
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200',
    stopIds: [
      'bronzezeit-wallerfangen-blauloch',
      'bronzezeit-wallerfangen-umfeld',
      'bronzezeit-wallerfangen-eichenborn',
      'bronzezeit-wallerfangen-hansenberg-fuss'
    ],
    pathCoordinates: [
      [49.3410, 6.6910],
      [49.3480, 6.7020],
      [49.3510, 6.7120],
      [49.3450, 6.7000],
      [49.3410, 6.6910]
    ],
    elevationProfile: [
      { distance: 0, elevation: 220 },
      { distance: 2, elevation: 310 },
      { distance: 4, elevation: 345 },
      { distance: 6, elevation: 260 },
      { distance: 8, elevation: 220 }
    ]
  },
  {
    id: 'tour-wallerfangen-ihn',
    name: 'Wallerfangen – Ihn – Kerlingen',
    difficulty: 'Mittel',
    distance: 11.0,
    duration: '3:15 h',
    elevationUp: 180,
    elevationDown: 180,
    description: 'Historische Wege über die Gauhochfläche, gallo-römische Fundlandschaften und das Umfeld des Sirona-Heiligtums von Ihn.',
    longDescription: 'Entdecken Sie die reiche gallo-römische Kulturlandschaft des Saargaus. Diese anspruchsvolle Wanderung führt Sie über die weite Gauhochfläche von Wallerfangen über Ihn nach Kerlingen. Sie folgen historischen Wegen durch fruchtbares Hügelland und erreichen das berühmte Sirona-Heiligtum im Ihner Tal, eine ehemals blühende römische Tempelanlage, geweiht der keltischen Heilgöttin Sirona.',
    type: 'Rundwanderweg',
    startPoint: 'Dorfplatz Ihn, 66798 Wallerfangen-Ihn',
    startCoords: [49.3320, 6.6150],
    equipment: [
      'Wanderschuhe',
      'Ausreichend Proviant',
      'Sonnenschutz für die offenen Höhenflächen'
    ],
    safetyTips: 'Der Weg quert einige offene, windanfällige Hochflächen. Wind- und Wetterschutz einpacken.',
    imageUrl: 'https://placehold.co/1200x800/1c1917/a8a29e?text=Quellheiligtum+Sudelfels',
    stopIds: [
      'bronzezeit-wallerfangen-park-galhau',
      'bronzezeit-niedaltdorf-helberg',
      'bronzezeit-wallerfangen-umfeld'
    ],
    pathCoordinates: [
      [49.3320, 6.6150],
      [49.3250, 6.6350],
      [49.3380, 6.6500],
      [49.3450, 6.6250],
      [49.3320, 6.6150]
    ],
    elevationProfile: [
      { distance: 0, elevation: 240 },
      { distance: 3, elevation: 310 },
      { distance: 6, elevation: 350 },
      { distance: 9, elevation: 280 },
      { distance: 11, elevation: 240 }
    ]
  },
  {
    id: 'tour-gisinger',
    name: 'Der Gisinger',
    difficulty: 'Mittel',
    distance: 10.9,
    duration: '3:00 h',
    elevationUp: 160,
    elevationDown: 160,
    description: 'Klassische Saargau-Landschaft mit Streuobstwiesen, Haus Saargau und zahlreichen archäologisch relevanten Fundräumen.',
    longDescription: 'Die Tour "Der Gisinger" führt durch die malerischste Ecke des saarländischen Saargaus. Vorbei an ausgedehnten Streuobstwiesen wandern Sie zum historischen "Haus Saargau" in Gisingen, einem liebevoll restaurierten Lothringer Bauernhaus aus dem 18. Jahrhundert mit Kräutergarten. Der Weg berührt zahlreiche ur- und frühgeschichtliche Fundstellen der Hochfläche, die von jahrtausendelanger Besiedlung zeugen.',
    type: 'Rundwanderweg',
    startPoint: 'Haus Saargau, Gisingen, 66798 Wallerfangen',
    startCoords: [49.3390, 6.6710],
    equipment: [
      'Bequeme Wanderschuhe',
      'Wetterfeste Kleidung',
      'Kamera für malerische Ausblicke'
    ],
    safetyTips: 'Der Rundweg ist gut begehbar. Nutzen Sie die Rastmöglichkeiten am Haus Saargau für eine ausgedehnte Pause.',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1200',
    stopIds: [
      'bronzezeit-wallerfangen-hansenberg-fuss',
      'bronzezeit-wallerfangen-umfeld',
      'bronzezeit-wallerfangen-park-galhau'
    ],
    pathCoordinates: [
      [49.3390, 6.6710],
      [49.3500, 6.6800],
      [49.3450, 6.6550],
      [49.3320, 6.6620],
      [49.3390, 6.6710]
    ],
    elevationProfile: [
      { distance: 0, elevation: 320 },
      { distance: 3, elevation: 340 },
      { distance: 6, elevation: 290 },
      { distance: 9, elevation: 310 },
      { distance: 10.9, elevation: 320 }
    ]
  },
  {
    id: 'tour-leidingen',
    name: 'Leidingen – Grenzblickweg',
    difficulty: 'Schwer',
    distance: 13.0,
    duration: '3:45 h',
    elevationUp: 190,
    elevationDown: 190,
    description: 'Historische Grenzlandschaft zwischen Saarland und Lothringen mit alten Hohlwegen und Fernblicken.',
    longDescription: 'Dieser geschichtsträchtige Rundweg führt Sie entlang der deutsch-französischen Grenze im Saargau. Das Besondere: In Leidingen verläuft die Grenze mitten auf der Hauptstraße ("Neutralstraße"). Der Weg führt durch uralte, tief in den Kalkstein eingeschnittene Hohlwege, die schon seit der Römer- und Keltenzeit genutzt wurden, und bietet weite Blicke tief nach Lothringen hinein.',
    type: 'Rundwanderweg',
    startPoint: 'Dorfmitte Leidingen, Neutralstraße, 66798 Wallerfangen-Leidingen',
    startCoords: [49.3050, 6.6110],
    equipment: [
      'Festes Wanderschuhwerk',
      'Wetterschutzbekleidung',
      'Trinkwasser und Wanderkarte'
    ],
    safetyTips: 'Aufgrund der Länge der Tour ist eine solide Grundkondition empfehlenswert. Personalausweis für den Grenzübertritt mitführen.',
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200',
    stopIds: [
      'bronzezeit-niedaltdorf-helberg',
      'bronzezeit-wallerfangen-park-galhau',
      'bronzezeit-wallerfangen-hansenberg-fuss'
    ],
    pathCoordinates: [
      [49.3050, 6.6110],
      [49.2980, 6.6250],
      [49.3120, 6.6350],
      [49.3180, 6.6200],
      [49.3050, 6.6110]
    ],
    elevationProfile: [
      { distance: 0, elevation: 360 },
      { distance: 4, elevation: 380 },
      { distance: 8, elevation: 340 },
      { distance: 11, elevation: 390 },
      { distance: 13, elevation: 360 }
    ]
  },
  {
    id: 'tour-rammelfangen',
    name: 'Rammelfangen – Hirnberg',
    difficulty: 'Mittel',
    distance: 8.4,
    duration: '2:30 h',
    elevationUp: 170,
    elevationDown: 170,
    description: 'Historische Siedlungslandschaft, Aussichtspunkte und mittelalterliche Burgstellen.',
    longDescription: 'Rund um Rammelfangen wandern Sie durch eine abwechslungsreiche historische Kulturlandschaft. Auf dem Hirnberg treffen Sie auf Reste mittelalterlicher Burganlagen und Befestigungen, während Schautafeln am Wegesrand die vorgeschichtliche und römische Besiedlung der Region lebendig machen. Genießen Sie herrliche Weitblicke über die sanften Gau-Rücken.',
    type: 'Rundwanderweg',
    startPoint: 'Dorfgemeinschaftshaus Rammelfangen, 66798 Wallerfangen',
    startCoords: [49.3350, 6.6850],
    equipment: [
      'Robuste Wanderschuhe',
      'Windjacke',
      'Kamera für Panoramabilder'
    ],
    safetyTips: 'Der Aufstieg auf den Hirnberg erfordert etwas Trittsicherheit auf schmaleren Pfaden. Bei nassem Wetter ist erhöhte Vorsicht geboten.',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1200',
    stopIds: [
      'bronzezeit-wallerfangen-umfeld',
      'bronzezeit-wallerfangen-eichenborn',
      'bronzezeit-wallerfangen-blauloch',
      'bronzezeit-wallerfangen-park-galhau'
    ],
    pathCoordinates: [
      [49.3350, 6.6850],
      [49.3280, 6.6950],
      [49.3400, 6.7050],
      [49.3450, 6.6900],
      [49.3350, 6.6850]
    ],
    elevationProfile: [
      { distance: 0, elevation: 290 },
      { distance: 2.5, elevation: 330 },
      { distance: 5, elevation: 350 },
      { distance: 7, elevation: 310 },
      { distance: 8.4, elevation: 290 }
    ]
  },

  // Category 3: Merzig-Wadern (Archäologische Wanderungen)
  {
    id: 'tour-ballern-rech',
    name: 'Ballern-Rech – Archäologischer Rundweg',
    difficulty: 'Mittel',
    distance: 9.2,
    duration: '2:45 h',
    elevationUp: 140,
    elevationDown: 140,
    description: 'Urnenfelderzeitliche Nekropole von Ballern-Rech. Eine der bedeutendsten bronzezeitlichen Gräberlandschaften des Saarlandes.',
    longDescription: 'Dieser spannende archäologische Rundweg widmet sich der bedeutenden urnenfelderzeitlichen Nekropole von Ballern-Rech. Er führt durch eines der historisch wichtigsten Gräberfelder des Saarlandes. Schautafeln erläutern die Entdeckung der bronze- und eisenzeitlichen Grabanlagen, Bestattungsriten und Funde. Ein Muss für geschichtsinteressierte Wanderer, eingebettet in die sanften Hügel des Merziger Beckens.',
    type: 'Rundwanderweg',
    startPoint: 'Wanderparkplatz Ballern, 66663 Merzig',
    startCoords: [49.4350, 6.6110],
    equipment: [
      'Feste Wanderschuhe',
      'Genügend Trinkwasser',
      'Sonnenschutz bei sonnigem Wetter'
    ],
    safetyTips: 'Der Weg verläuft teils über Wiesen- und Forstwege. Trittsicherheit ist vorteilhaft, aber keine extremen Steilhänge vorhanden.',
    imageUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&q=80&w=1200',
    stopIds: [
      'bronzezeit-ballern-rech-graeberfeld',
      'bronzezeit-schwemlingen-saarfund',
      'bronzezeit-beiningen-siedlungsreste'
    ],
    pathCoordinates: [
      [49.4350, 6.6110],
      [49.4420, 6.6200],
      [49.4480, 6.6050],
      [49.4400, 6.5950],
      [49.4350, 6.6110]
    ],
    elevationProfile: [
      { distance: 0, elevation: 180 },
      { distance: 2.5, elevation: 240 },
      { distance: 5, elevation: 290 },
      { distance: 7.5, elevation: 210 },
      { distance: 9.2, elevation: 180 }
    ]
  },
  {
    id: 'tour-tuensdorf',
    name: 'Tünsdorf – Steinchen',
    difficulty: 'Mittel',
    distance: 7.8,
    duration: '2:15 h',
    elevationUp: 160,
    elevationDown: 160,
    description: 'Wanderung zum Fundraum des berühmten bronzezeitlichen Hortfundes von Tünsdorf mit seinen Absatzbeilen der frühen Urnenfelderzeit.',
    longDescription: 'Diese Route entführt Sie in den geheimnisvollen Fundraum des "Tünsdorfer Schatzes". Sie wandern durch den dichten Wald "Steinchen" bei Tünsdorf, wo im 19. Jahrhundert ein bedeutender bronzezeitlicher Hortfund mit kostbaren Absatzbeilen aus der frühen Urnenfelderzeit entdeckt wurde. Schattige Waldpfade und sanfte Täler machen diese Tour zu einem entspannenden, atmosphärischen Kulturerlebnis.',
    type: 'Rundwanderweg',
    startPoint: 'Ortsmitte Tünsdorf (Kirche), 66693 Mettlach',
    startCoords: [49.4750, 6.5250],
    equipment: [
      'Wanderschuhe',
      'Dem Wetter angepasste Kleidung',
      'Trinkflasche'
    ],
    safetyTips: 'Schattige Waldpfade können nach Regenfällen rutschig sein. Achten Sie auf festes Schuhwerk.',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1200',
    stopIds: [
      'bronzezeit-tuensdorf-steinchen',
      'bronzezeit-schwemlingen-saarfund',
      'villa-borg',
      'roemisches-mosaik-nennig'
    ],
    pathCoordinates: [
      [49.4750, 6.5250],
      [49.4820, 6.5350],
      [49.4880, 6.5150],
      [49.4800, 6.5050],
      [49.4750, 6.5250]
    ],
    elevationProfile: [
      { distance: 0, elevation: 320 },
      { distance: 2, elevation: 370 },
      { distance: 4, elevation: 410 },
      { distance: 6, elevation: 350 },
      { distance: 7.8, elevation: 320 }
    ]
  },
  {
    id: 'tour-losheim',
    name: 'Losheim – Großwald',
    difficulty: 'Mittel',
    distance: 8.5,
    duration: '2:30 h',
    elevationUp: 180,
    elevationDown: 180,
    description: 'Grabhügel und Bestattungslandschaft des Übergangs von der Hügelgräberbronzezeit zur Urnenfelderzeit.',
    longDescription: 'Die Tour durch den Losheimer Großwald führt Sie in eine dichte prähistorische Bestattungslandschaft. Auf diesem abwechslungsreichen Weg durch dichte Buchenwälder entdecken Sie mehrere gut erhaltene Grabhügelgruppen. Diese stammen aus der faszinierenden Übergangszeit von der älteren Hügelgräberbronzezeit zur jüngeren Urnenfelderkultur und zeugen von Jahrhunderte anhaltenden Bestattungstraditionen.',
    type: 'Rundwanderweg',
    startPoint: 'Wanderparkplatz Großwald, 66679 Losheim am See',
    startCoords: [49.5050, 6.7450],
    equipment: [
      'Stabile Wanderschuhe',
      'Klimaschutzbekleidung',
      'Insektenschutz im Sommer'
    ],
    safetyTips: 'Die Standorte der Grabhügel im Wald sind teilweise unmarkiert. Bleiben Sie für den Schutz der Denkmäler auf den Wegen.',
    imageUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&q=80&w=1200',
    stopIds: [
      'bronzezeit-losheim-einzelfunde',
      'bronzezeit-waldhoelzbach-lachenwald',
      'bronzezeit-beckingen-galgenberg'
    ],
    pathCoordinates: [
      [49.5050, 6.7450],
      [49.5120, 6.7550],
      [49.5180, 6.7350],
      [49.5100, 6.7250],
      [49.5050, 6.7450]
    ],
    elevationProfile: [
      { distance: 0, elevation: 340 },
      { distance: 2.5, elevation: 390 },
      { distance: 5, elevation: 430 },
      { distance: 7, elevation: 360 },
      { distance: 8.5, elevation: 340 }
    ]
  },
  {
    id: 'tour-nunkirchen',
    name: 'Nunkirchen – Kleiner Lückner',
    difficulty: 'Leicht',
    distance: 7.2,
    duration: '2:00 h',
    elevationUp: 110,
    elevationDown: 110,
    description: 'Fundlandschaft mit bronzezeitlichem Grabhügel und Dolchklinge der mittleren Hügelgräberbronzezeit.',
    longDescription: 'Der "Kleine Lückner" bei Nunkirchen verbirgt eine bedeutende bronzezeitliche Fundlandschaft. Auf dieser idyllischen Wald- und Wiesenwanderung passieren Sie den gut dokumentierten bronzezeitlichen Hügel B4. Berühmt wurde die Stelle durch den Fund einer prachtvoll verzierten bronzezeitlichen Dolchklinge aus der mittleren Hügelgräberbronzezeit. Ideal für einen entspannten, waldreichen Kulturspaziergang.',
    type: 'Rundwanderweg',
    startPoint: 'Wanderparkplatz Lückner, Nunkirchen, 66687 Wadern',
    startCoords: [49.4950, 6.8450],
    equipment: [
      'Bequeme Schuhe',
      'Regenschutz',
      'Sitzkissen für Pausen'
    ],
    safetyTips: 'Ein sehr einfacher, abwechslungsreicher Weg ohne nennenswerte Schwierigkeiten, ideal für Senioren und Familien.',
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200',
    stopIds: [
      'bronzezeit-nunkirchen-lueckner',
      'bronzezeit-schmelz-bettingen',
      'wareswald'
    ],
    pathCoordinates: [
      [49.4950, 6.8450],
      [49.4880, 6.8550],
      [49.4820, 6.8350],
      [49.4900, 6.8250],
      [49.4950, 6.8450]
    ],
    elevationProfile: [
      { distance: 0, elevation: 280 },
      { distance: 2, elevation: 310 },
      { distance: 4.5, elevation: 330 },
      { distance: 6, elevation: 290 },
      { distance: 7.2, elevation: 280 }
    ]
  },
  {
    id: 'tour-waldhoelzbach',
    name: 'Hochwald-Waldhölzbach',
    difficulty: 'Mittel',
    distance: 8.8,
    duration: '2:30 h',
    elevationUp: 240,
    elevationDown: 240,
    description: 'Fundraum des Kupferbarrens von Waldhölzbach und aussichtsreiche Hochwaldlandschaft.',
    longDescription: 'Waldhölzbach liegt malerisch eingebettet in den Ausläufern des Schwarzwälder Hochwalds. Diese aussichtsreiche Wanderung führt Sie durch den spektakulären "Lachenwald", in dem ein historisch bedeutender urzeitlicher Kupferbarren/Kupferriegel entdeckt wurde. Die Tour bietet reizvolle, raue Hochwaldlandschaften, tiefe Bachtäler und weite Panoramablicke bis weit in den Hunsrück hinein.',
    type: 'Rundwanderweg',
    startPoint: 'Bürgerhaus Waldhölzbach, 66679 Losheim am See',
    startCoords: [49.5350, 6.7110],
    equipment: [
      'Wanderschuhe zwingend ratsam',
      'Trinkflasche',
      'Wind- und Kälteschutz im Hochwald'
    ],
    safetyTips: 'Teils steinige Waldpfade mit mäßig steilen Steigungen. Erfordert gute Trittsicherheit.',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1200',
    stopIds: [
      'bronzezeit-waldhoelzbach-lachenwald',
      'bronzezeit-losheim-einzelfunde',
      'otzenhausen-keltenpark'
    ],
    pathCoordinates: [
      [49.5350, 6.7110],
      [49.5420, 6.7250],
      [49.5480, 6.7000],
      [49.5400, 6.6900],
      [49.5350, 6.7110]
    ],
    elevationProfile: [
      { distance: 0, elevation: 410 },
      { distance: 2.5, elevation: 490 },
      { distance: 5, elevation: 540 },
      { distance: 7, elevation: 460 },
      { distance: 8.8, elevation: 410 }
    ]
  },

  // Category 4: Nonnweiler & Nohfelden (Archäologischer Wanderführer)
  {
    id: 'tour-otzenhausen-dollberg',
    name: 'Dollberg – Keltenpark Otzenhausen',
    difficulty: 'Mittel',
    distance: 5.2,
    duration: '1:45 h',
    elevationUp: 160,
    elevationDown: 160,
    description: 'Verbindung von Naturraum und Archäologie mit Blick auf die keltische Besiedlung des Hochwaldes.',
    longDescription: 'Diese kürzere, erlebnisreiche Rundwanderung verknüpft die urwüchsige Nationalparknatur am Fuße des Dollbergs mit dem beeindruckenden "Keltenpark Otzenhausen". Sie besichtigen das rekonstruierte keltische Dorf direkt am Startpunkt und erfahren auf anschaulichen Schautafeln alles über das Alltagsleben der Kelten, ihre Handwerkskunst und Landwirtschaft im wilden Hochwald.',
    type: 'Rundwanderweg',
    startPoint: 'Keltenpark Otzenhausen, 66620 Nonnweiler',
    startCoords: [49.6130, 6.9960],
    equipment: [
      'Wanderschuhe oder gute Sportschuhe',
      'Regenjacke',
      'Smartphone/Kamera'
    ],
    safetyTips: 'Die Tour verläuft im Nationalparkgebiet. Bitte bleiben Sie auf den markierten Wanderwegen und nehmen Sie Abfälle wieder mit.',
    imageUrl: 'images/dummy-004-hunnenring.jpg',
    stopIds: [
      'otzenhausen-keltenpark',
      'ringwall-otzenhausen',
      'otzenhausen'
    ],
    pathCoordinates: [
      [49.6130, 6.9960],
      [49.6200, 7.0050],
      [49.6150, 7.0120],
      [49.6080, 7.0020],
      [49.6130, 6.9960]
    ],
    elevationProfile: [
      { distance: 0, elevation: 380 },
      { distance: 1.5, elevation: 440 },
      { distance: 3, elevation: 480 },
      { distance: 4.2, elevation: 410 },
      { distance: 5.2, elevation: 380 }
    ]
  },
  {
    id: 'tour-bostalsee',
    name: 'Bostalsee – Eisen – Eckelhausen',
    difficulty: 'Mittel',
    distance: 10.5,
    duration: '2:45 h',
    elevationUp: 130,
    elevationDown: 130,
    description: 'Wanderung durch eine Fundlandschaft mit vorgeschichtlichen und historischen Siedlungsräumen.',
    longDescription: 'Rund um den beliebten Bostalsee erstreckt sich eine reiche archäologische Fundlandschaft. Diese malerische Rundtour führt Sie vom Bostalsee über Eisen nach Eckelhausen. Unterwegs entdecken Sie prähistorische und gallo-römische Siedlungsspuren am Rande des Hochwaldes, untermalt von herrlichen Ausblicken auf das glitzernde Wasser des Bostalsees.',
    type: 'Rundwanderweg',
    startPoint: 'Besucherzentrum Bostalsee, 66625 Nohfelden',
    startCoords: [49.5650, 7.0650],
    equipment: [
      'Bequeme Freizeit- oder Wanderschuhe',
      'Trinkwasser',
      'Sonnenschutz und Kopfbedeckung'
    ],
    safetyTips: 'Sehr schöne Tour, die sich gut mit einem Badetag oder Wassersport am See verbinden lässt. Keine alpinen Gefahren.',
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200',
    stopIds: [
      'otzenhausen-keltenpark',
      'ringwall-otzenhausen',
      'otzenhausen',
      'wareswald'
    ],
    pathCoordinates: [
      [49.5650, 7.0650],
      [49.5750, 7.0500],
      [49.5850, 7.0700],
      [49.5720, 7.0850],
      [49.5650, 7.0650]
    ],
    elevationProfile: [
      { distance: 0, elevation: 325 },
      { distance: 3, elevation: 380 },
      { distance: 6, elevation: 410 },
      { distance: 8.5, elevation: 350 },
      { distance: 10.5, elevation: 325 }
    ]
  },
  {
    id: 'tour-nohfelden-burg',
    name: 'Nohfelden – Burg und Nahetal',
    difficulty: 'Leicht',
    distance: 8.2,
    duration: '2:15 h',
    elevationUp: 120,
    elevationDown: 120,
    description: 'Kombination aus mittelalterlicher Burglandschaft und älteren Siedlungsräumen im Nahetal.',
    longDescription: 'Diese abwechslungsreiche Kulturwanderung verbindet die imposante Kulisse der mittelalterlichen Burg Veldenz in Nohfelden mit den älteren, vorgeschichtlichen Besiedlungsspuren im lieblichen Nahetal. Sie folgen dem Lauf der Nahe durch unberührte Natur, queren historische Pfade und erfahren mehr über Nohfeldens Rolle als jahrhundertealtes Siedlungszentrum.',
    type: 'Rundwanderweg',
    startPoint: 'Burg Nohfelden (Parkplatz), 66625 Nohfelden',
    startCoords: [49.5850, 7.1450],
    equipment: [
      'Bequeme Wanderschuhe',
      'Wetterschutzbekleidung',
      'Kamera für Burgbilder'
    ],
    safetyTips: 'Der Aufstieg auf den Bergfried der Burg lohnt sich wegen der Aussicht, erfordert aber Schwindelfreiheit und Trittsicherheit auf den Stufen.',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1200',
    stopIds: [
      'otzenhausen-keltenpark',
      'ringwall-otzenhausen',
      'wareswald'
    ],
    pathCoordinates: [
      [49.5850, 7.1450],
      [49.5920, 7.1550],
      [49.5980, 7.1350],
      [49.5900, 7.1250],
      [49.5850, 7.1450]
    ],
    elevationProfile: [
      { distance: 0, elevation: 340 },
      { distance: 2, elevation: 390 },
      { distance: 4.5, elevation: 410 },
      { distance: 6.5, elevation: 360 },
      { distance: 8.2, elevation: 340 }
    ]
  },
  {
    id: 'tour-schwarzenbach-peterberg',
    name: 'Schwarzenbach – Peterberg',
    difficulty: 'Schwer',
    distance: 11.5,
    duration: '3:15 h',
    elevationUp: 310,
    elevationDown: 310,
    description: 'Höhenwanderung mit zahlreichen Ausblicken auf die vorgeschichtlichen Verkehrswege des nördlichen Saarlandes.',
    longDescription: 'Eine anspruchsvolle, geschichtsträchtige Höhenwanderung, die Sie von Schwarzenbach hinauf auf den Peterberg führt. Von den exponierten Bergkuppen genießen Sie weite Panoramablicke und blicken hinab auf die Trassen prähistorischer und antiker Handels- und Verkehrswege, die das nördliche Saarland schon vor Jahrtausenden durchkreuzten.',
    type: 'Rundwanderweg',
    startPoint: 'Peterberg Kapelle / Freizeitzentrum Peterberg, 66620 Nonnweiler',
    startCoords: [49.5950, 7.0250],
    equipment: [
      'Robuste Wanderschuhe',
      'Wanderstöcke bei Bedarf',
      'Viel Trinkwasser (anstrengender Aufstieg)'
    ],
    safetyTips: 'Anspruchsvoller Aufstieg mit steileren Abschnitten auf den Peterberg. Ausreichende Kondition vorausgesetzt.',
    imageUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&q=80&w=1200',
    stopIds: [
      'otzenhausen-keltenpark',
      'ringwall-otzenhausen',
      'otzenhausen',
      'wareswald'
    ],
    pathCoordinates: [
      [49.5950, 7.0250],
      [49.6050, 7.0120],
      [49.6150, 7.0300],
      [49.6020, 7.0450],
      [49.5950, 7.0250]
    ],
    elevationProfile: [
      { distance: 0, elevation: 410 },
      { distance: 3, elevation: 520 },
      { distance: 6, elevation: 584 },
      { distance: 9, elevation: 450 },
      { distance: 11.5, elevation: 410 }
    ]
  }
];
