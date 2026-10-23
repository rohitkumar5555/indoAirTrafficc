import React from 'react';
import { Drone, SafeLandingZone } from '../types/drone';
import { BatteryCharging, Gauge, Compass, ShieldAlert, ArrowUpRight, RotateCcw, AlertTriangle } from 'lucide-react';

interface TelemetryDrawerProps {
  drone: Drone | null;
  onClose: () => void;
  onTriggerAltitudeShift: (droneId: string) => void;
  onInitiateRTH: (droneId: string) => void;
  safeLandingZones: SafeLandingZone[];
}

export function TelemetryDrawer({
  drone,
  onClose,
  onTriggerAltitudeShift,
  onInitiateRTH,
  safeLandingZones,
}: TelemetryDrawerProps) {
  if (!drone) return null;

  const nearestPad = safeLandingZones[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white flex flex-col gap-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold font-mono tracking-tight text-white">{drone.callsign}</span>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-slate-800 text-slate-300 border border-slate-700">
              {drone.model}
            </span>
          </div>
          <span className="text-xs text-slate-400 capitalize">Status: {drone.status.replace('_', ' ')}</span>
        </div>
        <button
          onClick={onClose}
          className="cursor-pointer text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800 border border-slate-700"
        >
          Close
        </button>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Battery Card */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Battery SoC</span>
            <BatteryCharging className={`w-3.5 h-3.5 ${drone.batteryPct < 30 ? 'text-rose-400' : 'text-emerald-400'}`} />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-white">
            {drone.batteryPct}%
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
            Draw: {drone.currentPowerDrawW}W · {drone.temperatureC}°C
          </div>
        </div>

        {/* Altitude & Corridor */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Altitude (AGL)</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-cyan-300">
            {drone.position.altitude} ft
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5 capitalize">
            Corridor: {drone.corridor}
          </div>
        </div>

        {/* Speed */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Ground Speed</span>
            <Gauge className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-white">
            {drone.speedKmh} <span className="text-xs font-normal text-slate-400">km/h</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
            Heading: {drone.headingDeg}°
          </div>
        </div>

        {/* Payload */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Payload Mass</span>
            <Compass className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-white">
            {drone.payloadKg} <span className="text-xs font-normal text-slate-400">kg</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
            Flight: {drone.distanceTraveledKm} / {drone.totalFlightDistanceKm} km
          </div>
        </div>
      </div>

      {/* Conflict Alert Banner if Active */}
      {drone.conflictWithId && (
        <div className="bg-rose-950/80 border border-rose-800 p-3 rounded-lg flex items-center justify-between text-rose-200 text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>4D Trajectory Conflict with {drone.conflictWithId}! Separation breached.</span>
          </div>
          <button
            onClick={() => onTriggerAltitudeShift(drone.id)}
            className="cursor-pointer px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded text-xs transition-colors shrink-0"
          >
            Auto Deconflict (+35ft Shift)
          </button>
        </div>
      )}

      {/* Quick Action Bar */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          onClick={() => onTriggerAltitudeShift(drone.id)}
          className="cursor-pointer px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
        >
          <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
          <span>Shift Altitude Corridor (+35 ft)</span>
        </button>

        <button
          onClick={() => onInitiateRTH(drone.id)}
          className="cursor-pointer px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span>Initiate Return to Hub (RTH)</span>
        </button>

        <div className="text-xs text-slate-400 ml-auto font-mono">
          Nearest Safe Landing Zone: <span className="text-slate-300 font-semibold">{nearestPad.name}</span>
        </div>
      </div>
    </div>
  );
}
