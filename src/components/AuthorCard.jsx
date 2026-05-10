import { Github, Linkedin } from "lucide-react";
import { site } from "@/config/site";

function twitterProfileUrl() {
  const h = site.twitterHandle?.replace(/^@/, "") ?? "";
  return h ? `https://twitter.com/${h}` : null;
}

/**
 * @param {{
 *   variant: 'compact' | 'expanded';
 *   publishedLabel?: string;
 *   readMinutes?: number;
 *   minutesShort?: string;
 * }} props
 */
export function AuthorCard({
  variant,
  publishedLabel = "",
  readMinutes = 0,
  minutesShort = "",
}) {
  const tw = twitterProfileUrl();
  const bioLines = site.aboutParagraphs.slice(0, 2).join(" ");

  if (variant === "compact") {
    return (
      <div className="mb-10 flex gap-4 rounded-2xl border border-[#1f1f1f] bg-[#111] p-4">
        <img
          src={site.aboutPortrait.src}
          alt={site.aboutPortrait.alt}
          width={48}
          height={48}
          className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-[#1f1f1f] sm:h-12 sm:w-12"
        />
        <div className="min-w-0">
          <p className="font-display text-base font-semibold text-[#f0f0f0] sm:text-lg">
            {site.fullName}
          </p>
          <p className="text-xs text-[#a3a3a3] sm:text-sm">{site.blogAuthor.role}</p>
          <p className="mt-2 font-mono text-[10px] text-[#6b6b6b] sm:text-xs">
            {publishedLabel}
            <span aria-hidden> · </span>
            {readMinutes} {minutesShort}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#1f1f1f] bg-[#111] p-6 sm:flex-row sm:items-start">
      <img
        src={site.aboutPortrait.src}
        alt={site.aboutPortrait.alt}
        width={72}
        height={72}
        className="h-[72px] w-[72px] shrink-0 rounded-full object-cover ring-2 ring-[#1f1f1f]"
      />
      <div className="min-w-0 flex-1">
        <p className="font-display text-xl font-semibold text-[#f0f0f0]">{site.fullName}</p>
        <p className="mt-1 text-sm text-[#a3a3a3]">{site.blogAuthor.roleExpanded}</p>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-[#a3a3a3]">{bioLines}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={site.urls.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#1f1f1f] text-[#d4d4d4] transition-colors hover:border-[var(--accent)]/50 hover:text-[var(--accent)]"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href={site.urls.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#1f1f1f] text-[#d4d4d4] transition-colors hover:border-[var(--accent)]/50 hover:text-[var(--accent)]"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          {tw ? (
            <a
              href={tw}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#1f1f1f] text-[#d4d4d4] transition-colors hover:border-[var(--accent)]/50 hover:text-[var(--accent)]"
              aria-label="Twitter"
            >
              <span className="text-sm font-bold">𝕏</span>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
