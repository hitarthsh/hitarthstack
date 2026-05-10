import { useState } from "react";
import { site } from "@/config/site";
import { initGA, trackPageView } from "@/analytics/analytics";

const CONSENT_KEY = "hitarth_analytics_consent";
const OPT_OUT_KEY = "hitarth_analytics_opt_out";

function readInitialVisibility() {
  if (typeof window === "undefined") return false;
  try {
    if (localStorage.getItem(CONSENT_KEY) === "true") return false;
    if (localStorage.getItem(OPT_OUT_KEY) === "true") return false;
    return true;
  } catch {
    return false;
  }
}

/** Analytics consent UI; labels from `site.cookieBanner`. Named ConsentBanner so extension filter lists do not block the chunk URL. */
export function ConsentBanner() {
  const [visible, setVisible] = useState(readInitialVisibility);

  const accept = () => {
    try {
      localStorage.removeItem(OPT_OUT_KEY);
      localStorage.setItem(CONSENT_KEY, "true");
      initGA();
      trackPageView(`${window.location.pathname}${window.location.search}`);
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  const decline = () => {
    try {
      localStorage.setItem(OPT_OUT_KEY, "true");
      localStorage.removeItem(CONSENT_KEY);
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      className="consent-banner fixed bottom-0 left-0 right-0 z-[80] border-t border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-xl px-4 py-3 text-sm text-[var(--text-muted)] supports-[color-scheme:light]:shadow-[0_-8px_30px_rgba(0,0,0,0.08)] dark:border-[var(--border)]"
    >
      <div className="container mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-pretty text-[var(--text-primary)]">
          {site.cookieBanner.message}
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={decline}
            className="min-h-11 min-w-11 rounded-full border border-[var(--border)] px-5 py-2.5 text-[var(--text-primary)] transition-colors hover:bg-[var(--border)]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            {site.cookieBanner.declineLabel}
          </button>
          <button
            type="button"
            onClick={accept}
            className="min-h-11 min-w-11 rounded-full bg-[var(--accent)] px-5 py-2.5 font-medium text-[#0a0a0a] transition-transform hover:brightness-95 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
          >
            {site.cookieBanner.acceptLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
