import assert from "node:assert/strict";
import test from "node:test";
import { arrowRotation, initialBearing, magneticToTrue, normalizeDegrees, shortestTurn } from "../qibla-math.js";
import { magneticDeclination, WMM_END, WMM_START } from "../qibla-magnetic.js";

test("great-circle Qibla bearings match independent reference examples", () => {
  assert.ok(Math.abs(initialBearing(-33.9167, 151.075) - 277.5400925) < 0.01);
  assert.ok(Math.abs(initialBearing(51.5074, -0.1278) - 118.9872425) < 0.01);
  assert.ok(Math.abs(initialBearing(40.7128, -74.006) - 58.4817120) < 0.01);
});

test("bearing and arrow wrap at north without a full-spin jump", () => {
  assert.equal(normalizeDegrees(-5), 355);
  assert.equal(arrowRotation(5, 355), 10);
  assert.equal(shortestTurn(355, 5), 10);
  assert.equal(shortestTurn(5, 355), -10);
  assert.throws(() => initialBearing(91, 0), RangeError);
});

test("magnetic headings need local east declination before true-north rotation", () => {
  assert.equal(magneticToTrue(350, 15), 5);
  assert.equal(arrowRotation(277, magneticToTrue(270, 10)), 357);
});

test("bundled WMM2025 matches NOAA published test vectors", () => {
  const date = new Date("2025-01-01T00:00:00.000Z");
  // NOAA WMM2025_TestValues.txt: decimal year, altitude km, latitude, longitude, declination.
  for (const [altitude, latitude, longitude, expected] of [
    [28, 89, -121, -99.77],
    [48, 80, -96, -29.91],
    [51, -33, 109, -5.49],
  ]) {
    assert.ok(Math.abs(magneticDeclination(latitude, longitude, date, altitude) - expected) < 0.02);
  }
});

test("expired WMM2025 fails closed", () => {
  assert.ok(Number.isFinite(magneticDeclination(-33.9, 151.1, new Date(WMM_START))));
  assert.ok(Number.isFinite(magneticDeclination(-33.9, 151.1, new Date(WMM_END - 1))));
  assert.throws(() => magneticDeclination(-33.9, 151.1, new Date(WMM_END)), RangeError);
});
