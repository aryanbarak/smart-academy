#!/usr/bin/env node

/**
 * WISO Exam Questions Extractor
 * Extract 30 WISO exam questions from HTML
 * ۳۰ سوال امتحانی WISO را استخراج کند
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXAM_DIR = path.join(__dirname, '../exam-materials');

/**
 * Extract WISO questions from HTML
 */
function extractWISOQuestions(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf-8');
  
  // Split by common question markers
  const parts = html.split(/(?:<\/div>|<hr|---|\n\n)/);
  
  const questions = [];
  let qNum = 1;
  
  for (const part of parts) {
    // Remove HTML tags
    let text = part.replace(/<[^>]*>/g, '').trim();
    
    // Decode entities
    text = text
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&');
    
    // Look for question-answer pattern (DE | FA)
    const match = text.match(/^(.+?)\s*\|\s*(.+?)$/m);
    
    if (match && text.length > 20) {
      const de = match[1].trim();
      const fa = match[2].trim();
      
      if (de.length > 10 && fa.length > 5) {
        questions.push({
          num: qNum++,
          de,
          fa,
          full: text
        });
      }
    } else if (text.length > 50 && !text.includes('font') && !text.includes('style')) {
      questions.push({
        num: qNum++,
        de: text.substring(0, 200),
        fa: 'سوال امتحانی',
        full: text
      });
    }
    
    if (qNum > 35) break; // Limit to 35
  }
  
  return questions.slice(0, 30);
}

/**
 * Generate lesson from questions
 */
function generateLessons(questions) {
  const lessons = [];
  
  // Group into lessons (3 questions per lesson)
  for (let i = 0; i < questions.length; i += 3) {
    const batch = questions.slice(i, i + 3);
    const lessonNum = Math.floor(i / 3) + 1;
    
    const sections = batch.map((q, idx) => `      {
        headingDe: 'Frage ${q.num}',
        headingFa: 'سوال ${q.num}',
        contentDe: '${q.de.substring(0, 300).replace(/'/g, "\\'")}',
        contentFa: '${q.fa.substring(0, 300).replace(/'/g, "\\'")}',
        language: 'text'
      }`);
    
    const lesson = `  {
    id: 'wiso-exam-${String(lessonNum).padStart(2, '0')}',
    type: 'WISO',
    title: 'WISO Prüfungsfragen ${lessonNum}',
    subtitle: 'Echte IHK Prüfungsfragen (${batch.length} Fragen)',
    level: 'Prüfung',
    order: ${300 + lessonNum},
    sections: [
${sections.join(',\n')}
    ]
  }`;
    
    lessons.push(lesson);
  }
  
  return lessons;
}

/**
 * Main
 */
function main() {
  const htmlPath = path.join(EXAM_DIR, 'WISO_30_Aufgaben_DE_FA_print.html');
  
  console.log('\n🔍 Extracting WISO exam questions...\n');
  
  if (!fs.existsSync(htmlPath)) {
    console.error(`❌ File not found: ${htmlPath}`);
    process.exit(1);
  }
  
  const questions = extractWISOQuestions(htmlPath);
  console.log(`✅ Extracted ${questions.length} questions\n`);
  
  const lessons = generateLessons(questions);
  console.log(`📚 Generated ${lessons.length} lesson objects\n`);
  
  console.log('// ========== WISO Exam Questions ==========');
  console.log('// Copy these lessons into constants.ts\n');
  
  lessons.forEach(lesson => {
    console.log(lesson + ',\n');
  });
  
  console.log('// ========== End WISO Exam Questions ==========\n');
}

main();
