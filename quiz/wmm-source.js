// Bundled into qibla-magnetic.js by build-web.mjs. Model and coefficients stay on-device.
import Model from "geomagnetism/lib/model.js";
import coefficients from "geomagnetism/data/wmm-2025.json";

export const WMM_START = Date.parse(coefficients.start_date);
export const WMM_END = Date.parse(coefficients.end_date);

export function magneticDeclination(latitude, longitude, date = new Date(), altitudeKm = 0) {
  if (!(date instanceof Date) || !Number.isFinite(date.getTime()) ||
      date.getTime() < WMM_START || date.getTime() >= WMM_END) {
    throw new RangeError("The bundled WMM2025 magnetic model is outside its validity period.");
  }
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) ||
      latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    throw new RangeError("A valid location is required for magnetic correction.");
  }
  return new Model(coefficients).getTimedModel(date).point([latitude, longitude, altitudeKm]).decl;
}
