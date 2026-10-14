import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Video, 
  AlertTriangle, 
  Flame, 
  ShieldAlert, 
  Lock, 
  HardDrive,
  Activity,
  SunMedium,
  Moon
} from 'lucide-react';
import type { ThermalState, DashcamIncident } from '../types';
import { soundEngine } from '../utils/audio';
import { fetchAlgiersWeather, type WeatherData } from '../utils/publicApis';

interface DashcamHUDProps {
  speedKmh: number;
  driverLat: number;
  driverLng: number;
  rideId: string;
  driverId: string;
  onIncidentTriggered: (incident: DashcamIncident) => void;
}

export const DashcamHUD: React.FC<DashcamHUDProps> = ({
  speedKmh,
  driverLat,
  driverLng,
  rideId,
  driverId,
  onIncidentTriggered,
}) => {
  const [useWebcam, setUseWebcam] = useState(false);
  const [thermalState, setThermalState] = useState<ThermalState>('NORMAL');
  const [isImpacted, setIsImpacted] = useState(false);
  const [chunkSeconds, setChunkSeconds] = useState(18);
  const [activeChunkIndex, setActiveChunkIndex] = useState(2);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [currentGForce, setCurrentGForce] = useState(1.02);
  const [timecodeStr, setTimecodeStr] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetchAlgiersWeather().then(w => setWeather(w));
  }, []);

  // Live Timecode and G-force micro-fluctuation generator
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const ms = String(now.getMilliseconds()).padStart(3, '0');
      const timePart = now.toTimeString().split(' ')[0];
      setTimecodeStr(`${timePart}.${ms}`);

      if (!isImpacted) {
        // Natural vehicle vibration G-force noise
        const jitter = (Math.random() - 0.5) * 0.08;
        const speedBonus = (speedKmh / 100) * 0.12;
        setCurrentGForce(Number((1.01 + jitter + speedBonus).toFixed(2)));
      }
    }, 100);
    return () => clearInterval(timer);
  }, [isImpacted, speedKmh]);

  // Animated Simulated Road Canvas with Algiers Coastal Drive Aesthetics
  useEffect(() => {
    if (useWebcam) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let offset = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sky & Mediterranean Algerian Horizon
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.45);
      skyGrad.addColorStop(0, '#0a101d');
      skyGrad.addColorStop(1, '#1b2a47');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height * 0.45);

      // Distant Coastal Hills (Bay of Algiers / Bologhine)
      ctx.fillStyle = '#111a2e';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.45);
      ctx.lineTo(canvas.width * 0.25, canvas.height * 0.38);
      ctx.lineTo(canvas.width * 0.55, canvas.height * 0.42);
      ctx.lineTo(canvas.width * 0.85, canvas.height * 0.39);
      ctx.lineTo(canvas.width, canvas.height * 0.45);
      ctx.fill();

      // Asphalt Road Perspective
      const roadGrad = ctx.createLinearGradient(0, canvas.height * 0.45, 0, canvas.height);
      roadGrad.addColorStop(0, '#162032');
      roadGrad.addColorStop(1, '#090d16');
      ctx.fillStyle = roadGrad;
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.38, canvas.height * 0.45);
      ctx.lineTo(canvas.width * 0.62, canvas.height * 0.45);
      ctx.lineTo(canvas.width * 0.98, canvas.height);
      ctx.lineTo(canvas.width * 0.02, canvas.height);
      ctx.closePath();
      ctx.fill();

      // Moving Yellow Lane Markings (15fps pacing)
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3.5;
      ctx.setLineDash([16, 22]);
      ctx.lineDashOffset = -offset;

      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.5, canvas.height * 0.45);
      ctx.lineTo(canvas.width * 0.5, canvas.height);
      ctx.stroke();

      // Taxi Hood with Algerian Licence Plate
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.ellipse(canvas.width * 0.5, canvas.height + 20, canvas.width * 0.38, 48, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.stroke();

      offset = (offset + (speedKmh > 0 ? speedKmh * 0.14 : 1.2)) % 38;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [useWebcam, speedKmh]);

  // Rolling buffer timer (simulate 60s ring buffer)
  useEffect(() => {
    const timer = setInterval(() => {
      setChunkSeconds(prev => {
        if (prev >= 60) {
          setActiveChunkIndex(curr => (curr % 3) + 1);
          return 1;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // WebCam toggle
  const toggleWebcam = async () => {
    soundEngine.playClick();
    if (useWebcam) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      setUseWebcam(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setUseWebcam(true);
      } catch (err) {
        console.warn('Webcam permission not granted; falling back to simulated road.', err);
      }
    }
  };

  // Trigger Crash Simulation (2.8G Impact)
  const handleTriggerCrash = () => {
    soundEngine.playImpactAlarm();
    setIsImpacted(true);
    setCurrentGForce(2.84);

    const incident: DashcamIncident = {
      id: `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      rideId,
      driverId,
      triggerType: 'g_sensor_impact',
      peakGForce: 2.84,
      speedKmh,
      lat: driverLat,
      lng: driverLng,
      encryptionKeyId: `KDF-HKDF-SHA256-DEK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      fileSizeBytes: 15420000,
      status: 'pending_triage',
    };

    setStatusMessage('🚨 IMPACT 2.84G: Buffer verrouille • Chiffre AES-256-GCM • MinIO Alger');
    onIncidentTriggered(incident);

    setTimeout(() => {
      setIsImpacted(false);
      setTimeout(() => setStatusMessage(null), 5000);
    }, 2200);
  };

  // SOS Emergency Trigger
  const handleTriggerSOS = () => {
    soundEngine.playImpactAlarm();
    const incident: DashcamIncident = {
      id: `SOS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      rideId,
      driverId,
      triggerType: 'sos_driver',
      peakGForce: currentGForce,
      speedKmh,
      lat: driverLat,
      lng: driverLng,
      encryptionKeyId: `KDF-HKDF-SHA256-DEK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      fileSizeBytes: 14890000,
      status: 'under_investigation',
    };

    setStatusMessage('🚨 ALERTE SOS DISCRETE: Signalement transmis au Centre de Controle DTW');
    onIncidentTriggered(incident);
    setTimeout(() => setStatusMessage(null), 5000);
  };

  // Cycle Thermal Load-Shedder
  const cycleThermalState = () => {
    soundEngine.playClick();
    const states: ThermalState[] = ['NORMAL', 'MODERATE', 'SEVERE', 'CRITICAL'];
    const nextIdx = (states.indexOf(thermalState) + 1) % states.length;
    setThermalState(states[nextIdx]);
  };

  return (
    <div className={`relative bg-slate-950 rounded-3xl overflow-hidden border transition-all ${
      isImpacted ? 'border-rose-500 shadow-2xl shadow-rose-500/50' : 'border-white/10'
    }`}>
      
      {/* Video / Canvas Viewport */}
      <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
        {useWebcam ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <canvas
            ref={canvasRef}
            width={640}
            height={360}
            className="w-full h-full object-cover"
          />
        )}

        {/* Optical Crosshair HUD Overlay */}
        <div className="absolute inset-0 pointer-events-none hud-grid opacity-25"></div>

        {/* Severely Throttled Thermal Overlay */}
        {thermalState === 'SEVERE' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center z-30">
            <Flame className="w-10 h-10 text-amber-400 animate-bounce mb-2" />
            <h4 className="font-extrabold text-amber-300 text-sm">SURCHAUFFE PARE-BRISE (47°C)</h4>
            <p className="text-xs text-slate-300 mt-1 max-w-xs font-mono">
              Load-shedding actif: Encodage vidéo suspendu. Télématique 1Hz et alertes sonores opérationnelles.
            </p>
          </div>
        )}

        {/* Dashcam OSD Telemetry HUD */}
        <div className="absolute top-3 left-3 z-20 flex flex-col space-y-1">
          <div className="flex items-center space-x-1.5 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono text-emerald-300 border border-emerald-500/30 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span className="font-bold">REC 720p@15fps</span>
            <span className="text-white/20">|</span>
            <span>H.264 HW</span>
          </div>

          <div className="bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[9px] font-mono text-slate-300 border border-white/5">
            {timecodeStr || '16:42:00.000'} • GPS: {driverLat.toFixed(4)}°N, {driverLng.toFixed(4)}°E
          </div>

          {weather?.cameraCalibration && (
            <div className="bg-black/85 backdrop-blur-md px-2 py-0.5 rounded-md text-[9px] font-mono text-cyan-300 border border-cyan-500/30 flex items-center space-x-1.5 shadow-md">
              {weather.cameraCalibration.nightVision ? (
                <Moon className="w-2.5 h-2.5 text-indigo-400 shrink-0" />
              ) : (
                <SunMedium className="w-2.5 h-2.5 text-amber-400 shrink-0" />
              )}
              <span className="truncate">{weather.cameraCalibration.description}</span>
            </div>
          )}
        </div>

        {/* Rolling Buffer Indicator & Accelerometer */}
        <div className="absolute top-3 right-3 z-20 flex flex-col items-end space-y-1">
          <div className="flex items-center space-x-1.5 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono text-amber-300 border border-amber-500/30 shadow-lg">
            <HardDrive className="w-3.5 h-3.5" />
            <span>BUFFER {activeChunkIndex}/3 ({chunkSeconds}s)</span>
          </div>

          <div className="bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[9px] font-mono text-slate-200 border border-white/5 flex items-center space-x-1.5">
            <Activity className="w-3 h-3 text-emerald-400" />
            <span>VITESSE: <strong className="text-white">{speedKmh} km/h</strong></span>
            <span className="text-white/20">|</span>
            <span className={currentGForce >= 2.5 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
              {currentGForce}G
            </span>
          </div>
        </div>

        {/* Impact Warning Banner */}
        {statusMessage && (
          <div className="absolute bottom-3 left-3 right-3 z-30 bg-rose-600/95 text-white font-bold text-xs py-2 px-3 rounded-xl shadow-2xl backdrop-blur-md flex items-center justify-between border border-rose-400/50 animate-in fade-in">
            <span className="truncate">{statusMessage}</span>
            <Lock className="w-4 h-4 ml-2 flex-shrink-0" />
          </div>
        )}
      </div>

      {/* Cockpit Dashcam Controls Bar */}
      <div className="p-3 bg-slate-950/90 border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Hardware Status Pills */}
        <div className="flex items-center space-x-2">
          {/* Thermal State Switcher */}
          <button
            onClick={cycleThermalState}
            title="Tester le load-shedder thermique sous le soleil algérien"
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              thermalState === 'NORMAL'
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : thermalState === 'MODERATE'
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-rose-500/10 text-rose-300 border-rose-500/30 animate-pulse'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>{thermalState} (38°C)</span>
          </button>

          {/* Camera Input Mode */}
          <button
            onClick={toggleWebcam}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-colors"
          >
            {useWebcam ? <Camera className="w-3.5 h-3.5 text-amber-300" /> : <Video className="w-3.5 h-3.5 text-slate-400" />}
            <span>{useWebcam ? 'Webcam Réelle' : 'Simulation Route'}</span>
          </button>
        </div>

        {/* Emergency Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleTriggerCrash}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 border border-amber-400/30 transition-all shadow-sm active:scale-95"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Simuler Impact 2.8G</span>
          </button>

          <button
            onClick={handleTriggerSOS}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-lg shadow-rose-600/30 transition-all active:scale-95"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>SOS Urgence</span>
          </button>
        </div>

      </div>
    </div>
  );
};
