# hitarthstack — Personal portfolio

Single-page marketing portfolio for **Hitarth Shah**, built with React and Vite. Content (bio, links, experience, contact) is centralized in configuration so the UI stays focused on layout and presentation.

## Stack

| Layer | Choice |
| --- | --- |
| UI | React 19 |
| Build | Vite (rolldown-vite via npm override) |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Icons | lucide-react |
| Contact form | @emailjs/browser |
| Lint | ESLint 9 + React plugins |

Path alias: `@` resolves to `src/` (see `vite.config.js`).

## Project layout

```
src/
├── App.jsx              # Page shell: skip link, Navbar, sections, Footer
├── config/
│   └── site.js          # Names, taglines, URLs, experience entries, contact
├── layout/              # Navbar, Footer
├── sections/            # Hero, About, Projects, Experience, Testimonials, Contact
├── components/          # Shared UI (e.g. buttons)
└── index.css            # Global styles / Tailwind entry
```

Update copy, social links, and résumé-style data in **`src/config/site.js`** rather than scattering strings across components.

## Scripts

```bash
npm run dev      # Local dev server with HMR
npm run build    # Production build to dist/
npm run preview  # Serve dist/ locally
npm run lint     # ESLint on the repo
```

## Customization checklist

1. Edit **`src/config/site.js`** — identity, hero/about text, `urls`, `contact`, `experience`.
2. Replace project cards and testimonial content in the corresponding **`src/sections/`** files if those sections use local data arrays.
3. Configure EmailJS (or swap the contact implementation) if the contact form should send mail from your keys.

## Related docs

- [README.md](./README.md) — upstream Vite/React template notes
