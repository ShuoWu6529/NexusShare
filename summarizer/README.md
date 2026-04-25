# Syllabus Summarizer

AI-powered extraction of structured information from course syllabi.

## Quick Start

### 1. Set up API key (optional for testing)

```bash
export OPENAI_API_KEY=sk-...
```

### 2. Mount in your FastAPI app

```python
from fastapi import FastAPI
from summarizer.router import router

app = FastAPI()
app.include_router(router, prefix="/api")  # Routes: /api/summarize/text, /api/summarize/pdf
```

### 3. Start the server

```bash
uvicorn app:app --reload
```

## API Endpoints

### POST `/summarize/text`

Summarize a syllabus from plain text.

**Request:**

```bash
curl -X POST http://localhost:8000/summarize/text \
  -H "Content-Type: application/json" \
  -d '{
    "text": "COURSE SYLLABUS\n\nCS-UY 2124: Object Oriented Programming\nInstructor: Prof. Chen\nMWF 9:00-10:15 AM\n\nCourse Description:\nThis course covers object-oriented programming principles...\n\nGrading:\n- Exams: 40%\n- Projects: 35%\n- Participation: 25%\n"
  }'
```

**Response:**

```json
{
  "summary": "This course covers object-oriented programming principles including classes, inheritance, and design patterns through hands-on projects and exams.",
  "key_topics": [
    "Classes and Objects",
    "Inheritance",
    "Polymorphism",
    "Design Patterns",
    "Exception Handling"
  ],
  "grading_breakdown": { "Exams": 40, "Projects": 35, "Participation": 25 },
  "weekly_schedule": [
    { "week": 1, "topic": "Introduction to OOP" },
    { "week": 2, "topic": "Classes and Objects" }
  ],
  "study_tips": [
    "Start projects early",
    "Attend office hours",
    "Review design patterns"
  ]
}
```

### POST `/summarize/pdf`

Upload a PDF syllabus for extraction and summarization.

**Request:**

```bash
curl -X POST http://localhost:8000/summarize/pdf \
  -F "file=@path/to/syllabus.pdf"
```

**Response:** Same structure as `/text` endpoint.

## Features

- **Structured JSON output**: Uses OpenAI JSON mode for reliable parsing
- **Graceful fallback**: Returns mock response when `OPENAI_API_KEY` is not set (frontend dev unblocked)
- **PDF support**: Automatic text extraction via pypdf
- **Input validation**: Rejects empty/invalid inputs with meaningful errors
- **Low cost**: Uses `gpt-4o-mini` model for efficiency

## Without API Key

If `OPENAI_API_KEY` is not set, both endpoints return a plausible mock response:

```json
{
  "summary": "This course provides foundational knowledge...",
  "key_topics": ["Fundamentals", "Theory", "Practice", ...],
  "grading_breakdown": {"Exams": 35, "Projects": 40, ...},
  "weekly_schedule": [{"week": 1, "topic": "Introduction"}, ...],
  "study_tips": ["Attend lectures", "Start early", ...]
}
```

This allows frontend development to proceed without backend API access.

## Error Handling

- **400 Bad Request**: Missing `text` field or non-PDF file upload
- **422 Unprocessable Entity**: PDF cannot be read or contains no extractable text
- **5XX Server Error**: OpenAI API error (only if `OPENAI_API_KEY` is set)

## Implementation Details

- **Model**: `gpt-4o-mini` (cheaper, sufficient for summarization)
- **Response format**: `{"type": "json_object"}` for structured output
- **Temperature**: 0.3 (lower = more consistent, deterministic responses)
- **Max tokens**: 1500 (sufficient for structured data)
- **PDF extractor**: pypdf library for text extraction from all pages
