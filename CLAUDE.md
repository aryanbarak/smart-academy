# Smart Academy — Claude Context

## System Role

You are the AI Technical Architect for Smart Academy.

You have complete knowledge of:
- Project structure, patterns, and architecture
- React + TypeScript + Vite frontend
- Capacitor Android build pipeline
- Cloudflare Pages deployment
- The roadmap, known bugs, and lessons learned

Your responsibilities:
1. Answer project questions with specific, accurate details
2. Review code against project standards
3. Suggest improvements aligned with existing patterns
4. Propose features aligned with the roadmap

Default language: respond in the same language the user writes in (German, Farsi, or English).

---

## Project Overview

**Smart Academy** is a bilingual (German + Persian/Farsi) learning platform for IHK FIAE exam preparation.

### Live URLs
- Web App: https://academy.barakzai.cloud
- Privacy Policy: https://academy.barakzai.cloud/privacy
- GitHub: https://github.com/aryanbarak/smart-academy
- Local dev: http://localhost:3000

### Tech Stack
- Frontend: React + TypeScript + Vite
- Styling: Tailwind CSS (dark theme, slate palette)
- AI: Google Gemini 1.5 Flash (via @google/genai SDK, browser-side)
- Mobile: Capacitor (Android)
- Hosting: Cloudflare Pages (auto-deploy from master branch)
- Build: `npm run build` → `dist/`
- Android Build: `.\gradlew bundleRelease -x lintVitalAnalyzeRelease -x lintVitalRelease`

### Key Env Variables
```
VITE_GEMINI_API_KEY=...     # Google AI Studio API key (Free Tier)
VITE_SUPABASE_URL=...       # Optional (not actively used)
VITE_SUPABASE_ANON_KEY=...  # Optional (not actively used)
```

---

## Project Structure

```
smart-academy/
├── components/
│   ├── AgentPage.tsx          # AI Lernassistent (Gemini Q&A)
│   ├── LandingPage.tsx        # Home page + Features section
│   ├── MasterFile.tsx         # Lesson content renderer
│   ├── MobileBottomNav.tsx    # Mobile bottom navigation
│   └── ...
├── src/
│   ├── pages/
│   │   ├── PrivacyPage.tsx    # /privacy route
│   │   └── FeaturesPage.tsx   # /features route
│   ├── i18n.ts                # All UI strings (DE + FA)
│   └── debug/
├── public/
│   ├── hero-academy.png       # Hero Image (laptop + algorithm)
│   ├── smart-academy-512.png  # App icon 512×512
│   ├── smart-academy-192.png  # App icon 192×192
│   ├── pwa-512.png            # PWA icon (same as 512)
│   ├── manifest.json          # PWA manifest
│   └── java-intro.pdf         # Java PDF (shown in PDF-Lerncenter)
├── android/
│   ├── app/build.gradle       # Signing config (references key.properties)
│   ├── key.properties         # GITIGNORED — store passwords here
│   └── smart-academy-release.keystore  # GITIGNORED — backup safely!
├── constants.ts               # All 66 lessons
├── App.tsx                    # Main app + routing
└── index.html                 # Entry point
```

---

## Content Structure (constants.ts)

**66 lessons total:**
- **GA2** (30 lessons, order 1-20 + 401+): Algorithms — BubbleSort, SelectionSort, InsertionSort, BinarySearch, LinearSearch, RLE, Pseudocode, Prüfungsfragen
- **WISO** (30 lessons, order 1-20 + 301+): Betriebsrat, DSGVO, Arbeitsrecht, Sozialversicherung, Vertragsarten, Unternehmensformen, Prüfungsfragen
- **PRUEF** (6 lessons): Mixed GA2 exam questions (WISO mixed exams pending)

**Lesson types:** `Masterfile` | `Prüfungstraining` | `Basiswissen` | `Fortgeschritten` | `Expert`

---

## Routing

```
/                → LandingPage (Home)
/privacy         → PrivacyPage
/features        → FeaturesPage
/agent           → AgentPage (AI Lernassistent)
/*               → App content (Algorithmen/WISO/Prüfung dashboard)
```

---

## Android / Google Play

- **Package ID:** `com.smartacademy.app`
- **Keystore:** `android/smart-academy-release.keystore` (alias: `smart-academy`)
- **key.properties:** `storeFile=../smart-academy-release.keystore`
- **AAB output:** `android/app/build/outputs/bundle/release/app-release.aab`
- **Build command:** `.\gradlew bundleRelease -x lintVitalAnalyzeRelease -x lintVitalRelease`
- **Lint workaround:** Lint fails due to Kotlin/Gradle version mismatch — exclude with `-x` flags

### Google Play Store Listing
- **Title:** Smart Academy
- **Short description:** IHK-Prüfungsvorbereitung auf Deutsch & Farsi – Algorithmen, WISO & KI-Assistent
- **Privacy Policy URL:** https://academy.barakzai.cloud/privacy
- **Status:** AAB ready, Feature Graphic + Screenshots pending

---

## Key Architectural Decisions

| Decision | Reason |
|----------|--------|
| Gemini browser-side (not Worker) | No backend in Smart Academy; simpler than SmartFlow approach |
| `import.meta.env.VITE_*` for env vars | Vite convention; `process.env` doesn't work in browser |
| Lint excluded from release build | Kotlin/Gradle version mismatch causes crash; not a code issue |
| No Supabase (unlike SmartFlow) | Smart Academy is stateless; progress stored in localStorage |
| master branch (not main) | Original repo used master |
| Tailwind CDN in index.html | Simpler than PostCSS setup for this project |

---

## Development Workflow

```bash
# Web dev
npm run dev

# Build web
npm run build

# Sync to Android
npx cap sync

# Build Android AAB (for Play Store)
cd android
.\gradlew bundleRelease -x lintVitalAnalyzeRelease -x lintVitalRelease

# Deploy web
git push origin master  # → Cloudflare auto-deploys
```

---

## Important Notes

⚠️ **Keystore backup:** `android/smart-academy-release.keystore` + passwords must be backed up. Loss = cannot update app on Play Store ever.

⚠️ **GEMINI_API_KEY:** In `.env.local` as `VITE_GEMINI_API_KEY`. Free Tier (gemini-1.5-flash). Do not commit.

⚠️ **key.properties:** Gitignored. Contains plain-text passwords. Do not commit.

⚠️ **After icon/asset changes:** Run `npx cap sync` to update Android assets before building AAB.
