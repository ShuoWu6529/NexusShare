#!/usr/bin/env python3
"""
generate_resources.py -- Generate lorem ipsum PDFs and seed real resources into nexus.db.

Run: python generate_resources.py
"""
import uuid
from pathlib import Path
from fpdf import FPDF
from fpdf.enums import XPos, YPos
from sqlmodel import Session, create_engine, select, SQLModel, Field
from sqlalchemy import text

DB_PATH = Path(__file__).parent / "nexus.db"
STATIC_DIR = Path(__file__).parent / "static"
STATIC_DIR.mkdir(exist_ok=True)

# ---------------------------------------------------------------------------
# Minimal models (mirrors app.py)
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
# Lorem ipsum content
# ---------------------------------------------------------------------------

LOREM = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor "
    "incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud "
    "exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",

    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu "
    "fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa "
    "qui officia deserunt mollit anim id est laborum.",

    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque "
    "laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi "
    "architecto beatae vitae dicta sunt explicabo.",

    "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia "
    "consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",

    "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci "
    "velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam "
    "aliquam quaerat voluptatem.",

    "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, "
    "nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in "
    "ea voluptate velit esse quam nihil molestiae consequatur.",

    "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium "
    "voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint "
    "occaecati cupiditate non provident.",

    "Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum "
    "fuga. Et harum quidem rerum facilis est et expedita distinctio.",
]

WEEKLY_TOPICS = [
    "Introduction & Course Overview",
    "Foundational Concepts",
    "Core Methodology",
    "Applied Frameworks",
    "Historical Context",
    "Theoretical Underpinnings",
    "Case Study Analysis",
    "Comparative Review",
    "Quantitative Methods",
    "Qualitative Approaches",
    "Mixed Methods",
    "Research Ethics",
    "Advanced Topics",
    "Emerging Trends",
    "Final Project Overview",
]

NOTES_CYCLE = [
    "Reading: Ch. 1-2", "Reading: Ch. 3-4", "Problem Set Due", "Quiz",
    "Reading: Ch. 5-6", "Group Discussion", "Midterm", "Reading: Ch. 7-9",
    "Paper Draft Due", "Peer Review", "Reading: Ch. 10-12", "Lab Session",
    "Project Presentations", "Final Exam Prep", "Finals Week",
]

NX = XPos.LMARGIN
NY = YPos.NEXT

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _section(pdf: FPDF, title: str) -> None:
    pdf.set_font("Helvetica", "B", 11)
    pdf.set_fill_color(240, 236, 255)
    pdf.cell(0, 8, f" {title}", new_x=NX, new_y=NY, fill=True)
    pdf.set_font("Helvetica", "", 10)
    pdf.ln(2)

# ---------------------------------------------------------------------------
# Syllabus PDF
# ---------------------------------------------------------------------------

