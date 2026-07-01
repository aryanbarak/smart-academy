// Search utilities for lesson content

import { Lesson } from '../types';

export interface SearchResult {
  lessonId: string;
  lessonTitle: string;
  sectionIndex: number;
  sectionHeading: string;
  matchText: string;
  matchType: 'title' | 'heading' | 'content';
  highlightStart: number;
  highlightEnd: number;
}

export function searchLessons(query: string, lessons: Lesson[], language: 'de' | 'fa' | 'both' = 'both'): SearchResult[] {
  if (!query.trim()) return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  const results: SearchResult[] = [];
  
  lessons.forEach(lesson => {
    // Search in title
    if (language === 'de' || language === 'both') {
      if (lesson.title.toLowerCase().includes(normalizedQuery)) {
        results.push({
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          sectionIndex: -1,
          sectionHeading: lesson.title,
          matchText: lesson.title,
          matchType: 'title',
          highlightStart: lesson.title.toLowerCase().indexOf(normalizedQuery),
          highlightEnd: lesson.title.toLowerCase().indexOf(normalizedQuery) + normalizedQuery.length
        });
      }
    }
    
    // Search in subtitle
    if ((language === 'de' || language === 'both') && lesson.subtitle) {
      if (lesson.subtitle.toLowerCase().includes(normalizedQuery)) {
        results.push({
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          sectionIndex: -1,
          sectionHeading: lesson.subtitle,
          matchText: lesson.subtitle,
          matchType: 'title',
          highlightStart: lesson.subtitle.toLowerCase().indexOf(normalizedQuery),
          highlightEnd: lesson.subtitle.toLowerCase().indexOf(normalizedQuery) + normalizedQuery.length
        });
      }
    }
    
    // Search in sections
    lesson.sections.forEach((section, sectionIdx) => {
      // Search heading
      if (language === 'de' || language === 'both') {
        if (section.headingDe.toLowerCase().includes(normalizedQuery)) {
          results.push({
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            sectionIndex: sectionIdx,
            sectionHeading: section.headingDe,
            matchText: section.headingDe,
            matchType: 'heading',
            highlightStart: section.headingDe.toLowerCase().indexOf(normalizedQuery),
            highlightEnd: section.headingDe.toLowerCase().indexOf(normalizedQuery) + normalizedQuery.length
          });
        }
      }
      
      if ((language === 'fa' || language === 'both') && section.headingFa) {
        if (section.headingFa.toLowerCase().includes(normalizedQuery)) {
          results.push({
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            sectionIndex: sectionIdx,
            sectionHeading: section.headingFa,
            matchText: section.headingFa,
            matchType: 'heading',
            highlightStart: section.headingFa.toLowerCase().indexOf(normalizedQuery),
            highlightEnd: section.headingFa.toLowerCase().indexOf(normalizedQuery) + normalizedQuery.length
          });
        }
      }
      
      // Search content
      if (language === 'de' || language === 'both') {
        const contentLower = section.contentDe.toLowerCase();
        const matchIdx = contentLower.indexOf(normalizedQuery);
        if (matchIdx >= 0) {
          const start = Math.max(0, matchIdx - 50);
          const end = Math.min(section.contentDe.length, matchIdx + normalizedQuery.length + 50);
          const context = section.contentDe.substring(start, end);
          
          results.push({
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            sectionIndex: sectionIdx,
            sectionHeading: section.headingDe,
            matchText: context,
            matchType: 'content',
            highlightStart: matchIdx - start,
            highlightEnd: matchIdx - start + normalizedQuery.length
          });
        }
      }
      
      if ((language === 'fa' || language === 'both') && section.contentFa) {
        const contentLower = section.contentFa.toLowerCase();
        const matchIdx = contentLower.indexOf(normalizedQuery);
        if (matchIdx >= 0) {
          const start = Math.max(0, matchIdx - 50);
          const end = Math.min(section.contentFa.length, matchIdx + normalizedQuery.length + 50);
          const context = section.contentFa.substring(start, end);
          
          results.push({
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            sectionIndex: sectionIdx,
            sectionHeading: section.headingFa || section.headingDe,
            matchText: context,
            matchType: 'content',
            highlightStart: matchIdx - start,
            highlightEnd: matchIdx - start + normalizedQuery.length
          });
        }
      }
    });
  });
  
  return results;
}

export function highlightText(text: string, start: number, end: number): { before: string; highlight: string; after: string } {
  return {
    before: text.substring(0, start),
    highlight: text.substring(start, end),
    after: text.substring(end)
  };
}

import { storageGet, storageSet, storageRemove } from './storage';

export function getRecentSearches(): string[] {
  try {
    const data = storageGet('fiae_recent_searches');
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveRecentSearch(query: string): void {
  try {
    let searches = getRecentSearches();
    
    // Remove duplicates
    searches = searches.filter(s => s !== query);
    
    // Add to beginning
    searches.unshift(query);
    
    // Keep only last 10
    if (searches.length > 10) {
      searches = searches.slice(0, 10);
    }
    
    storageSet('fiae_recent_searches', JSON.stringify(searches));
  } catch (e) {
    console.error('Failed to save recent search:', e);
  }
}

export function clearRecentSearches(): void {
  try {
    storageRemove('fiae_recent_searches');
  } catch (e) {
    console.error('Failed to clear recent searches:', e);
  }
}
