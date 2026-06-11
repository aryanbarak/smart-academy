// src/components/AgentPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AlgorithmComparisonTable, {
  AlgorithmId,
} from "@/components/AlgorithmComparisonTable";

const uiTexts = {
  de: {
    coachTitle: "FIAE / Algorithmus-Hilfe",
    languageLabel: "Antwortsprache:",
    startButton: "Analyse starten",
    loadingButton: "Analysiere...",
    loadingHint: "Analyse laeuft...",
    answerLabel: "Antwort des Lerncoachs",
    noAnswer: "Noch keine Antwort erhalten.",
    connectionOk: "Verbindung zum Lerncoach hergestellt",
    tabCoach: "FIAE Coach",
    tabPlanning: "Tagesplanung",
    agentBack: "Startseite",
  },
  fa: {
    coachTitle: "FIAE / کمک برای الگوریتم‌ها",
    languageLabel: "زبان پاسخ:",
    startButton: "شروع تحلیل",
    loadingButton: "در حال تحلیل...",
    loadingHint: "تحلیل در حال انجام است...",
    answerLabel: "پاسخ مربی:",
    noAnswer: "هنوز پاسخی دریافت نشده است.",
    connectionOk: "ارتباط با مربی برقرار شد",
    tabCoach: "مربی FIAE",
    tabPlanning: "برنامه‌ریزی روزانه",
    agentBack: "صفحه اصلی",
  },
};

type PlannerTask = {
  name: string;
  importance: "high" | "low";
  urgency: "high" | "low";
  minutes?: number | null;
};

type DayScheduleEntry = {
  name: string;
  start: string;
  end: string;
  category: "do_now" | "schedule" | "later";
};

type PlannerResult = {
  do_now: PlannerTask[];
  schedule: PlannerTask[];
  delegate: PlannerTask[];
  delete: PlannerTask[];
  day_schedule?: DayScheduleEntry[];
};

const API_BASE = "http://127.0.0.1:8000";

