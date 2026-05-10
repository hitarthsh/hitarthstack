import { Suspense, lazy, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ConsentBanner } from "@/components/ConsentBanner";
import { LenisProvider } from "@/components/LenisProvider";
import { RouteTracker } from "@/components/RouteTracker";
import { ToastProvider } from "@/context/ToastContext";
import { PortfolioHome } from "@/pages/PortfolioHome";
import { initGA } from "@/analytics/analytics";
import { SEO_UPDATED_EVENT } from "@/utils/seo";

const Blog = lazy(() =>
  import("@/sections/Blog").then((m) => ({ default: m.Blog })),
);
const AdminPanel = lazy(() =>
  import("@/sections/AdminPanel").then((m) => ({ default: m.AdminPanel })),
);
const BlogPostPage = lazy(() =>
  import("@/pages/BlogPostPage").then((m) => ({ default: m.BlogPostPage })),
);

function App() {
  useEffect(() => {
    try {
      if (
        localStorage.getItem("hitarth_analytics_consent") === "true" &&
        localStorage.getItem("hitarth_analytics_opt_out") !== "true"
      ) {
        initGA();
      }
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    const refreshGa = () => {
      try {
        if (
          localStorage.getItem("hitarth_analytics_consent") === "true" &&
          localStorage.getItem("hitarth_analytics_opt_out") !== "true"
        ) {
          initGA({ force: true });
        }
      } catch {
        /* ignore */
      }
    };
    window.addEventListener(SEO_UPDATED_EVENT, refreshGa);
    return () => window.removeEventListener(SEO_UPDATED_EVENT, refreshGa);
  }, []);

  return (
    <HelmetProvider>
      <ToastProvider>
        <LenisProvider>
          <ConsentBanner />
          <RouteTracker />
          <Suspense
            fallback={
              <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)]" />
            }
          >
            <Routes>
              <Route path="/" element={<PortfolioHome />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </Suspense>
        </LenisProvider>
      </ToastProvider>
    </HelmetProvider>
  );
}

export default App;
