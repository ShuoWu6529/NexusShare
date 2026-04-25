#!/usr/bin/env python3
"""
seed.py — Populate nexus.db with realistic NYU course and resource seed data.

Usage:
    python seed.py          # Drop-and-recreate tables, then insert (default)
    python seed.py --keep   # Skip insertion if data already exists
"""

import argparse
import json
import uuid
from pathlib import Path
from typing import Any

from sqlmodel import Field, Session, SQLModel, create_engine, select

DB_PATH = Path("nexus.db")
SEED_JSON_PATH = Path("seed_data/courses.json")


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------

class Course(SQLModel, table=True):
    """A course at NYU."""

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    code: str
    name: str
    professor: str
    recording_status: str  # Confirmed | Peer-Only | Not Recorded
    avg_textbook_cost: float


class Resource(SQLModel, table=True):
    """A resource (syllabus, lecture link, study guide) for a course."""

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    course_id: str = Field(foreign_key="course.id")
    type: str  # Syllabus | Lecture_Link | Study_Guide
    url: str
    uploader_netid: str
    votes: int


# ---------------------------------------------------------------------------
# Seed data
# ---------------------------------------------------------------------------

COURSES_RAW = [
    # CS-UY (Brooklyn Undergrad)
    {
        "code": "CS-UY 1114",
        "name": "Introduction to Programming and Problem Solving",
        "professor": "Prof. Alice Smith",
        "recording_status": "Confirmed",
        "avg_textbook_cost": 0.0,
        "resources": [
            {
                "type": "Syllabus",
                "url": "https://drive.google.com/file/d/1FAKEcsuy1114SYLv1zK3mN/view",
                "uploader_netid": "as1234@nyu.edu",
                "votes": 34,
            },
            {
                "type": "Lecture_Link",
                "url": "https://youtu.be/FAKEcsuy1114LECv1z",
                "uploader_netid": "bk5678@nyu.edu",
                "votes": 19,
            },
        ],
    },
    {
        "code": "CS-UY 2124",
        "name": "Object Oriented Programming",
        "professor": "Prof. Wei Chen",
        "recording_status": "Confirmed",
        "avg_textbook_cost": 89.99,
        "resources": [
            {
                "type": "Syllabus",
                "url": "https://drive.google.com/file/d/1FAKEcsuy2124SYL/view",
                "uploader_netid": "wc9876@nyu.edu",
                "votes": 45,
            },
            {
                "type": "Lecture_Link",
                "url": "https://youtu.be/FAKEcsuy2124LEC",
                "uploader_netid": "jd1111@nyu.edu",
                "votes": 28,
            },
            {
                "type": "Study_Guide",
                "url": "https://drive.google.com/file/d/1FAKEcsuy2124GUIDE/view",
                "uploader_netid": "mh2222@nyu.edu",
                "votes": 31,
            },
        ],
    },
    {
        "code": "CS-UY 2214",
        "name": "Computer Architecture and Organization",
        "professor": "Prof. Rajesh Patel",
        "recording_status": "Peer-Only",
        "avg_textbook_cost": 74.99,
        "resources": [
            {
                "type": "Syllabus",
                "url": "https://drive.google.com/file/d/1FAKEcsuy2214SYL/view",
                "uploader_netid": "rp3333@nyu.edu",
                "votes": 12,
            },
            {
                "type": "Study_Guide",
                "url": "https://drive.google.com/file/d/1FAKEcsuy2214GUIDE/view",
                "uploader_netid": "ks4444@nyu.edu",
                "votes": 8,
            },
        ],
    },
    {
        "code": "CS-UY 3224",
        "name": "Operating Systems",
        "professor": "Prof. Carlos Rodriguez",
        "recording_status": "Not Recorded",
        "avg_textbook_cost": 129.99,
        "resources": [
            {
                "type": "Syllabus",
                "url": "https://drive.google.com/file/d/1FAKEcsuy3224SYL/view",
                "uploader_netid": "cr5555@nyu.edu",
                "votes": 22,
            },
            {
                "type": "Lecture_Link",
                "url": "https://youtu.be/FAKEcsuy3224LEC",
                "uploader_netid": "am6666@nyu.edu",
                "votes": 15,
            },
            {
                "type": "Study_Guide",
                "url": "https://drive.google.com/file/d/1FAKEcsuy3224GUIDE/view",
                "uploader_netid": "lw7777@nyu.edu",
                "votes": 18,
            },
        ],
    },
    {
        "code": "CS-UY 3943",
        "name": "Algorithms",
        "professor": "Prof. Jennifer Kim",
        "recording_status": "Confirmed",
        "avg_textbook_cost": 159.99,
        "resources": [
            {
                "type": "Syllabus",
                "url": "https://drive.google.com/file/d/1FAKEcsuy3943SYL/view",
                "uploader_netid": "jk8888@nyu.edu",
                "votes": 38,
            },
            {
                "type": "Lecture_Link",
                "url": "https://youtu.be/FAKEcsuy3943LEC",
                "uploader_netid": "sb9999@nyu.edu",
                "votes": 25,
            },
        ],
    },
    {
        "code": "CS-UY 4513",
        "name": "Database Systems",
        "professor": "Prof. David Goldberg",
        "recording_status": "Confirmed",
        "avg_textbook_cost": 49.99,
        "resources": [
            {
                "type": "Syllabus",
                "url": "https://drive.google.com/file/d/1FAKEcsuy4513SYL/view",
                "uploader_netid": "dg0001@nyu.edu",
                "votes": 41,
            },
            {
                "type": "Study_Guide",
                "url": "https://drive.google.com/file/d/1FAKEcsuy4513GUIDE/view",
                "uploader_netid": "tp0002@nyu.edu",
                "votes": 27,
            },
            {
                "type": "Lecture_Link",
                "url": "https://youtu.be/FAKEcsuy4513LEC",
                "uploader_netid": "rs0003@nyu.edu",
                "votes": 20,
            },
        ],
    },
    # CS-GY (Brooklyn Grad)
    {
        "code": "CS-GY 6003",
        "name": "Introduction to Computer Science",
        "professor": "Prof. Mark Johnson",
        "recording_status": "Confirmed",
        "avg_textbook_cost": 0.0,
        "resources": [
            {
                "type": "Syllabus",
                "url": "https://drive.google.com/file/d/1FAKEcsgy6003SYL/view",
                "uploader_netid": "mj0004@nyu.edu",
                "votes": 29,
            },
        ],
    },
    {
        "code": "CS-GY 6063",
        "name": "Software Engineering",
        "professor": "Prof. Sarah Williams",
        "recording_status": "Peer-Only",
        "avg_textbook_cost": 0.0,
        "resources": [
            {
                "type": "Syllabus",
                "url": "https://drive.google.com/file/d/1FAKEcsgy6063SYL/view",
                "uploader_netid": "sw0005@nyu.edu",
                "votes": 33,
            },
            {
                "type": "Study_Guide",
                "url": "https://drive.google.com/file/d/1FAKEcsgy6063GUIDE/view",
                "uploader_netid": "nc0006@nyu.edu",
                "votes": 21,
            },
        ],
    },
    {
        "code": "CS-GY 9223",
        "name": "Machine Learning",
        "professor": "Prof. Robert Martinez",
        "recording_status": "Confirmed",
        "avg_textbook_cost": 0.0,
        "resources": [
            {
                "type": "Syllabus",
                "url": "https://drive.google.com/file/d/1FAKEcsgy9223SYL/view",
                "uploader_netid": "rm0007@nyu.edu",
                "votes": 50,
            },
            {
                "type": "Lecture_Link",
                "url": "https://youtu.be/FAKEcsgy9223LEC",
                "uploader_netid": "aj0008@nyu.edu",
                "votes": 42,
            },
            {
                "type": "Study_Guide",
                "url": "https://drive.google.com/file/d/1FAKEcsgy9223GUIDE/view",
                "uploader_netid": "kt0009@nyu.edu",
                "votes": 36,
            },
        ],
    },
    # Math
    {
        "code": "MATH-UA 121",
        "name": "Calculus I",
        "professor": "Prof. Michael Thompson",
        "recording_status": "Confirmed",
        "avg_textbook_cost": 199.99,
        "resources": [
            {
                "type": "Syllabus",
                "url": "https://drive.google.com/file/d/1FAKEmathua121SYL/view",
                "uploader_netid": "mt0010@nyu.edu",
                "votes": 44,
            },
            {
                "type": "Lecture_Link",
                "url": "https://youtu.be/FAKEmathua121LEC",
                "uploader_netid": "pe0011@nyu.edu",
                "votes": 26,
            },
            {
                "type": "Study_Guide",
                "url": "https://drive.google.com/file/d/1FAKEmathua121GUIDE/view",
                "uploader_netid": "cv0012@nyu.edu",
                "votes": 39,
            },
            {
                "type": "Lecture_Link",
                "url": "https://youtu.be/FAKEmathua121LEC2",
                "uploader_netid": "dx0013@nyu.edu",
                "votes": 17,
            },
        ],
    },
    {
        "code": "MATH-UA 122",
        "name": "Calculus II",
        "professor": "Prof. Anh Nguyen",
        "recording_status": "Confirmed",
        "avg_textbook_cost": 199.99,
        "resources": [
            {
                "type": "Syllabus",
                "url": "https://drive.google.com/file/d/1FAKEmathua122SYL/view",
                "uploader_netid": "an0014@nyu.edu",
                "votes": 32,
            },
            {
                "type": "Lecture_Link",
                "url": "https://youtu.be/FAKEmathua122LEC",
                "uploader_netid": "ey0015@nyu.edu",
                "votes": 24,
            },
            {
                "type": "Study_Guide",
                "url": "https://drive.google.com/file/d/1FAKEmathua122GUIDE/view",
                "uploader_netid": "fz0016@nyu.edu",
                "votes": 28,
            },
        ],
    },
    {
        "code": "MATH-UA 123",
        "name": "Calculus III",
        "professor": "Prof. Thomas Davis",
        "recording_status": "Peer-Only",
        "avg_textbook_cost": 199.99,
        "resources": [
            {
                "type": "Syllabus",
                "url": "https://drive.google.com/file/d/1FAKEmathua123SYL/view",
                "uploader_netid": "td0017@nyu.edu",
                "votes": 14,
            },
            {
                "type": "Study_Guide",
                "url": "https://drive.google.com/file/d/1FAKEmathua123GUIDE/view",
                "uploader_netid": "gm0018@nyu.edu",
                "votes": 11,
            },
        ],
    },
    {
        "code": "MATH-UA 140",
        "name": "Linear Algebra",
        "professor": "Prof. James Wilson",
        "recording_status": "Confirmed",
        "avg_textbook_cost": 179.99,
        "resources": [
            {
                "type": "Syllabus",
                "url": "https://drive.google.com/file/d/1FAKEmathua140SYL/view",
                "uploader_netid": "jw0019@nyu.edu",
                "votes": 46,
            },
            {
                "type": "Lecture_Link",
                "url": "https://youtu.be/FAKEmathua140LEC",
                "uploader_netid": "hi0020@nyu.edu",
                "votes": 23,
            },
            {
                "type": "Study_Guide",
                "url": "https://drive.google.com/file/d/1FAKEmathua140GUIDE/view",
                "uploader_netid": "ij0021@nyu.edu",
                "votes": 30,
            },
        ],
    },
    {
        "code": "MATH-UA 233",
        "name": "Theory of Probability",
        "professor": "Prof. Patricia Anderson",
        "recording_status": "Not Recorded",
        "avg_textbook_cost": 149.99,
        "resources": [
            {
                "type": "Syllabus",
                "url": "https://drive.google.com/file/d/1FAKEmathua233SYL/view",
                "uploader_netid": "pa0022@nyu.edu",
                "votes": 16,
            },
            {
                "type": "Study_Guide",
                "url": "https://drive.google.com/file/d/1FAKEmathua233GUIDE/view",
                "uploader_netid": "kl0023@nyu.edu",
                "votes": 13,
            },
        ],
    },
    {
        "code": "MATH-UA 325",
        "name": "Analysis",
        "professor": "Prof. George Brown",
        "recording_status": "Not Recorded",
        "avg_textbook_cost": 89.99,
        "resources": [
            {
                "type": "Syllabus",
                "url": "https://drive.google.com/file/d/1FAKEmathua325SYL/view",
                "uploader_netid": "gb0024@nyu.edu",
                "votes": 9,
            },
        ],
    },
    # Econ
    {
        "code": "ECON-UA 1",
        "name": "Introduction to Microeconomics",
        "professor": "Prof. Lisa Taylor",
        "recording_status": "Confirmed",
        "avg_textbook_cost": 249.99,
        "resources": [
            {
                "type": "Syllabus",
                "url": "https://drive.google.com/file/d/1FAKEeconoma1SYL/view",
                "uploader_netid": "lt0025@nyu.edu",
                "votes": 48,
            },
            {
                "type": "Lecture_Link",
                "url": "https://youtu.be/FAKEeconoma1LEC",
                "uploader_netid": "mn0026@nyu.edu",
                "votes": 35,
            },
            {
                "type": "Study_Guide",
                "url": "https://drive.google.com/file/d/1FAKEeconoma1GUIDE/view",
                "uploader_netid": "op0027@nyu.edu",
                "votes": 40,
            },
            {
                "type": "Lecture_Link",
                "url": "https://youtu.be/FAKEeconoma1LEC2",
                "uploader_netid": "qr0028@nyu.edu",
                "votes": 22,
            },
        ],
    },
    {
        "code": "ECON-UA 2",
        "name": "Introduction to Macroeconomics",
        "professor": "Prof. Stephen Jackson",
        "recording_status": "Peer-Only",
        "avg_textbook_cost": 249.99,
        "resources": [
            {
                "type": "Syllabus",
                "url": "https://drive.google.com/file/d/1FAKEeconoma2SYL/view",
                "uploader_netid": "sj0029@nyu.edu",
                "votes": 37,
            },
            {
                "type": "Lecture_Link",
                "url": "https://youtu.be/FAKEeconoma2LEC",
                "uploader_netid": "tu0030@nyu.edu",
                "votes": 19,
            },
            {
                "type": "Study_Guide",
                "url": "https://drive.google.com/file/d/1FAKEeconoma2GUIDE/view",
                "uploader_netid": "vw0031@nyu.edu",
                "votes": 26,
            },
        ],
    },
    {
        "code": "ECON-UA 10",
        "name": "Statistics for Economists",
        "professor": "Prof. Karen White",
        "recording_status": "Confirmed",
        "avg_textbook_cost": 109.99,
        "resources": [
            {
                "type": "Syllabus",
                "url": "https://drive.google.com/file/d/1FAKEeconoma10SYL/view",
                "uploader_netid": "kw0032@nyu.edu",
                "votes": 20,
            },
            {
                "type": "Study_Guide",
                "url": "https://drive.google.com/file/d/1FAKEeconoma10GUIDE/view",
                "uploader_netid": "xy0033@nyu.edu",
                "votes": 15,
            },
        ],
    },
    {
        "code": "ECON-UA 20",
        "name": "Econometrics",
        "professor": "Prof. Richard Harris",
        "recording_status": "Not Recorded",
        "avg_textbook_cost": 159.99,
        "resources": [
            {
                "type": "Syllabus",
                "url": "https://drive.google.com/file/d/1FAKEeconoma20SYL/view",
                "uploader_netid": "rh0034@nyu.edu",
                "votes": 10,
            },
            {
                "type": "Study_Guide",
                "url": "https://drive.google.com/file/d/1FAKEeconoma20GUIDE/view",
                "uploader_netid": "ab0035@nyu.edu",
                "votes": 7,
            },
        ],
    },
    # Psych
    {
        "code": "PSYCH-UA 1",
        "name": "Introduction to Psychology",
        "professor": "Prof. Victoria Clark",
        "recording_status": "Confirmed",
        "avg_textbook_cost": 219.99,
        "resources": [
            {
                "type": "Syllabus",
                "url": "https://drive.google.com/file/d/1FAKEpsychta1SYL/view",
                "uploader_netid": "vc0036@nyu.edu",
                "votes": 49,
            },
            {
                "type": "Lecture_Link",
                "url": "https://youtu.be/FAKEpsychta1LEC",
                "uploader_netid": "cd0037@nyu.edu",
                "votes": 34,
            },
            {
                "type": "Study_Guide",
                "url": "https://drive.google.com/file/d/1FAKEpsychta1GUIDE/view",
                "uploader_netid": "ef0038@nyu.edu",
                "votes": 38,
            },
            {
                "type": "Lecture_Link",
                "url": "https://youtu.be/FAKEpsychta1LEC2",
                "uploader_netid": "gh0039@nyu.edu",
                "votes": 29,
            },
        ],
    },
    {
        "code": "PSYCH-UA 30",
        "name": "Social Psychology",
        "professor": "Prof. Edward Lewis",
        "recording_status": "Peer-Only",
        "avg_textbook_cost": 149.99,
        "resources": [
            {
                "type": "Syllabus",
                "url": "https://drive.google.com/file/d/1FAKEpsychta30SYL/view",
                "uploader_netid": "el0040@nyu.edu",
                "votes": 18,
            },
            {
                "type": "Study_Guide",
                "url": "https://drive.google.com/file/d/1FAKEpsychta30GUIDE/view",
                "uploader_netid": "ij0041@nyu.edu",
                "votes": 12,
            },
        ],
    },
    {
        "code": "PSYCH-UA 74",
        "name": "Abnormal Psychology",
        "professor": "Prof. Nancy Robinson",
        "recording_status": "Not Recorded",
        "avg_textbook_cost": 129.99,
        "resources": [
            {
                "type": "Syllabus",
                "url": "https://drive.google.com/file/d/1FAKEpsychta74SYL/view",
                "uploader_netid": "nr0042@nyu.edu",
                "votes": 21,
            },
            {
                "type": "Lecture_Link",
                "url": "https://youtu.be/FAKEpsychta74LEC",
                "uploader_netid": "kl0043@nyu.edu",
                "votes": 14,
            },
            {
                "type": "Study_Guide",
                "url": "https://drive.google.com/file/d/1FAKEpsychta74GUIDE/view",
                "uploader_netid": "mn0044@nyu.edu",
                "votes": 16,
            },
        ],
    },
    # Writing/Expository
    {
        "code": "EXPOS-UA 1",
        "name": "Writing the Essay",
        "professor": "Prof. Jonathan Walker",
        "recording_status": "Not Recorded",
        "avg_textbook_cost": 0.0,
        "resources": [
            {
                "type": "Syllabus",
                "url": "https://drive.google.com/file/d/1FAKEexposua1SYL/view",
                "uploader_netid": "jw0045@nyu.edu",
                "votes": 11,
            },
        ],
    },
    {
        "code": "EXPOS-UA 9",
        "name": "First Year Writing Seminar",
        "professor": "Prof. Michelle Hall",
        "recording_status": "Not Recorded",
        "avg_textbook_cost": 0.0,
        "resources": [
            {
                "type": "Syllabus",
                "url": "https://drive.google.com/file/d/1FAKEexposua9SYL/view",
                "uploader_netid": "mh0046@nyu.edu",
                "votes": 8,
            },
        ],
    },
    # Business (Stern)
    {
        "code": "MGMT-UB 1",
        "name": "Foundations of Management",
        "professor": "Prof. Benjamin Young",
        "recording_status": "Confirmed",
        "avg_textbook_cost": 199.99,
        "resources": [
            {
                "type": "Syllabus",
                "url": "https://drive.google.com/file/d/1FAKEmgmtub1SYL/view",
                "uploader_netid": "by0047@nyu.edu",
                "votes": 43,
            },
            {
                "type": "Lecture_Link",
                "url": "https://youtu.be/FAKEmgmtub1LEC",
                "uploader_netid": "rs0048@nyu.edu",
                "votes": 27,
            },
            {
                "type": "Study_Guide",
                "url": "https://drive.google.com/file/d/1FAKEmgmtub1GUIDE/view",
                "uploader_netid": "tu0049@nyu.edu",
                "votes": 32,
            },
        ],
    },
    {
        "code": "MKTG-UB 1",
        "name": "Introduction to Marketing",
        "professor": "Prof. Patricia Allen",
        "recording_status": "Peer-Only",
        "avg_textbook_cost": 189.99,
        "resources": [
            {
                "type": "Syllabus",
                "url": "https://drive.google.com/file/d/1FAKEmktgub1SYL/view",
                "uploader_netid": "pa0050@nyu.edu",
                "votes": 25,
            },
            {
                "type": "Study_Guide",
                "url": "https://drive.google.com/file/d/1FAKEmktgub1GUIDE/view",
                "uploader_netid": "vw0051@nyu.edu",
                "votes": 17,
            },
        ],
    },
    {
        "code": "FINC-UB 2",
        "name": "Corporate Finance",
        "professor": "Prof. William Sanchez",
        "recording_status": "Confirmed",
        "avg_textbook_cost": 229.99,
        "resources": [
            {
                "type": "Syllabus",
                "url": "https://drive.google.com/file/d/1FAKEfincub2SYL/view",
                "uploader_netid": "ws0052@nyu.edu",
                "votes": 47,
            },
            {
                "type": "Lecture_Link",
                "url": "https://youtu.be/FAKEfincub2LEC",
                "uploader_netid": "xy0053@nyu.edu",
                "votes": 31,
            },
            {
                "type": "Study_Guide",
                "url": "https://drive.google.com/file/d/1FAKEfincub2GUIDE/view",
                "uploader_netid": "ab0054@nyu.edu",
                "votes": 37,
            },
        ],
    },
    # Engineering
    {
        "code": "ECE-UY 1002",
        "name": "Intro to Electrical and Computer Engineering",
        "professor": "Prof. Daniel Mitchell",
        "recording_status": "Confirmed",
        "avg_textbook_cost": 159.99,
        "resources": [
            {
                "type": "Syllabus",
                "url": "https://drive.google.com/file/d/1FAKEeceuy1002SYL/view",
                "uploader_netid": "dm0055@nyu.edu",
                "votes": 39,
            },
            {
                "type": "Lecture_Link",
                "url": "https://youtu.be/FAKEeceuy1002LEC",
                "uploader_netid": "gh0056@nyu.edu",
                "votes": 24,
            },
        ],
    },
]


