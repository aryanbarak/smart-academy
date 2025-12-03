// Recently viewed files management with localStorage

export interface RecentFile {
  name: string;
  url: string;
  path: string;
  timestamp: number;
}

const STORAGE_KEY = 'fiae_recent_files';
const MAX_RECENT = 10;

export const addRecentFile = (file: { name: string; url: string; path: string }) => {
  const recent = getRecentFiles();
  
  // Remove if already exists (to update timestamp)
  const filtered = recent.filter(f => f.path !== file.path);
  
  // Add to beginning
  filtered.unshift({
    ...file,
    timestamp: Date.now()
  });
  
  // Keep only MAX_RECENT items
  const limited = filtered.slice(0, MAX_RECENT);
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
};

export const getRecentFiles = (): RecentFile[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (e) {
    console.error('Error loading recent files:', e);
    return [];
  }
};

export const clearRecentFiles = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const formatTimestamp = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Gerade eben';
  if (minutes < 60) return `Vor ${minutes} Min.`;
  if (hours < 24) return `Vor ${hours} Std.`;
  if (days < 7) return `Vor ${days} Tag${days > 1 ? 'en' : ''}`;
  
  return new Date(timestamp).toLocaleDateString('de-DE');
};
