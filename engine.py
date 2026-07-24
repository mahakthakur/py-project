import os
import json
import sqlite3
import hashlib
import shutil
from typing import Dict, Any, List
import fitz  # PyMuPDF
from dotenv import load_dotenv

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ValidationError

from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.documents import Document

# Import structural payloads mapping directly to your dashboard frontend loop
from models import FullCourse, DocumentSummary, ChapterQuiz

# ---------------------------------------------------------------------------
# GLOBAL INITIALIZATION & CONFIGURATION ENVIRONMENT CONTEXT
# ---------------------------------------------------------------------------
load_dotenv(override=True)
DB_PATH = "course_cache.db"
UPLOAD_DIR = "uploaded_docs"

class CourseAgent:
    """Orchestrates multi-stage RAG generation pipelines to ingest technical
    documentation and synthesize structured e-learning curriculum objects.
    """

    def __init__(self, groq_api_key: str = None):
        self.api_key = (
            groq_api_key 
            or os.getenv("GROQ_API_KEY") 
           
        )
        if not self.api_key or not self.api_key.strip():
            raise ValueError("❌ CRITICAL: GROQ_API_KEY could not be validated in runtime context.")

        # Core synthesis engine targeting large production model context windows
        self.llm = ChatGroq(
            model="llama-3.3-70b-specdec", 
            temperature=0.3, 
            groq_api_key=self.api_key,
            max_tokens=8192,
        )
        
        self.documents_store: List[Document] = []
        self._init_database()

    # ---------------------------------------------------------------------------
    # DATABASE PERSISTENCE LAYER
    # ---------------------------------------------------------------------------
    def _init_database(self):
        """Initializes localized SQLite instance to cache generated configurations."""
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS generated_courses (
                    file_hash TEXT PRIMARY KEY,
                    filename TEXT,
                    payload TEXT
                )
            """)
            conn.commit()

    def _calculate_file_hash(self, file_path: str) -> str:
        """Generates a SHA-256 fingerprint signature of local files to handle cache hits."""
        hasher = hashlib.sha256()
        with open(file_path, "rb") as f:
            while chunk := f.read(8192):
                hasher.update(chunk)
        return hasher.hexdigest()

    def get_cached_course(self, file_path: str) -> Dict[str, Any] | None:
        """Retrieves an existing parsed dashboard structure payload from database cache."""
        file_hash = self._calculate_file_hash(file_path)
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT payload FROM generated_courses WHERE file_hash = ?", (file_hash,))
            row = cursor.fetchone()
            if row:
                print("💾 Cache Hit! Fetching course structure directly from database storage...")
                return json.loads(row[0])
        return None

    def save_course_to_db(self, file_path: str, payload: Dict[str, Any]):
        """Saves a finished multi-stage synthesis array object down into SQLite storage."""
        file_hash = self._calculate_file_hash(file_path)
        filename = os.path.basename(file_path)
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT OR REPLACE INTO generated_courses (file_hash, filename, payload) VALUES (?, ?, ?)",
                (file_hash, filename, json.dumps(payload))
            )
            conn.commit()
        print("💾 Course blueprint successfully cached in the local database.")

    # ---------------------------------------------------------------------------
    # DOCUMENT INGESTION & DATA PREPARATION PIPELINES
    # ---------------------------------------------------------------------------
    def extract_text_from_pdf(self, pdf_path: str) -> str:
        """Stream-extracts raw text configurations out of large text-based PDFs efficiently."""
        if not os.path.exists(pdf_path):
            raise FileNotFoundError(f"Target document reference path missing: '{pdf_path}'")
            
        full_text = []
        with fitz.open(pdf_path) as doc:
            for page in doc:
                full_text.append(page.get_text())
        return "\n".join(full_text)

    def _native_text_split(self, text: str, chunk_size: int = 2000, chunk_overlap: int = 300) -> List[str]:
        """Lightning-fast native Python text chunker bypassing heavy library C++ bindings."""
        chunks = []
        start = 0
        text_length = len(text)
        
        while start < text_length:
            end = start + chunk_size
            chunks.append(text[start:end])
            start += chunk_size - chunk_overlap
            
        return chunks

    def initialize_rag_store(self, raw_text: str):
        """Transforms long document buffers into lightweight searchable document sections."""
        splits = self._native_text_split(raw_text, chunk_size=2000, chunk_overlap=300)
        self.documents_store = [Document(page_content=text) for text in splits]
        return self.documents_store

    def _retrieve_relevant_chunks(self, query: str, k: int = 4) -> List[Document]:
        """Lightweight keyword and sliding-window context retriever."""
        if not self.documents_store:
            return []
        
        query_terms = set(query.lower().split())
        scored_docs = []
        
        for doc in self.documents_store:
            content_lower = doc.page_content.lower()
            score = sum(1 for term in query_terms if term in content_lower)
            scored_docs.append((score, doc))
            
        scored_docs.sort(key=lambda x: x[0], reverse=True)
        
        if not scored_docs or scored_docs[0][0] == 0:
            return self.documents_store[:k]
            
        return [doc for score, doc in scored_docs[:k]]

    def query_document(self, user_question: str) -> str:
        """Conversational RAG fallback layer supporting localized chat tutor."""
        if not self.documents_store:
            return "⚠️ No active document index detected. Please upload and parse a document first."
            
        relevant_docs = self._retrieve_relevant_chunks(user_question, k=4)
        context = "\n\n".join([doc.page_content for doc in relevant_docs])
        
        qa_prompt = ChatPromptTemplate.from_messages([
            ("system", (
                "You are an elite academic mentor. Answer the user's question accurately and explicitly "
                "basing your response on the provided context extraction documents."
            )),
            ("user", "Context Reference:\n\n{context}\n\nQuestion: {question}")
        ])
        
        qa_chain = qa_prompt | self.llm
        response = qa_chain.invoke({"context": context, "question": user_question})
        return response.content

    # ---------------------------------------------------------------------------
    # CORE MULTI-STAGE STEPPER SYNTHESIS PIPELINES WITH ERROR ISOLATION
    # ---------------------------------------------------------------------------
    def generate_course_materials(self, pdf_path: str) -> Dict[str, Any]:
        """Runs the complete synchronous generation workflow mapping directly
        to the frontend loading stepper metrics. Checks DB cache first.
        """
        cached_data = self.get_cached_course(pdf_path)
        if cached_data:
            return cached_data

        print("🔍 Extracting document metrics...")
        raw_text = self.extract_text_from_pdf(pdf_path)
        if not raw_text.strip():
            raise ValueError("The uploaded document contains no renderable text layers.")

        print("📦 Indexing complete reference material into memory...")
        self.initialize_rag_store(raw_text)
        
        global_context_docs = self._retrieve_relevant_chunks("core concepts, main topics, and structural overview", k=3)
        global_context = "\n\n".join([doc.page_content for doc in global_context_docs])

        # STEP 3: Summary Generation with Safe Parsing Exception Blocks
        print("📄 Generating deep text summaries...")
        summary_prompt = ChatPromptTemplate.from_messages([
            ("system", "You are an advanced researcher. Provide an intense executive summary and key takeaways of the provided source context."),
            ("user", "Reference Context Material:\n\n{context}")
        ])
        
        try:
            structured_summary_llm = self.llm.with_structured_output(DocumentSummary) 
            summary_chain = summary_prompt | structured_summary_llm
            summary_result = summary_chain.invoke({"context": global_context})
        except Exception as e:
            print(f"⚠️ Structured summary extraction error: {str(e)}. Falling back to default generation format.")
            raise HTTPException(status_code=500, detail=f"Summary Generation Error: {str(e)}")

        # STEP 4: Course Layout Generation
        print("🎓 Generating full visual e-course structural layout...")
        course_prompt = ChatPromptTemplate.from_messages([
            ("system", (
                "You are an elite, modern instructional design engine. Your task is to transform technical "
                "reference documentation into an exceptionally engaging, deeply interactive online course curriculum.\n\n"
                "Provide layout mapping strictly following schema guidelines."
            )),
            ("user", "Reference Context Material:\n\n{context}")
        ])
        
        try:
            structured_course_llm = self.llm.with_structured_output(FullCourse)
            course_chain = course_prompt | structured_course_llm
            course_result = course_chain.invoke({"context": global_context})
        except Exception as e:
            print(f"⚠️ Structured course generation error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Course Blueprint Generation Error: {str(e)}")

        # STEP 5: Chapter Quiz Generation Loop
        print("🧪 Framing localized conceptual testing metrics (Quizzes via RAG)...")
        quiz_prompt = ChatPromptTemplate.from_messages([
            ("system", "You are an academic instructor. Generate a rigorous comprehensive diagnostic evaluation quiz covering the concepts outlined within this chapter content block."),
            ("user", "Chapter Framework:\n{chapter_framework}\n\nDeep Resource Context Found:\n{rag_context}")
        ])
        
        structured_quiz_llm = self.llm.with_structured_output(ChapterQuiz)
        quiz_chain = quiz_prompt | structured_quiz_llm
        
        all_quizzes = []
        for chapter in course_result.chapters:
            try:
                lesson_titles = [l.title for l in chapter.lessons]
                chapter_summary = f"Title: {chapter.chapter_title}\nLessons: " + " | ".join(lesson_titles)
                
                localized_docs = self._retrieve_relevant_chunks(
                    f"Detailed concepts regarding: {chapter.chapter_title}. Specific info on: {', '.join(lesson_titles)}", k=3
                )
                localized_context = "\n\n".join([doc.page_content for doc in localized_docs])
                
                quiz_output = quiz_chain.invoke({
                    "chapter_framework": chapter_summary,
                    "rag_context": localized_context
                })
                all_quizzes.append(quiz_output.model_dump())
            except Exception as q_err:
                print(f"⚠️ Warning: Quiz generation failed for chapter '{chapter.chapter_title}': {str(q_err)}")
                # Append a fallback structure or skip to prevent total 500 collapse if preferred, 
                # or raise error depending on strictness requirements.

        final_output = {
            "summary": summary_result.model_dump(),
            "course": course_result.model_dump(),
            "quizzes": all_quizzes
        }

        self.save_course_to_db(pdf_path, final_output)
        return final_output


# ---------------------------------------------------------------------------
# FASTAPI APPLICATION SETUP


import os
import shutil
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Initialize FastAPI app
app = FastAPI(title="AuraCurriculum Engine Backend")

# Configure CORS Middleware to allow requests from your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "./uploaded_documents"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Placeholder for your course agent class
class CourseAgent:
    def generate_course_materials(self, file_path: str):
        # Implement your LangChain / RAG agent logic here
        return {
            "course_title": "Processed Course",
            "chapters": []
        }
    
    def query_document(self, message: str):
        return f"Response to: {message}"

agent = CourseAgent()

class QuestionPayload(BaseModel):
    message: str


@app.get("/")
async def root():
    return {
        "status": "online",
        "message": "AuraCurriculum Engine Backend is running successfully!",
        "docs": "/docs"
    }


@app.post("/api/ingest")
async def ingest_document(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF document formats are supported.")
    
    temp_file_path = os.path.join(UPLOAD_DIR, file.filename)
    try:
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        payload = agent.generate_course_materials(temp_file_path)
        return payload

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"❌ Ingestion internal error trace: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to process document: {str(e)}")


@app.post("/api/chat")
async def api_chat(payload: QuestionPayload):
    try:
        answer = agent.query_document(payload.message)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    print("✨ Starting AuraCurriculum Backend Server...")
    uvicorn.run("engine:app", host="127.0.0.1", port=8000, reload=True)