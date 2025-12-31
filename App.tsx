import React, {
  useState,
  useMemo,
  Suspense,
  useCallback,
  useEffect,

} from 'react';

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import { LESSONS } from './constants';
import { CourseType } from './types';
import InfoPanels from './components/InfoPanels';
import Toast, { ToastMessage } from './components/Toast';
import {
  getLessonProgress,
  toggleLessonComplete,
  updateLessonAccess,
  getProgressByType,
  addStudyTime,
} from './utils/progress';
import { isBookmarked, toggleBookmark } from './utils/bookmarks';
import LandingPage from './components/LandingPage';
import AgentPage from './components/AgentPage';
import { logEnvConfig } from './src/debug/envDebug';



logEnvConfig();

const PdfFiles = React.lazy(() => import('./components/PdfFiles'));
const SearchModal = React.lazy(() => import('./components/SearchModal'));
const StatsModal = React.lazy(() => import('./components/StatsModal'));
const QuizModal = React.lazy(() => import('./components/QuizModal'));
const FlashcardModal = React.lazy(() => import('./components/FlashcardModal'));
const ExamSimulation = React.lazy(() => import('./components/ExamSimulation'));
const MasterFile = React.lazy(() => import('./components/MasterFile'));
const LessonCard = React.lazy(() => import('./components/LessonCard'));

// Skeleton برای محتواى MasterFile
const MasterFileSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
    <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="h-24 bg-gray-100 dark:bg-gray-800 rounded" />
      <div className="h-24 bg-gray-100 dark:bg-gray-800 rounded" />
    </div>
  </div>
);

