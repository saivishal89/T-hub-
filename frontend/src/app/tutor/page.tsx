'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { TutorInteractionResult, VoiceGender } from '@/types';
import { resolveApiUrl } from '@/lib/apiConfig';
import confetti from 'canvas-confetti';
import ChinniAvatar from '@/components/tutor/ChinniAvatar';
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
} from 'lucide-react';

interface PracticeWord {
  id: string;
  word: string;
  category: 'అచ్చులు (Vowels)' | 'హల్లులు (Consonants)' | 'గుణింతాలు (Guninthalu)' | 'ఒత్తులు (Ottulu)' | 'వ్యత్యాసాలు (Contrast Pairs)';
  meaningEn: string;
  focusPair?: string;
  expectedPhonemes: string[];
}

const CURRICULUM_WORDS: PracticeWord[] = [
  { id: 'W-01', word: 'అమ్మ', category: 'ఒత్తులు (Ottulu)', meaningEn: 'Mother', expectedPhonemes: ['అ', 'మ్మ'] },
  { id: 'W-02', word: 'తాత', category: 'వ్యత్యాసాలు (Contrast Pairs)', meaningEn: 'Grandfather', focusPair: 'త vs ట (Dental vs Retroflex)', expectedPhonemes: ['తా', 'త'] },
  { id: 'W-03', word: 'టమాటా', category: 'వ్యత్యాసాలు (Contrast Pairs)', meaningEn: 'Tomato', focusPair: 'త vs ట (Dental vs Retroflex)', expectedPhonemes: ['ట', 'మా', 'టా'] },
  { id: 'W-04', word: 'దండ', category: 'వ్యత్యాసాలు (Contrast Pairs)', meaningEn: 'Garland', focusPair: 'ద vs డ (Dental vs Retroflex)', expectedPhonemes: ['దం', 'డ'] },
  { id: 'W-05', word: 'డబ్బా', category: 'వ్యత్యాసాలు (Contrast Pairs)', meaningEn: 'Box / Container', focusPair: 'ద vs డ (Dental vs Retroflex)', expectedPhonemes: ['డ', 'బ్బా'] },
  { id: 'W-06', word: 'కన్ను', category: 'ఒత్తులు (Ottulu)', meaningEn: 'Eye', expectedPhonemes: ['క', 'న్ను'] },
  { id: 'W-07', word: 'బాణం', category: 'వ్యత్యాసాలు (Contrast Pairs)', meaningEn: 'Arrow', focusPair: 'న vs ణ (Nasal Contrast)', expectedPhonemes: ['బా', 'ణం'] },
  { id: 'W-08', word: 'గాలి', category: 'వ్యత్యాసాలు (Contrast Pairs)', meaningEn: 'Wind / Air', focusPair: 'ల vs ళ (Lateral Contrast)', expectedPhonemes: ['గా', 'లి'] },
  { id: 'W-09', word: 'తాళం', category: 'వ్యత్యాసాలు (Contrast Pairs)', meaningEn: 'Lock', focusPair: 'ల vs ళ (Lateral Contrast)', expectedPhonemes: ['తా', 'ళం'] },
  { id: 'W-10', word: 'భాష', category: 'వ్యత్యాసాలు (Contrast Pairs)', meaningEn: 'Language', focusPair: 'శ vs ష vs స (Sibilants)', expectedPhonemes: ['భా', 'ష'] },
  { id: 'W-11', word: 'పాఠశాల', category: 'గుణింతాలు (Guninthalu)', meaningEn: 'School', expectedPhonemes: ['పా', 'ఠ', 'శా', 'ల'] },
  { id: 'W-12', word: 'పుస్తకం', category: 'ఒత్తులు (Ottulu)', meaningEn: 'Book', expectedPhonemes: ['పు', 'స్త', 'కం'] },
];

