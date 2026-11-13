'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { WordAnalysis, AssessmentResult } from '../../types';
import { teluguAudio } from '../../lib/teluguAudioService';
import { evaluateDynamicReading } from '../../lib/dynamicEvaluation';
import {
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Volume2,
  Printer,
  Share2,
  ArrowRight,
  TrendingUp,
  Clock,
  BookOpen,
  HelpCircle,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  UserCheck,
  MessageSquare,
} from 'lucide-react';

function AssessmentResultContent() {
  const { t, language } = useApp();
  const searchParams = useSearchParams();

  const passageId = searchParams.get('passageId') || 'PSG-001';
  const duration = Number(searchParams.get('duration')) || 38;

  const [result, setResult] = useState<AssessmentResult>(() =>
    evaluateDynamicReading(passageId, '', duration)
  );
  const [selectedWord, setSelectedWord] = useState<WordAnalysis | null>(null);
  const [currentlySpeaking, setCurrentlySpeaking] = useState<string | null>(null);
  const [teacherApproved, setTeacherApproved] = useState<boolean>(false);
  const [teacherNote, setTeacherNote] = useState<string>(
    'పఠన వేగం (46 WCPM) బాగుంది. "ట్ల" మరియు "వు" అక్షరాల ఉచ్చారణపై అక్షర సాధన కేటాయించడమైనది.'
  );
  const [isEditingNote, setIsEditingNote] = useState<boolean>(false);

  useEffect(() => {
    let storedSpoken = '';
    if (typeof window !== 'undefined') {
      storedSpoken = localStorage.getItem('ecr_spoken_transcript') || '';
    }
    const dynamicRes = evaluateDynamicReading(passageId, storedSpoken, duration);
    setResult(dynamicRes);
    setSelectedWord(
      dynamicRes.wordAnalysis.find((w) => w.status === 'hesitation') ||
        dynamicRes.wordAnalysis.find((w) => w.status === 'mispronounced') ||
        dynamicRes.wordAnalysis[0]
    );
  }, [passageId, duration]);

  // Pure native Telugu pronunciation
  const playWordAudio = (word: string) => {
    setCurrentlySpeaking(word);
    teluguAudio.speak(word, {
      playCue: true,
      onEnd: () => setCurrentlySpeaking(null),
    });
  };

  const playPhonemeAudio = (phoneme: string) => {
    setCurrentlySpeaking(phoneme);
    teluguAudio.speakPhoneme(phoneme, () => setCurrentlySpeaking(null));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('AI పఠన సామర్థ్య విశ్లేషణ పూర్తయింది', 'Telugu Speech AI Evaluation Complete')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('పఠన ఫలితాలు & లోపాల విశ్లేషణ పట్టిక', 'Reading Assessment & Diagnostic Matrix')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t('విద్యార్థి:', 'Student:')} <span className="font-bold text-slate-800 font-telugu">జి. రాముడు</span> •{' '}
            {t('కథ:', 'Story:')} <span className="font-bold text-blue-800 font-telugu">{result.passageTitle}</span> •{' '}
            {t('తేదీ:', 'Date:')} {result.date}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs transition shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>{t('రిపోర్ట్ ముద్రించండి (Print)', 'Print Official Report')}</span>
          </button>

          <Link
            href="/practice"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition"
          >
            <Award className="w-4 h-4" />
            <span>{t('వ్యక్తిగత సాధన (Practice Plan)', 'Launch Remediation Plan')}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Accuracy */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            {t('ఖచ్చితత్వం (Accuracy)', 'Reading Accuracy')}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-blue-900 font-sans">
              {result.accuracyScore}%
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              {t('లక్ష్యం: 85%+', 'Goal: 85%+')}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${result.accuracyScore}%` }}
            ></div>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            {result.wordsCorrect} / {result.totalWords} {t('పదాలు సరిగ్గా చదివారు', 'words correctly read')}
          </div>
        </div>

        {/* Metric 2: WCPM */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            {t('పఠన వేగం (WCPM)', 'Reading Speed (WCPM)')}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-emerald-700 font-sans">
              {result.wcpm}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {t('పదాలు / నిమిషం', 'words/min')}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3">
            <div
              className="bg-emerald-600 h-2 rounded-full"
              style={{ width: `${Math.min(100, (result.wcpm / 60) * 100)}%` }}
            ></div>
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-2">
            {result.wcpm >= 45
              ? t('లక్ష్యం (45+ WCPM) సాధించబడింది! ✓', 'Target (45+ WCPM) Achieved! ✓')
              : t('సాధన కొనసాగించాలి (Target: 45+)', 'Practice needed for 45+ WCPM')}
          </div>
        </div>

        {/* Metric 3: Fluency & Pronunciation */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            {t('ఉచ్చారణ & స్పష్టత', 'Pronunciation & Diction')}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-indigo-900 font-sans">
              {result.pronunciationScore}%
            </span>
            <span className="text-xs font-semibold text-indigo-600">
              {t('స్పష్టమైన శబ్దం', 'Clear Diction')}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3">
            <div
              className="bg-indigo-600 h-2 rounded-full"
              style={{ width: `${result.pronunciationScore}%` }}
            ></div>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            {t('స్వర నాణ్యత & శబ్ద స్పష్టత', 'Child voice acoustic clarity')}
          </div>
        </div>

        {/* Metric 4: Reading Level Tier */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200 shadow-xs relative overflow-hidden">
          <div className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
            {t('FLN పఠన స్థాయి', 'FLN Reading Level')}
          </div>
          <div className="text-lg sm:text-xl font-bold text-amber-950 font-telugu mt-1">
            {result.readingLevel}
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-900 font-semibold">
            <TrendingUp className="w-4 h-4 text-amber-700" />
            <span>{t('తదుపరి: కథా స్థాయి (Next: Fluent)', 'Next Target: Story Fluent')}</span>
          </div>
          <div className="text-[11px] text-amber-700 mt-1">
            {t('రోజువారీ 10 నిమిషాల అక్షర సాధన', 'Daily 10-minute drills recommended')}
          </div>
        </div>
      </div>

      {/* Main Interactive Matrix & Word Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Interactive Word-by-Word Telugu Matrix */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-telugu">
                  {result.passageTitle} – {t('పద-స్థాయి విశ్లేషణ పట్టిక', 'Word Diagnostic Matrix')}
                </h3>
                <p className="text-xs text-slate-500">
                  {t(
                    'ప్రతి పదంపై క్లిక్ చేసి సహజమైన స్వచ్ఛమైన తెలుగు ఉచ్చారణ వినండి.',
                    'Click any word to hear pure studio-quality native Telugu pronunciation.'
                  )}
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 text-xs font-medium">
                <span className="flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {t('సరిగ్గా (Correct)', 'Correct')}
                </span>
                <span className="flex items-center gap-1 text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  {t('తడబాటు (Hesitation)', 'Hesitation')}
                </span>
                <span className="flex items-center gap-1 text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  {t('దోషం (Error)', 'Mispronounced')}
                </span>
              </div>
            </div>

            {/* Interactive Passage Words */}
            <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-6 sm:p-8 min-h-[200px]">
              <div className="flex flex-wrap gap-2.5 items-center leading-[2.6]">
                {result.wordAnalysis.map((item, idx) => {
                  const isSelected = selectedWord?.originalIndex === item.originalIndex;
                  let colorClasses = '';

                  if (item.status === 'correct') {
                    colorClasses =
                      'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300';
                  } else if (item.status === 'hesitation') {
                    colorClasses =
                      'bg-amber-100 text-amber-950 border-amber-300 hover:bg-amber-200 font-bold';
                  } else {
                    colorClasses =
                      'bg-rose-100 text-rose-950 border-rose-300 hover:bg-rose-200 font-bold';
                  }

                  if (isSelected) {
                    colorClasses += ' ring-2 ring-blue-600 shadow-md scale-105';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedWord(item);
                        playWordAudio(item.word);
                      }}
                      title="ఉచ్చారణ వినడానికి క్లిక్ చేయండి (Click to listen)"
                      className={`font-telugu text-lg sm:text-xl px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${colorClasses}`}
                    >
                      <span>{item.word}</span>
                      {currentlySpeaking === item.word && (
                        <span className="flex items-center gap-0.5">
                          <span className="w-1 h-3 bg-blue-600 rounded-full animate-bounce"></span>
                          <span className="w-1 h-4 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                          <span className="w-1 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Pedagogical Assessment Review */}
            <div className="p-5 bg-blue-50/70 border border-blue-200/80 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>{t('AI ఉపాధ్యాయ సారాంశం (AI Teacher Assessment)', 'AI Pedagogical Summary')}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                {language === 'te' ? result.aiFeedbackTelugu : result.aiFeedbackEnglish}
              </p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Detailed Word Inspector Panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t('పద పరిశీలన (Word Inspector)', 'Word Phonemic Inspector')}
              </div>
              {selectedWord && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    selectedWord.status === 'correct'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedWord.status === 'hesitation'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {selectedWord.status}
                </span>
              )}
            </div>

            {selectedWord ? (
              <div className="space-y-5">
                {/* Large Word Display & Audio Button */}
                <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="font-telugu text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">
                    {selectedWord.word}
                  </div>
                  <div className="text-xs text-slate-500 mb-3">
                    {t('AI విశ్వసనీయత స్కోరు:', 'AI Confidence:')}{' '}
                    <span className="font-bold text-slate-800">{selectedWord.confidence}%</span>
                  </div>
                  <button
                    onClick={() => playWordAudio(selectedWord.word)}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-xs cursor-pointer ${
                      currentlySpeaking === selectedWord.word
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-300/40 animate-pulse'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>
                      {currentlySpeaking === selectedWord.word
                        ? t('ధ్వని వినిపిస్తోంది...', 'Speaking Native Telugu...')
                        : t('ఆదర్శ ఉచ్చారణ వినండి (Pure Voice)', 'Listen Pure Telugu')}
                    </span>
                  </button>
                </div>

                {/* Phoneme Breakdown with Individual Click-to-Hear Audio */}
                {selectedWord.phonemeBreakdown && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>{t('అక్షర & ధ్వని విభజన:', 'Phoneme Segmentation:')}</span>
                      <span className="text-[10px] text-blue-600 font-normal">
                        {t('ధ్వని వినడానికి అక్షరాన్ని తాకండి', 'Tap syllable to hear')}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedWord.phonemeBreakdown.map((ph, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => playPhonemeAudio(ph)}
                          title={`‘${ph}’ అక్షర శబ్దం వినండి`}
                          className={`font-telugu text-sm px-3 py-1.5 rounded-lg border transition font-bold flex items-center gap-1 cursor-pointer ${
                            currentlySpeaking === ph
                              ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-300'
                              : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border-indigo-200'
                          }`}
                        >
                          <span>{ph}</span>
                          <Volume2 className="w-3 h-3 opacity-60" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Error Analysis / Reason */}
                {selectedWord.errorReason && (
                  <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-1">
                    <div className="font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>{t('దోష వివరాలు:', 'Identified Issue:')}</span>
                    </div>
                    <p className="text-amber-800">{selectedWord.errorReason}</p>
                  </div>
                )}

                {/* Practice Remediation Tip */}
                {selectedWord.practiceTipTelugu && (
                  <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1">
                    <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{t('పరిష్కార సూచన:', 'Teaching Tip:')}</span>
                    </div>
                    <p className="text-emerald-800 font-telugu">
                      {selectedWord.practiceTipTelugu}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                {t('ఏదైనా పదంపై క్లిక్ చేయండి', 'Click any word to inspect')}
              </div>
            )}
          </div>

          {/* Weaknesses Highlight Badge */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {t('గుర్తించబడిన లోపాలు (Key Weak Areas)', 'Targeted Phoneme Gaps')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.weakAksharas.map((ak, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200 font-telugu"
                >
                  {ak}
                </span>
              ))}
            </div>
            <div className="pt-2 text-[11px] text-slate-500">
              {t(
                'ఈ అక్షరాలపై ప్రత్యేకంగా దృష్టి సారించడానికి అక్షర సాధన ప్రారంభించండి.',
                'Target these specific aksharas in daily micro-drills.'
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Teacher-in-the-Loop Review & Approval Section */}
      <div className="bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/80 rounded-3xl p-6 sm:p-8 border border-indigo-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-indigo-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-telugu">
                {t('ఉపాధ్యాయుల పరిశీలన & తుది ధృవీకరణ', 'Teacher Review & Assessment Sign-off')}
              </h3>
              <p className="text-xs text-slate-500">
                {t(
                  'శ్రీమతి కె. లక్ష్మి (ఎస్.జి.టి) – FLN ప్రోటోకాల్ ప్రకారం AI ఫలితాల పరిశీలన',
                  'Smt. K. Lakshmi, SGT • Official verification under NIPUN Bharat standards'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {teacherApproved ? (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold font-telugu animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t('ఉపాధ్యాయులు ధృవీకరించారు ✓', 'Verified & Signed-off ✓')}</span>
              </span>
            ) : (
              <button
                onClick={() => setTeacherApproved(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t('ఫలితాలను ధృవీకరించండి (Approve)', 'Approve & Mark Verified')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Teacher Note Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
              <span>{t('ఉపాధ్యాయుల వ్యాఖ్య (Teacher Diagnostic Note):', 'Teacher Observation Note:')}</span>
            </span>
            <button
              onClick={() => setIsEditingNote(!isEditingNote)}
              className="text-indigo-600 hover:text-indigo-800 text-[11px] font-bold"
            >
              {isEditingNote ? t('పూర్తయింది', 'Done') : t('సవరించండి (Edit)', 'Edit Note')}
            </button>
          </div>

          {isEditingNote ? (
            <textarea
              value={teacherNote}
              onChange={(e) => setTeacherNote(e.target.value)}
              rows={2}
              className="w-full p-3 rounded-xl border border-indigo-200 text-xs text-slate-800 font-telugu focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          ) : (
            <p className="p-3 bg-white/90 rounded-xl border border-indigo-100 text-xs text-slate-800 font-telugu leading-relaxed">
              {teacherNote}
            </p>
          )}
        </div>
      </div>

      {/* Recommended 3-Step Practice Plan */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-telugu">
              {result.passageTitle} – {t('ఆధారిత 5-రోజుల అభ్యాస ప్రణాళిక', 'Tailored 5-Day Remediation Curriculum')}
            </h3>
            <p className="text-xs text-slate-500">
              {t(
                'ఈ కథలో గుర్తించిన బలహీనతల ఆధారంగా AI రూపొందించిన సాధన మాడ్యూల్స్',
                'Customized practice modules dynamically generated by AI based on today\'s phoneme errors'
              )}
            </p>
          </div>
          <Link
            href="/practice"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
          >
            <span>{t('సాధన మొదలుపెట్టండి', 'Start Practice Now')}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {result.recommendedPractice.map((rec, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-400 transition space-y-3"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center font-mono">
                  {idx + 1}
                </span>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                  {rec.title}
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {rec.description}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {rec.words.map((w, wIdx) => (
                  <span
                    key={wIdx}
                    className="font-telugu px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-800 text-xs font-semibold"
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AssessmentResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center text-slate-500 text-sm">
          ఫలితాలను లోడ్ చేస్తోంది... (Loading dynamic assessment...)
        </div>
      }
    >
      <AssessmentResultContent />
    </Suspense>
  );
}
