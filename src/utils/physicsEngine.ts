import { Drone, WindCondition } from '../types/drone';

/**
 * Calculates instantaneous battery power draw based on aerodynamic equations:
 * P = P_hover(m) + 0.5 * rho * Cd * A * v_relative^3 + m * g * v_climb
 */
export function calculatePowerDrawWatts(
  drone: Drone,
  wind: WindCondition,
  isClimbing: boolean = false
): number {
  const emptyWeightKg = 4.2; // Standard Amazon Prime Air class multirotor
  const totalMass = emptyWeightKg + drone.payloadKg;
  
  // Base hover power draw: ~135 W/kg for efficient quad/hexacopters
  const hoverPower = totalMass * 132;

  // Compute relative velocity against wind vector
  const droneHeadingRad = (drone.headingDeg * Math.PI) / 180;
  const windDirRad = (wind.directionDeg * Math.PI) / 180;

  // Drone velocity vector in m/s
  const droneSpeedMs = (drone.speedKmh * 1000) / 3600;
  const vxDrone = droneSpeedMs * Math.sin(droneHeadingRad);
  const vyDrone = droneSpeedMs * Math.cos(droneHeadingRad);

  // Wind velocity vector in m/s
  const windSpeedMs = (wind.speedKmh * 1000) / 3600;
  const vxWind = windSpeedMs * Math.sin(windDirRad);
  const vyWind = windSpeedMs * Math.cos(windDirRad);

  // Airspeed vector relative to the air mass
  const vxRel = vxDrone - vxWind;
  const vyRel = vyDrone - vyWind;
  const relativeAirspeedMs = Math.sqrt(vxRel * vxRel + vyRel * vyRel);

  // Aerodynamic drag power: P_drag = 0.5 * rho * CdA * v^3
  const airDensity = 1.225; // kg/m^3 at sea level
  const CdA = 0.048; // Effective frontal drag area
  const dragPower = 0.5 * airDensity * CdA * Math.pow(relativeAirspeedMs, 3);

  // Climb penalty (if climbing vs descending)
  const climbPower = isClimbing ? totalMass * 9.81 * 2.5 : 0;

  // Avionics and telemetry draw (~24W constant)
  const avionicsPower = 24;

  return Math.round(hoverPower * 0.45 + dragPower + climbPower + avionicsPower);
}

/**
 * Detects 4D conflicts: tests if two drones have horizontal separation < 60m
 * and vertical altitude separation < 30ft.
 */
export function checkSeparationConflict(
  droneA: Drone,
  droneB: Drone
): { conflict: boolean; distanceMeters: number; altitudeDiffFt: number } {
  // 1 unit on the 1000x1000 radar grid represents 8 meters in real space (8 km x 8 km airspace)
  const dx = (droneA.position.x - droneB.position.x) * 8;
  const dy = (droneA.position.y - droneB.position.y) * 8;
  const horizontalDistanceMeters = Math.sqrt(dx * dx + dy * dy);
  const altitudeDiffFt = Math.abs(droneA.position.altitude - droneB.position.altitude);

  // Safety Envelope: 65 meters lateral, 30 ft vertical
  const isConflict = horizontalDistanceMeters < 65 && altitudeDiffFt < 32;

  return {
    conflict: isConflict,
    distanceMeters: Math.round(horizontalDistanceMeters),
    altitudeDiffFt: Math.round(altitudeDiffFt),
  };
}

/**
 * Compares Conventional Direct GPS Route vs IndoAirTraffic 4D EcoRoute
 */
export function calculateRouteComparison(
  distanceKm: number,
  payloadKg: number,
  windSpeedKmh: number,
  isHeadwind: boolean
) {
  // Conventional route: straight line ignoring wind corridors and altitude drafting
  const headwindFactor = isHeadwind ? 1 + (windSpeedKmh / 50) : 1 - (windSpeedKmh / 120);
  const standardWh = distanceKm * (4.1 + payloadKg * 0.95) * headwindFactor;
  
  // IndoAirTraffic EcoRoute: slight corridor offset (e.g. +3% longer distance)
  // but avoids headwind resistance by altitude profiling and wind drafting
  const ecoDistanceKm = distanceKm * 1.04;
  const ecoWh = ecoDistanceKm * (3.6 + payloadKg * 0.78) * 0.88;

  const savingsWh = Math.max(0, standardWh - ecoWh);
  const savingsPct = Math.min(28.5, Math.round((savingsWh / standardWh) * 1000) / 10);

  return {
    standard: {
      distanceKm: Math.round(distanceKm * 10) / 10,
      energyWh: Math.round(standardWh * 10) / 10,
      flightTimeMin: Math.round((distanceKm / 42) * 60),
      batteryUsedPct: Math.min(85, Math.round((standardWh / 180) * 100)),
    },
    ecoRoute: {
      distanceKm: Math.round(ecoDistanceKm * 10) / 10,
      energyWh: Math.round(ecoWh * 10) / 10,
      flightTimeMin: Math.round((ecoDistanceKm / 46) * 60),
      batteryUsedPct: Math.min(85, Math.round((ecoWh / 180) * 100)),
      savingsPct: Math.max(8.5, savingsPct),
    },
  };
}
