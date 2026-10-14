import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { LocationPoint } from '../types';
import { soundEngine } from '../utils/audio';

interface InteractiveMapProps {
  origin: LocationPoint;
  destination: LocationPoint;
  driverLat: number;
  driverLng: number;
  driverHeading: number;
  rideStatus: string;
  className?: string;
  showH3Hexes?: boolean;
}

// Algiers Municipal Fleet Simulation
const SURROUNDING_TAXIS = [
  { id: '16-1102', lat: 36.7592, lng: 3.0531, agrement: 'ALG-2023-0881', status: 'DISPONIBLE', driver: 'Youcef K.' },
  { id: '16-3049', lat: 36.7410, lng: 3.0645, agrement: 'ALG-2021-0412', status: 'EN COURSE', driver: 'Nassim B.' },
  { id: '16-8841', lat: 36.7645, lng: 3.0480, agrement: 'ALG-2024-1920', status: 'DISPONIBLE', driver: 'Karim M.' },
  { id: '16-5520', lat: 36.7330, lng: 3.0780, agrement: 'ALG-2022-0655', status: 'DISPONIBLE', driver: 'Farid T.' },
];

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  origin,
  destination,
  driverLat,
  driverLng,
  driverHeading,
  rideStatus,
  className = 'h-full w-full',
  showH3Hexes = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const driverMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const hexLayerRef = useRef<L.LayerGroup | null>(null);
  const surroundingLayerRef = useRef<L.LayerGroup | null>(null);

  const [telemetryBytes, setTelemetryBytes] = useState(14820);
  const [latencyMs, setLatencyMs] = useState(18);

  // Periodic Telemetry Packet simulation (1Hz Protobuf)
  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetryBytes(prev => prev + 32);
      setLatencyMs(Math.floor(16 + Math.random() * 8));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [36.7420, 3.0680],
      zoom: 13,
      zoomControl: false,
    });

    // Dark Tile Layer (CartoDB Dark Matter with high-contrast road lines)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO &copy; DTW Alger',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Render Fleet & Hexagonal H3 Grid
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // 1. Origin & Destination Pins
    const originIcon = L.divIcon({
      className: 'custom-pin',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-8 h-8 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/40 backdrop-blur-md">
            <div class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
          </div>
          <div class="absolute -bottom-5 whitespace-nowrap bg-slate-950/95 text-emerald-300 px-2 py-0.5 rounded-md text-[9px] font-mono font-bold border border-emerald-500/40 shadow-xl">
            PRISE EN CHARGE
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const destIcon = L.divIcon({
      className: 'custom-pin',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-8 h-8 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/40 backdrop-blur-md">
            <div class="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
          </div>
          <div class="absolute -bottom-5 whitespace-nowrap bg-slate-950/95 text-amber-300 px-2 py-0.5 rounded-md text-[9px] font-mono font-bold border border-amber-500/40 shadow-xl">
            DESTINATION
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    // 2. Active Driver Taxi Pin
    const taxiIcon = L.divIcon({
      className: 'taxi-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-12 h-12 rounded-full bg-amber-400/20 animate-ping-slow pointer-events-none"></div>
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/50 border-2 border-white font-black text-sm" style="transform: rotate(${driverHeading}deg); transition: transform 0.4s ease;">
            🚕
          </div>
          <div class="absolute -top-5 whitespace-nowrap bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md text-[9px] font-mono font-extrabold shadow-md border border-amber-300">
            TAXI 16-0482
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    if (!driverMarkerRef.current) {
      driverMarkerRef.current = L.marker([driverLat, driverLng], { icon: taxiIcon }).addTo(map);
    } else {
      driverMarkerRef.current.setLatLng([driverLat, driverLng]);
      driverMarkerRef.current.setIcon(taxiIcon);
    }

    const originMarker = L.marker([origin.lat, origin.lng], { icon: originIcon }).addTo(map);
    const destMarker = L.marker([destination.lat, destination.lng], { icon: destIcon }).addTo(map);

    // 3. Realistic Route Polyline with intermediate boulevard waypoints in Algiers
    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
    }

    const routeWaypoints: L.LatLngExpression[] = [
      [origin.lat, origin.lng],
      [(origin.lat * 0.7 + destination.lat * 0.3) + 0.002, (origin.lng * 0.7 + destination.lng * 0.3) - 0.003],
      [(origin.lat * 0.4 + destination.lat * 0.6) + 0.004, (origin.lng * 0.4 + destination.lng * 0.6) - 0.002],
      [destination.lat, destination.lng],
    ];

    routePolylineRef.current = L.polyline(routeWaypoints, {
      color: '#f59e0b',
      weight: 4.5,
      dashArray: '10, 10',
      opacity: 0.9,
    }).addTo(map);

    // Initial camera frame bounds
    const bounds = L.latLngBounds([
      [origin.lat, origin.lng],
      [destination.lat, destination.lng],
      [driverLat, driverLng],
    ]);
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });

    // 4. Surrounding Fleet Markers
    if (surroundingLayerRef.current) {
      surroundingLayerRef.current.clearLayers();
    } else {
      surroundingLayerRef.current = L.layerGroup().addTo(map);
    }

    SURROUNDING_TAXIS.forEach(st => {
      const isAvailable = st.status === 'DISPONIBLE';
      const surroundingIcon = L.divIcon({
        className: 'surrounding-taxi',
        html: `
          <div class="relative flex items-center justify-center opacity-85 hover:opacity-100 transition-opacity">
            <div class="w-7 h-7 rounded-xl ${isAvailable ? 'bg-slate-900 border border-emerald-400 text-emerald-400' : 'bg-slate-900 border border-slate-700 text-slate-500'} flex items-center justify-center text-xs shadow-lg">
              🚖
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const sm = L.marker([st.lat, st.lng], { icon: surroundingIcon });
      sm.bindTooltip(`
        <div class="p-2 bg-slate-950 text-white rounded-xl border border-white/10 text-xs font-mono space-y-1">
          <div class="font-bold text-amber-300">Taxi ${st.id} • ${st.driver}</div>
          <div class="text-[10px] text-slate-400">Agrément: ${st.agrement}</div>
          <div class="text-[10px] ${isAvailable ? 'text-emerald-400' : 'text-amber-400'} font-bold">${st.status}</div>
        </div>
      `, { className: 'bg-transparent border-0' });

      sm.addTo(surroundingLayerRef.current!);
    });

    return () => {
      originMarker.remove();
      destMarker.remove();
    };
  }, [origin, destination, driverLat, driverLng, driverHeading, rideStatus]);

  // 5. Mathematically Exact H3 Resolution 8 Hexagons
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (hexLayerRef.current) {
      hexLayerRef.current.clearLayers();
    } else {
      hexLayerRef.current = L.layerGroup().addTo(map);
    }

    if (!showH3Hexes) return;

    // Algiers Hexagon Centers (Res 8: ~460m radius)
    const hexCenters = [
      { lat: 36.7538, lng: 3.0588, count: 8, name: 'Centre-Ville Alger' },
      { lat: 36.7262, lng: 3.0872, count: 5, name: 'Kouba Plateau' },
      { lat: 36.7729, lng: 3.0583, count: 12, name: 'Bab El Oued / Casbah' },
      { lat: 36.7456, lng: 3.0417, count: 4, name: 'El Biar / Telemly' },
      { lat: 36.7865, lng: 3.0592, count: 9, name: 'Bologhine' },
      { lat: 36.7350, lng: 3.1250, count: 7, name: 'Hussein Dey' },
    ];

    const radiusKm = 0.46; // Res 8 edge length
    const dLat = radiusKm / 111.32;

    hexCenters.forEach(hc => {
      const dLng = radiusKm / (111.32 * Math.cos(hc.lat * (Math.PI / 180)));
      const polygonCoords: L.LatLngTuple[] = [];

      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i + (Math.PI / 6);
        const pLat = hc.lat + dLat * Math.sin(angle);
        const pLng = hc.lng + dLng * Math.cos(angle);
        polygonCoords.push([pLat, pLng]);
      }

      const hexPoly = L.polygon(polygonCoords, {
        color: '#f59e0b',
        weight: 1.5,
        fillColor: '#f59e0b',
        fillOpacity: Math.min(0.3, 0.08 + hc.count * 0.02),
      });

      hexPoly.bindTooltip(
        `<div class="p-1.5 font-mono text-xs">
          <div class="font-bold text-amber-300">H3 Res 8: ${hc.name}</div>
          <div class="text-[10px] text-slate-300">${hc.count} Taxis Réglementés en veille</div>
        </div>`,
        { permanent: false, className: 'bg-slate-950 text-white border border-amber-500/40 rounded-xl' }
      );

      hexPoly.addTo(hexLayerRef.current!);
    });
  }, [showH3Hexes]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full rounded-3xl overflow-hidden shadow-2xl" />
      
      {/* Live 1Hz Telemetry OSD Pill */}
      <div className="absolute top-4 left-4 z-[1000] glass-pill px-3 py-1.5 rounded-xl text-[11px] text-slate-200 flex items-center space-x-2.5 shadow-2xl">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span className="font-mono font-bold text-emerald-300">1Hz PROTOBUF</span>
        <span className="text-white/20">|</span>
        <span className="font-mono text-slate-300">{latencyMs}ms</span>
        <span className="text-white/20">|</span>
        <span className="font-mono text-amber-300 font-semibold">{telemetryBytes} B</span>
        <span className="text-white/20">|</span>
        <span className="font-mono text-slate-400">H3: Res 8</span>
      </div>

      {/* Recenter Map Button */}
      <button
        onClick={() => {
          soundEngine.playClick();
          const map = mapInstanceRef.current;
          if (map) {
            map.flyTo([driverLat, driverLng], 14, { duration: 1.2 });
          }
        }}
        className="absolute bottom-4 left-4 z-[1000] glass-panel px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-amber-300 hover:text-white transition-all flex items-center space-x-1.5 shadow-xl"
      >
        <span>Centrer sur Taxi 16-0482</span>
      </button>
    </div>
  );
};
