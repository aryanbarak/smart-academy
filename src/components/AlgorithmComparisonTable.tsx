import React from "react";

export type AlgorithmId =
  | "linear-search"
  | "binary-search"
  | "selection-sort"
  | "insertion-sort"
  | "bubble-sort"
  | "merge-sort"
  | "quick-sort";

export interface AlgorithmComparisonTableProps {
  currentAlgorithmId?: AlgorithmId;
  language: "de" | "fa";
}

const ALGORITHMS_DE = [
  {
    id: "linear-search",
    name: "Linear Search",
    klasse: "Suchen",
    beste: "O(n)",
    durchschnitt: "O(n)",
    schlechteste: "O(n)",
    speicher: "O(1)",
    stabil: "–",
    einsatz: "Kleine, unsortierte Listen",
    hinweis: "Einfach zu verstehen, aber langsam bei großen Datenmengen.",
  },
  {
    id: "binary-search",
    name: "Binary Search",
    klasse: "Suchen",
    beste: "O(1)",
    durchschnitt: "O(log n)",
    schlechteste: "O(log n)",
    speicher: "O(1)",
    stabil: "–",
    einsatz: "Sortierte Arrays",
    hinweis: "Sehr schnell, aber benoetigt sortierte Daten.",
  },
  {
    id: "selection-sort",
    name: "Selection Sort",
    klasse: "Sortieren",
    beste: "O(n²)",
    durchschnitt: "O(n²)",
    schlechteste: "O(n²)",
    speicher: "O(1)",
    stabil: "Nein",
    einsatz: "Sehr kleine Datenmengen, Lehrzwecke",
    hinweis: "Einfach, aber ineffizient fuer groessere Arrays.",
  },
  {
    id: "insertion-sort",
    name: "Insertion Sort",
    klasse: "Sortieren",
    beste: "O(n)",
    durchschnitt: "O(n²)",
    schlechteste: "O(n²)",
    speicher: "O(1)",
    stabil: "Ja",
    einsatz: "Fast sortierte oder sehr kleine Listen",
    hinweis: "Oft schneller als Bubble/Selection Sort in der Praxis.",
  },
  {
    id: "bubble-sort",
    name: "Bubble Sort",
    klasse: "Sortieren",
    beste: "O(n)",
    durchschnitt: "O(n²)",
    schlechteste: "O(n²)",
    speicher: "O(1)",
    stabil: "Ja",
    einsatz: "Nur fuer Lernzwecke",
    hinweis: "Einfachstes, aber sehr langsames Sortierverfahren.",
  },
  {
    id: "merge-sort",
    name: "Merge Sort",
    klasse: "Sortieren",
    beste: "O(n log n)",
    durchschnitt: "O(n log n)",
    schlechteste: "O(n log n)",
    speicher: "O(n)",
    stabil: "Ja",
    einsatz: "Grosse Datenmengen, externe Sortierung",
    hinweis: "Vorhersehbar, aber benoetigt mehr Speicher.",
  },
  {
    id: "quick-sort",
    name: "Quick Sort",
    klasse: "Sortieren",
    beste: "O(n log n)",
    durchschnitt: "O(n log n)",
    schlechteste: "O(n²)",
    speicher: "O(log n)",
    stabil: "Nein",
    einsatz: "Allgemeiner Standard-Sortieralgorithmus",
    hinweis: "In der Praxis sehr schnell, aber Worst-Case schlecht.",
  },
] as const;