def build_syllabus_pdf(course_code: str, course_name: str, professor: str,
                        semester: str, filepath: Path) -> None:
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_margins(20, 20, 20)

    # NYU violet header bar
    pdf.set_fill_color(87, 6, 140)
    pdf.rect(0, 0, 210, 28, style="F")
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("Helvetica", "B", 16)
    pdf.set_xy(20, 8)
    pdf.cell(0, 8, "NYU - Course Syllabus", new_x=NX, new_y=NY)
    pdf.set_font("Helvetica", "", 10)
    pdf.set_xy(20, 18)
    pdf.cell(0, 6, f"{course_code}  |  {course_name}  |  {semester}", new_x=NX, new_y=NY)

    pdf.set_text_color(30, 30, 30)
    pdf.set_y(36)

    # Course info block
    pdf.set_font("Helvetica", "B", 11)
    pdf.set_fill_color(240, 236, 255)
    pdf.cell(0, 8, " Course Information", new_x=NX, new_y=NY, fill=True)
    pdf.set_font("Helvetica", "", 10)
    pdf.ln(2)

    email = professor.lower().replace("prof. ", "").replace(" ", ".") + "@nyu.edu"
    for label, value in [
        ("Instructor",    professor),
        ("Credit Hours",  "4 units"),
        ("Meeting Times", "Mon / Wed  10:00 AM to 11:40 AM"),
        ("Location",      "Warren Weaver Hall, Room 109"),
        ("Office Hours",  "Tue / Thu  2:00 PM to 4:00 PM or by appointment"),
        ("Contact",       email),
    ]:
        pdf.set_font("Helvetica", "B", 10)
        pdf.cell(45, 6, f"  {label}:", border=0)
        pdf.set_font("Helvetica", "", 10)
        pdf.cell(0, 6, value, new_x=NX, new_y=NY)
    pdf.ln(4)

    # Course description
    _section(pdf, "Course Description")
    pdf.multi_cell(0, 6, LOREM[0] + " " + LOREM[1], new_x=NX, new_y=NY)
    pdf.ln(3)
    pdf.multi_cell(0, 6, LOREM[2], new_x=NX, new_y=NY)
    pdf.ln(4)

    # Learning objectives
    _section(pdf, "Learning Objectives")
    pdf.set_font("Helvetica", "", 10)
    for obj in [
        "Demonstrate a foundational understanding of core theoretical frameworks.",
        "Apply analytical methodologies to real-world scenarios and case studies.",
        "Critically evaluate primary and secondary academic literature.",
        "Collaborate effectively in peer-review and group-discussion formats.",
        "Produce original written and oral work that meets academic standards.",
    ]:
        pdf.multi_cell(0, 6, f"  * {obj}", new_x=NX, new_y=NY)
    pdf.ln(4)

    # Grading table
    _section(pdf, "Grading Breakdown")
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_fill_color(240, 236, 255)
    pdf.cell(130, 7, "  Component", border=1, fill=True)
    pdf.cell(0, 7,   "  Weight",    border=1, fill=True, new_x=NX, new_y=NY)
    pdf.set_font("Helvetica", "", 10)
    for component, weight in [
        ("Midterm Examination",       "25%"),
        ("Final Examination",         "30%"),
        ("Research Paper / Project",  "25%"),
        ("Weekly Response Papers",    "10%"),
        ("Participation & Attendance","10%"),
    ]:
        pdf.cell(130, 6, f"  {component}", border=1)
        pdf.cell(0,   6, f"  {weight}",    border=1, new_x=NX, new_y=NY)
    pdf.ln(4)

    # Required texts
    _section(pdf, "Required Texts & Materials")
    pdf.set_font("Helvetica", "", 10)
    pdf.multi_cell(0, 6,
        "Students are expected to obtain all assigned readings by the second week of class. "
        "Course materials will be posted on Brightspace. " + LOREM[3], new_x=NX, new_y=NY)
    pdf.ln(4)

    # Weekly schedule
    _section(pdf, "Weekly Schedule (Abridged)")
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_fill_color(240, 236, 255)
    pdf.cell(18, 7, "  Week",  border=1, fill=True)
    pdf.cell(92, 7, "  Topic", border=1, fill=True)
    pdf.cell(0,  7, "  Notes", border=1, fill=True, new_x=NX, new_y=NY)
    pdf.set_font("Helvetica", "", 9)
    for i, topic in enumerate(WEEKLY_TOPICS, start=1):
        pdf.cell(18, 6, f"  {i}",                          border=1)
        pdf.cell(92, 6, f"  {topic}",                      border=1)
        pdf.cell(0,  6, f"  {NOTES_CYCLE[i % len(NOTES_CYCLE)]}", border=1, new_x=NX, new_y=NY)
    pdf.ln(4)

    # Policies
    _section(pdf, "Course Policies")
    pdf.set_font("Helvetica", "", 10)
    pdf.multi_cell(0, 6,
        "Attendance: Regular attendance is expected. More than three unexcused absences may "
        "result in a grade reduction. " + LOREM[4], new_x=NX, new_y=NY)
    pdf.ln(2)
    pdf.multi_cell(0, 6,
        "Academic Integrity: All submitted work must adhere to the NYU Academic Integrity "
        "Policy. Plagiarism or unauthorized collaboration will result in a failing grade and "
        "referral to the Office of Student Conduct. " + LOREM[5], new_x=NX, new_y=NY)
    pdf.ln(2)
    pdf.multi_cell(0, 6,
        "Accessibility: Students with disabilities requiring accommodations should contact the "
        "Moses Center for Student Accessibility at 212-998-4980 and provide documentation "
        "to the instructor within the first two weeks. " + LOREM[6], new_x=NX, new_y=NY)
    pdf.ln(6)

    # Footer
    pdf.set_font("Helvetica", "I", 8)
    pdf.set_text_color(120, 120, 120)
    pdf.multi_cell(0, 5,
        f"This syllabus is subject to change. Modifications will be announced in class "
        f"and posted on Brightspace. (c) {semester} New York University.", new_x=NX, new_y=NY)

    pdf.output(str(filepath))


