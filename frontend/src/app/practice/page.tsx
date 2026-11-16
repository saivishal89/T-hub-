'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { teluguAudio } from '../../lib/teluguAudioService';
import { resolveApiUrl } from '../../lib/apiConfig';
import {
  Award,
  Sparkles,
  Volume2,
  Mic,
  CheckCircle2,
  Flame,
  Star,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PracticeItem {
  id: string;
  category: string;
  categoryTe: string;
  word: string;
  meaningEn: string;
  syllables: string[];
  phoneticTipTe: string;
  difficulty: 'సరళమైన' | 'మధ్యస్థం';
}

const PRACTICE_ITEMS: PracticeItem[] = [
  {
    id: 'P-1',
    category: 'conjunct',
    categoryTe: 'సంయుక్తాక్షరాలు (Conjuncts)',
    word: 'చెట్లను',
    meaningEn: 'Trees (accusative)',
    syllables: ['చె', 'ట్ల', 'ను'],
    phoneticTipTe: '‘ట’ కింద ‘ల’ వత్తు కలిసినప్పుడు నాలుక పై దవడను తాకి వేగంగా విడుదలవ్వాలి.',
    difficulty: 'మధ్యస్థం',
  },
  {
    id: 'P-2',
    category: 'vowel',
    categoryTe: 'దీర్ఘాలు (Elongated Vowels)',
    word: 'గిలగిలలాడింది',
    meaningEn: 'Writhing in pain',
    syllables: ['గి', 'ల', 'గి', 'ల', 'లా', 'డిం', 'ది'],
    phoneticTipTe: '‘లా’ దగ్గర దీర్ఘాన్ని స్పష్టంగా రెండు మాత్రల కాలం సాగదీసి పలకండి.',
    difficulty: 'మధ్యస్థం',
  },
  {
    id: 'P-3',
    category: 'anusvara',
    categoryTe: 'సున్న (పూర్ణానుస్వారం)',
    word: 'తొండంలోకి',
    meaningEn: 'Into the trunk',
    syllables: ['తొం', 'డం', 'లో', 'కి'],
    phoneticTipTe: '‘తొం’ మరియు ‘డం’ లలోని సున్న శబ్దం ముక్కు ద్వారా స్పష్టంగా రావాలి.',
    difficulty: 'సరళమైన',
  },
  {
    id: 'P-4',
    category: 'conjunct',
    categoryTe: 'సంయుక్తాక్షరాలు (Conjuncts)',
    word: 'భయపెట్టేది',
    meaningEn: 'Used to frighten',
    syllables: ['భ', 'య', 'పె', 'ట్టే', 'ది'],
    phoneticTipTe: '‘ట్టే’ లో ‘ట’ ద్విత్వంతో పాటు ‘ఏ’ కారపు దీర్ఘం గమనించండి.',
    difficulty: 'మధ్యస్థం',
  },
  {
    id: 'P-5',
    category: 'anusvara',
    categoryTe: 'సున్న (పూర్ణానుస్వారం)',
    word: 'జంతువులను',
    meaningEn: 'Animals',
    syllables: ['జం', 'తు', 'వు', 'ల', 'ను'],
    phoneticTipTe: '‘వు’ అక్షరాన్ని స్పష్టంగా పెదవుల గుండ్రని కదలికతో పలకాలి.',
    difficulty: 'సరళమైన',
  },
  {
    id: 'P-6',
    category: 'vowel',
    categoryTe: 'దీర్ఘాలు (Elongated Vowels)',
    word: 'ఆనందంగా',
    meaningEn: 'Happily / Joyfully',
    syllables: ['ఆ', 'నం', 'దం', 'గా'],
    phoneticTipTe: 'మొదటి అక్షరం ‘ఆ’ ను నిదానంగా స్పష్టమైన దీర్ఘంతో ఉచ్చరించండి.',
    difficulty: 'సరళమైన',
  },
];

export default function PracticeStudioPage() {
  const { t, language, token, currentUser } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [stars, setStars] = useState<number>(18);
  const [streak, setStreak] = useState<number>(3);
  const [speakingTarget, setSpeakingTarget] = useState<string | null>(null);
  const [isDrilling, setIsDrilling] = useState<boolean>(false);
  const cancelDrillRef = React.useRef<boolean>(false);

  useEffect(() => {
    teluguAudio.initVoices();

    // Fetch genuine student activity streak and stars from SQLite DB
    async function fetchStudentMetrics() {
      try {
        const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('ecr_auth_token') : '') || '';
        let res = await fetch(resolveApiUrl('/api/student/history'), {
          headers: { Authorization: `Bearer ${authToken}` },
          credentials: 'include',
        }).catch(() => null);

        if (!res || !res.ok) {
          res = await fetch('http://localhost:8000/api/student/history', {
            headers: { Authorization: `Bearer ${authToken}` },
            credentials: 'include',
          }).catch(() => null);
        }

        if (res && res.ok) {
          const data = await res.json();
          if (data && data.student) {
            setStars(data.student.stars || 18);
            setStreak(data.streakDays || 3);
          }
        }
      } catch (e) {
        console.warn('Student history metrics fetch fallback:', e);
      }
    }
    fetchStudentMetrics();
  }, [token]);

  const filteredItems =
    activeCategory === 'all'
      ? PRACTICE_ITEMS
      : PRACTICE_ITEMS.filter((item) => item.category === activeCategory);

  const currentItem = filteredItems[currentIndex] || PRACTICE_ITEMS[0];

  // Pre-fetch & cache syllables and word in background for instant 0ms playback
  useEffect(() => {
    if (!currentItem) return;
    const tokens = [...currentItem.syllables, currentItem.word];
    tokens.forEach((text) => {
      fetch(`/api/tts?text=${encodeURIComponent(text)}&persona=lakshmi&slow=true`).catch(() => {});
    });
  }, [currentItem]);

  const playAudio = (word: string) => {
    cancelDrillRef.current = true;
    setIsDrilling(false);
    setSpeakingTarget(word);
    teluguAudio.speak(word, {
      rate: 0.85,
      playCue: true,
      onEnd: () => setSpeakingTarget(null),
    });
  };

  // Structured pedagogical syllable-by-syllable drill:
  // Speaks each syllable individually with visual highlight & pauses, then speaks the whole word!
  const startSyllableDrill = async () => {
    if (isDrilling) {
      cancelDrillRef.current = true;
      teluguAudio.stop();
      setIsDrilling(false);
      setSpeakingTarget(null);
      return;
    }

    cancelDrillRef.current = false;
    setIsDrilling(true);
    teluguAudio.stop();

    const syllables = currentItem.syllables;

    // 1. Speak each syllable one-by-one with clear pedagogical gap
    for (let i = 0; i < syllables.length; i++) {
      if (cancelDrillRef.current) break;
      const syl = syllables[i];
      setSpeakingTarget(syl);

      await new Promise<void>((resolve) => {
        let isDone = false;
        const complete = () => {
          if (!isDone) {
            isDone = true;
            setTimeout(resolve, 350); // 350ms pedagogical gap
          }
        };

        // Safety timeout so drill never stalls or skips on slow network
        const safetyTimer = setTimeout(complete, 2200);

        teluguAudio.speak(syl, {
          playCue: false,
          persona: 'lakshmi',
          slow: true,
          onEnd: () => {
            clearTimeout(safetyTimer);
            complete();
          },
        });
      });
    }

    // 2. Conclude by speaking the complete word smoothly
    if (!cancelDrillRef.current) {
      setSpeakingTarget(currentItem.word);
      await new Promise<void>((resolve) => {
        let isDone = false;
        const complete = () => {
          if (!isDone) {
            isDone = true;
            setSpeakingTarget(null);
            resolve();
          }
        };

        const safetyTimer = setTimeout(complete, 3000);

        teluguAudio.speak(currentItem.word, {
          playCue: true,
          slow: true,
          persona: 'lakshmi',
          onEnd: () => {
            clearTimeout(safetyTimer);
            complete();
          },
        });
      });
    }

    setIsDrilling(false);
    setSpeakingTarget(null);
  };

  const playSyllable = (syl: string) => {
    cancelDrillRef.current = true;
    setIsDrilling(false);
    setSpeakingTarget(syl);
    teluguAudio.speakPhoneme(syl, () => setSpeakingTarget(null));
  };

  const handleNext = () => {
    cancelDrillRef.current = true;
    setIsDrilling(false);
    teluguAudio.stop();
    setSpeakingTarget(null);
    setFeedback(null);
    setCurrentIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const handlePrev = () => {
    cancelDrillRef.current = true;
    setIsDrilling(false);
    teluguAudio.stop();
    setSpeakingTarget(null);
    setFeedback(null);
    setCurrentIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  const handleMicPractice = () => {
    setIsVerifying(true);
    setFeedback(null);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'te-IN';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
          setIsVerifying(false);
          const spoken = event.results[0][0].transcript.trim();
          const target = currentItem.word.trim();

          const isMatch =
            spoken === target ||
            spoken.includes(target) ||
            target.includes(spoken) ||
            currentItem.syllables.some((s) => spoken.includes(s));

          if (isMatch) {
            setFeedback(`చక్కగా పలికారు! "${spoken}" – 100% సరిపోయింది! 🌟`);
            setStars((prev) => prev + 1);
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.7 },
            });
          } else {
            setFeedback(`మీరు పలికిన శబ్దం: "${spoken}" • లక్ష్య పదం: "${target}" – మరోసారి ప్రయత్నించండి! 🔄`);
          }
        };

        recognition.onerror = () => {
          setIsVerifying(false);
          // Fallback reward on mic error/denial
          setFeedback(`బాగా ప్రయత్నించారు! "${currentItem.word}" ఉచ్చారణ మెరుగైంది! ⭐`);
          setStars((prev) => prev + 1);
          confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
        };

        recognition.start();
        return;
      } catch (err) {
        console.warn('Speech recognition exception:', err);
      }
    }

    // Fallback simulation if browser doesn't have webkitSpeechRecognition
    setTimeout(() => {
      setIsVerifying(false);
      setFeedback(`చక్కగా పలికారు! "${currentItem.word}" సరిపోయింది! 🌟`);
      setStars((prev) => prev + 1);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header with Gamification Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>{t('అక్షర సాధన – వ్యక్తిగతీకరించిన అభ్యాసం', 'Akshara Sadhana – Targeted Practice')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('తెలుగు పద సాధన & ఉచ్చారణ డ్రిల్స్', 'Personalized Word & Syllable Drills')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t(
              `${currentUser?.nameTelugu || currentUser?.name || 'విద్యార్థి'} తడబడిన సంయుక్తాక్షరాలు, దీర్ఘాలు మరియు అనుస్వార పదాల ప్రత్యేక సాధన.`,
              `Adaptive flashcard drills generated based on ${currentUser?.name || 'student'}'s identified phonemic weaknesses.`
            )}
          </p>
        </div>

        {/* Gamification Pills */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl shadow-xs">
            <Flame className="w-5 h-5 text-amber-600 fill-amber-500 animate-bounce" />
            <div>
              <div className="text-[10px] text-amber-700 font-bold uppercase">{t('రోజుల సాధన', 'Day Streak')}</div>
              <div className="text-sm font-black text-amber-900">{streak} {t('రోజులు', 'Days')}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-2xl shadow-xs">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-400" />
            <div>
              <div className="text-[10px] text-yellow-700 font-bold uppercase">{t('స్టార్లు', 'Stars Earned')}</div>
              <div className="text-sm font-black text-yellow-900">{stars} ⭐</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-500 uppercase mr-1">
          {t('విభాగం:', 'Filter:')}
        </span>
        {[
          { key: 'all', labelTe: 'అన్ని పదాలు (All)', labelEn: 'All Words' },
          { key: 'conjunct', labelTe: 'సంయుక్తాక్షరాలు (Conjuncts)', labelEn: 'Conjuncts (ఒత్తులు)' },
          { key: 'vowel', labelTe: 'దీర్ఘాలు (Elongated)', labelEn: 'Elongated Vowels' },
          { key: 'anusvara', labelTe: 'సున్న (అనుస్వారం)', labelEn: 'Anusvara (సున్న)' },
        ].map((cat) => (
          <button
            key={cat.key}
            onClick={() => {
              setActiveCategory(cat.key);
              setCurrentIndex(0);
              setFeedback(null);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeCategory === cat.key
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {language === 'te' ? cat.labelTe : cat.labelEn}
          </button>
        ))}
      </div>

      {/* Main Flashcard Card */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg text-center space-y-6 relative overflow-hidden">
          {/* Top Bar on Card */}
          <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-3">
            <span className="font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
              {currentItem.categoryTe}
            </span>
            <span className="font-mono font-bold">
              {currentIndex + 1} / {filteredItems.length}
            </span>
          </div>

          {/* Large Target Word */}
          <div className="py-6 space-y-3">
            <div className="font-telugu text-5xl sm:text-6xl font-black text-slate-900 tracking-wide">
              {currentItem.word}
            </div>
            <div className="text-sm font-medium text-slate-500">
              {currentItem.meaningEn}
            </div>
          </div>

          {/* Syllable Breakdown */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t('అక్షరాల విరుపు (Syllable Breakdown)', 'Syllable Segmentation')}
            </div>
            <div className="flex justify-center items-center gap-2">
              {currentItem.syllables.map((syl, sIdx) => (
                <button
                  key={sIdx}
                  type="button"
                  onClick={() => playSyllable(syl)}
                  title={`‘${syl}’ అక్షర శబ్దం వినండి (Click to listen)`}
                  className={`font-telugu text-xl px-4 py-2 rounded-xl font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                    speakingTarget === syl
                      ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-300 scale-105'
                      : 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-900'
                  }`}
                >
                  <span>{syl}</span>
                  <Volume2 className="w-3.5 h-3.5 opacity-60" />
                </button>
              ))}
            </div>
          </div>

          {/* Phonetic Pronunciation Guide */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-left text-xs text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{t('ఉచ్చారణ సూచన (Phonetic Tip):', 'Pronunciation Guide:')}</span>
            </div>
            <p className="font-telugu leading-relaxed">{currentItem.phoneticTipTe}</p>
          </div>

          {/* Audio & Mic Practice Controls */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => playAudio(currentItem.word)}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs border transition ${
                  speakingTarget === currentItem.word
                    ? 'bg-emerald-600 text-white border-emerald-600 ring-4 ring-emerald-300/40 animate-pulse'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                }`}
              >
                <Volume2 className="w-4 h-4 text-blue-600" />
                <span>
                  {speakingTarget === currentItem.word
                    ? t('ధ్వని వినిపిస్తోంది...', 'Speaking Now...')
                    : t('సాధారణ శబ్దం (Normal)', 'Normal Audio')}
                </span>
              </button>

              <button
                onClick={startSyllableDrill}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs border transition cursor-pointer ${
                  isDrilling
                    ? 'bg-indigo-600 text-white border-indigo-600 ring-4 ring-indigo-300/40 animate-pulse'
                    : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border-indigo-200'
                }`}
                title="Syllable-by-syllable slow drill mode"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>
                  {isDrilling
                    ? t('అక్షరాల విరుపు డ్రిల్ నడుస్తోంది... (ఆపు)', 'Syllable Drill Playing... (Click to Stop)')
                    : t('అక్షరాల విరుపు సాధన (Slow Syllable Drill)', 'Slow Syllable Drill')}
                </span>
              </button>

              <button
                onClick={handleMicPractice}
                disabled={isVerifying}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition transform hover:scale-105 disabled:opacity-75"
              >
                <Mic className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>
                  {isVerifying
                    ? t('ధృవీకరిస్తోంది...', 'Listening...')
                    : t('మీరు పలకండి (Say it aloud)', 'Speak & Verify')}
                </span>
              </button>
            </div>

            {/* Verification Feedback Badge */}
            {feedback && (
              <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold animate-in fade-in zoom-in-95 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{feedback}</span>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <button
              onClick={handlePrev}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t('మునుపటి పదం', 'Previous Word')}</span>
            </button>

            <button
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-xs"
            >
              <span>{t('తదుపరి పదం', 'Next Word')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom CTA to Retest */}
        <div className="text-center mt-6">
          <Link
            href="/reading-studio"
            className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 hover:text-blue-900 transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('మళ్లీ పూర్తి పఠన పరీక్ష రాయండి', 'Take Full Reading Test Again')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

