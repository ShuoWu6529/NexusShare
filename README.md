# NexusShare

**A Peer-to-Peer Hub for Syllabus Transparency and Academic Continuity.**

> *"Know your semester before it starts."*

NexusShare is a peer-to-peer academic transparency hub designed to eliminate the **Information Gap** during NYU's transition to new digital learning platforms. By centralizing student-contributed syllabi and lecture-capture policies, it allows students to make data-driven decisions about their course loads, financial commitments, and accessibility needs before the first day of class. It bridges the **Knowledge Pillar** of the NYU Nexus theme by turning individual student insights into a shared community resource.

---

## The Problem

The transition to Brightspace often leaves course dashboards empty until classes begin, creating three compounding problems:

- **Blind Registration** — Students cannot verify workloads, grading rubrics, or lecture recording policies during the critical Add/Drop window.
- **Financial Barriers** — Late syllabus access prevents students from sourcing affordable or used textbooks in time.
- **Accessibility Gaps** — Students with accommodations can't identify "recording-ready" courses early enough to plan accordingly.

---

## The Solution

NexusShare is a student-led **Knowledge Commons** for academic resources:

- **Transparency Layer** — A central repository where `@nyu.edu`-verified users share syllabi and policy metadata.
- **Community Driven** — Collective peer validation ensures only accurate, high-quality resources are surfaced.
- **Equity Focused** — A Textbook Transparency score and recording policy tracker help students plan financially and academically before the semester begins.

---

## Key Features

| Feature | Description |
|---|---|
| **Syllabus Repository** | Searchable database of current and historical course syllabi |
| **Recording Policy Tracker** | Community-verified lecture capture status ("Asynchronous Friendly" vs. "In-Person Only") |
| **Financial Readiness Widget** | Automatic textbook cost estimates based on syllabus data |
| **Resource Readiness Score** | Composite score showing how much information is available for a course |
| **Peer Verification** | Upvote system surfaces the most accurate, helpful resources |
| **Admin Takedown** | Faculty can request removal of any resource to protect intellectual property |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + TypeScript + Vite |
| **Styling** | Tailwind CSS (NYU Violet brand palette) |
| **Routing** | React Router v6 |
| **Backend** | FastAPI (async Python) |
| **Database** | SQLite via SQLModel ORM |
| **Auth** | JWT tokens (`python-jose`), `@nyu.edu` email enforcement |
| **File Serving** | FastAPI StaticFiles for uploaded PDFs |

---

## Architecture

```
NexusShare/
├── backend/
│   ├── app.py          # FastAPI application — all routes, models, auth
│   ├── seed.py         # Populates DB with 28 NYU courses & sample resources
│   ├── nexus.db        # SQLite database (auto-created on first run)
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── api.ts                    # Typed fetch client + backend→frontend adapter
    │   ├── pages/
    │   │   ├── Landing.tsx           # Search hero + course grid
    │   │   └── CourseDetail.tsx      # Split-pane course view
    │   ├── components/
    │   │   ├── Navbar.tsx
    │   │   ├── CourseCard.tsx
    │   │   ├── CourseGrid.tsx        # Skeleton loading states
    │   │   ├── UploadModal.tsx       # "Knowledge Drop" contribution form
    │   │   ├── StarRating.tsx
    │   │   ├── SkeletonCard.tsx
    │   │   └── Toast.tsx
    │   └── data/
    │       └── mockCourses.ts        # Shared Course/Resource TypeScript types
    └── vite.config.ts                # Proxies /api → http://localhost:8000
```

### Data Models

**Courses** — `id`, `code`, `name`, `professor_id`, `recording_status`, `avg_textbook_cost`

**Professors** — `id`, `name`

**Resources** — `id`, `course_id`, `type` (Syllabus / Lecture_Link / Study_Guide), `url`, `uploader_netid`, `votes`

### API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/courses` | List/search courses (`?query=`) with resource readiness scores |
| `GET` | `/courses/{id}` | Single course detail |
| `POST` | `/upload` | Upload a resource (PDF file or YouTube/Drive URL) |
| `POST` | `/resources/{id}/verify` | Upvote a resource (peer validation) |
| `DELETE` | `/resources/{id}` | Admin takedown (JWT protected) |
| `POST` | `/login` | Get admin JWT token |

Security: every upload requires an `uploader_netid` ending in `@nyu.edu`. Admin routes are protected by a short-lived JWT.

---

## Running the App

### Prerequisites

- Python 3.11+
- Node.js 18+

### 1. Backend

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Seed the database with 28 NYU courses
python seed.py

# Start the API server
uvicorn app:app --reload
```

The API will be available at `http://localhost:8000`.  
Interactive docs: `http://localhost:8000/docs`

### 2. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open `http://localhost:5173` in your browser. The Vite dev server proxies all `/api` requests to the FastAPI backend automatically — no CORS configuration needed.

### Admin Access

The demo admin account is pre-configured:

- **Username:** `admin`
- **Password:** `nexus2026`

Use `POST /login` to obtain a bearer token, then include it as `Authorization: Bearer <token>` on admin routes.

---

## UI Walkthrough

### Landing Page — The Nexus Search Hero

The first screen presents a large search bar ("Search by Course Code, Professor, or Major...") alongside a live stats card showing platform totals. Course cards render in a responsive 3-column grid with skeleton shimmer states while data loads.

Each **Course Card** shows:
- Course code and professor name
- Badges for syllabus availability, recording policy, and textbook cost
- A 1–5 star Clarity Score derived from the Resource Readiness Score

### Course Detail — The Resource Vault

Clicking a course opens a split-pane view:

- **Left pane** — Latest syllabus (PDF link) and grading breakdown (when available)
- **Right pane** — Community resources list with per-resource upvote buttons, an external link to each file or video, and a peer-support request button

### Knowledge Drop — Upload Modal

The upload form collects:
1. Course selection (dropdown from live API)
2. Resource type (Syllabus, Lecture Link, Study Guide)
3. NYU email (enforced `@nyu.edu`)
4. File upload (PDF drag-and-drop) or URL (YouTube/Google Drive)
5. Academic integrity acknowledgment checkbox

Submissions trigger a background task on the server to recalculate the course's Resource Readiness Score.

---

## Accessibility & Equity

- **OSD Support** — Recording policy badges help students with accommodations identify async-friendly courses before registration.
- **Financial Transparency** — Textbook cost data surfaces immediately on course cards, giving low-income students time to find affordable alternatives.
- **Academic Continuity** — Students who miss class can request peer-supported supplementary materials through the community resource system.

---

## Institutional Compliance

- **Self-Moderation** — Peer voting ensures high-quality resources rise to the top.
- **Professor Controls** — Admin takedown endpoint allows faculty to remove any resource that infringes on their intellectual property.
- **Integrity Guardrail** — Every uploader must agree to an Academic Integrity statement and provide a verified NYU email before contributing.
- **Future Integration** — Architecture is designed to overlay NexusShare data onto the NYU Albert registration portal via a browser extension.

---

## Hackathon Context

Built for the **NYU Nexus Hackathon** under the *Knowledge Pillar* theme. NexusShare turns individual student insights into a shared community resource — bridging the information gap that affects every NYU student at the start of every semester.
