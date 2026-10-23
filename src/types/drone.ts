export type FlightStatus = 
  | 'idle' 
  | 'climbing' 
  | 'cruising' 
  | 'avoiding_conflict' 
  | 'holding' 
  | 'returning' 
  | 'emergency_landing';

export interface Coordinates {
  x: number; // 0-1000 scale on radar
  y: number; // 0-1000 scale on radar
  altitude: number; // in feet (200-400ft)
}

export interface Drone {
  id: string;
  callsign: string;
  model: string;
  status: FlightStatus;
  position: Coordinates;
  targetPosition: Coordinates;
  waypoints: Coordinates[];
  currentWaypointIndex: number;
  speedKmh: number;
  headingDeg: number;
  batteryPct: number;
  batteryCapacityWh: number;
  currentPowerDrawW: number;
  payloadKg: number;
  corridor: 'inbound' | 'outbound' | 'unassigned';
  conflictWithId?: string;
  conflictResolved?: boolean;
  distanceTraveledKm: number;
  totalFlightDistanceKm: number;
  energyConsumedWh: number;
  temperatureC: number;
}

export interface GeofenceZone {
  id: string;
  name: string;
  type: 'airport' | 'hospital' | 'weather' | 'temporary_tfr';
  centerX: number;
  centerY: number;
  radius: number;
  minAltitude: number;
  maxAltitude: number;
  active: boolean;
}

export interface SafeLandingZone {
  id: string;
  name: string;
  x: number;
  y: number;
  availablePads: number;
  hasFastCharger: boolean;
}

export interface WindCondition {
  speedKmh: number;
  directionDeg: number; // 0 = North, 90 = East, 180 = South, 270 = West
  gustKmh: number;
}

export interface AirspaceConflict {
  id: string;
  timestamp: string;
  droneAId: string;
  droneBId: string;
  distanceMeters: number;
  altitudeDiffFt: number;
  actionTaken: string;
  status: 'active' | 'resolved';
}
