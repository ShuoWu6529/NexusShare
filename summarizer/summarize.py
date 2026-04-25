"""AI-powered syllabus summarization using OpenAI."""

import json
import os
from typing import Any

# Mock response for when OPENAI_API_KEY is not set
MOCK_RESPONSE = {
    "summary": "This course provides foundational knowledge in the subject matter through a combination of lectures, readings, and assignments. Students will develop core competencies through hands-on projects and collaborative learning.",
    "key_topics": [
        "Fundamentals and core concepts",
        "Theory and practice",
        "Problem-solving techniques",
        "Real-world applications",
        "Advanced topics",
        "Case studies",
    ],
    "grading_breakdown": {
        "Exams": 35,
        "Projects": 40,
        "Participation": 15,
        "Homework": 10,
    },
    "weekly_schedule": [
        {"week": 1, "topic": "Introduction and course overview"},
        {"week": 2, "topic": "Fundamentals and core concepts"},
        {"week": 3, "topic": "Theory and applications"},
        {"week": 4, "topic": "Problem-solving techniques"},
        {"week": 5, "topic": "Midterm review and project kickoff"},
    ],
    "study_tips": [
        "Attend all lectures and take detailed notes",
        "Start assignments early to allow time for debugging",
        "Form study groups with classmates",
        "Attend office hours for one-on-one help",
        "Review lecture recordings and supplementary materials",
    ],
}


def summarize_syllabus(text: str) -> dict[str, Any]:
    """
    Extract structured information from a course syllabus using OpenAI API.

    Args:
        text: The syllabus text to summarize.

    Returns:
        A dictionary with keys:
        - summary: 2-3 sentence overview of the course
        - key_topics: List of 5-8 main topics
        - grading_breakdown: Dict of grade components and percentages
        - weekly_schedule: List of dicts with week number and topic
        - study_tips: List of 3-5 study recommendations

    Falls back to mock response if OPENAI_API_KEY is not set.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return _mock_response(text)

    from openai import OpenAI

    client = OpenAI(api_key=api_key)

    prompt = """Extract and structure the following information from this course syllabus:
1. A 2-3 sentence summary of the course
2. 5-8 key topics covered
3. Grading breakdown as percentages (e.g., {"Exams": 40, "Projects": 60})
4. Weekly schedule with week number and topic for first 5 weeks (or all weeks if fewer)
5. 3-5 study tips for success

Respond ONLY with valid JSON in this exact format:
{
  "summary": "...",
  "key_topics": ["topic1", "topic2", ...],
  "grading_breakdown": {"Component": percentage, ...},
  "weekly_schedule": [{"week": 1, "topic": "..."}, ...],
  "study_tips": ["tip1", "tip2", ...]
}"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": "You are an academic assistant that extracts structured information from course syllabi. Always respond with valid JSON only, no additional text.",
            },
            {"role": "user", "content": f"{prompt}\n\nSyllabus:\n{text}"},
        ],
        temperature=0.3,
        max_tokens=1500,
    )

    return json.loads(response.choices[0].message.content)


def _mock_response(text: str) -> dict[str, Any]:
    """Return a plausible mock response when OPENAI_API_KEY is not set."""
    return MOCK_RESPONSE.copy()
