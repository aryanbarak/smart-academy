import React from 'react';
import { CourseType } from '../types';

interface InfoPanelsProps {
  type: CourseType;
}

const InfoPanels: React.FC<InfoPanelsProps> = ({ type }) => {
  const isGA2 = type === 'GA2';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* German Info Panel */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
          🇩🇪 Kursinhalt
        </h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {isGA2 
            ? 'Vorbereitung auf die Ganzheitliche Aufgabe 2. Fokus auf Algorithmen (Sortieren, Suchen), Pseudocode nach IHK-Standard und Struktogramme.'
            : 'Vorbereitung auf Wirtschafts- und Sozialkunde. Fokus auf Arbeitsrecht, Betriebsrat, DSGVO und Vertragsarten.'}
        </p>
      </div>

      {/* Farsi Info Panel (RTL) */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700" dir="rtl">
        <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2 font-farsi">
          🇮🇷 محتوای دوره
        </h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-farsi">
           {isGA2
            ? 'آمادگی برای آزمون جامع ۲ (GA2). تمرکز بر الگوریتم‌ها (مرتب‌سازی، جستجو)، شبه‌کد استاندارد IHK و نمودارهای ساختاری.'
            : 'آمادگی برای مطالعات اقتصادی و اجتماعی (WISO). تمرکز بر قانون کار، شورای کارکنان، قوانین حفاظت از داده‌ها و انواع قراردادها.'}
        </p>
      </div>
    </div>
  );
};

export default InfoPanels;