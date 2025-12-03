
import React, { useState, useMemo, Suspense, useCallback } from 'react';
import { LESSONS } from './constants';
import { CourseType } from './types';
// MasterFile is lazy-loaded to reduce initial bundle size
import InfoPanels from './components/InfoPanels';
import Toast, { ToastMessage } from './components/Toast';
const PdfFiles = React.lazy(() => import('./components/PdfFiles'));

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
  const [darkMode, setDarkMode] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [showPdfPage, setShowPdfPage] = useState(false);

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
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200 flex flex-col`}>
       <Toast toasts={toasts} onRemove={removeToast} />
       
       {/* Header / Nav */}
       <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 no-print shadow-sm">
         <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
               <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold ${activeType === 'GA2' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                 F
               </div>
               <h1 className="text-lg md:text-xl font-bold tracking-tight">
                 FIAE <span className="text-gray-500 dark:text-gray-400">Lernplattform</span>
               </h1>
            </div>
            
            <div className="flex items-center gap-4">
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
                PDF Files
              </button>
            </div>
         </div>
       </header>

       <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
         
         {/* Course Type Tabs */}
         <div className="flex justify-center mb-8 no-print">
            <div className="bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 inline-flex">
               {(['GA2', 'WISO', 'PRUEF'] as CourseType[]).map((type) => (
                 <button
                   key={type}
                   onClick={() => { setActiveType(type); setExpandedLessonId(null); }}
                   className={`px-6 md:px-8 py-2 rounded-lg text-sm font-semibold transition-all ${
                     activeType === type
                       ? (type === 'GA2' ? 'bg-blue-600 text-white shadow' : type === 'WISO' ? 'bg-emerald-600 text-white shadow' : 'bg-purple-600 text-white shadow')
                       : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                   }`}
                 >
                   {type === 'PRUEF' ? 'Prüfung' : type}
                 </button>
               ))}
            </div>
         </div>

         {/* Hero Header */}
         <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
              {activeType === 'GA2' ? 'Algorithmen & Entwicklung' : activeType === 'WISO' ? 'Wirtschaft & Soziales' : 'Prüfungssimulation'}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {activeType === 'GA2' 
                ? 'Meistern Sie Pseudocode, Struktogramme und komplexe Algorithmen für die Abschlussprüfung.'
                : activeType === 'WISO'
                  ? 'Alles Wichtige zu Arbeitsrecht, Betriebsrat, Verträgen und Sozialversicherungen.'
                  : 'Beispielprüfungen und typische Aufgaben aus IHK-Prüfungen (mit Erklärungen auf Deutsch und Persisch).'}
            </p>
         </div>

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
             <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
               <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                 Lektionen ({filteredLessons.length})
               </h3>
            </div>

            {filteredLessons.map((lesson, index) => {
               const isActive = expandedLessonId === lesson.id;
               const isGA2 = lesson.type === 'GA2';
               const isWISO = lesson.type === 'WISO';
               const isPRUEF = lesson.type === 'PRUEF';
               
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
                   <button 
                     onClick={() => toggleLesson(lesson.id)}
                     className="w-full text-left p-5 flex items-center justify-between focus:outline-none"
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
       <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8 mt-auto no-print">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
            © 2024 FIAE Lernplattform (GA2 & WISO)
          </p>
          <p className="text-xs text-gray-400">
            Entwickelt für Fachinformatiker Anwendungsentwicklung.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
