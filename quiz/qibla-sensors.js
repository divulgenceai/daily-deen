import { magneticToTrue, normalizeDegrees } from "./qibla-math.js";
import { magneticDeclination } from "./qibla-magnetic.js";

export function requestMotionAccess() {
  try {
    if (typeof DeviceOrientationEvent === "undefined") {
      return Promise.resolve("unavailable");
    }
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      return Promise.resolve(DeviceOrientationEvent.requestPermission()).then((result) =>
        result === "granted" ? "granted" : "denied",
      );
    }
    return Promise.resolve("granted");
  } catch (error) {
    return Promise.reject(error);
  }
}

export function getPosition(timeout = 10000) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("location-unavailable"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout,
    });
  });
}

export function createHeadingAdapter(latitude, longitude, onHeading, onIssue = () => {}) {
  let source = "";
  let listening = false;
  let lastSampleAt = 0;

  function onOrientation(event) {
    if (!listening) return;
    const webkitHeading = event.webkitCompassHeading;
    const webkitAccuracy = event.webkitCompassAccuracy;

    if (Number.isFinite(webkitHeading) && webkitHeading >= 0 && webkitHeading <= 360) {
      source = "webkit";
      if (Number.isFinite(webkitAccuracy) && (webkitAccuracy < 0 || webkitAccuracy > 30)) {
        onIssue("calibration");
        return;
      }
      try {
        const declination = magneticDeclination(latitude, longitude);
        lastSampleAt = Date.now();
        onHeading(magneticToTrue(webkitHeading, declination), lastSampleAt);
      } catch {
        onIssue("model-expired");
      }
      return;
    }

    if (source === "webkit") return;
    if (!(event.absolute === true || event.type === "deviceorientationabsolute") ||
        !Number.isFinite(event.alpha)) return;
    source = "absolute";
    lastSampleAt = Date.now();
    onHeading(normalizeDegrees(360 - event.alpha), lastSampleAt);
  }

  return {
    start() {
      if (listening) return;
      listening = true;
      window.addEventListener("deviceorientationabsolute", onOrientation);
      window.addEventListener("deviceorientation", onOrientation);
    },
    stop() {
      listening = false;
      window.removeEventListener("deviceorientationabsolute", onOrientation);
      window.removeEventListener("deviceorientation", onOrientation);
      source = "";
      lastSampleAt = 0;
    },
    get lastSampleAt() { return lastSampleAt; },
  };
}
