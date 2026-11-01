export const KAABA = Object.freeze({ latitude: 21.4225, longitude: 39.8262 });

export function normalizeDegrees(degrees) {
  return ((degrees % 360) + 360) % 360;
}

export function shortestTurn(from, to) {
  return ((to - from + 540) % 360) - 180;
}

export function initialBearing(latitude, longitude, target = KAABA) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) ||
      latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    throw new RangeError("A valid latitude and longitude are required.");
  }

  const radians = Math.PI / 180;
  const phi1 = latitude * radians;
  const phi2 = target.latitude * radians;
  const delta = (target.longitude - longitude) * radians;
  const east = Math.sin(delta) * Math.cos(phi2);
  const north = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(delta);
  if (Math.abs(east) < 1e-12 && Math.abs(north) < 1e-12) {
    throw new RangeError("The bearing is undefined at the target or its antipode.");
  }
  return normalizeDegrees(Math.atan2(east, north) / radians);
}

export function arrowRotation(bearing, trueHeading) {
  return normalizeDegrees(bearing - trueHeading);
}

export function magneticToTrue(magneticHeading, eastDeclination) {
  return normalizeDegrees(magneticHeading + eastDeclination);
}
