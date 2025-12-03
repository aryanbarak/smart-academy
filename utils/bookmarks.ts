// Bookmark and notes utilities

export interface Bookmark {
  lessonId: string;
  timestamp: number;
  note?: string;
}

export interface LessonNote {
  lessonId: string;
  content: string;
  lastUpdated: number;
}

const BOOKMARKS_KEY = 'fiae_bookmarks';
const NOTES_KEY = 'fiae_lesson_notes';

// Bookmarks
export function getBookmarks(): Bookmark[] {
  try {
    const data = localStorage.getItem(BOOKMARKS_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function isBookmarked(lessonId: string): boolean {
  const bookmarks = getBookmarks();
  return bookmarks.some(b => b.lessonId === lessonId);
}

export function toggleBookmark(lessonId: string): boolean {
  try {
    let bookmarks = getBookmarks();
    const index = bookmarks.findIndex(b => b.lessonId === lessonId);
    
    if (index >= 0) {
      // Remove bookmark
      bookmarks.splice(index, 1);
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
      return false;
    } else {
      // Add bookmark
      bookmarks.push({
        lessonId,
        timestamp: Date.now()
      });
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
      return true;
    }
  } catch (e) {
    console.error('Failed to toggle bookmark:', e);
    return false;
  }
}

export function addBookmark(lessonId: string, note?: string): void {
  try {
    let bookmarks = getBookmarks();
    const existing = bookmarks.find(b => b.lessonId === lessonId);
    
    if (existing) {
      existing.note = note;
      existing.timestamp = Date.now();
    } else {
      bookmarks.push({
        lessonId,
        timestamp: Date.now(),
        note
      });
    }
    
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  } catch (e) {
    console.error('Failed to add bookmark:', e);
  }
}

export function removeBookmark(lessonId: string): void {
  try {
    let bookmarks = getBookmarks();
    bookmarks = bookmarks.filter(b => b.lessonId !== lessonId);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  } catch (e) {
    console.error('Failed to remove bookmark:', e);
  }
}

// Notes
export function getLessonNote(lessonId: string): LessonNote | null {
  try {
    const data = localStorage.getItem(NOTES_KEY);
    if (!data) return null;
    const allNotes: Record<string, LessonNote> = JSON.parse(data);
    return allNotes[lessonId] || null;
  } catch {
    return null;
  }
}

export function saveLessonNote(lessonId: string, content: string): void {
  try {
    const data = localStorage.getItem(NOTES_KEY);
    const allNotes: Record<string, LessonNote> = data ? JSON.parse(data) : {};
    
    allNotes[lessonId] = {
      lessonId,
      content,
      lastUpdated: Date.now()
    };
    
    localStorage.setItem(NOTES_KEY, JSON.stringify(allNotes));
  } catch (e) {
    console.error('Failed to save note:', e);
  }
}

export function deleteLessonNote(lessonId: string): void {
  try {
    const data = localStorage.getItem(NOTES_KEY);
    if (!data) return;
    
    const allNotes: Record<string, LessonNote> = JSON.parse(data);
    delete allNotes[lessonId];
    
    localStorage.setItem(NOTES_KEY, JSON.stringify(allNotes));
  } catch (e) {
    console.error('Failed to delete note:', e);
  }
}

export function getAllNotes(): LessonNote[] {
  try {
    const data = localStorage.getItem(NOTES_KEY);
    if (!data) return [];
    const allNotes: Record<string, LessonNote> = JSON.parse(data);
    return Object.values(allNotes);
  } catch {
    return [];
  }
}
