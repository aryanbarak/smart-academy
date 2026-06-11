import React, { useState, useEffect } from 'react';
import { useLanguage } from '../src/contexts/LanguageContext';
import type { Lang } from '../src/i18n';

const STORAGE_KEY = 'fiae_exam_date';

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function calcCountdown(target: Date): CountdownState {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  const total = Math.floor(diff / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    total,
  };
}

interface DailyTask {
  type: 'GA2' | 'WISO' | 'Flashcards' | 'Quiz';
  de: string;
  fa: string;
}

const SCHEDULE_FAR: DailyTask[] = [
  { type: 'GA2',        de: '1 GA2-Lektion durcharbeiten',  fa: '۱ درس الگوریتم بخوان' },
  { type: 'WISO',       de: '1 WISO-Lektion durcharbeiten', fa: '۱ درس WISO بخوان' },
  { type: 'Flashcards', de: '10 Karteikarten wiederholen',  fa: '۱۰ فلش‌کارت مرور کن' },
];
const SCHEDULE_MID: DailyTask[] = [
  { type: 'GA2',        de: '2 GA2-Lektionen + Pseudocode', fa: '۲ درس GA2 + شبه‌کد' },
  { type: 'WISO',       de: '2 WISO-Lektionen',             fa: '۲ درس WISO' },
  { type: 'Quiz',       de: 'Quiz 10 Fragen',               fa: 'کوییز ۱۰ سوالی' },
  { type: 'Flashcards', de: '15 Karteikarten',              fa: '۱۵ فلش‌کارت مرور' },
];
const SCHEDULE_CLOSE: DailyTask[] = [
  { type: 'GA2',        de: 'Alle Algorithmen wiederholen', fa: 'همه الگوریتم‌ها را مرور کن' },
  { type: 'WISO',       de: 'WISO Schwachstellen üben',     fa: 'نقاط ضعف WISO را تمرین کن' },
  { type: 'Quiz',       de: 'Prüfungssimulation',           fa: 'شبیه‌سازی امتحان' },
];
const SCHEDULE_LAST: DailyTask[] = [
  { type: 'GA2',        de: 'Pseudocode-Schema checken',    fa: 'فرمت شبه‌کد را چک کن' },
  { type: 'WISO',       de: 'Nur Schwachstellen-Karten',   fa: 'فقط کارت‌های اشتباهات' },
  { type: 'Quiz',       de: 'Letzte Probe-Prüfung',         fa: 'آخرین آزمون تمرینی' },
];

function buildSchedule(daysLeft: number): DailyTask[] {
  if (daysLeft <= 0)  return [];
  if (daysLeft > 14)  return SCHEDULE_FAR;
  if (daysLeft > 7)   return SCHEDULE_MID;
  if (daysLeft > 3)   return SCHEDULE_CLOSE;
  return SCHEDULE_LAST;
}

const TYPE_COLORS: Record<DailyTask['type'], string> = {
  GA2:        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  WISO:       'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  Flashcards: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  Quiz:       'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
};

type Urgency = 'red' | 'amber' | 'blue';

const URGENCY_MSG: Record<Urgency, Record<Lang, string>> = {
  red:   { de: '⚠️ Endspurt! Nur noch die wichtigsten Themen!', fa: '⚠️ مرحله نهایی! فقط موضوعات مهم را مرور کن!' },
  amber: { de: '📚 Letzte Woche — intensive Wiederholung!',      fa: '📚 هفته آخر — مرور فشرده!' },
  blue:  { de: '💪 Du hast noch Zeit — bleib am Ball!',          fa: '💪 هنوز وقت داری — ادامه بده!' },
};

const URGENCY_BG: Record<Urgency, string> = {
  red:   'from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-900/10 border-red-200 dark:border-red-800/40',
  amber: 'from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-900/10 border-amber-200 dark:border-amber-800/40',
  blue:  'from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 border-blue-200 dark:border-blue-800/40',
};

const URGENCY_TEXT: Record<Urgency, string> = {
  red:   'text-red-600 dark:text-red-400',
  amber: 'text-amber-600 dark:text-amber-400',
  blue:  'text-blue-600 dark:text-blue-400',
};

function getUrgency(daysLeft: number): Urgency {
  if (daysLeft <= 3) return 'red';
  if (daysLeft <= 7) return 'amber';
  return 'blue';
}

const LABELS: Record<Lang, {
  countdownTitle: string; editTitle: string; todayPlan: string;
  examToday: string; success: string; daysRemaining: (d: number) => string;
  days: string; hours: string; mins: string; secs: string;
  changeDate: string;
}> = {
  de: {
    countdownTitle: 'Prüfungs-Countdown',
    editTitle:      'Datum ändern',
    todayPlan:      'Heutiger Plan',
    examToday:      'Prüfung heute!',
    success:        'Viel Erfolg! 🍀',
    daysRemaining:  d => `${d} Tage bis zur Prüfung`,
    days: 'Tage', hours: 'Std', mins: 'Min', secs: 'Sek',
    changeDate: 'Datum ändern',
  },
  fa: {
    countdownTitle: 'شمارش معکوس آزمون',
    editTitle:      'تغییر تاریخ',
    todayPlan:      'برنامه امروز',
    examToday:      '!امتحان امروز است 🍀',
    success:        '!موفق باشی 🍀',
    daysRemaining:  d => `${d} روز تا امتحان`,
    days: 'روز', hours: 'ساعت', mins: 'دقیقه', secs: 'ثانیه',
    changeDate: 'تغییر تاریخ',
  },
};

