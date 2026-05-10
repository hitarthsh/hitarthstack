import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileEdit,
  FileText,
  PieChartIcon,
  Send,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { createElement, useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { site } from "@/config/site";
import {
  getContentHealthRows,
  getMessagesByDay,
  getPostsByCategory,
  getPostsByMonth,
} from "@/utils/charts";
import { getSEOConfig } from "@/utils/seo";
import { getMessages, getUnreadCount } from "@/utils/messages";

const CARD =
  "relative rounded-2xl border border-[#1f1f1f] bg-[#111] p-5 shadow-inner";
const CHART_CARD = `${CARD} flex flex-col`;
const TICK_STYLE = { fill: "#6b6b6b", fontSize: 11 };

/**
 * @param {{
 *   posts: import('@/lib/blogStorage').BlogPost[];
 *   setTab: (t: 'dashboard'|'posts'|'seo') => void;
 * }} props
 */
export function AdminDashboard({ posts, setTab }) {
  const dc = site.admin.dashboardCharts;
  const palette = site.admin.chartCategoryColors ?? ["#e8ff47"];
  const [netHealth, setNetHealth] = useState({
    robotsOk: false,
    sitemapOk: false,
  });

  useEffect(() => {
    let cancel = false;
    async function run() {
      let robotsOk = false;
      let sitemapOk = false;
      try {
        const r = await fetch("/robots.txt", {
          cache: "no-store",
          method: "GET",
        });
        robotsOk = r.ok;
      } catch {
        robotsOk = false;
      }
      try {
        const r = await fetch("/sitemap.xml", {
          cache: "no-store",
          method: "GET",
        });
        sitemapOk = r.ok;
      } catch {
        sitemapOk = false;
      }
      if (!cancel) setNetHealth({ robotsOk, sitemapOk });
    }
    run();
    return () => {
      cancel = true;
    };
  }, []);

  const messages = useMemo(() => getMessages(), []);
  const unread = useUnreadCountLive();

  const monthly = useMemo(() => getPostsByMonth(posts, 6), [posts]);
  const categories = useMemo(() => getPostsByCategory(posts), [posts]);
  const dailyMsg = useMemo(() => getMessagesByDay(messages, 14), [messages]);

  const stats = useMemo(() => {
    const drafts = posts.filter((p) => p.status === "draft").length;
    const published = posts.filter((p) => p.status === "published").length;
    return {
      total: posts.length,
      drafts,
      published,
    };
  }, [posts]);

  const healthRows = useMemo(
    () => getContentHealthRows(posts, getSEOConfig(), netHealth),
    [posts, netHealth],
  );

  const donutTotal = categories.reduce((a, c) => a + c.value, 0);

  const tooltipStyles = {
    backgroundColor: "#111",
    border: "1px solid #1f1f1f",
    borderRadius: "12px",
    color: "#f0f0f0",
  };

  const iconForRow = (row) => {
    if (row.iconStatus === "ok") {
      return <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />;
    }
    if (row.iconStatus === "warn") {
      return (
        <AlertCircle className="h-5 w-5 shrink-0 text-amber-400" aria-hidden />
      );
    }
    return <XCircle className="h-5 w-5 shrink-0 text-red-400" aria-hidden />;
  };

  return (
    <div className="space-y-8">
      <p className="text-sm text-[var(--text-muted)]">{site.admin.dashboardBlurb}</p>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={FileText}
          label={dc.statTotalPosts}
          value={stats.total}
          chip={dc.chipAllTime}
        />
        <StatCard
          icon={TrendingUp}
          label={dc.statPublished}
          value={stats.published}
          chip={dc.chipLiveNow}
        />
        <StatCard
          icon={FileEdit}
          label={dc.statDrafts}
          value={stats.drafts}
          chip={dc.chipPending}
        />
        <StatCard
          icon={Send}
          label={dc.statMessages}
          value={messages.length}
          chip={dc.chipUnread}
          badge={unread > 0 ? unread : undefined}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-10">
        <div className={`${CHART_CARD} lg:col-span-6`}>
          <h3 className="mb-4 font-display text-lg text-[var(--text-primary)]">
            {dc.areaTitle}
          </h3>
          <div className="min-h-[220px] flex-1">
            {monthly.every((m) => m.published === 0 && m.drafts === 0) ? (
              <p className="py-16 text-center text-sm text-[#6b6b6b]">
                {dc.areaEmpty}
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={monthly}>
                  <defs>
                    <linearGradient id="pubFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#e8ff47" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#e8ff47" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="draftFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6b6b6b" stopOpacity={0.22} />
                      <stop offset="100%" stopColor="#6b6b6b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#1f1f1f" vertical={false} />
                  <XAxis dataKey="label" tick={TICK_STYLE} axisLine={false} />
                  <YAxis tick={TICK_STYLE} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyles} />
                  <Area
                    type="monotone"
                    dataKey="published"
                    name={dc.areaPublished}
                    stroke="#e8ff47"
                    fill="url(#pubFill)"
                  />
                  <Area
                    type="monotone"
                    dataKey="drafts"
                    name={dc.areaDrafts}
                    stroke="#6b6b6b"
                    fill="url(#draftFill)"
                  />
                  <Legend
                    wrapperStyle={{ color: "#6b6b6b", fontSize: 12 }}
                    formatter={(value) => (
                      <span className="text-[#6b6b6b]">{value}</span>
                    )}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className={`${CHART_CARD} lg:col-span-4`}>
          <h3 className="mb-4 flex items-center gap-2 font-display text-lg text-[var(--text-primary)]">
            <PieChartIcon className="h-5 w-5 text-[var(--accent)]" aria-hidden />
            {dc.donutTitle}
          </h3>
          <div className="min-h-[220px] flex-1">
            {donutTotal === 0 ? (
              <div className="flex h-[220px] flex-col items-center justify-center gap-2">
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={[{ name: "empty", value: 1 }]}
                      dataKey="value"
                      innerRadius={48}
                      outerRadius={70}
                      stroke="none"
                    >
                      <Cell fill="#2a2a2a" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <p className="text-center text-xs text-[#6b6b6b]">{dc.donutEmpty}</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={categories}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    innerRadius={52}
                    outerRadius={78}
                    paddingAngle={2}
                    stroke="#111"
                  >
                    {categories.map((_, i) => (
                      <Cell
                        key={`c-${i}`}
                        fill={palette[i % palette.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyles} />
                  <text
                    x="50%"
                    y="46%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#f0f0f0"
                    fontSize={18}
                    fontWeight={700}
                  >
                    {donutTotal}
                  </text>
                  <text
                    x="50%"
                    y="58%"
                    textAnchor="middle"
                    fill="#6b6b6b"
                    fontSize={11}
                  >
                    posts
                  </text>
                </PieChart>
              </ResponsiveContainer>
            )}
            {donutTotal > 0 ? (
              <ul className="mt-2 space-y-1 border-t border-[#1f1f1f] pt-3 text-xs text-[#6b6b6b]">
                {categories.map((c, i) => (
                  <li key={c.name} className="flex justify-between gap-2">
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{
                          backgroundColor: palette[i % palette.length],
                        }}
                      />
                      {c.name}
                    </span>
                    <span className="tabular-nums text-[var(--text-primary)]">
                      {c.value}{" "}
                      <span className="text-[#6b6b6b]">
                        ({Math.round((c.value / donutTotal) * 100)}%)
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-10">
        <div className={`${CHART_CARD} lg:col-span-6`}>
          <h3 className="mb-4 flex items-center gap-2 font-display text-lg text-[var(--text-primary)]">
            <BarChart3 className="h-5 w-5 text-[var(--accent)]" aria-hidden />
            {dc.barTitle}
          </h3>
          <div className="min-h-[220px] flex-1">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dailyMsg}>
                <CartesianGrid stroke="#1f1f1f" vertical={false} />
                <XAxis dataKey="dayLabel" tick={TICK_STYLE} axisLine={false} />
                <YAxis tick={TICK_STYLE} axisLine={false} />
                <Tooltip
                  contentStyle={tooltipStyles}
                  formatter={(value, name) => [value, name]}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.dayKey ?? ""
                  }
                />
                <Bar
                  dataKey="unread"
                  stackId="m"
                  fill="#e8ff47"
                  name={dc.barUnread}
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="read"
                  stackId="m"
                  fill="#3d3d3d"
                  name={dc.barRead}
                  radius={[4, 4, 0, 0]}
                />
                <Legend wrapperStyle={{ color: "#6b6b6b", fontSize: 12 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${CARD} lg:col-span-4`}>
          <h3 className="mb-4 font-display text-lg text-[var(--text-primary)]">
            {dc.healthTitle}
          </h3>
          <ul className="space-y-2">
            {healthRows.map((row) => (
              <li key={row.id}>
                <button
                  type="button"
                  onClick={() => setTab(row.targetTab)}
                  className="flex w-full items-start gap-3 rounded-xl border border-[#1f1f1f] bg-[#0a0a0a]/60 px-3 py-3 text-left transition-colors hover:border-[var(--accent)]/40 hover:bg-[#151515] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  {iconForRow(row)}
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-[var(--text-primary)]">
                      {row.label}
                    </span>
                    <span className="mt-0.5 block text-xs text-[#6b6b6b]">
                      {row.valueText}
                      {row.hint ? ` · ${row.hint}` : ""}
                    </span>
                  </span>
                  <ArrowRight className="hidden h-4 w-4 shrink-0 text-[#6b6b6b] sm:block" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * @param {{
 *   icon: import('react').ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
 *   label: string;
 *   value: number;
 *   chip: string;
 *   badge?: number;
 * }} props
 */
function StatCard(props) {
  const { icon: IconCmp, label, value, chip, badge } = props;
  return (
    <div className={CARD}>
      {createElement(IconCmp, {
        className:
          "absolute right-4 top-4 h-6 w-6 text-[var(--accent)] opacity-90",
        "aria-hidden": true,
      })}
      {badge !== undefined ? (
        <span className="absolute right-12 top-3 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
          {badge > 99 ? "99+" : badge}
        </span>
      ) : null}
      <p className="font-display text-3xl tabular-nums text-[var(--text-primary)]">
        {value}
      </p>
      <p className="mt-1 text-sm text-[var(--text-muted)]">{label}</p>
      <span className="mt-3 inline-block rounded-full border border-[#2a2a2a] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#6b6b6b]">
        {chip}
      </span>
    </div>
  );
}

function useUnreadCountLive() {
  const [n, setN] = useState(() => getUnreadCount());
  useEffect(() => {
    const t = window.setInterval(() => setN(getUnreadCount()), 30000);
    return () => window.clearInterval(t);
  }, []);
  return n;
}
