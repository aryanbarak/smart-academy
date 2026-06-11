import React, { useState } from 'react';
import { getQuizHistory } from '../utils/quiz';
import { getErrorBank } from '../utils/errorBank';

interface WeakSpotsResult {
  summary: string;
  summaryFa: string;
  weakAreas: string[];
  recommendation: string;
  recommendationFa: string;
}

const WeakSpotsPanel: React.FC = () => {
  const [result, setResult] = useState<WeakSpotsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyze = async () => {
    setLoading(true);
    setError('');
    try {
      const quizHistory = getQuizHistory();
      const errorBank = getErrorBank();
      const res = await fetch('http://localhost:4000/api/weak-spots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizHistory, errorBank }),
      });
      if (!res.ok) throw new Error('Server error');
      const data: WeakSpotsResult = await res.json();
      setResult(data);
    } catch {
      setError('Analyse nicht verfügbar. Läuft der Server? (node server/index.js)');
    } finally {
      setLoading(false);
    }
  };

  const hasData = getQuizHistory().length > 0 || getErrorBank().length > 0;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎯</span>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">KI-Schwachstellenanalyse</h3>
            <p className="text-xs text-slate-500 font-farsi" dir="rtl">تحلیل نقاط ضعف با هوش مصنوعی</p>
          </div>
        </div>
        <button
          type="button"
          onClick={analyze}
          disabled={loading || !hasData}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <><svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>Analysiere...</>
          ) : (
            <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>Analysieren</>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        {!hasData && !result && (
          <div className="text-center py-6">
            <p className="text-sm text-slate-500">Noch keine Quiz-Daten vorhanden.</p>
            <p className="text-xs text-slate-400 font-farsi mt-1" dir="rtl">ابتدا چند Quiz بزن تا تحلیل در دسترس باشد</p>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-xs text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {hasData && !result && !loading && !error && (
          <div className="text-center py-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {getQuizHistory().length} Quiz-Sessions · {getErrorBank().length} Fehler gespeichert
            </p>
            <p className="text-xs text-slate-400 font-farsi mt-1" dir="rtl">روی «Analysieren» کلیک کن تا نقاط ضعف شناسایی شوند</p>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
              <p className="text-sm text-slate-700 dark:text-slate-300">{result.summary}</p>
              <p className="text-xs text-slate-500 font-farsi mt-2 text-right" dir="rtl">{result.summaryFa}</p>
            </div>

            {/* Weak areas */}
            {result.weakAreas.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Schwache Bereiche</p>
                <div className="flex flex-wrap gap-2">
                  {result.weakAreas.map((area, i) => (
                    <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                      ⚠ {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendation */}
            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/40">
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">💡 Empfehlung</p>
              <p className="text-sm text-indigo-800 dark:text-indigo-200">{result.recommendation}</p>
              <p className="text-xs text-indigo-500 font-farsi mt-2 text-right" dir="rtl">{result.recommendationFa}</p>
            </div>

            {/* Refresh */}
            <button
              type="button"
              onClick={analyze}
              className="text-xs text-slate-400 hover:text-indigo-500 transition-colors"
            >
              ↻ Neu analysieren
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeakSpotsPanel;
