import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `You are a helpful learning assistant for Smart Academy, an IHK exam preparation platform. Help students understand algorithms (BubbleSort, SelectionSort, InsertionSort, BinarySearch, LinearSearch), WISO topics (Arbeitsrecht, DSGVO, Sozialversicherung), and pseudocode. Answer in the same language the user writes in (German or Persian/Farsi).`;

const AgentPage: React.FC = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setError(null);
    setAnswer("");

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("Kein API-Schlüssel konfiguriert (VITE_GEMINI_API_KEY fehlt).");

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: question,
        config: { systemInstruction: SYSTEM_PROMPT },
      });

      setAnswer(response.text ?? "Keine Antwort erhalten.");
    } catch (err: any) {
      setError(err.message || "Fehler beim Abrufen der Antwort.");
    } finally {
      setLoading(false);
    }
  };

  const isFarsi = /[؀-ۿ]/.test(answer);

  const formatAnswer = (text: string) => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/#{1,3} (.+)/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors mb-8"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Startseite
        </button>

        <h1 className="text-2xl font-bold text-slate-50 mb-1">AI Lernassistent</h1>
        <p className="text-sm text-slate-400 mb-6">
          Fragen zu Algorithmen, WISO und Pseudocode — auf Deutsch oder Farsi.
        </p>

        <div className="space-y-4">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleAsk(); }}
            placeholder='Deine Frage eingeben... (z.B. „Erkläre BubbleSort Schritt für Schritt")'
            className="w-full min-h-[120px] p-4 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 resize-none"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Ctrl+Enter zum Senden</span>
            <button
              type="button"
              onClick={handleAsk}
              disabled={loading || !question.trim()}
              className="px-5 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Lädt..." : "Fragen"}
            </button>
          </div>
        </div>

        {loading && (
          <div className="mt-6 flex items-center gap-2 text-sm text-slate-400">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Antwort wird generiert...
          </div>
        )}

        {(answer || error) && !loading && (
          <div className="mt-6 p-4 rounded-xl bg-slate-900 border border-slate-700">
            {error ? (
              <p className="text-sm text-red-400">{error}</p>
            ) : (
              <p
                className="text-sm text-slate-200 leading-relaxed"
                dir={isFarsi ? "rtl" : "ltr"}
                dangerouslySetInnerHTML={{ __html: formatAnswer(answer) }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentPage;
