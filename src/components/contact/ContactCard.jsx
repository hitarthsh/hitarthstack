import { Globe, Loader2, Mail, MapPin, Send } from "lucide-react";
import { Link } from "react-router-dom";
import {
  ContactFloatingField,
  ContactFloatingSelect,
  ContactFloatingTextArea,
} from "@/components/contact/ContactFloatingInputs";
import { site } from "@/config/site";
import { trackEvent } from "@/analytics/analytics";
import { ACT_SOCIAL_CLICK, CAT_NAV } from "@/analytics/eventConstants";

const ROWS = [
  {
    icon: Mail,
    labelKey: "emailLabel",
    trackLabelKey: "emailLabel",
    type: "mail",
  },
  {
    icon: Globe,
    labelKey: "websiteLabel",
    valueKey: "websiteDisplay",
    hrefKey: "website",
    type: "website",
  },
  {
    icon: MapPin,
    labelKey: "locationLabel",
    valueKey: "location",
    type: "plain",
  },
];

const MESSAGE_MAX = 500;

/**
 * @typedef {{ name: string; email: string; subject: string; message: string; budget: string; projectType: string }} ContactFormData
 * @typedef {{ name?: string; email?: string; subject?: string; message?: string; budget?: string; projectType?: string }} ContactFormErrors
 */

/**
 * Right column: contact form plus dense contact rows.
 *
 * @param {{
 *   formData: ContactFormData;
 *   setFormData: (updater: ContactFormData | ((p: ContactFormData) => ContactFormData)) => void;
 *   errors: ContactFormErrors;
 *   loading: boolean;
 *   onSubmit: (e: import('react').FormEvent) => void | Promise<void>;
 * }} props
 */
export function ContactCard({
  formData,
  setFormData,
  errors,
  loading,
  onSubmit,
}) {
  const f = site.contact.form;
  const counterTemplate = f.charactersCounterTemplate ?? "{{current}} / {{max}}";
  const counterText = counterTemplate
    .replace("{{current}}", String(formData.message.length))
    .replace("{{max}}", String(MESSAGE_MAX));

  const rows = ROWS.map((row) => {
    if (row.type === "mail") {
      return {
        icon: row.icon,
        label: f[row.labelKey],
        value: site.contact.email,
        href: `mailto:${site.contact.email}`,
        trackLabel: f[row.trackLabelKey],
      };
    }
    if (row.type === "website") {
      return {
        icon: row.icon,
        label: site.contact[row.labelKey],
        value: site.contact[row.valueKey],
        href: site.urls[row.hrefKey],
        trackLabel: site.socialPlatforms.find((s) => s.key === "website")?.label,
      };
    }
    return {
      icon: row.icon,
      label: site.contact[row.labelKey],
      value: site.contact[row.valueKey],
      href: null,
      trackLabel: null,
    };
  });

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)]/85 p-8 backdrop-blur-xl">
      <form className="space-y-6" onSubmit={onSubmit} noValidate>
        <ContactFloatingField
          id="contact-name"
          label={f.nameLabel}
          value={formData.name}
          onChange={(v) => setFormData({ ...formData, name: v })}
          autoComplete="name"
          error={errors.name}
        />
        <ContactFloatingField
          id="contact-email"
          label={f.emailLabel}
          type="email"
          value={formData.email}
          onChange={(v) => setFormData({ ...formData, email: v })}
          autoComplete="email"
          error={errors.email}
        />
        <ContactFloatingField
          id="contact-subject"
          label={f.subjectLabel}
          value={formData.subject}
          onChange={(v) => setFormData({ ...formData, subject: v })}
          autoComplete="off"
          error={errors.subject}
        />
        <ContactFloatingSelect
          id="contact-budget"
          label={f.budgetLabel}
          value={formData.budget}
          placeholderOption={f.selectBudgetPlaceholder}
          options={f.budgetOptions ?? []}
          onChange={(v) => setFormData({ ...formData, budget: v })}
          error={errors.budget}
        />
        <ContactFloatingSelect
          id="contact-project-type"
          label={f.projectTypeLabel}
          value={formData.projectType}
          placeholderOption={f.selectProjectTypePlaceholder}
          options={f.projectTypeOptions ?? []}
          onChange={(v) => setFormData({ ...formData, projectType: v })}
          error={errors.projectType}
        />
        <ContactFloatingTextArea
          id="contact-message"
          label={f.messageLabel}
          value={formData.message}
          maxLength={MESSAGE_MAX}
          counterText={counterText}
          onChange={(v) => setFormData({ ...formData, message: v })}
          error={errors.message}
        />

        <button
          type="submit"
          disabled={loading}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#e8ff47] px-6 py-3 text-base font-semibold text-[#0a0a0a] shadow-lg shadow-[#e8ff47]/25 transition-[opacity,transform] hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8ff47] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99]"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 shrink-0 animate-spin" aria-hidden />
              {f.sendingLabel}
            </>
          ) : (
            <>
              {f.submitLabel}
              <Send className="h-5 w-5 shrink-0" aria-hidden />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 space-y-3 border-t border-[var(--border)] pt-8">
        <p className="text-sm font-semibold text-[var(--text-primary)]">
          {site.contact.infoCardTitle}
        </p>
        {rows
          .filter((row) => row.href || row.value)
          .map((row) => {
            const Inner = (
              <div className="flex items-start gap-3">
                <div className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg)]">
                  <row.icon className="h-5 w-5 text-[var(--accent)]" aria-hidden />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                    {row.label}
                  </div>
                  <div className="font-medium text-[var(--text-primary)]">{row.value}</div>
                </div>
              </div>
            );

            if (!row.href) {
              return (
                <div key={row.value} className="rounded-xl border border-transparent py-2">
                  {Inner}
                </div>
              );
            }

            return (
              <a
                key={row.value}
                href={row.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  row.trackLabel
                    ? trackEvent({
                        category: CAT_NAV,
                        action: ACT_SOCIAL_CLICK,
                        label: row.trackLabel,
                      })
                    : null
                }
                className="block rounded-xl py-2 transition-colors hover:bg-[var(--bg)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                {Inner}
              </a>
            );
          })}
      </div>

      <div className="mt-8 rounded-2xl border border-[var(--accent)]/35 bg-[var(--bg)]/60 p-5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent)]" />
          <span className="font-semibold">{site.contact.availabilityTitle}</span>
        </div>
        <p className="mt-2 text-sm text-[var(--text-muted)]">{site.contact.availabilityBody}</p>
        <Link
          to="/blog"
          className="mt-4 inline-flex text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
        >
          {site.sections.blog.title}
          {site.sections.blog.titleAccent}
        </Link>
      </div>
    </div>
  );
}
