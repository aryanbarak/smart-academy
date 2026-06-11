import React from 'react';
import { getStudyStats, formatTime, getAllLessonProgress } from '../utils/progress';
import { getQuizStats } from '../utils/quiz';
import { getFlashcardStats } from '../utils/flashcards';
import WeakSpotsPanel from './WeakSpotsPanel';

interface StatsModalProps {
  onClose: () => void;
}

const StatsModal: React.FC<StatsModalProps> = ({ onClose }) => {
  const studyStats = getStudyStats();
  const quizStats = getQuizStats();
  const allProgress = getAllLessonProgress();
  const totalLessons = Object.keys(allProgress).length;
  const completedLessons = Object.values(allProgress).filter(p => p.completed).length;
  const completionRate = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  
  const ga2Stats = getFlashcardStats('GA2');
  const wisoStats = getFlashcardStats('WISO');
  const pruefStats = getFlashcardStats('PRUEF');
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Lernstatistik
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Lernzeit</h3>
              </div>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{formatTime(studyStats.totalTimeSpent)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Gesamte Lernzeit</p>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-600 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Abgeschlossen</h3>
              </div>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{completedLessons}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">von {totalLessons} Lektionen ({completionRate}%)</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Streak</h3>
              </div>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{studyStats.studyStreak}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Tage in Folge</p>
            </div>
          </div>
          
          {/* Quiz Stats */}
          <div className="bg-white dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Quiz-Leistung
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Quiz absolviert</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{quizStats.totalQuizzes}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Fragen beantwortet</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{quizStats.totalQuestions}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Erfolgsquote</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {quizStats.totalQuestions > 0 ? Math.round((quizStats.correctAnswers / quizStats.totalQuestions) * 100) : 0}%
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div className="text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">GA2</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {quizStats.byCategory.GA2.total > 0 ? Math.round((quizStats.byCategory.GA2.correct / quizStats.byCategory.GA2.total) * 100) : 0}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">WISO</p>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {quizStats.byCategory.WISO.total > 0 ? Math.round((quizStats.byCategory.WISO.correct / quizStats.byCategory.WISO.total) * 100) : 0}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">PRUEF</p>
                <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {quizStats.byCategory.PRUEF.total > 0 ? Math.round((quizStats.byCategory.PRUEF.correct / quizStats.byCategory.PRUEF.total) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
          
          {/* Flashcard Stats */}
          <div className="bg-white dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Karteikarten
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'GA2', stats: ga2Stats, color: 'blue' },
                { label: 'WISO', stats: wisoStats, color: 'emerald' },
                { label: 'PRUEF', stats: pruefStats, color: 'purple' }
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{item.label}</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Neu:</span>
                      <span className="font-semibold">{item.stats.new}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Lernen:</span>
                      <span className="font-semibold text-yellow-600 dark:text-yellow-400">{item.stats.learning}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Wiederholen:</span>
                      <span className="font-semibold text-orange-600 dark:text-orange-400">{item.stats.review}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Gemeistert:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">{item.stats.mastered}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KI Schwachstellenanalyse */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <WeakSpotsPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsModal;
