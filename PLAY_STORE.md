# Smart Academy — Play Store Data Safety

Reference for filling in the **Data safety** section in Google Play Console.
Copy the answers from this table into the corresponding Play Console fields.

---

## Data Safety Questionnaire Answers

| Play Console Question | Answer |
| --- | --- |
| Does your app collect or share any of the required user data types? | **Yes** (AI queries only — see below) |
| Is all of the user data collected by your app encrypted in transit? | **Yes** — HTTPS for all network communication |
| Do you provide a way for users to request that their data is deleted? | **Yes** — uninstalling the app deletes all locally stored data |

---

## Data Types — Collected / Shared

| Data type | Collected | Shared | Purpose | Required or optional |
| --- | --- | --- | --- | --- |
| User-entered AI queries (text) | Yes — sent to Google Gemini API | Shared with Google (Gemini) | App functionality: generate AI answers | Required for AI feature |
| Learning progress (lesson completions, streaks, flashcard reviews) | Stored locally on device only | **Not shared** | App functionality | Required |
| Exam date set by user | Stored locally on device only | **Not shared** | App functionality | Optional |
| Language preference (DE / FA) | Stored locally on device only | **Not shared** | App functionality | Required |
| App settings (dark mode, PDF view) | Stored locally on device only | **Not shared** | App functionality | Required |

---

## What is NOT collected

- No account or login required
- No name, email address, phone number, or any personal identifiers
- No location data
- No device identifiers (IMEI, advertising ID)
- No analytics or crash reporting
- No advertising or tracking SDKs
- No third-party analytics (no Firebase, no Mixpanel, no Amplitude)

---

## Third-Party Data Sharing

| Recipient | Data shared | Purpose | Link |
| --- | --- | --- | --- |
| Google LLC (Gemini API) | Text of AI questions typed by the user | Generating AI answers | https://ai.google.dev/gemini-api/terms |

Google's AI data handling: https://policies.google.com/privacy

**No other third parties receive any data.**

---

## Local Storage Details

All user progress is stored on-device using `localStorage` / `@capacitor/preferences`.  
These values **never leave the device** unless the user explicitly exports them.

Keys stored locally:

| Key | Contents |
| --- | --- |
| `fiae_lesson_progress` | Lesson completion status and time spent |
| `fiae_study_stats` | Study streak and total study time |
| `fiae_flashcard_reviews` | Spaced-repetition review schedule |
| `fiae_flashcards` | Generated flashcard content |
| `fiae_bookmarks` | Bookmarked lessons |
| `fiae_error_bank` | Wrong answers for review |
| `fiae_quiz_history` | Quiz session history |
| `fiae_exam_date` | User-set exam date |
| `fiae_lang` | Language preference |
| `darkMode` | UI theme preference |

Deleting app data (Android Settings → Apps → Smart Academy → Clear Data) removes all of the above.

---

## Play Console — Short Descriptions for Data Safety Form

**AI queries field (user-entered text):**
> Text questions the user types into the AI assistant. Sent to Google Gemini API to generate answers. Not stored by the app after the session ends.

**Purpose:**  App functionality

**Is this data shared with third parties?** Yes — Google LLC (Gemini API)

**Is this data processed ephemerally?** Yes — not persisted after session

---

## Privacy Policy URL

https://academy.barakzai.cloud/privacy

---

## App Content Rating

Recommended Play Console content rating: **Everyone (E)**  
No violence, no adult content, no gambling, no user-generated content (AI output is educational).
