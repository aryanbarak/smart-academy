import { storageGet, storageSet, storageRemove } from './storage';

export interface ErrorBankEntry {
  id: string;
  questionId: string;
  question: string;
  questionFa?: string;
  options: string[];
  correctAnswer: number;
  userAnswer: number;
  explanation?: string;
  explanationFa?: string;
  category: 'GA2' | 'WISO' | 'PRUEF';
  addedAt: number;
  reviewCount: number;
  lastReviewed?: number;
  mastered: boolean;
}

const KEY = 'fiae_error_bank';

function load(): ErrorBankEntry[] {
  try {
    const raw = storageGet(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function save(entries: ErrorBankEntry[]): void {
  try { storageSet(KEY, JSON.stringify(entries)); } catch { /* noop */ }
}

export function addToErrorBank(entry: Omit<ErrorBankEntry, 'id' | 'addedAt' | 'reviewCount' | 'mastered'>): void {
  const all = load();
  const existing = all.findIndex(e => e.questionId === entry.questionId);
  if (existing >= 0) {
    // question already in bank — just increment review count reset mastered
    all[existing].reviewCount += 1;
    all[existing].mastered = false;
    all[existing].userAnswer = entry.userAnswer;
    all[existing].lastReviewed = Date.now();
  } else {
    all.unshift({ ...entry, id: `err_${Date.now()}_${Math.random().toString(36).slice(2)}`, addedAt: Date.now(), reviewCount: 0, mastered: false });
  }
  save(all);
}

export function getErrorBank(): ErrorBankEntry[] {
  return load();
}

export function getErrorBankCount(): number {
  return load().filter(e => !e.mastered).length;
}

export function markMastered(id: string): void {
  const all = load();
  const idx = all.findIndex(e => e.id === id);
  if (idx >= 0) { all[idx].mastered = true; all[idx].lastReviewed = Date.now(); }
  save(all);
}

export function markReviewed(id: string): void {
  const all = load();
  const idx = all.findIndex(e => e.id === id);
  if (idx >= 0) { all[idx].reviewCount += 1; all[idx].lastReviewed = Date.now(); }
  save(all);
}

export function removeFromErrorBank(id: string): void {
  save(load().filter(e => e.id !== id));
}

export function clearErrorBank(): void {
  storageRemove(KEY);
}
