// Quiz generation and management

export interface QuizQuestion {
  id: string;
  question: string;
  questionFa?: string;
  options: string[];
  optionsFa?: string[];
  correctAnswer: number;
  explanation?: string;
  explanationFa?: string;
  category: 'GA2' | 'WISO' | 'PRUEF';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizAttempt {
  questionId: string;
  selectedAnswer: number;
  correct: boolean;
  timestamp: number;
}

export interface QuizSession {
  id: string;
  category: 'GA2' | 'WISO' | 'PRUEF';
  questions: QuizQuestion[];
  attempts: QuizAttempt[];
  startTime: number;
  endTime?: number;
  score: number;
}

const QUIZ_HISTORY_KEY = 'fiae_quiz_history';
const QUIZ_STATS_KEY = 'fiae_quiz_stats';

// Sample quiz questions
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // GA2 Questions
  {
    id: 'ga2-q1',
    question: 'Welche Zeitkomplexität hat BubbleSort im schlimmsten Fall?',
    questionFa: 'پیچیدگی زمانی BubbleSort در بدترین حالت چیست؟',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
    optionsFa: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
    correctAnswer: 2,
    explanation: 'BubbleSort hat eine quadratische Zeitkomplexität O(n²), da zwei verschachtelte Schleifen verwendet werden.',
    explanationFa: 'BubbleSort پیچیدگی زمانی O(n²) دارد چون از دو حلقه تو در تو استفاده می‌کند.',
    category: 'GA2',
    difficulty: 'easy'
  },
  {
    id: 'ga2-q2',
    question: 'Was ist der Hauptvorteil der binären Suche gegenüber der linearen Suche?',
    questionFa: 'مزیت اصلی جستجوی دودویی نسبت به جستجوی خطی چیست؟',
    options: [
      'Funktioniert bei unsortierten Arrays',
      'Benötigt weniger Speicher',
      'Hat eine bessere Zeitkomplexität O(log n)',
      'Ist einfacher zu implementieren'
    ],
    optionsFa: [
      'روی آرایه‌های نامرتب کار می‌کند',
      'حافظه کمتری نیاز دارد',
      'پیچیدگی زمانی بهتری دارد O(log n)',
      'پیاده‌سازی آسان‌تری دارد'
    ],
    correctAnswer: 2,
    explanation: 'Binäre Suche hat O(log n) Zeitkomplexität, während lineare Suche O(n) hat. Aber sie erfordert ein sortiertes Array.',
    explanationFa: 'جستجوی دودویی پیچیدگی O(log n) دارد در حالی که جستجوی خطی O(n) است. اما نیاز به آرایه مرتب دارد.',
    category: 'GA2',
    difficulty: 'medium'
  },
  {
    id: 'ga2-q3',
    question: 'In welcher Phase findet bei BubbleSort der Tausch statt?',
    questionFa: 'در کدام مرحله BubbleSort جابجایی انجام می‌شود؟',
    options: [
      'In der äußeren Schleife',
      'In der inneren Schleife',
      'Nach beiden Schleifen',
      'Vor dem Vergleich'
    ],
    optionsFa: [
      'در حلقه بیرونی',
      'در حلقه داخلی',
      'بعد از هر دو حلقه',
      'قبل از مقایسه'
    ],
    correctAnswer: 1,
    explanation: 'Der Tausch findet in der inneren Schleife statt, nachdem zwei benachbarte Elemente verglichen wurden.',
    explanationFa: 'جابجایی در حلقه داخلی بعد از مقایسه دو عنصر کنار هم انجام می‌شود.',
    category: 'GA2',
    difficulty: 'easy'
  },
  
