import { Check, Copy } from "lucide-react";
import { site } from "@/config/site";
import { trackEvent } from "@/analytics/analytics";
import { ACT_SOCIAL_CLICK, CAT_NAV } from "@/analytics/eventConstants";

/**
 * Left column: headline, social pills, email clipboard chip.
 *
 * @param {{
 *   copied: boolean;
 *   onCopyEmail: () => void | Promise<void>;
 * }} props
 */
export function ContactIntroColumn({ copied, onCopyEmail }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
        {site.contact.section.kicker}
      </p>
      <h2 className="mt-4 font-display text-4xl text-[var(--text-primary)] md:text-5xl">
        {site.contact.section.title}{" "}
        <span className="text-[var(--text-muted)]">{site.contact.section.titleAccent}</span>
      </h2>
      <p className="mt-4 max-w-xl text-[var(--text-muted)]">{site.contact.section.description}</p>

      <div className="mt-10 space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          {site.contact.section.socialHeading}
        </p>
        <div className="flex flex-wrap gap-3">
          {site.socialPlatforms.map((s) => {
            const href = site.urls[s.urlKey];
            if (!href) return null;
            return (
              <a
                key={s.key}
                href={href}
                target={s.key === "website" ? "_blank" : undefined}
                rel={s.key === "website" ? "noopener noreferrer" : undefined}
                onClick={() =>
                  trackEvent({
                    category: CAT_NAV,
                    action: ACT_SOCIAL_CLICK,
                    label: s.label,
                  })
                }
                className="inline-flex min-h-11 items-center rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-primary)] transition-colors hover:border-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                {s.label}
              </a>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-4">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 font-mono text-sm text-[var(--text-primary)]">
            {site.contact.email}
          </div>
          <button
            type="button"
            onClick={onCopyEmail}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[#0a0a0a] transition-transform hover:brightness-95 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
            {copied ? site.contact.section.copiedLabel : site.contact.section.copyEmailLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
