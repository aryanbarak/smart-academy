/**
 * Merge generated lessons JSON into wiso-exam-content.ts and ga2-exam-content.ts
 * Maps sections to existing schema with headingDe/contentDe fields.
 *
 * Usage:
 *   node scripts/merge-generated-lessons.js
 */
const fs = require('fs');
const path = require('path');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}

function loadFile(p) {
  return fs.readFileSync(p, 'utf-8');
}

function saveFile(p, content) {
  fs.writeFileSync(p, content, 'utf-8');
}

function toSchemaLesson(baseLesson, type, orderBase) {
  return {
    id: `${type.toLowerCase()}-import-${baseLesson.id}`,
    type,
    title: baseLesson.title,
    subtitle: 'Importiert aus PDF',
    level: 'Prüfung',
    order: orderBase,
    sections: baseLesson.sections.map((s, idx) => ({
      headingDe: s.title || `Seite ${idx + 1}`,
      headingFa: '',
      contentDe: s.body,
      contentFa: '',
      language: 'text'
    }))
  };
}

function appendLessonsToTs(tsPath, exportName, newLessons) {
  let src = loadFile(tsPath);
  const marker = `export const ${exportName} = [`;
  const startIdx = src.indexOf(marker);
  if (startIdx === -1) {
    throw new Error(`Export ${exportName} not found in ${tsPath}`);
  }
  // find end of array by last occurrence of \n]; after marker
  const endIdx = src.lastIndexOf('\n]');
  if (endIdx === -1) {
    throw new Error('Array terminator not found');
  }
  const before = src.slice(0, endIdx);
  const after = src.slice(endIdx);
  const toAdd = newLessons.map((l) => JSON.stringify(l, null, 2)).join(',\n\n');
  const updated = `${before},\n\n${toAdd}${after}`;
  saveFile(tsPath, updated);
}

function main() {
  const repoRoot = process.cwd();
  const genPath = path.join(repoRoot, 'exam-materials', 'generated-lessons.json');
  if (!fs.existsSync(genPath)) {
    console.error('generated-lessons.json not found. Run import-pdf-lessons.js first.');
    process.exit(1);
  }
  const data = readJson(genPath);

  const wisoLessons = (data.WISO || []).map((l, i) => toSchemaLesson(l, 'WISO', 800 + i));
  const ga2Lessons = (data.GA2 || []).map((l, i) => toSchemaLesson(l, 'GA2', 900 + i));

  const wisoTs = path.join(repoRoot, 'wiso-exam-content.ts');
  const ga2Ts = path.join(repoRoot, 'ga2-exam-content.ts');

  if (wisoLessons.length) {
    appendLessonsToTs(wisoTs, 'wisoExamLessons', wisoLessons);
    console.log(`Appended ${wisoLessons.length} WISO lessons to wiso-exam-content.ts`);
  } else {
    console.log('No WISO lessons to append');
  }

  if (ga2Lessons.length) {
    appendLessonsToTs(ga2Ts, 'ga2ExamLessons', ga2Lessons);
    console.log(`Appended ${ga2Lessons.length} GA2 lessons to ga2-exam-content.ts`);
  } else {
    console.log('No GA2 lessons to append');
  }
}

main();
