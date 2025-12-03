
import React, { useState, useMemo, Suspense, useCallback, useEffect } from 'react';
import { LESSONS } from './constants';
import { CourseType } from './types';
// MasterFile is lazy-loaded to reduce initial bundle size
import InfoPanels from './components/InfoPanels';
import Toast, { ToastMessage } from './components/Toast';
import { getLessonProgress, toggleLessonComplete, updateLessonAccess, getProgressByType, addStudyTime, getStudyStats } from './utils/progress';
import { isBookmarked, toggleBookmark, getLessonNote, saveLessonNote } from './utils/bookmarks';
import { searchLessons, saveRecentSearch } from './utils/search';
const PdfFiles = React.lazy(() => import('./components/PdfFiles'));
const SearchModal = React.lazy(() => import('./components/SearchModal'));
const StatsModal = React.lazy(() => import('./components/StatsModal'));
const QuizModal = React.lazy(() => import('./components/QuizModal'));
const FlashcardModal = React.lazy(() => import('./components/FlashcardModal'));
const ExamSimulation = React.lazy(() => import('./components/ExamSimulation'));

// Simple Skeleton for Accordion Content
const MasterFileSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
    <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="h-24 bg-gray-100 dark:bg-gray-800 rounded"></div>
      <div className="h-24 bg-gray-100 dark:bg-gray-800 rounded"></div>
    </div>
  </div>
);

// Lazy-load MasterFile to improve initial load performance
const MasterFile = React.lazy(() => import('./components/MasterFile'));

