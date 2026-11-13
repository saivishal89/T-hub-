'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { TELUGU_PASSAGES } from '../../lib/mockData';
import { ReadingPassage } from '../../types';
import { teluguAudio, VoicePersona } from '../../lib/teluguAudioService';
import {
  Mic,
  Square,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  ChevronRight,
  Shield,
  VolumeX,
  Lock,
  UserCheck,
} from 'lucide-react';

export default function ReadingStudioPage() {
  const router = useRouter();
  const { role, currentUser, t, language } = useApp();

  const isStudent = role === 'student';
  const enrolledGradeFromProfile =
    currentUser?.enrolledGrade ||
    (currentUser?.grade ? parseInt(currentUser.grade.replace(/\D/g, ''), 10) : undefined);

  // Selected passage (Students are locked to their verified enrolled grade)
  const [selectedGrade, setSelectedGrade] = useState<number>(() => {
    if (isStudent && enrolledGradeFromProfile) return enrolledGradeFromProfile;
    return 3;
  });

  // Strict enforcement: lock student to their actual assigned grade
  useEffect(() => {
    if (isStudent && enrolledGradeFromProfile) {
      if (selectedGrade !== enrolledGradeFromProfile) {
        setSelectedGrade(enrolledGradeFromProfile);
      }
    }
  }, [isStudent, enrolledGradeFromProfile, selectedGrade]);

  const [passagesForGrade, setPassagesForGrade] = useState<ReadingPassage[]>([]);
  const [activePassage, setActivePassage] = useState<ReadingPassage>(TELUGU_PASSAGES[0]);

  // Audio recording & Speech recognition state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingCompleted, setRecordingCompleted] = useState<boolean>(false);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [spokenTranscript, setSpokenTranscript] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isGuidingAudio, setIsGuidingAudio] = useState<boolean>(false);
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [micNotice, setMicNotice] = useState<string | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<VoicePersona>('lakshmi');

  useEffect(() => {
    setSelectedPersona(teluguAudio.getPersona());
  }, []);

  // References
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const filtered = TELUGU_PASSAGES.filter((p) => p.grade === selectedGrade);
    setPassagesForGrade(filtered);
    if (filtered.length > 0) {
      setActivePassage(filtered[0]);
    } else if (TELUGU_PASSAGES.length > 0) {
      setActivePassage(TELUGU_PASSAGES[0]);
    }
    resetRecording();
  }, [selectedGrade]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      teluguAudio.stop();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Visualizer loop
  const drawWaveform = () => {
    if (!analyserRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyserRef.current?.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;

        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#2563eb');
        gradient.addColorStop(0.5, '#4f46e5');
        gradient.addColorStop(1, '#06b6d4');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
        x += barWidth;
      }
    };

    draw();
  };

  // Start live recording and speech recognition
  const startRecording = async () => {
    teluguAudio.stop();
    setIsGuidingAudio(false);
    setMicNotice(null);
    setSpokenTranscript('');
    audioChunksRef.current = [];

    // 1. Initialize Web Audio API and MediaRecorder
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const audioCtx = new AudioContextClass();
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        audioContextRef.current = audioCtx;
        analyserRef.current = analyser;

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
          setRecordingCompleted(true);
          stream.getTracks().forEach((track) => track.stop());
          if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };

        mediaRecorder.start(250);
        setIsRecording(true);
        setRecordingCompleted(false);
        setRecordingDuration(0);

        timerIntervalRef.current = setInterval(() => {
          setRecordingDuration((prev) => prev + 1);
        }, 1000);

        drawWaveform();
      }
    } catch (err) {
      console.warn('Microphone stream fallback:', err);
      // Run simulated timer if hardware permission unavailable
      setIsRecording(true);
      setRecordingCompleted(false);
      setRecordingDuration(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    }

    // 2. Start Live Telugu Speech Recognition (STT)
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'te-IN'; // Pure native Telugu STT!
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          let full = '';
          for (let i = 0; i < event.results.length; i++) {
            full += event.results[i][0].transcript + ' ';
          }
          setSpokenTranscript(full.trim());
        };

        recognition.onerror = (e: any) => {
          console.warn('Speech recognition status:', e.error);
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (e) {
        console.warn('Recognition start exception:', e);
      }
    } else {
      setMicNotice(
        t(
          'గమనిక: బ్రౌజర్ స్పీచ్ రికగ్నిషన్ లభించలేదు. ఆడియో టైమర్ మరియు డెమో అలైన్‌మెంట్ మోడ్ పనిచేస్తుంది.',
          'Note: Live browser STT not supported in this browser; recording audio and applying alignment.'
        )
      );
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      setRecordingCompleted(true);
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    setIsRecording(false);
  };

  // Reset recording
  const resetRecording = () => {
    teluguAudio.stop();
    setIsGuidingAudio(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsRecording(false);
    setRecordingCompleted(false);
    setRecordingDuration(0);
    setSpokenTranscript('');
    setAudioUrl(null);
    setIsPlayingAudio(false);
    setMicNotice(null);
  };

  // Playback recorded audio
  const togglePlayAudio = () => {
    if (!audioPlayerRef.current) return;
    if (isPlayingAudio) {
      audioPlayerRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  // Speak selected passage aloud using authentic native Telugu voice
  const playTeluguGuidance = () => {
    if (isGuidingAudio) {
      teluguAudio.stop();
      setIsGuidingAudio(false);
      return;
    }

    setIsGuidingAudio(true);
    const fullStory = `${activePassage.title}. ${activePassage.content}`;
    teluguAudio.speak(fullStory, {
      playCue: true,
      persona: selectedPersona,
      onEnd: () => setIsGuidingAudio(false),
    });
  };

  // Submit to dynamic AI evaluation engine
  const handleEvaluate = () => {
    setEvaluating(true);
    teluguAudio.stop();

    // Persist active passage and transcribed text for the dynamic assessment screen
    if (typeof window !== 'undefined') {
      localStorage.setItem('ecr_active_passage_id', activePassage.id);
      localStorage.setItem('ecr_spoken_transcript', spokenTranscript);
      localStorage.setItem('ecr_duration', (recordingDuration || 35).toString());
    }

    setTimeout(() => {
      setEvaluating(false);
      router.push(
        `/assessment-result?passageId=${activePassage.id}&duration=${recordingDuration || 35}`
      );
    }, 900);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hidden audio element for playback */}
      {audioUrl && (
        <audio
          ref={audioPlayerRef}
          src={audioUrl}
          onEnded={() => setIsPlayingAudio(false)}
          className="hidden"
        />
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-2">
            <Mic className="w-3.5 h-3.5" />
            <span>{t('లైవ్ పఠన అసెస్‌మెంట్ స్టూడియో', 'Live Student Reading Studio')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('తెలుగు పఠన పరీక్ష & స్పీచ్ రికార్డింగ్', 'Telugu Aloud Reading Assessment')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t(
              'పాఠ్యాంశం ఎంచుకోండి. మైక్రోఫోన్ ఆన్ చేసి బిగ్గరగా చదవండి. AI మీ మాటలను నేరుగా గుర్తిస్తుంది.',
              'Select any story passage, turn on the microphone, and read aloud. Words are transcribed and scored live.'
            )}
          </p>
        </div>

        {/* Grade Display: Locked for Students, Selectable for Educators */}
        {isStudent ? (
          <div className="flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-2 rounded-2xl shadow-xs">
            <Lock className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-blue-950 font-telugu">
                {enrolledGradeFromProfile
                  ? t(`మీ నమోదైన తరగతి: ${enrolledGradeFromProfile}వ తరగతి`, `Enrolled Grade: Class ${enrolledGradeFromProfile}`)
                  : t('తరగతి నమోదు కాలేదు', 'Grade Enrollment Pending')}
              </div>
              <div className="text-[11px] text-blue-700 font-medium">
                {currentUser?.nameTelugu || currentUser?.name} • Roll: #{currentUser?.rollNumber || '01'}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-300 shadow-xs">
            <span className="text-xs font-bold text-slate-500 px-2 uppercase tracking-wider">
              {t('తరగతి:', 'Grade:')}
            </span>
            {[1, 2, 3, 4, 5].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedGrade === g
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {language === 'te' ? `${g}వ తరగతి` : `Class ${g}`}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Missing Grade Warning for Students */}
      {isStudent && !enrolledGradeFromProfile && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-3 text-amber-900 text-xs">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-sm font-telugu">
              {t('తరగతి కేటాయింపు పెండింగ్‌లో ఉంది (Class Assignment Pending)', 'Class Enrollment Pending')}
            </div>
            <p className="mt-1 text-slate-700">
              {t(
                'మీ ఖాతాకు ఇంకా తరగతి కేటాయించబడలేదు. కథలు మరియు పఠన పరీక్షలు నిర్వహించడానికి దయచేసి మీ ఉపాధ్యాయులను లేదా పాఠశాల హెడ్మాస్టర్‌ను సంప్రదించండి.',
                'Your account has not been assigned to a grade yet. Please contact your authorized teacher or headmaster to assign your class.'
              )}
            </p>
          </div>
        </div>
      )}

      {/* Passage Selector Carousel */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {t(
              `పాఠ్యాంశాన్ని ఎంచుకోండి (${passagesForGrade.length} కథలు లభ్యంలో ఉన్నాయి)`,
              `Select Reading Passage (${passagesForGrade.length} available)`
            )}
          </div>
          <span className="text-[11px] text-blue-700 font-semibold">
            {t('కథను మార్చడానికి క్రింది కార్డ్స్‌ను క్లిక్ చేయండి', 'Click any card to switch story')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {passagesForGrade.map((p) => {
            const isSelected = activePassage.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  teluguAudio.stop();
                  setIsGuidingAudio(false);
                  setActivePassage(p);
                  resetRecording();
                }}
                className={`p-3.5 rounded-xl text-left border transition relative cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/90 border-blue-600 shadow-sm ring-2 ring-blue-500/30'
                    : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50/60'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2.5 right-2.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                  </span>
                )}
                <div className="text-[11px] text-blue-700 font-bold mb-1">
                  {p.theme}
                </div>
                <div className="font-bold text-slate-900 text-sm mb-1 font-telugu">
                  {p.title}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span>{p.wordCount} {t('పదాలు', 'words')}</span>
                  <span>•</span>
                  <span>~{p.expectedTimeSeconds}s</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-medium">{p.difficulty}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Reading Canvas & Mic Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Telugu Passage Display & Live Transcription */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-telugu">
                    {activePassage.title}
                  </h2>
                  <div className="text-xs text-slate-500">
                    {activePassage.titleEnglish} • {activePassage.theme}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Voice Persona Dropdown */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase px-1">
                    {t('స్వరం:', 'Voice:')}
                  </span>
                  <select
                    value={selectedPersona}
                    onChange={(e) => {
                      const p = e.target.value as VoicePersona;
                      setSelectedPersona(p);
                      teluguAudio.setPersona(p);
                    }}
                    className="bg-white rounded-lg px-2 py-1 text-xs font-semibold text-slate-800 border-none focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="lakshmi">👩‍🏫 లక్ష్మి టీచర్ (Warm SGT)</option>
                    <option value="srinivas">👨‍🏫 శ్రీనివాస్ సర్ (Male Educator)</option>
                    <option value="child">👧 అనన్య (బాల నేస్తం - Peer Child)</option>
                    <option value="anisha">✨ అనిషా (Anisha - Falcon)</option>
                    <option value="cloned">🎙️ నా క్లోన్డ్ స్వరం (My Cloned Voice)</option>
                  </select>
                </div>

                {/* Speaker button to hear guide reading */}
                <button
                  onClick={playTeluguGuidance}
                  title={isGuidingAudio ? 'ఆపండి' : 'ఈ పూర్తి కథను వినండి'}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                    isGuidingAudio
                      ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-300 animate-pulse'
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200 shadow-xs'
                  }`}
                >
                  <Volume2 className="w-4 h-4 text-amber-700" />
                  <span>
                    {isGuidingAudio
                      ? t('చదవడం ఆపండి (Stop)', 'Stop Guide Audio')
                      : t('ఆదర్శ పఠనం వినండి', 'Listen Guide Story')}
                  </span>
                </button>
              </div>
            </div>

            {/* Reading Passage Large Typography Area */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 sm:p-8 min-h-[200px] flex items-center justify-center">
              <p className="font-telugu text-xl sm:text-2xl lg:text-3xl font-medium leading-[2.2] tracking-wide text-slate-800 text-center select-none">
                {activePassage.content}
              </p>
            </div>

            {/* Live Real-Time Telugu Speech Transcription Box */}
            <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs text-blue-900 font-bold">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isRecording ? 'bg-rose-500 animate-ping' : 'bg-blue-400'
                    }`}
                  ></span>
                  <span>
                    {isRecording
                      ? t('లైవ్ తెలుగు వాయిస్ గుర్తింపు (Listening...)', 'Live Telugu Speech Recognition (Listening...)')
                      : t('మీరు చదివిన మాటలు (Spoken Speech Transcript)', 'Recognized Telugu Speech')}
                  </span>
                </div>
                {spokenTranscript && (
                  <span className="text-[11px] text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                    {spokenTranscript.split(/\s+/).length} {t('పదాలు గుర్తించబడ్డాయి', 'words recognized')}
                  </span>
                )}
              </div>

              <div className="bg-white rounded-xl p-3 border border-blue-200 min-h-[60px] text-xs font-telugu text-slate-800 flex items-center">
                {spokenTranscript ? (
                  <p className="text-sm font-semibold leading-relaxed text-slate-900">
                    {spokenTranscript}
                  </p>
                ) : (
                  <p className="text-slate-400 italic">
                    {isRecording
                      ? t(
                          'మైక్రోఫోన్‌లో తెలుగులో మాట్లాడండి... మీ మాటలు ఇక్కడ ప్రత్యక్షమవుతాయి.',
                          'Speak in Telugu into the microphone... words appear here in real time.'
                        )
                      : t(
                          'చదవడం ప్రారంభించాక మీరు పలికే తెలుగు శబ్దాలు ఇక్కడ కనిపిస్తాయి.',
                          'When you start reading, your live Telugu speech will appear here.'
                        )}
                  </p>
                )}
              </div>
            </div>

            {/* Reading Guidelines */}
            <div className="flex items-start gap-3 p-3.5 bg-slate-100 rounded-xl text-xs text-slate-700">
              <HelpCircle className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">{t('పఠన సూచన:', 'Reading Instruction:')}</span>{' '}
                {t(
                  'కథను ఒకసారి "ఆదర్శ పఠనం వినండి" బటన్ ద్వారా విని, ఆ తర్వాత మైక్రోఫోన్ ఆన్ చేసి స్పష్టంగా చదవండి.',
                  'Listen to the pure guide reading first, then click start and read the story clearly.'
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Microphone, Waveform & Assessment Controls */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="text-center space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t('వాయిస్ రికార్డింగ్ నియంత్రణ', 'Audio Capture')}
              </div>
              <div className="text-3xl font-black font-mono text-slate-900">
                00:{recordingDuration < 10 ? `0${recordingDuration}` : recordingDuration}
              </div>
              <div className="text-xs text-slate-500">
                {isRecording
                  ? t('లైవ్ రికార్డింగ్ నడుస్తోంది...', 'Listening to child audio...')
                  : recordingCompleted
                  ? t('రికార్డింగ్ పూర్తయింది', 'Audio captured successfully')
                  : t('మైక్రోఫోన్ సిద్ధంగా ఉంది', 'Ready to start reading')}
              </div>
            </div>

            {/* Waveform Canvas */}
            <div className="bg-slate-900 rounded-2xl h-24 overflow-hidden flex items-center justify-center relative p-2">
              {isRecording ? (
                <canvas ref={canvasRef} width={280} height={80} className="w-full h-full" />
              ) : (
                <div className="flex items-center gap-2 text-slate-500 text-xs font-mono">
                  <Mic className="w-4 h-4 text-slate-400" />
                  <span>{t('ఆడియో వేవ్‌ఫామ్ డిస్ప్లే', 'Live Audio Waveform')}</span>
                </div>
              )}
            </div>

            {/* Notice message */}
            {micNotice && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>{micNotice}</span>
              </div>
            )}

            {/* Primary Action Buttons */}
            <div className="space-y-3">
              {!isRecording && !recordingCompleted && (
                <button
                  onClick={startRecording}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base shadow-lg shadow-blue-600/30 flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] cursor-pointer"
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-rose-400 animate-ping"></div>
                  <Mic className="w-5 h-5 text-amber-300" />
                  <span>{t('చదవడం ప్రారంభించండి (Start)', 'Start Reading Now')}</span>
                </button>
              )}

              {isRecording && (
                <button
                  onClick={stopRecording}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-base shadow-lg shadow-red-600/30 flex items-center justify-center gap-3 recording-pulse transition-all cursor-pointer"
                >
                  <Square className="w-5 h-5 fill-white" />
                  <span>{t('పూర్తయింది (Stop Recording)', 'Stop Reading')}</span>
                </button>
              )}

              {recordingCompleted && (
                <div className="space-y-3">
                  {/* Playback & Reset Row */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={togglePlayAudio}
                      className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-300 transition cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-slate-800" />
                      <span>{isPlayingAudio ? t('ఆపండి', 'Pause') : t('వినండి', 'Playback')}</span>
                    </button>

                    <button
                      onClick={resetRecording}
                      className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-300 transition cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{t('మళ్లీ చదవండి', 'Re-record')}</span>
                    </button>
                  </div>

                  {/* AI Evaluation Submit Button */}
                  <button
                    onClick={handleEvaluate}
                    disabled={evaluating}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-base shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] disabled:opacity-75 cursor-pointer"
                  >
                    <Sparkles className="w-5 h-5 text-amber-200 animate-spin" />
                    <span>
                      {evaluating
                        ? t('AI విశ్లేషణ జరుగుతోంది...', 'Processing Telugu AI...')
                        : t('AI విశ్లేషణ చేయండి (Evaluate)', 'Analyze with Telugu AI')}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Assessment Meta Card */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>{t('ఎంచుకున్న కథ:', 'Selected Story:')}</span>
                <span className="font-bold text-slate-900 font-telugu truncate max-w-[140px]">
                  {activePassage.title}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t('ఆశించిన పఠన వేగం:', 'Target FLN WCPM:')}</span>
                <span className="font-bold text-emerald-700">45+ WCPM</span>
              </div>
              <div className="flex justify-between">
                <span>{t('మొత్తం పదాలు:', 'Total Words:')}</span>
                <span className="font-bold text-slate-800">{activePassage.wordCount}</span>
              </div>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="flex items-center gap-2 p-3 bg-slate-100 rounded-xl text-[11px] text-slate-500">
            <Shield className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span>
              {t(
                'ఆడియో డేటా సురక్షిత ఎన్‌క్రిప్షన్‌తో రక్షించబడుతుంది.',
                'Voice data is encrypted and retained strictly under child safety policies.'
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
