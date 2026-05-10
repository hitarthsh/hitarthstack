import { Mail, Search, Star, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { site } from "@/config/site";
import {
  deleteMessage,
  exportMessagesCSV,
  exportMessagesJSON,
  formatRelativeTime,
  getMessages,
  updateMessage,
} from "@/utils/messages";

/** @typedef {'all'|'unread'|'starred'|'replied'} InboxFilter */

function useMediaMd() {
  const [md, setMd] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 768px)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const fn = () => setMd(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  return md;
}

/**
 * Contact inbox backed by localStorage (`getMessages` / mutators).
 */
export function AdminInbox() {
  const ib = site.admin.inbox;
  const isMd = useMediaMd();
  const [messages, setMessages] = useState(getMessages);
  const [filter, setFilter] = useState(/** @type {InboxFilter} */ ("all"));
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(
    /** @type {string | null} */ (null),
  );
  const [sheetOpen, setSheetOpen] = useState(false);

  const refresh = useCallback(() => {
    setMessages(getMessages());
  }, []);

  const inboxStats = useMemo(() => {
    const total = messages.length;
    const unread = messages.filter((m) => !m.read).length;
    const starred = messages.filter((m) => m.starred).length;
    const replied = messages.filter((m) => m.replied).length;
    return { total, unread, starred, replied };
  }, [messages]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = messages;
    if (filter === "unread") list = list.filter((m) => !m.read);
    else if (filter === "starred") list = list.filter((m) => m.starred);
    else if (filter === "replied") list = list.filter((m) => m.replied);
    if (q) {
      list = list.filter((m) => {
        const hay = `${m.name} ${m.email} ${m.subject}`.toLowerCase();
        return hay.includes(q);
      });
    }
    return list;
  }, [messages, filter, query]);

  const selected = messages.find((m) => m.id === selectedId) ?? null;

  useEffect(() => {
    if (!sheetOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setSheetOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheetOpen]);

  const selectRow = (id) => {
    setSelectedId(id);
    if (!isMd) setSheetOpen(true);
  };

  const patchMessage = (id, patch) => {
    updateMessage(id, patch);
    refresh();
  };

  const removeMessage = (id) => {
    if (!window.confirm(ib.deleteConfirm)) return;
    deleteMessage(id);
    refresh();
    if (selectedId === id) {
      setSelectedId(null);
      setSheetOpen(false);
    }
  };

  const replyViaEmail = (m) => {
    const subject = encodeURIComponent(`Re: ${m.subject}`);
    window.open(
      `mailto:${m.email}?subject=${subject}`,
      "_blank",
      "noopener,noreferrer",
    );
    patchMessage(m.id, { replied: true });
  };

  const statChip = (label, value) => (
    <span
      key={label}
      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--text-muted)]"
    >
      <span>{label}</span>
      <span className="tabular-nums text-[var(--text-primary)]">{value}</span>
    </span>
  );

  const filterBtn = (/** @type {InboxFilter} */ fid, label) => (
    <button
      key={fid}
      type="button"
      onClick={() => setFilter(fid)}
      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
        filter === fid
          ? "bg-[var(--accent)] text-[#0a0a0a]"
          : "border border-[var(--border)] bg-[var(--bg)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
      }`}
    >
      {label}
    </button>
  );

  const renderDetail = (m) => (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden md:max-h-[calc(100vh-14rem)]">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--border)] pb-4">
        <div>
          <h3 className="font-display text-xl text-[var(--text-primary)]">{m.name}</h3>
          <a
            href={`mailto:${m.email}`}
            className="text-sm font-medium text-[var(--accent)] underline-offset-2 hover:underline"
          >
            {m.email}
          </a>
          <p className="mt-2 font-mono text-xs text-[var(--text-muted)]">
            {new Date(m.sentAt).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs">
            {m.budget}
          </span>
          <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs">
            {m.projectType}
          </span>
          {m.replied ? (
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
              {ib.repliedBadge}
            </span>
          ) : null}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-5">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-primary)]">
          {m.message}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-[var(--border)] pt-4">
        <button
          type="button"
          onClick={() => patchMessage(m.id, { read: !m.read })}
          className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-medium"
        >
          {m.read ? ib.markUnread : ib.markRead}
        </button>
        <button
          type="button"
          onClick={() => patchMessage(m.id, { starred: !m.starred })}
          className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-medium"
        >
          {m.starred ? ib.unstar : ib.star}
        </button>
        <button
          type="button"
          onClick={() => patchMessage(m.id, { replied: !m.replied })}
          className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-medium"
        >
          {m.replied ? ib.markUnreplied : ib.markReplied}
        </button>
        <button
          type="button"
          onClick={() => replyViaEmail(m)}
          className="rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-[#0a0a0a]"
        >
          {ib.replyViaEmail}
        </button>
        <button
          type="button"
          onClick={() => removeMessage(m.id)}
          className="rounded-full border border-red-500/40 px-4 py-2 text-xs font-medium text-red-400"
        >
          {ib.delete}
        </button>
      </div>
    </div>
  );

  return (
    <section
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/40 p-4 md:p-6"
      aria-labelledby="admin-inbox-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h2
              id="admin-inbox-heading"
              className="font-display text-2xl text-[var(--text-primary)]"
            >
              {ib.heading}
            </h2>
            {inboxStats.unread > 0 ? (
              <span
                className="inline-flex min-w-6 items-center justify-center rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white"
                aria-label={`${ib.unreadBadgeAria}: ${inboxStats.unread}`}
              >
                {inboxStats.unread > 99 ? "99+" : inboxStats.unread}
              </span>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            {statChip(ib.statTotal, inboxStats.total)}
            {statChip(ib.statUnread, inboxStats.unread)}
            {statChip(ib.statStarred, inboxStats.starred)}
            {statChip(ib.statReplied, inboxStats.replied)}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => exportMessagesCSV(messages)}
            className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-medium"
          >
            {ib.exportCsv}
          </button>
          <button
            type="button"
            onClick={() => exportMessagesJSON(messages)}
            className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-medium"
          >
            {ib.exportJson}
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {filterBtn("all", ib.filterAll)}
        {filterBtn("unread", ib.filterUnread)}
        {filterBtn("starred", ib.filterStarred)}
        {filterBtn("replied", ib.filterReplied)}
      </div>

      <div className="relative mt-4">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={ib.searchPlaceholder}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] py-2.5 pl-10 pr-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          aria-label={ib.searchPlaceholder}
        />
      </div>

      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg)]">
            <Mail className="h-8 w-8 text-[var(--text-muted)]" aria-hidden />
          </div>
          <p className="font-display text-lg text-[var(--text-primary)]">{ib.emptyTitle}</p>
          <p className="max-w-sm text-sm text-[var(--text-muted)]">{ib.emptyBody}</p>
        </div>
      ) : (
        <div className="mt-6 flex min-h-[420px] flex-col gap-0 md:flex-row md:gap-4">
          <div className="flex w-full shrink-0 flex-col md:w-[35%] md:max-w-md md:border-r md:border-[var(--border)] md:pr-2">
            <div className="min-h-0 flex-1 space-y-1 overflow-y-auto md:max-h-[calc(100vh-16rem)]">
              {filtered.length === 0 ? (
                <p className="py-8 text-center text-sm text-[var(--text-muted)]">
                  {ib.filterEmptyHint}
                </p>
              ) : (
                filtered.map((m) => {
                  const active = m.id === selectedId;
                  return (
                    <div
                      key={m.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => selectRow(m.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          selectRow(m.id);
                        }
                      }}
                      className={`flex w-full cursor-pointer items-start gap-2 rounded-xl border border-transparent px-2 py-3 text-left transition-colors hover:bg-[var(--bg)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                        active
                          ? "border-[var(--accent)]/40 bg-[var(--bg)] md:border-l-4 md:border-l-[var(--accent)] md:pl-3"
                          : ""
                      }`}
                    >
                      <span
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                          !m.read ? "bg-[var(--accent)]" : "bg-transparent"
                        }`}
                        aria-hidden
                      />
                      <div className="min-w-0 flex-1">
                        <div
                          className={`truncate text-sm ${!m.read ? "font-bold text-[var(--text-primary)]" : "text-[var(--text-primary)]"}`}
                        >
                          {m.name}
                        </div>
                        <div className="truncate text-xs text-[var(--text-muted)]">{m.subject}</div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-wide text-[var(--text-muted)]">
                          <span>{formatRelativeTime(m.sentAt)}</span>
                          {m.replied ? (
                            <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-emerald-400 normal-case">
                              {ib.repliedBadge}
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          patchMessage(m.id, { starred: !m.starred });
                        }}
                        className={`shrink-0 rounded-lg p-1.5 transition-colors hover:bg-[var(--surface)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                          m.starred ? "text-[var(--accent)]" : "text-[var(--text-muted)]"
                        }`}
                        aria-label={m.starred ? ib.unstar : ib.star}
                      >
                        <Star className={`h-4 w-4 ${m.starred ? "fill-current" : ""}`} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="hidden min-h-0 flex-1 md:flex md:flex-col">
            {selected ? (
              renderDetail(selected)
            ) : (
              <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg)]/40 p-8 text-center text-sm text-[var(--text-muted)]">
                {ib.selectMessageHint}
              </div>
            )}
          </div>
        </div>
      )}

      {!isMd && sheetOpen && selected ? (
        <>
          <button
            type="button"
            aria-label="Close overlay"
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={() => setSheetOpen(false)}
          />
          <div
            className="fixed inset-x-0 bottom-0 z-[70] flex max-h-[88vh] flex-col rounded-t-3xl border border-[var(--border)] bg-[var(--bg)] p-5 pb-8 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label={ib.sheetAriaLabel}
          >
            <div className="mb-4 flex items-center justify-between border-b border-[var(--border)] pb-3">
              <span className="font-semibold text-[var(--text-primary)]">{ib.heading}</span>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="rounded-full border border-[var(--border)] p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                aria-label={ib.closeDetail}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">{renderDetail(selected)}</div>
          </div>
        </>
      ) : null}
    </section>
  );
}
