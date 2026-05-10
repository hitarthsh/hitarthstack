/** Single source for public portfolio identity, copy, SEO, and analytics config */

/** @typedef {{ label: string; href: string }} SiteFooterLink */
/** @typedef {{ label: string; hash?: string; path?: string }} SiteNavItem */
/** @typedef {{ kicker: string; title: string; titleAccent: string; description: string }} SiteSectionHeader */
/** @typedef {{ id: string; title: string; description: string; fullDescription: string; coverImage: string; tags: string[]; liveUrl: string; githubUrl: string }} SiteProject */
/** @typedef {{ quote: string; author: string; role: string; avatar: string }} SiteTestimonial */
/** @typedef {{ iconKey: string; title: string; description: string }} SiteHighlight */
/** @typedef {{ label: string; value: number; suffix?: string }} SiteStat */

export const site = {
  fullName: "Hitarth Shah",
  logoInitials: "HS",
  contactCtaLabel: "Let's Talk",
  resumeCtaLabel: "Résumé",
  skipToMainLabel: "Skip to main content",
  siteUrl: "https://hitarthshah.dev",
  twitterHandle: "hitarth_handle",
  googleAnalyticsId: "G-17DSRZFBGF",

  seo: {
    titleSuffix: "Hitarth Shah",
    siteNameOg: "Hitarth Shah — Portfolio",
    homeTitle: "Full Stack Developer & Designer",
    blogIndexTitle: "Blog",
    defaultDescription:
      "React-focused frontend engineer building fast, scalable interfaces — portfolio, projects, and writing.",
    defaultOgImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop",
    personName: "Hitarth Shah",
    breadcrumbHome: "Home",
    breadcrumbBlog: "Blog",
    jsonLdPersonUrl: "https://hitarthshah.dev",
    /** Used by SEOHead only — keep microcopy out of JSX */
    twitterCard: "summary_large_image",
    robotsIndexFollow: "index, follow",
    robotsNoIndex: "noindex, nofollow",
    blogIndexDescription:
      "Articles and notes on React, frontend craft, and shipping — filter by topic or search.",
    schemaOrgContext: "https://schema.org",
  },

  cookieBanner: {
    message:
      "This site uses optional analytics to understand traffic. Choose Accept or Decline.",
    acceptLabel: "Accept",
    declineLabel: "Decline",
  },

  /** Login for /admin — set `VITE_ADMIN_ID` and `VITE_ADMIN_PASSWORD` in `.env` (do not commit `.env`). */
  blogAdminId: import.meta.env.VITE_ADMIN_ID ?? "",
  blogAdminPassword: import.meta.env.VITE_ADMIN_PASSWORD ?? "",
  blogCategories: ["Engineering", "Design", "Career", "Notes"],
  blogPageSize: 6,

  /** Author block for blog post pages (avatar uses aboutPortrait). */
  blogAuthor: {
    role: "Frontend Developer",
    roleExpanded: "Frontend Developer & Designer",
  },

  badgeLabel: "Building in public • Creativity Coder • React specialist",
  shortTagline:
    "React specialist focused on performance, scalability, and modern UI/UX — shipping production-ready apps.",
  heroIntro:
    "Hi, I'm Hitarth Shah — co-founder of Creativity Coder. I specialize in React and modern frontend architectures, building scalable interfaces that stay fast and pleasant to use.",
  /** Skills shown in hero marquee */
  heroSkillsMarquee: [
    "React",
    "Next.js",
    "TypeScript",
    "Redux",
    "Node.js",
    "MongoDB",
    "Tailwind CSS",
    "Express",
    "Git",
    "Performance",
    "Modern UI/UX",
    "JavaScript",
  ],

  hero: {
    scrollCueLabel: "Scroll",
    scrollTargetId: "about",
    primaryCtaLabel: "View Projects",
    followLabel: "Follow me:",
    techMarqueeTitle: "Technologies I work with",
    githubButtonLabel: "GitHub",
    floatingBadgeLabel: "Open to work ✦",
    cornerBadgeTitle: "React",
    cornerBadgeSubtitle: "specialist",
    decorativeLine1: "digital",
    decorativeLine2: "precision.",
    headlineLead: "Crafting",
    headlineMid: "experiences with",
  },

  urls: {
    github: "https://github.com/hitarthsh",
    linkedin: "https://www.linkedin.com/in/hitarthshah-react/",
    website: "https://creativitycoder.com/",
    resume: "/resume.pdf",
  },

  contact: {
    email: "shahh0919@gmail.com",
    location: "Ahmedabad, India",
    websiteDisplay: "creativitycoder.com",
    websiteLabel: "Website",
    locationLabel: "Location",
    form: {
      successMessage:
        "Message sent! I'll get back to you soon ✦",
      genericErrorMessage:
        "Something went wrong. Please try again.",
      sendingLabel: "Sending...",
      submitLabel: "Send Message",
      nameLabel: "Name",
      emailLabel: "Email",
      subjectLabel: "Subject",
      messageLabel: "Message",
      budgetLabel: "Budget",
      projectTypeLabel: "Project type",
      namePlaceholder: "Your name...",
      emailPlaceholder: "your@email.com",
      subjectPlaceholder: "What's this about?",
      messagePlaceholder: "Your message...",
      requiredHint: "This field is required.",
      emailInvalidHint: "Enter a valid email address.",
      messageMinHint: "Message must be at least 20 characters.",
      messageMaxHint: "Message must be at most 500 characters.",
      budgetOptions: [
        "Under $1k",
        "$1k–$5k",
        "$5k–$10k",
        "$10k+",
        "Just saying hi",
      ],
      projectTypeOptions: [
        "Web App",
        "Mobile",
        "Design",
        "Consulting",
        "Other",
      ],
      selectBudgetPlaceholder: "Select a budget range",
      selectProjectTypePlaceholder: "Select a project type",
      charactersCounterTemplate: "{{current}} / {{max}}",
    },
    section: {
      kicker: "Get In Touch",
      title: "Let's build",
      titleAccent: "something great.",
      description:
        "Have a project in mind? I'd love to hear about it. Send a message or reach out via GitHub or LinkedIn.",
      heading: "Let's talk",
      headingAccent: "",
      subheading:
        "Collaboration, freelance, or full-time — I'm responsive and product-minded.",
      socialHeading: "Around the web",
      copyEmailLabel: "Copy email",
      copiedLabel: "Copied",
    },
    infoCardTitle: "Contact Information",
    availabilityTitle: "Open to opportunities",
    availabilityBody:
      "I'm interested in collaboration, freelance work, and roles where React craftsmanship and product thinking matter.",
  },

  missionQuote:
    "A fast, scalable React app isn't optional — it's the baseline. I aim for interfaces that feel snappy, stay maintainable, and reflect thoughtful UX.",

  aboutParagraphs: [
    "I'm a React-focused engineer who cares about performance, scalability, and polished UI/UX. I enjoy turning complex product requirements into maintainable frontends that teams can evolve with confidence.",
    "My toolkit centers on the React ecosystem — component architecture, state patterns (including Redux and modern alternatives), TypeScript, and thoughtful integration with APIs — alongside supporting backend familiarity when shipping full-stack features.",
    "I'm building in public through Creativity Coder, sharpening advanced patterns, performance tuning, and collaboration with designers and product stakeholders.",
  ],

  sections: {
    about: {
      kicker: "About Me",
      title: "Building products that",
      titleAccent: "matter.",
    },
    projects: {
      kicker: "Featured Work",
      title: "Projects that",
      titleAccent: "make an impact.",
      description:
        "A selection of my recent work, from complex web applications to innovative tools that solve real-world problems.",
      marqueeSubtitle:
        "Recent shipped work — hover the ticker to pause, hold ↗ on a card to open details.",
      showcaseAriaLabel: "Projects showcase",
      projectCountSuffix: "projects",
      cardAriaLabelTemplate: "{{title}} — hold the arrow control to open details, or press Enter while focused.",
      cardGithubAriaLabelTemplate: "View {{title}} on GitHub",
      holdArrowAriaLabel:
        "Hold one point two seconds to open project details",
      githubCta: "View on GitHub",
      modalCloseLabel: "Close",
      modalLiveDemoLabel: "Live demo",
      modalGithubLabel: "GitHub",
    },
    experience: {
      kicker: "Career Journey",
      title: "Experience that",
      titleAccent: "speaks volumes.",
      linkedInCta: "View on LinkedIn",
    },
    testimonials: {
      kicker: "What People Say",
      title: "Kind words from",
      titleAccent: "amazing people.",
      prevLabel: "Previous testimonial",
      nextLabel: "Next testimonial",
      tabsLabel: "Choose testimonial",
    },
    blog: {
      kicker: "Writing",
      title: "Notes &",
      titleAccent: "articles.",
      description:
        "Thoughts on frontend craft, shipping, and tools — filter by topic or search.",
      searchPlaceholder: "Search posts…",
      emptyTitle: "No posts yet",
      emptyBody: "Check back soon — or publish from the admin panel.",
      readArticle: "Read article",
      shareLabel: "Share",
      loadMore: "Load more",
      minutesShort: "min read",
      filtersAriaLabel: "Filter blog posts by category",
      post: {
        onThisPage: "On this page",
        shareThisPost: "Share this post",
        contentsAccordion: "Contents",
        taggedInPrefix: "Tagged in:",
        youMightAlsoLike: "You might also like",
        backToBlog: "← Back to all posts",
        lastUpdatedPrefix: "Last updated",
        readLaterCta: "Read later",
        savedToast: "Saved!",
        copyLink: "Copy link",
        copied: "Copied",
        enjoyPrompt: "Enjoyed this?",
        saveForLaterHint: "Save it for later",
        save: "Save",
        dismissBannerAria: "Dismiss save banner",
        readingProgressAria: "Article reading progress",
        estimatedReadPrefix: "↓",
        twitterShareLabel: "Share on X",
        linkedinShareLabel: "Share on LinkedIn",
      },
    },
  },

  navItems: [
    { label: "Home", path: "/" },
    { label: "About", hash: "about" },
    { label: "Projects", hash: "projects" },
    { label: "Experience", hash: "experience" },
    { label: "Testimonials", hash: "testimonials" },
    { label: "Blog", path: "/blog" },
    { label: "Admin", path: "/admin" },
  ],

  footerCopyrightSuffix: "All rights reserved.",

  footerLinks: [
    { label: "Home", href: "/" },
    { label: "About", href: "/#about" },
    { label: "Projects", href: "/#projects" },
    { label: "Experience", href: "/#experience" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/#contact" },
  ],

  socialPlatforms: [
    { key: "github", label: "GitHub", urlKey: "github" },
    { key: "linkedin", label: "LinkedIn", urlKey: "linkedin" },
    { key: "website", label: "Website", urlKey: "website" },
  ],

  aboutPortrait: {
    src: "/profile-photo.jpg",
    alt: "Portrait of Hitarth Shah",
  },

  aboutHighlights: [
    {
      iconKey: "code",
      title: "Full Stack Dev",
      description:
        "End-to-end features — solid APIs, data modeling, and resilient React interfaces.",
    },
    {
      iconKey: "lightbulb",
      title: "UI/UX Design",
      description:
        "Layouts and flows that stay readable, accessible, and pleasant across breakpoints.",
    },
    {
      iconKey: "rocket",
      title: "Mobile Dev",
      description:
        "Responsive-first delivery and performance-aware patterns for touch and small screens.",
    },
    {
      iconKey: "users",
      title: "SEO/Marketing",
      description:
        "Structured content, sensible meta, and pages built to be crawlable and shareable.",
    },
  ],

  aboutStats: [
    { label: "Years Experience", value: 4, suffix: "+" },
    { label: "Projects Completed", value: 12, suffix: "+" },
    { label: "Happy Clients", value: 20, suffix: "+" },
  ],

  skillBars: [
    { label: "React / UI architecture", value: 92 },
    { label: "TypeScript", value: 88 },
    { label: "Performance & DX", value: 85 },
  ],

  projects: [
    {
      id: "fintech-dashboard",
      title: "Fintech Dashboard",
      description:
        "Financial analytics with real-time visualization, portfolio views, and AI-assisted insights.",
      fullDescription:
        "A comprehensive financial analytics platform with real-time data visualization, portfolio management, and AI-powered insights.\n\nBuilt for clarity under load: resilient charts, optimistic updates, and role-aware layouts so traders and analysts get signal without noise.",
      coverImage: "/projects/project1.png",
      tags: ["React", "TypeScript", "Node.js"],
      liveUrl: "#",
      githubUrl: "https://github.com/hitarthsh",
    },
    {
      id: "ecommerce-platform",
      title: "E-Commerce Platform",
      description:
        "Full-featured storefront with inventory, payments, and an operator-facing analytics dashboard.",
      fullDescription:
        "A full-featured e-commerce solution with inventory management, payment processing, and analytics dashboard.\n\nEmphasizes checkout resilience, webhook-driven fulfillment hooks, and pragmatic observability so ops can trace orders end-to-end.",
      coverImage: "/projects/project2.png",
      tags: ["Next.js", "Stripe", "PostgreSQL", "Tailwind"],
      liveUrl: "#",
      githubUrl: "https://github.com/hitarthsh",
    },
    {
      id: "ai-writing-assistant",
      title: "AI Writing Assistant",
      description:
        "An intelligent drafting companion powered by GPT-4 with guardrails and structured outputs.",
      fullDescription:
        "An intelligent writing tool powered by GPT-4, helping users create better content faster.\n\nFocuses on editorial workflows: templated prompts, citation-safe modes, and latency-aware streaming UX.",
      coverImage: "/projects/project3.png",
      tags: ["React", "OpenAI", "Python", "FastAPI"],
      liveUrl: "#",
      githubUrl: "https://github.com/hitarthsh",
    },
    {
      id: "project-management-tool",
      title: "Project Management Tool",
      description:
        "Team workspace with realtime updates, tasks, and integrations for shipping workflows.",
      fullDescription:
        "A collaborative workspace for teams with real-time updates, task tracking, and integrations.\n\nDesigned around low-friction onboarding, durable presence, and keyboard-first navigation for daily drivers.",
      coverImage: "/projects/project4.png",
      tags: ["Next.js", "Socket.io", "MongoDB", "Redis"],
      liveUrl: "#",
      githubUrl: "https://github.com/hitarthsh",
    },
  ],

  testimonials: [
    {
      quote:
        "Hitarth is one of the most talented engineers I've worked with. His attention to detail and ability to translate complex requirements into elegant solutions is remarkable.",
      author: "Sarah Chen",
      role: "CTO, Tech Innovators Inc.",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    {
      quote:
        "Working with Hitarth was a game-changer for our project. He delivered ahead of schedule with code quality that set a new standard for our team.",
      author: "Michael Rodriguez",
      role: "Product Manager, Digital Solutions",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    },
    {
      quote:
        "Hitarth's expertise in React and TypeScript helped us rebuild our entire frontend in record time. His architectural decisions continue to pay dividends.",
      author: "Emily Watson",
      role: "Engineering Lead, StartUp Labs",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    },
    {
      quote:
        "Not only is Hitarth technically brilliant, but he's also a fantastic communicator and team player. He elevated everyone around him.",
      author: "David Kim",
      role: "CEO, Innovation Hub",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
  ],

  experienceIntro:
    "Roles and dates match my LinkedIn. Use “View on LinkedIn” for skills badges, media, and full detail.",
  experience: [
    {
      period: "Jul 2025 — Present",
      role: "Angular Developer",
      company: "Shrimad Rajchandra Love and Care · Full-time",
      location: "Surendranagar, Gujarat, India · On-site",
      description:
        "Building and shipping Angular applications with Angular Material and a broader frontend toolkit for organizational initiatives.",
      technologies: ["Angular", "Angular Material", "TypeScript"],
      current: true,
    },
    {
      period: "Jun 2025 — Present",
      role: "Co-Founder",
      company: "Creativity Coder · Full-time",
      location: "Remote",
      description:
        "Co-founder at Creativity Coder | Full-stack web developer — delivering scalable digital experiences, including web development, mobile-oriented delivery, and custom software for clients.",
      technologies: [
        "React",
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Shadcn UI",
        "Framer Motion",
        "React Query",
        "React Hook Form",
        "React Router",
        "React Icons",
        "Full-stack",
        "E-commerce",
        "CRM",
        "JavaScript",
      ],
      current: true,
    },
    {
      period: "Jan 2025 — Apr 2026",
      role: "Full Stack Developer",
      company: "Sheryians Coding School · Apprenticeship",
      location: "Bhopal, Madhya Pradesh, India · Remote",
      description:
        "Full-stack training via the Job Ready AI-Powered cohort — intensive curriculum spanning modern web stack, product-minded shipping, and production-quality apps.",
      technologies: [
        "React",
        "Node.js",
        "Web design",
        "REST APIs",
        "MongoDB",
        "JavaScript",
        "HTML/CSS",
        "Git",
        "GitHub",
        "VS Code",
        "Postman",
      ],
      current: false,
    },
    {
      period: "Sep 2023 — Apr 2024",
      role: "React JS Developer",
      company: "Centous Solutions · Internship",
      location: "Ahmedabad, Gujarat, India · On-site",
      description:
        "Frontend web development with React.js, WordPress, and UI/UX optimization — implementing responsive interfaces and collaborating on delivery in an internship setting.",
      technologies: [
        "React.js",
        "WordPress",
        "GitHub",
        "JavaScript",
        "UI/UX",
        "HTML/CSS",
        "Git",
        "GitHub",
        "VS Code",
        "Postman",
        "Figma",
        "Adobe XD",
      ],
      current: false,
    },
  ],

  admin: {
    cancelLabel: "Cancel",
    title: "Blog admin",
    adminIdLabel: "Admin ID",
    adminPasswordLabel: "Password",
    unlockLabel: "Unlock",
    signOutLabel: "Sign out",
    dashboardTitle: "Dashboard",
    postsTitle: "Posts",
    editorTabTitle: "New Post",
    seoTabTitle: "SEO",
    dashboardBlurb:
      "Blog posts and contact messages are stored locally in this browser only.",
    chartCategoryColors: [
      "#e8ff47",
      "#7dd3fc",
      "#c4b5fd",
      "#fca5a5",
      "#fde047",
      "#86efac",
      "#fdba74",
      "#94a3b8",
    ],
    dashboardCharts: {
      statTotalPosts: "Total Posts",
      statPublished: "Published",
      statDrafts: "Drafts",
      statMessages: "Messages",
      chipAllTime: "All time",
      chipLiveNow: "Live now",
      chipPending: "Pending",
      chipUnread: "Unread",
      areaTitle: "Posts over time",
      areaEmpty: "No data yet — publish your first post to see trends",
      areaPublished: "Published",
      areaDrafts: "Drafts",
      donutTitle: "Posts by category",
      donutEmpty: "No categories yet",
      barTitle: "Messages per day",
      barUnread: "Unread",
      barRead: "Read",
      healthTitle: "Content health",
      scoreGood: "Good",
      scoreNeedsWork: "Needs work",
      scorePoor: "Poor",
    },
    newPostLabel: "New post",
    saveLabel: "Save",
    publishLabel: "Publish",
    draftLabel: "Draft",
    deleteLabel: "Delete",
    editLabel: "Edit",
    togglePublishLabel: "Toggle publish",
    editorTitleLabel: "Title",
    slugLabel: "Slug",
    categoryLabel: "Category",
    tagsLabel: "Tags (comma-separated)",
    coverLabel: "Cover image URL",
    bodyLabel: "Markdown",
    statusLabel: "Status",
    seoHeading: "SEO",
    metaTitleLabel: "Meta title",
    metaDescriptionLabel: "Meta description",
    ogImageLabel: "Open Graph image URL",
    canonicalUrlLabel: "Canonical URL",
    noIndexLabel: "Hide from search engines (noindex)",
    tableUpdatedLabel: "Updated",
    deleteConfirm:
      "Permanently delete this post? This cannot be undone.",
    saveToast: "Post saved",
    previewPlaceholder: "_Start writing…_",
    actionsColumnLabel: "Actions",
    unlockToastSuccess: "Admin unlocked",
    unlockToastError: "Invalid admin ID or password",
    inbox: {
      tabLabel: "Inbox",
      heading: "Inbox",
      searchPlaceholder: "Search name, email, or subject…",
      filterAll: "All",
      filterUnread: "Unread",
      filterStarred: "Starred",
      filterReplied: "Replied",
      statTotal: "Total",
      statUnread: "Unread",
      statStarred: "Starred",
      statReplied: "Replied",
      exportCsv: "Export CSV",
      exportJson: "Export JSON",
      emptyTitle: "No messages yet.",
      emptyBody: "Share your portfolio!",
      selectMessageHint: "Select a message to read details.",
      markRead: "Mark as Read",
      markUnread: "Mark as Unread",
      star: "Star",
      unstar: "Unstar",
      markReplied: "Mark Replied",
      markUnreplied: "Mark Not Replied",
      replyViaEmail: "Reply via Email",
      delete: "Delete",
      deleteConfirm:
        "Delete this message permanently? This cannot be undone.",
      closeDetail: "Close",
      sheetAriaLabel: "Message detail",
      repliedBadge: "Replied",
      unreadBadgeAria: "Unread messages",
      filterEmptyHint: "No messages match this filter.",
    },
  },

  blogSeedPosts: [],
};

export { site as siteConfig };
