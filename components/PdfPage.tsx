import React from 'react';
import ResponsivePdfViewer from './ResponsivePdfViewer';

const PdfPage: React.FC = () => {
  const fileUrl = '/exam-materials/wiso-2020.pdf';

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <header className="sticky top-0 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto w-full max-w-6xl px-4 h-12 flex items-center gap-3">
          <button
            onClick={handleBack}
            className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            ← بازگشت
          </button>
          <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200">
            <span className="font-semibold">WISO 2020</span>
            <a
              href={fileUrl}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
              target="_blank"
              rel="noreferrer"
            >
              دانلود PDF
            </a>
          </div>
          <div className="ml-auto text-xs text-gray-500 dark:text-gray-400">
            صفحه کامل قابل اسکرول؛ برای بزرگ‌نمایی از ابزار نوار بالا استفاده کنید.
          </div>
        </div>
      </header>

      <div className="flex-1 min-h-0">
        <ResponsivePdfViewer fileUrl={fileUrl} />
      </div>
    </div>
  );
};

export default PdfPage;
