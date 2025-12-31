// src/components/LandingPage.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

interface LandingPageProps {
  onStart: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
  onStart,
  darkMode,
  onToggleDarkMode,
}) => {
  // کدام "صفحه" در لندینگ نمایش داده شود: home | features | languages
  const [section, setSection] = useState<"home" | "features" | "languages">(
    "home"
  );

  // وضعیت منوی موبایل
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // اسکرول نرم به سکشن‌های همین صفحه (برای Features در home)
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // رفتن به Dashboard با نوع مشخص
  const goToDashboardWithType = (type: "GA2" | "WISO" | "PRUEF") => {
    localStorage.setItem("landingTarget", type);
    onStart();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-100 text-slate-900 flex flex-col">
      {/* Top nav */}
      <header className="w-full border-b border-sky-100 bg-white/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo + title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-sky-500 flex items-center justify-center text-white font-bold shadow-md">
              FIAE
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Fachinformatiker</span>
              <span className="text-xs text-slate-500">
                Anwendung Entwicklung Lernplattform
              </span>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-4 text-sm text-slate-600">
            {/* Home: برگرد به صفحهٔ اصلی همین لندینگ */}
            <button
              className={`hover:text-sky-600 ${
                section === "home" ? "text-sky-600 font-semibold" : ""
              }`}
              onClick={() => {
                setSection("home");
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Home
            </button>

            {/* Algorithms → Dashboard / GA2 */}
            <button
              className="hover:text-sky-600"
              onClick={() => goToDashboardWithType("GA2")}
            >
              Algorithms
            </button>

            {/* WISO → Dashboard / WISO */}
            <button
              className="hover:text-sky-600"
              onClick={() => goToDashboardWithType("WISO")}
            >
              WISO
            </button>

            {/* Programming Language → صفحهٔ زبان‌ها */}
            <button
              className={`hover:text-sky-600 ${
                section === "languages" ? "text-sky-600 font-semibold" : ""
              }`}
              onClick={() => {
                setSection("languages");
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Programing Language
            </button>

            {/* Features → صفحهٔ Features */}
            <button
              className={`hover:text-sky-600 ${
                section === "features" ? "text-sky-600 font-semibold" : ""
              }`}
              onClick={() => {
                setSection("features");
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Features
            </button>
            <Link to="/agent" className="hover:text-sky-600 font-semibold">
              AI Agent
            </Link>
          </nav>

          {/* Right actions + mobile button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100"
              aria-label="Dark mode"
            >
              {darkMode ? (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              )}
            </button>

            {/* دکمه اصلی – در موبایل پشت منوی کشویی هم تکرار می‌شود */}
            <button
              onClick={() => goToDashboardWithType("GA2")}
              className="hidden sm:inline-flex px-4 py-2 rounded-xl text-sm font-semibold bg-sky-500 text-white hover:bg-sky-600 shadow-sm"
            >
              Pseudocode für IHK Prüfung
            </button>

            {/* دکمه منوی موبایل */}
            <button
              className="md:hidden p-2 rounded-full text-slate-600 hover:bg-slate-100"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Menu"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* منوی موبایل زیر هدر */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-sky-100 bg-white/95">
            <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2 text-sm text-slate-700">
              <button
                className="text-left py-1"
                onClick={() => {
                  setSection("home");
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Home
              </button>
              <button
                className="text-left py-1"
                onClick={() => {
                  setMobileMenuOpen(false);
                  goToDashboardWithType("GA2");
                }}
              >
                Algorithms
              </button>
              <button
                className="text-left py-1"
                onClick={() => {
                  setMobileMenuOpen(false);
                  goToDashboardWithType("WISO");
                }}
              >
                WISO
              </button>
              <button
                className="text-left py-1"
                onClick={() => {
                  setSection("languages");
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Programing Language
              </button>
              <button
                className="text-left py-1"
                onClick={() => {
                  setSection("features");
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Features
              </button>
              <button
                className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold bg-sky-500 text-white"
                onClick={() => {
                  setMobileMenuOpen(false);
                  goToDashboardWithType("GA2");
                }}
              >
                Pseudocode für IHK Prüfung
              </button>
              <button
                className="text-left py-1"
                onClick={() => {
                  setMobileMenuOpen(false);
                  window.location.href = "/agent";
                }}
              >
                AI Agent
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main – سه "صفحه" مختلف براساس section */}
      <main className="flex-1">
        {section === "home" && <HomeSection scrollToId={scrollToId} />}
        {section === "features" && <FeaturesSection />}
        {section === "languages" && <ProgrammingLanguagesSection />}
      </main>

      {/* Footer */}
      <footer className="border-t border-sky-100 bg-white/80 py-3">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-[11px] text-slate-500">
            (c) 2024 FIAE Lernplattform (Algorithmen &amp; WISO) – Fachinformatiker
            Anwendungsentwicklung.
          </p>
        </div>
      </footer>
    </div>
  );
};

/* ---------- صفحه‌ی اصلی (Home) ---------- */

const HomeSection: React.FC<{ scrollToId: (id: string) => void }> = ({
  scrollToId,
}) => {
  return (
    <>
      {/* Hero با عکس */}
      <section
        className="w-full min-h-[60vh] bg-cover bg-center flex items-center justify-center px-4"
        style={{
          // فایل را در public/server-room.png قرار بده
          backgroundImage: "url('/server-room.png')",
        }}
      >
        <div className="bg-black/55 backdrop-blur-sm rounded-2xl px-6 py-4 md:px-10 md:py-6">
          <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-relaxed text-center rtl">
            آموزش برنامه‌نویسی به زبان فارسی و المانی
          </h1>
        </div>
      </section>

      {/* Features کوتاه در صفحه‌ی اصلی */}
      <section id="features" className="max-w-6xl mx-auto px-4 pb-8 pt-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            {
              title: "الگوریتم‌های پایه",
              text: "BubbleSort, SelectionSort, Search, Komprimierung mit Pseudocode.",
            },
            {
              title: "WISO",
              text: "قانون‌ها و موضوعات پر تکرار و سوالات چهار گزینه‌ای به سبک IHK.",
            },
            {
              title: "سوال‌های امتحانی",
              text: "تمرین با سوالات اصلی و تحلیل فارسی برای فهم عمیق‌تر.",
            },
            {
              title: "فایل‌های آموزشی",
              text: "فایل‌های PDF برای الگوریتم، شبه‌کد و نکات مهم امتحانی.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white shadow-sm border border-sky-50 p-4 flex flex-col gap-2"
            >
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center text-sm font-bold">
                {i + 1}
              </div>
              <h3 className="text-sm font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* مسیرهای یادگیری */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <h2 className="text-center text-lg md:text-xl font-bold text-slate-900 mb-3">
          مسیرهای اصلی یادگیری در این پلتفرم
        </h2>
        <p className="text-center text-xs md:text-sm text-slate-600 mb-6 max-w-2xl mx-auto">
          همه‌ی این مسیرها در Dashboard داخلی با Masterfileها، Quiz و PDF قابل
          استفاده است. هدف این است که فقط چیزهای لازم برای قبولی را تمرین کنی.
        </p>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            "مسیر Algorithmen (GA2)",
            "مسیر WISO (قانون و اقتصاد)",
            "تمرین‌های امتحان‌های قدیمی",
            "ترفندها و اشتباهات رایج در امتحان",
          ].map((label, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white shadow-sm border border-sky-50 px-4 py-5 flex flex-col justify-between"
            >
              <div>
                <p className="text-xs text-sky-500 font-semibold mb-1">
                  مسیر شماره {i + 1}
                </p>
                <p className="text-sm font-semibold text-slate-900">{label}</p>
              </div>
              <button
                onClick={() => scrollToId("features")}
                className="mt-4 inline-flex items-center justify-end text-xs text-sky-600 hover:text-sky-700"
              >
                دیدن جزئیات بیشتر
                <span className="ml-1">↓</span>
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

/* ---------- صفحه‌ی Features ---------- */

const FeaturesSection: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <section className="text-center">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3">
          ویژگی‌های اصلی FIAE Lernplattform
        </h1>
        <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed rtl">
          این وب‌اپ برای آماده‌سازی آزمون Fachinformatiker Anwendungsentwicklung
          طراحی شده است. تمرکز روی GA2 (Algorithmen) و WISO است؛ با ترکیب متن
          آلمانی برای امتحان و توضیحات فارسی برای فهم بهتر.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {/* Feature 1 */}
        <div className="rounded-2xl bg-white shadow-sm border border-sky-50 p-5 flex flex-col gap-2">
          <h2 className="text-sm md:text-base font-semibold text-slate-900">
            ۱. Masterfileهای الگوریتم به سبک IHK
          </h2>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed rtl">
            برای الگوریتم‌های پرتکرار مثل BubbleSort, SelectionSort, Suche,
            Komprimierung، برای هرکدام یک Masterfile داری:
            <br />
            – توضیح کوتاه آلمانی
            <br />
            – شبه‌کد دقیقاً به سبک IHK
            <br />– توضیحات فارسی و نکات امتحانی
          </p>
        </div>

        {/* Feature 2 */}
        <div className="rounded-2xl bg-white shadow-sm border border-sky-50 p-5 flex flex-col gap-2">
          <h2 className="text-sm md:text-base font-semibold text-slate-900">
            ۲. WISO فشرده و هدف‌دار
          </h2>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed rtl">
            در بخش WISO فقط سراغ قانون‌ها و موضوعاتی می‌رویم که واقعاً در امتحان
            می‌آیند: حقوق کار، بیمه‌های اجتماعی، مالیات، قراردادهای جمعی، حمایت
            از مادران، اخراج و غیره. برای هر موضوع، یک خلاصه آلمانی، یک توضیح
            فارسی و مثال امتحانی داری.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="rounded-2xl bg-white shadow-sm border border-sky-50 p-5 flex flex-col gap-2">
          <h2 className="text-sm md:text-base font-semibold text-slate-900">
            ۳. تمرکز روی سبک سوالات IHK
          </h2>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed rtl">
            به‌جای تئوری دانشگاهی، تمرکز روی همان چیزهایی است که در امتحان می‌آید:
            امضای متدها، آرایه‌ها، حلقه‌ها و شرط‌ها در GA2 و سوال‌های چهارگزینه‌ای
            در WISO. مثال‌ها تا حد امکان از امتحان‌های واقعی سال‌های قبل گرفته
            شده‌اند.
          </p>
        </div>

        {/* Feature 4 */}
        <div className="rounded-2xl bg-white shadow-sm border border-sky-50 p-5 flex flex-col gap-2">
          <h2 className="text-sm md:text-base font-semibold text-slate-900">
            ۴. دو زبانه: آلمانی برای امتحان، فارسی برای فهم
          </h2>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed rtl">
            متن اصلی معمولاً به آلمانی است تا به زبان امتحان عادت کنی، اما کنار
            آن یا زیر آن نکته‌های فارسی می‌آید تا مفهوم را راحت‌تر بگیری. این کار
            کمک می‌کند در جلسهٔ امتحان متن آلمانی را بهتر بفهمی و استرس کم‌تر
            باشد.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-sky-50 border border-sky-100 p-4 text-xs md:text-sm leading-relaxed rtl">
          <h3 className="font-semibold text-sky-800 mb-1">تمرین گام‌به‌گام</h3>
          <p className="text-sky-900/90">
            هر الگوریتم با مثال ساده شروع می‌شود و کم‌کم به مثال‌های واقعی از
            امتحان‌های قدیمی می‌رسد. این کار کمک می‌کند الگوها را سریع تشخیص
            بدهی.
          </p>
        </div>
        <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-xs md:text-sm leading-relaxed rtl">
          <h3 className="font-semibold text-emerald-800 mb-1">
            تحلیل اشتباهات رایج
          </h3>
          <p className="text-emerald-900/90">
            در بسیاری از Masterfileها بخش «اشتباهات رایج» وجود دارد تا بدانی
            داوطلب‌ها کجا معمولاً اشتباه می‌کنند و تو آن اشتباهات را تکرار نکنی.
          </p>
        </div>
        <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-4 text-xs md:text-sm leading-relaxed rtl">
          <h3 className="font-semibold text-indigo-800 mb-1">PDF و چاپ</h3>
          <p className="text-indigo-900/90">
            محتوای مهم به‌صورت PDF قابل چاپ طراحی شده است (فونت مناسب، بدون
            اسکرول افقی و رنگ‌بندی ساده) تا بتوانی روی کاغذ هم راحت تمرین کنی.
          </p>
        </div>
      </section>
    </div>
  );
};

/* ---------- صفحه‌ی Programming Language: نمایش PDF ---------- */

const ProgrammingLanguagesSection: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <section className="text-center">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3">
          آموزش زبان برنامه‌نویسی جاوا (PDF)
        </h1>
        <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed rtl">
          در این صفحه، جزوهٔ کامل آموزش جاوا به صورت فایل PDF نمایش داده می‌شود.
          می‌توانی روی آن زوم کنی، ورق بزنی یا آن را دانلود و چاپ کنی.
        </p>
      </section>

      <section>
        <div className="w-full h-[75vh] md:h-[80vh] rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100">
          {/* فایل را در public/java-intro.pdf قرار بده */}
          <object
            data="/java-intro.pdf#toolbar=1&navpanes=0&view=FitH"
            type="application/pdf"
            className="w-full h-full"
          >
            <iframe
              src="/java-intro.pdf#toolbar=1&navpanes=0&view=FitH"
              className="w-full h-full"
              title="Java Einführung PDF"
            />
          </object>
        </div>

        <p className="mt-3 text-[11px] md:text-xs text-slate-500 text-right rtl">
          اگر PDF در مرورگر درست نمایش داده نشد، می‌توانی آن را از لینک زیر دانلود
          کنی و با یک برنامهٔ نمایش PDF باز کنی:
          <br />
          <a
            href="/java-intro.pdf"
            className="text-sky-600 hover:text-sky-700 underline"
            target="_blank"
            rel="noreferrer"
          >
            دانلود فایل آموزش جاوا
          </a>
        </p>
      </section>
    </div>
  );
};

export default LandingPage;
