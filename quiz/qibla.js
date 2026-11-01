import { arrowRotation, initialBearing, normalizeDegrees, shortestTurn } from "./qibla-math.js";
import { createHeadingAdapter, getPosition, requestMotionAccess } from "./qibla-sensors.js";

const button = document.querySelector("#findQibla");
const status = document.querySelector("#qiblaStatus");
const compass = document.querySelector("#liveCompass");
const arrow = document.querySelector("#qiblaArrow");
const rose = document.querySelector("#compassRose");
const direction = document.querySelector("#directionText");

let adapter = null;
let waitingTimer = 0;
let freshnessTimer = 0;
let requestId = 0;
let bearing = null;
let lastPositionAt = 0;
let lastSampleAt = 0;
let displayedTurn = null;
let displayedNorth = null;

function setState(message, { retry = false, live = false } = {}) {
  status.textContent = message;
  compass.hidden = !live;
  direction.hidden = !live;
  button.hidden = live;
  button.disabled = !retry && !live && button.dataset.busy === "true";
  if (retry) {
    button.dataset.busy = "false";
    button.textContent = "Try again";
    button.disabled = false;
  }
}

function stop() {
  requestId += 1;
  adapter?.stop();
  adapter = null;
  clearTimeout(waitingTimer);
  clearInterval(freshnessTimer);
  bearing = null;
  lastPositionAt = 0;
  lastSampleAt = 0;
  displayedTurn = null;
  displayedNorth = null;
  compass.hidden = true;
  direction.hidden = true;
  button.dataset.busy = "false";
  button.disabled = false;
}

function issue(type) {
  if (type === "model-expired") {
    stop();
    setState("The magnetic model needs an update before this compass can be used. Try a device with a true-north compass.", { retry: true });
    return;
  }
  if (type === "calibration") {
    setState("Compass accuracy is low. Move your phone in a figure eight, away from metal or magnets.", { retry: true });
  }
}

function showHeading(heading, sampledAt) {
  if (document.hidden || !Number.isFinite(bearing)) return;
  lastSampleAt = sampledAt;
  clearTimeout(waitingTimer);
  const target = arrowRotation(bearing, heading);
  displayedTurn = displayedTurn === null
    ? target
    : displayedTurn + shortestTurn(normalizeDegrees(displayedTurn), target);
  const northTarget = normalizeDegrees(-heading);
  displayedNorth = displayedNorth === null
    ? northTarget
    : displayedNorth + shortestTurn(normalizeDegrees(displayedNorth), northTarget);
  arrow.style.transform = `rotate(${displayedTurn}deg)`;
  rose.style.transform = `rotate(${displayedNorth}deg)`;
  setState("Keep your phone flat and away from metal or magnets.", { live: true });
}

async function findQibla() {
  stop();
  const currentRequest = requestId;
  if (!window.isSecureContext) {
    setState("Qibla needs the deployed HTTPS site. Local file previews cannot access the compass.", { retry: true });
    return;
  }
  if (!navigator.geolocation) {
    setState("Location is unavailable in this browser. Enable location access and try again.", { retry: true });
    return;
  }
  if (typeof DeviceOrientationEvent === "undefined") {
    setState("Compass unavailable on this device or browser.", { retry: true });
    return;
  }

  button.dataset.busy = "true";
  button.disabled = true;
  setState("Requesting location and compass access…");
  // Start both requests synchronously from the button gesture, as iOS requires.
  const motionPromise = requestMotionAccess();
  const positionPromise = getPosition();
  const [motionResult, positionResult] = await Promise.allSettled([motionPromise, positionPromise]);
  if (currentRequest !== requestId || document.hidden) return;

  if (motionResult.status === "rejected" || motionResult.value === "denied") {
    setState("Motion permission is required for the live compass. Allow it in your browser and try again.", { retry: true });
    return;
  }
  if (motionResult.value === "unavailable") {
    setState("Compass unavailable on this device or browser.", { retry: true });
    return;
  }
  if (positionResult.status === "rejected") {
    const code = positionResult.reason?.code;
    const message = code === 1
      ? "Location permission is required. Allow it in your browser and try again."
      : code === 3
        ? "Location timed out. Move to a clearer area and try again."
        : "Location is unavailable right now. Check device settings and try again.";
    setState(message, { retry: true });
    return;
  }

  const { latitude, longitude, accuracy } = positionResult.value.coords;
  if (Number.isFinite(accuracy) && accuracy > 5000) {
    setState("Location is too imprecise for a useful direction. Move to a clearer area and try again.", { retry: true });
    return;
  }
  try {
    bearing = initialBearing(latitude, longitude);
  } catch {
    setState("This location could not be used. Try again.", { retry: true });
    return;
  }
  lastPositionAt = Date.now();
  adapter = createHeadingAdapter(latitude, longitude, showHeading, issue);
  adapter.start();
  setState(`Location ready${Number.isFinite(accuracy) ? ` (about ${Math.round(accuracy)} m accuracy)` : ""}. Waiting for an absolute compass heading…`);
  waitingTimer = setTimeout(() => {
    if (!lastSampleAt) {
      stop();
      setState("No usable compass heading arrived in time. Compass unavailable on this device or browser.", { retry: true });
    }
  }, 8000);
  freshnessTimer = setInterval(() => {
    if (!lastSampleAt) return;
    if (Date.now() - lastSampleAt > 5000 || Date.now() - lastPositionAt > 10 * 60 * 1000) {
      stop();
      setState("The compass or location reading is stale. Try again for a current direction.", { retry: true });
    }
  }, 1000);
}

button.addEventListener("click", findQibla);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stop();
    setState("Compass paused. Tap Find Qibla to get a fresh direction.", { retry: true });
    button.textContent = "Find Qibla";
  }
});
window.addEventListener("pagehide", stop);
