'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Flame,
  Printer,
  RotateCcw,
  School,
  Share2,
  Sparkles,
  Star,
  TrendingUp,
  User,
  Volume2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

export default function StudentProfilePage() {
  const { t, language } = useApp();
  const [certModalOpen, setCertModalOpen] = useState(false);

  // 12-Week WCPM Progression Data
  const progressionData = [
    { week: 'W1', wcpm: 22, target: 45, date: '25 Aug' },
    { week: 'W2', wcpm: 26, target: 45, date: '01 Sep' },
    { week: 'W3', wcpm: 29, target: 45, date: '08 Sep' },
    { week: 'W4', wcpm: 33, target: 45, date: '15 Sep' },
    { week: 'W5', wcpm: 32, target: 45, date: '22 Sep' },
    { week: 'W6', wcpm: 36, target: 45, date: '29 Sep' },
    { week: 'W7', wcpm: 39, target: 45, date: '06 Oct' },
    { week: 'W8', wcpm: 41, target: 45, date: '13 Oct' },
    { week: 'W9', wcpm: 40, target: 45, date: '20 Oct' },
    { week: 'W10', wcpm: 43, target: 45, date: '27 Oct' },
    { week: 'W11', wcpm: 44, target: 45, date: '03 Nov' },
    { week: 'W12', wcpm: 46, target: 45, date: '10 Nov' },
  ];

  const assessmentHistory = [
    {
      id: 'ASMT-2026-904',
      date: '10 Nov 2026',
      passage: 'చిన్న చీమ - పెద్ద ఏనుగు',
      accuracy: 89,
      wcpm: 46,
      errors: 5,
      level: 'వాక్య స్థాయి',
    },
    {
      id: 'ASMT-2026-882',
      date: '03 Nov 2026',
      passage: 'వాన దేవుడా రావేలా!',
      accuracy: 85,
      wcpm: 44,
      errors: 6,
      level: 'వాక్య స్థాయి',
    },
    {
      id: 'ASMT-2026-840',
      date: '27 Oct 2026',
      passage: 'గాంధీ తాత సత్యం',
      accuracy: 82,
      wcpm: 43,
      errors: 7,
      level: 'వాక్య స్థాయి',
    },
    {
      id: 'ASMT-2026-795',
      date: '13 Oct 2026',
      passage: 'చెట్టు ప్రాణం',
      accuracy: 78,
      wcpm: 41,
      errors: 9,
      level: 'పద స్థాయి',
    },
    {
      id: 'ASMT-2026-750',
      date: '29 Sep 2026',
      passage: 'మిత్రుల కలయిక',
      accuracy: 71,
      wcpm: 36,
      errors: 12,
      level: 'పద స్థాయి',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Student Profile Header Card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-white/20 text-white flex items-center justify-center font-bold text-2xl sm:text-3xl font-telugu shadow-lg">
            రా
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold font-telugu tracking-tight">
                జి. రాముడు (G. Ramu)
              </h1>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {t('వాక్య స్థాయి (Sentence)', 'Sentence Level')}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              {t(
                'రోల్ నం: 01 • తరగతి: 3-ఎ • Z.P. High School, Madhira (ఖమ్మం జిల్లా)',
                'Roll No: 01 • Class 3-A • Z.P. High School, Madhira (Khammam District)'
              )}
            </p>
            <div className="flex items-center gap-4 text-xs text-amber-300 pt-1">
              <span className="flex items-center gap-1">
                <Flame className="w-4 h-4 fill-amber-400" />
                4 {t('రోజుల స్ట్రీక్', 'Day Streak')}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400" />
                24 {t('స్టార్లు', 'Stars Earned')}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setCertModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition"
          >
            <Award className="w-4 h-4" />
            <span>{t('పఠన సర్టిఫికేట్ (Certificate)', 'Reading Certificate')}</span>
          </button>

          <Link
            href="/reading-studio"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition"
          >
            <BookOpen className="w-4 h-4" />
            <span>{t('పరీక్ష రాయండి (Test)', 'Take Assessment')}</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            {t('ప్రస్తుత పఠన వేగం (WCPM)', 'Current Reading WCPM')}
          </div>
          <div className="text-3xl font-black text-blue-900 font-sans">46</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">
            +24 WCPM {t('గత 12 వారాల్లో', 'growth over 12 weeks')}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            {t('సగటు ఖచ్చితత్వం', 'Average Accuracy')}
          </div>
          <div className="text-3xl font-black text-emerald-700 font-sans">89%</div>
          <div className="text-xs text-slate-500 mt-1">
            {t('లక్ష్యం: 85%+ సాధించబడింది', 'FLN Benchmark Met')}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            {t('మొత్తం పరీక్షలు', 'Assessments Completed')}
          </div>
          <div className="text-3xl font-black text-indigo-900 font-sans">8</div>
          <div className="text-xs text-indigo-600 font-semibold mt-1">
            {t('వారపు పురోగతి క్రమం తప్పకుండా', 'Consistent weekly cadence')}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            {t('నేర్చుకున్న క్లిష్ట పదాలు', 'Mastered Weak Words')}
          </div>
          <div className="text-3xl font-black text-amber-700 font-sans">18</div>
          <div className="text-xs text-amber-700 font-semibold mt-1">
            {t('అక్షర సాధన ద్వారా రికవరీ', 'Recovered via micro-drills')}
          </div>
        </div>
      </div>

      {/* 12-Week Progression Chart using Recharts */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {t('12 వారాల పఠన వేగ పురోగతి (WCPM Growth Trajectory)', '12-Week Reading Fluency Trajectory (WCPM)')}
            </h3>
            <p className="text-xs text-slate-500">
              {t('నిమిషానికి సరిగ్గా చదివిన పదాల సంఖ్య (WCPM) మరియు NIPUN Bharat లక్ష్య రేఖ (45 WCPM)', 'Words Correct Per Minute vs FLN Target Line (45 WCPM)')}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-blue-700">
              <span className="w-3 h-3 rounded-full bg-blue-600"></span>
              {t('రాముడి వేగం (WCPM)', 'Ramu\'s WCPM')}
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600">
              <span className="w-3 h-0.5 bg-emerald-500 border-t-2 border-dashed border-emerald-500"></span>
              {t('FLN లక్ష్యం (45 WCPM)', 'FLN Target (45)')}
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={progressionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="wcpmGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="week" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} domain={[10, 60]} tickLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg text-xs space-y-1">
                        <div className="font-bold text-amber-300">{data.week} ({data.date})</div>
                        <div>వేగం: <span className="font-bold text-white">{data.wcpm} WCPM</span></div>
                        <div>లక్ష్యం: <span className="text-emerald-400">45 WCPM</span></div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine y={45} stroke="#10b981" strokeDasharray="5 5" strokeWidth={2} />
              <Area
                type="monotone"
                dataKey="wcpm"
                stroke="#2563eb"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#wcpmGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Phoneme Mastery Progress Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            {t('తెలుగు అక్షర & వర్ణమాల ప్రావీణ్యత', 'Telugu Phonemic Mastery Breakdown')}
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>సరళ పదాలు (Simple Words)</span>
                <span className="text-emerald-700 font-bold">100% (పరిపూర్ణం)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>గుణింతాల దీర్ఘాలు (Vowel Lengths)</span>
                <span className="text-blue-700 font-bold">85% (చక్కని ఉచ్చారణ)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>ద్విత్వాక్షరాలు (Geminate Consonants)</span>
                <span className="text-indigo-700 font-bold">80% (లక్ష్య సాధన)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>సంయుక్తాక్షరాలు (Complex Conjuncts - ట్ల, త్ర్య)</span>
                <span className="text-amber-700 font-bold">65% (సాధన అవసరం)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Actionable Recommendations */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              {t('AI ఉపాధ్యాయ సిఫార్సులు (Next Steps)', 'AI Pedagogical Roadmap')}
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>రాముడు 45 WCPM లక్ష్యాన్ని చేరుకున్నాడు. తదుపరి లక్ష్యం 55 WCPM తో కథా స్థాయికి చేరడం.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>‘ట్ల’ మరియు ‘త్ర్య’ ఒత్తుల పదాలపై రోజువారీ 5 నిమిషాల అక్షర సాధన కొనసాగించాలి.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>మరిన్ని సంయుక్త వాక్యాలు కలిగిన 4వ తరగతి పాఠ్యాంశాలను పరిచయం చేయవచ్చు.</span>
              </li>
            </ul>
          </div>

          <Link
            href="/practice"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs text-center shadow-xs transition hover:opacity-95"
          >
            {t('ఈరోజే అక్షర సాధన మొదలుపెట్టండి', 'Start Daily Practice Session')}
          </Link>
        </div>
      </div>

      {/* Historical Assessment Log */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          {t('గత పఠన పరీక్షల నివేదికల రికార్డు', 'Complete Assessment Audit History')}
        </h3>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="px-4 py-3">పరీక్ష ఐడీ</th>
                <th className="px-4 py-3">తేదీ</th>
                <th className="px-4 py-3">పాఠ్యాంశం పేరు</th>
                <th className="px-4 py-3">ఖచ్చితత్వం</th>
                <th className="px-4 py-3">పఠన వేగం (WCPM)</th>
                <th className="px-4 py-3">స్థాయి</th>
                <th className="px-4 py-3 text-right">చర్యలు</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assessmentHistory.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 font-mono font-bold text-blue-700">{row.id}</td>
                  <td className="px-4 py-3 text-slate-600">{row.date}</td>
                  <td className="px-4 py-3 font-telugu font-bold text-slate-900">{row.passage}</td>
                  <td className="px-4 py-3 font-bold text-emerald-700">{row.accuracy}%</td>
                  <td className="px-4 py-3 font-bold font-mono text-slate-800">{row.wcpm}</td>
                  <td className="px-4 py-3">
                    <span className="font-telugu px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                      {row.level}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href="/assessment-result"
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      {t('రిపోర్ట్ చూడండి', 'View Matrix')}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Certificate Modal */}
      {certModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 space-y-6 shadow-2xl border-4 border-amber-400 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setCertModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>

            {/* Certificate Header */}
            <div className="text-center space-y-2 border-b-2 border-amber-300 pb-4">
              <div className="inline-block px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold uppercase tracking-wider mb-1">
                పాఠశాల విద్యాశాఖ – ప్రతి బిడ్డ చదవాలి (FLN)
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 font-telugu">
                తెలుగు పఠన సామర్థ్య ధృవీకరణ పత్రం
              </h2>
              <p className="text-xs text-slate-500 font-sans uppercase tracking-widest">
                Certificate of Foundational Telugu Reading Proficiency
              </p>
            </div>

            {/* Certificate Body */}
            <div className="text-center space-y-4 py-4 text-slate-800 font-telugu text-sm sm:text-base leading-relaxed">
              <p>
                ఈ ధృవీకరణ పత్రం ద్వారా Z.P. High School, Madhira (ఖమ్మం జిల్లా) కు చెందిన 3వ తరగతి విద్యార్థి
              </p>
              <div className="text-3xl font-black text-blue-900 underline decoration-amber-400 decoration-4 underline-offset-8 py-2">
                జి. రాముడు (G. Ramu)
              </div>
              <p>
                పాఠశాల విద్యాశాఖ AI అసెస్‌మెంట్ ద్వారా నిర్వహించిన తెలుగు పఠన పరీక్షలో 
                <span className="font-bold text-emerald-800"> 46 WCPM వేగం</span> మరియు 
                <span className="font-bold text-emerald-800"> 89% ఖచ్చితత్వంతో</span> 
                వాక్య స్థాయి (Sentence Reading Proficiency) సాధించినట్లు ధృవీకరించడమైనది.
              </p>
            </div>

            {/* Signatures & Seal */}
            <div className="grid grid-cols-3 pt-6 border-t border-slate-200 text-center text-xs">
              <div>
                <div className="font-bold font-telugu">శ్రీమతి కె. లక్ష్మి</div>
                <div className="text-[10px] text-slate-500">భాషా ఉపాధ్యాయులు</div>
              </div>
              <div>
                <div className="w-12 h-12 mx-auto rounded-full border-2 border-amber-500 text-amber-600 flex items-center justify-center font-bold text-lg mb-1">
                  ముద్ర
                </div>
                <div className="text-[10px] text-slate-500">పాఠశాల అధికార ముద్ర</div>
              </div>
              <div>
                <div className="font-bold font-telugu">ఎం. పార్వతి దేవి</div>
                <div className="text-[10px] text-slate-500">ప్రధానోపాధ్యాయులు</div>
              </div>
            </div>

            {/* Print action */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setCertModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                మూసివేయండి
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>సర్టిఫికేట్ ప్రింట్ (Print Certificate)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

