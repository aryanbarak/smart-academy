import React, { useState } from 'react';
import { createQuizSession, submitAnswer, completeQuizSession, QuizSession, QUIZ_QUESTIONS } from '../utils/quiz';
import { CourseType } from '../types';

interface QuizModalProps {
  category: CourseType;
  onClose: () => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ category, onClose }) => {
  const [session, setSession] = useState<QuizSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showFinalResults, setShowFinalResults] = useState(false);
  
  const availableQuestions = QUIZ_QUESTIONS.filter(q => q.category === category);
  
  const startQuiz = (count: number) => {
    const newSession = createQuizSession(category, count);
    setSession(newSession);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowFinalResults(false);
  };
  
  const handleAnswer = () => {
    if (session && selectedAnswer !== null) {
      const updatedSession = submitAnswer(session, session.questions[currentQuestionIndex].id, selectedAnswer);
      setSession(updatedSession);
      setShowResult(true);
    }
  };
  
  const nextQuestion = () => {
    if (session && currentQuestionIndex < session.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else if (session) {
      const completed = completeQuizSession(session);
      setSession(completed);
      setShowFinalResults(true);
    }
  };
  
  if (!session) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Quiz starten</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Verfügbare Fragen für {category}: {availableQuestions.length}
          </p>
          
          {availableQuestions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-4">Keine Fragen für diese Kategorie verfügbar.</p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Schließen
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {[3, 5, 10].filter(n => n <= availableQuestions.length).map((count) => (
                <button
                  key={count}
                  onClick={() => startQuiz(count)}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                >
                  {count} Fragen
                </button>
              ))}
              <button
                onClick={onClose}
                className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Abbrechen
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  if (showFinalResults) {
    const percentage = Math.round((session.score / session.questions.length) * 100);
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
            percentage >= 80 ? 'bg-green-100 dark:bg-green-900/30' :
            percentage >= 60 ? 'bg-yellow-100 dark:bg-yellow-900/30' :
            'bg-red-100 dark:bg-red-900/30'
          }`}>
            <span className={`text-4xl font-bold ${
              percentage >= 80 ? 'text-green-600 dark:text-green-400' :
              percentage >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
              'text-red-600 dark:text-red-400'
            }`}>
              {percentage}%
            </span>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Quiz abgeschlossen!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Du hast {session.score} von {session.questions.length} Fragen richtig beantwortet.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={() => startQuiz(session.questions.length)}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Nochmal
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Schließen
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const question = session.questions[currentQuestionIndex];
  const attempt = session.attempts.find(a => a.questionId === question.id);
  const isCorrect = attempt?.correct;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-8">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Frage {currentQuestionIndex + 1} von {session.questions.length}</span>
            <span>Score: {session.score}/{currentQuestionIndex}</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / session.questions.length) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Question */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{question.question}</h3>
          {question.questionFa && (
            <p className="text-lg text-gray-600 dark:text-gray-400 text-right">{question.questionFa}</p>
          )}
        </div>
        
        {/* Options */}
        <div className="space-y-3 mb-6">
          {question.options.map((option, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrectOption = idx === question.correctAnswer;
            const showCorrectness = showResult;
            
            return (
              <button
                key={idx}
                onClick={() => !showResult && setSelectedAnswer(idx)}
                disabled={showResult}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  showCorrectness && isCorrectOption
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                    : showCorrectness && isSelected && !isCorrect
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/30'
                    : isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center font-semibold text-sm">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{option}</p>
                    {question.optionsFa && question.optionsFa[idx] && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-right">{question.optionsFa[idx]}</p>
                    )}
                  </div>
                  {showCorrectness && isCorrectOption && (
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        
        {/* Explanation */}
        {showResult && question.explanation && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">Erklärung:</p>
            <p className="text-sm text-blue-800 dark:text-blue-200">{question.explanation}</p>
            {question.explanationFa && (
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-2 text-right">{question.explanationFa}</p>
            )}
          </div>
        )}
        
        {/* Actions */}
        <div className="flex gap-3">
          {!showResult ? (
            <>
              <button
                onClick={handleAnswer}
                disabled={selectedAnswer === null}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                Antworten
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Abbrechen
              </button>
            </>
          ) : (
            <button
              onClick={nextQuestion}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              {currentQuestionIndex < session.questions.length - 1 ? 'Nächste Frage' : 'Ergebnis anzeigen'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
