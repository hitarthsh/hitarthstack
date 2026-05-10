import ReactGA from "react-ga4";
import { siteConfig } from "@/config/site";
import {
  getSEOConfig,
  isPlaceholderGaId,
} from "@/utils/seo";

let initialized = false;
/** @type {string} */
let lastMeasurementId = "";

export function resolveMeasurementId() {
  try {
    const fromLs = getSEOConfig().global.googleAnalyticsId;
    if (!isPlaceholderGaId(fromLs)) return String(fromLs).trim();
  } catch {
    /* SSR / storage */
  }
  const sid = siteConfig.googleAnalyticsId;
  if (!isPlaceholderGaId(sid)) return String(sid).trim();
  return "";
}

/**
 * Initialize GA4 when measurement ID is configured and user did not opt out.
 * @param {{ force?: boolean }} [options]
 */
export function initGA(options = {}) {
  const { force = false } = options;
  if (typeof window === "undefined") return;
  try {
    if (window.localStorage.getItem("hitarth_analytics_opt_out") === "true") {
      return;
    }
  } catch {
    return;
  }

  const id = resolveMeasurementId();
  if (!id) return;

  if (initialized && lastMeasurementId === id && !force) return;

  try {
    ReactGA.initialize(id, {
      gaOptions: { anonymizeIp: true },
    });
    initialized = true;
    lastMeasurementId = id;
  } catch {
    /* ignore */
  }
}

/** @returns {boolean} */
export function isGaInitialized() {
  return initialized;
}

/** @returns {string} */
export function getGaMeasurementId() {
  return resolveMeasurementId();
}

/** @param {string} path */
export function trackPageView(path) {
  if (!initialized) return;
  ReactGA.send({ hitType: "pageview", page: path });
}

/**
 * @param {{ category: string; action: string; label?: string; value?: number }} payload
 */
export function trackEvent({ category, action, label, value }) {
  if (!initialized) return;
  ReactGA.event({ category, action, label, value });
}
