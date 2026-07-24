import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatAgent from "../component/chatagent.jsx";

const initialCourseState = {
  courseTitle: "Deep Machine Learning & Python Infrastructure",
  chapters: [
    {
      id: "ch-1",
      title: "Foundations of High-Performance Computations",
      summary: "This module maps out recursive text vector layouts, cache persistence architectures via key hashing matrices, and memory management bindings inside runtime engines.",
      lessons: ["Understanding Runtime Memory Layouts", "Multithreading Control Vectors", "SQLite Buffer Pool Synchronization"],
      quiz: {
        question: "Which component completely eliminates massive memory allocations inside the document parser engine?",
        options: ["Context memory block streaming layers", "Volatile random heap stacks", "Synchronous network sockets"],
        answerIndex: 0
      }
    }
  ]
};
const handleFileUpload = async (e) => {
  const uploadedFile = e.target.files?.[0];
  if (!uploadedFile) return;
  
  setFile(uploadedFile);
  setIsProcessing(true);

  // Attempt backend parse with a strict 1.5s timeout ceiling
  const backendPayload = await ingestDocumentWithTimeout(uploadedFile, 1500);
  
  // Instantly process and render data without lag
  const calculatedSize = `${(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB`;
  const safeData = sanitizeCourseData(backendPayload, uploadedFile.name, calculatedSize);

  setCourseData(safeData);
  setIsProcessing(false);
};
export default function Dashboard({ completedLessons, toggleLessonComplete, courseData }) {
  // Use backend courseData if available, otherwise fallback safely
  const activeCourse = courseData || initialCourseState;
  
  // Normalize chapters to fit the UI structure whether it's mock or backend schema
  const formattedChapters = activeCourse.chapters || activeCourse.course?.chapters || initialCourseState.chapters;

  const [activeChapter, setActiveChapter] = useState(formattedChapters[0]);
  const [modalType, setModalType] = useState(null); 
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [quizScore, setQuizScore] = useState(null);

  // Keep active chapter synced if new course data arrives from an ingestion event
  useEffect(() => {
    if (formattedChapters.length > 0) {
      setActiveChapter(formattedChapters[0]);
    }
  }, [courseData]);

  const calculateChapterProgress = (chapter) => {
    const lessonsList = chapter.lessons || [];
    if (lessonsList.length === 0) return 0;
    const completed = lessonsList.filter(l => completedLessons.includes(typeof l === 'string' ? l : l.title)).length;
    return Math.round((completed / lessonsList.length) * 100);
  };

  const handleQuizSubmit = () => {
    const correctIdx = activeChapter.quiz?.answerIndex ?? activeChapter.quiz?.correct_index ?? 0;
    if (selectedQuizOption === correctIdx) {
      setQuizScore('correct');
    } else {
      setQuizScore('incorrect');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 max-w-7xl mx-auto">
      <div className="lg:col-span-2 space-y-6">
        <div className="mb-4">
          <span className="text-xs font-semibold text-cyan-400 tracking-widest uppercase">Active Curriculum Pipeline</span>
          <h2 className="text-3xl font-black text-white tracking-tight mt-1">
            {activeCourse.courseTitle || activeCourse.course?.course_title || "Dynamic Ingested Curriculum"}
          </h2>
        </div>

        {formattedChapters.map((chapter, idx) => {
          const chapterId = chapter.id || `ch-${idx}`;
          const chapterTitle = chapter.title || chapter.chapter_title;
          const lessonsList = chapter.lessons || [];

          return (
            <motion.div 
              key={chapterId}
              whileHover={{ y: -2 }}
              className={`p-6 rounded-xl transition-all duration-300 border ${activeChapter === chapter ? 'glass-panel border-cyan-500/40 bg-slate-900/60' : 'bg-slate-900/20 border-slate-800/40 opacity-70 hover:opacity-100'}`}
              onClick={() => { setActiveChapter(chapter); setQuizScore(null); setSelectedQuizOption(null); }}
            >
              <div className="flex justify-between items-start mb-4 cursor-pointer">
                <div>
                  <span className="text-xs font-mono text-slate-500">MODULE 0{idx + 1}</span>
                  <h3 className="text-xl font-bold text-slate-100 mt-0.5">{chapterTitle}</h3>
                </div>
                <span className="text-sm font-mono text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded border border-cyan-800/30">
                  {calculateChapterProgress(chapter)}% Done
                </span>
              </div>

              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden mb-6">
                <motion.div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" 
                  animate={{ width: `${calculateChapterProgress(chapter)}%` }}
                />
              </div>

              {activeChapter === chapter && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 pt-2 border-t border-slate-800/60">
                  {lessonsList.map((lesson) => {
                    const lessonTitle = typeof lesson === 'string' ? lesson : lesson.title;
                    return (
                      <label key={lessonTitle} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-950/40 hover:bg-slate-950/80 cursor-pointer border border-slate-900 transition-colors">
                        <input 
                          type="checkbox" 
                          checked={completedLessons.includes(lessonTitle)}
                          onChange={() => toggleLessonComplete(lessonTitle)}
                          className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 focus:ring-offset-0"
                        />
                        <span className={`text-sm ${completedLessons.includes(lessonTitle) ? 'line-through text-slate-500' : 'text-slate-300'}`}>{lessonTitle}</span>
                      </label>
                    );
                  })}

                  <div className="flex gap-3 mt-4 pt-2">
                    <button 
                      onClick={() => setModalType('summary')}
                      className="flex-1 py-2 text-xs font-semibold uppercase tracking-wider rounded bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors border border-slate-700"
                    >
                      View Summary
                    </button>
                    <button 
                      onClick={() => setModalType('quiz')}
                      className="flex-1 py-2 text-xs font-semibold uppercase tracking-wider rounded bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:brightness-110 transition-all shadow-md shadow-indigo-900/20"
                    >
                      Take Quiz
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-6">
          <ChatAgent />
        </div>
      </div>

      <AnimatePresence>
        {modalType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-xl p-6 rounded-xl glass-panel bg-slate-900 border-slate-700/60 shadow-2xl relative">
              <button onClick={() => setModalType(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white font-mono text-lg">✕</button>

              {modalType === 'summary' && (
                <div>
                  <h3 className="text-xl font-extrabold text-white mb-2">Executive Module Summary</h3>
                  <span className="text-xs text-cyan-400 font-mono tracking-wider uppercase block mb-4">{activeChapter.title || activeChapter.chapter_title}</span>
                  <p className="text-slate-300 leading-relaxed text-sm bg-slate-950/40 p-4 rounded-lg border border-slate-800">
                    {activeChapter.summary || activeChapter.description || "Synthesized structural overview mapping vector properties and execution flow."}
                  </p>
                </div>
              )}

              {modalType === 'quiz' && activeChapter.quiz && (
                <div>
                  <h3 className="text-xl font-extrabold text-white mb-1">Diagnostic Context Verification</h3>
                  <p className="text-xs text-slate-400 mb-6">Confirm understanding of the ingested technical documentation.</p>
                  
                  <p className="text-sm font-semibold text-slate-200 mb-4 bg-slate-950/40 p-3 rounded border border-slate-800">
                    {activeChapter.quiz.question}
                  </p>
                  
                  <div className="space-y-2">
                    {activeChapter.quiz.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedQuizOption(i)}
                        className={`w-full text-left p-3 rounded-lg text-sm border transition-all ${selectedQuizOption === i ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300 font-medium' : 'bg-slate-950/20 border-slate-800 text-slate-400 hover:bg-slate-950/60'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <button 
                      onClick={handleQuizSubmit}
                      disabled={selectedQuizOption === null}
                      className="px-6 py-2 bg-cyan-500 text-slate-950 font-bold rounded hover:bg-cyan-400 transition-colors text-sm disabled:opacity-40"
                    >
                      Verify Selection
                    </button>

                    {quizScore && (
                      <span className={`text-sm font-bold tracking-wide ${quizScore === 'correct' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {quizScore === 'correct' ? '✓ VERIFIED ACCURATE' : '✗ EVALUATION FAILED'}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
