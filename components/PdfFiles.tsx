import React from 'react';
import { addRecentFile, getRecentFiles, formatTimestamp, type RecentFile } from '../utils/recentFiles';

interface PdfFilesProps {
  onBack?: () => void;
}

const PdfFiles: React.FC<PdfFilesProps> = ({ onBack }) => {
  // Use Vite's import.meta.glob to include files under /exam-materials
  // Using query: '?url' for proper URL resolution
  // Include URLs for all files under exam-materials
  const modules = (import.meta as any).glob('/exam-materials/**/*', { as: 'url', eager: true }) as Record<string, string> | undefined;

  const entries = React.useMemo(() => {
    const pinned = [{ name: 'Java-Einführung.pdf', url: '/java-intro.pdf', path: '/java-intro.pdf' }];
    if (!modules) return pinned;
    const dynamic = Object.entries(modules)
      .map(([path, url]) => {
        return { path, url, name: path.split('/').pop() || path };
      })
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
    return [...pinned, ...dynamic];
  }, [modules]);

  const [selected, setSelected] = React.useState<{ name: string; url: string; path: string } | null>(null);
  const [query, setQuery] = React.useState('');
  const [extFilter, setExtFilter] = React.useState<'all' | 'pdf' | 'html'>('all');
  const [groupByFolder, setGroupByFolder] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [showRecent, setShowRecent] = React.useState(false);
  const [recentFiles, setRecentFiles] = React.useState<RecentFile[]>([]);
  const [categoryFilter, setCategoryFilter] = React.useState<'all' | 'ap2' | 'wiso' | 'algo' | 'other'>('all');
  const [isLoadingFiles, setIsLoadingFiles] = React.useState(true);
  const viewerRef = React.useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = React.useState<boolean>(() => (typeof window !== 'undefined' ? window.innerWidth < 768 : false));
  const [mobileListOpen, setMobileListOpen] = React.useState(true);

  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Load recent files on mount
  React.useEffect(() => {
    setRecentFiles(getRecentFiles());
    // Simulate loading delay for skeleton
    const timer = setTimeout(() => setIsLoadingFiles(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectFile = (file: { name: string; url: string; path: string }) => {
    setSelected(file);
    addRecentFile(file);
    setRecentFiles(getRecentFiles());
    if (isMobile) {
      setMobileListOpen(false);
    }
  };

  const toggleFullscreen = () => {
    if (!viewerRef.current) return;
    
    if (!document.fullscreenElement) {
      viewerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const normalized = (s: string) => s.toLowerCase();
  const getExt = (p: string) => {
    const m = p.split('.').pop() || '';
    return m.toLowerCase();
  };
  const getFolder = (p: string) => {
    const parts = p.replace(/^\//, '').split('/');
    if (parts.length <= 1) return '.';
    parts.pop();
    return parts.join('/');
  };

  const detectCategory = (path: string, name: string): 'ap2' | 'wiso' | 'algo' | 'other' => {
    const lowerPath = path.toLowerCase();
    const lowerName = name.toLowerCase();
    if (lowerPath.includes('ap2') || lowerName.includes('ap2') || lowerPath.includes('abschlussprÃ¼fung')) return 'ap2';
    if (lowerPath.includes('wiso') || lowerName.includes('wiso') || lowerName.includes('wirtschafts') || lowerName.includes('sozial')) return 'wiso';
    if (lowerPath.includes('algo') || lowerName.includes('algorithmen') || lowerName.includes('algorithm')) return 'algo';
    return 'other';
  };

  const filteredEntries = React.useMemo(() => {
    const q = normalized(query.trim());
    return entries.filter(e => {
      if (q) {
        const name = normalized(e.name);
        const path = normalized(e.path);
        if (!name.includes(q) && !path.includes(q)) return false;
      }
      if (extFilter === 'pdf' && getExt(e.path) !== 'pdf') return false;
      if (extFilter === 'html' && getExt(e.path) !== 'html' && getExt(e.path) !== 'htm') return false;
      if (categoryFilter !== 'all') {
        const cat = detectCategory(e.path, e.name);
        if (cat !== categoryFilter) return false;
      }
      return true;
    });
  }, [entries, query, extFilter, categoryFilter]);

  const grouped = React.useMemo(() => {
    if (!groupByFolder) return null;
    const map = new Map<string, { name: string; url: string; path: string }[]>();
    filteredEntries.forEach(e => {
      const folder = getFolder(e.path);
      const arr = map.get(folder) || [];
      arr.push(e);
      map.set(folder, arr);
    });
    return Array.from(map.entries()).map(([folder, items]) => ({ folder, items }));
  }, [filteredEntries, groupByFolder]);

  const formatShortName = (raw: string) => {
    // remove extension
    let name = raw.replace(/\.[^.]+$/, '');
    // remove common long tokens and parentheticals
    name = name.replace(/\(.*?\)/g, '');
    name = name.replace(/\b(IHK|AP2|FIAE|Master|Lernheft|Kapitel|Teil|Druckfreundlich|PrintFriendly|Deutsch|ÙØ§Ø±Ø³ÛŒ|DE|FA)\b/gi, '');
    // replace underscores, multiple spaces, dashes
    name = name.replace(/[\-_]+/g, ' ');
    name = name.replace(/\s{2,}/g, ' ').trim();
    // collapse long numeric sequences and years
    name = name.replace(/\b20\d{2}\b/g, '');
    // shorten long names
    if (name.length > 36) name = name.slice(0, 34).trim() + 'â€¦';
    // capitalise first letter (German-style)
    if (name.length) name = name.charAt(0).toUpperCase() + name.slice(1);
    // fallback to raw if empty
    return name || raw;
  };

  return (
    <div className="h-screen flex flex-col">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileListOpen(true)}
            className="md:hidden px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            ????? ???????
          </button>
          {!selected && (
            <>
              <button
                onClick={() => setShowRecent(!showRecent)}
                className={`px-3 py-2 rounded-lg text-sm border ${showRecent ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-600 dark:text-blue-300' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                title="Kürzlich angesehen"
              >
                Zuletzt
              </button>
              {onBack && (
                <button
                  onClick={onBack}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-sm"
                >
                  Zurück
                </button>
              )}
            </>
          )}
          {selected && (
            <button
              onClick={() => {
                setSelected(null);
                setShowRecent(false);
                setMobileListOpen(true);
              }}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-sm"
            >
              ????
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Hide file list on mobile when toggled closed to give viewer full width */}
        {(!isMobile || mobileListOpen) && (
        <div className="w-full md:w-80 md:max-w-sm border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="bg-white dark:bg-gray-800 p-2 flex-1 flex flex-col overflow-hidden">
            <div className="mb-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Suche nach Dateiname oder Pfad"
                className="w-full p-2 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
              />
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex gap-2 items-center text-sm">
                  <select value={extFilter} onChange={(e) => setExtFilter(e.target.value as any)} className="px-2 py-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                    <option value="all">Alle</option>
                    <option value="pdf">PDF</option>
                    <option value="html">HTML</option>
                  </select>
                  <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value as any)} className="px-2 py-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                    <option value="all">Alle Kategorien</option>
                    <option value="ap2">AP2</option>
                    <option value="wiso">WISO</option>
                    <option value="algo">Algorithmen</option>
                    <option value="other">Sonstige</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <label className="inline-flex items-center text-sm">
                    <input type="checkbox" className="mr-2" checked={groupByFolder} onChange={(e) => setGroupByFolder(e.target.checked)} />
                    Gruppiere nach Ordner
                  </label>
                  <div className="text-xs text-gray-400">Gefundene: <strong>{filteredEntries.length}</strong></div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              {isLoadingFiles ? (
                <div className="space-y-2 animate-pulse">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded">
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-1"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : showRecent ? (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2 flex items-center justify-between">
                    <span>KÃ¼rzlich angesehen ({recentFiles.length})</span>
                    {recentFiles.length > 0 && (
                      <button onClick={() => { localStorage.removeItem('fiae_recent_files'); setRecentFiles([]); }} className="text-red-500 hover:text-red-700 text-xs">
                        LÃ¶schen
                      </button>
                    )}
                  </div>
                  {recentFiles.length === 0 ? (
                    <div className="text-sm text-gray-500 text-center py-4">Keine kÃ¼rzlich angesehenen Dateien</div>
                  ) : (
                    <ul className="space-y-0.5">
                      {recentFiles.map(file => (
                        <li key={file.path}>
                          <button
                            type="button"
                            onClick={() => handleSelectFile(file)}
                            className="w-full text-left p-1.5 rounded hover:bg-gray-50 dark:hover:bg-gray-900 group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-sm text-blue-600 dark:text-blue-300 truncate flex-1">{file.name}</span>
                              <span className="text-xs text-gray-400 shrink-0">{formatTimestamp(file.timestamp)}</span>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : groupByFolder && grouped ? (
                <div className="space-y-3">
                  {grouped.map(g => (
                    <div key={g.folder}>
                      <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">{g.folder === '.' ? 'Root' : g.folder} ({g.items.length})</div>
                      <ul className="space-y-0.5 mb-2">
                        {g.items.map(e => (
                          <li key={e.path}>
                            <button
                              type="button"
                              onClick={() => handleSelectFile(e)}
                              title={e.path}
                              className="w-full text-left flex items-center justify-between gap-3 p-1.5 rounded hover:bg-gray-50 dark:hover:bg-gray-900"
                            >
                              <span className="text-sm text-blue-600 dark:text-blue-300 truncate">{e.name}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="space-y-0.5">
                  {filteredEntries.map((e) => (
                    <li key={e.path}>
                      <button
                        type="button"
                        onClick={() => handleSelectFile(e)}
                        title={e.path}
                        className="w-full text-left flex items-center justify-between gap-3 p-1.5 rounded hover:bg-gray-50 dark:hover:bg-gray-900"
                      >
                        <span className="text-sm text-blue-600 dark:text-blue-300 truncate">{e.name}</span>
                      </button>
                    </li>
                  ))}
                  {filteredEntries.length === 0 && (
                    <li className="text-sm text-gray-500">Keine Dateien gefunden. Stelle sicher, dass der Ordner <code className="font-mono">exam-materials</code> vorhanden ist.</li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden" ref={viewerRef}>
          {selected ? (
            <div className="bg-white dark:bg-gray-800 flex flex-col h-full">
              <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-700 shrink-0">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{selected.name}</div>
                  <div className="text-xs text-gray-400 truncate md:block hidden">{selected.path.replace(/^\//, '')}</div>
                </div>
                <div className="flex items-center gap-1 md:gap-2 shrink-0">
                  {isMobile && (
                    <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400" title="ZurÃ¼ck zur Liste">â—„</button>
                  )}
                  <button 
                    onClick={toggleFullscreen}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400 min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0"
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  >
                    {isFullscreen ? (
                      <svg className="w-5 h-5 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    )}
                  </button>
                  <a href={selected.url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400 min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0" title="Open in new tab">
                    <svg className="w-5 h-5 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <button onClick={() => setSelected(null)} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600 min-h-[44px] md:min-h-0">Close</button>
                </div>
              </div>

              <div className="flex-1 overflow-hidden pdf-viewer-container">
                {/* Use PDF editor only for PDFs; HTML opens directly in iframe */}
                {/* On mobile, use iframe for PDFs too for maximum compatibility */}
                {getExt(selected.path) === 'pdf' && !isMobile ? (
                  <React.Suspense fallback={<div className="p-6 text-center">Lade Editorâ€¦</div>}>
                    <PdfEditorWrapper url={selected.url} />
                  </React.Suspense>
                ) : (
                  <iframe src={selected.url} title="viewer" style={{ width: '100%', height: '100%', border: 'none', background: 'white' }} />
                )}
              </div>
            </div>
          ) : (
            <div className="h-full bg-white dark:bg-gray-800 flex items-center justify-center text-gray-500">
              WÃ¤hle eine Datei aus der Liste, um sie hier im Editor zu Ã¶ffnen.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfFiles;

// Robust lazy wrapper: try to load PdfEditor, otherwise fall back to iframe
const PdfEditorWrapper: React.FC<{ url: string }> = ({ url }) => {
  const [EditorComp, setEditorComp] = React.useState<React.ComponentType<any> | null>(null);
  const [loadError, setLoadError] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const mod = await import('./PdfEditor');
        if (!mounted) return;
        setEditorComp(() => mod.default || mod);
      } catch (err) {
        console.warn('PdfEditor load failed, falling back to iframe', err);
        if (!mounted) return;
        setLoadError(true);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loadError) {
    return <iframe src={url} title="pdf-viewer" style={{ width: '100%', height: '100%', border: 'none' }} />;
  }

  if (!EditorComp) {
    return <div className="p-6 text-center">Lade Editorâ€¦</div>;
  }

  const Comp = EditorComp;
  return <Comp url={url} />;
};


