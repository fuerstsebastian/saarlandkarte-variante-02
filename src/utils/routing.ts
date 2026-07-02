export interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
  name: string;
}

export interface RouteResult {
  coordinates: [number, number][]; // [lat, lng]
  distance: number; // meters
  duration: number; // seconds
  steps: RouteStep[];
}

export interface GeocodeResult {
  display_name: string;
  lat: number;
  lng: number;
}

/**
 * Searches for a location in Germany (prioritizing Saarland) using the open-source Nominatim API.
 */
export async function geocodeAddress(query: string): Promise<GeocodeResult[]> {
  if (!query || query.trim().length === 0) return [];
  
  try {
    const formattedQuery = `${query}, Saarland`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formattedQuery)}&countrycodes=de&limit=5`;
    
    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'de',
        'User-Agent': 'ArchaoelogySaarlandProject/1.0'
      }
    });

    if (!response.ok) {
      throw new Error('Nominatim geocoder request failed');
    }

    const data = await response.json();
    return data.map((item: any) => ({
      display_name: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon)
    }));
  } catch (error) {
    console.error('Error in geocodeAddress:', error);
    // Try without "Saarland" if it failed or query was too specific
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=de&limit=5`;
      const response = await fetch(url, {
        headers: {
          'Accept-Language': 'de',
          'User-Agent': 'ArchaoelogySaarlandProject/1.0'
        }
      });
      if (response.ok) {
        const data = await response.json();
        return data.map((item: any) => ({
          display_name: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon)
        }));
      }
    } catch (innerError) {
      console.error('Inner geocode failure:', innerError);
    }
    return [];
  }
}

/**
 * Fetches routing path between start coordinates and destination coordinates using OSRM API.
 * Coordinates are [lat, lng] array.
 */
export async function getOSRMRoute(start: [number, number], dest: [number, number]): Promise<RouteResult | null> {
  const [startLat, startLng] = start;
  const [destLat, destLng] = dest;

  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${destLng},${destLat}?overview=full&geometries=geojson&steps=true`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('OSRM routing request failed');
    }

    const data = await response.json();
    
    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      return null;
    }

    const route = data.routes[0];
    
    // OSRM coordinates are in [lng, lat], flip to [lat, lng] for Pigeon-maps
    const coordinates: [number, number][] = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
    
    // Parse steps for navigation guide
    const steps: RouteStep[] = [];
    if (route.legs && route.legs[0] && route.legs[0].steps) {
      route.legs[0].steps.forEach((step: any) => {
        const maneuver = step.maneuver;
        const name = step.name || '';
        let instruction = '';

        // Generate German instructions based on maneuver types
        switch (maneuver.type) {
          case 'depart':
            instruction = name ? `Starten Sie in Richtung ${name}` : 'Starten Sie Ihre Fahrt';
            break;
          case 'turn':
            let direction = '';
            if (maneuver.modifier === 'left') direction = 'links';
            if (maneuver.modifier === 'right') direction = 'rechts';
            if (maneuver.modifier === 'sharp left') direction = 'scharf links';
            if (maneuver.modifier === 'sharp right') direction = 'scharf rechts';
            if (maneuver.modifier === 'slight left') direction = 'halb links';
            if (maneuver.modifier === 'slight right') direction = 'halb rechts';
            instruction = `Biegen Sie ${direction} ab${name ? ` auf ${name}` : ''}`;
            break;
          case 'continue':
            instruction = `Fahren Sie geradeaus weiter${name ? ` auf ${name}` : ''}`;
            break;
          case 'roundabout':
            instruction = `Nehmen Sie im Kreisverkehr die ${maneuver.exit || 'nächste'} Ausfahrt${name ? ` auf ${name}` : ''}`;
            break;
          case 'merge':
            instruction = `Fädeln Sie sich ein${name ? ` auf ${name}` : ''}`;
            break;
          case 'on ramp':
            instruction = `Fahren Sie auf die Auffahrt${name ? ` in Richtung ${name}` : ''}`;
            break;
          case 'off ramp':
            instruction = `Fahren Sie von der Abfahrt ab${name ? ` auf ${name}` : ''}`;
            break;
          case 'arrive':
            instruction = 'Sie haben Ihr Ziel erreicht';
            break;
          default:
            instruction = maneuver.modifier 
              ? `${maneuver.type} (${maneuver.modifier})${name ? ` auf ${name}` : ''}`
              : `Folgen Sie dem Straßenverlauf${name ? ` auf ${name}` : ''}`;
        }
        
        steps.push({
          instruction,
          distance: step.distance,
          duration: step.duration,
          name: step.name
        });
      });
    }

    return {
      coordinates,
      distance: route.distance,
      duration: route.duration,
      steps
    };
  } catch (error) {
    console.error('Error fetching OSRM Route:', error);
    return null;
  }
}

/**
 * Format meters into km or meters display string.
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Format seconds into hours and minutes display string.
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours} Std. ${minutes} Min.`;
  }
  return `${minutes} Min.`;
}
