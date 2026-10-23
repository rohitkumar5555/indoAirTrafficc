import React, { useState } from 'react';
import { calculateRouteComparison } from '../utils/physicsEngine';
import { Zap, Wind, Package, TrendingDown, ArrowRight, CheckCircle2 } from 'lucide-react';

export function EcoRouteComparator() {
  const [distanceKm, setDistanceKm] = useState<number>(7.4);
  const [payloadKg, setPayloadKg] = useState<number>(2.0);
  const [windSpeedKmh, setWindSpeedKmh] = useState<number>(18);
  const [isHeadwind, setIsHeadwind] = useState<boolean>(true);

  const comparison = calculateRouteComparison(distanceKm, payloadKg, windSpeedKmh, isHeadwind);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white shadow-xl flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-emerald-400" />
          <span>Battery EcoRoute Optimization Lab</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Demonstrating aerodynamic power conservation (P = P_hover + 0.5 * ρ * Cd * A * v³) by routing along wind-neutral corridors rather than brute-force straight GPS lines.
        </p>
      </div>

      {/* Control Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800/80">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5 font-medium">
            <span className="flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-amber-400" />
              <span>Parcel Payload Weight:</span>
            </span>
            <span className="font-mono text-amber-300 font-bold tabular-nums">{payloadKg} kg</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="4.5"
            step="0.1"
            value={payloadKg}
            onChange={e => setPayloadKg(parseFloat(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
            <span>0.2 kg (Envelope)</span>
            <span>4.5 kg (Max Amazon Box)</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5 font-medium">
            <span className="flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              <span>Wind Speed:</span>
            </span>
            <span className="font-mono text-cyan-300 font-bold tabular-nums">{windSpeedKmh} km/h</span>
          </div>
          <input
            type="range"
            min="0"
            max="40"
            step="1"
            value={windSpeedKmh}
            onChange={e => setWindSpeedKmh(parseInt(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
            <span>0 km/h (Calm)</span>
            <span>40 km/h (High Gusts)</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5 font-medium">
            <span>Flight Distance:</span>
            <span className="font-mono text-emerald-300 font-bold tabular-nums">{distanceKm} km</span>
          </div>
          <input
            type="range"
            min="2.0"
            max="15.0"
            step="0.5"
            value={distanceKm}
            onChange={e => setDistanceKm(parseFloat(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
            <span>2.0 km</span>
            <span>15.0 km</span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Standard Route Card */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
              <div>
                <span className="text-sm font-bold text-slate-300">Standard Direct GPS Route</span>
                <p className="text-[11px] text-slate-500">Fixed altitude straight Euclidean path</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                Baseline
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Total Flight Distance</span>
                <span className="font-mono font-semibold tabular-nums text-slate-200">
                  {comparison.standard.distanceKm} km
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Energy Consumption</span>
                <span className="font-mono font-bold text-rose-400 tabular-nums">
                  {comparison.standard.energyWh} Wh
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Est. Battery Pack Drain</span>
                <span className="font-mono font-semibold tabular-nums text-slate-300">
                  {comparison.standard.batteryUsedPct}%
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Flight Duration</span>
                <span className="font-mono tabular-nums text-slate-400">
                  {comparison.standard.flightTimeMin} mins
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-900 text-[11px] text-slate-500">
            Suffers continuous headwind resistance drag and severe payload climb penalties.
          </div>
        </div>

        {/* IndoAirTraffic EcoRoute Card */}
        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-5 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20 mb-4">
              <div>
                <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>IndoAirTraffic 4D EcoRoute</span>
                </span>
                <p className="text-[11px] text-emerald-300/70">Stratified altitude corridor & wind drafting</p>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/30">
                +{comparison.ecoRoute.savingsPct}% Conserved
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-emerald-950/50">
                <span className="text-slate-400">Flight Distance (via Corridors)</span>
                <span className="font-mono font-semibold tabular-nums text-slate-200">
                  {comparison.ecoRoute.distanceKm} km
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-emerald-950/50">
                <span className="text-slate-400">Energy Consumption</span>
                <span className="font-mono font-bold text-emerald-400 tabular-nums">
                  {comparison.ecoRoute.energyWh} Wh
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-emerald-950/50">
                <span className="text-slate-400">Est. Battery Pack Drain</span>
                <span className="font-mono font-semibold tabular-nums text-emerald-300">
                  {comparison.ecoRoute.batteryUsedPct}%
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Flight Duration</span>
                <span className="font-mono tabular-nums text-slate-400">
                  {comparison.ecoRoute.flightTimeMin} mins
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-950/50 flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-300 font-medium">Safe Landing Reserve:</span>
            <span className="text-emerald-400 font-bold">
              {100 - comparison.ecoRoute.batteryUsedPct}% Remaining (Exceeds 20% FAA/DGCA Buffer)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
