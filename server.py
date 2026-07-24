import os
import shutil
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from engine import CourseAgent  # Imports the CourseAgent from your engine script

app = FastAPI()

# Enable connection bridges between React (Vite) and Python Core
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

agent = CourseAgent()
UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class QuestionPayload(BaseModel):
    question: str

@app.post("/api/ingest")
async def api_ingest(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF document formats are supported.")
    
    temp_file_path = os.path.join(UPLOAD_DIR, file.filename)
    try:
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Directly runs your multi-stage layout synthesis pipeline from engine.py
        payload = agent.generate_course_materials(temp_file_path)
        return payload

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
    finally:
        # Keep or clean up temp file based on your caching preferences
        pass

@app.post("/api/chat")
async def api_chat(payload: QuestionPayload):
    try:
        # Calls the existing query_document RAG method inside your CourseAgent
        answer = agent.query_document(payload.question)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)