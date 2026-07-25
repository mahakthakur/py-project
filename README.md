AI-Powered Course Generation & Learning Platform
An end-to-end full-stack web application that transforms PDF documents into structured interactive courses using AI, complete with user authentication, dynamic course navigation, progress tracking, an AI chatbot, quiz generation, and comprehensive dashboards.

🚀 Features
User Authentication: Secure sign-up, login, and session management.

PDF Upload & Processing: Upload study materials or technical documentation to extract content automatically.

AI Course Generation: Automatically converts parsed PDF data into multi-module interactive courses.

Course Navigation & Progress Tracking: Seamlessly move through chapters and track your learning milestones.

AI Chatbot: Context-aware assistant to answer questions based on the course material.

Quiz Generation: Automated quizzes generated from course modules to test knowledge retention.

User Dashboard: Centralized hub displaying overview stats, active courses, and learning analytics.

📂 Project Structure
Plaintext
py-project/
├── src/                 # Source code and frontend components
├── engine.py            # AI processing and course generation engine
├── server.py            # Backend server API (FastAPI/Node setup)
├── models.py            # Database models and schemas
├── index.html           # Main entry interface
├── package.json         # Node.js dependencies and configuration
├── requirements.txt     # Python dependencies
└── tailwind.config.js   # Styling configuration
🛠️ Tech Stack
Frontend: HTML5, JavaScript, Tailwind CSS

Backend: Python / Node.js (server.py, engine.py)

Database & Models: Custom database schemas (models.py)

AI Integration: LLM-powered course and quiz generation pipelines

⚙️ Setup and Installation Instructions
Prerequisites
Python (3.8+)

Node.js & npm

1. Backend Setup
Clone the repository and navigate to the project directory.

Install Python dependencies:

Bash
pip install -r requirements.txt
Configure your environment variables (create a .env file based on instructions/examples if required).

Run the backend server:

Bash
python server.py
2. Frontend & Dependencies Setup
Install Node.js packages:

Bash
npm install
Start the development environment or serve index.html.

🌐 API Documentation
API endpoints are structured to support authentication, PDF processing, course creation, progress updates, and chat interactions. Refer to server.py and models.py for exact endpoint routing, payload structures, and database schemas.

🚀 Deployment
Frontend: Ready for deployment on Vercel

Backend API: Ready for deployment on Render, Railway, Koyeb, or Fly.io
