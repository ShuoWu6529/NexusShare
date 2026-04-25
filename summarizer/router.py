"""FastAPI router for syllabus summarization endpoints."""

from typing import Any

from fastapi import APIRouter, File, HTTPException, UploadFile
from pydantic import BaseModel

from .extract_pdf import extract_text_from_pdf
from .summarize import summarize_syllabus

router = APIRouter(prefix="/summarize", tags=["summarizer"])


class TextRequest(BaseModel):
    """Request body for text summarization."""

    text: str


@router.post("/text")
async def summarize_text(body: TextRequest) -> dict[str, Any]:
    """
    Summarize a syllabus provided as plain text.

    Args:
        body: TextRequest with 'text' field containing the syllabus.

    Returns:
        Dictionary with summary, key_topics, grading_breakdown, weekly_schedule, study_tips.

    Raises:
        HTTPException 400: If text is empty or missing.
    """
    if not body.text.strip():
        raise HTTPException(status_code=400, detail="text field must not be empty")

    return summarize_syllabus(body.text)


@router.post("/pdf")
async def summarize_pdf(file: UploadFile = File(...)) -> dict[str, Any]:
    """
    Upload a PDF syllabus for extraction and summarization.

    Args:
        file: PDF file upload.

    Returns:
        Dictionary with summary, key_topics, grading_breakdown, weekly_schedule, study_tips.

    Raises:
        HTTPException 400: If file is not a PDF.
        HTTPException 422: If PDF contains no extractable text.
    """
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="File must be a PDF (.pdf)")

    try:
        content = await file.read()
        text = extract_text_from_pdf(content)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Failed to extract PDF text: {str(e)}")

    if not text.strip():
        raise HTTPException(
            status_code=422, detail="Could not extract readable text from PDF"
        )

    return summarize_syllabus(text)
