
import React from 'react';
import { Location } from '../types';

interface MapViewProps {
  location: Location | null | undefined;
  error: string | null;
}

const MapView: React.FC<MapViewProps> = ({ location, error }) => {
  const lat = location?.latitude ?? 28.6139;
  const lon = location?.longitude ?? 77.2090;
  
  // Using a static map image placeholder to avoid needing a live API key
  const mapImageUrl = `https://picsum.photos/seed/${lat},${lon}/600/400`;

  return (
    <div className="bg-brand-secondary p-6 rounded-2xl shadow-lg h-full flex flex-col">
      <h3 className="text-xl font-semibold text-gray-300 mb-4">GPS Location</h3>
      <div className="relative flex-grow rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center">
        <img src={mapImageUrl} alt="Map of current location" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-brand-accent rounded-full animate-ping"></div>
            <div className="absolute w-3 h-3 bg-brand-accent rounded-full border-2 border-white"></div>
        </div>
        <div className="absolute bottom-2 left-2 bg-black/50 p-2 rounded text-xs">
            <p>Lat: {lat.toFixed(4)}</p>
            <p>Lon: {lon.toFixed(4)}</p>
        </div>
         {error && <div className="absolute top-2 left-2 bg-brand-warning/80 text-black p-2 rounded text-xs">{error}</div>}
      </div>
    </div>
  );
};

export default MapView;
