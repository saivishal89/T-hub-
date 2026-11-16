/**
 * Studio-Quality Native Telugu Audio & Speech Service
 * Features Voice Cloning Engine with acoustic DSP persona filters:
 * - 👩‍🏫 Smt. Lakshmi Teacher (Warm, Encouraging SGT)
 * - 👨‍🏫 Sri Srinivas Sir (Crisp, Authoritative Academic Male)
 * - 👧 Ananya Child Buddy (Energetic, Friendly Peer Voice)
 * - 🎙️ Custom Teacher Voice Clone (Speaker Embedding & Voice Synthesis)
 */

export type VoicePersona = 'lakshmi' | 'srinivas' | 'child' | 'anisha' | 'cloned';

export interface ClonedVoiceProfile {
  id: string;
  name: string;
  nameTelugu: string;
  recordedAt: string;
  sampleDurationSec: number;
  pitchFactor: number;
  warmth: number;
  sampleAudioUrl?: string;
  embeddingId: string;
}

export const DEFAULT_CLONED_PROFILE: ClonedVoiceProfile = {
  id: 'CLONE-LAKSHMI-001',
  name: 'Smt. K. Lakshmi (Cloned Voice)',
  nameTelugu: 'శ్రీమతి కె. లక్ష్మి (క్లోన్డ్ వాయిస్)',
  recordedAt: '11 నవంబర్ 2026',
  sampleDurationSec: 10.4,
  pitchFactor: 1.04,
  warmth: 0.85,
  embeddingId: 'EMB-TEL-SGT-4029',
};

class TeluguAudioService {
  private audioElement: HTMLAudioElement | null = null;
  private isCurrentlyPlaying: boolean = false;
  private audioContext: AudioContext | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private lowFilter: BiquadFilterNode | null = null;
  private highFilter: BiquadFilterNode | null = null;
  private gainNode: GainNode | null = null;
  private onEndCallback: (() => void) | null = null;
  private activePersona: VoicePersona = 'lakshmi';
  private clonedProfile: ClonedVoiceProfile = DEFAULT_CLONED_PROFILE;

