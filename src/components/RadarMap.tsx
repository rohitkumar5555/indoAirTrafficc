import React from 'react';
import { Drone, GeofenceZone, SafeLandingZone, WindCondition } from '../types/drone';
import { Shield, Navigation, Wind, Eye, EyeOff } from 'lucide-react';

interface RadarMapProps {
  drones: Drone[];
  selectedDroneId: string | null;
  onSelectDrone: (id: string) => void;
  geofences: GeofenceZone[];
  safeLandingZones: SafeLandingZone[];
  wind: WindCondition;
  showCorridors: boolean;
  setShowCorridors: React.Dispatch<React.SetStateAction<boolean>>;
  showGeofences: boolean;
  setShowGeofences: React.Dispatch<React.SetStateAction<boolean>>;
  onAddTemporaryTFR: () => void;
}

export function RadarMap({
  drones,
  selectedDroneId,
  onSelectDrone,
  geofences,
  safeLandingZones,
  wind,
  showCorridors,
  setShowCorridors,
  showGeofences,
  setShowGeofences,
  onAddTemporaryTFR,
}: RadarMapProps) {
  return (
    <div className="relative w-full h-[620px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden select-none shadow-2xl flex flex-col">
      {/* Top Map Overlays */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
        <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs text-slate-300 flex items-center gap-2 shadow-lg">
          <Wind className="w-3.5 h-3.5 text-cyan-400" />
          <span>Surface Wind:</span>
          <span className="font-mono text-cyan-400 font-semibold tabular-nums">
            {wind.speedKmh} km/h @ {wind.directionDeg}° (WNW)
          </span>
        </div>

        <button
          onClick={() => setShowCorridors(prev => !prev)}
          className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 shadow-lg ${
            showCorridors
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
              : 'bg-slate-900/90 text-slate-400 border-slate-800'
          }`}
        >
          {showCorridors ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>4D Corridors</span>
        </button>

        <button
          onClick={() => setShowGeofences(prev => !prev)}
          className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 shadow-lg ${
            showGeofences
              ? 'bg-amber-950/80 text-amber-300 border-amber-700/60'
              : 'bg-slate-900/90 text-slate-400 border-slate-800'
          }`}
        >
          {showGeofences ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>Geofences</span>
        </button>

        <button
          onClick={onAddTemporaryTFR}
          className="cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-950/80 text-rose-300 border border-rose-800/60 hover:bg-rose-900/90 transition-colors shadow-lg"
        >
          + Deploy Dynamic TFR
        </button>
      </div>

      {/* SVG Canvas Map Area */}
      <div className="relative w-full flex-1">
        <svg
          viewBox="0 0 1000 1000"
          className="w-full h-full object-contain bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]"
        >
          <defs>
            {/* Radar Grid Circles */}
            <radialGradient id="radarSweep" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.04" />
              <stop offset="80%" stopColor="#0284c7" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.1" />
            </radialGradient>
            
            <pattern id="hazardStripe" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="20" stroke="#f43f5e" strokeWidth="3" opacity="0.25" />
            </pattern>
          </defs>

          {/* Airspace Range Rings */}
          <circle cx="500" cy="500" r="150" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
          <circle cx="500" cy="500" r="300" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
          <circle cx="500" cy="500" r="450" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />

          {/* Crosshairs */}
          <line x1="500" y1="50" x2="500" y2="950" stroke="#1e293b" strokeWidth="1" />
          <line x1="50" y1="500" x2="950" y2="500" stroke="#1e293b" strokeWidth="1" />

          {/* Stratified Airspace Corridors */}
          {showCorridors && (
            <g id="corridors" opacity="0.45">
              {/* Inbound Corridor (Green, 250-320ft) */}
              <path
                d="M 180 220 Q 450 320 740 520"
                fill="none"
                stroke="#10b981"
                strokeWidth="28"
                strokeLinecap="round"
                opacity="0.15"
              />
              <path
                d="M 180 220 Q 450 320 740 520"
                fill="none"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeDasharray="8 6"
              />

              {/* Outbound Corridor (Cyan, 330-400ft) */}
              <path
                d="M 760 480 Q 460 260 200 180"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="28"
                strokeLinecap="round"
                opacity="0.15"
              />
              <path
                d="M 760 480 Q 460 260 200 180"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="1.5"
                strokeDasharray="8 6"
              />
            </g>
          )}

          {/* Geofence / No-Fly Zones */}
          {showGeofences && geofences.map(zone => (
            <g key={zone.id}>
              <circle
                cx={zone.centerX}
                cy={zone.centerY}
                r={zone.radius}
                fill={zone.type === 'weather' ? '#38bdf8' : 'url(#hazardStripe)'}
                fillOpacity={zone.type === 'weather' ? 0.12 : 0.8}
                stroke={zone.type === 'weather' ? '#38bdf8' : '#f43f5e'}
                strokeWidth="1.5"
                strokeDasharray={zone.type === 'weather' ? '6 4' : undefined}
              />
              <text
                x={zone.centerX}
                y={zone.centerY - zone.radius - 8}
                textAnchor="middle"
                fill={zone.type === 'weather' ? '#38bdf8' : '#f87171'}
                fontSize="11"
                fontWeight="600"
                className="font-mono uppercase tracking-wider"
              >
                {zone.name}
              </text>
            </g>
          ))}

          {/* Safe Landing Zones / Hubs */}
          {safeLandingZones.map(pad => (
            <g key={pad.id}>
              <rect
                x={pad.x - 14}
                y={pad.y - 14}
                width="28"
                height="28"
                rx="6"
                fill="#0f172a"
                stroke="#64748b"
                strokeWidth="1.5"
              />
              <text
                x={pad.x}
                y={pad.y + 4}
                textAnchor="middle"
                fill="#38bdf8"
                fontSize="10"
                fontWeight="700"
                className="font-mono"
              >
                H
              </text>
              <text
                x={pad.x}
                y={pad.y + 24}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="9.5"
                fontWeight="500"
              >
                {pad.name}
              </text>
            </g>
          ))}

          {/* Drone Paths & Waypoints */}
          {drones.map(drone => {
            const isSelected = selectedDroneId === drone.id;
            return (
              <g key={`path-${drone.id}`}>
                {/* Flight Trajectory Trail */}
                <polyline
                  points={drone.waypoints.map(w => `${w.x},${w.y}`).join(' ')}
                  fill="none"
                  stroke={isSelected ? '#38bdf8' : '#475569'}
                  strokeWidth={isSelected ? '2' : '1'}
                  strokeDasharray="4 4"
                  opacity={isSelected ? 0.8 : 0.35}
                />
              </g>
            );
          })}

          {/* Drones */}
          {drones.map(drone => {
            const isSelected = selectedDroneId === drone.id;
            const inConflict = Boolean(drone.conflictWithId);

            return (
              <g
                key={drone.id}
                transform={`translate(${drone.position.x}, ${drone.position.y})`}
                onClick={() => onSelectDrone(drone.id)}
                className="cursor-pointer"
              >
                {/* 60m Safety Separation Envelope Bubble */}
                <circle
                  r="24"
                  fill={inConflict ? '#ef4444' : isSelected ? '#38bdf8' : '#10b981'}
                  fillOpacity={inConflict ? 0.25 : isSelected ? 0.15 : 0.08}
                  stroke={inConflict ? '#ef4444' : isSelected ? '#38bdf8' : '#10b981'}
                  strokeWidth="1.2"
                  strokeDasharray={inConflict ? '3 3' : undefined}
                />

                {/* Drone Directional Heading Indicator */}
                <g transform={`rotate(${drone.headingDeg})`}>
                  <line x1="0" y1="0" x2="0" y2="-18" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
                  <polygon points="0,-22 -4,-15 4,-15" fill="#38bdf8" />
                </g>

                {/* Drone Core Symbol */}
                <circle
                  r="7"
                  fill={inConflict ? '#ef4444' : '#0284c7'}
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="transition-transform duration-300"
                />

                {/* Drone Callout Tag */}
                <g transform="translate(14, -10)">
                  <rect
                    x="0"
                    y="0"
                    width="62"
                    height="28"
                    rx="4"
                    fill="#0f172a"
                    fillOpacity="0.92"
                    stroke={isSelected ? '#38bdf8' : inConflict ? '#ef4444' : '#334155'}
                    strokeWidth="1"
                  />
                  <text x="6" y="12" fill="#ffffff" fontSize="9.5" fontWeight="700" className="font-mono">
                    {drone.callsign}
                  </text>
                  <text x="6" y="22" fill="#94a3b8" fontSize="8.5" className="font-mono tabular-nums">
                    {drone.position.altitude}ft · {drone.batteryPct}%
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Bottom Map Status Bar */}
      <div className="px-5 py-2.5 bg-slate-900/90 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Inbound Corridor (250–320 ft)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block"></span>
            <span>Outbound Corridor (330–400 ft)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
            <span>Geofence / TFR</span>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono tabular-nums text-slate-300">
          <span>Active Drones: {drones.length}</span>
          <span>·</span>
          <span>Airspace Volume: 8 km × 8 km</span>
        </div>
      </div>
    </div>
  );
}
