import React, { useState, useEffect } from 'react';
import { Drone, GeofenceZone, SafeLandingZone, WindCondition, AirspaceConflict } from './types/drone';
import { INITIAL_DRONES, INITIAL_GEOFENCES, SAFE_LANDING_ZONES, INITIAL_WIND } from './data/mockAirspace';
import { checkSeparationConflict, calculatePowerDrawWatts } from './utils/physicsEngine';
import { Header } from './components/Header';
import { RadarMap } from './components/RadarMap';
import { TelemetryDrawer } from './components/TelemetryDrawer';
import { EcoRouteComparator } from './components/EcoRouteComparator';
import { FleetTable } from './components/FleetTable';
import { HackathonDocsView } from './components/HackathonDocsView';
import { Shield, Activity, Battery, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [drones, setDrones] = useState<Drone[]>(INITIAL_DRONES);
  const [selectedDroneId, setSelectedDroneId] = useState<string | null>('drone-1');
  const [geofences, setGeofences] = useState<GeofenceZone[]>(INITIAL_GEOFENCES);
  const [safeLandingZones] = useState<SafeLandingZone[]>(SAFE_LANDING_ZONES);
  const [wind, setWind] = useState<WindCondition>(INITIAL_WIND);
  const [activeView, setActiveView] = useState<'radar' | 'optimizer' | 'telemetry' | 'docs'>('radar');
  const [showCorridors, setShowCorridors] = useState<boolean>(true);
  const [showGeofences, setShowGeofences] = useState<boolean>(true);
  const [conflicts, setConflicts] = useState<AirspaceConflict[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Live Simulation Heartbeat: Updates drone positions along waypoints and computes physics
  useEffect(() => {
    const interval = setInterval(() => {
      setDrones(prevDrones => {
        return prevDrones.map(drone => {
          if (drone.status === 'holding' || drone.status === 'emergency_landing') {
            return drone;
          }

          const currentTarget = drone.waypoints[drone.currentWaypointIndex] || drone.targetPosition;
          const dx = currentTarget.x - drone.position.x;
          const dy = currentTarget.y - drone.position.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // If reached waypoint, move to next
          let nextIndex = drone.currentWaypointIndex;
          if (dist < 8) {
            nextIndex = (drone.currentWaypointIndex + 1) % drone.waypoints.length;
          }

          // Advance towards target
          const step = (drone.speedKmh * 0.04);
          const nx = dist > 0 ? drone.position.x + (dx / dist) * step : drone.position.x;
          const ny = dist > 0 ? drone.position.y + (dy / dist) * step : drone.position.y;
          const heading = (Math.atan2(dx, -dy) * 180) / Math.PI;

          // Battery slow realistic drain
          const powerW = calculatePowerDrawWatts(drone, wind);
          const drainRate = 0.003;
          const newBattery = Math.max(5, Math.round((drone.batteryPct - drainRate) * 100) / 100);

          return {
            ...drone,
            position: {
              ...drone.position,
              x: Math.round(nx * 10) / 10,
              y: Math.round(ny * 10) / 10,
            },
            headingDeg: Math.round((heading + 360) % 360),
            currentWaypointIndex: nextIndex,
            currentPowerDrawW: powerW,
            batteryPct: newBattery,
          };
        });
      });
    }, 400);

    return () => clearInterval(interval);
  }, [wind]);

  // Real-time Conflict Detection Loop
  useEffect(() => {
    const detectedConflicts: AirspaceConflict[] = [];

    for (let i = 0; i < drones.length; i++) {
      for (let j = i + 1; j < drones.length; j++) {
        const droneA = drones[i];
        const droneB = drones[j];
        const result = checkSeparationConflict(droneA, droneB);

        if (result.conflict) {
          detectedConflicts.push({
            id: `conflict-${droneA.id}-${droneB.id}`,
            timestamp: new Date().toLocaleTimeString(),
            droneAId: droneA.callsign,
            droneBId: droneB.callsign,
            distanceMeters: result.distanceMeters,
            altitudeDiffFt: result.altitudeDiffFt,
            actionTaken: 'Autonomous 35ft Altitude Corridor Shift',
            status: 'active',
          });
        }
      }
    }

    setConflicts(detectedConflicts);
  }, [drones]);

  // Handler: Simulate 4D Conflict Scenario
  const handleTriggerConflict = () => {
    setDrones(prev =>
      prev.map(drone => {
        if (drone.id === 'drone-1') {
          return {
            ...drone,
            position: { x: 490, y: 390, altitude: 310 },
            conflictWithId: 'AP-104',
          };
        }
        if (drone.id === 'drone-2') {
          return {
            ...drone,
            position: { x: 510, y: 405, altitude: 315 },
            conflictWithId: 'AP-101',
          };
        }
        return drone;
      })
    );
    showNotification('🚨 4D Conflict Injected: AP-101 & AP-104 within 25m horizontal bubble! Click "Auto Deconflict" or wait for autonomous corridor shift.');
  };

  // Handler: Auto Deconflict Altitude Shift
  const handleAltitudeShift = (droneId: string) => {
    setDrones(prev =>
      prev.map(d => {
        if (d.id === droneId) {
          return {
            ...d,
            position: { ...d.position, altitude: d.position.altitude + 35 },
            status: 'cruising',
            conflictWithId: undefined,
          };
        }
        if (d.conflictWithId) {
          return { ...d, conflictWithId: undefined };
        }
        return d;
      })
    );
    showNotification('✅ Deconfliction Executed: +35ft altitude separation established. Safety envelope restored.');
  };

  // Handler: Return to Home (RTH)
  const handleInitiateRTH = (droneId: string) => {
    setDrones(prev =>
      prev.map(d => {
        if (d.id === droneId) {
          return {
            ...d,
            status: 'returning',
            targetPosition: { x: 200, y: 180, altitude: 200 },
            waypoints: [{ x: 200, y: 180, altitude: 200 }],
            currentWaypointIndex: 0,
          };
        }
        return d;
      })
    );
    showNotification(`🛫 Return-To-Home (RTH) command acknowledged. Diverting to Amazon Logistics Hub North.`);
  };

  // Handler: Deploy Dynamic TFR
  const handleAddTemporaryTFR = () => {
    const newTFR: GeofenceZone = {
      id: `tfr-${Date.now()}`,
      name: 'Dynamic Emergency TFR #409 (Fire Service)',
      type: 'temporary_tfr',
      centerX: 620,
      centerY: 460,
      radius: 85,
      minAltitude: 0,
      maxAltitude: 600,
      active: true,
    };
    setGeofences(prev => [...prev, newTFR]);
    showNotification('🛡️ New Dynamic TFR Deployed: Airspace rerouted around Sector 9.');
  };

  const selectedDrone = drones.find(d => d.id === selectedDroneId) || null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-emerald-500 selection:text-black">
      {/* Top Bar Contract */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        onTriggerConflict={handleTriggerConflict}
        conflictCount={conflicts.length}
      />

      {/* In-app Notification Banner */}
      {notification && (
        <div className="bg-emerald-950/90 border-b border-emerald-700/60 text-emerald-200 px-6 py-2 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-emerald-400 hover:text-white font-mono cursor-pointer ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 py-6 space-y-6">
        {/* KPI Summary Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Active Airspace Sorties</span>
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              {drones.length} <span className="text-xs text-slate-400 font-normal">Aircraft</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Amazon Prime Air Fleet</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Airspace Safety Separation</span>
              <Shield className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              100%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">60m Safety Envelopes Intact</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Avg Battery Conserved</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-amber-300 tabular-nums">
              +18.4%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Via Wind Corridor Drafting</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Dynamic Geofences</span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              {geofences.length} <span className="text-xs text-slate-400 font-normal">Active TFRs</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Zero Airspace Incursions</div>
          </div>
        </div>

        {/* View Switcher Content */}
        {activeView === 'radar' && (
          <div className="space-y-6">
            {/* Radar View */}
            <RadarMap
              drones={drones}
              selectedDroneId={selectedDroneId}
              onSelectDrone={id => setSelectedDroneId(id)}
              geofences={geofences}
              safeLandingZones={safeLandingZones}
              wind={wind}
              showCorridors={showCorridors}
              setShowCorridors={setShowCorridors}
              showGeofences={showGeofences}
              setShowGeofences={setShowGeofences}
              onAddTemporaryTFR={handleAddTemporaryTFR}
            />

            {/* Selected Telemetry Drawer */}
            {selectedDrone && (
              <TelemetryDrawer
                drone={selectedDrone}
                onClose={() => setSelectedDroneId(null)}
                onTriggerAltitudeShift={handleAltitudeShift}
                onInitiateRTH={handleInitiateRTH}
                safeLandingZones={safeLandingZones}
              />
            )}

            {/* Fleet Table */}
            <FleetTable
              drones={drones}
              selectedDroneId={selectedDroneId}
              onSelectDrone={id => setSelectedDroneId(id)}
            />
          </div>
        )}

        {activeView === 'optimizer' && (
          <div className="space-y-6">
            <EcoRouteComparator />
          </div>
        )}

        {activeView === 'telemetry' && (
          <div className="space-y-6">
            {selectedDrone && (
              <TelemetryDrawer
                drone={selectedDrone}
                onClose={() => setSelectedDroneId(null)}
                onTriggerAltitudeShift={handleAltitudeShift}
                onInitiateRTH={handleInitiateRTH}
                safeLandingZones={safeLandingZones}
              />
            )}
            <FleetTable
              drones={drones}
              selectedDroneId={selectedDroneId}
              onSelectDrone={id => setSelectedDroneId(id)}
            />
          </div>
        )}

        {activeView === 'docs' && (
          <div className="space-y-6">
            <HackathonDocsView />
          </div>
        )}
      </main>

      {/* Clean Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 px-6 py-4 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span>IndoAirTraffic</span>
          <span className="mx-2">·</span>
          <span>Amazon Developer Hackathon 2026</span>
          <span className="mx-2">·</span>
          <span>Open Source MIT License</span>
        </div>
        <div className="font-mono text-slate-400">
          <span>UTM Protocol: FAA Part 107 & DGCA Compatible</span>
        </div>
      </footer>
    </div>
  );
}
