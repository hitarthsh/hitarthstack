import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { isGaInitialized, trackPageView } from "@/analytics/analytics";

/**
 * Sends SPA page_view hits after GA has been initialized (consent flow).
 */
export function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    if (!isGaInitialized()) return;
    trackPageView(`${location.pathname}${location.search}`);
  }, [location.pathname, location.search]);

  return null;
}
