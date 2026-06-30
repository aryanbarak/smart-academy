// This module provides client-safe wrappers for AI calls.
// In the browser we call local API endpoints (e.g. /api/simplify, /api/ask, /api/tts).
// On the server (Node) it will dynamically import and use @google/genai.

const isBrowser = typeof window !== 'undefined';

// Convert base64 to ArrayBuffer (browser)
function base64ToArrayBufferBrowser(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Convert base64 to ArrayBuffer (node)
function base64ToArrayBufferNode(base64: string): ArrayBuffer {
  const buf = Buffer.from(base64, 'base64');
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

export async function generateSpeech(text: string): Promise<ArrayBuffer> {
  if (isBrowser) {
    // Call local API endpoint; implement server proxy to forward to Google GenAI.
    const res = await fetch('http://localhost:4000/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error('TTS request failed');
    const payload = await res.json();
    const base64 = payload?.data;
    if (!base64) throw new Error('No audio returned from /api/tts');
    return base64ToArrayBufferBrowser(base64);
  }

  // Server-side: use @google/genai dynamically
  const { GoogleGenAI, Modality } = await import('@google/genai');
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-preview-tts',
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error('Keine Audio-Daten erhalten.');
  return base64ToArrayBufferNode(base64Audio);
}

export async function askGeminiTutor(_context: string, _question: string): Promise<string> {
  return 'ℹ️ Der KI-Tutor benötigt einen Gemini API-Schlüssel. Bitte wende dich an den Administrator, um diese Funktion zu aktivieren.';
}

export async function simplifyText(text: string): Promise<string> {
  // Local simplification: split into bullet points by sentence/newline
  const lines = text
    .split(/[.\n]/)
    .map(s => s.trim())
    .filter(s => s.length > 10);

  if (lines.length === 0) return text;

  const bullets = lines.map(line => `• ${line}`).join('\n');
  return `📌 Vereinfachte Version:\n\n${bullets}`;
}

export function speakText(text: string, lang: string = 'de-DE'): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);
    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export async function playAudioData(audioBuffer: ArrayBuffer) {
  if (typeof window === 'undefined') {
    throw new Error('playAudioData can only run in the browser');
  }

  // Validate minimum buffer size (less than ~100 bytes is too small for real audio)
  if (!audioBuffer || audioBuffer.byteLength < 100) {
    throw new Error('Invalid audio buffer - too small for playback');
  }

  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const pcmData = new Int16Array(audioBuffer);
    
    // Validate PCM data has samples
    if (pcmData.length === 0) {
      throw new Error('PCM data has no samples');
    }

    const float32Data = new Float32Array(pcmData.length);
    for (let i = 0; i < pcmData.length; i++) {
      float32Data[i] = pcmData[i] / 32768.0;
    }

    const buffer = audioContext.createBuffer(1, float32Data.length, 24000);
    buffer.copyToChannel(float32Data, 0);

    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start(0);

    return new Promise<void>((resolve) => {
      source.onended = () => {
        // Don't close context immediately - let it finish naturally
        resolve();
      };
      // Also resolve after expected playback duration + buffer
      const duration = (float32Data.length / 24000) * 1000 + 100;
      setTimeout(resolve, duration);
    });
  } catch (err) {
    console.error('Audio playback error:', err);
    throw new Error('Failed to play audio: ' + String(err));
  }
}