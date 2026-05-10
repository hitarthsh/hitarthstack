/**
 * Labeled field wrapper for admin forms.
 *
 * @param {{ label: string; children: import('react').ReactNode }} props
 */
export function AdminFormField({ label, children }) {
  return (
    <label className="block text-sm text-[var(--text-muted)]">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide">
        {label}
      </span>
      {children}
    </label>
  );
}
