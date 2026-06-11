import React from 'react';
import { useLanguage } from '../src/contexts/LanguageContext';
import type { CourseType } from '../types';

interface Props {
  view: 'landing' | 'dashboard';
  activeType: CourseType;
  onGoHome: () => void;
  onSelectType: (type: CourseType) => void;
}

const NAV_ITEMS = [
  {
    id: 'home' as const,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    labelKey: 'home' as const,
    type: null,
    activeColor: 'text-blue-400',
  },
  {
    id: 'GA2' as const,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    labelKey: 'tabGA2' as const,
    type: 'GA2' as CourseType,
    activeColor: 'text-blue-400',
  },
  {
    id: 'WISO' as const,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    labelKey: 'tabWISO' as const,
    type: 'WISO' as CourseType,
    activeColor: 'text-emerald-400',
  },
  {
    id: 'PRUEF' as const,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    labelKey: 'tabPRUEF' as const,
    type: 'PRUEF' as CourseType,
    activeColor: 'text-purple-400',
  },
];

const MobileBottomNav: React.FC<Props> = ({ view, activeType, onGoHome, onSelectType }) => {
  const { t } = useLanguage();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur border-t border-slate-800 no-print safe-bottom"
      aria-label="Mobile navigation"
    >
      <div className="flex items-stretch">
        {NAV_ITEMS.map(item => {
          const isActive = item.type === null
            ? view === 'landing'
            : view === 'dashboard' && activeType === item.type;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (item.type === null) {
                  onGoHome();
                } else {
                  onSelectType(item.type);
                }
              }}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 touch-target transition-colors ${
                isActive ? item.activeColor : 'text-slate-500 hover:text-slate-300'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.icon}
              <span className="text-[10px] font-medium leading-tight">{t[item.labelKey]}</span>
              {isActive && (
                <span className="absolute top-0 w-8 h-0.5 rounded-full bg-current" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
