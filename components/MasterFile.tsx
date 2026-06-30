import React, { useState, useRef, useEffect } from 'react';
import { Lesson } from '../types';
import { speakText, stopSpeech, simplifyText, askGeminiTutor } from '../utils/gemini';
import PomodoroTimer from './PomodoroTimer';
import AlgorithmVisualizer from './AlgorithmVisualizer';
import { addStudyTime } from '../utils/progress';

interface MasterFileProps {
  lesson: Lesson;
  onToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

// Detect algorithm type from lesson title/id for visualizer
function detectAlgoType(lesson: Lesson): 'bubble' | 'selection' | 'insertion' | null {
  const id = lesson.id.toLowerCase();
  const title = lesson.title.toLowerCase();
  if (id.includes('bubble') || title.includes('bubble'))       return 'bubble';
  if (id.includes('selection') || title.includes('selection')) return 'selection';
  if (id.includes('insertion') || title.includes('insertion')) return 'insertion';
  return null;
}

// Minimal Web Speech API types (not always available in lib.dom.d.ts)
interface SpeechRecognitionResult {
  readonly transcript: string;
  readonly confidence: number;
}
interface SpeechRecognitionResultItem {
  readonly [index: number]: SpeechRecognitionResult;
}
interface SpeechResultEvent extends Event {
  readonly results: { readonly [index: number]: SpeechRecognitionResultItem };
}
interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: SpeechResultEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;
type WindowWithSpeech = typeof globalThis & {
  SpeechRecognition?: SpeechRecognitionCtor;
  webkitSpeechRecognition?: SpeechRecognitionCtor;
};

const MasterFileComponent: React.FC<MasterFileProps> = ({ lesson, onToast }) => {
  const [playingSection, setPlayingSection] = useState<number | null>(null);
  const [loadingSection, setLoadingSection] = useState<number | null>(null);
  const [simplifiedSection, setSimplifiedSection] = useState<{ index: number; text: string } | null>(null);
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);

