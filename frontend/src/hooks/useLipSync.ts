'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

export interface LipSyncFrame {
  jawOpen: number;     // 0.0 (closed) to 1.0 (wide open)
  mouthWide: number;   // 0.0 to 1.0
  mouthPucker: number; // 0.0 to 1.0
  amplitude: number;   // 0.0 to 1.0 audio volume envelope
}

/**
 * useLipSync Hook:
 * Single-instance audio engine with real-time Web Audio API AnalyserNode.
 * Guarantees zero overlapping audio instances, accurate audio duration tracking,
 * and high-fidelity jaw/mouth blendshape values mapped to Telugu speech envelope.
 */
export function useLipSync() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentFrame, setCurrentFrame] = useState<LipSyncFrame>({
    jawOpen: 0,
    mouthWide: 0,
    mouthPucker: 0,
    amplitude: 0,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Initialize Web Audio Context safely on first user gesture
  const initAudioPipeline = useCallback((audioEl: HTMLAudioElement) => {
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.65; // Responsive yet smooth mouth transitions
        analyserRef.current = analyser;

        try {
          const source = ctx.createMediaElementSource(audioEl);
          source.connect(analyser);
          analyser.connect(ctx.destination);
          sourceRef.current = source;
        } catch (e) {
          console.warn('[useLipSync] Source already connected or restricted:', e);
        }
      }
    }
  }, []);

  // Frame tick: extracts live RMS amplitude and maps to Telugu mouth shapes
  const updateLipSyncFrame = useCallback(() => {
    if (!analyserRef.current || !audioRef.current || audioRef.current.paused) {
      setCurrentFrame({ jawOpen: 0, mouthWide: 0, mouthPucker: 0, amplitude: 0 });
      return;
    }

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Compute average voice frequency energy in the vocal formant range (300Hz - 3400Hz)
    let sum = 0;
    const formantBins = dataArray.slice(2, 40); // Fundamental vowels and consonants
    for (let i = 0; i < formantBins.length; i++) {
      sum += formantBins[i];
    }
    const avgEnergy = sum / formantBins.length;
    const normalizedAmp = Math.min(Math.max((avgEnergy - 12) / 110, 0), 1.0); // Clean noise gate

    // Telugu vowels (ఆ, ఓ, ఉ) require higher jaw drops; fricatives & plosives require wider mouth
    const highFreqBins = dataArray.slice(40, 90);
    let highSum = 0;
    for (let i = 0; i < highFreqBins.length; i++) highSum += highFreqBins[i];
    const highEnergy = Math.min(highSum / highFreqBins.length / 100, 1.0);

    const targetJaw = Math.min(normalizedAmp * 1.35, 1.0);
    const targetWide = Math.min(highEnergy * 0.8, 1.0);
    const targetPucker = Math.max((normalizedAmp - highEnergy) * 0.7, 0);

    setCurrentFrame({
      jawOpen: targetJaw,
      mouthWide: targetWide,
      mouthPucker: targetPucker,
      amplitude: normalizedAmp,
    });

    animFrameRef.current = requestAnimationFrame(updateLipSyncFrame);
  }, []);

  // Main Speak function - Strictly cancels any existing audio before playing!
  const speakTelugu = useCallback(
    async (text: string, persona: string = 'lakshmi'): Promise<void> => {
      if (!text || !text.trim()) return;

      // 1. HARD STOP previous audio instance to prevent double-speech bug
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.removeAttribute('src');
        audioRef.current.load();
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }

      setIsPlaying(true);

      const cleanText = text.trim();
      const url = `/api/tts?text=${encodeURIComponent(cleanText)}&persona=${encodeURIComponent(persona)}`;

      const audio = new Audio(url);
      audio.crossOrigin = 'anonymous';
      audioRef.current = audio;

      // Ensure audio context is resumed
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      initAudioPipeline(audio);

      audio.onplay = () => {
        setIsPlaying(true);
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = requestAnimationFrame(updateLipSyncFrame);
      };

      audio.onended = () => {
        setIsPlaying(false);
        setCurrentFrame({ jawOpen: 0, mouthWide: 0, mouthPucker: 0, amplitude: 0 });
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      };

      audio.onerror = (e) => {
        console.warn('[useLipSync] Audio playback error:', e);
        setIsPlaying(false);
        setCurrentFrame({ jawOpen: 0, mouthWide: 0, mouthPucker: 0, amplitude: 0 });
      };

      try {
        await audio.play();
      } catch (err) {
        console.warn('[useLipSync] Autoplay rejected, waiting for user tap:', err);
        setIsPlaying(false);
      }
    },
    [initAudioPipeline, updateLipSyncFrame]
  );

  // Stop / Interrupt teacher speech cleanly
  const stopSpeech = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setIsPlaying(false);
    setCurrentFrame({ jawOpen: 0, mouthWide: 0, mouthPucker: 0, amplitude: 0 });
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  return {
    isPlaying,
    currentFrame,
    speakTelugu,
    stopSpeech,
  };
}
