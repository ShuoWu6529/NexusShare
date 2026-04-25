import enum
import uuid
from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional

import aiofiles
from fastapi import (
    BackgroundTasks,
    Depends,
    FastAPI,
    File,
    Form,
    HTTPException,
    UploadFile,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from fastapi.staticfiles import StaticFiles
from jose import JWTError, jwt
from pydantic import BaseModel
from sqlalchemy import Column
from sqlalchemy import Enum as SAEnum
from sqlmodel import Field, Session, SQLModel, create_engine, or_, select

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

SECRET_KEY = "nexus-hackathon-secret"
ALGORITHM = "HS256"
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "nexus2026"

DB_PATH = Path(__file__).parent / "nexus.db"
STATIC_DIR = Path(__file__).parent / "static"
STATIC_DIR.mkdir(exist_ok=True)

ALLOWED_URL_PREFIXES = (
    "https://youtu.be",
    "https://youtube.com",
    "https://www.youtube.com",
    "https://drive.google.com",
)

# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------


class RecordingStatus(str, enum.Enum):
    confirmed = "Confirmed"
    peer_only = "Peer-Only"
    not_recorded = "Not Recorded"


class ResourceType(str, enum.Enum):
    syllabus = "Syllabus"
    lecture_link = "Lecture_Link"
    study_guide = "Study_Guide"


# ---------------------------------------------------------------------------
# SQLModel tables
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
    recording_status: RecordingStatus = Field(
        sa_column=Column(
            SAEnum(RecordingStatus, values_callable=lambda x: [e.value for e in x])
        )
    )
    avg_textbook_cost: float = Field(default=0.0)


class Resource(SQLModel, table=True):
    __tablename__ = "resources"
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    course_id: str = Field(foreign_key="courses.id")
    type: ResourceType = Field(
        sa_column=Column(
            SAEnum(ResourceType, values_callable=lambda x: [e.value for e in x])
        )
    )
    url: str
    uploader_netid: str
    votes: int = Field(default=0)


# ---------------------------------------------------------------------------
# Database engine
# ---------------------------------------------------------------------------

engine = create_engine(
    f"sqlite:///{DB_PATH}", connect_args={"check_same_thread": False}
)


def get_session():
    with Session(engine) as session:
        yield session


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------


class ResourceOut(BaseModel):
    id: str
    course_id: str
    type: ResourceType
    url: str
    uploader_netid: str
    votes: int

    model_config = {"from_attributes": True}


class CourseOut(BaseModel):
    id: str
    code: str
    name: str
    professor_name: str
    recording_status: RecordingStatus
    avg_textbook_cost: float
    resource_readiness_score: float
    resources: list[ResourceOut]


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


def get_current_admin(token: str = Depends(oauth2_scheme)) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload["sub"]
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


# ---------------------------------------------------------------------------
# NYU email dependency
# ---------------------------------------------------------------------------


def require_nyu_email(uploader_netid: str = Form(...)) -> str:
    if not uploader_netid.endswith("@nyu.edu"):
        raise HTTPException(
            status_code=403, detail="uploader_netid must end in @nyu.edu"
        )
    return uploader_netid


# ---------------------------------------------------------------------------
# Resource Readiness Score
# ---------------------------------------------------------------------------


def compute_resource_readiness(resources: list[Resource]) -> float:
    types_present = {r.type for r in resources}
    base = sum([
        0.33 if ResourceType.syllabus in types_present else 0,
        0.33 if ResourceType.lecture_link in types_present else 0,
        0.33 if ResourceType.study_guide in types_present else 0,
    ])
    vote_boost = min(sum(r.votes for r in resources) / 1000, 0.01)
    return round(min(base + vote_boost, 1.0), 2)


# ---------------------------------------------------------------------------
# Background task
# ---------------------------------------------------------------------------


def calculate_transparency_score(course_id: str) -> None:
    with Session(engine) as session:
        resources = list(
            session.exec(select(Resource).where(Resource.course_id == course_id)).all()
        )
        score = compute_resource_readiness(resources)
        print(f"[bg] course={course_id} transparency_score={score}")


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------


@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield


app = FastAPI(title="NexusShare API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

# ---------------------------------------------------------------------------
# Auth routes
# ---------------------------------------------------------------------------


@app.post("/login", response_model=TokenResponse)
def login(body: LoginRequest):
    if body.username != ADMIN_USERNAME or body.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = jwt.encode(
        {"sub": body.username, "exp": datetime.utcnow() + timedelta(hours=8)},
        SECRET_KEY,
        algorithm=ALGORITHM,
    )
    return TokenResponse(access_token=token)


@app.post("/logout")
def logout():
    return {"detail": "Logged out"}


# ---------------------------------------------------------------------------
# Course discovery
# ---------------------------------------------------------------------------


@app.get("/courses", response_model=list[CourseOut])
def search_courses(
    query: str = "", session: Session = Depends(get_session)
) -> list[CourseOut]:
    stmt = select(Course, Professor).join(
        Professor, Course.professor_id == Professor.id  # type: ignore[arg-type]
    )
    if query:
        stmt = stmt.where(
            or_(
                Course.code.contains(query),
                Course.name.contains(query),
                Professor.name.contains(query),
            )
        )
    rows = session.exec(stmt).all()

    result: list[CourseOut] = []
    for course, prof in rows:
        resources = list(
            session.exec(select(Resource).where(Resource.course_id == course.id)).all()
        )
        result.append(
            CourseOut(
                id=course.id,
                code=course.code,
                name=course.name,
                professor_name=prof.name,
                recording_status=course.recording_status,
                avg_textbook_cost=course.avg_textbook_cost,
                resource_readiness_score=compute_resource_readiness(resources),
                resources=[ResourceOut.model_validate(r) for r in resources],
            )
        )
    return result


# ---------------------------------------------------------------------------
# Upload
# ---------------------------------------------------------------------------


@app.post("/upload", status_code=202)
async def upload_resource(
    background_tasks: BackgroundTasks,
    course_id: str = Form(...),
    resource_type: ResourceType = Form(...),
    uploader_netid: str = Depends(require_nyu_email),
    url: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    session: Session = Depends(get_session),
):
    if file is not None:
        if resource_type == ResourceType.syllabus:
            if not (file.filename or "").lower().endswith(".pdf"):
                raise HTTPException(
                    status_code=415, detail="Syllabus must be a PDF file"
                )
        dest = STATIC_DIR / (file.filename or "upload")
        async with aiofiles.open(dest, "wb") as f:
            await f.write(await file.read())
        resource_url = f"/static/{file.filename}"
    elif url:
        if not url.startswith(ALLOWED_URL_PREFIXES):
            raise HTTPException(
                status_code=400,
                detail="URL must be a YouTube or Google Drive link",
            )
        resource_url = url
    else:
        raise HTTPException(status_code=400, detail="Provide a file or a url")

    resource = Resource(
        course_id=course_id,
        type=resource_type,
        url=resource_url,
        uploader_netid=uploader_netid,
        votes=0,
    )
    session.add(resource)
    session.commit()
    session.refresh(resource)

    background_tasks.add_task(calculate_transparency_score, course_id)
    return {"status": "Processing - Peer Reviewing in Progress", "id": resource.id}


# ---------------------------------------------------------------------------
# Peer validation
# ---------------------------------------------------------------------------


@app.post("/resources/{resource_id}/verify")
def verify_resource(resource_id: str, session: Session = Depends(get_session)):
    resource = session.get(Resource, resource_id)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    resource.votes += 1
    session.add(resource)
    session.commit()
    return {"id": resource_id, "votes": resource.votes}


# ---------------------------------------------------------------------------
# Admin takedown
# ---------------------------------------------------------------------------


@app.delete("/resources/{resource_id}", tags=["admin"])
def admin_takedown(
    resource_id: str,
    session: Session = Depends(get_session),
    _admin: str = Depends(get_current_admin),
):
    resource = session.get(Resource, resource_id)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    session.delete(resource)
    session.commit()
    return {"detail": f"Resource {resource_id} removed"}
