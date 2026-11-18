import { NextRequest, NextResponse } from 'next/server';

function splitTeluguText(text: string, maxLen: number = 150): string[] {
  const sentences = text
    .replace(/([.!?।\n])\s+/g, '$1|')
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean);

  const chunks: string[] = [];

  for (const sentence of sentences) {
    if (sentence.length <= maxLen) {
      chunks.push(sentence);
    } else {
      const words = sentence.split(/\s+/);
      let current = '';
      for (const word of words) {
        if ((current ? current + ' ' + word : word).length <= maxLen) {
          current = current ? current + ' ' + word : word;
        } else {
          if (current) chunks.push(current);
          current = word;
        }
      }
      if (current) chunks.push(current);
    }
  }

  return chunks.length > 0 ? chunks : [text.slice(0, maxLen)];
}

// Murf AI Falcon Real-Time TTS Endpoint
async function fetchMurfFalconAudio(text: string, apiKey: string): Promise<Uint8Array | null> {
  const url = 'https://in.api.murf.ai/v1/speech/stream';
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        voiceId: 'Anisha',
        model: 'falcon-2.1',
        text: text,
        locale: 'te-IN',
        format: 'MP3',
      }),
    });

    if (res.ok) {
      const arrayBuffer = await res.arrayBuffer();
      return new Uint8Array(arrayBuffer);
    }
    console.warn(`Murf Falcon API returned status ${res.status}`);
    return null;
  } catch (err) {
    console.warn('Murf Falcon API connection exception:', err);
    return null;
  }
}

// Fallback to Google Translate TTS
async function fetchGoogleChunkAudio(chunk: string): Promise<Uint8Array | null> {
  const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=te&client=tw-ob&q=${encodeURIComponent(
    chunk
  )}`;

  try {
    const res = await fetch(ttsUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Referer: 'https://translate.google.com/',
      },
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (error) {
    console.warn('Google TTS fetch error:', error);
    return null;
  }
}

// In-memory LRU-style cache to prevent re-fetching and audio dropouts on repeated clicks
const ttsCache = new Map<string, { buffer: ArrayBuffer; engine: string }>();

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const text = searchParams.get('text');
  const persona = (searchParams.get('persona') || 'lakshmi').toLowerCase();
  const murfKey = searchParams.get('murfKey') || process.env.MURF_API_KEY || '';
  const isSlow = searchParams.get('slow') === 'true';

  if (!text || !text.trim()) {
    return new NextResponse('Missing text parameter', { status: 400, headers: CORS_HEADERS });
  }

  const cleanText = text.trim();
  const cacheKey = `${persona}_${isSlow ? 'slow_' : ''}${cleanText}`;

  // Return cached audio immediately (0ms latency for repeated words & syllables)
  if (ttsCache.has(cacheKey)) {
    const cached = ttsCache.get(cacheKey)!;
    // Do not serve generic female Google fallback when a distinct male or child persona was requested
    if (!(cached.engine === 'Google-Fallback' && (persona === 'srinivas' || persona === 'child' || persona === 'mohan'))) {
      return new NextResponse(cached.buffer, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': cached.buffer.byteLength.toString(),
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
          'X-Voice-Engine': `${cached.engine}-Cached`,
          ...CORS_HEADERS,
        },
      });
    }
  }

  // 1. If persona is Anisha (Falcon) and Murf API Key is provided, call live Murf Falcon streaming API
  if (persona === 'anisha' && murfKey) {
    const murfAudio = await fetchMurfFalconAudio(cleanText, murfKey);
    if (murfAudio && murfAudio.byteLength > 100) {
      const buffer = murfAudio.buffer as ArrayBuffer;
      ttsCache.set(cacheKey, { buffer, engine: 'Murf-Falcon-Anisha' });
      return new Response(buffer, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': murfAudio.byteLength.toString(),
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
          'X-Voice-Engine': 'Murf-Falcon-Anisha',
          ...CORS_HEADERS,
        },
      });
    }
  }

  // 2. PRIMARY: Fetch authentic Neural Voices from Python backend using Vercel Service Binding
  try {
    const backendBase = process.env.BACKEND_URL || 'http://localhost:8000';
    const targetUrl = new URL('/api/tts', backendBase);
    targetUrl.searchParams.set('text', cleanText);
    targetUrl.searchParams.set('persona', persona);
    if (isSlow) targetUrl.searchParams.set('slow', 'true');

    const backendRes = await fetch(targetUrl.toString(), {
      cache: 'no-store',
      signal: AbortSignal.timeout(1500),
    });

    if (backendRes.ok) {
      const audioBuffer = await backendRes.arrayBuffer();
      // Allow single syllables / short audio (e.g. 150-800 bytes) without discarding!
      if (audioBuffer && audioBuffer.byteLength > 100) {
        ttsCache.set(cacheKey, { buffer: audioBuffer, engine: `Edge-Neural-${persona}` });
        return new NextResponse(audioBuffer, {
          headers: {
            'Content-Type': 'audio/mpeg',
            'Content-Length': audioBuffer.byteLength.toString(),
            'Cache-Control': 'public, max-age=86400, s-maxage=86400',
            'X-Voice-Engine': `Edge-Neural-${persona}`,
            ...CORS_HEADERS,
          },
        });
      }
    }
  } catch (backendError) {
    console.warn('Backend Edge-TTS unreachable, falling back to Google TTS:', backendError);
  }

  // 3. FALLBACK: Google Translate TTS with frame concatenation
  const chunks = splitTeluguText(cleanText, 140);
  const audioBuffers: Uint8Array[] = [];

  for (const chunk of chunks) {
    const buffer = await fetchGoogleChunkAudio(chunk);
    if (buffer && buffer.length > 0) {
      audioBuffers.push(buffer);
    }
  }

  if (audioBuffers.length === 0) {
    return new NextResponse('Failed to generate audio for text', { status: 502, headers: CORS_HEADERS });
  }

  const totalLength = audioBuffers.reduce((sum, buf) => sum + buf.length, 0);
  const concatenated = new Uint8Array(totalLength);
  let offset = 0;
  for (const buf of audioBuffers) {
    concatenated.set(buf, offset);
    offset += buf.length;
  }

  const finalBuffer = concatenated.buffer as ArrayBuffer;
  ttsCache.set(cacheKey, { buffer: finalBuffer, engine: 'Google-Fallback' });

  return new Response(finalBuffer, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Length': totalLength.toString(),
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      'X-Voice-Engine': 'Google-Fallback',
      ...CORS_HEADERS,
    },
  });
}
