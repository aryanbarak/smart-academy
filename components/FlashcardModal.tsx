import React, { useState, useEffect } from 'react';
import { getDueFlashcards, recordReview, getFlashcardsByCategory, generateFlashcardsFromLesson, saveFlashcards, getAllFlashcards } from '../utils/flashcards';
import { CourseType } from '../types';
import { LESSONS } from '../constants';

interface FlashcardModalProps {
  category: CourseType;
  onClose: () => void;
}

const FlashcardModal: React.FC<FlashcardModalProps> = ({ category, onClose }) => {
  const [allCards, setAllCards] = useState(getFlashcardsByCategory(category));
  const [isGenerating, setIsGenerating] = useState(false);
  const dueCards = getDueFlashcards().filter(c => c.category === category);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  
  // Auto-generate flashcards if none exist
  useEffect(() => {
    if (allCards.length === 0 && !isGenerating) {
      generateCardsForCategory();
    }
  }, []);
  
  const generateCardsForCategory = () => {
    setIsGenerating(true);
    const categoryLessons = LESSONS.filter(l => l.type === category);
    const newCards: any[] = [];
    
    categoryLessons.forEach(lesson => {
      const cards = generateFlashcardsFromLesson(lesson.id, category, lesson.sections);
      newCards.push(...cards);
    });
    
    if (newCards.length > 0) {
      saveFlashcards(newCards);
      setAllCards(getFlashcardsByCategory(category));
    }
    setIsGenerating(false);
  };
  
  if (isGenerating) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Karteikarten werden erstellt...</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Generiere Karteikarten aus den Lektionen für {category}
          </p>
        </div>
      </div>
    );
  }
  
  if (allCards.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Keine Karteikarten verfügbar</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Möchtest du Karteikarten aus den Lektionen generieren?
          </p>
          <div className="flex gap-3">
            <button
              onClick={generateCardsForCategory}
              className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Jetzt generieren
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Schließen
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const cards = dueCards.length > 0 ? dueCards : allCards;
  const currentCard = cards[currentIndex];
  
  const handleRating = (quality: number) => {
    recordReview(currentCard.id, quality);
    setShowBack(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Karteikarten {category}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Karte {currentIndex + 1} von {cards.length} • {dueCards.length > 0 ? 'Fällig: ' + dueCards.length : 'Alle Karten'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Card */}
        <div className="p-8">
          <div 
            className="relative bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-8 min-h-[300px] flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
            onClick={() => setShowBack(!showBack)}
          >
            <div className="text-center">
              {!showBack ? (
                <>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Frage</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{currentCard.front}</h3>
                  {currentCard.frontFa && (
                    <p className="text-xl text-gray-700 dark:text-gray-300">{currentCard.frontFa}</p>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">Klicken zum Umdrehen</p>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Antwort</p>
                  <p className="text-lg text-gray-900 dark:text-white mb-4 whitespace-pre-wrap">{currentCard.back}</p>
                  {currentCard.backFa && (
                    <p className="text-base text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-right">{currentCard.backFa}</p>
                  )}
                </>
              )}
            </div>
            
            <div className="absolute top-4 right-4">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Rating */}
        {showBack && (
          <div className="px-8 pb-8">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-center">Wie gut kanntest du die Antwort?</p>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => handleRating(0)}
                className="px-4 py-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 font-medium text-sm transition-colors"
              >
                Keine Ahnung
              </button>
              <button
                onClick={() => handleRating(2)}
                className="px-4 py-3 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/50 font-medium text-sm transition-colors"
              >
                Schwer
              </button>
              <button
                onClick={() => handleRating(3)}
                className="px-4 py-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 font-medium text-sm transition-colors"
              >
                Gut
              </button>
              <button
                onClick={() => handleRating(5)}
                className="px-4 py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 font-medium text-sm transition-colors"
              >
                Einfach
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardModal;
