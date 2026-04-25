"""PDF text extraction utilities."""

import io
from pathlib import Path
from typing import Union

from pypdf import PdfReader


def extract_text_from_pdf(path_or_bytes: Union[str, Path, bytes]) -> str:
    """
    Extract all text from a PDF file or bytes.

    Args:
        path_or_bytes: A file path (str or Path) or PDF content as bytes.

    Returns:
        Extracted text from all pages, joined with newlines.

    Raises:
        FileNotFoundError: If path does not exist.
        Exception: If PDF is corrupted or cannot be read.
    """
    if isinstance(path_or_bytes, bytes):
        # Handle bytes input
        reader = PdfReader(io.BytesIO(path_or_bytes))
    else:
        # Handle file path
        reader = PdfReader(str(path_or_bytes))

    text_pages = []
    for page in reader.pages:
        extracted = page.extract_text()
        if extracted:
            text_pages.append(extracted)

    return "\n".join(text_pages)
