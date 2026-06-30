# Smart Academy – AI Agent Guide

## Architecture snapshot
- React 19.2 + Vite entry in `App.tsx`; it centralises course tabs, timers, and toast notifications while lazy-loading heavy modals (`PdfFiles`, `SearchModal`, `StatsModal`, `QuizModal`, `FlashcardModal`, `ExamSimulation`) with `React.Suspense` to keep the initial bundle lean.
- Lesson metadata lives in `constants.ts` (plus `ga2-exam-content.ts` / `wiso-exam-content.ts` extensions) and is shaped by the `Lesson`/`LessonSection` types from `types.ts`; respect the bilingual fields (`headingDe`/`headingFa`, `contentDe`/`contentFa`) and ascending `order` for sort stability.
- UI controls use Tailwind utility classes injected via CDN in `index.html`, so no PostCSS build step exists—stick to class strings or extend the inline `tailwind.config` object when new tokens are needed.
- PWA shell is delivered through `index.html`, the `public/manifest.json`, and a cache-first service worker (`public/sw.js`) that expects assets at predictable paths.

## Persistence & analytics conventions
- Progress, bookmarks, notes, flashcards, searches, and PDF preferences persist in `localStorage` with namespaced keys (`fiae_*`); utilities in `utils/*.ts` cache parsed JSON in module scope, so mutate through the provided helpers to keep caches warm.
- Study timers in `App.tsx` use `updateLessonAccess` and `addStudyTime` (with minute batching) when an accordion is opened; if you add new entry points into lessons, call those utilities to keep streak analytics accurate.
- `getProgressByType` expects lesson IDs starting with the lowercase course code (e.g. `ga2-`); follow that pattern for new lessons or progress bars will undercount.
- Flashcard reviews implement SM-2 scheduling in `utils/flashcards.ts`; when recording outcomes, use `recordReview` so `easeFactor`, `interval`, and `nextReview` stay consistent across modals.

## AI integration & server proxy
- Browser code must call `utils/gemini.ts` helpers, which route to `http://localhost:4000/api/*`; the Express proxy in `server/index.js` reads `API_KEY`/`SERVER_PORT` from `.env` and falls back to deterministic mock responses when no key is present.
- TTS responses arrive as base64 PCM; `generateSpeech` returns an `ArrayBuffer` that `playAudioData` validates (>100 bytes) before playback—surface informative toasts when mocks are in use.
- Keep the model IDs in sync across client and server (`gemini-2.5-flash` for text, `gemini-2.5-flash-preview-tts` for audio) to avoid SDK mismatches.
- When expanding endpoints, mirror the browser fallback behaviour (predictable mock payloads, small buffers) so the app remains usable offline.

## Study tools (PDF, exams, flashcards)
- `components/PdfFiles.tsx` enumerates `/exam-materials/**` via `import.meta.glob`; drop new source files there (PDF/HTML) and they appear automatically, with recents tracked through `utils/recentFiles.ts`.
- `components/PdfEditor.tsx` lazily imports `pdfjs-dist/legacy` + `pdf-lib` and stores drawings/redactions per page; if you tweak tool behaviour, maintain the refs (`overlays`, `texts`, `redactions`) so exports remain aligned.
- Exam simulations mix curated questions with auto-generated ones (`generateQuestionsFromLessons`) based on section text—adding rich `contentDe` paragraphs improves question quality without touching logic.
- Flashcards auto-generate per course on first open and are filtered via `getDueFlashcards`; persist new card types with `saveFlashcards` to keep the spaced-repetition stats (`getFlashcardStats`) meaningful.
- Search modal relies on `utils/search.ts` to scan titles, headings, and bilingual body text; update that utility when introducing new searchable fields.

## UI & styling specifics
- Dark mode toggles by adding/removing the `dark` class on `document.documentElement`; any new global styles should respect that class for parity.
- Use the `font-farsi` class (defined in `index.html`) for RTL text blocks to keep the Persian typography consistent.
- Toast colours are driven by Tailwind classes in `components/Toast.tsx`; reuse the same palette (`bg-blue-500`, `bg-red-500`, etc.) so tests in `Toast.test.tsx` continue to assert the right selectors.

## Developer workflow
- Install deps with `npm install`, start the proxy via `npm run start:server`, then launch the UI with `npm run dev`; the browser expects the API on port `4000` unless you change `SERVER_PORT` in both `.env` and `utils/gemini.ts`.
- Vitest (configured in `vitest.config.ts` with `happy-dom` and the `@` alias to repo root) powers unit tests: `npm test` for watch mode or `npm test -- --run` for CI parity.
- Lint with `npm run lint`, and format via `npm run format`; the repo targets TypeScript 5.8 with `moduleResolution: bundler`, so prefer ESM syntax and extensionful imports when required.
- Android packaging lives under `android/` (Capacitor). Run `npm run build` before `npx cap sync android`, and keep `capacitor.config.ts` aligned with the built `dist` folder.
- Service worker caching means static asset paths are sticky—bump `CACHE_NAME` in `public/sw.js` whenever you add critical offline resources.

## Content automation
- Scripts in `scripts/` (see `scripts/README.md`) extract exam questions from HTML/PDF. Use `node scripts/extract-wiso-questions.js` to regenerate WISO lessons and append them after the `// --- PRÜFUNGSSIMULATION SECTION ---` marker in `constants.ts`.
- Keep lesson IDs unique and sequential (`ga2-001`, `wiso-201`, `pruef-401` style); scripts and progress metrics assume numeric suffixes increase with difficulty.
- When shipping new bilingual content, verify both languages render in the split layout (`MasterFile.tsx`) and include fallback `contentFa` text to avoid empty RTL columns.
