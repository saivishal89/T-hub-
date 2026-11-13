'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  HeartHandshake,
  BookOpen,
  Mic,
  Volume2,
  Award,
  Calendar,
  Sparkles,
  TrendingUp,
  Download,
  Printer,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  School,
  User,
  Star,
  FileCheck,
  ChevronRight,
} from 'lucide-react';

export default function ParentPortalPage() {
  const { currentUser, t, language, voiceGender } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'recordings' | 'tips' | 'report'>('overview');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Child data for Ramu
  const child = {
    name: 'G. Ramu',
    nameTelugu: 'జి. రాముడు',
    grade: 'తరగతి 3 (విభాగం-A)',
    school: 'Z.P. High School, Madhira',
    rollNumber: '01',
    readingLevel: 'వాక్య స్థాయి (Sentence Level)',
    currentWCPM: 46,
    targetWCPM: 55,
    accuracy: 88,
    fluency: 84,
    totalSessions: 14,
    lastTested: '10 నవంబర్ 2026',
    weakAreas: ['‘ట్ల’ మరియు ‘మ్మ’ ఒత్తులు', '‘ళ’ మూర్ధన్య ధ్వని', 'దీర్ఘాల స్వరం'],
  };

  const sampleRecordings = [
    {
      id: 'REC-01',
      date: '10 Nov 2026',
      titleTe: 'తెలివైన కాకి (The Clever Crow)',
      grade: 3,
      duration: '42 sec',
      wcpm: 46,
      accuracy: 88,
      textSample: 'ఒక ఊరిలో ఒక తెలివైన కాకి ఉండేది. దానికి ఎండకాలంలో బాగా దాహం వేసింది...',
    },
    {
      id: 'REC-02',
      date: '03 Nov 2026',
      titleTe: 'చిన్నారి లేడిపిల్ల (The Little Fawn)',
      grade: 3,
      duration: '48 sec',
      wcpm: 41,
      accuracy: 84,
      textSample: 'అడవిలో ఒక లేడిపిల్ల గంతులు వేస్తూ పచ్చని గడ్డిని మేసింది...',
    },
    {
      id: 'REC-03',
      date: '24 Oct 2026',
      titleTe: 'ఏనుగు మరియు చీమ (Elephant and Ant)',
      grade: 3,
      duration: '52 sec',
      wcpm: 36,
      accuracy: 78,
      textSample: 'ఒక అడవిలో ఒక పెద్ద ఏనుగు ఉండేది. అది రోజూ చిన్న జంతువులను భయపెట్టేది...',
    },
  ];

  const homeTips = [
    {
      titleTe: 'రోజూ రాత్రి 15 నిమిషాల కథల పఠనం',
      titleEn: '15-Minute Bedtime Reading Routine',
      descTe: 'పిల్లలను మీ పక్కన కూర్చోబెట్టుకుని, వేలితో అక్షరాన్ని చూపిస్తూ బిగ్గరగా చదివించండి. వారు తప్పు పలికితే దండించకుండా మృదువుగా మళ్ళీ పలికించండి.',
      descEn: 'Sit with your child daily. Guide their index finger along each word as they read aloud. Praise every small attempt.',
      icon: BookOpen,
    },
    {
      titleTe: '‘త’ మరియు ‘ట’ అక్షరాల ఆట (Phonetic Contrast)',
      titleEn: 'Dental vs Retroflex Sound Play',
      descTe: '‘తాత’ అనే పదం పలికేటప్పుడు నాలుక పంటికి తగలాలి, ‘టమాటా’ పలికేటప్పుడు నాలుక పైకి మడవాలి అని సరదాగా అద్దం ముందు నిల్చొని చూపించండి.',
      descEn: 'Show them how dental "త" touches the teeth while retroflex "ట" touches the roof of the mouth.',
      icon: Sparkles,
    },
    {
      titleTe: 'వత్తులు (ఒత్తులు) ఉన్న పదాలను గుర్తించడం',
      titleEn: 'Spotting Conjunct Consonants (Ottulu)',
      descTe: 'దినపత్రికలు లేదా పుస్తకాలలోని ఒత్తుల పదాలు (అమ్మ, చెట్టు, కన్ను) చుట్టూ పెన్సిల్‌తో సున్నా చుట్టి చదివించండి.',
      descEn: 'Have the child spot and circle words with subscript consonants (Ottulu) in newspapers or storybooks.',
      icon: Award,
    },
    {
      titleTe: 'AI గురువుతో మాట్లాడించండి',
      titleEn: 'Daily 5-Minute Practice with AI Tutor',
      descTe: 'మన మొబైల్ లేదా కంప్యూటర్‌లో "AI గురువు" ట్యాబ్ తెరిచి రోజూ 5 పదాలు బిగ్గరగా మాట్లాడించండి.',
      descEn: 'Use the dedicated AI Reading Tutor tab on mobile for 5 minutes daily for instant encouraging voice feedback.',
      icon: Mic,
    },
  ];

  const playDemoAudio = (text: string, id: string) => {
    if (playingAudioId === id) {
      setPlayingAudioId(null);
      return;
    }

    setPlayingAudioId(id);
    const persona = voiceGender === 'male' ? 'srinivas' : 'lakshmi';
    const audioUrl = `/api/tts?text=${encodeURIComponent(text)}&persona=${persona}`;
    const audio = new Audio(audioUrl);
    audio.play().catch(() => setPlayingAudioId(null));
    audio.onended = () => setPlayingAudioId(null);
    audio.onerror = () => setPlayingAudioId(null);
  };

  return (
    <div className="min-h-[88vh] bg-gradient-to-b from-rose-50/50 via-slate-50 to-purple-50/40 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-rose-700 via-purple-800 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-md font-telugu">
              👨‍👩‍👧
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                  {t('తల్లిదండ్రుల పోర్టల్', 'Parent Portal')}
                </span>
                <span className="text-xs text-rose-200">
                  {currentUser?.nameTelugu || currentUser?.name}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-telugu mt-1 tracking-tight">
                {child.nameTelugu} ({child.name}) – {t('పఠన సామర్థ్య నివేదిక', 'Reading Progress')}
              </h1>
              <p className="text-xs text-white/80 mt-1">
                {child.school} • {child.grade} • Roll No: {child.rollNumber}
              </p>
            </div>
          </div>

          {/* Quick Benchmark Pill */}
          <div className="bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center min-w-[200px]">
            <div className="text-[11px] text-rose-200 uppercase tracking-wider font-semibold">
              {t('ప్రస్తుత పఠన స్థాయి (FLN Level)', 'Current Reading Level')}
            </div>
            <div className="text-lg font-bold font-telugu text-amber-300 mt-0.5">
              {child.readingLevel}
            </div>
            <div className="text-xs text-white/70 mt-1">
              {child.currentWCPM} / {child.targetWCPM} WCPM (Words/Min)
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>{t('సమగ్ర ప్రగతి (Overview)', 'Overview & Trajectory')}</span>
          </button>

          <button
            onClick={() => setActiveTab('recordings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'recordings'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>{t('వాయిస్ రికార్డింగ్స్ (Recordings)', 'Voice Recordings')}</span>
          </button>

          <button
            onClick={() => setActiveTab('tips')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'tips'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{t('ఇంట్లో చిట్కాలు (Home Tips)', 'Home Tips')}</span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'report'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>{t('అధికారిక నివేదిక (Official Card)', 'Progress Card')}</span>
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 3 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t('పఠన వేగం (Reading Speed)', 'Reading Speed (WCPM)')}
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mt-2 flex items-baseline gap-2">
                  <span>{child.currentWCPM}</span>
                  <span className="text-xs font-normal text-slate-500">/ 55 WCPM లక్ష్యం</span>
                </div>
                <div className="mt-3 w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-600 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (child.currentWCPM / child.targetWCPM) * 100)}%` }}
                  />
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-2">
                  ▲ జూన్ నెల నుండి +24 పదాలు పెరిగింది
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t('ఖచ్చితత్వం (Accuracy Rate)', 'Pronunciation Accuracy')}
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mt-2 flex items-baseline gap-2">
                  <span>{child.accuracy}%</span>
                  <span className="text-xs font-normal text-slate-500">FLN Target 90%</span>
                </div>
                <div className="mt-3 w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${child.accuracy}%` }} />
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-2">
                  సరళ పదాలు 95% ఖచ్చితంగా పలుకుతున్నారు
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t('సాధన సెషన్లు (Completed Tests)', 'Completed Tests')}
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mt-2 flex items-baseline gap-2">
                  <span>{child.totalSessions}</span>
                  <span className="text-xs font-normal text-slate-500">పరీక్షలు</span>
                </div>
                <div className="text-xs text-slate-500 mt-3 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>చివరి పరీక్ష: {child.lastTested}</span>
                </div>
              </div>
            </div>

            {/* Visual Trajectory Graph Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-rose-600" />
                <span>{t('గత 6 వారాల పఠన వేగ పురోగతి (WCPM Growth Curve)', '6-Week WCPM Growth Curve')}</span>
              </h3>

              {/* Progress Bar Steps */}
              <div className="grid grid-cols-6 gap-2 text-center text-xs">
                {[
                  { week: 'వారం 1', wcpm: 22, date: '01 Oct' },
                  { week: 'వారం 2', wcpm: 28, date: '08 Oct' },
                  { week: 'వారం 3', wcpm: 33, date: '15 Oct' },
                  { week: 'వారం 4', wcpm: 36, date: '22 Oct' },
                  { week: 'వారం 5', wcpm: 41, date: '29 Oct' },
                  { week: 'వారం 6', wcpm: 46, date: '05 Nov' },
                ].map((step, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col justify-between">
                    <span className="text-[10px] text-slate-400 font-medium">{step.date}</span>
                    <div className="my-2">
                      <div className="text-lg font-bold text-slate-800 font-mono">{step.wcpm}</div>
                      <span className="text-[10px] text-slate-500">WCPM</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full rounded-full" style={{ width: `${(step.wcpm / 55) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weak Areas Identified by AI */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-6">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <span>{t('AI విశ్లేషణ: ఇంట్లో ప్రత్యేక శ్రద్ధ పెట్టవలసిన అక్షరాలు', 'AI Diagnosis: Priority Letters for Home Practice')}</span>
              </div>
              <p className="text-xs text-amber-800 mb-4">
                పాఠశాలలో నిర్వహించిన పరీక్ష ఆధారంగా, రాముడు ఈ క్రింది అక్షరాల వద్ద కొద్దిగా తడబడుతున్నారు:
              </p>
              <div className="flex flex-wrap gap-2">
                {child.weakAreas.map((area, idx) => (
                  <span
                    key={idx}
                    className="bg-white border border-amber-300 text-amber-950 px-3.5 py-1.5 rounded-xl text-xs font-bold font-telugu shadow-sm"
                  >
                    🔍 {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Voice Recordings */}
        {activeTab === 'recordings' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {t('బిడ్డ అసలు పఠన రికార్డింగ్స్ (Listen Child Voice)', 'Listen to Child’s Reading Recordings')}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                ఉపాధ్యాయురాలి వద్ద మరియు పఠన గదిలో విద్యార్థి చదివిన ఆడియో రికార్డులు ఇక్కడ భద్రపరచబడ్డాయి.
              </p>
            </div>

            <div className="space-y-3">
              {sampleRecordings.map((rec) => {
                const isPlaying = playingAudioId === rec.id;
                return (
                  <div
                    key={rec.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 font-telugu">{rec.titleTe}</span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">
                          {rec.date}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-telugu line-clamp-1 italic">
                        &ldquo;{rec.textSample}&rdquo;
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-600 pt-1">
                        <span>వేగం: <strong>{rec.wcpm} WCPM</strong></span>
                        <span>•</span>
                        <span>ఖచ్చితత్వం: <strong>{rec.accuracy}%</strong></span>
                        <span>•</span>
                        <span>సమయం: {rec.duration}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => playDemoAudio(rec.textSample, rec.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${
                        isPlaying
                          ? 'bg-amber-600 text-white animate-pulse'
                          : 'bg-white hover:bg-slate-100 text-blue-700 border border-slate-200'
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>{isPlaying ? t('ఆపండి', 'Stop') : t('రికార్డింగ్ వినండి', 'Play Recording')}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Home Tips */}
        {activeTab === 'tips' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 text-base mb-1">
                {t('ఇంట్లో తల్లిదండ్రులు సహాయం చేయడానికి 4 సులభమైన పద్ధతులు', '4 Practical Home Reading Support Practices')}
              </h3>
              <p className="text-xs text-slate-500">
                రోజూ కేవలం 15 నిమిషాలు కేటాయించి మీ బిడ్డను కథా స్థాయి పఠన వీరుడిగా మార్చవచ్చు.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {homeTips.map((tip, idx) => {
                const Icon = tip.icon;
                return (
                  <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm font-telugu">
                      {t(tip.titleTe, tip.titleEn)}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-telugu">
                      {t(tip.descTe, tip.descEn)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Official Report Card */}
        {activeTab === 'report' && (
          <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-200 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  {t('పాఠశాల విద్యాశాఖ – విద్యార్థి పఠన ప్రగతి పత్రం', 'Official Student Reading Progress Card')}
                </h3>
                <p className="text-xs text-slate-500">
                  SCERT Telangana & AP – FLN NIPUN Bharat Academic Year 2026-27
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5 shadow"
              >
                <Printer className="w-4 h-4" />
                <span>{t('ప్రింట్ / డౌన్‌లోడ్ (PDF)', 'Print / Download (PDF)')}</span>
              </button>
            </div>

            {/* Official Details Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              <div>
                <div className="text-slate-400">విద్యార్థి పేరు:</div>
                <div className="font-bold text-slate-900 font-telugu">{child.nameTelugu}</div>
              </div>
              <div>
                <div className="text-slate-400">తరగతి & సెక్షన్:</div>
                <div className="font-bold text-slate-900">{child.grade}</div>
              </div>
              <div>
                <div className="text-slate-400">పాఠశాల:</div>
                <div className="font-bold text-slate-900 truncate">{child.school}</div>
              </div>
              <div>
                <div className="text-slate-400">FLN సాధన స్థాయి:</div>
                <div className="font-bold text-emerald-700 font-telugu">{child.readingLevel}</div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 leading-relaxed font-telugu">
              <strong>ఉపాధ్యాయుల పరిశీలన (Teacher Remark):</strong> విద్యార్థి రోజూ అక్షర సాధన చేస్తున్నారు. ఒత్తుల పఠనంలో గణనీయమైన పురోగతి కనిపిస్తోంది. ప్రస్తుత వేగం నిమిషానికి 46 పదాలు. త్వరలోనే 55 పదాల లక్ష్యాన్ని చేరుకుంటారు.
            </div>

            <div className="flex justify-between items-center pt-8 text-[11px] text-slate-400 border-t border-slate-100">
              <div>ధృవీకరించిన ఉపాధ్యాయులు: శ్రీమతి పి. లక్ష్మి (ఎస్.జి.టి)</div>
              <div>తెలంగాణ సమగ్ర శిక్షా అభియాన్ • డిజిటల్ సంతకం చేయబడింది</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