const AgentPage: React.FC = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<"de" | "fa">("de");
  const [currentAlgorithmId, setCurrentAlgorithmId] = useState<
    AlgorithmId | undefined
  >(undefined);
  const [activeTool, setActiveTool] = useState<"fiae" | "planner">("fiae");
  const [plannerInput, setPlannerInput] = useState("");
  const [plannerResponse, setPlannerResponse] = useState<string | null>(null);
  const [plannerLoading, setPlannerLoading] = useState(false);
  const [plannerError, setPlannerError] = useState<string | null>(null);
  const [plannerResult, setPlannerResult] = useState<PlannerResult | null>(null);

  const detectAlgorithmId = (input: string): AlgorithmId | undefined => {
    const m = input.toLowerCase();
    if (m.includes("selection sort") || m.includes("selection") || m.includes("انتخابی")) {
      return "selection-sort";
    }
    if (m.includes("linear search") || m.includes("lineare suche") || m.includes("جستجوی خطی")) {
      return "linear-search";
    }
    if (m.includes("binary search") || m.includes("binäre suche") || m.includes("dudui") || m.includes("دودویی")) {
      return "binary-search";
    }
    if (m.includes("bubble sort") || m.includes("حبابی")) {
      return "bubble-sort";
    }
    if (m.includes("insertion sort") || m.includes("درج")) {
      return "insertion-sort";
    }
    if (m.includes("merge sort") || m.includes("merge")) {
      return "merge-sort";
    }
    if (m.includes("quick sort") || m.includes("quick")) {
      return "quick-sort";
    }
    return undefined;
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsLoading(true);
    setError(null);
    setAnswer("");

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          language,
        }),
      });
      if (!response.ok) {
        setError(`HTTP ${response.status}`);
        return;
      }

      const data = await response.json();
      if (data && typeof data.answer === "string") {
        setAnswer(data.answer);
        setCurrentAlgorithmId(detectAlgorithmId(message));
      } else {
        setError("Ungueltige Antwort vom Backend");
      }
    } catch (err) {
      console.error("[AgentPage] analyze error", err);
      setError("Backend nicht erreichbar (http://127.0.0.1:8000/analyze).");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanner = async () => {
    if (!plannerInput.trim()) return;

    setPlannerLoading(true);
    setPlannerError(null);
    setPlannerResponse(null);

    try {
      // 1) Split textarea into lines
      const lines = plannerInput
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      // 2) Map lines into PlannerTaskInput objects
      //    For now we keep it simple:
      //    - name = full line
      //    - importance = "high"
      //    - urgency = "low"
      const tasks = lines.map((line) => ({
        name: line,
        importance: "high" as const,
        urgency: "low" as const,
      }));

      const res = await fetch(`${API_BASE}/api/planner/prioritize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      const result = data as PlannerResult;
      setPlannerResult(result);
      setPlannerResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setPlannerError(err.message || "Unbekannter Fehler.");
      setPlannerResult(null);
    } finally {
      setPlannerLoading(false);
    }
  };

  const computePlannerStats = (result: PlannerResult | null) => {
    if (!result) {
      return {
        totalTasks: 0,
        totalMinutes: 0,
        perCategory: {
          do_now: 0,
          schedule: 0,
          delegate: 0,
          delete: 0,
        },
      };
    }

    const allTasks = [
      ...result.do_now,
      ...result.schedule,
      ...result.delegate,
      ...result.delete,
    ];

    const safeMinutes = (t: PlannerTask) =>
      typeof t.minutes === "number" && !Number.isNaN(t.minutes) ? t.minutes : 0;

    const totalMinutes = allTasks.reduce((sum, t) => sum + safeMinutes(t), 0);

    const perCategory = {
      do_now: result.do_now.reduce((s, t) => s + safeMinutes(t), 0),
      schedule: result.schedule.reduce((s, t) => s + safeMinutes(t), 0),
      delegate: result.delegate.reduce((s, t) => s + safeMinutes(t), 0),
      delete: result.delete.reduce((s, t) => s + safeMinutes(t), 0),
    };

    return {
      totalTasks: allTasks.length,
      totalMinutes,
      perCategory,
    };
  };

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {uiTexts[language].agentBack}
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-center text-slate-100">
            AI Agent – FIAE Lerncoach
          </h1>
          <div className="w-24" />
        </div>

        {/* کارت اصلی */}
        <div className="bg-slate-100 rounded-xl shadow-lg p-5 md:p-6 space-y-4 text-slate-900">
          <div className="flex gap-2 mb-3 text-sm">
            <button
              type="button"
              onClick={() => setActiveTool("fiae")}
              className={`px-3 py-1.5 rounded-md border text-xs font-semibold ${
                activeTool === "fiae"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-800 border-slate-300"
              }`}
            >
              {uiTexts[language].tabCoach}
            </button>
            <button
              type="button"
              onClick={() => setActiveTool("planner")}
              className={`px-3 py-1.5 rounded-md border text-xs font-semibold ${
                activeTool === "planner"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-800 border-slate-300"
              }`}
            >
              {uiTexts[language].tabPlanning}
            </button>
          </div>

          {activeTool === "fiae" && (
            <>
              <h2 className="text-lg font-semibold border-b border-slate-300 pb-2">
                {uiTexts[language].coachTitle}
              </h2>

              <form onSubmit={handleAnalyze} className="space-y-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-600">
                    {uiTexts[language].languageLabel}
                  </span>
                  <button
                    type="button"
                    onClick={() => setLanguage("de")}
                    className={`px-2 py-1 rounded-md border text-xs ${
                      language === "de"
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-slate-800 border-slate-300"
                    }`}
                  >
                    Deutsch (DE)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage("fa")}
                    className={`px-2 py-1 rounded-md border text-xs ${
                      language === "fa"
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-slate-800 border-slate-300"
                    }`}
                  >
                    فارسی (FA)
                  </button>
                </div>
                <textarea
                  className="w-full p-3 border border-slate-300 rounded-md min-h-[110px] text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Beschreibe dein Algorithmus-Problem (z.B. 'Erkläre Schritt-für-Schritt BubbleSort', 'Maximum in einer Liste finden' ...)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading
                    ? uiTexts[language].loadingButton
                    : uiTexts[language].startButton}
                </button>
                {isLoading && (
                  <span className="text-xs text-slate-600">
                    {uiTexts[language].loadingHint}
                  </span>
                )}
              </form>

              {answer || error ? (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold mb-1">
                    {uiTexts[language].answerLabel}
                  </h3>
                  <pre
                    className="bg-white text-slate-900 p-3 rounded-md text-sm whitespace-pre-wrap border border-slate-200"
                    dir={/[\u0600-\u06FF]/.test(answer || "") ? "rtl" : "ltr"}
                    style={{
                      textAlign: /[\u0600-\u06FF]/.test(answer || "")
                        ? "right"
                        : "left",
                    }}
                  >
                    {answer || `Fehler: ${error}`}
                  </pre>
                </div>
              ) : (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold mb-1">
                    {uiTexts[language].answerLabel}
                  </h3>
                  <pre className="bg-white text-slate-900 p-3 rounded-md text-sm whitespace-pre-wrap border border-slate-200">
                    {uiTexts[language].noAnswer}
                  </pre>
                </div>
              )}

              {answer && (
                <div className="mt-4">
                  <AlgorithmComparisonTable
                    currentAlgorithmId={currentAlgorithmId}
                    language={language}
                  />
                </div>
              )}
            </>
          )}

          {activeTool === "planner" && (
            <section className="space-y-3">
              <h2 className="text-lg font-semibold border-b border-slate-300 pb-2">
                Tagesplanung / Priorisierung
              </h2>
              <p className="text-xs text-slate-600">
                Schreibe deine Aufgaben (eine pro Zeile). Der Agent ordnet sie
                nach Wichtigkeit und Zeit.
              </p>
              <textarea
                className="w-full p-3 border border-slate-300 rounded-md min-h-[110px] text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder={
                  "Beispiel:\nMathe lernen – 45 min\nGA2 Pseudocode üben – 60 min\nE-Mail an Firma schreiben – 15 min"
                }
                value={plannerInput}
                onChange={(e) => setPlannerInput(e.target.value)}
              />
              <button
                type="button"
                onClick={handlePlanner}
                disabled={plannerLoading}
                className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {plannerLoading ? "Plane..." : "Plan erstellen"}
              </button>
              {plannerError && (
                <p className="text-sm text-red-600 mt-1">
                  Fehler: {plannerError}
                </p>
              )}
              {plannerResult && (
                <>
                  {(() => {
                    const stats = computePlannerStats(plannerResult);
                    return (
                      <div className="mt-4 mb-4 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-700 flex flex-wrap gap-4">
                        <div>
                          <span className="font-semibold">{stats.totalTasks}</span>{" "}
                          Aufgaben insgesamt
                          {stats.totalMinutes > 0 && (
                            <span className="ml-1">
                              (ca. {stats.totalMinutes} Minuten)
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <span>Do now: {stats.perCategory.do_now} min</span>
                          <span>Geplant: {stats.perCategory.schedule} min</span>
                          <span>Delegieren: {stats.perCategory.delegate} min</span>
                          <span>Weglassen: {stats.perCategory.delete} min</span>
                        </div>
                      </div>
                    );
                  })()}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  <div className="rounded-xl border border-red-100 bg-white shadow-sm p-4">
                    <h3 className="text-sm font-semibold text-red-700 mb-2">
                      Do now (wichtig &amp; dringend)
                    </h3>
                    {plannerResult.do_now.length === 0 ? (
                      <p className="text-xs text-slate-500">Keine Aufgaben.</p>
                    ) : (
                      <ul className="space-y-1 text-xs text-slate-800">
                        {plannerResult.do_now.map((t, idx) => (
                          <li key={`do_now-${idx}`} className="flex items-start gap-2">
                            <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-red-500" />
                            <span>{t.name}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="rounded-xl border border-indigo-100 bg-white shadow-sm p-4">
                    <h3 className="text-sm font-semibold text-indigo-700 mb-2">
                      Geplant (wichtig, aber nicht dringend)
                    </h3>
                    {plannerResult.schedule.length === 0 ? (
                      <p className="text-xs text-slate-500">Keine Aufgaben.</p>
                    ) : (
                      <ul className="space-y-1 text-xs text-slate-800">
                        {plannerResult.schedule.map((t, idx) => (
                          <li key={`schedule-${idx}`} className="flex items-start gap-2">
                            <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-indigo-500" />
                            <span>{t.name}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="rounded-xl border border-amber-100 bg-white shadow-sm p-4">
                    <h3 className="text-sm font-semibold text-amber-700 mb-2">
                      Delegieren (dringend, aber weniger wichtig)
                    </h3>
                    {plannerResult.delegate.length === 0 ? (
                      <p className="text-xs text-slate-500">Keine Aufgaben.</p>
                    ) : (
                      <ul className="space-y-1 text-xs text-slate-800">
                        {plannerResult.delegate.map((t, idx) => (
                          <li key={`delegate-${idx}`} className="flex items-start gap-2">
                            <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-amber-500" />
                            <span>{t.name}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
                    <h3 className="text-sm font-semibold text-slate-700 mb-2">
                      Weglassen (nicht wichtig &amp; nicht dringend)
                    </h3>
                    {plannerResult.delete.length === 0 ? (
                      <p className="text-xs text-slate-500">Keine Aufgaben.</p>
                    ) : (
                      <ul className="space-y-1 text-xs text-slate-800">
                        {plannerResult.delete.map((t, idx) => (
                          <li key={`delete-${idx}`} className="flex items-start gap-2">
                            <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-slate-400" />
                            <span>{t.name}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                {plannerResult?.day_schedule &&
                  plannerResult.day_schedule.length > 0 && (
                    <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
                      <h3 className="text-sm font-semibold text-slate-800 mb-3">
                        Heute-Plan (Zeitleiste)
                      </h3>
                      <div className="space-y-2 text-xs text-slate-800">
                        {plannerResult.day_schedule.map((item, idx) => (
                          <div
                            key={`schedule-row-${idx}`}
                            className="flex items-center justify-between border-b border-slate-100 pb-1 last:border-b-0 last:pb-0"
                          >
                            <div className="flex items-center gap-2">
                                <span
                                  className={`inline-flex h-2 w-2 rounded-full ${
                                    item.category === "do_now"
                                      ? "bg-red-500"
                                      : item.category === "schedule"
                                      ? "bg-indigo-500"
                                      : item.category === "later"
                                      ? "bg-blue-500"
                                      : "bg-slate-400"
                                  }`}
                                />
                              <span>{item.name}</span>
                            </div>
                            <div className="font-mono text-[11px] text-slate-500">
                              {item.start} – {item.end}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </>
            )}
              {plannerResponse && (
                <details className="mt-4">
                  <summary className="text-xs text-slate-500 cursor-pointer">
                    JSON-Debug anzeigen
                  </summary>
                  <pre className="mt-2 bg-slate-900 text-slate-100 text-[11px] p-3 rounded-md overflow-x-auto">
                    {plannerResponse}
                  </pre>
                </details>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentPage;