# ---------------------------------------------------------------------------
# Study guide PDF
# ---------------------------------------------------------------------------

def build_study_guide_pdf(course_code: str, course_name: str,
                           topic: str, filepath: Path) -> None:
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_margins(20, 20, 20)

    # NYU blue header bar
    pdf.set_fill_color(0, 86, 179)
    pdf.rect(0, 0, 210, 28, style="F")
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("Helvetica", "B", 15)
    pdf.set_xy(20, 7)
    pdf.cell(0, 8, f"Study Guide: {topic}", new_x=NX, new_y=NY)
    pdf.set_font("Helvetica", "", 10)
    pdf.set_xy(20, 17)
    pdf.cell(0, 6, f"{course_code}  |  {course_name}  |  Peer-Contributed Resource", new_x=NX, new_y=NY)

    pdf.set_text_color(30, 30, 30)
    pdf.set_y(36)

    _section(pdf, "Overview")
    pdf.set_font("Helvetica", "", 10)
    pdf.multi_cell(0, 6, LOREM[0] + " " + LOREM[2], new_x=NX, new_y=NY)
    pdf.ln(4)

    # Key concepts
    _section(pdf, "Key Concepts & Definitions")
    for term, definition in [
        ("Primary Framework",  LOREM[1]),
        ("Analytical Method",  LOREM[3]),
        ("Core Terminology",   LOREM[4]),
        ("Applied Principles", LOREM[5]),
    ]:
        pdf.set_font("Helvetica", "B", 10)
        pdf.cell(0, 6, term, new_x=NX, new_y=NY)
        pdf.set_font("Helvetica", "", 10)
        pdf.multi_cell(0, 6, definition, new_x=NX, new_y=NY)
        pdf.ln(2)
    pdf.ln(2)

    # Practice questions
    _section(pdf, "Practice Questions")
    for i, q in enumerate([
        "Define and differentiate the primary theoretical frameworks introduced in this unit.",
        "Describe the methodology used in the landmark case study discussed in Week 4.",
        "How do the quantitative findings from the primary text support or contradict the qualitative observations?",
        "Critically evaluate the ethical considerations raised in the supplementary readings.",
        "Apply the core model to a contemporary real-world scenario of your choice.",
        "Compare and contrast two competing schools of thought presented in the lectures.",
    ], 1):
        pdf.set_font("Helvetica", "", 10)
        pdf.multi_cell(0, 6, f"Q{i}. {q}", new_x=NX, new_y=NY)
        pdf.ln(1)
    pdf.ln(3)

    # Exam tips
    _section(pdf, "Summary & Exam Tips")
    pdf.set_font("Helvetica", "", 10)
    pdf.multi_cell(0, 6, LOREM[6] + " " + LOREM[7], new_x=NX, new_y=NY)
    pdf.ln(3)
    pdf.set_font("Helvetica", "", 10)
    for tip in [
        "Review lecture slides alongside readings for maximum retention.",
        "Form study groups and quiz each other on the practice questions above.",
        "Pay special attention to bolded terms in the required textbook.",
        "Attend office hours at least once before the midterm.",
    ]:
        pdf.multi_cell(0, 6, f"  * {tip}", new_x=NX, new_y=NY)

    pdf.set_font("Helvetica", "I", 8)
    pdf.set_text_color(120, 120, 120)
    pdf.ln(6)
    pdf.multi_cell(0, 5,
        "This study guide is a peer-contributed resource and is intended for supplementary "
        "use only. It does not replace assigned readings or lecture attendance.", new_x=NX, new_y=NY)

    pdf.output(str(filepath))


# ---------------------------------------------------------------------------
# Resource definitions per course
# YouTube links: well-known educational channels (CS50, CrashCourse, freeCodeCamp)
# ---------------------------------------------------------------------------

