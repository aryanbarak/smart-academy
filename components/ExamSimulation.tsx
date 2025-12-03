import React, { useState, useEffect, useMemo } from 'react';
import { LESSONS } from '../constants';
import { CourseType } from '../types';

interface ExamQuestion {
  id: string;
  category: CourseType;
  lessonId: string;
  questionDe: string;
  questionFa: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  correctAnswer: 'a' | 'b' | 'c' | 'd';
  explanationDe: string;
  explanationFa: string;
  points: number;
}

// Function to generate questions from lesson content
const generateQuestionsFromLessons = (categories: CourseType[]): ExamQuestion[] => {
  const questions: ExamQuestion[] = [];
  let questionId = 1;

  LESSONS.filter(lesson => categories.includes(lesson.type)).forEach(lesson => {
    // Generate 2-3 questions per lesson from its sections
    lesson.sections.slice(0, 3).forEach((section, idx) => {
      if (section.contentDe.length > 100) {
        // Extract first sentence or main concept
        const sentences = section.contentDe.split(/[.!?]\s+/);
        const mainConcept = sentences[0] || section.headingDe;
        
        // Create a question based on the section content
        questions.push({
          id: `exam-${lesson.type.toLowerCase()}-${lesson.id}-${idx}`,
          category: lesson.type,
          lessonId: lesson.id,
          questionDe: `${section.headingDe}: ${mainConcept.substring(0, 150)}...?`,
          questionFa: `${section.headingFa}: ${section.contentFa.split(/[.!?؟]\s+/)[0] || section.headingFa}...؟`,
          options: {
            a: 'Richtig - Korrekt',
            b: 'Falsch - Fehlerhaft',
            c: 'Teilweise richtig',
            d: 'Nicht relevant'
          },
          correctAnswer: 'a',
          explanationDe: section.contentDe.substring(0, 200),
          explanationFa: section.contentFa.substring(0, 200),
          points: 2
        });
        questionId++;
      }
    });
  });

  return questions;
};

