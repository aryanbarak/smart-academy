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

// Lesson Progress
export function getLessonProgress(lessonId: string): LessonProgress | null {
  try {
    const data = localStorage.getItem(PROGRESS_KEY);
    if (!data) return null;
    const allProgress: Record<string, LessonProgress> = JSON.parse(data);
    return allProgress[lessonId] || null;
  } catch {
    return null;
  }
}

export function getAllLessonProgress(): Record<string, LessonProgress> {
  try {
    const data = localStorage.getItem(PROGRESS_KEY);
    if (!data) return {};
    return JSON.parse(data);
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
    
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
    
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
    
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
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
    
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
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
    
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
    
    // Update total study time in stats
    const stats = getStudyStats();
    stats.totalTimeSpent += seconds;
    stats.lastStudyDate = Date.now();
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to add study time:', e);
  }
}

// Section Progress (for individual sections within a lesson)
export function getSectionProgress(sectionId: string): SectionProgress | null {
  try {
    const data = localStorage.getItem(SECTION_PROGRESS_KEY);
    if (!data) return null;
    const allProgress: Record<string, SectionProgress> = JSON.parse(data);
    return allProgress[sectionId] || null;
  } catch {
    return null;
  }
}

export function markSectionComplete(sectionId: string): void {
  try {
    const data = localStorage.getItem(SECTION_PROGRESS_KEY);
    const allProgress: Record<string, SectionProgress> = data ? JSON.parse(data) : {};
    
    allProgress[sectionId] = {
      sectionId,
      completed: true,
      timestamp: Date.now()
    };
    
    localStorage.setItem(SECTION_PROGRESS_KEY, JSON.stringify(allProgress));
  } catch (e) {
    console.error('Failed to mark section complete:', e);
  }
}

// Study Statistics
export function getStudyStats(): StudyStats {
  try {
    const data = localStorage.getItem(STATS_KEY);
    if (!data) {
      return {
        totalTimeSpent: 0,
        lessonsCompleted: 0,
        lastStudyDate: Date.now(),
        studyStreak: 0
      };
    }
    return JSON.parse(data);
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
    
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
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
