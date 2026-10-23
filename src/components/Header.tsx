import { Shield, Plane, AlertTriangle } from 'lucide-react';

interface HeaderProps {
  activeView: 'radar' | 'optimizer' | 'telemetry' | 'docs';
  setActiveView: (view: 'radar' | 'optimizer' | 'telemetry' | 'docs') => void;
  onTriggerConflict: () => void;
  conflictCount: number;
}

export function Header({
  activeView,
  setActiveView,
  onTriggerConflict,
  conflictCount,
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-900 border-b border-slate-800 text-white select-none">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <Plane className="w-4 h-4 rotate-45" />
        </div>
        <span className="text-base font-bold tracking-tight text-white">
          IndoAirTraffic
        </span>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
        <button
          onClick={() => setActiveView('radar')}
          className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
            activeView === 'radar' ? 'text-emerald-400 font-semibold' : 'hover:text-white'
          }`}
        >
          Airspace Radar
        </button>
        <button
          onClick={() => setActiveView('optimizer')}
          className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
            activeView === 'optimizer' ? 'text-emerald-400 font-semibold' : 'hover:text-white'
          }`}
        >
          Battery EcoRoute Lab
        </button>
        <button
          onClick={() => setActiveView('telemetry')}
          className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
            activeView === 'telemetry' ? 'text-emerald-400 font-semibold' : 'hover:text-white'
          }`}
        >
          Fleet Telemetry
        </button>
        <button
          onClick={() => setActiveView('docs')}
          className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
            activeView === 'docs' ? 'text-emerald-400 font-semibold' : 'hover:text-white'
          }`}
        >
          Hackathon Submission Info
        </button>
      </nav>

      {/* Zone 3: 1 Primary Action */}
      <div className="flex items-center gap-3 shrink-0">
        {conflictCount > 0 && (
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-amber-400 font-mono tabular-nums">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{conflictCount} Conflict Warning</span>
          </span>
        )}
        <button
          onClick={onTriggerConflict}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
        >
          Simulate 4D Conflict
        </button>
      </div>
    </header>
  );
}
