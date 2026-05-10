const controlBase =
  "peer block w-full rounded-xl border border-[#1f1f1f] bg-[#111] px-4 pb-2.5 pt-6 text-[#f0f0f0] outline-none transition-[color,box-shadow,border-color] placeholder:text-transparent focus:border-[#e8ff47] focus-visible:border-[#e8ff47] focus-visible:ring-2 focus-visible:ring-[#e8ff47]/45 focus-visible:shadow-[0_0_20px_rgba(232,255,71,0.12)]";

const labelBase =
  "pointer-events-none absolute left-4 top-3 origin-left text-xs text-[var(--text-muted)] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-[#e8ff47] peer-[&:not(:placeholder-shown)]:top-3 peer-[&:not(:placeholder-shown)]:text-xs";

/**
 * @param {{
 *   id: string;
 *   label: string;
 *   value: string;
 *   onChange: (v: string) => void;
 *   type?: string;
 *   autoComplete?: string;
 *   error?: string;
 * }} props
 */
export function ContactFloatingField({
  id,
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  error,
}) {
  return (
    <div className="space-y-1">
      <div className="relative">
        <input
          id={id}
          type={type}
          autoComplete={autoComplete}
          value={value}
          placeholder=" "
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(e) => onChange(e.target.value)}
          className={`${controlBase} ${error ? "border-red-500/50 focus-visible:border-red-400 focus-visible:ring-red-500/30" : ""}`}
        />
        <label htmlFor={id} className={labelBase}>
          {label}
        </label>
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-xs text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * @param {{
 *   id: string;
 *   label: string;
 *   value: string;
 *   placeholderOption: string;
 *   options: string[];
 *   onChange: (v: string) => void;
 *   error?: string;
 * }} props
 */
export function ContactFloatingSelect({
  id,
  label,
  value,
  placeholderOption,
  options,
  onChange,
  error,
}) {
  return (
    <div className="space-y-1">
      <div className="relative">
        <select
          id={id}
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(e) => onChange(e.target.value)}
          className={`${controlBase} appearance-none bg-[#111] pr-10 text-[#f0f0f0] ${error ? "border-red-500/50 focus-visible:border-red-400 focus-visible:ring-red-500/30" : ""}`}
        >
          <option value="" disabled className="text-[var(--text-muted)]">
            {placeholderOption}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-[#111] text-[#f0f0f0]">
              {opt}
            </option>
          ))}
        </select>
        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-4 transition-all duration-200 ${
            value
              ? "top-3 text-xs text-[#e8ff47]"
              : "top-4 text-sm text-[var(--text-muted)] peer-focus-visible:top-3 peer-focus-visible:text-xs peer-focus-visible:text-[#e8ff47]"
          }`}
        >
          {label}
        </label>
        <span
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
          aria-hidden
        >
          ▾
        </span>
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-xs text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * @param {{
 *   id: string;
 *   label: string;
 *   value: string;
 *   onChange: (v: string) => void;
 *   maxLength: number;
 *   error?: string;
 *   counterText?: string;
 * }} props
 */
export function ContactFloatingTextArea({
  id,
  label,
  value,
  onChange,
  maxLength,
  error,
  counterText,
}) {
  return (
    <div className="space-y-1">
      <div className="relative">
        <textarea
          id={id}
          rows={5}
          maxLength={maxLength}
          value={value}
          placeholder=" "
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(e) => onChange(e.target.value)}
          className={`${controlBase} resize-none ${error ? "border-red-500/50 focus-visible:border-red-400 focus-visible:ring-red-500/30" : ""}`}
        />
        <label htmlFor={id} className={labelBase}>
          {label}
        </label>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        {error ? (
          <p id={`${id}-error`} className="text-xs text-red-400">
            {error}
          </p>
        ) : (
          <span />
        )}
        {counterText ? (
          <p className="text-xs text-[var(--text-muted)] tabular-nums">
            {counterText}
          </p>
        ) : null}
      </div>
    </div>
  );
}
