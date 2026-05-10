/** localStorage key for portfolio contact submissions (client-only). */
export const CONTACT_MESSAGES_KEY = "hitarth_contact_messages";

/**
 * @typedef {object} ContactMessage
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} subject
 * @property {string} message
 * @property {string} budget
 * @property {string} projectType
 * @property {string} sentAt
 * @property {boolean} read
 * @property {boolean} starred
 * @property {boolean} replied
 */

/** @returns {ContactMessage[]} */
function readRaw() {
  try {
    const raw = localStorage.getItem(CONTACT_MESSAGES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidShape).map(normalizeMessage);
  } catch {
    return [];
  }
}

/** @param {unknown} m */
function isValidShape(m) {
  return (
    m !== null &&
    typeof m === "object" &&
    typeof /** @type {{ id?: unknown }} */ (m).id === "string" &&
    typeof /** @type {{ sentAt?: unknown }} */ (m).sentAt === "string"
  );
}

/** @param {Record<string, unknown>} m */
function normalizeMessage(m) {
  return {
    id: String(m.id),
    name: String(m.name ?? ""),
    email: String(m.email ?? ""),
    subject: String(m.subject ?? ""),
    message: String(m.message ?? ""),
    budget: String(m.budget ?? ""),
    projectType: String(m.projectType ?? ""),
    sentAt: String(m.sentAt),
    read: Boolean(m.read),
    starred: Boolean(m.starred),
    replied: Boolean(m.replied),
  };
}

function persist(list) {
  localStorage.setItem(CONTACT_MESSAGES_KEY, JSON.stringify(list));
}

function sortBySentAtDesc(/** @type {ContactMessage[]} */ list) {
  return [...list].sort(
    (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime(),
  );
}

/** @returns {ContactMessage[]} Newest first */
export function getMessages() {
  return sortBySentAtDesc(readRaw());
}

/** @param {Omit<ContactMessage, 'read'|'starred'|'replied'> & Partial<Pick<ContactMessage, 'read'|'starred'|'replied'>>} record */
export function saveMessage(record) {
  const next = normalizeMessage({
    ...record,
    read: record.read ?? false,
    starred: record.starred ?? false,
    replied: record.replied ?? false,
  });
  const list = sortBySentAtDesc([...readRaw(), next]);
  persist(list);
}

/** @param {string} id @param {Partial<ContactMessage>} patch */
export function updateMessage(id, patch) {
  const list = readRaw();
  const idx = list.findIndex((m) => m.id === id);
  if (idx === -1) return;
  list[idx] = normalizeMessage({ ...list[idx], ...patch, id: list[idx].id });
  persist(sortBySentAtDesc(list));
}

/** @param {string} id */
export function deleteMessage(id) {
  persist(readRaw().filter((m) => m.id !== id));
}

export function getUnreadCount() {
  return readRaw().filter((m) => !m.read).length;
}

/** @param {string} isoString */
export function formatRelativeTime(isoString) {
  const t = new Date(isoString).getTime();
  if (Number.isNaN(t)) return "—";
  const sec = Math.floor((Date.now() - t) / 1000);
  if (sec < 45) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 48) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 14) return `${day}d ago`;
  const wk = Math.floor(day / 7);
  return `${wk}w ago`;
}

/** @param {string} cell */
function escapeCsvCell(cell) {
  const s = String(cell ?? "");
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

/** @param {ContactMessage[]} messages */
export function messagesToCSVString(messages) {
  const headers = [
    "Date",
    "Name",
    "Email",
    "Subject",
    "Budget",
    "ProjectType",
    "Message",
    "Read",
    "Replied",
  ];
  const rows = messages.map((m) =>
    [
      m.sentAt,
      m.name,
      m.email,
      m.subject,
      m.budget,
      m.projectType,
      m.message,
      m.read ? "Yes" : "No",
      m.replied ? "Yes" : "No",
    ].map(escapeCsvCell),
  );
  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
}

function datedFilename(ext) {
  const d = new Date();
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `messages_${y}-${mo}-${day}.${ext}`;
}

function downloadBlob(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** @param {ContactMessage[]} messages */
export function exportMessagesCSV(messages) {
  const csv = `\uFEFF${messagesToCSVString(messages)}`;
  downloadBlob(datedFilename("csv"), csv, "text/csv;charset=utf-8;");
}

/** @param {ContactMessage[]} messages */
export function exportMessagesJSON(messages) {
  downloadBlob(
    datedFilename("json"),
    `${JSON.stringify(messages, null, 2)}\n`,
    "application/json;charset=utf-8;",
  );
}
