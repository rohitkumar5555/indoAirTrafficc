import React from 'react';
import { Drone } from '../types/drone';
import { ShieldCheck, Battery, ArrowUpRight, AlertCircle, ChevronRight } from 'lucide-react';

interface FleetTableProps {
  drones: Drone[];
  selectedDroneId: string | null;
  onSelectDrone: (id: string) => void;
}

export function FleetTable({ drones, selectedDroneId, onSelectDrone }: FleetTableProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl text-white">
      {/* Top Banner */}
      <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">Active Drone Fleet Status</h3>
          <p className="text-xs text-slate-400">Autonomous delivery sorted by active mission corridor</p>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-md flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>UTM Live Link Synchronized</span>
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800/80 font-mono uppercase text-[11px]">
            <tr>
              <th className="py-2.5 px-4">Callsign / Model</th>
              <th className="py-2.5 px-4">Flight Status</th>
              <th className="py-2.5 px-4">Altitude (AGL)</th>
              <th className="py-2.5 px-4">Ground Speed</th>
              <th className="py-2.5 px-4">Payload</th>
              <th className="py-2.5 px-4">Battery SoC</th>
              <th className="py-2.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {drones.map(drone => {
              const isSelected = selectedDroneId === drone.id;
              const inConflict = Boolean(drone.conflictWithId);

              return (
                <tr
                  key={drone.id}
                  onClick={() => onSelectDrone(drone.id)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-slate-800/90'
                      : inConflict
                      ? 'bg-rose-950/30 hover:bg-rose-950/50'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">{drone.callsign}</span>
                      <span className="text-[11px] text-slate-400">{drone.model}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono capitalize ${
                        inConflict
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : drone.status === 'holding'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {inConflict && <AlertCircle className="w-3 h-3 text-rose-400 shrink-0" />}
                      <span>{drone.status.replace('_', ' ')}</span>
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono tabular-nums text-slate-300">
                    {drone.position.altitude} ft
                  </td>

                  <td className="py-3 px-4 font-mono tabular-nums text-slate-300">
                    {drone.speedKmh} km/h
                  </td>

                  <td className="py-3 px-4 font-mono tabular-nums text-slate-300">
                    {drone.payloadKg > 0 ? `${drone.payloadKg} kg` : 'Empty (Return)'}
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            drone.batteryPct < 30
                              ? 'bg-rose-500'
                              : drone.batteryPct < 60
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${drone.batteryPct}%` }}
                        />
                      </div>
                      <span className="font-mono tabular-nums text-slate-300">{drone.batteryPct}%</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onSelectDrone(drone.id);
                      }}
                      className="cursor-pointer text-slate-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1 text-[11px]"
                    >
                      <span>Telemetry</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
