import React from 'react';

interface PdfFilesProps {
  onBack?: () => void;
}

const PdfFiles: React.FC<PdfFilesProps> = ({ onBack }) => {
  // Use Vite's import.meta.glob to include files under /exam-materials
  // Using query: '?url' for proper URL resolution
  const modules = (import.meta as any).glob('/exam-materials/**', { query: '?url', import: 'default', eager: true }) as Record<string, string> | undefined;

  const entries = React.useMemo(() => {
    if (!modules) return [] as { name: string; url: string; path: string }[];
    console.log('📦 PdfFiles loaded modules:', modules);
    return Object.entries(modules)
      .map(([path, url]) => {
        console.log('  File:', path, '→ URL:', url);
        return { path, url, name: path.split('/').pop() || path };
      })
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  }, [modules]);

  const [selected, setSelected] = React.useState<{ name: string; url: string; path: string } | null>(null);
  const [query, setQuery] = React.useState('');
  const [extFilter, setExtFilter] = React.useState<'all' | 'pdf' | 'html'>('all');
  const [groupByFolder, setGroupByFolder] = React.useState(false);

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
      return true;
    });
  }, [entries, query, extFilter]);

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
    name = name.replace(/\b(IHK|AP2|FIAE|Master|Lernheft|Kapitel|Teil|Druckfreundlich|PrintFriendly|Deutsch|فارسی|DE|FA)\b/gi, '');
    // replace underscores, multiple spaces, dashes
    name = name.replace(/[\-_]+/g, ' ');
    name = name.replace(/\s{2,}/g, ' ').trim();
    // collapse long numeric sequences and years
    name = name.replace(/\b20\d{2}\b/g, '');
    // shorten long names
    if (name.length > 36) name = name.slice(0, 34).trim() + '…';
    // capitalise first letter (German-style)
    if (name.length) name = name.charAt(0).toUpperCase() + name.slice(1);
    // fallback to raw if empty
    return name || raw;
  };

  return (
    <div className="max-w-6xl mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">PDF-Dateien</h2>
          <p className="text-sm text-gray-500">Dateien im Ordner <code className="font-mono">exam-materials</code></p>
        </div>
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-sm"
            >
              Zurück
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 h-full">
            <div className="mb-3">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Suche nach Dateiname oder Pfad"
                className="w-full p-2 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
              />
              <div className="flex gap-2 items-center mt-2 text-sm">
                <select value={extFilter} onChange={(e) => setExtFilter(e.target.value as any)} className="px-2 py-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                  <option value="all">Alle</option>
                  <option value="pdf">PDF</option>
                  <option value="html">HTML</option>
                </select>
                <label className="inline-flex items-center text-sm ml-2">
                  <input type="checkbox" className="mr-2" checked={groupByFolder} onChange={(e) => setGroupByFolder(e.target.checked)} />
                  Gruppiere nach Ordner
                </label>
                <div className="text-xs text-gray-400 mr-auto">Gefundene: <strong>{filteredEntries.length}</strong></div>
              </div>
            </div>

            <div className="max-h-[70vh] overflow-auto pr-2">
              {groupByFolder && grouped ? (
                <div className="space-y-4">
                  {grouped.map(g => (
                    <div key={g.folder}>
                      <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">{g.folder === '.' ? 'Root' : g.folder} ({g.items.length})</div>
                      <ul className="space-y-1 mb-3">
                        {g.items.map(e => (
                          <li key={e.path}>
                            <button
                              type="button"
                              onClick={() => setSelected(e)}
                              title={e.path}
                              className="w-full text-left flex items-center justify-between gap-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-900"
                            >
                              <span className="text-sm text-blue-600 dark:text-blue-300 truncate">{formatShortName(e.name)}</span>
                              <span className="text-xs text-gray-400 font-mono ml-2 hidden md:inline">{e.path.replace(/^\//, '')}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="space-y-2">
                  {filteredEntries.map((e) => (
                    <li key={e.path}>
                      <button
                        type="button"
                        onClick={() => setSelected(e)}
                        title={e.path}
                        className="w-full text-left flex items-center justify-between gap-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-900"
                      >
                        <span className="text-sm text-blue-600 dark:text-blue-300 truncate">{formatShortName(e.name)}</span>
                        <span className="text-xs text-gray-400 font-mono ml-2 hidden md:inline">{e.path.replace(/^\//, '')}</span>
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

        <div className="col-span-2">
          {selected ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-2 flex flex-col h-full">
              <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <div className="text-sm font-semibold">{selected.name}</div>
                  <div className="text-xs text-gray-400">{selected.path.replace(/^\//, '')}</div>
                </div>
                <div className="flex items-center gap-2">
                  <a href={selected.url} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:underline">Open in new tab</a>
                  <button onClick={() => setSelected(null)} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">Close</button>
                </div>
              </div>

              <div className="flex-1 mt-2 overflow-hidden">
                {/* Render editor instead of iframe */}
                <React.Suspense fallback={<div className="p-6 text-center">Lade Editor…</div>}>
                  <PdfEditorWrapper url={selected.url} />
                </React.Suspense>
              </div>
            </div>
          ) : (
            <div className="h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 flex items-center justify-center text-gray-500">
              Wähle eine Datei aus der Liste, um sie hier im Editor zu öffnen.
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
    return (
      <div className="h-full">
        <div className="text-sm text-gray-500 p-2">Editor konnte nicht geladen werden — zeige Datei im Viewer.</div>
        <iframe src={url} title="pdf-viewer" style={{ width: '100%', height: '100%', border: 'none' }} />
      </div>
    );
  }

  if (!EditorComp) {
    return <div className="p-6 text-center">Lade Editor…</div>;
  }

  const Comp = EditorComp;
  return <Comp url={url} />;
};
