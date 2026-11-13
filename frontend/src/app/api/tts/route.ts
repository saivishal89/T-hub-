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
    });

    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (error) {
    console.warn('Google TTS fetch error:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const text = searchParams.get('text');
  const persona = (searchParams.get('persona') || 'lakshmi').toLowerCase();
  const murfKey = searchParams.get('murfKey') || process.env.MURF_API_KEY || '';

  if (!text || !text.trim()) {
    return new NextResponse('Missing text parameter', { status: 400 });
  }

  const cleanText = text.trim();

  // 1. If persona is Anisha (Falcon) and Murf API Key is provided, call live Murf Falcon streaming API
  if (persona === 'anisha' && murfKey) {
    const murfAudio = await fetchMurfFalconAudio(cleanText, murfKey);
    if (murfAudio && murfAudio.byteLength > 1000) {
      return new Response(murfAudio.buffer as ArrayBuffer, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': murfAudio.byteLength.toString(),
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
          'X-Voice-Engine': 'Murf-Falcon-Anisha',
        },
      });
    }
  }

  // 2. PRIMARY: Fetch authentic Neural Voices from Python backend
  try {
    const backendUrl = `http://localhost:8000/api/tts?text=${encodeURIComponent(
      cleanText
    )}&persona=${encodeURIComponent(persona)}`;

    const backendRes = await fetch(backendUrl, {
      cache: 'no-store',
    });

    if (backendRes.ok) {
      const audioBuffer = await backendRes.arrayBuffer();
      if (audioBuffer && audioBuffer.byteLength > 1000) {
        return new NextResponse(audioBuffer, {
          headers: {
            'Content-Type': 'audio/mpeg',
            'Content-Length': audioBuffer.byteLength.toString(),
            'Cache-Control': 'public, max-age=86400, s-maxage=86400',
            'X-Voice-Engine': `Edge-Neural-${persona}`,
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
    return new NextResponse('Failed to generate audio for text', { status: 502 });
  }

  const totalLength = audioBuffers.reduce((sum, buf) => sum + buf.length, 0);
  const concatenated = new Uint8Array(totalLength);
  let offset = 0;
  for (const buf of audioBuffers) {
    concatenated.set(buf, offset);
    offset += buf.length;
  }

  return new Response(concatenated.buffer as ArrayBuffer, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Length': totalLength.toString(),
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      'X-Voice-Engine': 'Google-Fallback',
    },
  });
}