interface Props {
  compact?: boolean;
}

const ExamCountdown: React.FC<Props> = ({ compact = false }) => {
  const { t, isRTL, lang } = useLanguage();
  const [examDateStr, setExamDateStr] = useState<string>(() => localStorage.getItem(STORAGE_KEY) || '');
  const [countdown, setCountdown] = useState<CountdownState | null>(null);
  const [editing, setEditing] = useState(!examDateStr);
  const [inputVal, setInputVal] = useState(examDateStr);

  useEffect(() => {
    if (!examDateStr) return;
    const target = new Date(examDateStr);
    if (Number.isNaN(target.getTime())) return;
    setCountdown(calcCountdown(target));
    const id = setInterval(() => setCountdown(calcCountdown(target)), 1000);
    return () => clearInterval(id);
  }, [examDateStr]);

  const saveDate = () => {
    const d = new Date(inputVal);
    if (Number.isNaN(d.getTime())) return;
    localStorage.setItem(STORAGE_KEY, inputVal);
    setExamDateStr(inputVal);
    setEditing(false);
  };

  if (editing || !examDateStr) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🎯</span>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{t.examDateTitle}</p>
            <p className="text-xs text-slate-500">{t.examDateSub}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            type="date"
            aria-label={t.examDateTitle}
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="flex-1 text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          />
          <button type="button" onClick={saveDate} disabled={!inputVal}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 transition-colors">
            {t.save}
          </button>
        </div>
      </div>
    );
  }

  if (!countdown) return null;

  const lbl = LABELS[lang];
  const daysLeft = countdown.days;
  const urgency = getUrgency(daysLeft);
  const schedule = buildSchedule(daysLeft);
  const examDate = new Date(examDateStr);

  if (compact) {
    const compactLabel = countdown.total === 0 ? lbl.examToday : `${daysLeft}d ${countdown.hours}h ${countdown.minutes}m`;
    const compactSub   = countdown.total === 0 ? lbl.success   : lbl.daysRemaining(daysLeft);
    return (
      <button type="button" onClick={() => setEditing(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border bg-gradient-to-r ${URGENCY_BG[urgency]} ${isRTL ? 'text-right' : 'text-left'} w-full`}>
        <span className="text-2xl">🎯</span>
        <div>
          <p className={`text-xs font-semibold ${URGENCY_TEXT[urgency]}`}>{compactLabel}</p>
          <p className="text-[10px] text-slate-500">{compactSub}</p>
        </div>
      </button>
    );
  }

  const digits = [
    { val: countdown.days,    label: lbl.days  },
    { val: countdown.hours,   label: lbl.hours },
    { val: countdown.minutes, label: lbl.mins  },
    { val: countdown.seconds, label: lbl.secs  },
  ];

  return (
    <div className={`rounded-2xl border bg-gradient-to-b ${URGENCY_BG[urgency]} overflow-hidden`}>
      <div className="px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎯</span>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{lbl.countdownTitle}</p>
            <p className="text-xs text-slate-500">
              {examDate.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
        <button type="button" onClick={() => setEditing(true)}
          className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          title={lbl.changeDate}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      </div>

      {countdown.total === 0 ? (
        <div className="px-5 pb-4 text-center">
          <p className={`text-2xl font-bold ${URGENCY_TEXT[urgency]}`}>{lbl.success}</p>
        </div>
      ) : (
        <>
          <div className="px-5 pb-4 grid grid-cols-4 gap-2 text-center">
            {digits.map(({ val, label }) => (
              <div key={label} className="bg-white/60 dark:bg-slate-800/60 rounded-xl py-2">
                <p className={`text-2xl font-mono font-bold ${URGENCY_TEXT[urgency]}`}>{String(val).padStart(2, '0')}</p>
                <p className="text-[10px] text-slate-500">{label}</p>
              </div>
            ))}
          </div>
          <div className="px-5 pb-4">
            <p className={`text-xs font-semibold text-center ${URGENCY_TEXT[urgency]}`}>{URGENCY_MSG[urgency][lang]}</p>
          </div>
          {schedule.length > 0 && (
            <div className="px-5 pb-5 border-t border-current/10 pt-3">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">{lbl.todayPlan}</p>
              <div className="space-y-1.5">
                {schedule.map(task => (
                  <div key={task.de} className="flex items-center gap-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[task.type]}`}>
                      {task.type}
                    </span>
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      {lang === 'fa' ? task.fa : task.de}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExamCountdown;
