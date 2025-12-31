import React from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

type ResponsivePdfViewerProps = {
  fileUrl: string;
};

const ResponsivePdfViewer: React.FC<ResponsivePdfViewerProps> = ({ fileUrl }) => {
  const defaultLayout = React.useMemo(
    () =>
      defaultLayoutPlugin({
        renderToolbar: Toolbar => (
          <Toolbar>
            {slots => {
              const {
                ZoomOut,
                ZoomIn,
                Zoom,
                EnterFullScreen,
                GoToPreviousPage,
                GoToNextPage,
                GoToFirstPage,
                GoToLastPage,
                SwitchTheme,
                Download,
              } = slots;
              return (
                <div className="flex flex-wrap gap-2 items-center justify-between px-3 py-2 text-sm bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex flex-wrap items-center gap-2">
                    <GoToFirstPage />
                    <GoToPreviousPage />
                    <GoToNextPage />
                    <GoToLastPage />
                    <span className="mx-2 h-4 w-px bg-gray-200 dark:bg-gray-700" aria-hidden />
                    <ZoomOut />
                    <Zoom />
                    <ZoomIn />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <EnterFullScreen />
                    <SwitchTheme />
                    <Download />
                  </div>
                </div>
              );
            }}
          </Toolbar>
        ),
      }),
    [],
  );

  return (
    <div className="w-full h-full min-h-[70vh] bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Worker workerUrl={workerUrl}>
        <div className="flex-1 min-h-0">
          <Viewer
            fileUrl={fileUrl}
            plugins={[defaultLayout]}
            renderLoader={() => (
              <div className="h-full flex items-center justify-center text-sm text-gray-600 dark:text-gray-300">
                Lade PDF …
              </div>
            )}
            renderError={error => (
              <div className="h-full flex flex-col items-center justify-center gap-2 text-sm text-red-500">
                <div>PDF konnte nicht geladen werden.</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{error.message}</div>
              </div>
            )}
          />
        </div>
      </Worker>
    </div>
  );
};

export default ResponsivePdfViewer;
