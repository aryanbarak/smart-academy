// src/components/LandingPage.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage, LangToggle } from "../src/contexts/LanguageContext";

interface LandingPageProps {
  onStart: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

// ─── Onboarding wizard ────────────────────────────────────────────────────────
type CourseGoal = "GA2" | "WISO" | "BOTH";
type TimeAvail = "15" | "30" | "60";
type StudyLevel = "beginner" | "mid" | "ready";

interface OnboardingState {
  goal: CourseGoal | null;
  time: TimeAvail | null;
  level: StudyLevel | null;
}

const OnboardingWizard: React.FC<{
  onDone: (goal: CourseGoal) => void;
  onSkip: () => void;
}> = ({ onDone, onSkip }) => {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<OnboardingState>({ goal: null, time: null, level: null });

  const steps = [
    {
      question: "Worauf bereitest du dich vor?",
      questionFa: "برای کدام امتحان آماده می‌شوی؟",
      options: [
        { val: "GA2", label: "GA2 — Algorithmen", icon: "⚙️", desc: "BubbleSort, Search, Pseudocode" },
        { val: "WISO", label: "WISO — Wirtschaft & Recht", icon: "⚖️", desc: "Arbeitsrecht, Sozialversicherung" },
        { val: "BOTH", label: "Beides", icon: "🎯", desc: "GA2 + WISO zusammen" },
      ] as { val: CourseGoal; label: string; icon: string; desc: string }[],
      key: "goal" as keyof OnboardingState,
    },
    {
      question: "Wie viel Zeit hast du täglich?",
      questionFa: "روزی چقدر وقت داری؟",
      options: [
        { val: "15", label: "15 Minuten", icon: "⚡", desc: "Schnelle Wiederholung — ideal für Flashcards" },
        { val: "30", label: "30 Minuten", icon: "📚", desc: "1 Lektion + Quiz" },
        { val: "60", label: "1+ Stunde", icon: "🔥", desc: "Intensive Vorbereitung + Visualizer" },
      ] as { val: TimeAvail; label: string; icon: string; desc: string }[],
      key: "time" as keyof OnboardingState,
    },
    {
      question: "Wo stehst du gerade?",
      questionFa: "الان کجای یادگیری هستی؟",
      options: [
        { val: "beginner", label: "Gerade angefangen", icon: "🌱", desc: "Alles neu — starte mit Grundlagen" },
        { val: "mid", label: "Mittendrin", icon: "📖", desc: "Ich lerne schon — möchte Lücken schließen" },
        { val: "ready", label: "Kurz vor der Prüfung", icon: "🏁", desc: "Letzte Wiederholung & Prüfungssimulation" },
      ] as { val: StudyLevel; label: string; icon: string; desc: string }[],
      key: "level" as keyof OnboardingState,
    },
  ];

  const current = steps[step];
  const currentVal = state[current.key];

  const handleNext = () => {
    if (!currentVal) return;
    if (step < steps.length - 1) {
      setStep(s => s + 1);
    } else {
      const goal = state.goal ?? "GA2";
      const target = goal === "BOTH" ? "GA2" : goal;
      localStorage.setItem("landingTarget", target);
      localStorage.setItem("fiae_onboarding_done", "1");
      localStorage.setItem("fiae_onboarding_time", state.time ?? "30");
      localStorage.setItem("fiae_onboarding_level", state.level ?? "mid");
      onDone(goal);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">
              Schritt {step + 1} von {steps.length}
            </span>
            <button type="button" onClick={onSkip} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              Überspringen
            </button>
          </div>
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
          </div>
        </div>

        <div className="px-6 pb-2">
          <h2 className="text-lg font-bold text-slate-50">{current.question}</h2>
          <p className="text-sm text-slate-400 font-farsi mt-0.5" dir="rtl">{current.questionFa}</p>
        </div>

        <div className="px-6 pb-6 space-y-2 mt-2">
          {current.options.map(opt => (
            <button
              key={opt.val}
              type="button"
              onClick={() => setState(s => ({ ...s, [current.key]: opt.val }))}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                currentVal === opt.val
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-slate-700 hover:border-slate-500 bg-slate-800/60"
              }`}
            >
              <span className="text-2xl">{opt.icon}</span>
              <div>
                <p className="text-sm font-semibold text-slate-100">{opt.label}</p>
                <p className="text-xs text-slate-400">{opt.desc}</p>
              </div>
              {currentVal === opt.val && (
                <svg className="w-5 h-5 text-blue-400 ml-auto flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>

        <div className="px-6 pb-6">
          <button
            type="button"
            onClick={handleNext}
            disabled={!currentVal}
            className="w-full py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {step < steps.length - 1 ? "Weiter →" : "Lernplattform starten 🚀"}
          </button>
        </div>
      </div>
    </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ onStart, darkMode, onToggleDarkMode }) => {
  const { t } = useLanguage();
  const [section, setSection] = useState<"home" | "features" | "languages">("home");
  const [showOnboarding, setShowOnboarding] = useState(
    () => localStorage.getItem("fiae_onboarding_done") === null
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const goToDashboardWithType = (type: "GA2" | "WISO" | "PRUEF") => {
    localStorage.setItem("landingTarget", type);
    onStart();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {showOnboarding && (
        <OnboardingWizard
          onDone={goal => {
            setShowOnboarding(false);
            if (goal === "BOTH") onStart();
            else goToDashboardWithType(goal);
          }}
          onSkip={() => {
            localStorage.setItem("fiae_onboarding_done", "1");
            setShowOnboarding(false);
          }}
        />
      )}

      {/* ── Header (همان سبک dashboard) ── */}
      <header className="bg-slate-900/95 backdrop-blur border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              FL
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-semibold text-slate-50 tracking-tight">{t.platformName}</span>
              <span className="text-[11px] text-slate-400">{t.platformSub}</span>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 rounded-full bg-slate-800/80 px-1 py-0.5">
            <button
              type="button"
              onClick={() => { setSection("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${section === "home" ? "bg-blue-500 text-white shadow-sm" : "text-slate-300 hover:text-white hover:bg-slate-700/80"}`}
            >
              {t.home}
            </button>
            <button
              type="button"
              onClick={() => goToDashboardWithType("GA2")}
              className="px-3 py-1 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700/80 transition-all"
            >
              {t.algorithms}
            </button>
            <button
              type="button"
              onClick={() => goToDashboardWithType("WISO")}
              className="px-3 py-1 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700/80 transition-all"
            >
              {t.wiso}
            </button>
            <button
              type="button"
              onClick={() => { setSection("languages"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${section === "languages" ? "bg-blue-500 text-white shadow-sm" : "text-slate-300 hover:text-white hover:bg-slate-700/80"}`}
            >
              {t.javaPdf}
            </button>
            <button
              type="button"
              onClick={() => { setSection("features"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${section === "features" ? "bg-blue-500 text-white shadow-sm" : "text-slate-300 hover:text-white hover:bg-slate-700/80"}`}
            >
              {t.features}
            </button>
            <Link to="/agent" className="px-3 py-1 rounded-full text-xs font-semibold text-blue-400 hover:text-white hover:bg-blue-600 transition-all">
              {t.aiAgent}
            </Link>
          </nav>

          {/* Right: lang toggle + CTA + darkmode + mobile */}
          <div className="flex items-center gap-2">
            <LangToggle />
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="p-1.5 rounded-full text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
            >
              {darkMode ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={() => goToDashboardWithType("GA2")}
              className="hidden sm:inline-flex px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-sm"
            >
              {t.toPlatform}
            </button>
            <button
              type="button"
              aria-label={t.menuOpen}
              className="md:hidden p-1.5 rounded-full text-slate-400 hover:bg-slate-800"
              onClick={() => setMobileMenuOpen(p => !p)}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-900">
            <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1 text-sm">
              {[
                { label: t.home, action: () => { setSection("home"); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); } },
                { label: t.algorithms, action: () => { setMobileMenuOpen(false); goToDashboardWithType("GA2"); } },
                { label: t.wiso, action: () => { setMobileMenuOpen(false); goToDashboardWithType("WISO"); } },
                { label: t.javaPdf, action: () => { setSection("languages"); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); } },
                { label: t.features, action: () => { setSection("features"); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); } },
              ].map(item => (
                <button type="button" key={item.label} className="text-left py-2 px-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" onClick={item.action}>
                  {item.label}
                </button>
              ))}
              <Link to="/agent" className="py-2 px-2 text-blue-400 hover:text-blue-300" onClick={() => setMobileMenuOpen(false)}>
                {t.aiAgent}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        {section === "home" && <HomeSection goTo={goToDashboardWithType} />}
        {section === "features" && <FeaturesSection />}
        {section === "languages" && <ProgrammingLanguagesSection />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-3">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-[11px] text-slate-500">{t.footer}</p>
        </div>
      </footer>
    </div>
  );
};

/* ── Home Section ── */
const CARD_ACCENT: Record<string, string> = {
  blue:    "border-blue-500/30 bg-blue-500/5 hover:border-blue-500/70 hover:bg-blue-500/10",
  emerald: "border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/70 hover:bg-emerald-500/10",
  purple:  "border-purple-500/30 bg-purple-500/5 hover:border-purple-500/70 hover:bg-purple-500/10",
  amber:   "border-amber-500/30 bg-amber-500/5 hover:border-amber-500/70 hover:bg-amber-500/10",
};
const CARD_NUM_BG: Record<string, string> = {
  blue:    "bg-blue-500/20 text-blue-400",
  emerald: "bg-emerald-500/20 text-emerald-400",
  purple:  "bg-purple-500/20 text-purple-400",
  amber:   "bg-amber-500/20 text-amber-400",
};
const PATH_BORDER: Record<string, string> = {
  blue:    "border-blue-500/25 hover:border-blue-500/60",
  emerald: "border-emerald-500/25 hover:border-emerald-500/60",
  purple:  "border-purple-500/25 hover:border-purple-500/60",
  amber:   "border-amber-500/25 hover:border-amber-500/60",
};
const PATH_TAG: Record<string, string> = {
  blue:    "text-blue-400",
  emerald: "text-emerald-400",
  purple:  "text-purple-400",
  amber:   "text-amber-400",
};

const HomeSection: React.FC<{
  goTo: (type: "GA2" | "WISO" | "PRUEF") => void;
}> = ({ goTo }) => {
  const { t, isRTL } = useLanguage();
  const cards = [
    { num: 1, title: t.feat1Title, text: t.feat1Text, color: "blue",    dest: "GA2"   as const },
    { num: 2, title: t.feat2Title, text: t.feat2Text, color: "emerald", dest: "WISO"  as const },
    { num: 3, title: t.feat3Title, text: t.feat3Text, color: "purple",  dest: "PRUEF" as const },
    { num: 4, title: t.feat4Title, text: t.feat4Text, color: "amber",   dest: "GA2"   as const },
  ];
  const paths = [
    { num: 1, label: t.path1Label, sub: t.path1Sub, color: "blue",    dest: "GA2"   as const },
    { num: 2, label: t.path2Label, sub: t.path2Sub, color: "emerald", dest: "WISO"  as const },
    { num: 3, label: t.path3Label, sub: t.path3Sub, color: "purple",  dest: "PRUEF" as const },
    { num: 4, label: t.path4Label, sub: t.path4Sub, color: "amber",   dest: "GA2"   as const },
  ];
  return (
    <>
      {/* Hero */}
      <section className="hero-bg w-full min-h-[52vh] flex items-end justify-center px-4 pb-10">
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl px-8 py-5 text-center max-w-2xl w-full border border-slate-700/60">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-snug mb-4" dir={isRTL ? "rtl" : "ltr"}>
            {t.heroTitle}
          </h1>
          <div className="flex flex-wrap gap-3 justify-center">
            <button type="button" onClick={() => goTo("GA2")}
              className="px-5 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-sm">
              {t.heroBtn1}
            </button>
            <button type="button" onClick={() => goTo("WISO")}
              className="px-5 py-2 rounded-full text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-sm">
              {t.heroBtn2}
            </button>
            <button type="button" onClick={() => goTo("PRUEF")}
              className="px-5 py-2 rounded-full text-sm font-semibold bg-purple-600 text-white hover:bg-purple-500 transition-colors shadow-sm">
              {t.heroBtn3}
            </button>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-4">
          {cards.map(item => (
            <button
              type="button"
              key={item.num}
              onClick={() => goTo(item.dest)}
              className={`rounded-2xl border p-4 flex flex-col gap-2 ${isRTL ? "text-right" : "text-left"} transition-all cursor-pointer ${CARD_ACCENT[item.color]}`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${CARD_NUM_BG[item.color]}`}>
                {item.num}
              </div>
              <h3 className="text-sm font-semibold text-slate-100">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.text}</p>
              <span className="text-[10px] text-slate-500 mt-auto">{t.clickHere}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Learning paths */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <h2 className="text-center text-lg font-bold text-slate-100 mb-2" dir={isRTL ? "rtl" : "ltr"}>
          {t.pathsTitle}
        </h2>
        <p className="text-center text-xs text-slate-400 mb-6 max-w-2xl mx-auto" dir={isRTL ? "rtl" : "ltr"}>
          {t.pathsDesc}
        </p>
        <div className="grid gap-3 md:grid-cols-4">
          {paths.map(item => (
            <button
              type="button"
              key={item.num}
              onClick={() => goTo(item.dest)}
              className={`rounded-2xl bg-slate-800/60 border px-4 py-5 flex flex-col gap-2 ${isRTL ? "text-right" : "text-left"} transition-all hover:bg-slate-800 ${PATH_BORDER[item.color]}`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <p className={`text-[10px] font-semibold uppercase tracking-wide ${PATH_TAG[item.color]}`}>{t.pathNum} {item.num}</p>
              <p className="text-sm font-semibold text-slate-100">{item.label}</p>
              <p className="text-xs text-slate-400">{item.sub}</p>
            </button>
          ))}
        </div>
      </section>
    </>
  );
};

/* ── Features Section ── */
const FeaturesSection: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const dir = isRTL ? "rtl" : "ltr";
  const cards = [
    { id: "masterfile", title: t.featCard1Title, body: t.featCard1Body },
    { id: "wiso",       title: t.featCard2Title, body: t.featCard2Body },
    { id: "ihk",        title: t.featCard3Title, body: t.featCard3Body },
    { id: "bilingual",  title: t.featCard4Title, body: t.featCard4Body },
  ];
  const extras = [
    { id: "step",   title: t.featExtra1Title, body: t.featExtra1Body, border: "border-blue-500/30 bg-blue-500/5",    head: "text-blue-400" },
    { id: "errors", title: t.featExtra2Title, body: t.featExtra2Body, border: "border-emerald-500/30 bg-emerald-500/5", head: "text-emerald-400" },
    { id: "pdf",    title: t.featExtra3Title, body: t.featExtra3Body, border: "border-purple-500/30 bg-purple-500/5", head: "text-purple-400" },
  ];
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <section className="text-center">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-50 mb-3" dir={dir}>{t.featPageTitle}</h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed" dir={dir}>{t.featPageDesc}</p>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        {cards.map(f => (
          <div key={f.id} className="rounded-2xl bg-slate-800/60 border border-slate-700 p-5 flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-slate-100" dir={dir}>{f.title}</h2>
            <p className="text-xs text-slate-400 leading-relaxed" dir={dir}>{f.body}</p>
          </div>
        ))}
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {extras.map(c => (
          <div key={c.id} className={`rounded-2xl border p-4 text-xs leading-relaxed ${c.border}`} dir={dir}>
            <h3 className={`font-semibold mb-1 ${c.head}`}>{c.title}</h3>
            <p className="text-slate-400">{c.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

/* ── Programming Languages / Java PDF ── */
const ProgrammingLanguagesSection: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const dir = isRTL ? "rtl" : "ltr";
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <section className="text-center">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-50 mb-3" dir={dir}>{t.javaPdfTitle}</h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed" dir={dir}>{t.javaPdfDesc}</p>
      </section>
      <section>
        <div className="w-full h-[75vh] rounded-2xl overflow-hidden shadow-lg border border-slate-700 bg-slate-800">
          <object data="/java-intro.pdf#toolbar=1&navpanes=0&view=FitH" type="application/pdf" className="w-full h-full">
            <iframe src="/java-intro.pdf#toolbar=1&navpanes=0&view=FitH" className="w-full h-full" title="Java Einführung PDF" />
          </object>
        </div>
        <p className="mt-3 text-[11px] text-slate-500 text-right" dir={dir}>
          <a href="/java-intro.pdf" className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noreferrer">
            {t.javaPdfDownload}
          </a>
        </p>
      </section>
    </div>
  );
};

export default LandingPage;