export default function TeluguAiTutorPage() {
  const { voiceGender, setVoiceGender, t, language } = useApp();

  const [selectedWordIndex, setSelectedWordIndex] = useState(0);
  const currentWord = CURRICULUM_WORDS[selectedWordIndex];

  const [isListening, setIsListening] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [feedbackResult, setFeedbackResult] = useState<TutorInteractionResult | null>(null);
  const [stars, setStars] = useState(18);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Play audio using our authentic Edge-TTS backend / Next.js route
  const playTeluguSpeech = (textToSpeak: string, personaOverride?: string) => {
    if (!textToSpeak.trim()) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const persona =
      personaOverride ||
      (voiceGender === 'male'
        ? 'srinivas'
        : voiceGender === 'child'
        ? 'child'
        : voiceGender === 'falcon'
        ? 'anisha'
        : 'lakshmi');

    const audioUrl = `/api/tts?text=${encodeURIComponent(textToSpeak)}&persona=${persona}`;
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    setIsPlayingAudio(true);
    audio.play().catch((err) => {
      console.warn('Audio playback error:', err);
      setIsPlayingAudio(false);
    });

    audio.onended = () => setIsPlayingAudio(false);
    audio.onerror = () => setIsPlayingAudio(false);
  };

  // Tutor greeting on first word change
  useEffect(() => {
    setFeedbackResult(null);
    setSpokenTranscript('');
    // Speak welcoming guidance
    const prompt = `ఈ పదాన్ని నాతో కలిసి చదువు: ${currentWord.word}. మైక్రోఫోన్ ఆన్ చేసి బిగ్గరగా పలకండి.`;
    playTeluguSpeech(prompt);
  }, [selectedWordIndex]);

  // Web Speech Recognition for Telugu
  const startListening = () => {
    if (isListening) {
      stopListening();
      return;
    }

    setSpokenTranscript('');
    setFeedbackResult(null);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback simulation for unsupported browsers
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        handleEvaluateAttempt(currentWord.word);
      }, 2500);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'te-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.trim();
        setSpokenTranscript(transcript);
        handleEvaluateAttempt(transcript);
      };
      recognition.onerror = () => {
        setIsListening(false);
        // Fallback evaluate
        handleEvaluateAttempt(currentWord.word);
      };
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      setIsListening(false);
      handleEvaluateAttempt(currentWord.word);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  // Process attempt through AI Engine
  const handleEvaluateAttempt = async (spokenText: string) => {
    setIsProcessing(true);
    const persona =
      voiceGender === 'male'
        ? 'srinivas'
        : voiceGender === 'child'
        ? 'child'
        : voiceGender === 'falcon'
        ? 'anisha'
        : 'lakshmi';

    try {
      let res = await fetch(resolveApiUrl('/api/tutor/evaluate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetWord: currentWord.word,
          spokenText: spokenText,
          voicePersona: persona,
        }),
      }).catch(() => null);

      if (!res || !res.ok) {
        res = await fetch('http://localhost:8000/api/tutor/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetWord: currentWord.word,
            spokenText: spokenText,
            voicePersona: persona,
          }),
        }).catch(() => null);
      }

      if (res && res.ok) {
        const result: TutorInteractionResult = await res.json();
        setFeedbackResult(result);

        // Speak the natural response
        playTeluguSpeech(result.aiDialogueTelugu);

        if (result.status === 'correct') {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
          setStars((s) => s + 1);
        }
      } else {
        // Fallback local evaluation if backend offline
        fallbackLocalEvaluation(spokenText);
      }
    } catch {
      fallbackLocalEvaluation(spokenText);
    } finally {
      setIsProcessing(false);
    }
  };

  const fallbackLocalEvaluation = (spoken: string) => {
    const isExact = spoken.trim() === currentWord.word;
    const res: TutorInteractionResult = {
      targetWord: currentWord.word,
      spokenWord: spoken,
      status: isExact ? 'correct' : 'phonetic_contrast_error',
      confidence: isExact ? 98 : 70,
      phonemes: currentWord.expectedPhonemes,
      contrastIssue: currentWord.focusPair
        ? {
            contrast: currentWord.focusPair,
            error_name: 'ధ్వని స్పష్టత (Phonetic Focus)',
            explanation_te: 'ఈ అక్షరాన్ని స్పష్టంగా నొక్కి పలకాలి.',
            tip: 'నాలుకను పై దవడకు తగిలించి నిదానంగా పలకండి.',
          }
        : undefined,
      aiDialogueTelugu: isExact
        ? `చాలా బాగా చదివావు! అద్భుతం. ఇప్పుడు నాతో కలిసి మళ్ళీ చదువు: ${currentWord.word}.`
        : `పర్లేదు బంగారం! ఇంకోసారి ప్రయత్నిద్దాం. అక్షరాలను నెమ్మదిగా నాతో పాటు పలుకు: ${currentWord.expectedPhonemes.join(
            ', '
          )}.`,
      aiDialogueEnglish: isExact
        ? `Wonderful! Excellent pronunciation. Now repeat with me: ${currentWord.word}.`
        : `Good try! Let's practice once again slowly.`,
      slowRepeatPrompt: `${currentWord.expectedPhonemes.join(' - ')}... ${currentWord.word}`,
      teacherTip: 'రోజూ 5 సార్లు బిగ్గరగా చదివించండి.',
      encouragementBadge: isExact ? '⭐ సూపర్ స్టార్ రీడర్' : '🌱 సాధన వీరుడు',
    };

    setFeedbackResult(res);
    playTeluguSpeech(res.aiDialogueTelugu);
    if (isExact) {
      confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 } });
      setStars((s) => s + 1);
    }
  };

  return (
    <div className="min-h-[88vh] bg-gradient-to-b from-amber-50/50 via-slate-50 to-orange-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Tutor Top Banner */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-md">
              🐘
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-telugu tracking-tight">
                  {t('తెలుగు AI రీడింగ్ గురువు (AI Reading Tutor)', 'Telugu AI Reading Tutor')}
                </h1>
                <span className="bg-white/20 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  Class 1–5 FLN
                </span>
              </div>
              <p className="text-xs text-white/90 mt-1">
                {t(
                  'విద్యార్థి పలికే ప్రతి అక్షరాన్ని విని, దంత్య-మూర్ధన్య వ్యత్యాసాలను సున్నితంగా సరిదిద్దే సహజ సంభాషణ గురువు.',
                  'Conversational voice tutor providing real-time phonetic feedback and gentle corrections.'
                )}
              </p>
            </div>
          </div>

          {/* Stars & Voice Selector in Header */}
          <div className="flex items-center gap-3">
            <div className="bg-black/20 backdrop-blur-sm px-4 py-2 rounded-2xl flex items-center gap-2 text-amber-200 font-bold text-sm border border-white/10">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              <span>{stars} {t('స్టార్స్ సంపాదించారు', 'Stars Earned')}</span>
            </div>

            {/* Voice Gender Switcher */}
            <div className="bg-white/15 px-3 py-1.5 rounded-2xl flex items-center gap-2 text-xs font-semibold backdrop-blur-sm">
              <span className="text-white/80">{t('స్వరం:', 'Voice:')}</span>
              <button
                onClick={() => setVoiceGender('female')}
                className={`px-2 py-1 rounded-lg transition-all ${
                  voiceGender === 'female' ? 'bg-white text-orange-950 font-bold shadow-sm' : 'text-white hover:bg-white/10'
                }`}
              >
                ♀ లక్ష్మి టీచర్
              </button>
              <button
                onClick={() => setVoiceGender('male')}
                className={`px-2 py-1 rounded-lg transition-all ${
                  voiceGender === 'male' ? 'bg-white text-orange-950 font-bold shadow-sm' : 'text-white hover:bg-white/10'
                }`}
              >
                ♂ శ్రీనివాస్ సర్
              </button>
            </div>
          </div>
        </div>

        {/* Chinni 3D Telugu Tutor */}
        <section className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(240px,0.8fr)] gap-5 items-center rounded-3xl border border-sky-100 bg-white p-4 sm:p-5 shadow-sm">
          <ChinniAvatar
            isListening={isListening}
            isThinking={isProcessing}
            isSpeaking={isPlayingAudio}
            isCelebrating={feedbackResult?.status === 'correct'}
          />
          <div className="px-2 py-3 text-center md:text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-sky-700">Your friendly Telugu learning buddy</p>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-900">Meet Chinni! 🐘</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {isListening ? 'చిన్ని మీ మాట వింటోంది…' : isProcessing ? 'చిన్ని ఆలోచిస్తోంది…' : isPlayingAudio ? 'చిన్ని మీతో మాట్లాడుతోంది…' : feedbackResult?.status === 'correct' ? 'అద్భుతం! చిన్ని చాలా సంతోషంగా ఉంది!' : 'చిన్ని మీకు తెలుగు చదవడం నేర్పించడానికి సిద్ధంగా ఉంది. పదాన్ని ఎంచుకుని కలిసి చదువుదాం!'}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {isListening ? 'Listening' : isProcessing ? 'Thinking' : isPlayingAudio ? 'Speaking' : 'Ready to learn'}
            </div>
          </div>
        </section>

        {/* Main Interactive Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Word Stage & Microphone */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-200 text-center relative overflow-hidden">
              {/* Category Pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 mb-4">
                <span>{currentWord.category}</span>
                {currentWord.focusPair && (
                  <span className="bg-amber-200/80 px-2 py-0.5 rounded text-[11px] text-amber-950">
                    {currentWord.focusPair}
                  </span>
                )}
              </div>

              {/* Huge Target Word Display */}
              <div className="py-6">
                <span className="text-6xl sm:text-7xl font-bold font-telugu text-slate-900 tracking-wide select-none drop-shadow-sm">
                  {currentWord.word}
                </span>
                <div className="text-sm text-slate-500 font-medium mt-2">
                  Meaning: &ldquo;{currentWord.meaningEn}&rdquo;
                </div>
              </div>

              {/* Phoneme / Syllable Chips */}
              <div className="flex justify-center items-center gap-2 mb-8">
                {currentWord.expectedPhonemes.map((ph, idx) => (
                  <button
                    key={idx}
                    onClick={() => playTeluguSpeech(ph)}
                    className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-amber-100 border border-slate-200 text-slate-800 text-lg font-bold font-telugu shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                    title={`Click to listen to syllable: ${ph}`}
                  >
                    <span>{ph}</span>
                    <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                ))}
              </div>

              {/* Action Buttons: Listen & Speak */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {/* Listen to Tutor Button */}
                <button
                  onClick={() => playTeluguSpeech(currentWord.word)}
                  disabled={isPlayingAudio}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-sm border border-blue-200 flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'animate-bounce text-blue-600' : ''}`} />
                  <span>{t('గురువు స్వరం వినండి', 'Listen to Tutor')}</span>
                </button>

                {/* Microphone Record Button */}
                <button
                  onClick={startListening}
                  disabled={isProcessing}
                  className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base text-white flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95 ${
                    isListening
                      ? 'bg-red-500 hover:bg-red-600 ring-4 ring-red-200 animate-pulse'
                      : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-200'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-6 h-6 animate-pulse" />
                      <span>{t('వింటున్నాను... (చదవండి)', 'Listening... (Speak Now)')}</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-6 h-6" />
                      <span>{t('నేను చదువుతాను (Mic)', 'Speak Word (Mic)')}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Live Transcript Display */}
              {spokenTranscript && (
                <div className="mt-6 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 font-medium">
                  {t('మీరు పలికిన పదం:', 'Recognized Speech:')}{' '}
                  <span className="font-bold text-slate-900 text-sm font-telugu bg-white px-2 py-0.5 rounded border border-slate-200 ml-1">
                    {spokenTranscript}
                  </span>
                </div>
              )}
            </div>

            {/* AI Tutor Dialogue Box */}
            {feedbackResult && (
              <div
                className={`rounded-3xl p-6 border shadow-md transition-all animate-in fade-in slide-in-from-bottom-2 ${
                  feedbackResult.status === 'correct'
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50/80 border-amber-200 text-amber-950'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow ${
                      feedbackResult.status === 'correct' ? 'bg-emerald-600' : 'bg-amber-600'
                    }`}
                  >
                    {feedbackResult.status === 'correct' ? (
                      <CheckCircle2 className="w-7 h-7" />
                    ) : (
                      <Smile className="w-7 h-7" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm tracking-tight flex items-center gap-1.5">
                        <span>{feedbackResult.encouragementBadge}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/80 border border-slate-200 font-mono">
                          {feedbackResult.confidence}% Confidence
                        </span>
                      </span>

                      <button
                        onClick={() => playTeluguSpeech(feedbackResult.aiDialogueTelugu)}
                        className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{t('మళ్ళీ వినండి', 'Repeat Voice')}</span>
                      </button>
                    </div>

                    {/* Dialogue Paragraph */}
                    <p className="text-sm sm:text-base font-telugu font-semibold leading-relaxed">
                      {feedbackResult.aiDialogueTelugu}
                    </p>

                    {/* Contrast guidance card if error was detected */}
                    {feedbackResult.contrastIssue && (
                      <div className="mt-3 p-3.5 bg-white rounded-2xl border border-amber-200/90 text-xs text-slate-800 space-y-1.5">
                        <div className="font-bold text-amber-900 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                          <span>{feedbackResult.contrastIssue.error_name}</span>
                        </div>
                        <p className="text-slate-600 leading-normal">
                          {feedbackResult.contrastIssue.explanation_te}
                        </p>
                        <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                          💡 {t('ఉచ్చారణ చిట్కా:', 'Pronunciation Tip:')} {feedbackResult.contrastIssue.tip}
                        </div>
                      </div>
                    )}

                    {/* Slow repetition button */}
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => playTeluguSpeech(feedbackResult.slowRepeatPrompt)}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-sm"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                        <span>{t('నెమ్మదిగా అక్షరాలను వినండి', 'Listen Syllables Slowly')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Curriculum Words Navigator */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-sm">
                    {t('సాధనా పదాల జాబితా (Curriculum)', 'Practice Words')}
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-semibold font-mono">
                  {selectedWordIndex + 1} / {CURRICULUM_WORDS.length}
                </span>
              </div>

              {/* Word List Scroll */}
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {CURRICULUM_WORDS.map((item, idx) => {
                  const isSelected = selectedWordIndex === idx;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedWordIndex(idx)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between group ${
                        isSelected
                          ? 'bg-amber-50 border-amber-300 shadow-sm'
                          : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isSelected ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div>
                          <div className="font-bold font-telugu text-base text-slate-900">
                            {item.word}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {item.meaningEn} • {item.category.split(' ')[0]}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {item.focusPair && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-900">
                            {item.focusPair.split(' ')[0]}
                          </span>
                        )}
                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${
                            isSelected ? 'text-amber-600 translate-x-0.5' : 'text-slate-300'
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Contrast Guide Reference Card */}
            <div className="bg-gradient-to-br from-indigo-900 to-blue-950 text-white rounded-3xl p-5 shadow-md">
              <h4 className="font-bold text-xs uppercase tracking-wider text-blue-200 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{t('ముఖ్యమైన అక్షర భేదాలు (Crucial Contrasts)', 'Crucial Contrasts')}</span>
              </h4>
              <ul className="text-xs space-y-1.5 text-slate-300">
                <li>• <strong className="text-white">త vs ట:</strong> తాత (దంత్యము) vs టమాటా (మూర్ధన్యము)</li>
                <li>• <strong className="text-white">ల vs ళ:</strong> గాలి (సరళము) vs తాళం (మూర్ధన్యము)</li>
                <li>• <strong className="text-white">ద vs డ:</strong> దండ vs డబ్బా</li>
                <li>• <strong className="text-white">శ vs ష vs స:</strong> శివుడు, భాష, సంతోషం</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

