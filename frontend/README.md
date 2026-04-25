# NexusShare — Frontend

NYU-verified syllabus transparency and course readiness platform. Built as a hackathon MVP.

## Tech Stack

- **React 18** + **TypeScript** via [Vite](https://vitejs.dev/)
- **Tailwind CSS 3** — official NYU brand palette, `darkMode: 'class'`
- **react-router-dom** — client-side routing
- **lucide-react** — icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server |
| `npm run build` | Type-check + production build to `dist/` |
| `npm run preview` | Serve the production build locally |

## Project Structure

```
src/
├── App.tsx                    # Router root (/ and /course/:id)
├── main.tsx                   # Entry point — wraps app in ThemeProvider
├── index.css                  # Tailwind directives + design tokens + animation utilities
├── context/
│   └── ThemeContext.tsx        # Dark mode toggle — localStorage-persisted, prefers-color-scheme fallback
├── data/
│   └── mockCourses.ts          # 12 mock NYU course objects (no backend)
├── components/
│   ├── Navbar.tsx              # Glassmorphism header — dark mode toggle (Sun/Moon), upload trigger
│   ├── CourseCard.tsx          # Grid card — NYU accent badges, hardware-accelerated card-hover lift
│   ├── CourseGrid.tsx          # Filtered grid — 60ms staggered fade-up, 500ms skeleton on query change
│   ├── SkeletonCard.tsx        # Directional shimmer sweep (replaces flat pulse)
│   ├── StarRating.tsx          # 1–5 star display — NYU yellow filled, proper dark empty stars
│   ├── UploadModal.tsx         # Drag-and-drop knowledge drop — modal-enter animation, dark form
│   └── Toast.tsx               # Auto-dismissing success notification — toast-enter animation
└── pages/
    ├── Landing.tsx             # Split hero (headline/search + live stats card), course grid
    └── CourseDetail.tsx        # Two-column syllabus + grading bars + community resources
```

## Design System

**Typography:** Montserrat (Google Fonts) — stand-in for Gotham (NYU institutional font).
To swap in Gotham: add `.woff2` files to `public/fonts/`, add `@font-face` in `index.css`,
and update `fontFamily.sans` in `tailwind.config.js` to `['Gotham', 'Montserrat', ...]`.

**Color palette:** Official NYU brand colors defined in `tailwind.config.js`:

| Token | Value | Usage |
|---|---|---|
| `nyu-violet` | `#57068c` | Primary CTAs, course codes, active states |
| `nyu-ultra-violet` | `#8900e1` | Accent only — tab underlines, badge borders |
| `nyu-deep-violet` | `#330662` | CTA hover state |
| `nyu-teal` | `#009b8a` | Syllabus verified badge, positive feedback |
| `nyu-blue` | `#59b2d1` | Async recording badge |
| `nyu-magenta` | `#fb0f78` | In-person recording badge, negative feedback |
| `nyu-yellow` | `#f4ec51` | Star ratings, textbook cost badge |
| `surface-dark-base` | `#0F0A14` | Dark mode page background (violet-tinted) |
| `surface-dark-raised` | `#1A1224` | Dark mode card background |
| `ink-primary` | `#404040` | Body text (light mode) |
| `ink-dark-primary` | `#eee6f3` | Body text (dark mode) |

**Accessibility rules:**
- Body text uses `#404040` (not `#000000`) to reduce eye strain
- Ultra Violet is never used as a background fill
- All contrast pairings meet 3:1 minimum for UI elements

**Dark mode:** Toggled via the Sun/Moon button in the Navbar. Persisted to `localStorage`
under the key `nexus-theme`. Defaults to the OS `prefers-color-scheme` on first visit.
An inline script in `index.html` applies the `dark` class before first paint to prevent FOUC.

## Notes

- All data is mock — no backend or authentication.
- The app is a standalone demo; no API calls are made.
