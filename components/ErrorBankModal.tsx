import React, { useState, useEffect } from 'react';
import { getErrorBank, markMastered, markReviewed, removeFromErrorBank, type ErrorBankEntry } from '../utils/errorBank';

interface Props {
  onClose: () => void;
}

type FilterType = 'all' | 'GA2' | 'WISO' | 'PRUEF';

const ErrorBankModal: React.FC<Props> = ({ onClose }) => {
  const [entries, setEntries] = useState<ErrorBankEntry[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [mode, setMode] = useState<'list' | 'review'>('list');
  const [reviewIdx, setReviewIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const reload = () => setEntries(getErrorBank());
  useEffect(() => { reload(); }, []);

  const filtered = entries.filter(e => !e.mastered && (filter === 'all' || e.category === filter));
  const allFiltered = entries.filter(e => filter === 'all' || e.category === filter);
  const mastered = allFiltered.filter(e => e.mastered).length;

  const current = filtered[reviewIdx];

  const handleMarkMastered = (id: string) => {
    markMastered(id);
    reload();
    if (reviewIdx >= filtered.length - 1) setReviewIdx(Math.max(0, filtered.length - 2));
  };

  const handleReviewed = () => {
    if (current) { markReviewed(current.id); reload(); }
    setShowAnswer(false);
    setSelected(null);
    setReviewIdx(prev => (prev + 1 >= filtered.length ? 0 : prev + 1));
  };

  const CATEGORY_COLORS: Record<FilterType, string> = {
    all:   'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    GA2:   'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    WISO:  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    PRUEF: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-2xl">❌</span>
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">Fehlerbank</h2>
              <p className="text-xs text-slate-500 font-farsi" dir="rtl">بانک اشتباهات — سوال‌هایی که غلط جواب دادی</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Stats bar */}
        <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-slate-600 dark:text-slate-400">
              Offen: <span className="font-semibold text-red-500">{filtered.length}</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-400">
              Gemeistert: <span className="font-semibold text-emerald-500">{mastered}</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs ml-auto">
            {mastered + filtered.length > 0 && (
              <>
                <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${Math.round((mastered / (mastered + filtered.length)) * 100)}%` }} />
                </div>
                <span className="text-slate-500">{Math.round((mastered / (mastered + filtered.length)) * 100)}%</span>
              </>
            )}
          </div>
        </div>

        {/* Filter + mode toggle */}
        <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex gap-1 rounded-full bg-slate-100 dark:bg-slate-800 p-1">
            {(['all', 'GA2', 'WISO', 'PRUEF'] as FilterType[]).map(f => (
              <button key={f} onClick={() => { setFilter(f); setReviewIdx(0); }}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${filter === f ? CATEGORY_COLORS[f] : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
                {f === 'all' ? 'Alle' : f}
              </button>
            ))}
          </div>
          {filtered.length > 0 && (
            <button onClick={() => { setMode(m => m === 'list' ? 'review' : 'list'); setReviewIdx(0); setShowAnswer(false); setSelected(null); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              {mode === 'list' ? (
                <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Wiederholen</>
              ) : (
                <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>Liste</>
              )}
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <span className="text-5xl mb-4">🎉</span>
              <p className="text-base font-semibold text-slate-700 dark:text-slate-300">Keine offenen Fehler!</p>
              <p className="text-sm text-slate-500 font-farsi mt-1" dir="rtl">هیچ سوال اشتباهی باقی نمانده. عالی!</p>
              {mastered > 0 && <p className="text-xs text-emerald-500 mt-2">{mastered} Fragen gemeistert ✓</p>}
            </div>
          ) : mode === 'list' ? (
            /* List mode */
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(entry => (
                <div key={entry.id} className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[entry.category]}`}>{entry.category}</span>
                        {entry.reviewCount > 0 && <span className="text-[10px] text-slate-400">{entry.reviewCount}× wiederholt</span>}
                      </div>
                      <p className="text-sm text-slate-800 dark:text-slate-200">{entry.question}</p>
                      {entry.questionFa && <p className="text-xs text-slate-500 font-farsi mt-0.5" dir="rtl">{entry.questionFa}</p>}
                      <div className="mt-2 flex gap-2 text-xs">
                        <span className="text-red-500">✗ {entry.options[entry.userAnswer]}</span>
                        <span className="text-emerald-500">✓ {entry.options[entry.correctAnswer]}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => handleMarkMastered(entry.id)}
                        className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors">
                        ✓ Gemeistert
                      </button>
                      <button onClick={() => { removeFromErrorBank(entry.id); reload(); }}
                        className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Review mode */
            current && (
              <div className="px-6 py-6">
                <p className="text-xs text-slate-400 mb-4 text-center">
                  {reviewIdx + 1} / {filtered.length} — {current.reviewCount > 0 ? `${current.reviewCount}× wiederholt` : 'Erste Wiederholung'}
                </p>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-5 mb-4">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{current.question}</p>
                  {current.questionFa && <p className="text-xs text-slate-500 font-farsi mt-2" dir="rtl">{current.questionFa}</p>}
                </div>
                <div className="space-y-2 mb-4">
                  {current.options.map((opt, i) => (
                    <button key={i} onClick={() => { setSelected(i); setShowAnswer(true); }}
                      disabled={showAnswer}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm border transition-all ${
                        showAnswer
                          ? i === current.correctAnswer ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300 font-semibold'
                            : i === selected && i !== current.correctAnswer ? 'border-red-400 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                            : 'border-slate-200 dark:border-slate-700 text-slate-500 opacity-50'
                          : selected === i ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-600'
                      }`}>
                      <span className="font-mono text-xs mr-2 opacity-60">{String.fromCharCode(65 + i)}.</span>
                      {opt}
                    </button>
                  ))}
                </div>
                {showAnswer && (
                  <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 px-4 py-3 mb-4">
                    {current.explanation && <p className="text-xs text-blue-800 dark:text-blue-300">{current.explanation}</p>}
                    {current.explanationFa && <p className="text-xs text-blue-600 dark:text-blue-400 font-farsi mt-1" dir="rtl">{current.explanationFa}</p>}
                  </div>
                )}
                <div className="flex gap-2">
                  {showAnswer && (
                    <>
                      <button onClick={() => handleMarkMastered(current.id)}
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
                        ✓ Verstanden
                      </button>
                      <button onClick={handleReviewed}
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                        Weiter →
                      </button>
                    </>
                  )}
                  {!showAnswer && (
                    <button onClick={() => setShowAnswer(true)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                      Antwort zeigen
                    </button>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorBankModal;
