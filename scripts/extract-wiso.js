#!/usr/bin/env node

/**
 * WISO HTML Extractor
 * Extract WISO exam questions from HTML files
 * فایل‌های HTML امتحانی WISO را تحلیل کند
 */

const fs = require('fs');
const path = require('path');

const WISO_HTML_FILE = path.join(__dirname, '../exam-materials/WISO_30_Aufgaben_DE_FA_print.html');

/**
 * Extract questions from WISO HTML
 */
function extractWISOQuestions() {
  try {
    const content = fs.readFileSync(WISO_HTML_FILE, 'utf-8');
    
    // Extract all table rows (if structured as table)
    const questionPattern = /(?:<tr>|<div[^>]*>)(.*?)(?:<\/tr>|<\/div>)/gs;
    const matches = content.matchAll(questionPattern);
    
    const questions = [];
    
    for (const match of matches) {
      const row = match[1];
      
      // Extract German and Persian text
      const deMatch = row.match(/>(.*?)<\/td>/);
      const faMatch = row.match(/>(.+?)<\/td>.*?>(.*?)<\/td>/);
      
      if (deMatch) {
        questions.push({
          de: deMatch[1].replace(/<[^>]*>/g, '').trim(),
          fa: faMatch ? faMatch[2].replace(/<[^>]*>/g, '').trim() : ''
        });
      }
    }
    
    return questions;
  } catch (error) {
    console.error('Error reading WISO file:', error.message);
    return [];
  }
}

/**
 * Convert questions to lesson format
 */
function convertToLessons(questions) {
  const lessons = [];
  let lessonIndex = 21; // Start from wiso-021 (after existing 20 lessons)
  
  // Group questions into lessons (every 3-4 questions = 1 lesson)
  for (let i = 0; i < questions.length; i += 3) {
    const batch = questions.slice(i, i + 3);
    
    if (batch.length > 0) {
      const lesson = {
        id: `wiso-${String(lessonIndex).padStart(3, '0')}`,
        type: 'WISO',
        title: `WISO Prüfungsfragen ${i / 3 + 1}`,
        subtitle: 'Echte IHK Prüfungsfragen mit Lösungen',
        level: 'Prüfung',
        order: lessonIndex - 8,
        sections: batch.map((q, idx) => ({
          headingDe: `Frage ${idx + 1}`,
          headingFa: `سوال ${idx + 1}`,
          contentDe: q.de,
          contentFa: q.fa || '(ترجمه درحال تهیه)',
          language: 'text'
        }))
      };
      
      lessons.push(lesson);
      lessonIndex++;
    }
  }
  
  return lessons;
}

/**
 * Main
 */
function main() {
  console.log('🔍 Extracting WISO questions from HTML...\n');
  
  if (!fs.existsSync(WISO_HTML_FILE)) {
    console.log(`⚠️  File not found: ${WISO_HTML_FILE}`);
    console.log('\n✅ Script ready. To use:');
    console.log('   1. Open the HTML file in a text editor');
    console.log('   2. Copy the questions');
    console.log('   3. Format them as JSON');
    return;
  }
  
  const questions = extractWISOQuestions();
  console.log(`📝 Extracted ${questions.length} questions\n`);
  
  if (questions.length > 0) {
    const lessons = convertToLessons(questions);
    console.log(`📚 Converted to ${lessons.length} lessons\n`);
    
    // Save to JSON
    const outputPath = path.join(__dirname, '../exam-lessons-wiso.json');
    fs.writeFileSync(outputPath, JSON.stringify(lessons, null, 2));
    console.log(`✅ Saved to: ${outputPath}`);
  } else {
    console.log('⚠️  No questions extracted. HTML structure may differ.');
  }
}

if (require.main === module) {
  main();
}

module.exports = { extractWISOQuestions, convertToLessons };
