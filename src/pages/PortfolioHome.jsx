import { BackToTop } from "@/components/BackToTop";
import { CustomCursor } from "@/components/CustomCursor";
import { SEOHead } from "@/components/SEOHead";
import { Footer } from "@/layout/Footer";
import { Navbar } from "@/layout/Navbar";
import { About } from "@/sections/About";
import { Contact } from "@/sections/Contact";
import { Experience } from "@/sections/Experience";
import { Hero } from "@/sections/Hero";
import { Projects } from "@/sections/Projects";
import { Testimonials } from "@/sections/Testimonials";
import { site } from "@/config/site";
import { absoluteUrl } from "@/lib/seo";
import { getSEOConfig } from "@/utils/seo";

/**
 * Marketing homepage composed of section fragments with global chrome.
 */
export function PortfolioHome() {
  const seoMerged = getSEOConfig();
  const metaDesc =
    seoMerged.global.metaDescription?.trim() ||
    site.seo.defaultDescription;
  const ogImg =
    seoMerged.global.ogDefaultImageUrl?.trim() || site.seo.defaultOgImage;

  return (
    <>
      <SEOHead
        title={site.seo.homeTitle}
        description={metaDesc}
        image={absoluteUrl(ogImg)}
        url={absoluteUrl("/")}
        type="website"
        author={site.seo.personName}
        tags={[]}
        breadcrumbVariant="home"
      />
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)]">
        <a href="#main-content" className="skip-link">
          {site.skipToMainLabel}
        </a>
        <Navbar />
        <main id="main-content">
          <Hero />
          <About />
          <Projects />
          <Experience />
          <Testimonials />
          <Contact />
        </main>
        <Footer />
        <BackToTop />
        <CustomCursor />
      </div>
    </>
  );
}
