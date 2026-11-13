'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import {
  Mic,
  Sparkles,
  BookOpen,
  Award,
  Users,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Volume2,
  GraduationCap,
  School,
  FileText,
} from 'lucide-react';

export default function HomePage() {
  const { t, language } = useApp();

  const stats = [
    { labelTe: 'మొత్తం పాఠశాలలు', labelEn: 'Govt Schools Covered', value: '5,820+', change: '+12% this month' },
    { labelTe: 'పరీక్షించిన విద్యార్థులు', labelEn: 'Children Assessed', value: '2,84,500+', change: 'Grades 1-5' },
    { labelTe: 'సగటు పఠన వేగం (WCPM)', labelEn: 'Average Reading WCPM', value: '48.6', change: 'FLN Target: 45+' },
    { labelTe: 'AI ఫోనెమిక్ ఖచ్చితత్వం', labelEn: 'Telugu ASR Accuracy', value: '94.2%', change: 'Child Voice Optimized' },
  ];

  const workflowSteps = [
    {
      step: '01',
      titleTe: 'తరగతి కథను ఎంచుకోవడం',
      titleEn: 'Select Telugu Story',
      descTe: '1 నుండి 5 తరగతుల SCERT పాఠ్యాంశాల ఆధారంగా స్థాయికి తగిన తెలుగు పేరా ఎంపిక.',
      descEn: 'Grade-appropriate passages curated from SCERT Telugu syllabus.',
      icon: BookOpen,
      color: 'bg-blue-500',
    },
    {
      step: '02',
      titleTe: 'బిగ్గరగా చదవడం & రికార్డింగ్',
      titleEn: 'Child Reads Aloud',
      descTe: 'బ్రౌజర్ మైక్రోఫోన్ ద్వారా విద్యార్థి పలికే ప్రతి శబ్దాన్ని లైవ్ వేవ్‌ఫామ్‌తో రికార్డ్ చేస్తాం.',
      descEn: 'High-clarity browser audio capture with live visual audio waveform.',
      icon: Mic,
      color: 'bg-emerald-500',
    },
    {
      step: '03',
      titleTe: 'తెలుగు AI స్పీచ్ రికగ్నిషన్',
      titleEn: 'Telugu Speech AI',
      descTe: 'చిన్నపిల్లల స్వరాలకు అనుగుణంగా శిక్షణ పొందిన తెలుగు ASR ద్వారా శబ్దం టెక్స్ట్‌గా మారుతుంది.',
      descEn: 'State-of-the-art acoustic alignment tailored for native Telugu regional dialects.',
      icon: Sparkles,
      color: 'bg-indigo-500',
    },
    {
      step: '04',
      titleTe: 'పద-స్థాయి ఫోనెటిక్ విశ్లేషణ',
      titleEn: 'Word-Level Scoring',
      descTe: 'ఖచ్చితత్వం, నిమిషానికి సరిగ్గా చదివిన పదాలు (WCPM), గుణింతాలు & ఒత్తుల తడబాటు గుర్తింపు.',
      descEn: 'Instant color-coded matrix: Green (Correct), Yellow (Hesitation), Red (Error).',
      icon: TrendingUp,
      color: 'bg-amber-500',
    },
    {
      step: '05',
      titleTe: 'వ్యక్తిగతీకరించిన అభ్యాసం',
      titleEn: 'Personalized Practice',
      descTe: 'బలహీనంగా ఉన్న అక్షరాలకు సరిపోయే ప్రత్యేక సాధన కార్డులు మరియు ఆడియో మార్గదర్శకత్వం.',
      descEn: 'Adaptive Akshara Sadhana flashcards targeting student-specific phoneme gaps.',
      icon: Award,
      color: 'bg-rose-500',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="relative max-w-7xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs sm:text-sm font-semibold backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>{t('తెలంగాణ & ఆంధ్రప్రదేశ్ పాఠశాలల కోసం నూతన AI విప్లవం', 'Next-Gen AI for Telugu Reading Literacy in Government Schools')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-200 to-amber-200">
              {t('ప్రతి బిడ్డ చదవాలి', 'Every Child Reads')}
            </span>
            <br />
            <span className="text-xl sm:text-3xl lg:text-4xl text-slate-200 font-semibold mt-2 block">
              {t(
                'ఆర్టిఫిషియల్ ఇంటెలిజెన్స్ తో తెలుగు పఠన సామర్థ్యాల నిర్ధారణ',
                'AI-Powered Telugu Reading Fluency & Assessment Platform'
              )}
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            {t(
              'ప్రభుత్వ పాఠశాల విద్యార్థులు చదివే తెలుగు శబ్దాలను మైక్రోఫోన్ ద్వారా గ్రహించి, ఒత్తులు, గుణింతాలు మరియు పఠన వేగాన్ని (WCPM) క్షణాల్లో విశ్లేషించి వ్యక్తిగత అభ్యాస ప్రణాళికను రూపొందిస్తుంది.',
              'Empowering teachers and education officers with instant speech-to-text phonetic alignment, identifying hesitations on complex Telugu conjunct consonants (సంయుక్తాక్షరాలు) and driving NIPUN Bharat reading benchmarks.'
            )}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/reading-studio"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Mic className="w-5 h-5 text-amber-300 animate-pulse pointer-events-none" />
              <span className="pointer-events-none">{t('పఠన పరీక్ష ప్రారంభించండి (Live Studio)', 'Start Live Reading Assessment')}</span>
              <ArrowRight className="w-4 h-4 ml-1 pointer-events-none" />
            </Link>

            <Link
              href="/assessment-result"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm sm:text-base backdrop-blur-md transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-400 pointer-events-none" />
              <span className="pointer-events-none">{t('AI ఫలితాల డెమో చూడండి', 'View AI Diagnostic Demo')}</span>
            </Link>

            <Link
              href="/teacher"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm sm:text-base transition cursor-pointer"
            >
              <Users className="w-4 h-4 text-blue-400 pointer-events-none" />
              <span className="pointer-events-none">{t('ఉపాధ్యాయుల వేదిక', 'Teacher Classroom Hub')}</span>
            </Link>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {t('నో-లాగ్ మైక్రోఫోన్ ఆడియో', 'Zero-Latency Web Audio API')}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {t('తెలంగాణ & ఏపీ SCERT సిలబస్', 'State SCERT Syllabus Aligned')}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {t('పూర్తిగా గోప్యమైన ఆడియో రక్షణ', 'End-to-End Privacy Protected')}
            </span>
          </div>
        </div>
      </section>

      {/* Live Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-md hover:shadow-lg transition-all"
            >
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-900 tracking-tight font-sans">
                {s.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">
                {t(s.labelTe, s.labelEn)}
              </div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">
                {s.change}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Assessment Workflow (5 Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-blue-600 font-bold text-xs uppercase tracking-wider mb-2">
            {t('AI పఠన నిర్ధారణ ప్రక్రియ', 'End-to-End Workflow')}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t('విద్యార్థి పఠనం నుండి వ్యక్తిగత సాధన వరకు', 'From Reading Aloud to Precision Remediation')}
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            {t(
              'కేవలం 2 నిమిషాల్లో విద్యార్థి ఏయే అక్షరాలు, ఒత్తుల వద్ద తడబడుతున్నారో AI గుర్తిస్తుంది.',
              'Automated 5-phase speech pipeline detecting exact phonemic weaknesses in under 2 minutes.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {workflowSteps.map((ws, i) => {
            const Icon = ws.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-slate-300 font-mono">
                      {ws.step}
                    </span>
                    <div className={`w-9 h-9 rounded-xl ${ws.color} text-white flex items-center justify-center shadow-xs`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1.5">
                    {t(ws.titleTe, ws.titleEn)}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {t(ws.descTe, ws.descEn)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Deep Dive Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Live Studio */}
          <div className="bg-gradient-to-br from-blue-50 via-white to-slate-50 border border-blue-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4 shadow-md">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {t('లైవ్ పఠన స్టూడియో', 'Interactive Reading Studio')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {t(
                  'విద్యార్థి స్నేహపూర్వక ఇంటర్‌ఫేస్, పెద్ద తెలుగు అక్షరాలు, లైవ్ ఆడియో వేవ్ గ్రాఫ్ మరియు రికార్డింగ్ నియంత్రణలు. పిల్లలు ఎటువంటి భయం లేకుండా ఉల్లాసంగా చదివే వాతావరణం.',
                  'Child-friendly large Telugu typography with real-time waveform visualizer, audio playback, and instant assessment submission.'
                )}
              </p>
              <ul className="text-xs text-slate-700 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t('1 నుండి 5 తరగతుల కథల లైబ్రరీ', 'Class 1-5 SCERT Passages')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t('టైమర్ & ఆటోమేటిక్ WCPM గణన', 'Precision Audio Timer')}</span>
                </li>
              </ul>
            </div>
            <Link
              href="/reading-studio"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs"
            >
              <span>{t('స్టూడియో ఓపెన్ చేయండి', 'Open Reading Studio')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: AI Diagnostic Engine */}
          <div className="bg-gradient-to-br from-indigo-50 via-white to-slate-50 border border-indigo-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-4 shadow-md">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {t('AI ఫోనెమిక్ ఎనాలసిస్', 'Color-Coded Diagnostic Engine')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {t(
                  'ప్రతి పదంపై ఆకుపచ్చ (సరిగ్గా చదివినవి), పసుపు (తడబాటు), ఎరుపు (తప్పులు) రంగులతో కూడిన స్పష్టమైన విశ్లేషణ. పదంపై క్లిక్ చేస్తే ఆదర్శ ఉచ్చారణ వినవచ్చు.',
                  'Granular syllable-level acoustic mapping. Click any word to hear standard native Telugu pronunciation and phoneme breakdown.'
                )}
              </p>
              <ul className="text-xs text-slate-700 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  <span>{t('గుణింతాలు & ఒత్తుల విశ్లేషణ', 'Guninthalu & Otthulu Breakdown')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  <span>{t('WCPM పఠన వేగ నిర్ధారణ', 'WCPM Reading Speed Benchmark')}</span>
                </li>
              </ul>
            </div>
            <Link
              href="/assessment-result"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs"
            >
              <span>{t('డెమో ఫలితాలు చూడండి', 'View Diagnostics Demo')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: Personalized Learning */}
          <div className="bg-gradient-to-br from-emerald-50 via-white to-slate-50 border border-emerald-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-4 shadow-md">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {t('అక్షర సాధన & గేమ్స్', 'Adaptive Practice Studio')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {t(
                  'విద్యార్థి తప్పుగా పలికిన పదాల ఆధారంగా ఆటోమేటిక్‌గా రూపొందించబడిన ఫ్లాష్‌కార్డులు. మాట్లాడి ధృవీకరించుకునే గేమిఫైడ్ అనుభవం.',
                  'Targeted remediation drills generated on the fly. Interactive flashcards with speech playback and star rewards for children.'
                )}
              </p>
              <ul className="text-xs text-slate-700 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t('రోజువారీ 10 నిమిషాల సాధన', 'Daily 10-Minute Micro-Drills')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t('స్టార్ బ్యాడ్జీలు & ప్రోత్సాహం', 'Gamified Rewards & Badges')}</span>
                </li>
              </ul>
            </div>
            <Link
              href="/practice"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
            >
              <span>{t('అభ్యాసం ప్రారంభించండి', 'Launch Word Practice')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Role Navigation Quick Access Hub */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {t('విద్యా శాఖ భాగస్వామ్య పోర్టల్', 'Stakeholder Portals & Dashboards')}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {t(
                  'రాష్ట్ర స్థాయి నుండి విద్యార్థి వరకు సమగ్ర సమాచారం మరియు పర్యవేక్షణ',
                  'Role-based dashboards with district, mandal, school, and classroom level data isolation'
                )}
              </p>
            </div>
            <div className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>{t('డేటా భద్రత & గోప్యతా విధానం చట్టబద్ధం', 'Role-Based Access Control')}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Role 1: Admin */}
            <Link
              href="/admin"
              className="p-5 rounded-2xl bg-blue-50/60 hover:bg-blue-100/60 border border-blue-200 transition group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {t('అడ్మిన్ పోర్టల్', 'Admin Portal')}
                    </h4>
                    <span className="text-[10px] text-blue-700 font-semibold">State / DEO / HM</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  {t('రాష్ట్ర, జిల్లా స్థాయి పర్యవేక్షణ, పాఠశాలల రికార్డులు, ఉపాధ్యాయుల వివరాలు మరియు AI మోడల్ అమరికలు.', 'Statewide FLN telemetry, school and teacher management, AI calibration, and compliance audits.')}
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-blue-200/60 flex items-center justify-between text-xs font-bold text-blue-700">
                <span>{t('అడ్మిన్ డాష్‌బోర్డ్', 'Launch Admin')}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Role 2: Teacher */}
            <Link
              href="/teacher"
              className="p-5 rounded-2xl bg-emerald-50/60 hover:bg-emerald-100/60 border border-emerald-200 transition group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {t('ఉపాధ్యాయుల పోర్టల్', 'Teacher Portal')}
                    </h4>
                    <span className="text-[10px] text-emerald-700 font-semibold">Classroom Hub</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  {t('తరగతి విద్యార్థుల పఠన అసైన్‌మెంట్లు, లైవ్ టెస్టింగ్ నిర్వహణ, ధృవీకరణ మరియు నివేదికల ప్రింటింగ్.', 'Manage assigned classes, schedule reading assessments, teacher review sign-offs, and print cards.')}
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs font-bold text-emerald-700">
                <span>{t('తరగతి వేదిక', 'Launch Teacher')}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Role 3: Student & AI Tutor */}
            <Link
              href="/tutor"
              className="p-5 rounded-2xl bg-amber-50/60 hover:bg-amber-100/60 border border-amber-200 transition group flex flex-col justify-between ring-2 ring-amber-300/60"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-sm">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {t('విద్యార్థి పోర్టల్ & AI గురువు', 'Student & AI Tutor')}
                    </h4>
                    <span className="text-[10px] text-amber-700 font-semibold">Conversational Voice</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  {t('AI గురువుతో మాట్లాడి తెలుగు అక్షరాలు నేర్చుకోండి. త vs ట, ల vs ళ వంటి కష్టమైన శబ్దాలకు లైవ్ మార్గదర్శకత్వం.', 'Interactive voice tutor for kids. Real-time feedback, gentle corrections, syllables breakdown, and star awards.')}
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-amber-200/60 flex items-center justify-between text-xs font-bold text-amber-800">
                <span>{t('AI గురువును కలవండి', 'Launch AI Tutor')}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Role 4: Parent */}
            <Link
              href="/parent"
              className="p-5 rounded-2xl bg-rose-50/60 hover:bg-rose-100/60 border border-rose-200 transition group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-sm">
                    <School className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {t('తల్లిదండ్రుల పోర్టల్', 'Parent Portal')}
                    </h4>
                    <span className="text-[10px] text-rose-700 font-semibold">Child Fluency & Tips</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  {t('బిడ్డ పఠన వేగ పురోగతి గ్రాఫ్, అసలు వాయిస్ రికార్డింగ్స్ వినడం మరియు ఇంట్లో నేర్పించే సులభమైన చిట్కాలు.', 'Track child reading trajectory, listen to voice test recordings, and get practical home literacy support tips.')}
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-rose-200/60 flex items-center justify-between text-xs font-bold text-rose-700">
                <span>{t('తల్లిదండ్రుల వేదిక', 'Launch Parent')}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