const ALGORITHMS_FA = [
  {
    id: "linear-search",
    name: "جستجوی خطی",
    klasse: "جستجو",
    beste: "O(n)",
    durchschnitt: "O(n)",
    schlechteste: "O(n)",
    speicher: "O(1)",
    stabil: "–",
    einsatz: "لیست‌های کوچک و نامرتب",
    hinweis: "ساده است، اما برای داده‌های بزرگ کند می‌شود.",
  },
  {
    id: "binary-search",
    name: "جستجوی دودویی",
    klasse: "جستجو",
    beste: "O(1)",
    durchschnitt: "O(log n)",
    schlechteste: "O(log n)",
    speicher: "O(1)",
    stabil: "–",
    einsatz: "آرایه‌های مرتب",
    hinweis: "خیلی سریع است، اما داده باید مرتب باشد.",
  },
  {
    id: "selection-sort",
    name: "مرتب‌سازی انتخابی",
    klasse: "مرتب‌سازی",
    beste: "O(n²)",
    durchschnitt: "O(n²)",
    schlechteste: "O(n²)",
    speicher: "O(1)",
    stabil: "خیر",
    einsatz: "داده‌های خیلی کم، آموزشی",
    hinweis: "ساده ولی برای آرایه‌های بزرگ ناکارآمد است.",
  },
  {
    id: "insertion-sort",
    name: "مرتب‌سازی درجی",
    klasse: "مرتب‌سازی",
    beste: "O(n)",
    durchschnitt: "O(n²)",
    schlechteste: "O(n²)",
    speicher: "O(1)",
    stabil: "بله",
    einsatz: "لیست‌های کوچک یا تقریباً مرتب",
    hinweis: "اغلب از Bubble/Selection سریع‌تر است.",
  },
  {
    id: "bubble-sort",
    name: "مرتب‌سازی حبابی",
    klasse: "مرتب‌سازی",
    beste: "O(n)",
    durchschnitt: "O(n²)",
    schlechteste: "O(n²)",
    speicher: "O(1)",
    stabil: "بله",
    einsatz: "فقط برای آموزش",
    hinweis: "ساده‌ترین، اما بسیار کند.",
  },
  {
    id: "merge-sort",
    name: "مرتب‌سازی ادغامی",
    klasse: "مرتب‌سازی",
    beste: "O(n log n)",
    durchschnitt: "O(n log n)",
    schlechteste: "O(n log n)",
    speicher: "O(n)",
    stabil: "بله",
    einsatz: "داده‌های بزرگ، مرتب‌سازی خارجی",
    hinweis: "زمان قابل پیش‌بینی، اما حافظه بیشتر.",
  },
  {
    id: "quick-sort",
    name: "مرتب‌سازی سریع",
    klasse: "مرتب‌سازی",
    beste: "O(n log n)",
    durchschnitt: "O(n log n)",
    schlechteste: "O(n²)",
    speicher: "O(log n)",
    stabil: "خیر",
    einsatz: "الگوریتم استاندارد برای اکثر موارد",
    hinweis: "در عمل سریع، ولی بدترین حالت ضعیف.",
  },
] as const;

const TABLE_TEXT = {
  de: {
    heading: "Vergleich mit anderen Algorithmen",
    algorithmus: "Algorithmus",
    klasse: "Klasse",
    best: "Best",
    avg: "Avg",
    worst: "Worst",
    speicher: "Speicher",
    stabil: "Stabil?",
    geeignet: "Geeignet fuer",
    hinweis: "Hinweis",
  },
  fa: {
    heading: "مقایسه با الگوریتم‌های دیگر",
    algorithmus: "الگوریتم",
    klasse: "دسته",
    best: "بهترین",
    avg: "میانگین",
    worst: "بدترین",
    speicher: "حافظه",
    stabil: "پایدار؟",
    geeignet: "مناسب برای",
    hinweis: "نکته",
  },
};

function getRows(language: "de" | "fa") {
  return language === "fa" ? ALGORITHMS_FA : ALGORITHMS_DE;
}

const AlgorithmComparisonTable: React.FC<AlgorithmComparisonTableProps> = ({
  currentAlgorithmId,
  language,
}) => {
  const rows = getRows(language);
  const t = TABLE_TEXT[language];
  const isRtl = language === "fa";

  return (
    <div className={isRtl ? "text-right" : "text-left"} dir={isRtl ? "rtl" : "ltr"}>
      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
        {t.heading}
      </h4>
      <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg bg-white/80 dark:bg-slate-900/60 shadow-sm">
        <table className="min-w-full text-xs sm:text-sm">
          <thead className="bg-slate-50/90 dark:bg-slate-800/60 text-slate-600 dark:text-slate-200">
            <tr>
              <th className="px-3 py-2 font-semibold">{t.algorithmus}</th>
              <th className="px-3 py-2 font-semibold">{t.klasse}</th>
              <th className="px-3 py-2 font-semibold">{t.best}</th>
              <th className="px-3 py-2 font-semibold">{t.avg}</th>
              <th className="px-3 py-2 font-semibold">{t.worst}</th>
              <th className="px-3 py-2 font-semibold">{t.speicher}</th>
              <th className="px-3 py-2 font-semibold">{t.stabil}</th>
              <th className="px-3 py-2 font-semibold">{t.geeignet}</th>
              <th className="px-3 py-2 font-semibold">{t.hinweis}</th>
            </tr>
          </thead>
          <tbody className="text-slate-800 dark:text-slate-100">
            {rows.map((row) => {
              const isActive = currentAlgorithmId === row.id;
              return (
                <tr
                  key={row.id}
                  className={`border-t border-slate-200/70 dark:border-slate-700/60 ${
                    isActive ? "bg-violet-50 dark:bg-violet-900/40" : ""
                  }`}
                >
                  <td className="px-3 py-2 font-semibold">{row.name}</td>
                  <td className="px-3 py-2">{row.klasse}</td>
                  <td className="px-3 py-2">{row.beste}</td>
                  <td className="px-3 py-2">{row.durchschnitt}</td>
                  <td className="px-3 py-2">{row.schlechteste}</td>
                  <td className="px-3 py-2">{row.speicher}</td>
                  <td className="px-3 py-2">{row.stabil}</td>
                  <td className="px-3 py-2">{row.einsatz}</td>
                  <td className="px-3 py-2">{row.hinweis}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AlgorithmComparisonTable;