  // Tutor state
  const [tutorQuestion, setTutorQuestion] = useState('');
  const [tutorAnswer, setTutorAnswer] = useState('');
  const [tutorLoading, setTutorLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const algoType = detectAlgoType(lesson);
  const isGA2 = lesson.type === 'GA2';

  // ── Voice Input ────────────────────────────────────────────────────────────
  const getSpeechAPI = (): SpeechRecognitionCtor | null => {
    if (globalThis.window === undefined) return null;
    const w = globalThis.window as WindowWithSpeech;
    return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
  };
  const SpeechAPI = getSpeechAPI();
  const speechSupported = Boolean(SpeechAPI);

  const startListening = () => {
    if (!SpeechAPI || isListening) return;
    const recognition = new SpeechAPI();
    recognition.lang = 'de-DE';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (e: SpeechResultEvent) => {
      const transcript = e.results[0][0].transcript;
      setTutorQuestion(prev => prev ? `${prev} ${transcript}` : transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  useEffect(() => {
    return () => recognitionRef.current?.stop();
  }, []);

  // ── Audio ──────────────────────────────────────────────────────────────────
  const handlePlayAudio = async (index: number, text: string) => {
    if (playingSection === index) {
      stopSpeech();
      setPlayingSection(null);
      return;
    }
    if (playingSection !== null) {
      stopSpeech();
      setPlayingSection(null);
    }
    try {
      setPlayingSection(index);
      await speakText(text, 'de-DE');
      setPlayingSection(null);
    } catch {
      setPlayingSection(null);
      onToast?.('خطا در پخش صوت - مرورگر پشتیبانی نمی‌کند', 'error');
    }
  };

  // ── Simplify ───────────────────────────────────────────────────────────────
  const handleSimplify = async (index: number, text: string) => {
    if (loadingSection !== null) return;
    try {
      setLoadingSection(index);
      const simplified = await simplifyText(text);
      setSimplifiedSection({ index, text: simplified });
      onToast?.('متن ساده شد', 'success');
    } catch {
      onToast?.('خطا در ساده‌کردن متن', 'error');
    } finally {
      setLoadingSection(null);
    }
  };

  // ── Tutor ──────────────────────────────────────────────────────────────────
  const handleAskTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorQuestion.trim()) return;
    setTutorLoading(true);
    setTutorAnswer('');
    const lessonContext = lesson.sections.map(s => `${s.headingDe}: ${s.contentDe}`).join('\n\n');
    try {
      const answer = await askGeminiTutor(lessonContext, tutorQuestion);
      setTutorAnswer(answer);
      onToast?.('پاسخ دریافت شد', 'success');
    } catch {
      setTutorAnswer('متأسفانه نتوانستم درخواست را پردازش کنم.');
      onToast?.('خطا در دریافت پاسخ', 'error');
    } finally {
      setTutorLoading(false);
    }
  };

  return (
    <div className="mt-4 animate-fade-in-up lesson-content">

      {/* ── Toolbar row ── */}
      <div className="flex items-center justify-between mb-4 no-print flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {/* Pomodoro toggle */}
          <button
            type="button"
            onClick={() => setShowPomodoro(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              showPomodoro
                ? 'border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-300'
                : 'border-slate-200 bg-white text-slate-500 hover:border-red-300 hover:text-red-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
            }`}
            title="Pomodoro Timer"
          >
            🍅 Pomodoro
          </button>

          {/* Algorithm visualizer toggle (GA2 only) */}
          {isGA2 && algoType && (
            <button
              type="button"
              onClick={() => setShowVisualizer(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                showVisualizer
                  ? 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                  : 'border-slate-200 bg-white text-slate-500 hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              ▶ Visualizer
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          PDF / Drucken
        </button>
      </div>

      {/* ── Pomodoro panel ── */}
      {showPomodoro && (
        <div className="mb-6 no-print">
          <PomodoroTimer
            lessonTitle={lesson.title}
            onSessionComplete={secs => addStudyTime(lesson.id, secs)}
          />
        </div>
      )}

      {/* ── Algorithm Visualizer panel ── */}
      {isGA2 && algoType && showVisualizer && (
        <div className="mb-8 no-print">
          <AlgorithmVisualizer defaultAlgo={algoType} />
        </div>
      )}

      {/* ── Sections ── */}
      <div className="space-y-8">
        {lesson.sections.map((section, index) => (
          <div key={index} className="border-t border-gray-200 dark:border-gray-700 pt-8 first:border-0 first:pt-4 break-inside-avoid">

            {/* Section heading */}
            <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-4">
              <span className="text-sm font-mono text-gray-400 font-bold bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded print:border print:border-gray-300">
                {(index + 1).toString().padStart(2, '0')}
              </span>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{section.headingDe}</h3>
            </div>

            {/* Code snippet */}
            {section.codeSnippet && (
              <div className="mb-6 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 print:border-gray-300">
                <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center print:bg-gray-200">
                  <span className="text-xs font-mono text-gray-500 uppercase">Pseudocode</span>
                  <span className="text-xs font-mono text-gray-500">{section.language ?? 'pseudocode'}</span>
                </div>
                <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 print:bg-white print:text-black">
                  <code>{section.codeSnippet}</code>
                </pre>
              </div>
            )}

            {/* Split view: German + Farsi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:block print:space-y-4">

              {/* German */}
              <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30 print:border-gray-300 print:bg-white relative group">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Erklärung</div>
                  <div className="flex gap-2 no-print opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* TTS */}
                    <button
                      type="button"
                      onClick={() => handlePlayAudio(index, section.contentDe)}
                      disabled={false}
                      className="p-1 rounded hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400"
                      title={playingSection === index ? "Stop" : "Vorlesen lassen"}
                    >
                      {playingSection === index ? (
                        <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                      )}
                    </button>
                    {/* Simplify */}
                    <button
                      type="button"
                      onClick={() => handleSimplify(index, section.contentDe)}
                      disabled={loadingSection === index}
                      className="p-1 rounded hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400"
                      title="Einfach erklären (Gemini)"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </button>
                  </div>
                </div>

                <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 print:text-black">
                  {section.contentDe}
                </div>

                {simplifiedSection?.index === index && (
                  <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded border border-blue-200 dark:border-blue-900 text-sm shadow-sm animate-fade-in-up">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-blue-600">Gemini Vereinfachung:</span>
                      <button type="button" onClick={() => setSimplifiedSection(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                    </div>
                    {simplifiedSection.text}
                  </div>
                )}
              </div>

              {/* Farsi */}
              <div className="p-4 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-lg border border-emerald-100 dark:border-emerald-900/30 print:border-gray-300 print:bg-white" dir="rtl">
                <div className="mb-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide font-farsi">توضیحات</div>
                <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 font-farsi leading-loose print:text-black">
                  {section.contentFa}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── AI Tutor ── */}
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 no-print">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-100 dark:border-indigo-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">KI-Tutor</h3>
              <p className="text-xs text-slate-500 font-farsi" dir="rtl">سوال از هوش مصنوعی درباره این درس</p>
            </div>
          </div>

          <form onSubmit={handleAskTutor} className="space-y-3">
            {/* Textarea + voice button */}
            <div className="relative">
              <textarea
                value={tutorQuestion}
                onChange={e => setTutorQuestion(e.target.value)}
                placeholder="Hast du eine Frage? Frag den KI-Tutor... (oder Mikrofon nutzen)"
                className="w-full p-3 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none h-24"
              />
              {speechSupported && (
                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  className={`absolute right-2 bottom-2 p-2 rounded-full transition-colors ${
                    isListening
                      ? 'bg-red-500 text-white pomo-active'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-900/30'
                  }`}
                  title={isListening ? 'Aufnahme stoppen' : 'Spracheingabe (DE)'}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
              )}
            </div>
            {isListening && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />
                Aufnahme läuft... (Deutsch sprechen)
                <span className="font-farsi mr-2" dir="rtl">در حال ضبط...</span>
              </p>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={tutorLoading || !tutorQuestion.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {tutorLoading ? (
                  <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>Denkt nach...</>
                ) : (
                  <>Frage senden ↵</>
                )}
              </button>
            </div>
          </form>

          {tutorAnswer && (
            <div className="mt-6 p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-indigo-100 dark:border-indigo-900/50 animate-fade-in-up">
              <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-2">Antwort:</div>
              <div className="prose prose-sm dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                {tutorAnswer}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-dashed border-gray-300 dark:border-gray-700 text-center no-print">
        <p className="text-gray-400 text-xs uppercase tracking-widest">Ende der Lektion · پایان درس</p>
      </div>
    </div>
  );
};

const MasterFile = React.memo(MasterFileComponent, (prev, next) =>
  prev.lesson.id === next.lesson.id && prev.onToast === next.onToast
);

export default MasterFile;