// Static base questions for better quality
const BASE_EXAM_QUESTIONS: ExamQuestion[] = [
  // GA2 Questions
  {
    id: 'exam-ga2-1',
    category: 'GA2',
    lessonId: 'base',
    questionDe: 'Was ist die Zeitkomplexität von BubbleSort im schlechtesten Fall?',
    questionFa: 'پیچیدگی زمانی بابل‌سورت در بدترین حالت چیست؟',
    options: {
      a: 'O(n)',
      b: 'O(n log n)',
      c: 'O(n²)',
      d: 'O(2ⁿ)'
    },
    correctAnswer: 'c',
    explanationDe: 'BubbleSort hat im schlechtesten Fall eine quadratische Zeitkomplexität O(n²), da zwei verschachtelte Schleifen verwendet werden.',
    explanationFa: 'بابل‌سورت در بدترین حالت پیچیدگی زمانی O(n²) دارد، زیرا از دو حلقه تو در تو استفاده می‌کند.',
    points: 2
  },
  {
    id: 'exam-ga2-2',
    category: 'GA2',
    lessonId: 'base',
    questionDe: 'Bei der binären Suche wird das Array in jedem Schritt...',
    questionFa: 'در جستجوی دودویی، آرایه در هر مرحله...',
    options: {
      a: 'komplett durchlaufen',
      b: 'in zwei Hälften geteilt',
      c: 'sortiert',
      d: 'umgekehrt'
    },
    correctAnswer: 'b',
    explanationDe: 'Die binäre Suche teilt das Array in jedem Schritt in zwei Hälften und sucht nur in der relevanten Hälfte weiter.',
    explanationFa: 'جستجوی دودویی آرایه را در هر مرحله به دو نیم تقسیم می‌کند و فقط در نیمه مرتبط جستجو می‌کند.',
    points: 2
  },
  {
    id: 'exam-ga2-3',
    category: 'GA2',
    lessonId: 'base',
    questionDe: 'Welche Datenstruktur arbeitet nach dem FIFO-Prinzip?',
    questionFa: 'کدام ساختار داده بر اساس اصل FIFO کار می‌کند؟',
    options: {
      a: 'Stack',
      b: 'Queue',
      c: 'Tree',
      d: 'HashMap'
    },
    correctAnswer: 'b',
    explanationDe: 'Eine Queue (Warteschlange) arbeitet nach dem FIFO-Prinzip (First In, First Out).',
    explanationFa: 'صف (Queue) بر اساس اصل FIFO (اولین ورودی، اولین خروجی) کار می‌کند.',
    points: 2
  },
  {
    id: 'exam-ga2-4',
    category: 'GA2',
    lessonId: 'base',
    questionDe: 'Was ist Rekursion?',
    questionFa: 'بازگشت (Recursion) چیست؟',
    options: {
      a: 'Eine Funktion, die sich selbst aufruft',
      b: 'Eine Schleife mit break',
      c: 'Ein Array-Algorithmus',
      d: 'Eine Sortiermethode'
    },
    correctAnswer: 'a',
    explanationDe: 'Rekursion bedeutet, dass eine Funktion sich selbst aufruft, um ein Problem in kleinere Teilprobleme zu zerlegen.',
    explanationFa: 'بازگشت به معنای فراخوانی یک تابع توسط خودش است تا مسئله را به زیرمسائل کوچکتر تقسیم کند.',
    points: 2
  },
  {
    id: 'exam-ga2-5',
    category: 'GA2',
    lessonId: 'base',
    questionDe: 'Welches Designpattern trennt die Objekterstellung von der Verwendung?',
    questionFa: 'کدام الگوی طراحی، ایجاد شیء را از استفاده جدا می‌کند؟',
    options: {
      a: 'Singleton',
      b: 'Factory',
      c: 'Observer',
      d: 'Strategy'
    },
    correctAnswer: 'b',
    explanationDe: 'Das Factory-Pattern trennt die Objekterstellung von der Verwendung und ermöglicht flexible Instanziierung.',
    explanationFa: 'الگوی Factory ایجاد شیء را از استفاده جدا می‌کند و امکان نمونه‌سازی انعطاف‌پذیر را فراهم می‌آورد.',
    points: 3
  },
  // WISO Questions
  {
    id: 'exam-wiso-1',
    category: 'WISO',
    lessonId: 'base',
    questionDe: 'Wie lang ist die gesetzliche Kündigungsfrist in der Probezeit?',
    questionFa: 'مدت زمان قانونی اخطار اخراج در دوره آزمایشی چقدر است؟',
    options: {
      a: '1 Woche',
      b: '2 Wochen',
      c: '4 Wochen',
      d: '6 Wochen'
    },
    correctAnswer: 'b',
    explanationDe: 'In der Probezeit beträgt die gesetzliche Kündigungsfrist 2 Wochen für beide Seiten.',
    explanationFa: 'در دوره آزمایشی، مدت زمان قانونی اخطار اخراج برای هر دو طرف ۲ هفته است.',
    points: 2
  },
  {
    id: 'exam-wiso-2',
    category: 'WISO',
    lessonId: 'base',
    questionDe: 'Wer zahlt die Arbeitslosenversicherung?',
    questionFa: 'چه کسی بیمه بیکاری را پرداخت می‌کند؟',
    options: {
      a: 'Nur der Arbeitgeber',
      b: 'Nur der Arbeitnehmer',
      c: 'Beide je zur Hälfte',
      d: 'Der Staat'
    },
    correctAnswer: 'c',
    explanationDe: 'Die Arbeitslosenversicherung wird je zur Hälfte vom Arbeitgeber und Arbeitnehmer getragen.',
    explanationFa: 'بیمه بیکاری به طور مساوی توسط کارفرما و کارمند پرداخت می‌شود.',
    points: 2
  },
  {
    id: 'exam-wiso-3',
    category: 'WISO',
    lessonId: 'base',
    questionDe: 'Was ist der Unterschied zwischen Brutto- und Nettogehalt?',
    questionFa: 'تفاوت بین حقوق ناخالص و خالص چیست؟',
    options: {
      a: 'Brutto ist nach Abzügen',
      b: 'Netto ist vor Abzügen',
      c: 'Brutto ist vor Abzügen, Netto nach Abzügen',
      d: 'Es gibt keinen Unterschied'
    },
    correctAnswer: 'c',
    explanationDe: 'Bruttogehalt ist das Gehalt vor Abzug von Steuern und Sozialversicherung, Nettogehalt ist das ausgezahlte Gehalt.',
    explanationFa: 'حقوق ناخالص قبل از کسر مالیات و بیمه اجتماعی است، حقوق خالص همان مبلغ پرداختی نهایی است.',
    points: 2
  },
  {
    id: 'exam-wiso-4',
    category: 'WISO',
    lessonId: 'base',
    questionDe: 'Was ist Tarifautonomie?',
    questionFa: 'خودمختاری تعرفه (Tarifautonomie) چیست؟',
    options: {
      a: 'Das Recht, Löhne staatlich festzulegen',
      b: 'Das Recht von Gewerkschaften und Arbeitgebern, Löhne selbst zu verhandeln',
      c: 'Die Pflicht zur Mindestlohnzahlung',
      d: 'Ein Gesetz zur Arbeitszeitregelung'
    },
    correctAnswer: 'b',
    explanationDe: 'Tarifautonomie ist das Recht von Gewerkschaften und Arbeitgeberverbänden, Löhne und Arbeitsbedingungen ohne staatliche Einmischung auszuhandeln.',
    explanationFa: 'خودمختاری تعرفه حق اتحادیه‌های کارگری و انجمن‌های کارفرمایی است تا دستمزدها و شرایط کاری را بدون دخالت دولت مذاکره کنند.',
    points: 3
  },
  {
    id: 'exam-wiso-5',
    category: 'WISO',
    lessonId: 'base',
    questionDe: 'Welche Versicherung deckt Schäden durch Fahrlässigkeit im Beruf?',
    questionFa: 'کدام بیمه خسارات ناشی از بی‌احتیاطی در کار را پوشش می‌دهد؟',
    options: {
      a: 'Krankenversicherung',
      b: 'Berufsunfähigkeitsversicherung',
      c: 'Betriebshaftpflichtversicherung',
      d: 'Rentenversicherung'
    },
    correctAnswer: 'c',
    explanationDe: 'Die Betriebshaftpflichtversicherung deckt Schäden, die durch berufliche Fahrlässigkeit entstehen.',
    explanationFa: 'بیمه مسئولیت شغلی خسارات ناشی از بی‌احتیاطی در کار را پوشش می‌دهد.',
    points: 3
  }
];

