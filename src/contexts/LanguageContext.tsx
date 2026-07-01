import React, { createContext, useContext, useState } from 'react';
import { ui } from '../i18n';
import type { Lang, UI } from '../i18n';
import { storageGet, storageSet } from '../../utils/storage';

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: UI;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'de',
  setLang: () => {},
  t: ui.de,
  isRTL: false,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    return (storageGet('fiae_lang') as Lang) ?? 'de';
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    storageSet('fiae_lang', l);
    document.documentElement.dir = l === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = l === 'fa' ? 'fa' : 'de';
    if (l === 'fa') {
      document.body.classList.add('font-farsi');
    } else {
      document.body.classList.remove('font-farsi');
    }
  };

  // Apply on mount
  React.useEffect(() => {
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang === 'fa' ? 'fa' : 'de';
    if (lang === 'fa') document.body.classList.add('font-farsi');
    else document.body.classList.remove('font-farsi');
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: ui[lang] as UI, isRTL: lang === 'fa' }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

// Reusable language toggle button component
export const LangToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { lang, setLang } = useLanguage();
  return (
    <div className={`flex items-center bg-slate-800/80 rounded-full px-1 py-0.5 gap-0.5 ${className}`}>
      <button
        type="button"
        onClick={() => setLang('de')}
        className={`px-2 py-0.5 rounded-full text-xs font-bold transition-all ${
          lang === 'de' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'
        }`}
      >
        DE
      </button>
      <button
        type="button"
        onClick={() => setLang('fa')}
        className={`px-2 py-0.5 rounded-full text-xs font-bold transition-all font-farsi ${
          lang === 'fa' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'
        }`}
      >
        FA
      </button>
    </div>
  );
};
