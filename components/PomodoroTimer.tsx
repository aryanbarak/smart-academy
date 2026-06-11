import React, { useState, useEffect, useRef, useCallback } from 'react';

type Phase = 'work' | 'break';

interface Session {
  lessonTitle: string;
  completedPomodoros: number;
  totalWorkSeconds: number;
}

const WORK_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;
const LONG_BREAK_DURATION = 15 * 60;
const LONG_BREAK_AFTER = 4;

interface Props {
  lessonTitle?: string;
  onSessionComplete?: (workSeconds: number) => void;
}

const PomodoroTimer: React.FC<Props> = ({ lessonTitle = 'Aktive Lektion', onSessionComplete }) => {
  const [phase, setPhase] = useState<Phase>('work');
  const [secondsLeft, setSecondsLeft] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const workStartRef = useRef<number>(0);

  const totalDuration = phase === 'work'
    ? WORK_DURATION
    : pomodoroCount > 0 && pomodoroCount % LONG_BREAK_AFTER === 0
    ? LONG_BREAK_DURATION
    : BREAK_DURATION;

  const progressPct = Math.round(((totalDuration - secondsLeft) / totalDuration) * 100);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const completePhase = useCallback(() => {
    if (phase === 'work') {
      const worked = WORK_DURATION;
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);
      setSessions(prev => {
        const existing = prev.find(s => s.lessonTitle === lessonTitle);
        if (existing) {
          return prev.map(s =>
            s.lessonTitle === lessonTitle
              ? { ...s, completedPomodoros: s.completedPomodoros + 1, totalWorkSeconds: s.totalWorkSeconds + worked }
              : s
          );
        }
        return [...prev, { lessonTitle, completedPomodoros: 1, totalWorkSeconds: worked }];
      });
      onSessionComplete?.(worked);
      setPhase('break');
      const isLongBreak = newCount % LONG_BREAK_AFTER === 0;
      setSecondsLeft(isLongBreak ? LONG_BREAK_DURATION : BREAK_DURATION);
      setIsRunning(false);
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🍅 Pomodoro abgeschlossen!', {
          body: isLongBreak ? `${newCount} Pomodoros — lange Pause (15 Min)` : 'Kurze Pause (5 Min) verdient!',
          icon: '/icon-192.png',
        });
      }
    } else {
      setPhase('work');
      setSecondsLeft(WORK_DURATION);
      setIsRunning(false);
    }
  }, [phase, pomodoroCount, lessonTitle, onSessionComplete]);

  useEffect(() => {
    if (isRunning) {
      if (phase === 'work') workStartRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            completePhase();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, completePhase, phase]);

  const handleStart = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setPhase('work');
    setSecondsLeft(WORK_DURATION);
  };

  const handleSkip = () => {
    setIsRunning(false);
    completePhase();
  };

  const circleR = 36;
  const circleCirc = 2 * Math.PI * circleR;
  const strokeDash = circleCirc - (progressPct / 100) * circleCirc;

  const phaseColor = phase === 'work' ? 'text-red-500' : 'text-emerald-500';
  const phaseLabel = phase === 'work' ? 'Arbeitszeit' : pomodoroCount % LONG_BREAK_AFTER === 0 ? 'Lange Pause' : 'Kurze Pause';
  const phaseLabelFa = phase === 'work' ? 'زمان کار' : pomodoroCount % LONG_BREAK_AFTER === 0 ? 'استراحت طولانی' : 'استراحت کوتاه';

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className={`flex items-center gap-2 px-3 py-2 rounded-full border text-xs font-semibold transition-colors ${
          isRunning
            ? 'border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-300 pomo-active'
            : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
        }`}
      >
        <span>🍅</span>
        <span className="font-mono">{formatTime(secondsLeft)}</span>
        <span className="opacity-60">{phaseLabel}</span>
        {pomodoroCount > 0 && <span className="ml-1">{'🍅'.repeat(Math.min(pomodoroCount, 4))}</span>}
      </button>
    );
  }

  return (
    <div className={`rounded-2xl border overflow-hidden ${
      phase === 'work'
        ? 'border-red-200 bg-red-50/50 dark:border-red-800/40 dark:bg-red-900/10'
        : 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-800/40 dark:bg-emerald-900/10'
    }`}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-current/10">
        <div className="flex items-center gap-2">
          <span className="text-lg">🍅</span>
          <div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Pomodoro Timer</p>
            <p className="text-[10px] text-slate-500 truncate max-w-[160px]">{lessonTitle}</p>
          </div>
        </div>
        <button onClick={() => setIsMinimized(true)}
          className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Timer circle */}
      <div className="flex flex-col items-center py-5 gap-4">
        <div className="relative">
          <svg width="100" height="100" className="rotate-[-90deg]">
            <circle cx="50" cy="50" r={circleR} fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth="6" />
            <circle cx="50" cy="50" r={circleR} fill="none"
              stroke={phase === 'work' ? '#ef4444' : '#10b981'}
              strokeWidth="6" strokeLinecap="round"
              strokeDasharray={circleCirc}
              strokeDashoffset={strokeDash}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-mono font-bold ${phaseColor}`}>{formatTime(secondsLeft)}</span>
          </div>
        </div>

        <div className="text-center">
          <p className={`text-sm font-semibold ${phaseColor}`}>{phaseLabel}</p>
          <p className="text-xs text-slate-500 font-farsi" dir="rtl">{phaseLabelFa}</p>
        </div>

        {/* Pomodoro dots */}
        {pomodoroCount > 0 && (
          <div className="flex gap-1">
            {Array.from({ length: Math.min(pomodoroCount, 8) }).map((_, i) => (
              <span key={i} className="text-sm">🍅</span>
            ))}
            {pomodoroCount > 8 && <span className="text-xs text-slate-400 self-center">+{pomodoroCount - 8}</span>}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="px-4 pb-4 flex items-center justify-center gap-3">
        {!isRunning ? (
          <button onClick={handleStart}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-colors ${phase === 'work' ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            {secondsLeft === totalDuration ? 'Starten' : 'Fortsetzen'}
          </button>
        ) : (
          <button onClick={() => setIsRunning(false)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            Pause
          </button>
        )}
        <button onClick={handleSkip} title="Phase überspringen"
          className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
        <button onClick={handleReset} title="Zurücksetzen"
          className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Tip */}
      <div className="px-4 pb-3 text-center">
        <p className="text-[10px] text-slate-400 font-farsi" dir="rtl">
          💡 ۲۵ دقیقه تمرکز + ۵ دقیقه استراحت = ۱ پومودورو
        </p>
      </div>
    </div>
  );
};

export default PomodoroTimer;
