'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { DISTRICT_ANALYTICS } from '@/lib/mockData';
import {
  BarChart3,
  TrendingUp,
  School,
  Users,
  Download,
  Filter,
  ShieldCheck,
  AlertTriangle,
  Award,
  CheckCircle2,
  MapPin,
  Settings,
  Sparkles,
  Search,
  Plus,
  Sliders,
  Volume2,
  Lock,
  FileCheck,
  RefreshCw,
} from 'lucide-react';

interface SchoolRecord {
  id: string;
  name: string;
  district: string;
  mandal: string;
  studentsCount: number;
  teachersCount: number;
  avgWcpm: number;
  status: 'A+' | 'A' | 'B' | 'Needs Intervention';
}

const SAMPLE_SCHOOLS: SchoolRecord[] = [
  { id: 'SCH-01', name: 'Z.P. High School, Madhira', district: 'ఖమ్మం (Khammam)', mandal: 'మధిర (Madhira)', studentsCount: 240, teachersCount: 8, avgWcpm: 51, status: 'A' },
  { id: 'SCH-02', name: 'M.P.P. School, Wyra', district: 'ఖమ్మం (Khammam)', mandal: 'వైరా (Wyra)', studentsCount: 180, teachersCount: 6, avgWcpm: 48, status: 'A' },
  { id: 'SCH-03', name: 'Govt Model School, Khammam Urban', district: 'ఖమ్మం (Khammam)', mandal: 'ఖమ్మం అర్బన్', studentsCount: 420, teachersCount: 14, avgWcpm: 56, status: 'A+' },
  { id: 'SCH-04', name: 'Z.P. Primary School, Bonakal', district: 'ఖమ్మం (Khammam)', mandal: 'బోనకల్ (Bonakal)', studentsCount: 110, teachersCount: 4, avgWcpm: 34, status: 'Needs Intervention' },
  { id: 'SCH-05', name: 'Z.P. High School, Hanamkonda', district: 'వరంగల్ (Warangal)', mandal: 'హనుమకొండ', studentsCount: 310, teachersCount: 11, avgWcpm: 52, status: 'A' },
  { id: 'SCH-06', name: 'Govt Boys School, Shamshabad', district: 'రంగారెడ్డి (Rangareddy)', mandal: 'శంషాబాద్', studentsCount: 290, teachersCount: 10, avgWcpm: 58, status: 'A+' },
];

interface TeacherRecord {
  id: string;
  name: string;
  nameTelugu: string;
  email: string;
  school: string;
  assignedGrade: string;
  assessmentsDone: number;
  verifiedCount: number;
  status: 'Active' | 'Approved' | 'Pending Review';
}

const SAMPLE_TEACHERS: TeacherRecord[] = [
  { id: 'TCH-101', name: 'Smt. P. Lakshmi', nameTelugu: 'శ్రీమతి పి. లక్ష్మి', email: 'lakshmi.teacher@telangana.gov.in', school: 'Z.P. High School, Madhira', assignedGrade: 'తరగతి 3-A', assessmentsDone: 42, verifiedCount: 38, status: 'Active' },
  { id: 'TCH-102', name: 'Sri M. Venkat Rao', nameTelugu: 'శ్రీ ఎం. వెంకటరావు', email: 'venkat.rao@telangana.gov.in', school: 'Z.P. High School, Madhira', assignedGrade: 'తరగతి 4-B', assessmentsDone: 36, verifiedCount: 35, status: 'Active' },
  { id: 'TCH-103', name: 'Smt. K. Sarada', nameTelugu: 'శ్రీమతి కె. శారద', email: 'sarada.k@telangana.gov.in', school: 'M.P.P. School, Wyra', assignedGrade: 'తరగతి 2', assessmentsDone: 29, verifiedCount: 29, status: 'Active' },
  { id: 'TCH-104', name: 'Sri D. Suresh Kumar', nameTelugu: 'శ్రీ డి. సురేష్ కుమార్', email: 'suresh.d@telangana.gov.in', school: 'Z.P. Primary School, Bonakal', assignedGrade: 'తరగతి 3', assessmentsDone: 15, verifiedCount: 12, status: 'Active' },
  { id: 'TCH-105', name: 'Smt. B. Padmavathi', nameTelugu: 'శ్రీమతి బి. పద్మావతి', email: 'padma.b@telangana.gov.in', school: 'Govt Model School, Khammam', assignedGrade: 'తరగతి 5-A', assessmentsDone: 51, verifiedCount: 50, status: 'Active' },
];

