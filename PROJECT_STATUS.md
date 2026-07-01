# Smart Academy — PROJECT STATUS

Keep this file under 2 pages; update after every session.

---

## Recent Decisions

| Date | Decision | Reason |
|------|----------|--------|
| 2026-07-01 | AI Agent replaced with simple Gemini Q&A | Old agent called local Python backend (broken by design) |
| 2026-07-01 | Model: gemini-1.5-flash | Free Tier, stable, no billing required |
| 2026-07-01 | API Key: VITE_GEMINI_API_KEY via import.meta.env | Vite convention; process.env doesn't work in browser |
| 2026-07-01 | Java PDF moved to PDF-Lerncenter | Doesn't belong in navbar |
| 2026-07-01 | Features page removed from navbar, link in Landing Page | Navbar too crowded; Features only relevant for new visitors |
| 2026-07-01 | Hero overlay (title + 3 buttons) removed from Landing Page | Visually cluttered on top of Hero Image |
| 2026-07-01 | Hero Image replaced: server-room.png → hero-academy.png | Gaming/server aesthetic wrong for educational platform |
| 2026-07-01 | Privacy Policy page added at /privacy | Required for Google Play submission |
| 2026-07-01 | Package renamed: com.fiae.lernplattform → com.smartacademy.app | Rebranding; affects Play Store identity |
| 2026-07-01 | WISO exam titles standardized to German (Prüfungsfragen) | 5 entries had English "Exam Questions" — inconsistent |
| 2026-07-01 | Pruefung typo fixed → Prüfung in navbar + LessonCard | UI-facing text had missing umlaut |
| 2026-07-01 | App icons replaced with new Smart Academy branding | Old FL initials replaced with graduation cap + </> icon |
| 2026-06-30 | Rebranding: FIAE Lernplattform → Smart Academy | Full rename across codebase, GitHub, Cloudflare |
| 2026-06-30 | Deployed to academy.barakzai.cloud | Cloudflare Pages + custom domain |
| 2026-06-30 | Keystore created: smart-academy-release.keystore | Required for Google Play release signing |
| 2026-06-30 | AAB Build working (Lint excluded) | lintVitalAnalyzeRelease fails due to Kotlin/Gradle version mismatch |
| 2026-07-01 | Logo size increased w-9→w-10 in navbar | Better visibility |
| 2026-07-01 | Weitermachen card: purple-to-blue gradient | More engaging UI |
| 2026-07-01 | Lesson cards: subtle indigo glow on hover | Polish |
| 2026-07-01 | Badges: solid bg-*-600 text-white (vibrant) | Better readability |
| 2026-07-01 | Lesson cards: fadeInUp animation on mount | Smooth UX |
| 2026-07-02 | Logo + name area clickable → navigates home (LandingPage + App.tsx) | UX: users expect logo to go home |
| 2026-07-02 | Android splash screen: dark #0F172A bg + app icon, Android 12+ via values-v31 | Brand consistency on app launch |
| 2026-07-02 | android/app/src/main/assets/ gitignored + untracked | Compiled JS bundles may contain env vars |
| 2026-07-02 | AgentPage: react-markdown + remark-gfm replaces formatAnswer() + dangerouslySetInnerHTML | Safe rendering of Gemini markdown output |
| 2026-07-02 | Model upgraded: gemini-1.5-flash → gemini-2.5-flash in AgentPage | Better answer quality, still free tier |
| 2026-07-02 | Mobile lesson cards: compact row layout (badge + title + chevron, expanded panel on tap) | Cards too large for mobile viewport |
| 2026-07-02 | Mobile navbar: hamburger menu with labeled dropdown (Stats, Quiz, Flash, PDF, AI…) | Desktop icon bar unreadable on mobile |
| 2026-07-02 | Mobile hero: h-40, 2×2 feature grid, descriptions hidden on mobile | Cards pushed below fold on small screens |
| 2026-07-02 | Empty states: t.dueNone / t.streakStart instead of bare '—' | Friendlier dashboard messaging |
| 2026-07-02 | Weitermachen title: line-clamp-2 (was truncate) | Long lesson names were cut mid-word |
| 2026-07-02 | Exam date form: flex-col on mobile, w-full on input+button | Button text overflowed on narrow screens |
| 2026-07-02 | Lesson card meta: RTL with dir="rtl" on Farsi spans, · separators | Correct text direction for mixed DE/FA metadata |
| 2026-07-02 | LandingPage always dark: theme toggle removed | Landing is brand-facing; dark is the identity |

---

## Known Bugs

| # | Bug | Severity | Status |
| --- | --- | --- | --- |
| 1 | Lint fails on bundleRelease (Kotlin/Gradle mismatch) | Low | Workaround: `-x lintVitalAnalyzeRelease` |
| 2 | Android build artifacts committed to repo (should be gitignored) | Low | Fixed: gitignored + untracked |
| 3 | icon-192.png.png (duplicate extension) in public/ | Low | Open |
| 4 | server-room.png still in public/ (unused) | Low | Can be deleted |
| 5 | AI responses show raw Markdown | Medium | Fixed: react-markdown + remark-gfm |

---

## Next / Backlog

### Google Play
1. **Feature Graphic** — 1024×500 px banner for Play Store listing
2. **Screenshots** — minimum 2 phone screenshots for Play Store
3. **Content Rating** — fill in questionnaire in Play Console
4. **Upload AAB** — `android/app/build/outputs/bundle/release/app-release.aab`
5. **Submit for review**

### Content
1. **PRUEF section** — add WISO mixed exam questions (currently only GA2)
2. **OOP content** — add Objektorientierung topic set
3. **More exam bank** — 2024/2025 IHK questions

### Technical
1. **Markdown rendering** — replace formatAnswer() with proper renderer (react-markdown)
2. **AI chat history** — store questions/answers in localStorage (session only)
3. **npx cap sync** — run after any web build to sync Android assets
4. **Update Android build artifacts** — regenerate after icon change

### Design
1. **App screenshots for Play Store** — capture from academy.barakzai.cloud on mobile
2. **Feature Graphic** — 1024×500 promotional banner

---

## Blocked Tasks

| Task | Blocked by | Notes |
|------|-----------|-------|
| Google Play submission | Feature Graphic + Screenshots missing | Need 2 phone screenshots minimum |
| AI chat history | No backend/Supabase in Smart Academy | Use localStorage as workaround |

---

## Key Files

| File | Purpose |
|------|---------|
| `constants.ts` | All 66 lessons (GA2×30, WISO×30, PRUEF×6) |
| `components/AgentPage.tsx` | AI Lernassistent (Gemini 1.5 Flash) |
| `components/LandingPage.tsx` | Home page + Features section |
| `src/i18n.ts` | All UI strings (DE + FA) |
| `public/manifest.json` | PWA manifest with new icons |
| `android/key.properties` | Signing config (gitignored — never commit) |
| `android/smart-academy-release.keystore` | Release keystore (gitignored — backup safely!) |
| `.env.local` | VITE_GEMINI_API_KEY (gitignored) |
