import React, { useState } from 'react';
import { Lesson } from '../types';
import { generateSpeech, playAudioData, simplifyText, askGeminiTutor } from '../utils/gemini';

interface MasterFileProps {
  lesson: Lesson;
  onToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

const MasterFile: React.FC<MasterFileProps> = ({ lesson, onToast }) => {
  const [playingSection, setPlayingSection] = useState<number | null>(null);
  const [loadingSection, setLoadingSection] = useState<number | null>(null);
  const [simplifiedSection, setSimplifiedSection] = useState<{index: number, text: string} | null>(null);
  
  // Tutor State
  const [tutorQuestion, setTutorQuestion] = useState("");
  const [tutorAnswer, setTutorAnswer] = useState("");
  const [tutorLoading, setTutorLoading] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handlePlayAudio = async (index: number, text: string) => {
    if (playingSection !== null || loadingSection !== null) return;
    
    try {
      setLoadingSection(index);
      const audioBuffer = await generateSpeech(text);
      setLoadingSection(null);
      
      // Check if buffer is valid (more than 100 bytes indicates real audio)
      if (!audioBuffer || audioBuffer.byteLength < 100) {
        onToast?.('این یک نمونه است؛ صوت واقعی نیاز به API_KEY دارد', 'info');
        return;
      }
      
      setPlayingSection(index);
      await playAudioData(audioBuffer);
      setPlayingSection(null);
      onToast?.('صوت پخش شد', 'success');
    } catch (error) {
      console.error("Audio error:", error);
      setLoadingSection(null);
      setPlayingSection(null);
      onToast?.('خطا در پخش صوت. لطفاً دوباره تلاش کنید.', 'error');
    }
  };

  const handleSimplify = async (index: number, text: string) => {
    if (loadingSection !== null) return;
    try {
      setLoadingSection(index);
      const simplified = await simplifyText(text);
      setSimplifiedSection({ index, text: simplified });
      onToast?.('متن ساده شد', 'success');
    } catch (error) {
      console.error("AI error:", error);
      onToast?.('خطا در ساده‌کردن متن', 'error');
    } finally {
      setLoadingSection(null);
    }
  };

  const handleAskTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorQuestion.trim()) return;

    setTutorLoading(true);
    setTutorAnswer("");
    
    // Aggregate lesson content for context
    const lessonContext = lesson.sections.map(s => s.headingDe + ": " + s.contentDe).join("\n\n");

    try {
      const answer = await askGeminiTutor(lessonContext, tutorQuestion);
      setTutorAnswer(answer);
      onToast?.('پاسخ دریافت شد', 'success');
    } catch (error) {
      setTutorAnswer("متأسفانه نتوانستم درخواست را پردازش کنم.");
      onToast?.('خطا در دریافت پاسخ', 'error');
    } finally {
      setTutorLoading(false);
    }
  };

  return (
    <div className="mt-4 animate-fade-in-up lesson-content">
      
      {/* Print Button */}
      <div className="flex justify-end mb-4 no-print">
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          PDF / Drucken
        </button>
      </div>

      <div className="space-y-8">
        {lesson.sections.map((section, index) => (
          <div key={index} className="border-t border-gray-200 dark:border-gray-700 pt-8 first:border-0 first:pt-4 break-inside-avoid">
            
            {/* Section Heading */}
            <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-4">
              <span className="text-sm font-mono text-gray-400 font-bold bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded print:border print:border-gray-300">
                {(index + 1).toString().padStart(2, '0')}
              </span>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {section.headingDe}
              </h3>
            </div>

            {/* Code Snippet */}
            {section.codeSnippet && (
              <div className="mb-6 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 print:border-gray-300">
                <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center print:bg-gray-200">
                   <span className="text-xs font-mono text-gray-500 uppercase">Input</span>
                   <span className="text-xs font-mono text-gray-500">{section.language || 'pseudocode'}</span>
                </div>
                <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 print:bg-white print:text-black">
                  <code>{section.codeSnippet}</code>
                </pre>
              </div>
            )}

            {/* Explanations Split View */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:block print:space-y-4">
              
              {/* German */}
              <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30 print:border-gray-300 print:bg-white relative group">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                    Erklärung
                  </div>
                  <div className="flex gap-2 no-print opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* TTS Button */}
                    <button 
                      onClick={() => handlePlayAudio(index, section.contentDe)}
                      disabled={loadingSection === index || playingSection !== null}
                      className="p-1 rounded hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400 disabled:opacity-50"
                      title="Vorlesen lassen"
                    >
                      {loadingSection === index ? (
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : playingSection === index ? (
                        <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M10 9v6l5-3-5-3zm-1-9C4.037 0 0 4.037 0 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9z"/></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                      )}
                    </button>
                    {/* Explain Button */}
                    <button 
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

                {/* Simplified Content Popup */}
                {simplifiedSection?.index === index && (
                  <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded border border-blue-200 dark:border-blue-900 text-sm shadow-sm animate-fade-in-up">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-blue-600">Gemini Vereinfachung:</span>
                      <button onClick={() => setSimplifiedSection(null)} className="text-gray-400 hover:text-gray-600">&times;</button>
                    </div>
                    {simplifiedSection.text}
                  </div>
                )}
              </div>

              {/* Farsi */}
              <div className="p-4 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-lg border border-emerald-100 dark:border-emerald-900/30 print:border-gray-300 print:bg-white" dir="rtl">
                <div className="mb-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide font-farsi">
                  توضیحات
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 font-farsi leading-loose print:text-black">
                  {section.contentFa}
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Gemini Tutor Section */}
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 no-print">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-100 dark:border-indigo-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Fragen an den KI-Tutor</h3>
          </div>
          
          <form onSubmit={handleAskTutor} className="space-y-4">
            <div>
              <textarea
                value={tutorQuestion}
                onChange={(e) => setTutorQuestion(e.target.value)}
                placeholder="Hast du eine Frage zu dieser Lektion? Frag mich einfach..."
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none h-24"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={tutorLoading || !tutorQuestion.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {tutorLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Denkt nach...
                  </>
                ) : (
                  <>Frage senden</>
                )}
              </button>
            </div>
          </form>

          {tutorAnswer && (
            <div className="mt-6 p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-indigo-100 dark:border-indigo-900/50 animate-fade-in-up">
              <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-2">Antwort:</div>
              <div className="prose prose-sm dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
                {tutorAnswer}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 pt-4 border-t border-dashed border-gray-300 dark:border-gray-700 text-center no-print">
        <p className="text-gray-400 text-xs uppercase tracking-widest">Ende der Lektion</p>
      </div>
    </div>
  );
};

export default MasterFile;