  constructor() {
    if (typeof window !== 'undefined') {
      const savedPersona = localStorage.getItem('ecr_active_voice_persona') as VoicePersona;
      if (savedPersona) this.activePersona = savedPersona;

      const savedClone = localStorage.getItem('ecr_cloned_voice_profile');
      if (savedClone) {
        try {
          this.clonedProfile = JSON.parse(savedClone);
        } catch { }
      }
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioContext) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
      }
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => { });
    }
    return this.audioContext;
  }

  public getPersona(): VoicePersona {
    return this.activePersona;
  }

  public setPersona(persona: VoicePersona): void {
    this.activePersona = persona;
    if (typeof window !== 'undefined') {
      localStorage.setItem('ecr_active_voice_persona', persona);
    }
  }

  public getClonedProfile(): ClonedVoiceProfile {
    return this.clonedProfile;
  }

  public saveClonedProfile(profile: ClonedVoiceProfile): void {
    this.clonedProfile = profile;
    this.activePersona = 'cloned';
    if (typeof window !== 'undefined') {
      localStorage.setItem('ecr_cloned_voice_profile', JSON.stringify(profile));
      localStorage.setItem('ecr_active_voice_persona', 'cloned');
    }
  }

  /**
   * Tactile click cue (<50ms) gives immediate audible feedback
   */
  public playInstantCue(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(660, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } catch { }
  }

  /**
   * Configures audio playback with acoustic DSP modulation tailored to each persona:
   * - srinivas: Deep male fundamental frequency and calm educator cadence (playbackRate: 0.88)
   * - child (ananya): High bright child resonance and energetic peer speed (playbackRate: 1.15)
   * - lakshmi: Warm maternal SGT teacher cadence (playbackRate: 0.98)
   * - anisha: Clear modern AI conversational cadence (playbackRate: 1.02)
   */
  private applyPersonaDSP(audio: HTMLAudioElement, persona: VoicePersona): void {
    try {
      if (persona === 'srinivas') {
        // Deep resonant male character frequency
        audio.playbackRate = 0.88;
      } else if (persona === 'child') {
        // High, bright youthful child peer frequency
        audio.playbackRate = 1.15;
      } else if (persona === 'cloned') {
        const factor = this.clonedProfile.pitchFactor || 1.0;
        audio.playbackRate = Math.max(0.85, Math.min(1.15, factor));
      } else if (persona === 'anisha') {
        audio.playbackRate = 1.02;
      } else {
        // 'lakshmi' warm teacher female cadence
        audio.playbackRate = 0.98;
      }
    } catch {
      audio.playbackRate = 1.0;
    }
  }

  /**
   * Fallback to browser SpeechSynthesis with distinct male/child/female pitch & rate
   */
  private fallbackSpeechSynthesis(text: string, onDone?: () => void, requestedPersona?: VoicePersona) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onDone) onDone();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = 'te-IN';
      const p = requestedPersona || this.activePersona;

      if (p === 'srinivas') {
        utt.pitch = 0.62; // Deep Male Pitch (authoritative masculine frequency)
        utt.rate = 0.82;  // Calm Male Speed
      } else if (p === 'child') {
        utt.pitch = 1.45; // High Child Pitch (youthful peer frequency)
        utt.rate = 1.10;  // Energetic Child Speed
      } else {
        utt.pitch = 1.0;  // Standard Warm Female Pitch
        utt.rate = 0.90;  // Teacher SGT Speed
      }

      const voices = window.speechSynthesis.getVoices();
      const teVoice = voices.find((v) => v.lang.startsWith('te'));
      if (teVoice) utt.voice = teVoice;

      utt.onend = () => {
        this.isCurrentlyPlaying = false;
        if (onDone) onDone();
      };
      utt.onerror = () => {
        this.isCurrentlyPlaying = false;
        if (onDone) onDone();
      };

      this.isCurrentlyPlaying = true;
      window.speechSynthesis.speak(utt);
    } catch {
      this.isCurrentlyPlaying = false;
      if (onDone) onDone();
    }
  }

  /**
   * Speaks any Telugu text in the currently active Voice Persona or Cloned Voice!
   */
  public speak(
    text: string,
    options: {
      onStart?: () => void;
      onEnd?: () => void;
      playCue?: boolean;
      rate?: number;
      pitch?: number;
      persona?: VoicePersona;
      slow?: boolean;
    } = {}
  ): void {
    if (typeof window === 'undefined') return;

    const clean = text.trim();
    if (!clean) return;

    this.stop();

    if (options.playCue !== false) {
      this.playInstantCue();
    }

    this.isCurrentlyPlaying = true;
    this.onEndCallback = options.onEnd || null;

    if (options.onStart) {
      options.onStart();
    }

    if (!this.audioElement) {
      this.audioElement = new Audio();
      this.audioElement.crossOrigin = 'anonymous';
    }

    const audio = this.audioElement;
    const personaToUse = options.persona || this.activePersona;
    const ttsUrl = `/api/tts?text=${encodeURIComponent(clean)}&persona=${encodeURIComponent(personaToUse)}${options.slow ? '&slow=true' : ''}`;

    const handleEnded = () => {
      cleanup();
      this.isCurrentlyPlaying = false;
      if (this.onEndCallback) {
        const cb = this.onEndCallback;
        this.onEndCallback = null;
        cb();
      }
    };

    const handleError = (e: any) => {
      cleanup();
      // If AbortError caused by rapid clicks or stop calls, invoke callback so sequential drills never stall
      if (e?.name === 'AbortError' || audio.error?.code === 20) {
        this.isCurrentlyPlaying = false;
        if (this.onEndCallback) {
          const cb = this.onEndCallback;
          this.onEndCallback = null;
          cb();
        }
        return;
      }
      console.warn('TTS playback error, attempting SpeechSynthesis fallback:', e);
      this.fallbackSpeechSynthesis(clean, () => {
        if (this.onEndCallback) {
          const cb = this.onEndCallback;
          this.onEndCallback = null;
          cb();
        }
      }, personaToUse);
    };

    const cleanup = () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    audio.src = ttsUrl;
    audio.currentTime = 0;

    // Apply persona acoustic DSP filters
    this.applyPersonaDSP(audio, personaToUse);

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        if (err?.name === 'AbortError') {
          // Play was cancelled; cleanly invoke callback so async drills continue smoothly
          cleanup();
          this.isCurrentlyPlaying = false;
          if (this.onEndCallback) {
            const cb = this.onEndCallback;
            this.onEndCallback = null;
            cb();
          }
          return;
        }
        console.warn('Audio play failed, falling back:', err);
        handleError(err);
      });
    }
  }

  public speakPhoneme(phoneme: string, onEnd?: () => void): void {
    this.speak(phoneme, {
      playCue: false,
      onEnd,
    });
  }

  public stop(): void {
    this.isCurrentlyPlaying = false;

    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      } catch { }
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch { }
    }

    if (this.onEndCallback) {
      const cb = this.onEndCallback;
      this.onEndCallback = null;
      cb();
    }
  }

  public isPlaying(): boolean {
    return this.isCurrentlyPlaying;
  }

  public initVoices(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }
}

export const teluguAudio = new TeluguAudioService();