function AdminAnalyticsPageContent() {
  const { t, language, voiceGender, setVoiceGender } = useApp();
  const searchParams = useSearchParams();

  // Tab management: overview, schools, teachers, students, ai-config, reports
  const [activeTab, setActiveTab] = useState<'overview' | 'schools' | 'teachers' | 'students' | 'ai-config' | 'reports'>('overview');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['overview', 'schools', 'teachers', 'students', 'ai-config', 'reports'].includes(tab)) {
      setActiveTab(tab as any);
    }
  }, [searchParams]);

  const [searchQuery, setSearchQuery] = useState('');

  // AI Configuration State
  const [asrConfidenceThreshold, setAsrConfidenceThreshold] = useState(75);
  const [targetWcpmTier, setTargetWcpmTier] = useState(55);
  const [falconStreamingEnabled, setFalconStreamingEnabled] = useState(true);
  const [murfApiKey, setMurfApiKey] = useState('murf_in_live_sample_key_9021');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const districts = DISTRICT_ANALYTICS;

  const handleSaveAiConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Executive Header with EduVerse Branding */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 border border-white/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>EduVerse State Administration Core</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {t('రాష్ట్ర విద్యాశాఖ – AI అడ్మిన్ పోర్టల్', 'State School Education Admin Portal')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            {t(
              'పాఠశాలలు, ఉపాధ్యాయులు, విద్యార్థుల వివరాలు మరియు తెలుగు AI మోడల్ అమరికల నిర్వహణ.',
              'Statewide FLN telemetry, verified school rosters, AI calibration, and compliance audits.'
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <a
            href="/profile"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition"
          >
            <span>My Profile</span>
          </a>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition"
          >
            <Download className="w-4 h-4" />
            <span>{t('సమగ్ర నివేదిక (PDF)', 'Export Audit Report')}</span>
          </button>
        </div>
      </div>

      {/* Admin Panel Main Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { key: 'overview', labelTe: 'రాష్ట్ర విశ్లేషణ', labelEn: 'Overview & Telemetry', icon: BarChart3 },
          { key: 'schools', labelTe: 'పాఠశాలల నిర్వహణ', labelEn: 'Schools', icon: School },
          { key: 'teachers', labelTe: 'ఉపాధ్యాయుల వివరాలు', labelEn: 'Teachers', icon: Users },
          { key: 'students', labelTe: 'విద్యార్థుల రికార్డులు', labelEn: 'Student Records', icon: Award },
          { key: 'ai-config', labelTe: 'AI మోడల్ అమరికలు', labelEn: 'AI Configuration', icon: Sparkles },
          { key: 'reports', labelTe: 'నివేదికలు & ఎగుమతి', labelEn: 'Reports & Export', icon: FileCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t(tab.labelTe, tab.labelEn)}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & TELEMETRY */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* State Macro KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                {t('మొత్తం పాఠశాలలు', 'Total Schools Monitored')}
              </div>
              <div className="text-3xl font-black text-slate-900 font-sans">5,820</div>
              <div className="text-xs text-emerald-600 font-medium mt-1">
                {t('33 జిల్లాలు కవరేజ్', 'Across 33 Districts')}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                {t('పరీక్షించిన విద్యార్థులు', 'Children Assessed')}
              </div>
              <div className="text-3xl font-black text-blue-900 font-sans">2,84,500+</div>
              <div className="text-xs text-blue-600 font-medium mt-1">
                {t('తరగతులు 1 నుండి 5', 'Grades 1 to 5')}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                {t('రాష్ట్ర సగటు పఠన వేగం', 'State Avg WCPM')}
              </div>
              <div className="text-3xl font-black text-emerald-700 font-sans">48.6</div>
              <div className="text-xs text-slate-500 mt-1">
                {t('FLN లక్ష్యం: 45+ WCPM (సాధించబడింది)', 'NIPUN Benchmark: 45+ WCPM')}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                {t('ప్రత్యేక శ్రద్ధ అవసరమైనవి', 'Remediation Triggers')}
              </div>
              <div className="text-3xl font-black text-amber-700 font-sans">14.2%</div>
              <div className="text-xs text-amber-600 font-medium mt-1">
                {t('అక్షర సాధన ప్లాన్ అమలవుతోంది', 'Active Remediation Drills')}
              </div>
            </div>
          </div>

          {/* District Comparison Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {t('జిల్లాల వారీ పఠన సామర్థ్యాల సూచిక', 'District-Wise Telugu Reading Performance Matrix')}
                </h3>
                <p className="text-xs text-slate-500">
                  {t('అన్ని జిల్లాల పాఠశాలలు, పరీక్షించిన పిల్లలు మరియు సాధించిన శాతాలు', 'Comprehensive district audit data')}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="px-4 py-3">జిల్లా పేరు (District)</th>
                    <th className="px-4 py-3">పాఠశాలలు</th>
                    <th className="px-4 py-3">పరీక్షించిన పిల్లలు</th>
                    <th className="px-4 py-3">కథా స్థాయి (Fluent %)</th>
                    <th className="px-4 py-3">శ్రద్ధ అవసరం (Support Needed %)</th>
                    <th className="px-4 py-3">సగటు WCPM</th>
                    <th className="px-4 py-3 text-right">స్థితి (Status)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {districts.map((d, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/40 transition">
                      <td className="px-4 py-3.5 font-bold text-slate-900 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span>{d.district}</span>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-600">{d.schools.toLocaleString()}</td>
                      <td className="px-4 py-3.5 font-mono text-slate-600">{d.studentsAssessed.toLocaleString()}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-100 rounded-full h-2">
                            <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${d.fluentPct}%` }} />
                          </div>
                          <span className="font-bold text-emerald-800">{d.fluentPct}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                          {d.needSupportPct}%
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-black font-mono text-slate-800 text-sm">
                        {d.avgWcpm}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          లక్ష్య సాధన ✓
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SCHOOLS MANAGEMENT */}
      {activeTab === 'schools' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {t('పాఠశాలల నిర్వహణ (School Management)', 'Government School Registry')}
              </h3>
              <p className="text-xs text-slate-500">
                మండలాలు మరియు జిల్లాల వారీగా ప్రభుత్వ ప్రాథమిక & ఉన్నత పాఠశాలల పర్యవేక్షణ.
              </p>
            </div>
            <button className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-blue-700">
              <Plus className="w-3.5 h-3.5" />
              <span>{t('కొత్త పాఠశాల నమోదు', 'Register School')}</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="px-4 py-3">పాఠశాల పేరు (School Name)</th>
                  <th className="px-4 py-3">జిల్లా & మండలం</th>
                  <th className="px-4 py-3">విద్యార్థులు</th>
                  <th className="px-4 py-3">ఉపాధ్యాయులు</th>
                  <th className="px-4 py-3">సగటు WCPM</th>
                  <th className="px-4 py-3 text-right">గ్రేడ్ & హోదా</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {SAMPLE_SCHOOLS.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-900">{s.name}</td>
                    <td className="px-4 py-3 text-slate-600">{s.district} • {s.mandal}</td>
                    <td className="px-4 py-3 font-mono font-semibold">{s.studentsCount}</td>
                    <td className="px-4 py-3 font-mono text-slate-600">{s.teachersCount}</td>
                    <td className="px-4 py-3 font-mono font-bold text-blue-700">{s.avgWcpm} WCPM</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        s.status === 'A+' ? 'bg-emerald-100 text-emerald-800' :
                        s.status === 'A' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TEACHERS MANAGEMENT */}
      {activeTab === 'teachers' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {t('ఉపాధ్యాయుల వివరాలు & అనుమతులు', 'Teacher Roster & Authorizations')}
              </h3>
              <p className="text-xs text-slate-500">
                నమోదైన తెలుగు ఉపాధ్యాయుల ఖాతాలు, కేటాయించిన తరగతులు మరియు ధృవీకరణ వివరాలు.
              </p>
            </div>
            <button className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-emerald-700">
              <Plus className="w-3.5 h-3.5" />
              <span>{t('ఉపాధ్యాయుల చేర్పు', 'Approve Teacher')}</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="px-4 py-3">ఉపాధ్యాయుల పేరు</th>
                  <th className="px-4 py-3">ఈమెయిల్</th>
                  <th className="px-4 py-3">పాఠశాల</th>
                  <th className="px-4 py-3">తరగతి</th>
                  <th className="px-4 py-3">పరీక్షలు / ధృవీకరణలు</th>
                  <th className="px-4 py-3 text-right">స్థితి</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {SAMPLE_TEACHERS.map((tRec) => (
                  <tr key={tRec.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-900 font-telugu">{tRec.nameTelugu} ({tRec.name})</td>
                    <td className="px-4 py-3 font-mono text-slate-600">{tRec.email}</td>
                    <td className="px-4 py-3 text-slate-700">{tRec.school}</td>
                    <td className="px-4 py-3 font-semibold text-blue-700">{tRec.assignedGrade}</td>
                    <td className="px-4 py-3 font-mono">
                      {tRec.assessmentsDone} tests / <span className="font-bold text-emerald-700">{tRec.verifiedCount} signed</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {tRec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: STUDENT RECORDS */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {t('రాష్ట్ర విద్యార్థి రిజిస్ట్రీ (Central Student Registry)', 'Central Student Registry')}
              </h3>
              <p className="text-xs text-slate-500">
                నిపుణ్ భారత్ ప్రమాణాల ప్రకారం విద్యార్థుల పఠన స్థాయిలు మరియు పురోగతి.
              </p>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by student name or roll..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="px-4 py-3">విద్యార్థి పేరు & రోల్</th>
                  <th className="px-4 py-3">పాఠశాల</th>
                  <th className="px-4 py-3">తరగతి</th>
                  <th className="px-4 py-3">పఠన స్థాయి</th>
                  <th className="px-4 py-3">WCPM వేగం</th>
                  <th className="px-4 py-3 text-right">ఖచ్చితత్వం</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: 'G. Ramu (జి. రాముడు)', roll: '01', school: 'Z.P. High School, Madhira', grade: 'తరగతి 3-A', level: 'వాక్య స్థాయి', wcpm: 46, acc: 88 },
                  { name: 'K. Vennela (కె. వెన్నెల)', roll: '02', school: 'Z.P. High School, Madhira', grade: 'తరగతి 3-A', level: 'కథా స్థాయి (Fluent)', wcpm: 62, acc: 94 },
                  { name: 'M. Akhil (ఎం. అఖిల్)', roll: '03', school: 'Z.P. High School, Madhira', grade: 'తరగతి 3-A', level: 'పద స్థాయి', wcpm: 28, acc: 72 },
                  { name: 'B. Anusha (బి. అనూష)', roll: '04', school: 'Govt Model School, Khammam', grade: 'తరగతి 3-B', level: 'కథా స్థాయి', wcpm: 58, acc: 91 },
                  { name: 'S. Tharun (ఎస్. తరుణ్)', roll: '05', school: 'M.P.P. School, Wyra', grade: 'తరగతి 3', level: 'వాక్య స్థాయి', wcpm: 44, acc: 85 },
                ].map((sRec, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-900 font-telugu">{sRec.name} <span className="text-slate-400 font-mono">#{sRec.roll}</span></td>
                    <td className="px-4 py-3 text-slate-600">{sRec.school}</td>
                    <td className="px-4 py-3">{sRec.grade}</td>
                    <td className="px-4 py-3 font-semibold text-emerald-800">{sRec.level}</td>
                    <td className="px-4 py-3 font-mono font-bold text-blue-700">{sRec.wcpm} WCPM</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-slate-800">{sRec.acc}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: AI MODEL CONFIGURATION */}
      {activeTab === 'ai-config' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>{t('తెలుగు AI వాయిస్ & స్పీచ్ ఇంజిన్ అమరికలు (AI Calibration)', 'Telugu AI Speech Calibration')}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {t(
                'ప్రాథమిక బాల స్వరాల గుర్తింపు ఖచ్చితత్వం, Edge-TTS మరియు Murf Falcon 2.1 వాయిస్ పారామీటర్ల సర్దుబాటు.',
                'Calibrate speech recognition confidence thresholds, neural voice pitch, and low-latency streaming endpoints.'
              )}
            </p>
          </div>

          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{t('AI అమరికలు విజయవంతంగా భద్రపరచబడ్డాయి!', 'AI Model Settings Successfully Updated and Deployed!')}</span>
            </div>
          )}

          <form onSubmit={handleSaveAiConfig} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Voice Engine Selector */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Volume2 className="w-4 h-4 text-blue-600" />
                  <span>{t('ప్రాథమిక బోధనా స్వరం (Default Neural Voice)', 'Default Teaching Voice Persona')}</span>
                </div>
                <div className="space-y-2 text-xs">
                  {[
                    { key: 'female', label: 'లక్ష్మి టీచర్ (Female - te-IN-ShrutiNeural)', desc: 'Warm pedagogical maternal timbre for Grade 1-3' },
                    { key: 'male', label: 'శ్రీనివాస్ సర్ (Male - te-IN-MohanNeural)', desc: 'Clear authoritative male educator voice' },
                    { key: 'child', label: 'అనన్య (Child Peer Timbre)', desc: 'High-energy child classmate voice for peer motivation' },
                    { key: 'falcon', label: '✨ అనిషా (Murf Falcon 2.1 AI)', desc: 'Low-latency conversational natural Indian Telugu profile' },
                  ].map((v) => (
                    <label key={v.key} className="flex items-start gap-3 p-2.5 rounded-xl border bg-white hover:border-blue-400 cursor-pointer">
                      <input
                        type="radio"
                        name="defaultVoice"
                        checked={voiceGender === v.key}
                        onChange={() => setVoiceGender(v.key as any)}
                        className="mt-0.5 text-blue-600"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{v.label}</div>
                        <div className="text-[11px] text-slate-500">{v.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* ASR & Scoring Calibration */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  <span>{t('స్పీచ్ రికగ్నిషన్ & పఠన ప్రమాణాలు (ASR Thresholds)', 'ASR & FLN Benchmark Thresholds')}</span>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>{t('కనీస అకౌస్టిక్ విశ్వసనీయత (Confidence Threshold):', 'Confidence Threshold:')}</span>
                    <span className="font-mono text-blue-700 font-bold">{asrConfidenceThreshold}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="95"
                    value={asrConfidenceThreshold}
                    onChange={(e) => setAsrConfidenceThreshold(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <div className="text-[11px] text-slate-500 mt-1">
                    75% recommended for rural primary classroom microphone noise cancellation.
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>{t('కథా స్థాయి లక్ష్య వేగం (Target WCPM Benchmark):', 'Target WCPM Benchmark:')}</span>
                    <span className="font-mono text-blue-700 font-bold">{targetWcpmTier} WCPM</span>
                  </div>
                  <input
                    type="range"
                    min="35"
                    max="70"
                    value={targetWcpmTier}
                    onChange={(e) => setTargetWcpmTier(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <div className="text-[11px] text-slate-500 mt-1">
                    NIPUN Bharat standard: 45–60 words correct per minute by Grade 3.
                  </div>
                </div>
              </div>
            </div>

            {/* Cloud Real-Time Falcon Integration */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>{t('Murf Falcon 2.1 రియల్-టైమ్ స్ట్రీమింగ్ (Cloud Voice API)', 'Murf Falcon 2.1 Streaming Integration')}</span>
                </div>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={falconStreamingEnabled}
                    onChange={(e) => setFalconStreamingEnabled(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>{t('స్ట్రీమింగ్ యాక్టివ్', 'Enable Streaming')}</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Falcon Model ID</label>
                  <input
                    type="text"
                    disabled
                    value="falcon-2.1 (Voice: Anisha - te-IN)"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 font-mono text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Murf AI API Key (Optional Override)</label>
                  <input
                    type="password"
                    value={murfApiKey}
                    onChange={(e) => setMurfApiKey(e.target.value)}
                    placeholder="Enter Murf API key..."
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 font-mono text-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t('అమరికలను సేవ్ చేయండి (Save Configuration)', 'Save Configuration')}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 6: REPORTS & EXPORT */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-200 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                {t('రాష్ట్ర అక్షరాస్యత నివేదికల డౌన్‌లోడ్ (Official Compliance Exports)', 'State Literacy Compliance Exports')}
              </h3>
              <p className="text-xs text-slate-500">
                SCERT & Samagra Shiksha compliant PDF and Excel data extracts.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5 shadow"
            >
              <Download className="w-4 h-4" />
              <span>{t('కంప్లీట్ స్టేట్ రిపోర్ట్ (PDF)', 'Download Full PDF')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="font-bold text-slate-900 text-sm">FLN NIPUN Bharat Quarterly Report</div>
              <p className="text-xs text-slate-500">Comprehensive district-level WCPM mastery trends across Grades 1 to 5.</p>
              <button onClick={() => window.print()} className="text-xs font-bold text-blue-600 hover:underline">Download Extract →</button>
            </div>
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="font-bold text-slate-900 text-sm">Phonemic Hesitation Audit Extract</div>
              <p className="text-xs text-slate-500">Statewide analysis of student errors across conjuncts (ఒత్తులు) and long vowels.</p>
              <button onClick={() => window.print()} className="text-xs font-bold text-blue-600 hover:underline">Download Extract →</button>
            </div>
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="font-bold text-slate-900 text-sm">Teacher Verification Log Archive</div>
              <p className="text-xs text-slate-500">Audit trail of signed assessments and verified classroom reading scores.</p>
              <button onClick={() => window.print()} className="text-xs font-bold text-blue-600 hover:underline">Download Extract →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminAnalyticsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center text-slate-500 text-sm">
          అడ్మిన్ డేటా లోడ్ అవుతోంది... (Loading admin console...)
        </div>
      }
    >
      <AdminAnalyticsPageContent />
    </Suspense>
  );
}
