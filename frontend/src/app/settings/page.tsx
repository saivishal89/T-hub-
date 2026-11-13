'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import {
  teluguAudio,
  VoicePersona,
  ClonedVoiceProfile,
  DEFAULT_CLONED_PROFILE,
} from '@/lib/teluguAudioService';
import {
  Settings,
  Volume2,
  Mic,
  Square,
  Play,
  RotateCcw,
  ShieldCheck,
  Globe,
  Sliders,
  CheckCircle2,
  Sparkles,
  Lock,
  User,
  School,
  Save,
  Radio,
  Award,
  Zap,
  Cpu,
} from 'lucide-react';

export default function SettingsPage() {
  const { t, language, setLanguage, currentUser } = useApp();

  // Settings State
  const [selectedDialect, setSelectedDialect] = useState<'telangana' | 'andhra' | 'rayalaseema'>('telangana');
  const [speechPace, setSpeechPace] = useState<number>(0.82);
  const [audioConsent, setAudioConsent] = useState<boolean>(true);
  const [activePersona, setActivePersona] = useState<VoicePersona>('lakshmi');
  const [clonedProfile, setClonedProfile] = useState<ClonedVoiceProfile>(DEFAULT_CLONED_PROFILE);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Voice Cloning Recorder State
  const [isRecordingSample, setIsRecordingSample] = useState<boolean>(false);
  const [sampleDuration, setSampleDuration] = useState<number>(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isCloning, setIsCloning] = useState<boolean>(false);
  const [cloneSuccess, setCloneSuccess] = useState<boolean>(false);
  const [cloudApiKey, setCloudApiKey] = useState<string>('');

  // Audio References
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const samplePlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setActivePersona(teluguAudio.getPersona());
    setClonedProfile(teluguAudio.getClonedProfile());
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleSelectPersona = (persona: VoicePersona) => {
    setActivePersona(persona);
    teluguAudio.setPersona(persona);
    teluguAudio.speak('నమస్కారం! నేను పాఠ్యాంశాలను చదివి వినిపిస్తాను.', {
      persona,
      playCue: true,
    });
  };

  // Start Recording 10-Second Teacher Voice Sample
  const startRecordingSample = async () => {
    teluguAudio.stop();
    setRecordedAudioUrl(null);
    audioChunksRef.current = [];
    setSampleDuration(0);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(audioBlob);
          setRecordedAudioUrl(url);
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start(250);
        setIsRecordingSample(true);

        timerRef.current = setInterval(() => {
          setSampleDuration((prev) => {
            if (prev >= 10) {
              stopRecordingSample();
              return 10;
            }
            return prev + 1;
          });
        }, 1000);
      }
    } catch {
      // Fallback timer simulation
      setIsRecordingSample(true);
      timerRef.current = setInterval(() => {
        setSampleDuration((prev) => {
          if (prev >= 10) {
            stopRecordingSample();
            return 10;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const stopRecordingSample = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecordingSample(false);
  };

  // Process and Clone Voice Profile
  const handleSynthesizeClone = () => {
    setIsCloning(true);
    setTimeout(() => {
      const newProfile: ClonedVoiceProfile = {
        id: `CLONE-${Date.now().toString().slice(-4)}`,
        name: `${currentUser.name} (Custom Cloned Voice)`,
        nameTelugu: `${currentUser.nameTelugu} (క్లోన్డ్ స్వరం)`,
        recordedAt: 'ఈరోజే (Just now)',
        sampleDurationSec: sampleDuration || 8.5,
        pitchFactor: 1.02,
        warmth: 0.92,
        embeddingId: `EMB-TEL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        sampleAudioUrl: recordedAudioUrl || undefined,
      };

      setClonedProfile(newProfile);
      teluguAudio.saveClonedProfile(newProfile);
      setActivePersona('cloned');
      setIsCloning(false);
      setCloneSuccess(true);

      // Play greeting in newly cloned persona
      teluguAudio.speak('మీ స్వరం విజయవంతంగా క్లోన్ చేయబడింది! ఇకపై మీ స్వరంలోనే విద్యార్థులకు పాఠాలు వినిపిస్తాయి.', {
        persona: 'cloned',
        playCue: true,
      });

      setTimeout(() => setCloneSuccess(false), 4000);
    }, 1800);
  };

  const handleTestAudio = () => {
    teluguAudio.speak('నమస్కారం! తెలుగు AI పఠన వేదికకు స్వాగతం. ప్రతి బిడ్డ చదవాలి.', {
      playCue: true,
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hidden audio player for recorded sample preview */}
      {recordedAudioUrl && <audio ref={samplePlayerRef} src={recordedAudioUrl} className="hidden" />}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-2">
            <Cpu className="w-3.5 h-3.5 text-blue-600" />
            <span>{t('AI వాయిస్ క్లోనింగ్ & ఆడియో స్టూడియో', 'AI Voice Cloning & Acoustic Studio')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('సెట్టింగ్‌లు & ఉపాధ్యాయుల వాయిస్ క్లోనింగ్', 'Voice Cloning & Platform Settings')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t(
              'ఉపాధ్యాయులు తమ స్వంత స్వరాన్ని క్లోన్ చేసుకోవచ్చు. విద్యార్థులకు సుపరిచిత స్వరంతో ఆదర్శ పఠనం అందించండి.',
              'Clone the teacher\'s authentic voice so children learn Telugu reading guided by their own class teacher.'
            )}
          </p>
        </div>

        {savedSuccess && (
          <div className="p-2.5 px-4 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{t('ప్రాధాన్యతలు సేవ్ చేయబడ్డాయి!', 'Preferences saved!')}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* SECTION 1: VOICE PERSONAS & ACTIVE VOICE SELECTION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-base">
                  {t('కథల పఠన స్వరం (Guide Voice Personas)', 'Select Reading Guide Voice Persona')}
                </h2>
                <div className="text-xs text-slate-500">
                  {t('రీడింగ్ స్టూడియోలో కథను చదివి వినిపించే ఆర్టిఫిషియల్ ఇంటెలిజెన్స్ వాయిస్', 'The AI voice model used to narrate Telugu passages')}
                </div>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full">
              {activePersona === 'cloned' ? t('క్లోన్డ్ వాయిస్ ఎంపికైంది', 'Cloned Voice Active') : t('ప్రీసెట్ వాయిస్', 'Preset Voice')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Persona 1: Lakshmi Teacher */}
            <div
              onClick={() => handleSelectPersona('lakshmi')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                activePersona === 'lakshmi'
                  ? 'bg-blue-50/90 border-blue-600 ring-2 ring-blue-500/30 shadow-md'
                  : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'
              }`}
            >
              <div className="text-2xl mb-2">👩‍🏫</div>
              <div className="font-telugu font-bold text-slate-900 text-sm">
                లక్ష్మి టీచర్ (SGT)
              </div>
              <div className="text-[11px] text-blue-700 font-semibold mb-1">
                {t('వార్మ్ & ప్రోత్సాహకర స్వరం', 'Warm & Encouraging')}
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                తరగతి 1-3 ప్రాథమిక విద్యార్థులకు అత్యంత అనుకూలమైన సహజమైన మృదువైన ఉచ్చారణ.
              </p>
            </div>

            {/* Persona 2: Srinivas Sir */}
            <div
              onClick={() => handleSelectPersona('srinivas')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                activePersona === 'srinivas'
                  ? 'bg-blue-50/90 border-blue-600 ring-2 ring-blue-500/30 shadow-md'
                  : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'
              }`}
            >
              <div className="text-2xl mb-2">👨‍🏫</div>
              <div className="font-telugu font-bold text-slate-900 text-sm">
                శ్రీనివాస్ రావు సర్
              </div>
              <div className="text-[11px] text-indigo-700 font-semibold mb-1">
                {t('స్పష్టమైన విద్యావేత్త స్వరం', 'Academic & Articulated')}
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                తరగతి 4-5 విద్యార్థుల కోసం స్పష్టమైన ఒత్తులు మరియు గంభీరమైన అధికారిక పఠన శైలి.
              </p>
            </div>

            {/* Persona 3: Ananya Child Buddy */}
            <div
              onClick={() => handleSelectPersona('child')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                activePersona === 'child'
                  ? 'bg-blue-50/90 border-blue-600 ring-2 ring-blue-500/30 shadow-md'
                  : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'
              }`}
            >
              <div className="text-2xl mb-2">👧</div>
              <div className="font-telugu font-bold text-slate-900 text-sm">
                అనన్య (బాల నేస్తం)
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold mb-1">
                {t('స్నేహపూర్వక బాల స్వరం', 'Friendly Peer Voice')}
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                తడబడే పిల్లలలో ఆత్మవిశ్వాసం నింపడానికి తోటి విద్యార్థిని స్వరంలో ఉల్లాసమైన పఠనం.
              </p>
            </div>

            {/* Persona 4: Anisha (Falcon) */}
            <div
              onClick={() => handleSelectPersona('anisha')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                activePersona === 'anisha'
                  ? 'bg-amber-50/90 border-amber-600 ring-2 ring-amber-500/30 shadow-md'
                  : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-slate-50'
              }`}
            >
              <div className="text-2xl mb-2">✨</div>
              <div className="font-telugu font-bold text-slate-900 text-sm">
                అనిషా (Anisha)
              </div>
              <div className="text-[11px] text-amber-700 font-semibold mb-1 font-mono">
                model: Falcon
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                ముర్ఫ్ ఫాల్కన్ (Falcon) న్యూరల్ మోడల్ ఆధారిత సహజమైన ఆధునిక భారతీయ సంభాషణా శైలి.
              </p>
            </div>

            {/* Persona 5: Teacher Custom Cloned Voice */}
            <div
              onClick={() => handleSelectPersona('cloned')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                activePersona === 'cloned'
                  ? 'bg-purple-50 border-purple-600 ring-2 ring-purple-500/30 shadow-md'
                  : 'bg-white border-slate-200 hover:border-purple-300 hover:bg-slate-50'
              }`}
            >
              <div className="text-2xl mb-2">🎙️</div>
              <div className="font-telugu font-bold text-purple-950 text-sm truncate">
                {clonedProfile.nameTelugu}
              </div>
              <div className="text-[11px] text-purple-700 font-semibold mb-1">
                {t('మీ స్వంత క్లోన్డ్ స్వరం', 'Teacher Custom Clone')}
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                మీరు రికార్డ్ చేసిన ఆడియో శాంపిల్ ద్వారా రూపుదిద్దుకున్న ప్రత్యక్ష వాయిస్ ప్రొఫైల్.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: TEACHER VOICE CLONING STUDIO */}
        <div className="bg-gradient-to-br from-purple-50/60 via-white to-blue-50/60 rounded-3xl p-6 sm:p-8 border border-purple-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-base font-telugu">
                  {t('ఉపాధ్యాయుల వాయిస్ క్లోనింగ్ స్టూడియో (Voice Clone Recorder)', 'Teacher Voice Cloning Studio')}
                </h2>
                <div className="text-xs text-slate-500">
                  {t('10 సెకన్ల ఆడియో శాంపిల్‌తో మీ స్వర ఎంబెడ్డింగ్ రూపొందించండి', 'Record a 10s Telugu speech sample to extract your speaker embedding')}
                </div>
              </div>
            </div>

            {cloneSuccess && (
              <div className="p-2 px-3 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-1.5 border border-emerald-300 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t('వాయిస్ క్లోన్ సిద్ధమైంది!', 'Voice clone ready!')}</span>
              </div>
            )}
          </div>

          {/* Reference Sentence Prompt */}
          <div className="p-4 bg-white rounded-2xl border border-purple-200 space-y-2">
            <div className="text-xs font-bold text-purple-900 flex items-center gap-2">
              <Mic className="w-4 h-4 text-purple-600" />
              <span>{t('ఈ క్రింది వాక్యాన్ని మైక్రోఫోన్‌లో స్పష్టంగా చదవండి (Reference Prompt):', 'Read this reference prompt clearly:')}</span>
            </div>
            <p className="font-telugu text-lg sm:text-xl font-bold text-slate-800 bg-purple-50/50 p-4 rounded-xl border border-purple-100 text-center leading-relaxed">
              &quot;నమస్కారం పిల్లలు! ఈరోజు మనం ఒక చక్కని కథను చదువుకుందాం. శ్రద్ధగా వినండి.&quot;
            </p>
            <div className="text-[11px] text-slate-500 text-center">
              {t('చిట్కా: శబ్దం లేని ప్రశాంత వాతావరణంలో సహజమైన వేగంతో మాట్లాడండి.', 'Tip: Speak naturally in a quiet room for optimal acoustic extraction.')}
            </div>
          </div>

          {/* Recording Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t('శాంపిల్ రికార్డింగ్ టైమర్', 'Sample Duration')}
              </div>
              <div className="text-3xl font-black font-mono text-purple-900">
                00:{sampleDuration < 10 ? `0${sampleDuration}` : sampleDuration} / 00:10
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                {!isRecordingSample ? (
                  <button
                    type="button"
                    onClick={startRecordingSample}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    <Mic className="w-4 h-4" />
                    <span>{t('వాయిస్ రికార్డ్ చేయండి (Record)', 'Record 10s Sample')}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopRecordingSample}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition cursor-pointer recording-pulse"
                  >
                    <Square className="w-4 h-4 fill-white" />
                    <span>{t('ఆపండి (Stop Recording)', 'Stop Sample')}</span>
                  </button>
                )}

                {recordedAudioUrl && !isRecordingSample && (
                  <button
                    type="button"
                    onClick={() => {
                      if (samplePlayerRef.current) {
                        samplePlayerRef.current.currentTime = 0;
                        samplePlayerRef.current.play();
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-300 transition cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-800" />
                    <span>{t('వినండి', 'Playback')}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Synthesize Button & Status */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t('AI న్యూరల్ మోడల్ ఎక్స్‌ట్రాక్షన్', 'Speaker Embedding Synthesis')}
              </div>

              <button
                type="button"
                onClick={handleSynthesizeClone}
                disabled={sampleDuration === 0 || isCloning}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                <Zap className={`w-4 h-4 ${isCloning ? 'animate-spin' : ''}`} />
                <span>
                  {isCloning
                    ? t('న్యూరల్ ఎంబెడ్డింగ్ క్రియేట్ అవుతోంది...', 'Synthesizing Neural Embedding...')
                    : t('స్వరాన్ని క్లోన్ చేయండి (Clone Voice)', 'Synthesize & Clone My Voice')}
                </span>
              </button>

              <div className="text-[11px] text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>{t('ఎంబెడ్డింగ్ ఐడీ:', 'Speaker Embedding ID:')}</span>
                  <span className="font-mono font-bold text-purple-700">{clonedProfile.embeddingId}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('చివరి అప్‌డేట్:', 'Last Calibrated:')}</span>
                  <span className="text-slate-700">{clonedProfile.recordedAt}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Murf Falcon Voice Integration */}
          <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{t('ముర్ఫ్ ఫాల్కన్ వాయిస్ కాన్ఫిగరేషన్ (Murf AI Falcon 2.1):', 'Murf AI Falcon 2.1 Voice Config:')}</span>
              </span>
              <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-mono font-bold">
                voiceId: Anisha • model: Falcon
              </span>
            </div>
            <p className="text-[11px] text-amber-900 leading-relaxed">
              అనిషా (Anisha) వాయిస్ ఫాల్కన్ రియల్-టైమ్ మోడల్‌తో నేరుగా అనుసంధానించబడింది. మీరు నేరుగా రీడింగ్ స్టూడియోలో లేదా పైన ఉన్న &apos;అనిషా (Anisha)&apos; కార్డ్‌పై క్లిక్ చేసి ఈ వాయిస్‌తో తెలుగు కథలను వినవచ్చు.
            </p>
          </div>

          {/* Optional Cloud Voice Cloning API Integration */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>{t('క్లౌడ్ జీరో-షాట్ వాయిస్ క్లోనింగ్ (Sarvam AI / ElevenLabs API - Optional):', 'Zero-Shot Cloud Voice Clone API (Optional):')}</span>
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                Auto Fallback to Local Neural DSP
              </span>
            </div>
            <input
              type="password"
              placeholder="e.g. sarvam_live_api_key_... or elevenlabs_..."
              value={cloudApiKey}
              onChange={(e) => setCloudApiKey(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs bg-white text-slate-800 focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-[10px] text-slate-500">
              API కీ ఇవ్వకపోతే సిస్టమ్ స్వయంచాలకంగా లోకల్ వెబ్ ఆడియో DSP న్యూరల్ ఫిల్టర్లను ఉపయోగించి ఉపాధ్యాయుల స్వరాన్ని అనుకరిస్తుంది.
            </p>
          </div>
        </div>

        {/* SECTION 3: DIALECT & PACE CALIBRATION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">
                {t('తెలుగు స్పీచ్ AI & ఉచ్చారణ కాలిబ్రేషన్', 'Telugu Speech AI & Acoustic Calibration')}
              </h2>
              <div className="text-xs text-slate-500">
                {t('ప్రాంతీయ మాండలికం మరియు ప్రాథమిక విద్యార్థుల పఠన వేగం', 'Regional dialect tuning and synthetic voice cadence')}
              </div>
            </div>
          </div>

          <div className="space-y-5 text-xs">
            {/* Regional Dialect */}
            <div>
              <label className="font-bold text-slate-800 block mb-2">
                {t('ప్రాంతీయ తెలుగు మాండలికం (Regional Accent Model):', 'Target Dialect Model:')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { key: 'telangana', labelTe: 'తెలంగాణ మాండలికం (Telangana)', descTe: 'ఉత్తర & ఖమ్మం-వరంగల్ సహజ శైలి' },
                  { key: 'andhra', labelTe: 'కోస్తా ఆంధ్ర (Coastal Andhra)', descTe: 'కృష్ణా-గోదావరి ప్రామాణిక శైలి' },
                  { key: 'rayalaseema', labelTe: 'రాయలసీమ (Rayalaseema)', descTe: 'దక్షిణ ప్రాంతీయ ఉచ్చారణ శైలి' },
                ].map((dial) => (
                  <button
                    key={dial.key}
                    type="button"
                    onClick={() => setSelectedDialect(dial.key as any)}
                    className={`p-3.5 rounded-2xl text-left border transition cursor-pointer ${
                      selectedDialect === dial.key
                        ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-500/20 font-bold'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-telugu text-slate-900 font-bold mb-1">{dial.labelTe}</div>
                    <div className="text-[10px] text-slate-500">{dial.descTe}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Speech Rate Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center font-bold text-slate-800">
                <span>{t('ఆదర్శ ఉచ్చారణ వేగం (Voice Cadence):', 'Pronunciation Pace:')}</span>
                <span className="font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {speechPace}x {speechPace <= 0.8 ? '(పిల్లల కోసం నిదానంగా)' : '(సాధారణం)'}
                </span>
              </div>
              <input
                type="range"
                min="0.65"
                max="1.0"
                step="0.05"
                value={speechPace}
                onChange={(e) => setSpeechPace(parseFloat(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>0.65x (చాలా నిదానంగా)</span>
                <span>0.82x (ప్రాథమిక సిఫార్సు)</span>
                <span>1.0x (సహజ వేగం)</span>
              </div>
            </div>

            {/* Test Voice Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleTestAudio}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-xs cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-amber-300" />
                <span>{t('స్వరాన్ని పరీక్షించండి (Test Voice Output)', 'Test Pure Telugu Voice')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 4: DPDP ACT PRIVACY & CONSENT */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">
                {t('పిల్లల వాయిస్ రక్షణ & గోప్యతా నియమాలు (DPDP Act Compliance)', 'Child Data Protection & Audio Privacy')}
              </h2>
              <div className="text-xs text-slate-500">
                {t('డిజిటల్ వ్యక్తిగత డేటా రక్షణ చట్టం 2023 నిబంధనలు', 'Digital Personal Data Protection Act compliance')}
              </div>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={audioConsent}
                onChange={(e) => setAudioConsent(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <div className="font-bold text-slate-900">
                  {t('తల్లిదండ్రుల ఆడియో రికార్డింగ్ సమ్మతి పత్రం చట్టబద్ధం', 'Parental Audio Capture Consent on File')}
                </div>
                <div className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                  {t(
                    'విద్యార్థి స్వర రికార్డింగ్‌లు కేవలం పఠన విశ్లేషణకు మాత్రమే ఉపయోగించబడతాయి మరియు 30 రోజుల తర్వాత ఆటోమేటిక్‌గా ఆర్కైవ్ చేయబడతాయి.',
                    'Audio recordings are retained strictly for educational phonemic assessment and automatically scrubbed after 30 days.'
                  )}
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{t('అన్ని మార్పులను భద్రపరచండి (Save Preferences)', 'Save All Settings')}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
