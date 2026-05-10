import { Menu, X } from "lucide-react";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { site } from "@/config/site";
import { useActiveSection } from "@/hooks/useActiveSection";
import { getUnreadCount } from "@/utils/messages";
import { trackEvent } from "@/analytics/analytics";
import {
  ACT_CONTACT_CTA,
  ACT_RESUME_DOWNLOAD,
  CAT_NAV,
} from "@/analytics/eventConstants";

/**
 * Primary navigation with router-aware links, frosted scroll state, and section spy on `/`.
 */
export function Navbar() {
  const location = useLocation();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [adminUnread, setAdminUnread] = useState(() => getUnreadCount());
  const menuId = useId();

  const sectionIds = useMemo(
    () =>
      site.navItems
        .map((n) => n.hash)
        .filter(Boolean)
        .map(String),
    [],
  );

  const isHome = location.pathname === "/";
  /** Ignore scroll-spy when off `/` so section state never drives Home + hash both active. */
  const scrollSpySection = useActiveSection(isHome ? sectionIds : []);
  const activeSection = isHome ? scrollSpySection : "";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const tick = () => setAdminUnread(getUnreadCount());
    tick();
    const id = window.setInterval(tick, 30000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const headerClass = scrolled
    ? "glass-strong border-b border-[var(--border)] py-3 shadow-lg shadow-black/30"
    : "border-b border-transparent bg-transparent py-5";

  const linkTo = (item) => {
    if (item.path) return item.path;
    if (item.hash) return `/#${item.hash}`;
    return "/";
  };

  const isActive = (item) => {
    if (item.path) {
      if (item.path === "/") {
        return (
          location.pathname === "/" &&
          activeSection === ""
        );
      }
      return location.pathname.startsWith(item.path);
    }
    if (item.hash && isHome) return activeSection === item.hash;
    return false;
  };

  const resumeHref = site.urls.resume?.trim();

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerClass}`}>
      <nav className="container mx-auto flex items-center justify-between px-6">
        <motion.div whileHover={reduce ? undefined : { y: [0, -3, 0] }} transition={{ duration: 0.45 }}>
          <Link
            to="/"
            className="font-display text-xl font-semibold tracking-tight text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-lg"
            aria-label={`${site.fullName}, home`}
          >
            {site.logoInitials}
            <span className="text-[var(--accent)]">.</span>
          </Link>
        </motion.div>

        <div className="hidden items-center gap-2 md:flex">
          <LayoutGroup>
            <div className="glass-surface flex items-center gap-2 rounded-full px-3 py-2 md:gap-2.5 md:px-4">
              {site.navItems.map((item) => {
                const active = isActive(item);
                return (
                  <Link
                    key={item.label + (item.path ?? item.hash ?? "")}
                    to={linkTo(item)}
                    className={`relative rounded-full px-4 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                      active
                        ? "text-[#0a0a0a]"
                        : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {active ? (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-[var(--accent)]"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 28,
                        }}
                      />
                    ) : null}
                    <span className="relative z-10 inline-flex items-center gap-2">
                      {item.label}
                      {item.path === "/admin" && adminUnread > 0 ? (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
                          {adminUnread > 9 ? "9+" : adminUnread}
                        </span>
                      ) : null}
                    </span>
                  </Link>
                );
              })}
            </div>
          </LayoutGroup>
          {resumeHref ? (
            <a
              href={resumeHref}
              download
              onClick={() =>
                trackEvent({ category: CAT_NAV, action: ACT_RESUME_DOWNLOAD })
              }
              className="hidden lg:inline-flex min-h-11 items-center rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-primary)] transition-colors hover:border-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              {site.resumeCtaLabel}
            </a>
          ) : null}
          <Link
            to="/#contact"
            onClick={() =>
              trackEvent({
                category: CAT_NAV,
                action: ACT_CONTACT_CTA,
                label: site.contactCtaLabel,
              })
            }
            className="inline-flex min-h-11 items-center rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-[#0a0a0a] shadow-lg shadow-[var(--accent)]/20 transition-transform hover:brightness-95 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            {site.contactCtaLabel}
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-[var(--border)] md:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open ? (
        <motion.div
          id={menuId}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="glass-strong border-t border-[var(--border)] md:hidden"
        >
          <div className="container mx-auto flex max-h-[70vh] flex-col gap-2 overflow-y-auto px-6 py-6">
            {site.navItems.map((item) => (
              <Link
                key={item.label + (item.path ?? item.hash ?? "")}
                to={linkTo(item)}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 text-lg text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
              >
                <span>{item.label}</span>
                {item.path === "/admin" && adminUnread > 0 ? (
                  <span className="flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                    {adminUnread > 9 ? "9+" : adminUnread}
                  </span>
                ) : null}
              </Link>
            ))}
            <Link
              to="/#contact"
              onClick={() => {
                setOpen(false);
                trackEvent({
                  category: CAT_NAV,
                  action: ACT_CONTACT_CTA,
                  label: site.contactCtaLabel,
                });
              }}
              className="mt-2 inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[#0a0a0a]"
            >
              {site.contactCtaLabel}
            </Link>
          </div>
        </motion.div>
      ) : null}
    </header>
  );
}
