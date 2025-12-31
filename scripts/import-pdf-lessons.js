/**
 * Import text content from PDFs under exam-materials and generate lessons JSON grouped by category.
 * Categories inferred from filename: WISO, GA2, PRUEF (default: MISC).
 * Output: ./exam-materials/generated-lessons.json
 *
 * Usage (Windows PowerShell):
 *   node scripts/import-pdf-lessons.js
 */

const fs = require('fs');
const path = require('path');

// Lazy load pdfjs-dist in Node environment
async function loadPdfJs() {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf');
  const worker = await import('pdfjs-dist/legacy/build/pdf.worker.mjs?url');
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
  return pdfjs;
}

function inferCategory(filename) {
  const name = filename.toLowerCase();
  if (name.includes('wiso')) return 'WISO';
  if (name.includes('ga2') || name.includes('ga 2') || name.includes('ga-2')) return 'GA2';
  if (name.includes('pruef') || name.includes('prüfung') || name.includes('pruefung')) return 'PRUEF';
  return 'MISC';
}

async function extractPdfText(pdfjs, filePath) {
  const loadingTask = pdfjs.getDocument(filePath);
  const doc = await loadingTask.promise;
  const parts = [];
  for (let i = 1; i <= doc.numPages; i++) {
    try {
      const page = await doc.getPage(i);
      const tc = await page.getTextContent();
      const text = tc.items.map((it) => it.str).join(' ');
      parts.push(`# Seite ${i}\n\n${text}\n`);
    } catch (e) {
      parts.push(`# Seite ${i}\n\n(Fehler beim Auslesen dieser Seite)\n`);
    }
  }
  return parts.join('\n');
}

function toLessonId(base) {
  return base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

async function main() {
  const repoRoot = process.cwd();
  const examDir = path.join(repoRoot, 'exam-materials');
  const outFile = path.join(examDir, 'generated-lessons.json');

  if (!fs.existsSync(examDir)) {
    console.error('exam-materials directory not found at', examDir);
    process.exit(1);
  }

  const files = fs.readdirSync(examDir).filter((f) => f.toLowerCase().endsWith('.pdf'));
  if (files.length === 0) {
    console.log('No PDF files found in exam-materials.');
    process.exit(0);
  }

  const pdfjs = await loadPdfJs();
  const grouped = { WISO: [], GA2: [], PRUEF: [], MISC: [] };

  for (const fname of files) {
    const full = path.join(examDir, fname);
    const category = inferCategory(fname);
    console.log('Extracting', fname, '→', category);
    try {
      const text = await extractPdfText(pdfjs, full);
      const base = path.parse(fname).name;
      const lesson = {
        id: toLessonId(base),
        title: base,
        sourceFile: fname,
        sections: text.split(/\n{2,}/).map((s, idx) => ({
          id: `${toLessonId(base)}-s${idx + 1}`,
          title: s.slice(0, 60),
          body: s,
        })),
      };
      grouped[category].push(lesson);
    } catch (e) {
      console.error('Failed to extract', fname, e);
    }
  }

  fs.writeFileSync(outFile, JSON.stringify(grouped, null, 2), 'utf-8');
  console.log('Written lessons JSON to', outFile);
  console.log('You can import these into wiso-exam-content.ts or ga2-exam-content.ts as needed.');
}

main().catch((e) => {
  console.error('Import failed:', e);
  process.exit(1);
});
