#!/usr/bin/env node

/**
 * Universal Exam Materials Importer (ES Module)
 * Import exam questions and content into lesson format
 * یک ابزار برای import کردن فایل‌های امتحانی
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXAM_DIR = path.join(__dirname, '../exam-materials');

/**
 * Read HTML file and extract text
 */
function readHTMLFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Remove HTML tags
    content = content.replace(/<[^>]*>/g, '');
    
    // Decode HTML entities
    content = content
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'");
    
    // Remove multiple spaces
    content = content.replace(/\s+/g, ' ').trim();
    
    return content;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return '';
  }
}

/**
 * List available files
 */
function listFiles() {
  console.log('\n📂 Available exam material files:\n');
  
  const files = fs.readdirSync(EXAM_DIR);
  
  const htmlFiles = files.filter(f => f.endsWith('.html'));
  const pdfFiles = files.filter(f => f.endsWith('.pdf'));
  
  console.log(`🟦 HTML Files (${htmlFiles.length}):`);
  htmlFiles.slice(0, 5).forEach(f => console.log(`   ✓ ${f}`));
  if (htmlFiles.length > 5) console.log(`   ... and ${htmlFiles.length - 5} more\n`);
  
  console.log(`📕 PDF Files (${pdfFiles.length}):`);
  pdfFiles.slice(0, 5).forEach(f => console.log(`   ✓ ${f}`));
  if (pdfFiles.length > 5) console.log(`   ... and ${pdfFiles.length - 5} more\n`);
}

/**
 * CLI Mode
 */
function cliMode(args) {
  if (args.length < 1) {
    console.log('\n📚 Exam Materials Import Tool\n');
    console.log('Usage: node scripts/import-lessons.js <command>\n');
    console.log('Commands:');
    console.log('  list              List available files');
    console.log('  parse <file>      Extract text from HTML file\n');
    process.exit(0);
  }

  const command = args[0];
  const file = args[1];

  if (command === 'list') {
    listFiles();
  } else if (command === 'parse' && file) {
    const filePath = path.join(EXAM_DIR, file);
    
    if (!fs.existsSync(filePath)) {
      console.error(`\n❌ File not found: ${filePath}\n`);
      process.exit(1);
    }

    console.log(`\n📖 Parsing: ${path.basename(filePath)}...\n`);
    
    const text = readHTMLFile(filePath);
    console.log(`✅ Extracted ${text.length} characters\n`);
    console.log('Content preview (first 500 chars):\n');
    console.log(text.substring(0, 500));
    console.log('\n...\n');
  }
}

/**
 * Main
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length > 0) {
    cliMode(args);
  } else {
    listFiles();
  }
}

main();
