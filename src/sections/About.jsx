import { Code2, Lightbulb, Rocket, Users } from "lucide-react";
import { site } from "@/config/site";

const highlights = [
  {
    icon: Code2,
    title: "Clean Code",
    description:
      "Maintainable, scalable frontends that stay readable as products evolve.",
  },
  {
    icon: Rocket,
    title: "Performance",
    description:
      "Shipping experiences that feel fast — bundle discipline, rendering patterns, and real UX wins.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description:
      "Working closely with product and design to align feasibility with polish.",
  },
  {
    icon: Lightbulb,
    title: "Modern Stack",
    description:
      "Deep React ecosystem fluency with pragmatic picks from adjacent tooling.",
  },
];

export const About = () => {
  return (
    <section
      id="about"
      className="py-32 relative overflow-hidden scroll-mt-24 md:scroll-mt-28"
    >
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="animate-fade-in">
              <span className="text-secondary-foreground text-sm font-medium tracking-wider uppercase">
                About Me
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold leading-tight animate-fade-in animation-delay-100 text-secondary-foreground">
              Building in public,
              <span className="font-serif italic font-normal text-white">
                {" "}
                one release at a time.
              </span>
            </h2>

            <div className="space-y-4 text-muted-foreground animate-fade-in animation-delay-200">
              {site.aboutParagraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <div className="glass rounded-2xl p-6 glow-border animate-fade-in animation-delay-300">
              <p className="text-lg font-medium italic text-foreground">
                &ldquo;{site.missionQuote}&rdquo;
              </p>
            </div>
          </div>

          {/* Right Column - Hilights */}
          <div className="grid sm:grid-cols-2 gap-6">
            {highlights.map((item, idx) => (
              <div
                key={idx}
                className="glass p-6 rounded-2xl animate-fade-in"
                style={{ animationDelay: `${(idx + 1) * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 hover:bg-primary/20">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
