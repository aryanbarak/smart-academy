import React from 'react';
import { LESSONS } from '../constants';

type LessonType = typeof LESSONS[number];
type AccentColor = 'blue' | 'emerald' | 'purple';

interface LessonCardProps {
  lesson: LessonType;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  isBookmarked: boolean;
  timeSpent?: number;    // seconds
  lastAccessed?: number; // timestamp ms
  onToggle: () => void;
  onToggleComplete: () => void;
  onToggleBookmark: () => void;
  children?: React.ReactNode;
}

// ─── style maps (no nested ternaries) ───────────────────────────────────────
const BORDER_ACTIVE: Record<AccentColor, string> = {
  blue:    'border-blue-500 ring-1 ring-blue-500/70 shadow-md',
  emerald: 'border-emerald-500 ring-1 ring-emerald-500/70 shadow-md',
  purple:  'border-purple-500 ring-1 ring-purple-500/70 shadow-md',
};

const ACCENT_BAR: Record<AccentColor, string> = {
  blue:    'bg-gradient-to-b from-blue-500 via-sky-500 to-blue-600',
  emerald: 'bg-gradient-to-b from-emerald-500 via-teal-400 to-emerald-600',
  purple:  'bg-gradient-to-b from-purple-500 via-fuchsia-500 to-purple-600',
};

const BADGE_LIGHT: Record<AccentColor, string> = {
  blue:    'bg-blue-50 text-blue-700 border-blue-100',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  purple:  'bg-purple-50 text-purple-700 border-purple-100',
};

const BADGE_DARK: Record<AccentColor, string> = {
  blue:    'dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-900/40',
  emerald: 'dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-900/40',
  purple:  'dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-900/40',
};

const ICON_BG: Record<AccentColor, string> = {
  blue:    'bg-blue-600',
  emerald: 'bg-emerald-600',
  purple:  'bg-purple-600',
};

const TITLE_ACTIVE: Record<AccentColor, string> = {
  blue:    'text-blue-600 dark:text-blue-400',
  emerald: 'text-emerald-600 dark:text-emerald-400',
  purple:  'text-purple-600 dark:text-purple-400',
};

const PROGRESS_BAR: Record<AccentColor, string> = {
  blue:    'bg-blue-500',
  emerald: 'bg-emerald-500',
  purple:  'bg-purple-500',
};

// ─── helpers ────────────────────────────────────────────────────────────────
function formatLastAccessed(ts?: number): string {
  if (!ts || ts === 0) return '';
  const mins  = Math.floor((Date.now() - ts) / 60000);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);
  if (mins < 1)   return 'gerade eben';
  if (mins < 60)  return `vor ${mins} Min`;
  if (hours < 24) return `vor ${hours} Std`;
  if (days === 1) return 'gestern';
  return `vor ${days} Tagen`;
}

function formatTime(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor(s / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  if (m > 0) return `${m}m`;
  return '';
}

function estimateMinutes(lesson: LessonType): number {
  return Math.max(5, lesson.sections.length * 4);
}

// ─── component ──────────────────────────────────────────────────────────────
const LessonCard: React.FC<LessonCardProps> = ({
  lesson, index, isActive, isCompleted, isBookmarked,
  timeSpent, lastAccessed,
  onToggle, onToggleComplete, onToggleBookmark,
  children,
}) => {
  const ACCENT_MAP: Record<string, AccentColor> = { GA2: 'blue', WISO: 'emerald', PRUEF: 'purple' };
  const accent: AccentColor = ACCENT_MAP[lesson.type] ?? 'blue';

  const estimate   = estimateMinutes(lesson);
  const spentLabel = timeSpent && timeSpent > 0 ? formatTime(timeSpent) : null;
  const lastLabel  = formatLastAccessed(lastAccessed);
  const progressPct = timeSpent && timeSpent > 0
    ? Math.min(100, Math.round((timeSpent / (estimate * 60)) * 100))
    : 0;

  const borderClass = isActive
    ? BORDER_ACTIVE[accent]
    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md';

  const arrowClass = isActive
    ? `${ICON_BG[accent]} text-white shadow-sm rotate-180`
    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-50';

  const titleClass = isActive
    ? TITLE_ACTIVE[accent]
    : 'text-slate-900 dark:text-slate-50';

  const typeLabel =
    lesson.type === 'PRUEF' ? 'Prüfung' : lesson.type;

  return (
    <article
      className={`relative rounded-xl border bg-white/80 dark:bg-slate-900/80 transition-all duration-200 overflow-hidden group ${borderClass}`}
    >
      {/* Accent bar */}
      <div className={`absolute inset-y-0 left-0 w-1.5 rounded-tr-xl rounded-br-xl ${ACCENT_BAR[accent]}`} />

      {/* Study-time progress strip */}
      {progressPct > 0 && !isCompleted && (
        <div className="absolute bottom-0 left-1.5 right-0 h-0.5 bg-slate-100 dark:bg-slate-800">
          <div
            className={`h-full ${PROGRESS_BAR[accent]} opacity-70 transition-all duration-500`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      )}

      <div className="flex items-stretch">
        {/* ── Main clickable area ── */}
        <button
          type="button"
          onClick={onToggle}
          className="flex-1 text-left px-5 py-4 flex items-center justify-between gap-4 focus:outline-none"
        >
          <div className="flex-1 pr-2">
            {/* Meta badges */}
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border ${BADGE_LIGHT[accent]} ${BADGE_DARK[accent]}`}>
                {typeLabel}
              </span>

              <span className="text-[11px] text-slate-400 font-mono">#{lesson.order}</span>

              {lesson.level && (
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  {lesson.level}
                </span>
              )}

              {isCompleted && (
                <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Abgeschlossen
                </span>
              )}

              {isBookmarked && (
                <span className="text-[11px] text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
                  🔖 Markiert
                </span>
              )}
            </div>

            {/* Title & subtitle */}
            <h3 className={`text-sm md:text-base font-semibold transition-colors ${titleClass}`}>
              {lesson.title}
            </h3>
            {lesson.subtitle && (
              <p className="mt-0.5 text-xs md:text-[13px] text-slate-500 dark:text-slate-300 leading-relaxed line-clamp-1">
                {lesson.subtitle}
              </p>
            )}

            {/* Time meta row */}
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ~{estimate} Min
              </span>

              {spentLabel && (
                <span className="flex items-center gap-1 text-[10px] text-slate-400">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  {spentLabel} gelernt
                </span>
              )}

              {lastLabel && (
                <span className="text-[10px] text-slate-400">{lastLabel}</span>
              )}

              <span className="text-[10px] text-slate-400 font-farsi" dir="rtl">
                {lesson.sections.length} بخش
              </span>
            </div>
          </div>

          {/* Arrow icon */}
          <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${arrowClass}`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {/* ── Action buttons ── */}
        <div className="flex items-center gap-1 pr-3 py-3">
          <button
            type="button"
            onClick={e => { e.stopPropagation(); onToggleComplete(); }}
            className={`p-2 rounded-full transition-colors ${
              isCompleted
                ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
                : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isCompleted ? 'Als nicht abgeschlossen markieren' : 'Als abgeschlossen markieren'}
          >
            <svg className="w-4 h-4" fill={isCompleted ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={e => { e.stopPropagation(); onToggleBookmark(); }}
            className={`p-2 rounded-full transition-colors ${
              isBookmarked
                ? 'text-amber-500 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30'
                : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isBookmarked ? 'Lesezeichen entfernen' : 'Lesezeichen hinzufuegen'}
          >
            <svg className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Expanded content slot */}
      {isActive && children}
    </article>
  );
};

export default LessonCard;
