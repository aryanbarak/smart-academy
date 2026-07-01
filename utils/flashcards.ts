import { storageGet, storageSet } from './storage';

// Flashcard generation and spaced repetition

export interface Flashcard {
  id: string;
  front: string;
  frontFa?: string;
  back: string;
  backFa?: string;
  lessonId: string;
  category: 'GA2' | 'WISO' | 'PRUEF';
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export interface FlashcardReview {
  cardId: string;
  quality: number; // 0-5 (SM-2 algorithm)
  timestamp: number;
  nextReview: number;
  interval: number;
  easeFactor: number;
  repetitions: number;
}

const FLASHCARDS_KEY = 'fiae_flashcards';
const REVIEWS_KEY = 'fiae_flashcard_reviews';

// Generate flashcards from lesson content
export function generateFlashcardsFromLesson(
  lessonId: string,
  category: 'GA2' | 'WISO' | 'PRUEF',
  sections: Array<{ headingDe: string; headingFa?: string; contentDe: string; contentFa?: string }>
): Flashcard[] {
  const cards: Flashcard[] = [];
  
  sections.forEach((section, index) => {
    // Skip if section has no content
    if (!section.contentDe || section.contentDe.length < 20) return;
    
    // Get first meaningful paragraph (up to 300 chars)
    const sentences = section.contentDe.split(/[.!?]\s+/);
    let backContent = sentences[0];
    if (sentences.length > 1 && backContent.length < 150) {
      backContent += '. ' + sentences[1];
    }
    
    // Truncate if too long
    if (backContent.length > 300) {
      backContent = backContent.substring(0, 300) + '...';
    }
    
    // Get Farsi content similarly
    let backContentFa = section.contentFa || '';
    if (backContentFa) {
      const sentencesFa = backContentFa.split(/[.!?؟]\s+/);
      backContentFa = sentencesFa[0];
      if (sentencesFa.length > 1 && backContentFa.length < 150) {
        backContentFa += '۔ ' + sentencesFa[1];
      }
      if (backContentFa.length > 300) {
        backContentFa = backContentFa.substring(0, 300) + '...';
      }
    }
    
    // Create a flashcard for each section
    cards.push({
      id: `${lessonId}_card_${index}`,
      front: section.headingDe,
      frontFa: section.headingFa,
      back: backContent,
      backFa: backContentFa,
      lessonId,
      category,
      difficulty: 'medium',
      tags: [category, lessonId.split('-')[0]]
    });
  });
  
  return cards;
}

export function saveFlashcards(cards: Flashcard[]): void {
  try {
    const existing = getAllFlashcards();
    const merged = [...existing];
    
    cards.forEach(card => {
      const index = merged.findIndex(c => c.id === card.id);
      if (index >= 0) {
        merged[index] = card;
      } else {
        merged.push(card);
      }
    });
    
    storageSet(FLASHCARDS_KEY, JSON.stringify(merged));
  } catch (e) {
    console.error('Failed to save flashcards:', e);
  }
}

export function getAllFlashcards(): Flashcard[] {
  try {
    const data = storageGet(FLASHCARDS_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function getFlashcardsByCategory(category: 'GA2' | 'WISO' | 'PRUEF'): Flashcard[] {
  return getAllFlashcards().filter(c => c.category === category);
}

export function getFlashcardsByLesson(lessonId: string): Flashcard[] {
  return getAllFlashcards().filter(c => c.lessonId === lessonId);
}

// Spaced Repetition (SM-2 Algorithm)
export function getReview(cardId: string): FlashcardReview | null {
  try {
    const data = storageGet(REVIEWS_KEY);
    if (!data) return null;
    const reviews: Record<string, FlashcardReview> = JSON.parse(data);
    return reviews[cardId] || null;
  } catch {
    return null;
  }
}

export function getAllReviews(): Record<string, FlashcardReview> {
  try {
    const data = storageGet(REVIEWS_KEY);
    if (!data) return {};
    return JSON.parse(data);
  } catch {
    return {};
  }
}

export function recordReview(cardId: string, quality: number): FlashcardReview {
  const existing = getReview(cardId);
  const now = Date.now();
  
  let review: FlashcardReview;
  
  if (!existing) {
    // First review
    review = {
      cardId,
      quality,
      timestamp: now,
      nextReview: now + (quality >= 3 ? 86400000 : 0), // 1 day if quality >= 3
      interval: 1,
      easeFactor: 2.5,
      repetitions: quality >= 3 ? 1 : 0
    };
  } else {
    // Update using SM-2 algorithm
    let { easeFactor, interval, repetitions } = existing;
    
    // Update ease factor
    easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
    
    if (quality < 3) {
      // Failed, reset
      repetitions = 0;
      interval = 1;
    } else {
      repetitions += 1;
      if (repetitions === 1) {
        interval = 1;
      } else if (repetitions === 2) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
    }
    
    const nextReviewMs = now + (interval * 86400000); // Convert days to ms
    
    review = {
      cardId,
      quality,
      timestamp: now,
      nextReview: nextReviewMs,
      interval,
      easeFactor,
      repetitions
    };
  }
  
  // Save
  const allReviews = getAllReviews();
  allReviews[cardId] = review;
  
  try {
    storageSet(REVIEWS_KEY, JSON.stringify(allReviews));
  } catch (e) {
    console.error('Failed to save review:', e);
  }
  
  return review;
}

export function getDueFlashcards(): Flashcard[] {
  const allCards = getAllFlashcards();
  const allReviews = getAllReviews();
  const now = Date.now();
  
  return allCards.filter(card => {
    const review = allReviews[card.id];
    if (!review) return true; // Never reviewed, due now
    return review.nextReview <= now;
  });
}

export function getFlashcardStats(category?: 'GA2' | 'WISO' | 'PRUEF'): {
  total: number;
  new: number;
  learning: number;
  review: number;
  mastered: number;
} {
  let cards = getAllFlashcards();
  if (category) {
    cards = cards.filter(c => c.category === category);
  }
  
  const reviews = getAllReviews();
  
  let newCount = 0;
  let learningCount = 0;
  let reviewCount = 0;
  let masteredCount = 0;
  
  cards.forEach(card => {
    const review = reviews[card.id];
    if (!review) {
      newCount++;
    } else if (review.repetitions === 0) {
      learningCount++;
    } else if (review.repetitions < 5) {
      reviewCount++;
    } else {
      masteredCount++;
    }
  });
  
  return {
    total: cards.length,
    new: newCount,
    learning: learningCount,
    review: reviewCount,
    mastered: masteredCount
  };
}
