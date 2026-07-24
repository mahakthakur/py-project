from pydantic import BaseModel
from typing import List, Optional

class DocumentSummary(BaseModel):
    summary: str
    key_takeaways: List[str]

class Lesson(BaseModel):
    title: str
    description: Optional[str] = None
    visual_asset_prompt: str

class Chapter(BaseModel):
    chapter_title: str
    summary: str
    lessons: List[Lesson]

class FullCourse(BaseModel):
    course_title: str
    chapters: List[Chapter]

class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    answerIndex: int

class ChapterQuiz(BaseModel):
    questions: List[QuizQuestion]