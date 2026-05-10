/**
 * @param {{ message: string; variant?: 'success'|'error'|'info' }} props
 */
export function Toast({ message, variant = "info" }) {
  const border =
    variant === "success"
      ? "border-emerald-500/40"
      : variant === "error"
        ? "border-red-500/40"
        : "border-[var(--border)]";

  return (
    <div
      role="status"
      className={`fixed bottom-24 left-1/2 z-[90] w-[min(92vw,420px)] -translate-x-1/2 rounded-2xl border ${border} bg-[var(--surface)]/95 px-4 py-3 text-sm text-[var(--text-primary)] shadow-lg backdrop-blur-xl`}
    >
      {message}
    </div>
  );
}