interface ExamSimulationProps {
  onClose: () => void;
}

const ExamSimulation: React.FC<ExamSimulationProps> = ({ onClose }) => {
  const [selectedCategories, setSelectedCategories] = useState<CourseType[]>(['GA2', 'WISO']);
  const [examStarted, setExamStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, 'a' | 'b' | 'c' | 'd'>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(90 * 60); // 90 minutes in seconds
  const [examQuestions, setExamQuestions] = useState<ExamQuestion[]>([]);
  const [language, setLanguage] = useState<'de' | 'fa'>('de');

  useEffect(() => {
    if (examStarted && timeRemaining > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [examStarted, timeRemaining, showResults]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startExam = () => {
    // Combine base questions with generated questions from lessons
    const baseQuestions = BASE_EXAM_QUESTIONS.filter(q => selectedCategories.includes(q.category));
    const generatedQuestions = generateQuestionsFromLessons(selectedCategories);
    
    // Mix both and shuffle
    const allQuestions = [...baseQuestions, ...generatedQuestions];
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);
    
    // Select random 15-20 questions
    const questionCount = Math.min(20, Math.max(15, shuffled.length));
    const selectedQuestions = shuffled.slice(0, questionCount);
    
    setExamQuestions(selectedQuestions);
    setExamStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setTimeRemaining(90 * 60);
  };

  const handleAnswerSelect = (answer: 'a' | 'b' | 'c' | 'd') => {
    const currentQuestion = examQuestions[currentQuestionIndex];
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmitExam = () => {
    setShowResults(true);
  };

  const calculateResults = () => {
    let totalPoints = 0;
    let earnedPoints = 0;
    let correctCount = 0;

    examQuestions.forEach(q => {
      totalPoints += q.points;
      if (selectedAnswers[q.id] === q.correctAnswer) {
        earnedPoints += q.points;
        correctCount++;
      }
    });

    const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const passed = percentage >= 50;

    return { totalPoints, earnedPoints, correctCount, percentage, passed };
  };

  const toggleCategory = (category: CourseType) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  if (!examStarted) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">IHK Prüfungssimulation</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">ℹ️ Prüfungsinformationen</h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Prüfungsdauer: 90 Minuten</li>
                <li>• Mindestpunktzahl zum Bestehen: 50%</li>
                <li>• Sie können zwischen den Fragen navigieren</li>
                <li>• Die Zeit läuft automatisch ab</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Prüfungsbereiche auswählen:</h3>
              <div className="space-y-2">
                {(['GA2', 'WISO'] as CourseType[]).map(cat => (
                  <label key={cat} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="w-5 h-5 rounded border-gray-300"
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{cat}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {BASE_EXAM_QUESTIONS.filter(q => q.category === cat).length + generateQuestionsFromLessons([cat]).length} Fragen verfügbar
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {selectedCategories.length === 0 && (
              <div className="text-center text-red-600 dark:text-red-400 text-sm">
                Bitte wählen Sie mindestens einen Prüfungsbereich aus
              </div>
            )}

            <button
              onClick={startExam}
              disabled={selectedCategories.length === 0}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                selectedCategories.length > 0
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Prüfung starten
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const results = calculateResults();
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Prüfungsergebnis</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className={`p-6 rounded-xl text-center ${
              results.passed 
                ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500' 
                : 'bg-red-50 dark:bg-red-900/20 border-2 border-red-500'
            }`}>
              <div className="text-6xl mb-4">{results.passed ? '✅' : '❌'}</div>
              <h3 className={`text-3xl font-bold mb-2 ${
                results.passed ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
              }`}>
                {results.passed ? 'Bestanden!' : 'Nicht bestanden'}
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                {results.percentage}% ({results.earnedPoints} von {results.totalPoints} Punkten)
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{examQuestions.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Fragen</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">{results.correctCount}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Richtig</div>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-2xl font-bold text-red-700 dark:text-red-300">{examQuestions.length - results.correctCount}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Falsch</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Detaillierte Auswertung:</h3>
              <div className="flex items-center justify-end mb-2">
                <button
                  onClick={() => setLanguage(language === 'de' ? 'fa' : 'de')}
                  className="text-sm px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {language === 'de' ? '🇩🇪 Deutsch' : '🇮🇷 فارسی'}
                </button>
              </div>
              {examQuestions.map((q, idx) => {
                const isCorrect = selectedAnswers[q.id] === q.correctAnswer;
                const wasAnswered = selectedAnswers[q.id] !== undefined;
                return (
                  <div key={q.id} className={`p-4 rounded-lg border-2 ${
                    isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/10' :
                    wasAnswered ? 'border-red-500 bg-red-50 dark:bg-red-900/10' :
                    'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10'
                  }`}>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{isCorrect ? '✅' : wasAnswered ? '❌' : '⚠️'}</span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white mb-2">
                          {idx + 1}. {language === 'de' ? q.questionDe : q.questionFa} ({q.points} Punkte)
                        </p>
                        {wasAnswered && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Ihre Antwort: <span className="font-semibold">{selectedAnswers[q.id]?.toUpperCase()}</span>
                          </p>
                        )}
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Richtige Antwort: <span className="font-semibold">{q.correctAnswer.toUpperCase()}</span>
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                          💡 {language === 'de' ? q.explanationDe : q.explanationFa}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setExamStarted(false);
                  setShowResults(false);
                }}
                className="flex-1 py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700"
              >
                Neue Prüfung starten
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-lg font-semibold border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = examQuestions[currentQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={(e) => e.stopPropagation()}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header with Timer */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold">IHK Prüfung</h2>
            <p className="text-sm opacity-90">Frage {currentQuestionIndex + 1} von {examQuestions.length}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className={`text-2xl font-mono font-bold ${timeRemaining < 600 ? 'text-red-300 animate-pulse' : ''}`}>
                ⏱️ {formatTime(timeRemaining)}
              </div>
              <div className="text-sm opacity-90">
                {answeredCount} von {examQuestions.length} beantwortet
              </div>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Möchten Sie die Prüfung wirklich abbrechen? Ihr Fortschritt geht verloren.')) {
                  onClose();
                }
              }}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Prüfung abbrechen"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Question Content */}
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                currentQuestion.category === 'GA2' 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
              }`}>
                {currentQuestion.category}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {currentQuestion.points} Punkt{currentQuestion.points > 1 ? 'e' : ''}
              </span>
            </div>
            <button
              onClick={() => setLanguage(language === 'de' ? 'fa' : 'de')}
              className="text-sm px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {language === 'de' ? '🇩🇪 Deutsch' : '🇮🇷 فارسی'}
            </button>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {language === 'de' ? currentQuestion.questionDe : currentQuestion.questionFa}
            </h3>

            <div className="space-y-3">
              {(['a', 'b', 'c', 'd'] as const).map(option => (
                <button
                  key={option}
                  onClick={() => handleAnswerSelect(option)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedAnswers[currentQuestion.id] === option
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {option.toUpperCase()})
                  </span>{' '}
                  <span className="text-gray-700 dark:text-gray-300">
                    {currentQuestion.options[option]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Question Navigation Grid */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Fragennavi­gation:</h4>
            <div className="grid grid-cols-10 gap-2">
              {examQuestions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => goToQuestion(idx)}
                  className={`aspect-square rounded-lg text-sm font-semibold transition-all ${
                    idx === currentQuestionIndex
                      ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                      : selectedAnswers[q.id]
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 rounded-lg font-semibold border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Zurück
            </button>
            {currentQuestionIndex < examQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(examQuestions.length - 1, prev + 1))}
                className="flex-1 px-4 py-2 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700"
              >
                Weiter →
              </button>
            ) : (
              <button
                onClick={handleSubmitExam}
                className="flex-1 px-4 py-2 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700"
              >
                Prüfung abgeben
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamSimulation;
