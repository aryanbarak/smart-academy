# Exam Materials Import Tools

اسکریپت‌های استخراج محتوای فایل‌های امتحانی IHK

## Available Scripts

### 1. `import-lessons.js`
لیست فایل‌های امتحانی موجود را نشان می‌دهد.

```bash
# List all available files
node scripts/import-lessons.js list

# Parse HTML file
node scripts/import-lessons.js parse "WISO_30_Aufgaben_DE_FA_print.html"
```

### 2. `extract-wiso-questions.js` ⭐ **USE THIS ONE**
۳۰ سوال امتحانی WISO را از HTML استخراج می‌کند و به فرمت TypeScript تبدیل می‌کند.

```bash
node scripts/extract-wiso-questions.js
```

**Output:**
- Generates 10 lesson objects
- Each lesson has 3 WISO exam questions
- Bilingual content (Deutsch + فارسی)
- Ready to paste into `constants.ts`

## How to Use

1. **Run the extraction script:**
   ```bash
   node scripts/extract-wiso-questions.js > wiso-lessons.txt
   ```

2. **Copy the output** to clipboard

3. **Open `constants.ts`** and find the last WISO lesson (currently `wiso-020`)

4. **Paste the new lessons** after the last existing lesson, before the `// --- PRÜFUNGSSIMULATION SECTION ---` comment

5. **Rebuild the project:**
   ```bash
   npm run build
   ```

6. **Test in browser** - you should now see 10 new WISO exam question lessons!

## File Structure

```
exam-materials/
├── WISO_30_Aufgaben_DE_FA_print.html  ← Main source
├── WISO_30_Aufgaben_DE_FA.html
├── Teil3_OOP_Tests_Patterns_PrintFriendly.html
└── [130+ PDF files - for future use]

scripts/
├── import-lessons.js              ← General file lister
├── extract-wiso-questions.js      ← WISO extractor (USE THIS!)
└── extract-exam-materials.js      ← Base extractor module
```

## Lesson Format

Each generated lesson follows this structure:

```typescript
{
  id: 'wiso-exam-01',
  type: 'WISO',
  title: 'WISO Prüfungsfragen 1',
  subtitle: 'Echte IHK Prüfungsfragen (3 Fragen)',
  level: 'Prüfung',
  order: 301,
  sections: [
    {
      headingDe: 'Frage 1',
      headingFa: 'سوال 1',
      contentDe: 'Question in German...',
      contentFa: 'Question in Persian...',
      language: 'text'
    },
    // ... more sections
  ]
}
```

## Integration Steps

1. Extract questions: `node scripts/extract-wiso-questions.js`
2. Find last WISO lesson in constants.ts (wiso-020)
3. Add comma after the last lesson closing bracket
4. Paste the 10 new exam lessons
5. Verify comma after each lesson (except the last one)
6. Run `npm run build`
7. Test by clicking WISO tab in app

## Next Steps

Future enhancements:
- [ ] Extract GA2 algorithm questions from PDF
- [ ] Extract OOP questions from HTML
- [ ] Extract SQL database questions
- [ ] Batch import all exam materials
- [ ] PDF text extraction utility
- [ ] Automatic lesson ID generation
- [ ] Validation and quality checks

---

✨ Created by GitHub Copilot | December 2, 2025
