# NexusShare — Frontend

NYU-verified syllabus transparency and course readiness platform. Built as a hackathon MVP.

## Tech Stack

- **React 18** + **TypeScript** via [Vite](https://vitejs.dev/)
- **TailwindCSS** for styling (custom `nyu-violet` color token)
- **react-router-dom** for client-side routing
- **lucide-react** for icons

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
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |

## Project Structure

```
src/
├── App.tsx                  # Router root (/ and /course/:id)
├── data/
│   └── mockCourses.ts       # 12 mock NYU course objects (no backend)
├── components/
│   ├── Navbar.tsx           # Global header with upload trigger
│   ├── CourseCard.tsx       # Grid card with badges and star rating
│   ├── CourseGrid.tsx       # Filtered grid with 500ms skeleton shimmer
│   ├── SkeletonCard.tsx     # Animated loading placeholder
│   ├── StarRating.tsx       # 1–5 visual star display
│   ├── UploadModal.tsx      # Drag-and-drop knowledge drop form
│   └── Toast.tsx            # Auto-dismissing success notification
└── pages/
    ├── Landing.tsx          # Hero, search bar, stats strip, course grid
    └── CourseDetail.tsx     # Two-column syllabus + community resources view
```

## Notes

- All data is mock — no backend or authentication.
- The app is a standalone demo; no API calls are made.
