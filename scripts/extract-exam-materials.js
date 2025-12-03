#!/usr/bin/env node

/**
 * Extract Exam Materials Script
 * استخراج محتوای فایل‌های امتحانی HTML و متنی
 * 
 * This script reads HTML and text files from exam-materials folder
 * and converts them into lesson format for constants.ts
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const EXAM_MATERIALS_DIR = path.join(__dirname, '../exam-materials');
const OUTPUT_FILE = path.join(__dirname, '../exam-lessons.json');

/**
 * Extract text from HTML file
 */
function extractFromHTML(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const dom = new JSDOM(content);
    const { document } = dom.window;
    
    // Remove script and style elements
    document.querySelectorAll('script, style').forEach(el => el.remove());
    
    const text = document.body.innerText;
    return text.trim();
  } catch (error) {
    console.error(`Error reading HTML file ${filePath}:`, error.message);
    return '';
  }
}

/**
 * Extract text from text file
 */
function extractFromText(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8').trim();
  } catch (error) {
    console.error(`Error reading text file ${filePath}:`, error.message);
    return '';
  }
}

/**
 * Parse WISO content
 */
function parseWISOContent(text) {
  const lines = text.split('\n').filter(l => l.trim());
  const lessons = [];
  
  let currentLesson = null;
  let currentSection = null;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip empty lines and headers that are too generic
    if (!trimmed || trimmed.length < 3) continue;
    
    // Detect lesson title (usually contains these keywords)
    if (/^(Frage|Question|سوال|Aufgabe|Task)/i.test(trimmed)) {
      if (currentLesson && currentSection) {
        currentLesson.sections.push(currentSection);
      }
      
      currentLesson = {
        title: trimmed.substring(0, 60),
        sections: []
      };
      currentSection = {
        headingDe: trimmed.substring(0, 60),
        headingFa: 'سوال امتحانی',
        contentDe: '',
        contentFa: ''
      };
    } else if (currentSection) {
      // Add content to current section
      if (currentSection.contentDe.length < 500) {
        currentSection.contentDe += (currentSection.contentDe ? '\n' : '') + trimmed;
      }
    }
  }
  
  // Add last section
  if (currentLesson && currentSection) {
    currentLesson.sections.push(currentSection);
  }
  
  return lessons;
}

/**
 * Main function
 */
function main() {
  console.log('🔍 Scanning exam-materials directory...\n');
  
  if (!fs.existsSync(EXAM_MATERIALS_DIR)) {
    console.error('❌ exam-materials directory not found!');
    process.exit(1);
  }
  
  const files = fs.readdirSync(EXAM_MATERIALS_DIR);
  const htmlFiles = files.filter(f => f.endsWith('.html'));
  const textFiles = files.filter(f => f.endsWith('.txt') || f.endsWith('.docx'));
  
  console.log(`📄 Found ${htmlFiles.length} HTML files`);
  console.log(`📄 Found ${textFiles.length} text files\n`);
  
  const extractedLessons = [];
  
  // Process HTML files
  for (const file of htmlFiles) {
    const filePath = path.join(EXAM_MATERIALS_DIR, file);
    console.log(`📖 Processing: ${file}`);
    
    const text = extractFromHTML(filePath);
    if (text.length > 100) {
      const lessons = parseWISOContent(text);
      extractedLessons.push(...lessons);
      console.log(`   ✅ Extracted ${lessons.length} sections\n`);
    } else {
      console.log(`   ⚠️  File too short or empty\n`);
    }
  }
  
  console.log(`\n✨ Total extracted: ${extractedLessons.length} lesson sections`);
  
  // Save to JSON for review
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(extractedLessons, null, 2));
  console.log(`📁 Saved to: ${OUTPUT_FILE}`);
  
  return extractedLessons;
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { extractFromHTML, extractFromText, parseWISOContent };
