'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { TutorInteractionResult } from '@/types';
import confetti from 'canvas-confetti';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Award,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  BookOpen,
  VolumeX,
  Smile,
  GraduationCap,
  ChevronRight,
  RefreshCw,
  Radio,
  Play,
  Snail,
} from 'lucide-react';

interface PracticeWord {
  id: string;
  word: string;
  category: 'అచ్చులు (Vowels)' | 'హల్లులు (Consonants)' | 'గుణింతాలు (Guninthalu)' | 'ఒత్తులు (Ottulu)' | 'వ్యత్యాసాలు (Contrast Pairs)';
  meaningEn: string;
  focusPair?: string;
  expectedPhonemes: string[];
  teacherTipTe: string;
}

const CURRICULUM_WORDS: PracticeWord[] = [
  { id: 'W-01', word: 'అమ్మ', category: 'ఒత్తులు (Ottulu)', meaningEn: 'Mother', expectedPhonemes: ['అ', 'మ్మ'], teacherTipTe: 'మ-ఒత్తు శబ్దాన్ని నొక్కి పలకాలి: అ-మ్మ.' },
  { id: 'W-02', word: 'తాత', category: 'వ్యత్యాసాలు (Contrast Pairs)', meaningEn: 'Grandfather', focusPair: 'త vs ట (Dental vs Retroflex)', expectedPhonemes: ['తా', 'త'], teacherTipTe: 'నాలుకను పై పళ్ళకు తాకించి మృదువుగా "తాత" అని పలకాలి.' },
  { id: 'W-03', word: 'టమాటా', category: 'వ్యత్యాసాలు (Contrast Pairs)', meaningEn: 'Tomato', focusPair: 'త vs ట (Dental vs Retroflex)', expectedPhonemes: ['ట', 'మా', 'టా'], teacherTipTe: 'నాలుకను పై దవడకు వంచి గట్టిగా "ట" అని పలకాలి.' },
  { id: 'W-04', word: 'దండ', category: 'వ్యత్యాసాలు (Contrast Pairs)', meaningEn: 'Garland', focusPair: 'ద vs డ (Dental vs Retroflex)', expectedPhonemes: ['దం', 'డ'], teacherTipTe: 'దం-డ: రెండు శబ్దాల తేడాను గమనించండి.' },
  { id: 'W-05', word: 'డబ్బా', category: 'వ్యత్యాసాలు (Contrast Pairs)', meaningEn: 'Box / Container', focusPair: 'ద vs డ (Dental vs Retroflex)', expectedPhonemes: ['డ', 'బ్బా'], teacherTipTe: 'బ-ఒత్తు శబ్దాన్ని నొక్కి "డబ్బా" అనండి.' },
  { id: 'W-06', word: 'గాలి', category: 'వ్యత్యాసాలు (Contrast Pairs)', meaningEn: 'Wind / Air', focusPair: 'ల vs ళ (Lateral Contrast)', expectedPhonemes: ['గా', 'లి'], teacherTipTe: 'సాధారణ ల-కారం: నాలుక పళ్ళ వెనుక తగులుతుంది.' },
  { id: 'W-07', word: 'తాళం', category: 'వ్యత్యాసాలు (Contrast Pairs)', meaningEn: 'Lock', focusPair: 'ల vs ళ (Lateral Contrast)', expectedPhonemes: ['తా', 'ళం'], teacherTipTe: 'కఠినమైన ళ-కారం: నాలుకను పైకి మడిచి "తాళం" అనాలి.' },
  { id: 'W-08', word: 'పాఠశాల', category: 'గుణింతాలు (Guninthalu)', meaningEn: 'School', expectedPhonemes: ['పా', 'ఠ', 'శా', 'ల'], teacherTipTe: 'మహాప్రాణ "ఠ" శబ్దాన్ని ఊపిరి వదులుతూ పలకండి.' },
];

