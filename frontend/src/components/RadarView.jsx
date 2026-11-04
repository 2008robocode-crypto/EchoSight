import React from 'react';
import { ShieldAlert, Compass, Volume2, Target } from 'lucide-react';
import { spatialAudio } from '../services/spatialAudio';

export default function RadarView({ objects = [], activeScenario, highContrast = false }) {
  const radarRadius = 140; // px
  const centerX = 160;
  const centerY = 160;

  // Convert distance and azimuth to (x, y) coordinates
  const getCoordinates = (distanceMeters, azimuthDegrees) => {
    // max radar range = 6 meters
    const normalizedDist = Math.min(distanceMeters / 6, 1);
    const radius = normalizedDist * (radarRadius - 20);
    // 0 deg is top (12 o'clock, -90 in standard math radians)
    const angleRad = ((azimuthDegrees - 90) * Math.PI) / 180;
    const x = centerX + radius * Math.cos(angleRad);
    const y = centerY + radius * Math.sin(angleRad);
    return { x, y };
  };

  const handleBeaconClick = (obj) => {
    spatialAudio.playSpatialPing(obj.azimuthDegrees, obj.distanceMeters, obj.priority);
    spatialAudio.speak(`${obj.label} at ${obj.clockDirection}, ${obj.distanceMeters} meters.`);
  };

  return (
    <div className={`relative flex flex-col items-center p-5 rounded-2xl border transition-all ${
      highContrast 
        ? 'bg-black border-yellow-400 text-yellow-300' 
        : 'bg-[#0E131F]/90 border-slate-800/80 backdrop-blur-md shadow-2xl'
    }`}>
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '10s' }} />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wide uppercase">360° Spatial Radar</h3>
            <p className="text-[11px] text-slate-400">Binaural Directional Map</p>
          </div>
        </div>
        <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-400 border border-slate-700">
          Range: 6.0m
        </span>
      </div>

      {/* Radar SVG Display */}
      <div className="relative w-[320px] h-[320px] flex items-center justify-center">
        {/* Radar Sweep Effect */}
        <div 
          className="absolute inset-4 rounded-full border border-cyan-500/20 pointer-events-none"
          style={{
            background: 'conic-gradient(from 0deg at 50% 50%, rgba(0, 240, 255, 0.15) 0deg, rgba(0, 240, 255, 0) 60deg, transparent 360deg)',
            animation: 'radar-sweep 4s linear infinite'
          }}
        />

        <svg width="320" height="320" className="overflow-visible select-none">
          {/* Distance Rings */}
          {[1.5, 3.0, 4.5, 6.0].map((dist, idx) => {
            const r = (dist / 6) * (radarRadius - 20);
            return (
              <g key={dist}>
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={r}
                  fill="none"
                  stroke={highContrast ? '#FFDD00' : 'rgba(56, 189, 248, 0.15)'}
                  strokeDasharray={idx === 3 ? '4 4' : 'none'}
                  strokeWidth="1"
                />
                <text
                  x={centerX + 4}
                  y={centerY - r + 11}
                  fill={highContrast ? '#FFDD00' : '#64748b'}
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {dist}m
                </text>
              </g>
            );
          })}

          {/* Crosshairs & Angle Lines */}
          <line
            x1={centerX - radarRadius + 10}
            y1={centerY}
            x2={centerX + radarRadius - 10}
            y2={centerY}
            stroke={highContrast ? '#FFFF00' : 'rgba(100, 116, 139, 0.25)'}
            strokeWidth="1"
          />
          <line
            x1={centerX}
            y1={centerY - radarRadius + 10}
            x2={centerX}
            y2={centerY + radarRadius - 10}
            stroke={highContrast ? '#FFFF00' : 'rgba(100, 116, 139, 0.25)'}
            strokeWidth="1"
          />

          {/* Clock Direction Labels */}
          <text x={centerX} y={centerY - radarRadius + 4} textAnchor="middle" fill="#00F0FF" fontSize="10" fontWeight="bold">12:00</text>
          <text x={centerX + radarRadius - 6} y={centerY + 3} textAnchor="start" fill="#94a3b8" fontSize="9">3:00</text>
          <text x={centerX} y={centerY + radarRadius + 6} textAnchor="middle" fill="#94a3b8" fontSize="9">6:00</text>
          <text x={centerX - radarRadius + 4} y={centerY + 3} textAnchor="end" fill="#94a3b8" fontSize="9">9:00</text>

          {/* User Anchor Point */}
          <circle cx={centerX} cy={centerY} r="6" fill="#00F0FF" />
          <circle cx={centerX} cy={centerY} r="14" fill="none" stroke="#00F0FF" strokeWidth="1.5" className="animate-ping" style={{ transformOrigin: `${centerX}px ${centerY}px` }} opacity="0.4" />

          {/* Obstacle Beacons */}
          {objects.map((obj) => {
            const { x, y } = getCoordinates(obj.distanceMeters, obj.azimuthDegrees);
            const isHazard = obj.priority === 'hazard';
            const isTarget = obj.priority === 'target';
            const beaconColor = isHazard ? '#FF3366' : isTarget ? '#00E676' : '#FFB800';

            return (
              <g 
                key={obj.id}
                className="cursor-pointer group transition-transform hover:scale-125"
                onClick={() => handleBeaconClick(obj)}
              >
                {/* Glow ring */}
                <circle
                  cx={x}
                  cy={y}
                  r="12"
                  fill={beaconColor}
                  opacity="0.25"
                  className="animate-pulse"
                />
                {/* Core dot */}
                <circle
                  cx={x}
                  cy={y}
                  r="5"
                  fill={beaconColor}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                {/* Direction line from center */}
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={x}
                  y2={y}
                  stroke={beaconColor}
                  strokeWidth="1"
                  strokeDasharray="2 3"
                  opacity="0.4"
                />
                {/* Beacon Label */}
                <text
                  x={x}
                  y={y - 10}
                  textAnchor="middle"
                  fill={highContrast ? '#FFFFFF' : '#e2e8f0'}
                  fontSize="10"
                  fontWeight="600"
                  className="pointer-events-none drop-shadow-md"
                >
                  {obj.label.split(' ')[0]} ({obj.distanceMeters}m)
                </text>
              </g>
            );
          })}
        </svg>

        {/* Center "YOU" indicator */}
        <div className="absolute bottom-2 text-[10px] font-mono tracking-widest text-cyan-400/80 bg-slate-900/80 px-2 py-0.5 rounded border border-cyan-500/20">
          USER HEADING: 000° N
        </div>
      </div>

      {/* Quick Legend & Sound Cue */}
      <div className="w-full mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-rose-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span> Hazard
          </span>
          <span className="flex items-center gap-1 text-amber-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span> Caution
          </span>
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Target/Safe
          </span>
        </div>
        <div className="text-[11px] text-slate-400 flex items-center gap-1">
          <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> Tap beacon to test sound
        </div>
      </div>
    </div>
  );
}
