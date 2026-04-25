# NexusShare

Course resource sharing platform for NYU. This repo contains two self-contained modules:

1. **Seed data** — Populates database with realistic NYU courses and resources
2. **AI syllabus summarizer** — Extracts structured info from syllabi via OpenAI API

## Installation

```bash
pip install -r requirements.txt
```

## Module 1: Seed Data

Populate `nexus.db` with 28 real NYU courses across CS, Math, Econ, Psych, Writing, Business, and Engineering, plus 68 realistic resources (syllabi, lecture links, study guides).

**Usage:**

```bash
# Drop-and-recreate (default)
python seed.py

# Skip if data already exists
python seed.py --keep

# Use custom database path
python seed.py --db path/to/custom.db
```

**Outputs:**

- `nexus.db` — SQLite database with Course and Resource tables
- `seed_data/courses.json` — JSON export of seeded data

**Data models:**

- **Course**: id (UUID), code (e.g., "CS-UY 2124"), name, professor, recording_status, avg_textbook_cost
- **Resource**: id (UUID), course_id (FK), type (Syllabus|Lecture_Link|Study_Guide), url, uploader_netid, votes

See [`seed.py`](seed.py) for full data definition.

## Module 2: AI Syllabus Summarizer

Extract structured information from course syllabi using OpenAI's GPT-4o-mini with JSON mode.

**Installation:**

```bash
export OPENAI_API_KEY=sk-...
```

**Integration (FastAPI):**

```python
from fastapi import FastAPI
from summarizer.router import router

app = FastAPI()
app.include_router(router)
```

**API Endpoints:**

### POST `/summarize/text`

Summarize a syllabus from plain text.

```bash
curl -X POST http://localhost:8000/summarize/text \
  -H "Content-Type: application/json" \
  -d '{"text": "COURSE SYLLABUS\nCS-UY 2124: Object Oriented Programming\n..."}'
```

**Response:**

```json
{
  "summary": "This course covers OOP principles including classes, inheritance, and polymorphism...",
  "key_topics": [
    "Classes",
    "Inheritance",
    "Polymorphism",
    "Encapsulation",
    "Abstraction"
  ],
  "grading_breakdown": { "Exams": 40, "Projects": 35, "Participation": 25 },
  "weekly_schedule": [
    { "week": 1, "topic": "Introduction to Classes" },
    { "week": 2, "topic": "Inheritance and Polymorphism" }
  ],
  "study_tips": [
    "Review lecture notes before assignments",
    "Start projects early",
    "Attend office hours"
  ]
}
```

### POST `/summarize/pdf`

Upload a PDF syllabus for extraction and summarization.

```bash
curl -X POST http://localhost:8000/summarize/pdf \
  -F "file=@syllabus.pdf"
```

**Response:** Same JSON structure as above.

**Features:**

- Graceful fallback to mock response when `OPENAI_API_KEY` is not set (frontend dev unblocked)
- Structured JSON output via OpenAI JSON mode
- PDF text extraction via pypdf
- Input validation and error handling

See [`summarizer/README.md`](summarizer/README.md) for details.

## Project Structure

```
NexusShare/
├── seed.py                 # Seed data script
├── seed_data/
│   └── courses.json        # JSON export of seed data
├── summarizer/
│   ├── __init__.py
│   ├── summarize.py        # AI summarization function
│   ├── extract_pdf.py      # PDF text extraction
│   ├── router.py           # FastAPI router
│   └── README.md           # Integration docs
├── requirements.txt        # Dependencies
└── README.md               # This file
```

## Running Locally

**Seed the database:**

```bash
python seed.py
```

**Start API server:**

```bash
uvicorn app:app --reload
```

(Assuming your main app file imports the summarizer router.)

## Team Integration

- **Backend team**: Implement main FastAPI app, mount `summarizer.router:router` via `app.include_router(router, prefix="/api")`
- **Frontend team**: Call `/summarize/text` or `/summarize/pdf` endpoints; mock responses work without API key
- **Database team**: Replace `nexus.db` schema as needed; seed data provides realistic test data

## Notes

- All URLs in seed data are placeholders (Google Drive `FAKEID`, YouTube `FAKEID`) for demonstration
- Seed data includes realistic NYU course codes: CS-UY, CS-GY, MATH-UA, ECON-UA, PSYCH-UA, EXPOS-UA, MGMT-UB, MKTG-UB, FINC-UB, ECE-UY
- Summarizer uses `gpt-4o-mini` (cheaper than gpt-4) with structured JSON mode for reliability
- Python 3.10+ required