export default function TeluguAiTutorPage() {
  const { voiceGender, t } = useApp();

  const [selectedWordIndex, setSelectedWordIndex] = useState(0);
  const currentWord = CURRICULUM_WORDS[selectedWordIndex];

  // Tutor Voice & Audio States
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState(false);

  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [feedbackResult, setFeedbackResult] = useState<TutorInteractionResult | null>(null);
  const [stars, setStars] = useState(21);
  const [activeSyllable, setActiveSyllable] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const hasInteractedRef = useRef<boolean>(false);
  const hasIntroducedRef = useRef<boolean>(false);

  // Instant local browser speech synthesis fallback (Guarantees audio never fails)
  const playNativeBrowserSpeech = (text: string, isSlow: boolean = false) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'te-IN';
      utterance.rate = isSlow ? 0.75 : 0.95;
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => {
        setIsPlayingAudio(false);
        setActiveSyllable(null);
      };
      utterance.onerror = () => {
        setIsPlayingAudio(false);
        setActiveSyllable(null);
      };
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Native speech error:', e);
      setIsPlayingAudio(false);
      setActiveSyllable(null);
    }
  };

  // Play audio using Edge-TTS with watchdog & instant browser speech fallback
  const playTeluguSpeech = (textToSpeak: string, isSlow: boolean = false) => {
    if (!textToSpeak.trim()) return;

    // Hard stop any previous audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    const persona = voiceGender === 'male' ? 'srinivas' : 'lakshmi';
    const audioUrl = `/api/tts?text=${encodeURIComponent(textToSpeak)}&persona=${persona}${isSlow ? '&slow=true' : ''}`;
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    setIsPlayingAudio(true);

    let hasStarted = false;

    // Safety watchdog: if audio doesn't start in 1600ms, use instant native speech!
    const watchdogTimer = setTimeout(() => {
      if (!hasStarted && audioRef.current === audio && !audio.ended) {
        console.warn('[Telugu Tutor] /api/tts slow or unreachable, triggering instant browser speech');
        audio.pause();
        playNativeBrowserSpeech(textToSpeak, isSlow);
      }
    }, 1600);

    audio.onplay = () => {
      hasStarted = true;
      clearTimeout(watchdogTimer);
      setIsAutoplayBlocked(false);
      hasInteractedRef.current = true;
    };

    audio.onended = () => {
      clearTimeout(watchdogTimer);
      setIsPlayingAudio(false);
      setActiveSyllable(null);
    };

    audio.onerror = (e) => {
      clearTimeout(watchdogTimer);
      console.warn('[Telugu Tutor] /api/tts error, fallback to browser speech synthesis:', e);
      playNativeBrowserSpeech(textToSpeak, isSlow);
    };

    audio.play().catch((err) => {
      console.warn('[Telugu Tutor] Audio paused by browser autoplay policy:', err);
      clearTimeout(watchdogTimer);
      setIsPlayingAudio(false);
      if (!hasInteractedRef.current) {
        setIsAutoplayBlocked(true);
      } else {
        playNativeBrowserSpeech(textToSpeak, isSlow);
      }
    });
  };

  // Word prompt effect: Only introduces Chinni ONCE at session start; thereafter prompts naturally based on context
  useEffect(() => {
    setFeedbackResult(null);
    setSpokenTranscript('');
    setIsCorrect(false);
    setActiveSyllable(null);

    let promptText = '';
    if (!hasIntroducedRef.current) {
      hasIntroducedRef.current = true;
      promptText = `నమస్కారం! నేను మీ చిన్నీని. రండి, మొదటి పదం కలిసి చదువుదాం: ${currentWord.word}.`;
    } else {
      const prompts = [
        `తర్వాతి పదం: ${currentWord.word}. నాతో కలిసి పలకండి.`,
        `ఇప్పుడు ఈ పదాన్ని చూద్దాం: ${currentWord.word}.`,
        `బాగుంది! తర్వాతి పదం: ${currentWord.word}. చదవండి.`,
      ];
      promptText = prompts[selectedWordIndex % prompts.length];
    }

    playTeluguSpeech(promptText);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [selectedWordIndex]);

  // Syllable Pronunciation Handler
  const playSyllableAudio = (syllable: string) => {
    setActiveSyllable(syllable);
    playTeluguSpeech(syllable, true);
  };

  // Voice Recognition Handler
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('ఈ బ్రౌజర్‌లో మైక్రోఫోన్ వాయిస్ రికగ్నిషన్ సపోర్ట్ లేదు. దయచేసి Chrome ఉపయోగించండి.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'te-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    setIsListening(true);
    setSpokenTranscript('');
    setFeedbackResult(null);
    setIsCorrect(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.trim();
      setSpokenTranscript(transcript);
      setIsListening(false);
      evaluatePronunciation(transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    try {
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const evaluatePronunciation = (transcript: string) => {
    setIsThinking(true);

    const cleanSpoken = transcript.replace(/\s+/g, '').toLowerCase();
    const cleanTarget = currentWord.word.replace(/\s+/g, '').toLowerCase();
    const isMatch = cleanSpoken.includes(cleanTarget) || cleanTarget.includes(cleanSpoken);

    setTimeout(() => {
      setIsThinking(false);
      if (isMatch) {
        setIsCorrect(true);
        setStars((s) => s + 3);
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });

        const successMsg = `బాగా చెప్పావు! అద్భుతం! '${currentWord.word}' సరైన ఉచ్చారణ!`;
        setFeedbackResult({
          matchAccuracy: 96,
          phoneticMatch: true,
          encouragementTe: successMsg,
          correctSyllables: currentWord.expectedPhonemes,
          weakSyllables: [],
        });
        playTeluguSpeech(successMsg);
      } else {
        setIsCorrect(false);
        const encourageMsg = `మంచి ప్రయత్నం! ఇంకొక్కసారి నాతో పాటు కలిపి చెప్పు: '${currentWord.word}'. ${currentWord.teacherTipTe}`;
        setFeedbackResult({
          matchAccuracy: 65,
          phoneticMatch: false,
          encouragementTe: encourageMsg,
          correctSyllables: [currentWord.expectedPhonemes[0]],
          weakSyllables: currentWord.expectedPhonemes.slice(1),
        });
        playTeluguSpeech(encourageMsg);
      }
    }, 700);
  };

  return (
    <div className="min-h-[88vh] bg-gradient-to-b from-sky-50 via-slate-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Banner */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-2xl shadow-md">
              <Radio className="w-6 h-6 animate-pulse text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-telugu">
                  చిన్నీ – తెలుగు AI వాయిస్ గురువు (Audio Learning Studio)
                </h1>
                <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                  Voice First AI
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5 font-telugu">
                తెలుగు అక్షరాలు, ఒత్తులు మరియు గుణింతాల శ్రవణ సాధన – స్పష్టమైన ఉచ్చారణతో నేర్చుకోండి
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-200 shadow-2xs self-start md:self-auto">
            <Award className="w-5 h-5 text-amber-500 fill-current animate-bounce" />
            <span className="text-sm font-black text-amber-900 font-telugu">
              {stars} నక్షత్రాలు (Stars)
            </span>
          </div>
        </div>

        {/* Classroom Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: Audio Stage & Syllable Studio */}
          <div className="lg:col-span-5 bg-gradient-to-b from-blue-100/70 via-sky-50/60 to-emerald-50/60 rounded-3xl p-6 border border-blue-200 shadow-md flex flex-col justify-between min-h-[460px] space-y-4">
            {/* Blackboard Word Display */}
            <div className="w-full bg-emerald-950 rounded-3xl p-6 text-white shadow-xl border-4 border-amber-800 text-center relative">
              <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-widest block mb-2 font-telugu">
                తరగతి గది బ్లాక్‌బోర్డ్ (Target Word)
              </span>
              <div className="text-5xl sm:text-6xl font-black tracking-wide font-telugu text-amber-200 drop-shadow-lg my-3">
                {currentWord.word}
              </div>
              <span className="text-xs text-emerald-200 font-semibold block mt-1">
                {currentWord.meaningEn} • {currentWord.category}
              </span>
            </div>

            {/* Tap to Unmute / Start Banner if browser autoplay blocked */}
            {isAutoplayBlocked && (
              <button
                type="button"
                onClick={() => {
                  hasInteractedRef.current = true;
                  setIsAutoplayBlocked(false);
                  let promptText = '';
                  if (!hasIntroducedRef.current) {
                    hasIntroducedRef.current = true;
                    promptText = `నమస్కారం! నేను మీ చిన్నీని. రండి, మొదటి పదం కలిసి చదువుదాం: ${currentWord.word}.`;
                  } else {
                    promptText = `ఈ పదాన్ని నాతో కలిసి చదవండి: ${currentWord.word}.`;
                  }
                  playTeluguSpeech(promptText);
                }}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-black text-xs rounded-xl shadow-md border border-amber-300 flex items-center justify-center gap-2 animate-bounce cursor-pointer font-telugu"
              >
                <Volume2 className="w-4 h-4 text-amber-950 shrink-0" />
                <span>🔊 చిన్నీ మాటలు వినడానికి ఇక్కడ నొక్కండి! (Click to Listen)</span>
              </button>
            )}

            {/* Interactive Syllable Breakdown Studio */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-blue-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 font-telugu flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>అక్షరాల విడదీత (Tap each syllable to hear):</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Phonetic Segments</span>
              </div>

              {/* Syllable Buttons */}
              <div className="flex flex-wrap gap-2.5 justify-center py-1">
                {currentWord.expectedPhonemes.map((syllable, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      playSyllableAudio(syllable);
                    }}
                    className={`px-4 py-2.5 rounded-2xl text-lg font-black font-telugu transition-all transform active:scale-95 shadow-sm border cursor-pointer flex items-center gap-1.5 ${
                      activeSyllable === syllable
                        ? 'bg-blue-600 text-white border-blue-700 ring-4 ring-blue-200 scale-105'
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-blue-50 hover:border-blue-300'
                    }`}
                  >
                    <Volume2 className="w-4 h-4 text-blue-500" />
                    <span>{syllable}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Waveform & Speaker Animation Indicator */}
            <div className="bg-white/90 rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    isPlayingAudio
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-400/40 ring-4 ring-emerald-100'
                      : isListening
                      ? 'bg-red-500 text-white shadow-md shadow-red-400/40 ring-4 ring-red-100'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  <Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block font-telugu">
                    {isPlayingAudio
                      ? 'చిన్నీ వాయిస్ మాట్లాడుతున్నారు (Speaking...)'
                      : isListening
                      ? 'మీ స్వరం వింటున్నారు (Listening...)'
                      : isThinking
                      ? 'AI విశ్లేషిస్తోంది (Evaluating...)'
                      : 'వినడానికి సిద్ధంగా ఉంది (Ready to Play)'}
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    {/* Equalizer Bars */}
                    {[12, 20, 16, 24, 14, 18, 22, 12].map((h, i) => (
                      <span
                        key={i}
                        style={{ height: isPlayingAudio ? `${h}px` : '4px' }}
                        className={`w-1 rounded-full transition-all duration-150 ${
                          isPlayingAudio ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                      ></span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Audio Triggers */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    playTeluguSpeech(currentWord.word, true);
                  }}
                  title="Slow audio pronunciation"
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer font-telugu"
                >
                  <Snail className="w-3.5 h-3.5 text-amber-700" />
                  <span>నెమ్మదిగా</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    playTeluguSpeech(currentWord.word, false);
                  }}
                  title="Normal audio pronunciation"
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer font-telugu shadow-xs hover:shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>వినండి</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Child Interaction & Pronunciation Assessment Console */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
            {/* Word Selection Carousel */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-telugu">
                  సాధన పదాల జాబితా (Curriculum Words)
                </span>
                <span className="text-xs font-bold text-blue-600 font-mono">
                  {selectedWordIndex + 1} of {CURRICULUM_WORDS.length}
                </span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {CURRICULUM_WORDS.map((w, idx) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedWordIndex(idx);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer font-telugu ${
                      selectedWordIndex === idx
                        ? 'bg-blue-600 text-white shadow-md scale-102'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {w.word}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Phonetic Contrast Highlight */}
            {currentWord.focusPair && (
              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-xs">
                  🎯
                </div>
                <div>
                  <span className="text-[11px] font-bold text-amber-900 block font-telugu">
                    ధ్వని వ్యత్యాస సాధన: {currentWord.focusPair}
                  </span>
                  <span className="text-[11px] text-amber-700">
                    {currentWord.teacherTipTe}
                  </span>
                </div>
              </div>
            )}

            {/* Microphone Interaction Box */}
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 text-center space-y-4">
              <span className="text-xs font-bold text-slate-600 font-telugu block">
                మైక్రోఫోన్ నొక్కి బిగ్గరగా చదవండి (Tap to Speak)
              </span>

              <button
                type="button"
                onClick={toggleListening}
                className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center transition-all transform active:scale-95 shadow-xl cursor-pointer ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse ring-8 ring-red-200'
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
                }`}
              >
                {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
              </button>

              <div className="text-xs font-bold text-slate-500 font-telugu">
                {isListening ? (
                  <span className="text-red-600 animate-pulse">
                    రికార్డింగ్ అవుతోంది... ఇప్పుడు మాట్లాడండి!
                  </span>
                ) : (
                  <span>మైక్రోఫోన్ బటన్ నొక్కండి</span>
                )}
              </div>

              {/* Live Speech Recognition Feedback */}
              {spokenTranscript && (
                <div className="p-3 bg-white rounded-2xl border border-slate-200 max-w-sm mx-auto shadow-2xs">
                  <span className="text-[10px] text-slate-400 font-bold block">
                    మీరు పలికిన శబ్దం:
                  </span>
                  <span className="text-base font-black text-slate-900 font-telugu">
                    "{spokenTranscript}"
                  </span>
                </div>
              )}
            </div>

            {/* Diagnostic Phonetic Feedback Result */}
            {feedbackResult && (
              <div
                className={`p-4 rounded-2xl border flex items-start gap-3 animate-in fade-in ${
                  feedbackResult.phoneticMatch
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                {feedbackResult.phoneticMatch ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="text-xs font-black font-telugu">
                    {feedbackResult.encouragementTe}
                  </h4>
                  <div className="flex gap-1.5 mt-2">
                    {feedbackResult.correctSyllables.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-emerald-200 text-emerald-900 font-bold text-xs rounded-md font-telugu"
                      >
                        ✓ {s}
                      </span>
                    ))}
                    {feedbackResult.weakSyllables.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-red-200 text-red-900 font-bold text-xs rounded-md font-telugu"
                      >
                        ✗ {s} (మళ్ళీ సాధన చేయండి)
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Next Word Navigation Footer */}
            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={selectedWordIndex === 0}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedWordIndex((i) => Math.max(0, i - 1));
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer font-telugu"
              >
                ← మునుపటి పదం
              </button>

              <button
                type="button"
                disabled={selectedWordIndex === CURRICULUM_WORDS.length - 1}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedWordIndex((i) => Math.min(CURRICULUM_WORDS.length - 1, i + 1));
                }}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition flex items-center gap-1.5 cursor-pointer font-telugu"
              >
                <span>తదుపరి పదం (Next Word)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
