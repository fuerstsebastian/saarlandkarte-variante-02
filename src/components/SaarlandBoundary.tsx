import React from 'react';

// Simplified border polygon coordinates for Saarland (lat, lng pairs)
export const SAARLAND_BORDER_COORDS: [number, number][] = [
  [49.467, 6.375], // Perl
  [49.508, 6.368], // Nennig
  [49.530, 6.356], // Westernmost point near Lux border
  [49.542, 6.410], // Sinz
  [49.560, 6.425], // Orscholz (Saarschleife)
  [49.580, 6.450], // Mettlach / Weiten
  [49.600, 6.510], // Saarhölzbach
  [49.620, 6.550], // Britten
  [49.610, 6.590], // Rimlingen
  [49.610, 6.640], // Waldhölzbach
  [49.620, 6.720], // Rappweiler
  [49.630, 6.780], // Weiskirchen north
  [49.638, 6.840], // Nonnweiler north
  [49.634, 6.900], // Sötern
  [49.630, 6.960], // Nohfelden north
  [49.625, 7.020], // Wolfersweiler
  [49.615, 7.080], // Freisen / Asweiler
  [49.605, 7.150], // Freisen east border
  [49.610, 7.220], // Oberkirchen northeast
  [49.580, 7.260], // Grügelborn
  [49.555, 7.285], // Haupersweiler
  [49.500, 7.300], // Osterbrücken
  [49.444, 7.373], // Jägersburg / Homburg east
  [49.380, 7.370], // Homburg east
  [49.330, 7.382], // Bexbach east
  [49.290, 7.390], // Kirkel south
  [49.253, 7.404], // Einöd east / Zweibrücken border
  [49.190, 7.400], // Wattweiler / Einöd
  [49.170, 7.360], // Webweiler
  [49.155, 7.330], // Altheim / Brenschelbach
  [49.130, 7.290], // Peppenkum
  [49.112, 7.250], // Gersheim southernmost corner (Utweiler)
  [49.120, 7.180], // Reinheim / Bliesbruck border
  [49.115, 7.150], // Habkirchen
  [49.114, 7.114], // Bliesransbach border
  [49.130, 7.000], // Rilchingen-Hanweiler (Saar river)
  [49.150, 6.990], // Kleinblittersdorf
  [49.170, 6.980], // Güdingen / Sarreguemines border
  [49.190, 6.970], // Saarbrücken south border
  [49.198, 6.850], // Forbach border / Schöntal
  [49.195, 6.820], // Großrosseln / Nassweiler
  [49.210, 6.780], // Warndt forest
  [49.230, 6.740], // Karlsbrunn
  [49.255, 6.680], // Überherrn border
  [49.270, 6.640], // Ittersdorf
  [49.298, 6.611], // Leidingen (divided street border)
  [49.310, 6.590], // Ihn / Berviller border
  [49.340, 6.565], // Oberesch
  [49.360, 6.550], // Tünsdorf south
  [49.390, 6.540], // Nohn / Bethingen
  [49.410, 6.500], // Wehingen
  [49.430, 6.460], // Keuchingen / Saar river
];

interface SaarlandBoundaryProps {
  // Injected by Pigeon Maps automatically when placed inside <Map>
  latLngToPixel?: (latLng: [number, number]) => [number, number];
}

export const SaarlandBoundary: React.FC<SaarlandBoundaryProps> = ({ latLngToPixel }) => {
  if (!latLngToPixel) return null;

  try {
    // Convert geographic coordinates to map screen coordinates
    const pixelPoints = SAARLAND_BORDER_COORDS.map(coord => latLngToPixel(coord));
    
    // Create points string for glowing stroke polyline
    const pointsString = pixelPoints.map(([x, y]) => `${x},${y}`).join(' ');

    // Set up points list for evenodd cutout path
    // Large bounding box to mask out neighboring regions
    const outerBox = 'M -5000,-5000 H 15000 V 15000 H -5000 Z';
    
    // Build path commands for Saarland boundary cutout
    const boundaryPath = pixelPoints.reduce((path, [x, y], idx) => {
      if (idx === 0) {
        return `M ${x},${y}`;
      }
      return `${path} L ${x},${y}`;
    }, '') + ' Z';

    // Combine outer box and inner boundary cutout to achieve frosted-glass masking of outer areas
    const maskPathD = `${outerBox} ${boundaryPath}`;

    return (
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 5, // Draw above map tiles, below marker pins (which have z-index ~10 or more)
        }}
      >
        {/* Semi-transparent outer dark mask using evenodd fill rule */}
        <path
          d={maskPathD}
          fill="rgba(28, 25, 23, 0.42)" // Warm slate dark mask for neighboring countries/states (Lux, France, RLP)
          fillRule="evenodd"
          className="transition-all duration-300 pointer-events-none"
        />

        {/* Wide outer glow-stroke for boundary */}
        <polyline
          points={pointsString}
          fill="none"
          stroke="#10b981" // emerald-500
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.12"
          className="pointer-events-none"
        />

        {/* Medium accent glow-stroke */}
        <polyline
          points={pointsString}
          fill="none"
          stroke="#059669" // emerald-600
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.3"
          className="pointer-events-none"
        />

        {/* Sharp inner high-contrast gold/emerald line to cleanly demarcate */}
        <polyline
          points={pointsString}
          fill="none"
          stroke="#22c55e" // green-500 or emerald
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
          strokeDasharray="6,4" // Dash offset animation makes it look incredibly rich and premium
          className="pointer-events-none animate-dash"
        />
      </svg>
    );
  } catch (error) {
    console.error('Error drawing Saarland boundary:', error);
    return null;
  }
};
