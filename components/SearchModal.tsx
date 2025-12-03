import React, { useState, useMemo } from 'react';
import { searchLessons, highlightText, saveRecentSearch, getRecentSearches } from '../utils/search';
import { Lesson } from '../types';

interface SearchModalProps {
  lessons: Lesson[];
  onClose: () => void;
  onSelectLesson: (lessonId: string) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ lessons, onClose, onSelectLesson }) => {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState<'de' | 'fa' | 'both'>('both');
  const recentSearches = getRecentSearches();
  
  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchLessons(query, lessons, language);
  }, [query, lessons, language]);
  
  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery);
    }
  };
  
  const handleSelectResult = (lessonId: string) => {
    onSelectLesson(lessonId);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full mt-20 mb-20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Durchsuchen
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
        
        {/* Search Input */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Suche nach Lektionen, Themen, Code..."
              className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-4 top-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* Language Filter */}
          <div className="flex gap-2 mt-3">
            {[
              { value: 'both', label: 'Beide' },
              { value: 'de', label: 'Deutsch' },
              { value: 'fa', label: 'فارسی' }
            ].map((lang) => (
              <button
                key={lang.value}
                onClick={() => setLanguage(lang.value as any)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  language === lang.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
          
          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Letzte Suchen:</p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((recent, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSearch(recent)}
                    className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {recent}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Results */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {query && results.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-medium">Keine Ergebnisse gefunden</p>
              <p className="text-sm mt-1">Versuche es mit anderen Suchbegriffen</p>
            </div>
          )}
          
          {!query && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-lg font-medium">Beginne mit der Suche</p>
              <p className="text-sm mt-1">Suche nach Algorithmen, Begriffen oder Code</p>
            </div>
          )}
          
          <div className="space-y-3">
            {results.map((result, idx) => {
              const { before, highlight, after } = highlightText(result.matchText, result.highlightStart, result.highlightEnd);
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectResult(result.lessonId)}
                  className="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {result.lessonTitle}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {result.matchType === 'title' ? 'Titel' : result.matchType === 'heading' ? 'Überschrift' : 'Inhalt'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                    {result.sectionHeading}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {before}
                    <mark className="bg-yellow-200 dark:bg-yellow-600 px-1 rounded">{highlight}</mark>
                    {after}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
