import React, {
  useState,
  useMemo,
  Suspense,
  useCallback,
  useEffect,
} from 'react';

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useLanguage, LangToggle } from './src/contexts/LanguageContext';

import { LESSONS } from './constants';
import { CourseType } from './types';
import Toast, { ToastMessage } from './components/Toast';
import {
  getLessonProgress,
  toggleLessonComplete,
  updateLessonAccess,
  getProgressByType,
  addStudyTime,
  getStudyStats,
  getAllLessonProgress,
} from './utils/progress';
import { isBookmarked, toggleBookmark } from './utils/bookmarks';
import { getErrorBankCount } from './utils/errorBank';
import LandingPage from './components/LandingPage';
import AgentPage from './components/AgentPage';
import PrivacyPage from './src/pages/PrivacyPage';
import ExamCountdown from './components/ExamCountdown';
import MobileBottomNav from './components/MobileBottomNav';
import { logEnvConfig } from './src/debug/envDebug';
import { testSupabaseConnection } from './src/lib/supabaseDebug';

const PdfFiles = React.lazy(() => import('./components/PdfFiles'));
const SearchModal = React.lazy(() => import('./components/SearchModal'));
const StatsModal = React.lazy(() => import('./components/StatsModal'));
const QuizModal = React.lazy(() => import('./components/QuizModal'));
const FlashcardModal = React.lazy(() => import('./components/FlashcardModal'));
const ExamSimulation = React.lazy(() => import('./components/ExamSimulation'));
const MasterFile = React.lazy(() => import('./components/MasterFile'));
const LessonCard = React.lazy(() => import('./components/LessonCard'));
const ErrorBankModal = React.lazy(() => import('./components/ErrorBankModal'));

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

// Helper: last accessed lesson across all types
function getLastAccessedLesson() {
  const all = getAllLessonProgress();
  const entries = Object.entries(all).filter(([, p]) => p.lastAccessed > 0);
  if (entries.length === 0) return null;
  entries.sort((a, b) => b[1].lastAccessed - a[1].lastAccessed);
  const [lessonId, progress] = entries[0];
  const lesson = LESSONS.find(l => l.id === lessonId);
  if (!lesson) return null;
  return { lesson, progress };
}

// Helper: flashcards due today
function getDueFlashcardCount(): number {
  try {
    const reviews = JSON.parse(localStorage.getItem('fiae_flashcard_reviews') || '{}');
    const now = Date.now();
    return Object.values(reviews).filter((r: unknown) => {
      const rev = r as { nextReview?: number };
      return !rev.nextReview || rev.nextReview <= now;
    }).length;
  } catch { return 0; }
}

