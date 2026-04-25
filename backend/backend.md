
create a simple fastapi api with login/logout system, ability to upload static files, and database connection code.


# database

the api should create one at the root of the backend directory if it's not created already.


create a corresponding table for professors

```
Table: Professors

id: UUID

name: String

```

```
Table: Courses

id: UUID

code: String (e.g., "CS-GY 6063")

name: String (e.g "Software Engineering")

professor: Foreign Key

recording_status: Enum ("Confirmed," "Peer-Only," "Not Recorded")

avg_textbook_cost: Float
```

```
Table: Resources

id: UUID

course_id: Foreign Key

type: Enum ("Syllabus," "Lecture_Link," "Study_Guide")

url: String (The link to the unlisted YouTube/Drive or Local File path)

uploader_netid: String (For "Verification" purposes)

votes: Integer (Peer-validation count)
```

A. Discovery & Search
GET /courses?query=...

Returns a list of courses matching the code or professor.

University Feature: Includes the "Resource Readiness Score" (how much info is available).

B. The Contribution
POST /upload

Accepts multipart/form-data.

Logic: Saves the file to a static/ directory or uploads a URL to the DB.

Safety Check: A middleware that ensures the uploader_netid ends in @nyu.edu.

C. The Peer Validation (The "Trust" Layer)
POST /resources/{id}/verify

Increments the "vote" count.

Impact: In the UI, highly voted resources get a "University Verified" badge.

Hour 1: Boilerplate & Models
Initialize FastAPI and set up the SQLite engine.

Define your Pydantic schemas for the Request/Response bodies.

Pro-Tip: Use FastAPI.staticfiles to serve your uploaded PDFs instantly without a complex storage server.

Write the GET routes.

Hack: Use a simple .contains() query for searching. Don't worry about ElasticSearch; SQLite is fast enough for 1,000 course rows.

The File/Link Manager
Create the POST route for uploads.

The "Lecture Sharing" Trick: Instead of hosting massive .mp4 files (which will kill your server in a hackathon), allow students to post links. The backend validates the URL format (e.g., must be a Drive or YouTube link).

Hour 4: The "Admin-Safe" Features
Implement a DELETE or HIDE route labeled admin_takedown.

The Pitch: "We built a backend that allows the university to moderate content, ensuring IP rights are respected."

💡 The "Secret Sauce" Logic (FastAPI Special)
To make it feel like a real "Nexus" of information, add a Background Task to your POST /upload route:

Python
from fastapi import BackgroundTasks

@app.post("/upload")
async def upload_resource(file: UploadFile, background_tasks: BackgroundTasks):
    # 1. Save file metadata to DB
    # 2. Trigger background task to "Scan for Textbook Costs" (Simulated)
    background_tasks.add_task(calculate_transparency_score, course_id)
    return {"status": "Processing - Peer Reviewing in Progress"}
📋 Compliance Checklist for the Demo
No Hardcoding: Ensure your API returns JSON.

Error Handling: If someone tries to upload a non-PDF syllabus, return a 415 Unsupported Media Type. This makes your backend look robust to judges.

Seeded Data: Create a seed.py script that populates the DB with "Intro to Psych," "Data Structures," and "Writing the Essay." This ensures your frontend isn't blank during the presentation.