const App: React.FC = () => {
  const [activeType, setActiveType] = useState<CourseType>('GA2');
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    // Check system preference or localStorage
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
  const [searchQuery, setSearchQuery] = useState('');
  const [showStats, setShowStats] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [showExam, setShowExam] = useState(false);
  const [lessonStartTime, setLessonStartTime] = useState<Record<string, number>>({});
  const [progressRefresh, setProgressRefresh] = useState(0);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type, duration: 4000 }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Filter Lessons based on active tab
  const filteredLessons = useMemo(() => {
    return LESSONS.filter(l => l.type === activeType).sort((a, b) => a.order - b.order);
  }, [activeType]);

  const toggleLesson = (id: string) => {
    setExpandedLessonId(prev => (prev === id ? null : id));
  };

  // Toggle Dark Mode
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

  // Apply dark mode on mount
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Study timer: track time when lesson is expanded
  useEffect(() => {
    if (expandedLessonId) {
      updateLessonAccess(expandedLessonId);
      setLessonStartTime(prev => ({ ...prev, [expandedLessonId]: Date.now() }));
      
      const interval = setInterval(() => {
        const startTime = lessonStartTime[expandedLessonId];
        if (startTime) {
          const elapsed = Math.floor((Date.now() - startTime) / 1000);
          if (elapsed > 0 && elapsed % 30 === 0) {
            // Save every 30 seconds
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
  }, [expandedLessonId]);

  return (
    <div className={`h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200 flex flex-col`}>
       <Toast toasts={toasts} onRemove={removeToast} />
       
       {/* Header / Nav */}
       <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50 no-print shadow-sm flex-shrink-0">
         <div className="px-4 h-12 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold ${activeType === 'GA2' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                 F
               </div>
               <h1 className="text-lg md:text-xl font-bold tracking-tight">
                 FIAE <span className="text-gray-500 dark:text-gray-400">Lernplattform</span>
               </h1>
               
               {/* Course Type Tabs in Header */}
               <div className="hidden md:flex items-center gap-1 ml-4">
                 {(['GA2', 'WISO', 'PRUEF'] as CourseType[]).map((type) => {
                   const progress = getProgressByType(type, LESSONS.filter(l => l.type === type).length);
                   return (
                     <button
                       key={type}
                       onClick={() => { 
                         setActiveType(type); 
                         setExpandedLessonId(null); 
                         setShowPdfPage(false);
                       }}
                       className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                         activeType === type
                           ? (type === 'GA2' ? 'bg-blue-600 text-white shadow' : type === 'WISO' ? 'bg-emerald-600 text-white shadow' : 'bg-purple-600 text-white shadow')
                           : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                       }`}
                     >
                       <span className="flex items-center gap-1.5">
                         {type === 'PRUEF' ? 'Prüfung' : type}
                         {progress.percentage > 0 && (
                           <span className="text-xs opacity-75">({progress.percentage}%)</span>
                         )}
                       </span>
                     </button>
                   );
                 })}
               </div>
            </div>
            
            <div className="flex items-center gap-2">
               {/* Search Button */}
               <button
                onClick={() => setShowSearch(true)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                aria-label="Search"
                title="Suchen"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
              
               {/* Stats Button */}
               <button
                onClick={() => setShowStats(true)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                aria-label="Statistics"
                title="Statistik"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </button>
              
               {/* Quiz Button */}
               <button
                onClick={() => setShowQuiz(true)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                aria-label="Quiz"
                title="Quiz"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </button>
              
               {/* Flashcards Button */}
               <button
                onClick={() => setShowFlashcards(true)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                aria-label="Flashcards"
                title="Karteikarten"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </button>
              
               {/* Exam Simulation Button */}
               <button
                onClick={() => setShowExam(true)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                aria-label="Exam Simulation"
                title="Prüfungssimulation"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </button>
              
               {/* Dark Mode Toggle */}
               <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                )}
              </button>
              {/* PDF Files Page Toggle */}
              <button
                onClick={() => setShowPdfPage((v) => !v)}
                className="px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                title="PDF Files"
              >
                📄 PDF
              </button>
            </div>
         </div>
       </header>

       <main className="flex-1 overflow-y-auto">
         
         {/* Progress Bar */}
         {(() => {
           const progress = getProgressByType(activeType, filteredLessons.length);
           return progress.percentage > 0 ? (
             <div className="no-print bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
               <div className="px-4 py-2">
                 <div className="max-w-3xl mx-auto">
                   <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                     <span>Fortschritt: {progress.completed} von {filteredLessons.length}</span>
                     <span className="font-semibold">{progress.percentage}%</span>
                   </div>
                   <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                     <div 
                       className={`h-full transition-all duration-500 ${
                         activeType === 'GA2' ? 'bg-blue-600' : activeType === 'WISO' ? 'bg-emerald-600' : 'bg-purple-600'
                       }`}
                       style={{ width: `${progress.percentage}%` }}
                     />
                   </div>
                 </div>
               </div>
             </div>
           ) : null;
         })()}

         {showPdfPage ? (
           <div className="space-y-4">
             <Suspense fallback={<div className="p-6 text-center">Lade PDF-Liste…</div>}>
               <PdfFiles onBack={() => setShowPdfPage(false)} />
             </Suspense>
           </div>
         ) : (
           <>
             <InfoPanels type={activeType} />

             {/* Accordion List */}
             <div className="space-y-3 max-w-5xl mx-auto px-4">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">
               <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                 Lektionen ({filteredLessons.length})
               </h3>
            </div>

            {filteredLessons.map((lesson, index) => {
               const isActive = expandedLessonId === lesson.id;
               const isGA2 = lesson.type === 'GA2';
               const isWISO = lesson.type === 'WISO';
               const isPRUEF = lesson.type === 'PRUEF';
               const lessonProgress = getLessonProgress(lesson.id);
               const isCompleted = lessonProgress?.completed || false;
               const isBookmarkedLesson = isBookmarked(lesson.id);
               
               // Dynamic Styles based on type and state
               const activeBorderClass = isGA2
                 ? 'border-blue-500 ring-1 ring-blue-500 shadow-md'
                 : isWISO
                   ? 'border-emerald-500 ring-1 ring-emerald-500 shadow-md'
                   : 'border-purple-500 ring-1 ring-purple-500 shadow-md';
               
               const hoverClass = isGA2
                 ? 'hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md hover:-translate-y-0.5'
                 : isWISO
                   ? 'hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md hover:-translate-y-0.5'
                   : 'hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md hover:-translate-y-0.5';

               const bgClass = isActive 
                 ? 'bg-white dark:bg-gray-800' 
                 : 'bg-white dark:bg-gray-800';

               const badgeBg = isGA2 ? 'bg-blue-50 text-blue-700 border-blue-100' : isWISO ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-purple-50 text-purple-700 border-purple-100';
               const darkBadgeBg = isGA2 ? 'dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-900/50' : isWISO ? 'dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-900/50' : 'dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-900/50';

               const iconActiveBg = isGA2 ? 'bg-blue-600' : isWISO ? 'bg-emerald-600' : 'bg-purple-600';
               const iconHoverText = isGA2 ? 'group-hover:text-blue-600' : isWISO ? 'group-hover:text-emerald-600' : 'group-hover:text-purple-600';
               const iconHoverBg = isGA2 ? 'group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30' : isWISO ? 'group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/30' : 'group-hover:bg-purple-50 dark:group-hover:bg-purple-900/30';

               return (
                 <div 
                   key={lesson.id} 
                   className={`rounded-xl border transition-all duration-300 overflow-hidden group ${bgClass} ${isActive ? activeBorderClass : `border-gray-200 dark:border-gray-700 ${hoverClass}`}`}
                   style={{ animationDelay: `${index * 50}ms` }}
                 >
                   <div className="flex items-center">
                     <button 
                       onClick={() => toggleLesson(lesson.id)}
                       className="flex-1 text-left p-5 flex items-center justify-between focus:outline-none"
                     >
                       <div className="flex-1 pr-4">
                         <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide border ${badgeBg} ${darkBadgeBg}`}>
                            {lesson.type === 'PRUEF' ? 'Prüfung' : lesson.type}
                          </span>
                           <span className="text-xs text-gray-400 font-mono">#{lesson.order}</span>
                           <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                             {lesson.level}
                           </span>
                           {isCompleted && (
                             <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded flex items-center gap-1">
                               <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                               Abgeschlossen
                             </span>
                           )}
                           {isBookmarkedLesson && (
                             <span className="text-xs">⭐</span>
                           )}
                         </div>
                        <h3 className={`text-lg font-bold transition-colors ${isActive ? (isGA2 ? 'text-blue-600 dark:text-blue-400' : isWISO ? 'text-emerald-600 dark:text-emerald-400' : 'text-purple-600 dark:text-purple-400') : 'text-gray-900 dark:text-white'}`}>
                          {lesson.title}
                        </h3>
                         <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                           {lesson.subtitle}
                         </p>
                       </div>

                       <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 
                         ${isActive 
                           ? `${iconActiveBg} text-white shadow-sm rotate-180` 
                           : `bg-gray-100 dark:bg-gray-700 text-gray-400 ${iconHoverText} ${iconHoverBg}`
                         }`}>
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                         </svg>
                       </div>
                     </button>
                     
                     {/* Action Buttons */}
                     <div className="flex items-center gap-1 pr-3">
                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           toggleLessonComplete(lesson.id);
                           setProgressRefresh(prev => prev + 1);
                           addToast(isCompleted ? 'Als nicht abgeschlossen markiert' : 'Als abgeschlossen markiert ✓', 'success');
                         }}
                         className={`p-2 rounded-lg transition-colors ${isCompleted ? 'text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/30' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                         title={isCompleted ? 'Als nicht abgeschlossen markieren' : 'Als abgeschlossen markieren'}
                       >
                         <svg className="w-5 h-5" fill={isCompleted ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                         </svg>
                       </button>
                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           toggleBookmark(lesson.id);
                           setProgressRefresh(prev => prev + 1);
                           addToast(isBookmarkedLesson ? 'Lesezeichen entfernt' : 'Lesezeichen hinzugefügt 🔖', 'success');
                         }}
                         className={`p-2 rounded-lg transition-colors ${isBookmarkedLesson ? 'text-yellow-500 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-900/30' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                         title={isBookmarkedLesson ? 'Lesezeichen entfernen' : 'Lesezeichen hinzufügen'}
                       >
                         <svg className="w-5 h-5" fill={isBookmarkedLesson ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                         </svg>
                       </button>
                     </div>
                   </div>

                   {/* Content Area */}
                   {isActive && (
                     <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-black/20 p-4 md:p-6 animate-fade-in">
                       <Suspense fallback={<MasterFileSkeleton />}>
                         <MasterFile lesson={lesson} onToast={addToast} />
                       </Suspense>
                     </div>
                   )}
                 </div>
               );
            })}
             </div>
           </>
         )}
       </main>

       {/* Footer */}
       <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-2 mt-auto no-print">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-xs">
            © 2024 FIAE Lernplattform (GA2 & WISO) • Entwickelt für Fachinformatiker Anwendungsentwicklung.
          </p>
        </div>
      </footer>
      
      {/* Modals */}
      {showSearch && (
        <Suspense fallback={null}>
          <SearchModal
            lessons={LESSONS}
            onClose={() => setShowSearch(false)}
            onSelectLesson={(lessonId) => {
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
          <QuizModal
            category={activeType}
            onClose={() => setShowQuiz(false)}
          />
        </Suspense>
      )}
      
      {showFlashcards && (
        <Suspense fallback={null}>
          <FlashcardModal
            category={activeType}
            onClose={() => setShowFlashcards(false)}
          />
        </Suspense>
      )}
      
      {showExam && (
        <Suspense fallback={null}>
          <ExamSimulation onClose={() => setShowExam(false)} />
        </Suspense>
      )}
    </div>
  );
};

export default App;
