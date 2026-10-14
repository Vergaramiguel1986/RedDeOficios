import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TradeWorker, Neighborhood } from '../types';

interface MapTerritorialProps {
  workers: TradeWorker[];
  selectedWorkerId: string | null;
  onSelectWorker: (workerId: string) => void;
  radiusKm: number;
  onRadiusChange?: (radius: number) => void;
  onContactWorker: (worker: TradeWorker) => void;
  onViewWorkerDetails: (worker: TradeWorker) => void;
  selectedNeighborhood?: Neighborhood;
}

// Center fallback: Plaza Echeverría, Villa Urquiza, Comuna 12, CABA
const FALLBACK_CENTER: [number, number] = [-34.5735, -58.4878];

// Real geographic boundaries of Comuna 12 (Villa Urquiza, Saavedra, Coghlan, Villa Pueyrredón)
const COMUNA_12_BOUNDARY: [number, number][] = [
  [-34.5440, -58.4960], // Av. General Paz & Panamericana
  [-34.5420, -58.4820], // Saavedra norte / Parque Saavedra
  [-34.5580, -58.4680], // Coghlan este / Av. Balbín
  [-34.5700, -58.4650], // Límite con Belgrano R / Av. Monroe
  [-34.5820, -58.4790], // Av. de los Incas / La Pampa
  [-34.5880, -58.4980], // Villa Pueyrredón / Av. Constituyentes
  [-34.5750, -58.5140], // Av. General Paz & Constituyentes
  [-34.5580, -58.5080], // General Paz & Albarellos
  [-34.5440, -58.4960], // Loop closure
];

// Real geographic boundaries of Comuna 13 (Belgrano, Belgrano R, Colegiales, Núñez)
const COMUNA_13_BOUNDARY: [number, number][] = [
  [-34.5360, -58.4620], // Av. General Paz & Libertador
  [-34.5460, -58.4450], // Núñez este / Costanera
  [-34.5600, -58.4380], // Barrancas de Belgrano / Libertador
  [-34.5760, -58.4460], // Límite Colegiales - Palermo / Dorrego
  [-34.5850, -58.4550], // Av. Álvarez Thomas & Av. Dorrego
  [-34.5780, -58.4700], // Av. Elcano & Virrey del Pino
  [-34.5650, -58.4650], // Av. Monroe & Crámer
  [-34.5520, -58.4720], // Límite Saavedra - Núñez
  [-34.5360, -58.4620], // Loop closure
];

