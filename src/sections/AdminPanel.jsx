import { useMemo, useState } from "react";
import { Footer } from "@/layout/Footer";
import { Navbar } from "@/layout/Navbar";
import { SEOHead } from "@/components/SEOHead";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminEditor } from "@/components/admin/AdminEditor";
import { AdminInbox } from "@/components/admin/AdminInbox";
import { AdminLoginCard } from "@/components/admin/AdminLoginCard";
import { AdminPostsTable } from "@/components/admin/AdminPostsTable";
import { AdminSEOControlCenter } from "@/components/admin/AdminSEOControlCenter";
import { site } from "@/config/site";
import { absoluteUrl } from "@/lib/seo";
import { useToast } from "@/context/ToastContext";
import { deletePost, loadPosts, upsertPost } from "@/lib/blogStorage";
import { trackEvent } from "@/analytics/analytics";
import { ACT_POST_DELETED, ACT_POST_PUBLISHED, CAT_ADMIN } from "@/analytics/eventConstants";

const SESSION_KEY = "hitarth_admin_session";

/** @typedef {'dashboard'|'posts'|'editor'|'inbox'|'seo'} AdminTab */

/**
 * Admin ID + password–gated surface for managing blog posts and the contact inbox.
 */
export function AdminPanel() {
  const { showToast } = useToast();
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "true",
  );
  const [posts, setPosts] = useState(loadPosts);
  const [editing, setEditing] = useState(
    /** @type {null | import('@/lib/blogStorage').BlogPost} */ (null),
  );
  const [creating, setCreating] = useState(false);
  const [tab, setTab] = useState(/** @type {AdminTab} */ ("dashboard"));

  const stats = useMemo(() => {
    const drafts = posts.filter((p) => p.status === "draft").length;
    const published = posts.filter((p) => p.status === "published").length;
    return { total: posts.length, drafts, published };
  }, [posts]);

  const refresh = () => setPosts(loadPosts());

  const unlock = (e) => {
    e.preventDefault();
    const idOk = adminId.trim() === site.blogAdminId;
    const passOk = password === site.blogAdminPassword;
    if (idOk && passOk) {
      sessionStorage.setItem(SESSION_KEY, "true");
      setAuthed(true);
      showToast(site.admin.unlockToastSuccess, "success");
    } else {
      showToast(site.admin.unlockToastError, "error");
    }
  };

  const signOut = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
    setAdminId("");
    setPassword("");
    setEditing(null);
    setCreating(false);
    setTab("dashboard");
  };

  const onSave = (payload) => {
    const prev = payload.id ? posts.find((p) => p.id === payload.id) : null;
    const saved = upsertPost(payload);
    if (saved.status === "published" && prev?.status !== "published") {
      trackEvent({
        category: CAT_ADMIN,
        action: ACT_POST_PUBLISHED,
        label: saved.title,
      });
    }
    refresh();
    setEditing(null);
    setCreating(false);
    setTab("posts");
    showToast(site.admin.saveToast, "success");
  };

  const onDeletePost = (post) => {
    if (!window.confirm(site.admin.deleteConfirm)) return;
    deletePost(post.id);
    refresh();
    trackEvent({
      category: CAT_ADMIN,
      action: ACT_POST_DELETED,
      label: post.title,
    });
    showToast(site.admin.deleteLabel, "info");
  };

  const togglePublish = (post) => {
    const nextStatus = post.status === "published" ? "draft" : "published";
    upsertPost({
      ...post,
      status: nextStatus,
    });
    if (nextStatus === "published") {
      trackEvent({
        category: CAT_ADMIN,
        action: ACT_POST_PUBLISHED,
        label: post.title,
      });
    }
    refresh();
    showToast(site.admin.togglePublishLabel, "success");
  };

  const tabBtn = (/** @type {AdminTab} */ id, label) => (
    <button
      key={id}
      type="button"
      onClick={() => setTab(id)}
      className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        tab === id
          ? "bg-[var(--accent)] text-[#0a0a0a]"
          : "border border-[var(--border)] bg-[var(--bg)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
      }`}
    >
      {label}
    </button>
  );

  return (
    <>
      <SEOHead
        title={site.admin.title}
        description={site.seo.defaultDescription}
        image={absoluteUrl(site.seo.defaultOgImage)}
        url={absoluteUrl("/admin")}
        type="website"
        author={site.seo.personName}
        tags={["admin"]}
        noIndex
        breadcrumbVariant="home"
      />
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)]">
        <Navbar />
        <main className="container mx-auto max-w-6xl px-6 pb-24 pt-28 md:pt-32">
          {!authed ? (
            <AdminLoginCard
              adminId={adminId}
              setAdminId={setAdminId}
              password={password}
              setPassword={setPassword}
              onSubmit={unlock}
            />
          ) : (
            <div className="space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-4xl">{site.admin.title}</h1>
                  <p className="text-[var(--text-muted)]">
                    {stats.total} posts · {stats.published} published ·{" "}
                    {stats.drafts} drafts
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCreating(true);
                      setEditing(null);
                      setTab("editor");
                    }}
                    className="min-h-11 rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-[#0a0a0a]"
                  >
                    {site.admin.newPostLabel}
                  </button>
                  <button
                    type="button"
                    onClick={signOut}
                    className="min-h-11 rounded-full border border-[var(--border)] px-5 py-2 text-sm"
                  >
                    {site.admin.signOutLabel}
                  </button>
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {tabBtn("dashboard", site.admin.dashboardTitle)}
                {tabBtn("posts", site.admin.postsTitle)}
                {tabBtn("editor", site.admin.editorTabTitle)}
                {tabBtn("inbox", site.admin.inbox.tabLabel)}
                {tabBtn("seo", site.admin.seoTabTitle)}
              </div>

              {tab === "dashboard" ? (
                <AdminDashboard posts={posts} setTab={setTab} />
              ) : null}

              {tab === "posts" ? (
                <AdminPostsTable
                  posts={posts}
                  onEdit={(post) => {
                    setEditing(post);
                    setCreating(false);
                    setTab("editor");
                  }}
                  onTogglePublish={togglePublish}
                  onDelete={onDeletePost}
                />
              ) : null}

              {tab === "editor" ? (
                creating || editing ? (
                  <AdminEditor
                    initial={creating ? null : editing}
                    onSave={onSave}
                    onCancel={() => {
                      setCreating(false);
                      setEditing(null);
                      setTab("posts");
                    }}
                  />
                ) : (
                  <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)]/30 p-10 text-center text-sm text-[var(--text-muted)]">
                    Use <strong className="text-[var(--text-primary)]">New post</strong>{" "}
                    above or open the Posts tab and choose Edit to open the editor.
                  </div>
                )
              ) : null}

              {tab === "inbox" ? <AdminInbox /> : null}

              {tab === "seo" ? (
                <AdminSEOControlCenter
                  posts={posts}
                  refreshPosts={refresh}
                  showToast={showToast}
                />
              ) : null}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}
