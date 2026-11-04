import React, { useRef, useState, useEffect } from 'react';
import { Camera, Eye, Layers, AlertTriangle, ShieldCheck, Sparkles, RefreshCw, Volume2 } from 'lucide-react';
import { spatialAudio } from '../services/spatialAudio';

export default function VisionFeed({ 
  currentScenario, 
  onSelectObject, 
  selectedObject, 
  isCameraMode, 
  setIsCameraMode,
  highContrast = false 
}) {
  const videoRef = useRef(null);
  const [streamActive, setStreamActive] = useState(false);
  const [showPolygons, setShowPolygons] = useState(true);
  const [showBoxes, setShowBoxes] = useState(true);
  const [hoveredObj, setHoveredObj] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  // Initialize camera when camera mode is active
  useEffect(() => {
    let currentStream = null;
    if (isCameraMode) {
      navigator.mediaDevices?.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      }).then(stream => {
        currentStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
          setStreamActive(true);
        }
      }).catch(err => {
        console.warn('Camera access denied or unavailable, switching back to simulation:', err);
        setIsCameraMode(false);
        setStreamActive(false);
      });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(t => t.stop());
        videoRef.current.srcObject = null;
      }
      setStreamActive(false);
    }

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(t => t.stop());
      }
    };
  }, [isCameraMode]);

  const handleScanNow = () => {
    setIsScanning(true);
    spatialAudio.speak('Scanning visual field with SAM 3.1...', 'high');
    
    setTimeout(() => {
      setIsScanning(false);
      // Announce most critical obstacle
      const highestPriority = currentScenario.objects.find(o => o.priority === 'hazard') || currentScenario.objects[0];
      if (highestPriority) {
        spatialAudio.playSpatialPing(highestPriority.azimuthDegrees, highestPriority.distanceMeters, highestPriority.priority);
        spatialAudio.speak(currentScenario.audioCue, 'high');
      }
    }, 600);
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'hazard':
        return { bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40', stroke: '#FF3366', fill: 'rgba(255, 51, 102, 0.25)' };
      case 'caution':
        return { bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40', stroke: '#FFB800', fill: 'rgba(255, 184, 0, 0.25)' };
      case 'target':
        return { bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', stroke: '#00E676', fill: 'rgba(0, 230, 118, 0.25)' };
      default:
        return { bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40', stroke: '#00F0FF', fill: 'rgba(0, 240, 255, 0.2)' };
    }
  };

  // Realistic backdrop graphics when in simulation mode
  const renderSimulatedBackground = () => {
    if (currentScenario.bgType === 'street') {
      return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#182338] via-[#1c293d] to-[#0d141f] flex flex-col justify-between overflow-hidden">
          {/* Sky & Buildings silhouette */}
          <div className="h-1/3 w-full border-b border-slate-700/50 relative">
            <div className="absolute bottom-0 left-4 w-24 h-28 bg-slate-800/80 rounded-t border-t border-x border-slate-600/30"></div>
            <div className="absolute bottom-0 left-32 w-36 h-36 bg-slate-800/60 rounded-t"></div>
            <div className="absolute bottom-0 right-8 w-44 h-40 bg-slate-800/70 rounded-t"></div>
          </div>
          {/* Sidewalk & Street */}
          <div className="h-2/3 w-full relative bg-[#121824]">
            {/* Curb curbline */}
            <div className="absolute top-1/2 left-0 right-0 h-4 bg-slate-600/40 border-y border-amber-500/30"></div>
            {/* Tactile Paving Stripes */}
            <div className="absolute bottom-4 left-1/4 right-1/4 h-12 flex justify-around opacity-30">
              <div className="w-4 bg-amber-400"></div>
              <div className="w-4 bg-amber-400"></div>
              <div className="w-4 bg-amber-400"></div>
              <div className="w-4 bg-amber-400"></div>
            </div>
          </div>
        </div>
      );
    } else if (currentScenario.bgType === 'station') {
      return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#151c28] via-[#101622] to-[#0a0e17] flex flex-col justify-end overflow-hidden">
          {/* Subway / Station Descent Perspective */}
          <div className="absolute inset-0 flex items-center justify-center opacity-40">
            <div className="w-[85%] h-full border-x-2 border-slate-600/50"></div>
          </div>
          {/* Descending stairs stripes */}
          <div className="w-full h-1/2 flex flex-col justify-between px-8 pb-4 opacity-40">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-full h-3 bg-slate-700/80 border-t border-rose-500/40 rounded-sm"></div>
            ))}
          </div>
        </div>
      );
    } else {
      // Tabletop
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a2333] to-[#0c121d] flex items-center justify-center">
          <div className="w-[90%] h-[80%] rounded-2xl border border-slate-700/40 bg-[#141b27]/60 shadow-inner flex items-center justify-center">
            <span className="text-slate-600 font-mono text-xs uppercase tracking-widest">Table Surface Plane (Calibrated at 75cm)</span>
          </div>
        </div>
      );
    }
  };

  return (
    <div className={`relative flex flex-col rounded-2xl border overflow-hidden ${
      highContrast 
        ? 'bg-black border-yellow-400 text-yellow-300' 
        : 'bg-[#0E131F]/90 border-slate-800/80 shadow-2xl backdrop-blur-md'
    }`}>
      {/* Top Controls Bar */}
      <div className="p-3.5 px-5 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SAM 3.1 Vision Pipeline</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {isCameraMode ? 'LIVE WEBCAM' : currentScenario.title}
          </span>
        </div>

        {/* View Toggles */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setIsCameraMode(!isCameraMode)}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition ${
              isCameraMode 
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            {isCameraMode ? 'Stop Camera' : 'Live Camera'}
          </button>

          <button
            onClick={() => setShowPolygons(!showPolygons)}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1 transition ${
              showPolygons ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' : 'bg-slate-800/60 border-slate-700 text-slate-400'
            }`}
            title="Toggle SAM 3.1 Segmentation Masks"
          >
            <Layers className="w-3.5 h-3.5" /> Masks
          </button>

          <button
            onClick={() => setShowBoxes(!showBoxes)}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1 transition ${
              showBoxes ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' : 'bg-slate-800/60 border-slate-700 text-slate-400'
            }`}
            title="Toggle 3D Bounding Boxes"
          >
            <Eye className="w-3.5 h-3.5" /> Boxes
          </button>

          <button
            onClick={handleScanNow}
            disabled={isScanning}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/20 active:scale-95 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            Scan Scene
          </button>
        </div>
      </div>

      {/* Main Vision Display Screen */}
      <div className="relative w-full aspect-video min-h-[380px] max-h-[500px] overflow-hidden bg-black select-none">
        {/* Background Layer: Camera or Simulation */}
        {isCameraMode ? (
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-full object-cover transform -scale-x-100"
          />
        ) : (
          renderSimulatedBackground()
        )}

        {/* Scan Line effect when triggered */}
        {isScanning && (
          <div className="absolute inset-x-0 h-1 bg-cyan-400 shadow-[0_0_15px_#00F0FF] animate-pulse z-30 transition-all" style={{ top: '50%' }}></div>
        )}

        {/* SVG Segmentation Layer for SAM 3.1 Masks */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
          {showPolygons && currentScenario.objects.map(obj => {
            const style = getPriorityBadge(obj.priority);
            const isSelected = selectedObject?.id === obj.id || hoveredObj?.id === obj.id;
            const pointsStr = obj.polygon.map(p => `${p[0]},${p[1]}`).join(' ');

            return (
              <polygon
                key={obj.id}
                points={pointsStr}
                fill={isSelected ? style.stroke : style.fill}
                fillOpacity={isSelected ? '0.5' : '0.28'}
                stroke={isSelected ? '#ffffff' : style.stroke}
                strokeWidth={isSelected ? '1.2' : '0.6'}
                strokeDasharray={isSelected ? 'none' : '2, 1'}
                className="transition-all duration-200"
              />
            );
          })}
        </svg>

        {/* Interactive Bounding Boxes & Tags */}
        <div className="absolute inset-0 z-20 pointer-events-auto">
          {currentScenario.objects.map(obj => {
            const badge = getPriorityBadge(obj.priority);
            const isSelected = selectedObject?.id === obj.id || hoveredObj?.id === obj.id;

            return (
              <div
                key={obj.id}
                onClick={() => {
                  onSelectObject(obj);
                  spatialAudio.playSpatialPing(obj.azimuthDegrees, obj.distanceMeters, obj.priority);
                  spatialAudio.speak(`${obj.label}, ${obj.distanceMeters} meters away at ${obj.clockDirection}.`);
                }}
                onMouseEnter={() => setHoveredObj(obj)}
                onMouseLeave={() => setHoveredObj(null)}
                style={{
                  left: `${obj.box.x}%`,
                  top: `${obj.box.y}%`,
                  width: `${obj.box.w}%`,
                  height: `${obj.box.h}%`,
                }}
                className={`absolute cursor-pointer transition-all duration-200 group rounded-lg ${
                  showBoxes ? 'border-2' : ''
                } ${
                  isSelected 
                    ? 'border-white ring-4 ring-cyan-400/40 shadow-xl' 
                    : `${obj.priority === 'hazard' ? 'border-rose-500/80' : obj.priority === 'target' ? 'border-emerald-400/80' : 'border-amber-400/70'}`
                }`}
              >
                {/* Object Badge / HUD Tag */}
                <div className={`absolute -top-7 left-0 flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono tracking-tight shadow-md whitespace-nowrap transition-transform ${
                  isSelected ? 'scale-105 z-30' : 'opacity-90'
                } ${badge.bg} border`}>
                  {obj.priority === 'hazard' && <AlertTriangle className="w-3 h-3 text-rose-400" />}
                  {obj.priority === 'target' && <ShieldCheck className="w-3 h-3 text-emerald-400" />}
                  <span className="font-bold text-white">{obj.label}</span>
                  <span className="opacity-80 text-cyan-200">[{obj.distanceMeters}m • {obj.clockDirection}]</span>
                </div>

                {/* Corner Crosshairs */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white"></div>
              </div>
            );
          })}
        </div>

        {/* Real-time Status Overlay */}
        <div className="absolute bottom-3 left-4 z-20 flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-md border border-slate-700/80 flex items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>SAM 3.1 ACTIVE</span>
            <span className="text-slate-400">|</span>
            <span className="text-cyan-400">28.4 FPS</span>
            <span className="text-slate-400">|</span>
            <span className="text-amber-400">Latency: 142ms</span>
          </div>
        </div>

        {/* Live Spoken Audio Cue Banner */}
        <div className="absolute top-3 right-4 z-20 max-w-sm">
          <div className="px-3.5 py-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-cyan-500/30 shadow-lg flex items-center gap-2.5">
            <Volume2 className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
            <p className="text-xs text-cyan-100 font-medium leading-snug line-clamp-2">
              "{currentScenario.audioCue}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
