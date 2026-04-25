"""AI syllabus summarizer module for NexusShare."""

from .summarize import summarize_syllabus
from .extract_pdf import extract_text_from_pdf
from .router import router

__all__ = ["summarize_syllabus", "extract_text_from_pdf", "router"]
