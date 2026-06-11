import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI, Modality } from '@google/genai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const port = process.env.SERVER_PORT || 4000;
const apiKey = process.env.API_KEY;

let aiClient = null;
if (apiKey) {
  aiClient = new GoogleGenAI({ apiKey });
  console.log('AI client initialized');
} else {
  console.warn('API_KEY not set — AI endpoints will return mock responses for development');
}

app.post('/api/ask', async (req, res) => {
  const { context = '', question = '' } = req.body || {};
  if (!aiClient) {
    // Mock response for local development when no API key is provided
    const sample = `تست پاسخ: این یک پاسخ نمونه است.\n\nسوال شما: ${question}`;
    return res.json({ text: sample });
  }
  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Du bist ein hilfsbereiter Tutor für Fachinformatiker.\n\nKontext der Lektion:\n${context}\n\nFrage des Schülers:\n${question}\n\nAntworte kurz, präzise und verständlich auf Deutsch.`,
    });
    const text = response?.text || response?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    res.json({ text });
  } catch (err) {
    console.error('ask error', err);
    res.status(500).json({ error: 'AI request failed' });
  }
});

app.post('/api/simplify', async (req, res) => {
  const { text = '' } = req.body || {};
  if (!aiClient) {
    // Mock simplification: return the first 200 chars + a note
    const short = (text || '').slice(0, 200);
    const sample = `متن ساده‌شده (نمونه): ${short}${text && text.length > 200 ? '...' : ''}`;
    return res.json({ text: sample });
  }
  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Erkläre den folgenden Text in extrem einfacher Sprache (wie für einen Anfänger), nutze Bulletpoints wenn nötig:\n\n"${text}"`,
    });
    const out = response?.text || response?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    res.json({ text: out });
  } catch (err) {
    console.error('simplify error', err);
    res.status(500).json({ error: 'AI request failed' });
  }
});

app.post('/api/tts', async (req, res) => {
  const { text = '' } = req.body || {};
  if (!aiClient) {
    // Mock TTS: Generate a 2-second tone (440Hz sine wave - A note)
    // This creates an audible beep for development/testing
    const sampleRate = 24000;
    const frequency = 440; // A note
    const duration = 2; // seconds
    const samples = sampleRate * duration;
    
    const pcmData = new Int16Array(samples);
    for (let i = 0; i < samples; i++) {
      const value = Math.sin((2 * Math.PI * frequency * i) / sampleRate);
      pcmData[i] = Math.max(-32768, Math.min(32767, value * 32767 * 0.3)); // 30% volume
    }
    
    const buffer = Buffer.from(pcmData.buffer);
    const mockAudio = buffer.toString('base64');
    return res.json({ data: mockAudio });
  }
  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
        },
      },
    });

    const base64 = response?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64) return res.status(500).json({ error: 'No audio returned from AI' });
    res.json({ data: base64 });
  } catch (err) {
    console.error('tts error', err);
    res.status(500).json({ error: 'AI request failed' });
  }
});

// Generate a new IHK-style question from lesson content
app.post('/api/generate-question', async (req, res) => {
  const { lessonContent = '', category = 'GA2', difficulty = 'medium' } = req.body || {};
  if (!aiClient) {
    return res.json({
      question: 'Was ist die Zeitkomplexität von BubbleSort im Durchschnitt?',
      questionFa: 'پیچیدگی زمانی BubbleSort به طور میانگین چیست؟',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
      optionsFa: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
      correctAnswer: 2,
      explanation: 'BubbleSort hat im Durchschnitt O(n²) wegen der zwei verschachtelten Schleifen.',
      explanationFa: 'BubbleSort به طور میانگین O(n²) است به دلیل دو حلقه تو در تو.',
    });
  }
  try {
    const prompt = `Du bist ein IHK-Prüfungsexperte für Fachinformatiker Anwendungsentwicklung.

Erstelle GENAU eine Multiple-Choice-Frage auf Basis dieses Lernmaterials:
"""
${lessonContent.slice(0, 1500)}
"""

Schwierigkeitsgrad: ${difficulty} (easy/medium/hard)
Kategorie: ${category}

Antworte NUR mit diesem JSON (kein Markdown, keine Erklärung darum):
{
  "question": "Deutsche Frage",
  "questionFa": "Farsi Übersetzung",
  "options": ["A", "B", "C", "D"],
  "optionsFa": ["A فارسی", "B فارسی", "C فارسی", "D فارسی"],
  "correctAnswer": 0,
  "explanation": "Deutsche Erklärung",
  "explanationFa": "توضیح فارسی"
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    const raw = response?.text || response?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    // Strip markdown code fences if present
    const cleaned = raw.replaceAll(/```json?\s*/gi, '').replaceAll('```', '').trim();
    const parsed = JSON.parse(cleaned);
    res.json(parsed);
  } catch (err) {
    console.error('generate-question error', err);
    res.status(500).json({ error: 'Frage konnte nicht generiert werden' });
  }
});

// Analyse weak spots based on quiz history
app.post('/api/weak-spots', async (req, res) => {
  const { quizHistory = [], errorBank = [] } = req.body || {};
  if (!aiClient) {
    return res.json({
      summary: 'Keine API-Verbindung — Analyse nicht verfügbar.',
      summaryFa: 'اتصال API وجود ندارد — تحلیل در دسترس نیست.',
      weakAreas: [],
      recommendation: 'Bitte API_KEY setzen für personalisierte Analyse.',
      recommendationFa: 'برای تحلیل شخصی‌سازی شده API_KEY را تنظیم کنید.',
    });
  }
  try {
    const historyStr = JSON.stringify(quizHistory.slice(0, 10));
    const errorStr = JSON.stringify(errorBank.slice(0, 15));
    const prompt = `Du bist ein Lernassistent für FIAE-Azubis.

Quiz-Verlauf (letzte 10 Sessionen):
${historyStr}

Fehlerbank (falsch beantwortete Fragen):
${errorStr}

Analysiere die Schwächen und antworte NUR mit diesem JSON:
{
  "summary": "Kurze Zusammenfassung auf Deutsch",
  "summaryFa": "خلاصه به فارسی",
  "weakAreas": ["Thema1", "Thema2", "Thema3"],
  "recommendation": "Konkrete Lernempfehlung auf Deutsch",
  "recommendationFa": "توصیه یادگیری به فارسی"
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    const raw = response?.text || response?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const cleaned = raw.replaceAll(/```json?\s*/gi, '').replaceAll('```', '').trim();
    const parsed = JSON.parse(cleaned);
    res.json(parsed);
  } catch (err) {
    console.error('weak-spots error', err);
    res.status(500).json({ error: 'Analyse fehlgeschlagen' });
  }
});

app.get('/health', (_req, res) => res.json({ ok: true }));

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