const App: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [activeType, setActiveType] = useState<CourseType>('GA2');
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);
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
  const [showErrorBank, setShowErrorBank] = useState(false);
  const [lessonStartTime, setLessonStartTime] = useState<Record<string, number>>({});
  const [progressRefresh, setProgressRefresh] = useState(0);

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
    document.documentElement.classList.toggle('dark', newMode);
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    logEnvConfig();
    testSupabaseConnection();
  }, []);

  useEffect(() => {
    if (view === 'app' && typeof window !== 'undefined') {
      const target = localStorage.getItem('landingTarget') as CourseType | null;
      if (target === 'GA2' || target === 'WISO' || target === 'PRUEF') {
        setActiveType(target);
      }
    }
  }, [view]);

  useEffect(() => {
    if (expandedLessonId) {
      updateLessonAccess(expandedLessonId);
      setLessonStartTime(prev => ({ ...prev, [expandedLessonId]: Date.now() }));
      const interval = setInterval(() => {
        const startTime = lessonStartTime[expandedLessonId];
        if (startTime) {
          const elapsed = Math.floor((Date.now() - startTime) / 1000);
          if (elapsed > 0 && elapsed % 30 === 0) addStudyTime(expandedLessonId, 30);
        }
      }, 1000);
      return () => {
        clearInterval(interval);
        const startTime = lessonStartTime[expandedLessonId];
        if (startTime) {
          const elapsed = Math.floor((Date.now() - startTime) / 1000);
          if (elapsed > 0) addStudyTime(expandedLessonId, elapsed);
        }
      };
    }
  }, [expandedLessonId, lessonStartTime]);

  // Derived dashboard data
  const stats = getStudyStats();
  const lastAccessed = getLastAccessedLesson();
  const dueFlashcards = getDueFlashcardCount();
  const errorBankCount = getErrorBankCount();

  const expandedLesson = expandedLessonId ? LESSONS.find(l => l.id === expandedLessonId) : null;

  const landingContent = (
    <LandingPage
      onStart={() => setView('app')}
      darkMode={darkMode}
      onToggleDarkMode={toggleDarkMode}
    />
  );

  const appContent = (
    <div className="h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col has-bottom-nav md:pb-0">
      <Toast toasts={toasts} onRemove={removeToast} />

      {/* ===== HEADER ===== */}
      <header className="bg-slate-900/95 backdrop-blur border-b border-slate-800 no-print flex-shrink-0 safe-top">
        <div className="max-w-6xl mx-auto w-full px-4 h-14 flex items-center justify-between">
          {/* Left: Logo + Tabs */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setView('landing')}
              title={t.toHome}
              className="w-12 h-12 rounded-xl overflow-hidden hover:opacity-80 transition-opacity shadow-sm flex-shrink-0"
            >
              <img src="/smart-academy-48.png" alt="Smart Academy" className="w-full h-full object-cover" />
            </button>

            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-semibold text-slate-50 tracking-tight">{t.platformName}</span>
              <span className="text-[11px] text-slate-400">{t.platformSub}</span>
            </div>

            {/* Home button */}
            <button
              type="button"
              onClick={() => setView('landing')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700/80 transition-colors border border-slate-700 hover:border-slate-500"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {t.home}
            </button>

            {/* Course tabs */}
            <div className="hidden md:flex items-center gap-1 ml-2 rounded-full bg-slate-800/80 px-1 py-0.5">
              {(['GA2', 'WISO', 'PRUEF'] as CourseType[]).map(type => {
                const progress = getProgressByType(type, LESSONS.filter(l => l.type === type).length);
                const isActive = activeType === type;
                const activeClasses =
                  type === 'GA2' ? 'bg-blue-500 text-white shadow-sm shadow-blue-500/40'
                  : type === 'WISO' ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/40'
                  : 'bg-purple-500 text-white shadow-sm shadow-purple-500/40';
                const tabLabel = type === 'GA2' ? t.tabGA2 : type === 'WISO' ? t.tabWISO : t.tabPRUEF;
                return (
                  <button key={type}
                    onClick={() => { setActiveType(type); setExpandedLessonId(null); setShowPdfPage(false); }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${isActive ? activeClasses : 'text-slate-200/80 hover:text-slate-50 hover:bg-slate-700/80'}`}>
                    {tabLabel}
                    {progress.percentage > 0 && <span className="ml-1 text-[10px] opacity-75">{progress.percentage}%</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5 rounded-full bg-slate-800/80 px-1 py-0.5">
              <button onClick={() => setShowSearch(true)} className="p-1.5 rounded-full text-slate-300 hover:bg-slate-700 hover:text-white transition-colors" title={t.search}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
              <button onClick={() => setShowStats(true)} className="p-1.5 rounded-full text-slate-300 hover:bg-slate-700 hover:text-white transition-colors" title={t.stats}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2z" /></svg>
              </button>
              <button onClick={() => setShowQuiz(true)} className="p-1.5 rounded-full text-slate-300 hover:bg-slate-700 hover:text-white transition-colors" title={t.quiz}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </button>
              <button onClick={() => setShowFlashcards(true)} className="p-1.5 rounded-full text-slate-300 hover:bg-slate-700 hover:text-white transition-colors" title={t.flashcards}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </button>
              <button onClick={() => setShowExam(true)} className="p-1.5 rounded-full text-slate-300 hover:bg-slate-700 hover:text-white transition-colors" title={t.examSim}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </button>
              <button onClick={() => setShowErrorBank(true)}
                className="relative p-1.5 rounded-full text-slate-300 hover:bg-slate-700 hover:text-white transition-colors" title={t.errorBank}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                {errorBankCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center">
                    {errorBankCount > 9 ? '9+' : errorBankCount}
                  </span>
                )}
              </button>
              <button type="button" onClick={() => setShowPdfPage(v => !v)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${showPdfPage ? 'bg-slate-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`} title={t.pdf}>
                {t.pdf}
              </button>
            </div>

            <Link to="/agent" className="hidden sm:inline-flex px-3 py-1.5 rounded-full text-xs font-semibold border border-blue-500/40 text-blue-400 hover:bg-blue-500/10 transition-colors">
              AI
            </Link>

            {/* Language toggle */}
            <LangToggle />

            {/* Dark Mode */}
            <button onClick={toggleDarkMode} className="p-1.5 rounded-full text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors">
              {darkMode ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>
          </div>
        </div>

        {/* Breadcrumb */}
        {expandedLesson && (
          <div className="max-w-6xl mx-auto px-4 pb-2 flex items-center gap-1.5 text-xs text-slate-400">
            <button onClick={() => setExpandedLessonId(null)} className="hover:text-slate-200 transition-colors">{activeType}</button>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-slate-200 truncate max-w-[240px]">{expandedLesson.title}</span>
          </div>
        )}
      </header>

      {/* Progress bar */}
      <main className="flex-1 overflow-y-auto">
        {(() => {
          const progress = getProgressByType(activeType, filteredLessons.length);
          return progress.percentage > 0 ? (
            <div className="no-print bg-slate-900/5 dark:bg-slate-900/40 border-b border-slate-200/70 dark:border-slate-800 sticky top-0 z-40">
              <div className="px-4 py-2 max-w-6xl mx-auto">
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 mb-1.5">
                  <span>{t.progressBar(progress.completed, filteredLessons.length)}</span>
                  <span className="font-semibold">{progress.percentage}%</span>
                </div>
                <div className="relative h-2 bg-slate-200/70 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-500 ${activeType === 'GA2' ? 'bg-blue-600' : activeType === 'WISO' ? 'bg-emerald-600' : 'bg-purple-600'}`}
                    style={{ width: `${progress.percentage}%` }} />
                </div>
              </div>
            </div>
          ) : null;
        })()}

        {showPdfPage ? (
          <div className="max-w-6xl mx-auto px-4 py-6">
            <Suspense fallback={<div className="p-6 text-center text-sm">Lade PDF-Liste...</div>}>
              <PdfFiles onBack={() => setShowPdfPage(false)} />
            </Suspense>
          </div>
        ) : (
          <>
            {/* ===== DASHBOARD WIDGET BAR ===== */}
            <div className="max-w-6xl mx-auto px-4 pt-6 md:pt-4 pb-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">

                {/* Continue last lesson */}
                {lastAccessed ? (
                  <button
                    onClick={() => {
                      setActiveType(lastAccessed.lesson.type);
                      setExpandedLessonId(lastAccessed.lesson.id);
                    }}
                    className="flex items-center gap-3 p-3.5 rounded-xl border border-transparent bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 hover:shadow-md transition-all text-left group"
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0 bg-white/20">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-white/70 uppercase tracking-wide">{t.continueLearning}</p>
                      <p className="text-sm font-semibold text-white truncate transition-colors">
                        {lastAccessed.lesson.title}
                      </p>
                      <p className="text-[10px] text-white/70">{lastAccessed.lesson.type} · #{lastAccessed.lesson.order}</p>
                    </div>
                    <svg className="w-4 h-4 text-white/70 group-hover:text-white transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <div className="flex items-center gap-3 p-3.5 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500">{t.noLastLesson}</p>
                    </div>
                  </div>
                )}

                {/* Flashcards due + Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setShowFlashcards(true)}
                    className="flex flex-col items-start p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-amber-400 hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">🃏</span>
                      <span className={`text-xs font-bold ${dueFlashcards > 0 ? 'text-amber-500' : 'text-slate-400'}`}>
                        {dueFlashcards > 0 ? dueFlashcards : '—'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500">{t.dueToday}</p>
                  </button>

                  <button onClick={() => setShowStats(true)}
                    className="flex flex-col items-start p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-emerald-400 hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">🔥</span>
                      <span className={`text-xs font-bold ${stats.studyStreak > 0 ? 'text-orange-500' : 'text-slate-400'}`}>
                        {stats.studyStreak > 0 ? `${stats.studyStreak}d` : '—'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500">{t.streak}</p>
                  </button>
                </div>

                {/* Exam countdown compact */}
                <ExamCountdown compact />
              </div>
            </div>


            {/* Lesson list */}
            <div className="max-w-6xl mx-auto px-4 pb-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <h3 className="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-50">
                  {t.lessonsCount(filteredLessons.length)}
                </h3>
                {errorBankCount > 0 && (
                  <button onClick={() => setShowErrorBank(true)}
                    className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 dark:hover:text-red-300 transition-colors">
                    <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {errorBankCount > 9 ? '9+' : errorBankCount}
                    </span>
                    Fehlerbank öffnen
                    <span className="font-farsi text-slate-400" dir="rtl">· بانک اشتباهات</span>
                  </button>
                )}
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
                        timeSpent={lessonProgress?.timeSpent}
                        lastAccessed={lessonProgress?.lastAccessed}
                        onToggle={() => toggleLesson(lesson.id)}
                        onToggleComplete={() => {
                          toggleLessonComplete(lesson.id);
                          setProgressRefresh(prev => prev + 1);
                          addToast(isCompleted ? 'Als nicht abgeschlossen markiert' : 'Als abgeschlossen markiert ✓', 'success');
                        }}
                        onToggleBookmark={() => {
                          toggleBookmark(lesson.id);
                          setProgressRefresh(prev => prev + 1);
                          addToast(isBookmarkedLesson ? 'Lesezeichen entfernt' : 'Lesezeichen gesetzt 🔖', 'success');
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

      <footer className="hidden md:block bg-slate-950 text-slate-400 border-t border-slate-800 py-2 mt-auto no-print">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-[11px]">
            {t.footer} · <Link to="/privacy" className="text-slate-400 hover:text-slate-200 underline">Datenschutz</Link>
          </p>
        </div>
      </footer>

      {/* Mobile bottom navigation */}
      <MobileBottomNav
        view="dashboard"
        activeType={activeType}
        onGoHome={() => setView('landing')}
        onSelectType={type => { setActiveType(type); setExpandedLessonId(null); setShowPdfPage(false); }}
      />

      {/* ===== MODALS ===== */}
      <Suspense fallback={null}>
        {showSearch && <SearchModal lessons={LESSONS} onClose={() => setShowSearch(false)} onSelectLesson={lessonId => { setExpandedLessonId(lessonId); const lesson = LESSONS.find(l => l.id === lessonId); if (lesson) setActiveType(lesson.type); }} />}
        {showStats && <StatsModal onClose={() => setShowStats(false)} />}
        {showQuiz && <QuizModal category={activeType} onClose={() => { setShowQuiz(false); setProgressRefresh(p => p + 1); }} />}
        {showFlashcards && <FlashcardModal category={activeType} onClose={() => setShowFlashcards(false)} />}
        {showExam && <ExamSimulation onClose={() => setShowExam(false)} />}
        {showErrorBank && <ErrorBankModal onClose={() => { setShowErrorBank(false); setProgressRefresh(p => p + 1); }} />}
      </Suspense>
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/agent" element={<AgentPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/*" element={view === 'landing' ? landingContent : appContent} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