  // WISO Questions
  {
    id: 'wiso-q1',
    question: 'Wie lange ist die gesetzliche Kündigungsfrist in der Probezeit?',
    questionFa: 'مدت اعلام قانونی اخراج در دوره آزمایشی چقدر است؟',
    options: ['1 Tag', '2 Wochen', '1 Monat', '3 Monate'],
    optionsFa: ['۱ روز', '۲ هفته', '۱ ماه', '۳ ماه'],
    correctAnswer: 1,
    explanation: 'Die Kündigungsfrist während der Probezeit beträgt 2 Wochen zum Monatsende oder zur Monatsmitte.',
    explanationFa: 'مدت اعلام اخراج در دوره آزمایشی ۲ هفته تا پایان یا وسط ماه است.',
    category: 'WISO',
    difficulty: 'easy'
  },
  {
    id: 'wiso-q2',
    question: 'Welche Sozialversicherung zahlt bei Arbeitslosigkeit?',
    questionFa: 'کدام بیمه اجتماعی در صورت بیکاری پرداخت می‌کند؟',
    options: [
      'Krankenversicherung',
      'Rentenversicherung',
      'Arbeitslosenversicherung',
      'Pflegeversicherung'
    ],
    optionsFa: [
      'بیمه بیماری',
      'بیمه بازنشستگی',
      'بیمه بیکاری',
      'بیمه مراقبت'
    ],
    correctAnswer: 2,
    explanation: 'Die Arbeitslosenversicherung zahlt Arbeitslosengeld bei Verlust des Arbeitsplatzes.',
    explanationFa: 'بیمه بیکاری در صورت از دست دادن شغل، کمک بیکاری پرداخت می‌کند.',
    category: 'WISO',
    difficulty: 'easy'
  },
  {
    id: 'wiso-q3',
    question: 'Was ist der Unterschied zwischen Brutto- und Nettolohn?',
    questionFa: 'تفاوت حقوق ناخالص و خالص چیست؟',
    options: [
      'Brutto ist nach Steuern, Netto vor Steuern',
      'Netto ist nach Abzug von Steuern und Sozialversicherung',
      'Beide sind gleich',
      'Brutto ist nur für Vollzeitkräfte'
    ],
    optionsFa: [
      'ناخالص بعد از مالیات، خالص قبل از مالیات',
      'خالص بعد از کسر مالیات و بیمه اجتماعی است',
      'هر دو یکسان هستند',
      'ناخالص فقط برای تمام وقت است'
    ],
    correctAnswer: 1,
    explanation: 'Nettolohn ist der Betrag, der nach Abzug von Steuern und Sozialversicherungsbeiträgen übrig bleibt.',
    explanationFa: 'حقوق خالص مبلغی است که بعد از کسر مالیات و بیمه اجتماعی باقی می‌ماند.',
    category: 'WISO',
    difficulty: 'medium'
  }
];

// Quiz session management
export function createQuizSession(category: 'GA2' | 'WISO' | 'PRUEF', questionCount: number = 5): QuizSession {
  const categoryQuestions = QUIZ_QUESTIONS.filter(q => q.category === category);
  // Fisher–Yates shuffle for uniform O(n) randomization
  const shuffled = [...categoryQuestions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const selectedQuestions = shuffled.slice(0, Math.min(questionCount, shuffled.length));
  
  return {
    id: `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    category,
    questions: selectedQuestions,
    attempts: [],
    startTime: Date.now(),
    score: 0
  };
}

export function submitAnswer(session: QuizSession, questionId: string, selectedAnswer: number): QuizSession {
  const question = session.questions.find(q => q.id === questionId);
  if (!question) return session;
  
  const correct = selectedAnswer === question.correctAnswer;
  
  const attempt: QuizAttempt = {
    questionId,
    selectedAnswer,
    correct,
    timestamp: Date.now()
  };
  
  session.attempts.push(attempt);
  session.score = session.attempts.filter(a => a.correct).length;
  
  return session;
}

export function completeQuizSession(session: QuizSession): QuizSession {
  session.endTime = Date.now();
  saveQuizHistory(session);
  updateQuizStats(session);
  return session;
}

function saveQuizHistory(session: QuizSession): void {
  try {
    const history = getQuizHistory();
    history.unshift(session);
    
    // Keep only last 50 sessions
    if (history.length > 50) {
      history.splice(50);
    }
    
    localStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save quiz history:', e);
  }
}

export function getQuizHistory(): QuizSession[] {
  try {
    const data = localStorage.getItem(QUIZ_HISTORY_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

interface QuizStats {
  totalQuizzes: number;
  totalQuestions: number;
  correctAnswers: number;
  byCategory: {
    GA2: { total: number; correct: number };
    WISO: { total: number; correct: number };
    PRUEF: { total: number; correct: number };
  };
}

function updateQuizStats(session: QuizSession): void {
  try {
    const stats = getQuizStats();
    
    stats.totalQuizzes += 1;
    stats.totalQuestions += session.attempts.length;
    stats.correctAnswers += session.score;
    
    stats.byCategory[session.category].total += session.attempts.length;
    stats.byCategory[session.category].correct += session.score;
    
    localStorage.setItem(QUIZ_STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to update quiz stats:', e);
  }
}

export function getQuizStats(): QuizStats {
  try {
    const data = localStorage.getItem(QUIZ_STATS_KEY);
    if (!data) {
      return {
        totalQuizzes: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        byCategory: {
          GA2: { total: 0, correct: 0 },
          WISO: { total: 0, correct: 0 },
          PRUEF: { total: 0, correct: 0 }
        }
      };
    }
    return JSON.parse(data);
  } catch {
    return {
      totalQuizzes: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      byCategory: {
        GA2: { total: 0, correct: 0 },
        WISO: { total: 0, correct: 0 },
        PRUEF: { total: 0, correct: 0 }
      }
    };
  }
}