const App: React.FC = () => {
  const [activeType, setActiveType] = useState<CourseType>('GA2');
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<"dashboard" | "agent">("dashboard");


  // Landing vs Dashboard
  const [view, setView] = useState<'landing' | 'app'>('landing');

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [showPdfPage, setShowPdfPage] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [showExam, setShowExam] = useState(false);
  const [lessonStartTime, setLessonStartTime] = useState<Record<string, number>>({});
  const [progressRefresh, setProgressRefresh] = useState(0); // فقط براى ری‌فِرش

  const addToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'info') => {
      const id = Date.now().toString();
      setToasts(prev => [...prev, { id, message, type, duration: 4000 }]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const filteredLessons = useMemo(
    () => LESSONS.filter(l => l.type === activeType).sort((a, b) => a.order - b.order),
    [activeType]
  );

  const toggleLesson = (id: string) => {
    setExpandedLessonId(prev => (prev === id ? null : id));
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // اعمال DarkMode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // وقتی از Landing به Dashboard می‌آیی، نوع هدف (GA2/WISO/PRUEF) را بخوان
  useEffect(() => {
    if (view === 'app' && typeof window !== 'undefined') {
      const target = localStorage.getItem('landingTarget') as CourseType | null;
      if (target === 'GA2' || target === 'WISO' || target === 'PRUEF') {
        setActiveType(target);
      }
    }
  }, [view]);

  // Study timer – مثل نسخهٔ اصلی
  useEffect(() => {
    if (expandedLessonId) {
      updateLessonAccess(expandedLessonId);
      setLessonStartTime(prev => ({ ...prev, [expandedLessonId]: Date.now() }));

      const interval = setInterval(() => {
        const startTime = lessonStartTime[expandedLessonId];
        if (startTime) {
          const elapsed = Math.floor((Date.now() - startTime) / 1000);
          if (elapsed > 0 && elapsed % 30 === 0) {
            addStudyTime(expandedLessonId, 30);
          }
        }
      }, 1000);

      return () => {
        clearInterval(interval);
        const startTime = lessonStartTime[expandedLessonId];
        if (startTime) {
          const elapsed = Math.floor((Date.now() - startTime) / 1000);
          if (elapsed > 0) {
            addStudyTime(expandedLessonId, elapsed);
          }
        }
      };
    }
  }, [expandedLessonId, lessonStartTime]);

  // برگشت به Home از داخل Dashboard
  const goHome = () => {
    setView('landing');
  };
  // LandingPage
  const landingContent = (
    <LandingPage
      onStart={() => setView('app')}
      darkMode={darkMode}
      onToggleDarkMode={toggleDarkMode}
    />
  );

  // از اینجا به بعد: Dashboard اصلی
  const appContent = (
    <div className="h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col">
      <Toast toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <header className="bg-slate-900/95 backdrop-blur border-b border-slate-800 no-print flex-shrink-0">
        <div className="max-w-6xl mx-auto w-full px-4 h-14 flex items-center justify-between">
          {/* Left: Logo + Title + Tabs */}
          <div className="flex items-center gap-4">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm ${
                activeType === 'GA2'
                  ? 'bg-blue-500'
                  : activeType === 'WISO'
                  ? 'bg-emerald-500'
                  : 'bg-purple-500'
              }`}
            >
              FL
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-50 tracking-tight">
                FIAE Lernplattform
              </span>
              <span className="text-[11px] text-slate-400">
                Algorithmen - WISO (DE)
              </span>
            </div>

            {/* Tabs */}
            <div className="hidden md:flex items-center gap-1 ml-4 rounded-full bg-slate-800/80 px-1 py-0.5">
              {(['GA2', 'WISO', 'PRUEF'] as CourseType[]).map(type => {
                const progress = getProgressByType(
                  type,
                  LESSONS.filter(l => l.type === type).length
                );
                const isActive = activeType === type;

                const activeClasses =
                  type === 'GA2'
                    ? 'bg-blue-500 text-white shadow-sm shadow-blue-500/40'
                    : type === 'WISO'
                    ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/40'
                    : 'bg-purple-500 text-white shadow-sm shadow-purple-500/40';

                return (
                  <button
                    key={type}
                    onClick={() => {
                      setActiveType(type);
                      setExpandedLessonId(null);
                      setShowPdfPage(false);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      isActive
                        ? activeClasses
                        : 'text-slate-200/80 hover:text-slate-50 hover:bg-slate-700/80'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      {type === 'PRUEF' ? 'Pruefung' : type === 'GA2' ? 'Algorithmen' : type}
                      {progress.percentage > 0 && (
                        <span className="text-[10px] opacity-75">
                          {progress.percentage}%
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full bg-slate-800/80 px-1 py-0.5">
              {/* Search */}
              <button
                onClick={() => setShowSearch(true)}
                className="p-1.5 rounded-full text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                aria-label="Search"
                title="Suchen"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

              {/* Stats */}
              <button
                onClick={() => setShowStats(true)}
                className="p-1.5 rounded-full text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                aria-label="Statistics"
                title="Statistik"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2z"
                  />
                </svg>
              </button>

              {/* Quiz */}
              <button
                onClick={() => setShowQuiz(true)}
                className="p-1.5 rounded-full text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                aria-label="Quiz"
                title="Quiz"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>

              {/* Flashcards */}
              <button
                onClick={() => setShowFlashcards(true)}
                className="p-1.5 rounded-full text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                aria-label="Flashcards"
                title="Karteikarten"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </button>

              {/* Exam */}
              <button
                onClick={() => setShowExam(true)}
                className="p-1.5 rounded-full text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                aria-label="Exam Simulation"
                title="Pruefungssimulation"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </button>
            </div>

            {/* دکمه Home برای برگشت به Landing */}
            <Link to="/agent" className="text-blue-600 font-semibold">
              AI Agent
            </Link>

            <button
              onClick={goHome}
              className="px-3 py-1.5 rounded-full text-xs border border-slate-600/70 text-slate-200 hover:bg-slate-800/90 transition-colors"
            >
              Home
            </button>

            {/* Dark Mode */}
            <button
              onClick={toggleDarkMode}
              className="p-1.5 rounded-full text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            {/* PDF Toggle */}
            <button
              onClick={() => setShowPdfPage(v => !v)}
              className="px-3 py-1.5 rounded-full text-xs border border-slate-600/70 text-slate-200 hover:bg-slate-800/90 transition-colors"
              title="PDF Files"
            >
              PDF
            </button>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <main className="flex-1 overflow-y-auto">
        {(() => {
          const progress = getProgressByType(activeType, filteredLessons.length);
          return progress.percentage > 0 ? (
            <div className="no-print bg-slate-900/5 dark:bg-slate-900/40 border-b border-slate-200/70 dark:border-slate-800 sticky top-0 z-40">
              <div className="px-4 py-2">
                <div className="max-w-6xl mx-auto">
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 mb-1.5">
                    <span>
                      Fortschritt: {progress.completed} von {filteredLessons.length}
                    </span>
                    <span className="font-semibold">{progress.percentage}%</span>
                  </div>
                  <div className="relative h-2.5 bg-slate-200/70 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        activeType === 'GA2'
                          ? 'bg-blue-600'
                          : activeType === 'WISO'
                          ? 'bg-emerald-600'
                          : 'bg-purple-600'
                      }`}
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : null;
        })()}

        {/* PDF Page vs Dashboard */}
        {showPdfPage ? (
          <div className="max-w-6xl mx-auto px-4 py-6">
            <Suspense fallback={<div className="p-6 text-center text-sm">Lade PDF-Liste...</div>}>
              <PdfFiles onBack={() => setShowPdfPage(false)} />
            </Suspense>
          </div>
        ) : (
          <>
            <div className="max-w-6xl mx-auto px-4 py-4">
              <InfoPanels type={activeType} />
            </div>

            <div className="max-w-6xl mx-auto px-4 pb-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <h3 className="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-50">
                  Lektionen ({filteredLessons.length})
                </h3>
              </div>

              <Suspense fallback={<div className="text-center text-sm py-4">Lade Lektionen...</div>}>
                <div className="space-y-3">
                  {filteredLessons.map((lesson, index) => {
                    const isActive = expandedLessonId === lesson.id;
                    const lessonProgress = getLessonProgress(lesson.id);
                    const isCompleted = lessonProgress?.completed || false;
                    const isBookmarkedLesson = isBookmarked(lesson.id);

                    return (
                      <LessonCard
                        key={lesson.id}
                        lesson={lesson}
                        index={index}
                        isActive={isActive}
                        isCompleted={isCompleted}
                        isBookmarked={isBookmarkedLesson}
                        onToggle={() => toggleLesson(lesson.id)}
                        onToggleComplete={() => {
                          toggleLessonComplete(lesson.id);
                          setProgressRefresh(prev => prev + 1);
                          addToast(
                            isCompleted
                              ? 'Als nicht abgeschlossen markiert'
                              : 'Als abgeschlossen markiert',
                            'success'
                          );
                        }}
                        onToggleBookmark={() => {
                          toggleBookmark(lesson.id);
                          setProgressRefresh(prev => prev + 1);
                          addToast(
                            isBookmarkedLesson
                              ? 'Lesezeichen entfernt'
                              : 'Lesezeichen hinzugefuegt',
                            'success'
                          );
                        }}
                      >
                        {isActive && (
                          <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-4 md:p-6">
                            <Suspense fallback={<MasterFileSkeleton />}>
                              <MasterFile lesson={lesson} onToast={addToast} />
                            </Suspense>
                          </div>
                        )}
                      </LessonCard>
                    );
                  })}
                </div>
              </Suspense>
            </div>
          </>
        )}
      </main>

      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 py-2 mt-auto no-print">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-[11px]">
            (c) 2024 FIAE Lernplattform (Algorithmen &amp; WISO) - Entwickelt fuer Fachinformatiker Anwendungsentwicklung.
          </p>
        </div>
      </footer>

      {/* Modals */}
      {showSearch && (
        <Suspense fallback={null}>
          <SearchModal
            lessons={LESSONS}
            onClose={() => setShowSearch(false)}
            onSelectLesson={lessonId => {
              setExpandedLessonId(lessonId);
              const lesson = LESSONS.find(l => l.id === lessonId);
              if (lesson) {
                setActiveType(lesson.type);
              }
            }}
          />
        </Suspense>
      )}

      {showStats && (
        <Suspense fallback={null}>
          <StatsModal onClose={() => setShowStats(false)} />
        </Suspense>
      )}

      {showQuiz && (
        <Suspense fallback={null}>
          <QuizModal category={activeType} onClose={() => setShowQuiz(false)} />
        </Suspense>
      )}

      {showFlashcards && (
        <Suspense fallback={null}>
          <FlashcardModal category={activeType} onClose={() => setShowFlashcards(false)} />
        </Suspense>
      )}

      {showExam && (
        <Suspense fallback={null}>
          <ExamSimulation onClose={() => setShowExam(false)} />
        </Suspense>
      )}
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/agent" element={<AgentPage />} />
        <Route path="/*" element={view === 'landing' ? landingContent : appContent} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
