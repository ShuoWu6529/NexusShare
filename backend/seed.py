#!/usr/bin/env python3
"""
seed.py — Populate nexus.db with demo courses for NexusShare.

Usage:
    python seed.py          # drop-and-recreate all data
    python seed.py --keep   # skip if data already exists
"""
import argparse
import uuid
from pathlib import Path

from sqlmodel import Field, Session, SQLModel, create_engine, select

DB_PATH = Path(__file__).parent / "nexus.db"

# ---------------------------------------------------------------------------
# Inline models — mirrors app.py so seed.py stays standalone
# ---------------------------------------------------------------------------


class Professor(SQLModel, table=True):
    __tablename__ = "professors"
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    name: str


class Course(SQLModel, table=True):
    __tablename__ = "courses"
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    code: str
    name: str
    professor_id: str = Field(foreign_key="professors.id")
    recording_status: str
    avg_textbook_cost: float = 0.0


class Resource(SQLModel, table=True):
    __tablename__ = "resources"
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    course_id: str = Field(foreign_key="courses.id")
    type: str
    url: str
    uploader_netid: str
    votes: int = 0


# ---------------------------------------------------------------------------
# Seed data
# ---------------------------------------------------------------------------

SEED = [
    {
        "professor": "Prof. Sandra Mills",
        "code": "PSYCH-UA 1",
        "name": "Intro to Psych",
        "recording_status": "Confirmed",
        "avg_textbook_cost": 59.99,
        "resources": [
            {
                "type": "Syllabus",
                "url": "https://drive.google.com/file/d/FAKE_psych_syl/view",
                "uploader_netid": "sm1234@nyu.edu",
                "votes": 12,
            },
            {
                "type": "Lecture_Link",
                "url": "https://youtu.be/FAKEpsychlec",
                "uploader_netid": "jd5678@nyu.edu",
                "votes": 8,
            },
        ],
    },
    {
        "professor": "Prof. Alan Torres",
        "code": "CS-UY 2134",
        "name": "Data Structures",
        "recording_status": "Peer-Only",
        "avg_textbook_cost": 89.99,
        "resources": [
            {
                "type": "Syllabus",
                "url": "https://drive.google.com/file/d/FAKE_ds_syl/view",
                "uploader_netid": "at9012@nyu.edu",
                "votes": 22,
            },
            {
                "type": "Study_Guide",
                "url": "https://drive.google.com/file/d/FAKE_ds_guide/view",
                "uploader_netid": "kl3456@nyu.edu",
                "votes": 17,
            },
        ],
    },
    {
        "professor": "Prof. Laura Chen",
        "code": "EXPOS-UA 4",
        "name": "Writing the Essay",
        "recording_status": "Not Recorded",
        "avg_textbook_cost": 0.0,
        "resources": [
            {
                "type": "Syllabus",
                "url": "https://drive.google.com/file/d/FAKE_wte_syl/view",
                "uploader_netid": "lc7890@nyu.edu",
                "votes": 5,
            },
        ],
    },
]


# ---------------------------------------------------------------------------
# Seeder
# ---------------------------------------------------------------------------


def seed(db_path: Path, keep: bool) -> None:
    engine = create_engine(
        f"sqlite:///{db_path}", connect_args={"check_same_thread": False}
    )
    if not keep:
        SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
        if keep and session.exec(select(Course)).first():
            print("Data already exists, skipping (--keep).")
            return

        for entry in SEED:
            prof = Professor(name=entry["professor"])
            session.add(prof)
            session.flush()

            course = Course(
                code=entry["code"],
                name=entry["name"],
                professor_id=prof.id,
                recording_status=entry["recording_status"],
                avg_textbook_cost=entry["avg_textbook_cost"],
            )
            session.add(course)
            session.flush()

            for r in entry["resources"]:
                session.add(Resource(course_id=course.id, **r))

        session.commit()

    print(f"Seeded {len(SEED)} courses into {db_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed nexus.db with demo data.")
    parser.add_argument(
        "--keep", action="store_true", help="Skip seeding if data already exists."
    )
    args = parser.parse_args()
    seed(DB_PATH, args.keep)