export const MapTerritorial: React.FC<MapTerritorialProps> = ({
  workers,
  selectedWorkerId,
  onSelectWorker,
  radiusKm,
  onRadiusChange,
  onContactWorker,
  onViewWorkerDetails,
  selectedNeighborhood,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const boundaryPolygonRef = useRef<L.Polygon | null>(null);

  const activeCenter = selectedNeighborhood?.coords ?? FALLBACK_CENTER;

  // Initialize real Leaflet map once
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Create real interactive map with Leaflet centered at selected neighborhood
    const map = L.map(mapContainerRef.current, {
      center: activeCenter,
      zoom: 15,
      zoomControl: false, // Custom clean buttons
      attributionControl: false,
    });

    // Add high quality, clean real map tile layer (OpenStreetMap free tile servers)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Municipality Boundary outline polygon based on active zone / comuna
    const getBoundaryCoords = (n?: Neighborhood): [number, number][] => {
      if (n?.comuna === 'Comuna 13') return COMUNA_13_BOUNDARY;
      if (n?.comuna === 'Comuna 12') return COMUNA_12_BOUNDARY;
      const center = n?.coords ?? FALLBACK_CENTER;
      const [lat, lng] = center;
      const dLat = 0.024;
      const dLng = 0.032;
      return [
        [lat + dLat, lng - dLng * 0.7],
        [lat + dLat * 1.1, lng],
        [lat + dLat * 0.8, lng + dLng * 0.8],
        [lat, lng + dLng * 1.15],
        [lat - dLat * 0.8, lng + dLng * 0.9],
        [lat - dLat * 1.1, lng],
        [lat - dLat * 0.9, lng - dLng * 0.8],
        [lat, lng - dLng * 1.1],
        [lat + dLat, lng - dLng * 0.7],
      ];
    };

    const boundaryCoords = getBoundaryCoords(selectedNeighborhood);
    const boundaryPolygon = L.polygon(boundaryCoords, {
      color: '#2A5C8A',
      weight: 2,
      dashArray: '6, 6',
      fillColor: '#2A5C8A',
      fillOpacity: 0.04,
    }).addTo(map);
    boundaryPolygonRef.current = boundaryPolygon;

    // User click on map background closes open worker card
    map.on('click', () => {
      onSelectWorker('');
    });

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      layerGroupRef.current = null;
      boundaryPolygonRef.current = null;
    };
  }, []);

  // Update center smoothly when neighborhood selection changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedNeighborhood) return;

    const targetZoom = radiusKm <= 1 ? 16 : radiusKm <= 2 ? 15 : radiusKm <= 3.5 ? 14 : 13;
    map.flyTo(selectedNeighborhood.coords, targetZoom, {
      duration: 1.0,
      easeLinearity: 0.25,
    });

    // Update boundary polygon for dynamic locality / comuna
    if (boundaryPolygonRef.current) {
      if (selectedNeighborhood.comuna === 'Comuna 13') {
        boundaryPolygonRef.current.setLatLngs(COMUNA_13_BOUNDARY);
      } else if (selectedNeighborhood.comuna === 'Comuna 12') {
        boundaryPolygonRef.current.setLatLngs(COMUNA_12_BOUNDARY);
      } else {
        const [lat, lng] = selectedNeighborhood.coords;
        const dLat = 0.024;
        const dLng = 0.032;
        boundaryPolygonRef.current.setLatLngs([
          [lat + dLat, lng - dLng * 0.7],
          [lat + dLat * 1.1, lng],
          [lat + dLat * 0.8, lng + dLng * 0.8],
          [lat, lng + dLng * 1.15],
          [lat - dLat * 0.8, lng + dLng * 0.9],
          [lat - dLat * 1.1, lng],
          [lat - dLat * 0.9, lng - dLng * 0.8],
          [lat, lng - dLng * 1.1],
          [lat + dLat, lng - dLng * 0.7],
        ]);
      }
    }
  }, [selectedNeighborhood?.id]);

  // Update dynamic elements: Radius circle, User location pin, and Worker markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    // Clear previous dynamic layers
    layerGroup.clearLayers();

    const center = selectedNeighborhood?.coords ?? FALLBACK_CENTER;
    const zoneName = selectedNeighborhood?.name ?? 'Villa Urquiza';
    const zoneDesc = selectedNeighborhood?.description ?? 'Plaza Echeverría';

    // 1. Draw Real Geographic Radius Circle centered dynamically on the selected zone
    const radiusMeters = radiusKm * 1000;
    const radiusCircle = L.circle(center, {
      radius: radiusMeters,
      color: '#2A5C8A',
      weight: 2,
      fillColor: '#FFC067',
      fillOpacity: 0.14,
      dashArray: '6, 6',
    });
    layerGroup.addLayer(radiusCircle);

    // 2. User Center Pin (Dynamic for selected neighborhood)
    const userIcon = L.divIcon({
      className: 'user-custom-pin',
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px;">
          <div style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: rgba(42, 92, 138, 0.35); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: relative; width: 18px; height: 18px; border-radius: 50%; background: #2A5C8A; border: 3px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.35);"></div>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });

    const userMarker = L.marker(center, {
      icon: userIcon,
      zIndexOffset: 1000,
    }).bindTooltip(`Tu ubicación activa · ${zoneName} (${zoneDesc})`, {
      direction: 'top',
      offset: [0, -10],
      className: 'bg-[#2C3E50] text-white text-xs font-bold rounded-lg px-2 py-1',
    });
    layerGroup.addLayer(userMarker);

    // 3. Worker Markers within the radius
    workers.forEach((worker) => {
      const isSelected = worker.id === selectedWorkerId;
      const lat = worker.mapCoords.lat || center[0] + (worker.mapCoords.y - 300) * 0.00008;
      const lng = worker.mapCoords.lng || center[1] + (worker.mapCoords.x - 350) * 0.0001;

      const markerHtml = `
        <div style="cursor: pointer; display: flex; flex-direction: column; align-items: center; transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'}; transition: transform 0.2s ease;">
          <div style="width: 38px; height: 38px; border-radius: 50%; border: 3px solid ${isSelected ? '#FFC067' : '#2A5C8A'}; background: #ffffff; box-shadow: 0 3px 10px rgba(0,0,0,0.3); overflow: hidden; position: relative;">
            <img src="${worker.avatarUrl}" alt="${worker.name}" style="width: 100%; height: 100%; object-fit: cover;" />
            ${worker.verified ? '<div style="position: absolute; bottom: 0; right: 0; width: 12px; height: 12px; border-radius: 50%; background: #2ECC71; border: 1.5px solid #ffffff;"></div>' : ''}
          </div>
          <div style="margin-top: 3px; background: ${isSelected ? '#2A5C8A' : '#ffffff'}; color: ${isSelected ? '#ffffff' : '#2C3E50'}; font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 6px; border: 1px solid #E2E8F0; box-shadow: 0 1px 4px rgba(0,0,0,0.15); white-space: nowrap;">
            ${worker.name.split(' ')[0]}
          </div>
        </div>
      `;

      const workerIcon = L.divIcon({
        className: `worker-marker-${worker.id}`,
        html: markerHtml,
        iconSize: [42, 54],
        iconAnchor: [21, 27],
      });

      const workerMarker = L.marker([lat, lng], {
        icon: workerIcon,
        zIndexOffset: isSelected ? 900 : 500,
      });

      workerMarker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        onSelectWorker(isSelected ? '' : worker.id);
      });

      layerGroup.addLayer(workerMarker);
    });

    // Adjust zoom smoothly when radius changes
    const targetZoom = radiusKm <= 1 ? 16 : radiusKm <= 2 ? 15 : radiusKm <= 3.5 ? 14 : 13;
    if (map.getZoom() !== targetZoom) {
      map.setZoom(targetZoom);
    }
  }, [workers, selectedWorkerId, radiusKm, selectedNeighborhood]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleRecenter = () => {
    const center = selectedNeighborhood?.coords ?? FALLBACK_CENTER;
    mapInstanceRef.current?.setView(center, radiusKm <= 1 ? 16 : 15, {
      animate: true,
    });
  };

  const selectedWorker = selectedWorkerId
    ? workers.find((w) => w.id === selectedWorkerId) || null
    : null;

  const [radiusBarExpanded, setRadiusBarExpanded] = useState(true);

  // If a worker is selected, automatically collapse the radius bar so it doesn't overlap or cover the worker card
  useEffect(() => {
    if (selectedWorkerId) {
      setRadiusBarExpanded(false);
    } else {
      setRadiusBarExpanded(true);
    }
  }, [selectedWorkerId]);

  return (
    <div className="relative h-[600px] md:h-[660px] rounded-2xl border border-[#D5D5D5] shadow-sm select-none font-['Roboto',sans-serif] overflow-hidden">
      {/* 
        Real Leaflet Map Element:
        - Free of hand-drawn vector mockup lines
        - Real geographic streets, railway, parks, and municipality boundaries
        - No internal scrollbar (overflow-hidden)
      */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Municipality & Active Radius Selection Bar on Map */}
      <div className="absolute top-3.5 left-3.5 right-14 sm:right-auto z-[450] pointer-events-auto flex flex-col gap-2 max-w-sm sm:max-w-md">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.18)] p-2.5 sm:p-3 border border-slate-200 text-[#2C3E50] space-y-2">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setRadiusBarExpanded(!radiusBarExpanded)}
              className="flex items-center gap-2 text-left hover:opacity-85 transition-opacity cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px] text-[#2A5C8A]">map</span>
              <div>
                <span className="text-xs font-bold text-[#202124] block leading-tight">
                  Municipio: {selectedNeighborhood?.comuna ?? 'Comuna 12'} ({selectedNeighborhood?.name ?? 'Villa Urquiza'})
                </span>
                <span className="text-[10px] text-[#70757A] flex items-center gap-1">
                  <span>Radio: <strong>{radiusKm} km</strong></span>
                  <span>•</span>
                  <span>{workers.length} oficios</span>
                  <span>•</span>
                  <span className="truncate max-w-[120px]">{selectedNeighborhood?.description ?? 'Plaza Echeverría'}</span>
                  <span className="material-symbols-outlined text-[14px] text-[#2A5C8A]">
                    {radiusBarExpanded ? 'expand_less' : 'expand_more'}
                  </span>
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={handleRecenter}
              className="w-7 h-7 rounded-lg bg-[#EDF4FF] hover:bg-[#D0E4FF] text-[#2A5C8A] flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title={`Centrar en ${selectedNeighborhood?.name ?? 'Villa Urquiza'}`}
            >
              <span className="material-symbols-outlined text-[16px]">my_location</span>
            </button>
          </div>

          {/* Interactive Radius Selection Bar directly on the map (collapsible when worker is open) */}
          {onRadiusChange && radiusBarExpanded && (
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6C7A89] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-[#2A5C8A]">radar</span>
                  <span>Radio del mapa:</span>
                </span>
                <span className="font-extrabold text-[#2A5C8A] bg-[#EDF4FF] px-2.5 py-0.5 rounded-full text-xs">
                  {radiusKm} km a la redonda
                </span>
              </div>

              {/* Slider Range Bar */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-bold">0.5km</span>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.5"
                  value={radiusKm}
                  onChange={(e) => onRadiusChange(parseFloat(e.target.value))}
                  className="flex-1 accent-[#2A5C8A] cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                  aria-label="Barra para seleccionar el radio del mapa"
                />
                <span className="text-[10px] text-slate-400 font-bold">5km</span>
              </div>

              {/* Quick Preset Buttons */}
              <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                {[1, 2, 3, 5].map((km) => (
                  <button
                    key={km}
                    type="button"
                    onClick={() => onRadiusChange(km)}
                    className={`py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      radiusKm === km
                        ? 'bg-[#2A5C8A] text-white shadow-2xs font-extrabold'
                        : 'bg-slate-100 hover:bg-slate-200 text-[#6C7A89]'
                    }`}
                  >
                    {km} km
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom Clean Zoom Buttons (Right side) */}
      <div className="absolute top-3.5 right-3.5 z-[450] flex flex-col gap-1.5 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col border border-slate-200">
          <button
            type="button"
            onClick={handleZoomIn}
            className="w-9 h-9 flex items-center justify-center text-[#3C4043] hover:bg-[#F1F3F4] active:bg-[#E8EAED] transition-colors cursor-pointer"
            title="Acercar mapa"
            aria-label="Acercar mapa"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>
          <div className="h-[1px] bg-slate-200 w-full" />
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-9 h-9 flex items-center justify-center text-[#3C4043] hover:bg-[#F1F3F4] active:bg-[#E8EAED] transition-colors cursor-pointer"
            title="Alejar mapa"
            aria-label="Alejar mapa"
          >
            <span className="material-symbols-outlined text-[20px]">remove</span>
          </button>
        </div>
      </div>

      {/* 
        Selected Worker Info Window Popup:
        Includes explicit close button ('X') to dismiss the card
      */}
      {selectedWorker && (
        <div
          className="absolute bottom-5 left-3 right-3 sm:left-4 sm:right-auto sm:w-[360px] bg-white/98 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.25)] border border-[#DADCE0] p-4 z-[500] animate-in fade-in slide-in-from-bottom-3 duration-200 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={selectedWorker.avatarUrl}
                alt={selectedWorker.name}
                className="w-13 h-13 rounded-full object-cover border-2 border-[#2A5C8A] shadow-xs shrink-0"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-base text-[#202124] leading-tight">
                    {selectedWorker.name}
                  </h3>
                  {selectedWorker.verified && (
                    <span className="material-symbols-outlined text-[16px] text-[#2ECC71]" title="Oficio Verificado">
                      verified
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-[#2A5C8A]">{selectedWorker.tradeTitle}</p>
                <div className="flex items-center gap-1.5 mt-1 text-xs">
                  <span className="font-bold text-[#E37400]">
                    ★ {selectedWorker.rating.toFixed(1)}
                  </span>
                  <span className="text-[#70757A]">({selectedWorker.reviewsCount} reseñas)</span>
                  <span className="text-[#DADCE0]">•</span>
                  <span className="text-[#137333] font-semibold">Disponible</span>
                </div>
              </div>
            </div>

            {/* Close button (✕) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectWorker('');
              }}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#5F6368] hover:text-[#202124] flex items-center justify-center transition-colors shadow-2xs cursor-pointer shrink-0"
              title="Cerrar ventana del prestador"
              aria-label="Cerrar ventana"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <p className="text-xs text-[#5F6368] mt-2.5 line-clamp-2 leading-relaxed bg-[#F8FAFC] p-2 rounded-lg border border-slate-100">
            {selectedWorker.bio}
          </p>

          <div className="mt-2.5 pt-2 border-t border-[#E8EAED] flex items-center justify-between text-xs text-[#70757A]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">location_on</span>
              <span>{selectedWorker.address}</span>
            </span>
            <span className="font-bold text-[#202124]">A {selectedWorker.distanceMeters} m</span>
          </div>

          {/* Action Buttons */}
          <div className="mt-3 grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => onContactWorker(selectedWorker)}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#FFC067] hover:brightness-95 text-[#2C3E50] rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span>Contactar</span>
            </button>
            <button
              type="button"
              onClick={() => onViewWorkerDetails(selectedWorker)}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-[#F8F9FA] text-[#2A5C8A] border border-[#DADCE0] rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span>Ver perfil</span>
            </button>
          </div>
        </div>
      )}

      {/* Map Bottom Footer Note */}
      <div className="absolute bottom-2 left-3 z-400 pointer-events-none select-none">
        <div className="bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-semibold text-[#6C7A89] border border-black/5 shadow-2xs">
          <span>Mapa Barrial · {selectedNeighborhood?.comuna ?? 'Comuna 12'} ({selectedNeighborhood?.name ?? 'Villa Urquiza'}) · © OpenStreetMap</span>
        </div>
      </div>
    </div>
  );
};
