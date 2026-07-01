import { storageGet, storageSet } from './storage';

// Progress tracking utilities for lesson completion

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  lastAccessed: number;
  timeSpent: number; // in seconds
}

export interface SectionProgress {
  sectionId: string;
  completed: boolean;
  timestamp: number;
}

export interface StudyStats {
  totalTimeSpent: number; // in seconds
  lessonsCompleted: number;
  lastStudyDate: number;
  studyStreak: number; // consecutive days
}

const PROGRESS_KEY = 'fiae_lesson_progress';
const SECTION_PROGRESS_KEY = 'fiae_section_progress';
const STATS_KEY = 'fiae_study_stats';

// In-memory caches to avoid repeated JSON parse and localStorage I/O
let progressCache: Record<string, LessonProgress> | null = null;
let sectionProgressCache: Record<string, SectionProgress> | null = null;
let statsCache: StudyStats | null = null;

// Lesson Progress
export function getLessonProgress(lessonId: string): LessonProgress | null {
  try {
    const allProgress = getAllLessonProgress();
    return allProgress[lessonId] || null;
  } catch {
    return null;
  }
}

export function getAllLessonProgress(): Record<string, LessonProgress> {
  try {
    if (progressCache) return progressCache;
    const data = storageGet(PROGRESS_KEY);
    progressCache = data ? JSON.parse(data) : {};
    return progressCache;
  } catch {
    return {};
  }
}

export function markLessonComplete(lessonId: string): void {
  try {
    const allProgress = getAllLessonProgress();
    const existing = allProgress[lessonId] || { lessonId, completed: false, lastAccessed: 0, timeSpent: 0 };
    
    allProgress[lessonId] = {
      ...existing,
      completed: true,
      lastAccessed: Date.now()
    };
    
    progressCache = allProgress;
    storageSet(PROGRESS_KEY, JSON.stringify(allProgress));
    
    // Update stats
    updateStudyStats();
  } catch (e) {
    console.error('Failed to mark lesson complete:', e);
  }
}

export function toggleLessonComplete(lessonId: string): boolean {
  try {
    const allProgress = getAllLessonProgress();
    const existing = allProgress[lessonId] || { lessonId, completed: false, lastAccessed: 0, timeSpent: 0 };
    
    const newCompleted = !existing.completed;
    allProgress[lessonId] = {
      ...existing,
      completed: newCompleted,
      lastAccessed: Date.now()
    };
    
    progressCache = allProgress;
    storageSet(PROGRESS_KEY, JSON.stringify(allProgress));
    updateStudyStats();
    
    return newCompleted;
  } catch (e) {
    console.error('Failed to toggle lesson:', e);
    return false;
  }
}

export function updateLessonAccess(lessonId: string): void {
  try {
    const allProgress = getAllLessonProgress();
    const existing = allProgress[lessonId] || { lessonId, completed: false, lastAccessed: 0, timeSpent: 0 };
    
    allProgress[lessonId] = {
      ...existing,
      lastAccessed: Date.now()
    };
    
    progressCache = allProgress;
    storageSet(PROGRESS_KEY, JSON.stringify(allProgress));
  } catch (e) {
    console.error('Failed to update lesson access:', e);
  }
}

export function addStudyTime(lessonId: string, seconds: number): void {
  try {
    const allProgress = getAllLessonProgress();
    const existing = allProgress[lessonId] || { lessonId, completed: false, lastAccessed: 0, timeSpent: 0 };
    
    allProgress[lessonId] = {
      ...existing,
      timeSpent: existing.timeSpent + seconds,
      lastAccessed: Date.now()
    };
    
    progressCache = allProgress;
    storageSet(PROGRESS_KEY, JSON.stringify(allProgress));
    
    // Update total study time in stats
    const stats = getStudyStats();
    stats.totalTimeSpent += seconds;
    stats.lastStudyDate = Date.now();
    statsCache = stats;
    storageSet(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to add study time:', e);
  }
}

// Section Progress (for individual sections within a lesson)
export function getSectionProgress(sectionId: string): SectionProgress | null {
  try {
    const allProgress = getAllSectionProgress();
    return allProgress[sectionId] || null;
  } catch {
    return null;
  }
}

function getAllSectionProgress(): Record<string, SectionProgress> {
  try {
    if (sectionProgressCache) return sectionProgressCache;
    const data = storageGet(SECTION_PROGRESS_KEY);
    sectionProgressCache = data ? JSON.parse(data) : {};
    return sectionProgressCache;
  } catch {
    return {};
  }
}

export function markSectionComplete(sectionId: string): void {
  try {
    const allProgress = getAllSectionProgress();
    
    allProgress[sectionId] = {
      sectionId,
      completed: true,
      timestamp: Date.now()
    };
    
    sectionProgressCache = allProgress;
    storageSet(SECTION_PROGRESS_KEY, JSON.stringify(allProgress));
  } catch (e) {
    console.error('Failed to mark section complete:', e);
  }
}

// Study Statistics
export function getStudyStats(): StudyStats {
  try {
    if (statsCache) return statsCache;
    const data = storageGet(STATS_KEY);
    if (!data) {
      return {
        totalTimeSpent: 0,
        lessonsCompleted: 0,
        lastStudyDate: Date.now(),
        studyStreak: 0
      };
    }
    statsCache = JSON.parse(data);
    return statsCache;
  } catch {
    return {
      totalTimeSpent: 0,
      lessonsCompleted: 0,
      lastStudyDate: Date.now(),
      studyStreak: 0
    };
  }
}

function updateStudyStats(): void {
  try {
    const allProgress = getAllLessonProgress();
    const completedCount = Object.values(allProgress).filter(p => p.completed).length;
    
    const stats = getStudyStats();
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    // Update streak
    if (stats.lastStudyDate) {
      const daysSinceLastStudy = Math.floor((now - stats.lastStudyDate) / oneDayMs);
      if (daysSinceLastStudy === 0) {
        // Same day, keep streak
      } else if (daysSinceLastStudy === 1) {
        // Next day, increment streak
        stats.studyStreak += 1;
      } else {
        // Broke streak
        stats.studyStreak = 1;
      }
    } else {
      stats.studyStreak = 1;
    }
    
    stats.lessonsCompleted = completedCount;
    stats.lastStudyDate = now;
    
    statsCache = stats;
    storageSet(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to update study stats:', e);
  }
}

export function getProgressByType(type: 'GA2' | 'WISO' | 'PRUEF', totalLessons: number): { completed: number; percentage: number } {
  const allProgress = getAllLessonProgress();
  const completedForType = Object.entries(allProgress)
    .filter(([id, progress]) => id.startsWith(type.toLowerCase()) && progress.completed)
    .length;
  
  return {
    completed: completedForType,
    percentage: totalLessons > 0 ? Math.round((completedForType / totalLessons) * 100) : 0
  };
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
