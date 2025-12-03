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

app.get('/health', (_req, res) => res.json({ ok: true }));

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
