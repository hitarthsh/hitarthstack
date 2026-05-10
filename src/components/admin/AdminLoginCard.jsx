import { site } from "@/config/site";

/**
 * Admin ID + password gate for the dashboard.
 *
 * @param {{
 *   adminId: string;
 *   setAdminId: (v: string) => void;
 *   password: string;
 *   setPassword: (v: string) => void;
 *   onSubmit: (e: import('react').FormEvent) => void;
 * }} props
 */
export function AdminLoginCard({
  adminId,
  setAdminId,
  password,
  setPassword,
  onSubmit,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8"
    >
      <h1 className="font-display text-3xl">{site.admin.title}</h1>
      <p className="mt-2 text-sm text-[var(--text-muted)]">
        {site.admin.adminIdLabel} · {site.admin.adminPasswordLabel}
      </p>
      <label className="mt-6 block text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
        {site.admin.adminIdLabel}
      </label>
      <input
        type="text"
        name="admin-id"
        value={adminId}
        onChange={(e) => setAdminId(e.target.value)}
        className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-3 outline-none focus:border-[var(--accent)]"
        autoComplete="username"
      />
      <label className="mt-4 block text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
        {site.admin.adminPasswordLabel}
      </label>
      <input
        type="password"
        name="admin-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-3 outline-none focus:border-[var(--accent)]"
        autoComplete="current-password"
      />
      <button
        type="submit"
        className="mt-4 w-full min-h-11 rounded-full bg-[var(--accent)] py-3 text-sm font-semibold text-[#0a0a0a]"
      >
        {site.admin.unlockLabel}
      </button>
    </form>
  );
}
