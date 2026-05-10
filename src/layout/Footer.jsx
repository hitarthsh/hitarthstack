import { Github, Globe, Linkedin } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { site } from "@/config/site";
import { trackEvent } from "@/analytics/analytics";
import { ACT_SOCIAL_CLICK, CAT_NAV } from "@/analytics/eventConstants";

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  website: Globe,
};

/**
 * Footer with animated wave divider and social tracking hooks.
 */
export function Footer() {
  const reduce = useReducedMotion();

  return (
    <footer className="relative mt-12 overflow-hidden border-t border-[var(--border)] bg-[var(--bg)]">
      <div
        className="relative h-16 w-[200%] text-[var(--accent)] opacity-40"
        aria-hidden
      >
        <motion.svg
          className={`absolute bottom-0 left-0 h-16 w-[200%] ${reduce ? "" : "animate-footer-wave"}`}
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            fillOpacity="0.35"
            d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,74.7C1120,75,1280,53,1360,42.7L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          />
        </motion.svg>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="text-center md:text-left">
            <Link
              to="/"
              className="font-display text-xl font-semibold tracking-tight text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              aria-label={`${site.fullName}, home`}
            >
              {site.logoInitials}
              <span className="text-[var(--accent)]">.</span>
            </Link>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              © {new Date().getFullYear()} {site.fullName}.{" "}
              {site.footerCopyrightSuffix}
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-6">
            {site.footerLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {site.socialPlatforms.map((s) => {
              const Icon = iconMap[s.key];
              const href = site.urls[s.urlKey];
              if (!Icon || !href) return null;
              return (
                <a
                  key={s.key}
                  href={href}
                  aria-label={s.label}
                  onClick={() =>
                    trackEvent({
                      category: CAT_NAV,
                      action: ACT_SOCIAL_CLICK,
                      label: s.label,
                    })
                  }
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] transition-colors hover:border-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