# ---------------------------------------------------------------------------
# Seed functions
# ---------------------------------------------------------------------------


def build_seed_records() -> tuple[list[Course], list[Resource]]:
    """Generate Course and Resource objects from COURSES_RAW with fresh UUIDs."""
    courses = []
    resources = []
    for raw in COURSES_RAW:
        course_id = str(uuid.uuid4())
        course = Course(
            id=course_id,
            code=raw["code"],
            name=raw["name"],
            professor=raw["professor"],
            recording_status=raw["recording_status"],
            avg_textbook_cost=raw["avg_textbook_cost"],
        )
        courses.append(course)
        for r in raw.get("resources", []):
            resource = Resource(
                id=str(uuid.uuid4()),
                course_id=course_id,
                type=r["type"],
                url=r["url"],
                uploader_netid=r["uploader_netid"],
                votes=r["votes"],
            )
            resources.append(resource)
    return courses, resources


def export_json(
    engine,
) -> None:
    """Write seeded data to seed_data/courses.json by reading from database."""
    SEED_JSON_PATH.parent.mkdir(exist_ok=True)

    with Session(engine) as session:
        courses = session.exec(select(Course)).all()
        resources = session.exec(select(Resource)).all()

        resource_by_course: dict[str, list[dict[str, Any]]] = {}
        for r in resources:
            # Access attributes within session context
            resource_by_course.setdefault(r.course_id, []).append(
                {
                    "id": r.id,
                    "course_id": r.course_id,
                    "type": r.type,
                    "url": r.url,
                    "uploader_netid": r.uploader_netid,
                    "votes": r.votes,
                }
            )

        data = {
            "courses": [
                {
                    "id": c.id,
                    "code": c.code,
                    "name": c.name,
                    "professor": c.professor,
                    "recording_status": c.recording_status,
                    "avg_textbook_cost": c.avg_textbook_cost,
                    "resources": resource_by_course.get(c.id, []),
                }
                for c in courses
            ]
        }

    SEED_JSON_PATH.write_text(json.dumps(data, indent=2))
    print(f"  Exported {len(courses)} courses to {SEED_JSON_PATH}")


def seed(db_path: Path, keep: bool) -> None:
    """Seed the database with NYU course data."""
    engine = create_engine(f"sqlite:///{db_path}")

    if not keep:
        SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
        if keep:
            existing = session.exec(select(Course)).first()
            if existing:
                print("  Data already exists, skipping (--keep)")
                return

        courses, resources = build_seed_records()
        for c in courses:
            session.add(c)
        for r in resources:
            session.add(r)
        session.commit()
        print(
            f"  Inserted {len(courses)} courses and {len(resources)} resources into {db_path}"
        )

    export_json(engine)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed nexus.db with NYU course data")
    parser.add_argument(
        "--keep", action="store_true", help="Skip if data already exists"
    )
    parser.add_argument("--db", default=str(DB_PATH), help="Database file path")
    args = parser.parse_args()

    print(
        f"Seeding {'(keep mode)' if args.keep else '(drop-and-recreate mode)'} ..."
    )
    seed(Path(args.db), keep=args.keep)
    print("Done.")