RESOURCES = {
    "PSYCH-UA 1": {
        "youtube": [
            ("Lecture 1 - Intro to Psychological Science",
             "https://www.youtube.com/watch?v=vo4pMVb0R6M"),
            ("Lecture 3 - Memory and Cognition",
             "https://www.youtube.com/watch?v=bSycdIx-C48"),
        ],
        "study_topic": "Research Methods and Cognitive Frameworks",
        "netids": ["sm1234@nyu.edu", "jd5678@nyu.edu", "ar2291@nyu.edu"],
    },
    "CS-UY 2134": {
        "youtube": [
            ("Lecture 2 - Arrays, Linked Lists and Complexity",
             "https://www.youtube.com/watch?v=RBSGKlAvoiM"),
            ("Lecture 5 - Trees, Heaps and Graphs",
             "https://www.youtube.com/watch?v=B31LgI4Y4DQ"),
        ],
        "study_topic": "Big-O Analysis and Core Data Structures",
        "netids": ["at9012@nyu.edu", "kl3456@nyu.edu", "mn7823@nyu.edu"],
    },
    "EXPOS-UA 4": {
        "youtube": [
            ("Lecture 1 - Argument and Thesis Construction",
             "https://www.youtube.com/watch?v=vtIzMaLkCaM"),
            ("Lecture 4 - Revision Strategies",
             "https://www.youtube.com/watch?v=THbgCIEEFGU"),
        ],
        "study_topic": "Essay Structure, Argumentation and Academic Voice",
        "netids": ["lc7890@nyu.edu", "pq4512@nyu.edu", "rw6634@nyu.edu"],
    },
}

SEMESTER = "Spring 2026"

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    engine = create_engine(
        f"sqlite:///{DB_PATH}", connect_args={"check_same_thread": False}
    )
    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
        courses = session.exec(select(Course)).all()
        if not courses:
            print("No courses found. Run seed.py first.")
            return

        prof_map: dict[str, str] = {}
        for course in courses:
            prof = session.get(Professor, course.professor_id)
            if prof:
                prof_map[course.code] = prof.name

        # Clear old resources to avoid duplicates
        session.exec(text("DELETE FROM resources"))  # type: ignore[call-overload]
        session.commit()

        total_pdfs = 0
        total_links = 0

        for course in courses:
            code = course.code
            slug = code.lower().replace("-", "_").replace(" ", "")
            professor = prof_map.get(code, "Prof. TBA")
            res_cfg = RESOURCES.get(code)

            if not res_cfg:
                print(f"  [skip] No resource config for {code}")
                continue

            # Syllabus PDF
            syl_path = STATIC_DIR / f"syllabus_{slug}.pdf"
            print(f"  Generating {syl_path.name} ...")
            build_syllabus_pdf(code, course.name, professor, SEMESTER, syl_path)
            session.add(Resource(
                course_id=course.id,
                type="Syllabus",
                url=f"/static/syllabus_{slug}.pdf",
                uploader_netid=res_cfg["netids"][0],
                votes=12 + len(code),
            ))
            total_pdfs += 1

            # Study guide PDF
            guide_path = STATIC_DIR / f"study_guide_{slug}.pdf"
            print(f"  Generating {guide_path.name} ...")
            build_study_guide_pdf(code, course.name, res_cfg["study_topic"], guide_path)
            session.add(Resource(
                course_id=course.id,
                type="Study_Guide",
                url=f"/static/study_guide_{slug}.pdf",
                uploader_netid=res_cfg["netids"][1],
                votes=7 + len(code),
            ))
            total_pdfs += 1

            # YouTube lecture links
            for i, (label, yt_url) in enumerate(res_cfg["youtube"]):
                session.add(Resource(
                    course_id=course.id,
                    type="Lecture_Link",
                    url=yt_url,
                    uploader_netid=res_cfg["netids"][i % len(res_cfg["netids"])],
                    votes=5 + i * 3,
                ))
                total_links += 1
                print(f"  Added lecture link: {label}")

        session.commit()
        print(f"\nDone -- {total_pdfs} PDFs generated, {total_links} YouTube links seeded.")
        print(f"PDFs served at http://localhost:8000/static/")


if __name__ == "__main__":
    main()
