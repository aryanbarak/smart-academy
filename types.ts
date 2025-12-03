export type CourseType = 'GA2' | 'WISO' | 'PRUEF';

export interface LessonSection {
  headingDe: string;
  headingFa: string;
  contentDe: string;
  contentFa: string;
  codeSnippet?: string;
  language?: string; // e.g., "python", "pseudo", "java"
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  type: CourseType;
  level: string; // e.g., "Level 1", "Basic"
  order: number;
  sections: LessonSection[];
}