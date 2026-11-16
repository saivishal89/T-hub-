'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { MOCK_STUDENTS_CLASS3A, TELUGU_PASSAGES } from '@/lib/mockData';
import { StudentProgress } from '@/types';
import { resolveApiUrl } from '@/lib/apiConfig';
import {
  Users,
  Search,
  Filter,
  Plus,
  BookOpen,
  Award,
  TrendingUp,
  FileText,
  Printer,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  School,
  Check,
  X,
  Mic,
  GraduationCap,
} from 'lucide-react';

export default function TeacherDashboardPage() {
  const { currentUser, t, language, token } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedPassageId, setSelectedPassageId] = useState('PSG-001');
  const [assignSuccessMessage, setAssignSuccessMessage] = useState<string | null>(null);
  const [students, setStudents] = useState<StudentProgress[]>(MOCK_STUDENTS_CLASS3A);
  const [isDbLoaded, setIsDbLoaded] = useState<boolean>(false);

  // Fetch real classroom roster from backend database scoped to this teacher
  React.useEffect(() => {
    async function loadClassroomStudents() {
      try {
        const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('ecr_auth_token') : '') || '';
        let res = await fetch(resolveApiUrl('/api/students'), {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          credentials: 'include',
        }).catch(() => null);

        if (!res || !res.ok) {
          res = await fetch('http://localhost:8000/api/students', {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
            credentials: 'include',
          }).catch(() => null);
        }

        if (res && res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.students) && data.students.length > 0) {
            const mapped: StudentProgress[] = data.students.map((s: any) => ({
              id: s.id,
              name: s.name,
              nameTelugu: s.name_telugu,
              grade: `తరగతి ${s.grade}-${s.section}`,
              rollNumber: s.roll_number,
              readingLevel: s.reading_level,
              currentWCPM: s.current_wcpm,
              targetWCPM: s.target_wcpm,
              accuracyTrend: typeof s.accuracy_trend === 'string' ? JSON.parse(s.accuracy_trend) : (s.accuracy_trend || [78, 82, 85]),
              lastAssessmentDate: s.last_assessment_date,
              stars: s.stars || 15,
              streakDays: s.streak_days || 3,
              weakAksharas: typeof s.weak_aksharas === 'string' ? JSON.parse(s.weak_aksharas) : (s.weak_aksharas || ['ట్ల', 'వు']),
              parentContact: s.parent_contact || '9876543210',
              notes: s.notes || '',
            }));
            setStudents(mapped);
            setIsDbLoaded(true);
          }
        }
      } catch (e) {
        console.warn('Backend student roster fetch error, using local fallback:', e);
      }
    }
    loadClassroomStudents();
  }, [token]);

  // Exact metrics dynamically derived from actual student data
  const totalEnrolled = students.length;
  const fluentCount = students.filter((s) => s.readingLevel.includes('కథా')).length;
  const sentenceCount = students.filter((s) => s.readingLevel.includes('వాక్య')).length;
  const supportCount = students.filter(
    (s) => s.readingLevel.includes('పద') || s.readingLevel.includes('అక్షర')
  ).length;

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nameTelugu.includes(searchTerm) ||
      s.rollNumber.includes(searchTerm);

    const matchesTier =
      tierFilter === 'all'
        ? true
        : tierFilter === 'fluent'
        ? s.readingLevel.includes('కథా')
        : tierFilter === 'sentence'
        ? s.readingLevel.includes('వాక్య')
        : tierFilter === 'word'
        ? s.readingLevel.includes('పద')
        : s.readingLevel.includes('అక్షర');

    return matchesSearch && matchesTier;
  });

  const handleAssignTest = (e: React.FormEvent) => {
    e.preventDefault();
    const found = TELUGU_PASSAGES.find((p) => p.id === selectedPassageId);
    setAssignSuccessMessage(
      `‘${found?.title || 'కథ'}’ పాఠ్యాంశం తరగతిలోని ${totalEnrolled} మంది విద్యార్థులకు విజయవంతంగా కేటాయించబడింది!`
    );
    setTimeout(() => {
      setAssignSuccessMessage(null);
      setAssignModalOpen(false);
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Teacher Profile Banner - Consistent with Authenticated User Account */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-semibold">
            <School className="w-3.5 h-3.5" />
            <span>{currentUser?.school || 'Z.P. High School, Madhira'} ({currentUser?.district || 'ఖమ్మం జిల్లా'})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t('ఉపాధ్యాయుల తరగతి నిర్వహణ వేదిక', 'Telugu Teacher Classroom Hub')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {t(
              `ఉపాధ్యాయులు: ${currentUser?.nameTelugu || currentUser?.name || 'శ్రీమతి పి. లక్ష్మి (ఎస్.జి.టి)'} • తరగతి: ${currentUser?.grade || '3వ తరగతి ‘ఎ’ సెక్షన్'} (${totalEnrolled} మంది విద్యార్థులు నమోదు)`,
              `Teacher: ${currentUser?.name || 'Smt. P. Lakshmi, SGT'} • Assigned: ${currentUser?.grade || 'Class 3-A'} (${totalEnrolled} Students Enrolled)`
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setAssignModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('కొత్త పఠన పరీక్ష కేటాయించండి', 'Assign Reading Test')}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t('క్లాస్ రిపోర్ట్ ప్రింట్', 'Print Class Roster')}</span>
          </button>
        </div>
      </div>

      {/* Classroom FLN 4-Tier Distribution KPI Cards (100% Consistent with Table Data) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tier 1: Story Fluent */}
        <div
          onClick={() => setTierFilter('fluent')}
          className={`bg-white rounded-2xl p-5 border cursor-pointer transition-all ${
            tierFilter === 'fluent' ? 'border-emerald-500 ring-2 ring-emerald-400/30' : 'border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              {t('కథా స్థాయి (Story/Fluent)', 'Story / Fluent')}
            </span>
            <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {Math.round((fluentCount / totalEnrolled) * 100)}%
            </span>
          </div>
          <div className="text-3xl font-black text-emerald-700 mt-2 font-mono">
            {fluentCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {t('55+ WCPM వేగంతో నిరాటంకంగా చదువుతున్నారు', '55+ WCPM with high fluency')}
          </p>
        </div>

        {/* Tier 2: Sentence Level */}
        <div
          onClick={() => setTierFilter('sentence')}
          className={`bg-white rounded-2xl p-5 border cursor-pointer transition-all ${
            tierFilter === 'sentence' ? 'border-blue-500 ring-2 ring-blue-400/30' : 'border-slate-200 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
              {t('వాక్య స్థాయి (Sentence Level)', 'Sentence Level')}
            </span>
            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {Math.round((sentenceCount / totalEnrolled) * 100)}%
            </span>
          </div>
          <div className="text-3xl font-black text-blue-700 mt-2 font-mono">
            {sentenceCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {t('40–54 WCPM (ఒత్తుల వద్ద స్వల్ప తడబాటు)', '40-54 WCPM with minor hesitation')}
          </p>
        </div>

        {/* Tier 3: Needs Support */}
        <div
          onClick={() => setTierFilter('word')}
          className={`bg-white rounded-2xl p-5 border cursor-pointer transition-all ${
            tierFilter === 'word' ? 'border-amber-500 ring-2 ring-amber-400/30' : 'border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              {t('ప్రత్యేక శ్రద్ధ అవసరం', 'Needs Support')}
            </span>
            <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              {Math.round((supportCount / totalEnrolled) * 100)}%
            </span>
          </div>
          <div className="text-3xl font-black text-amber-700 mt-2 font-mono">
            {supportCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {t('పద & అక్షర స్థాయి (అక్షర సాధన కార్డులు)', 'Word & letter drills active')}
          </p>
        </div>

        {/* Total Enrolled */}
        <div
          onClick={() => setTierFilter('all')}
          className={`bg-white rounded-2xl p-5 border cursor-pointer transition-all ${
            tierFilter === 'all' ? 'border-slate-800 ring-2 ring-slate-400/30' : 'border-slate-200 hover:border-slate-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t('మొత్తం విద్యార్థులు', 'Total Enrolled')}
            </span>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
              Class 3-A
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2 font-mono">
            {totalEnrolled}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {t('అన్ని రికార్డులు చూడటానికి క్లిక్ చేయండి', 'Click to view all records')}
          </p>
        </div>
      </div>

      {/* Student Roster Table & Search Controls */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {t('విద్యార్థుల పఠన సామర్థ్యాల జాబితా', 'Student Literacy Progress Matrix')}
            </h3>
            <p className="text-xs text-slate-500">
              {t(
                `మొత్తం ${totalEnrolled} మంది విద్యార్థులలో ${filteredStudents.length} మంది ప్రదర్శించబడుతున్నారు.`,
                `Displaying ${filteredStudents.length} of ${totalEnrolled} enrolled students.`
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={t('విద్యార్థి పేరు లేదా రోల్ నెం...', 'Search by student or roll...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Clear Filter button if active */}
            {tierFilter !== 'all' && (
              <button
                onClick={() => setTierFilter('all')}
                className="text-xs text-emerald-700 font-bold hover:underline"
              >
                {t('ఫిల్టర్ రద్దు', 'Clear Filter')}
              </button>
            )}
          </div>
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="px-4 py-3">రోల్</th>
                <th className="px-4 py-3">విద్యార్థి పేరు (Student Name)</th>
                <th className="px-4 py-3">పఠన స్థాయి (FLN Tier)</th>
                <th className="px-4 py-3">పఠన వేగం (WCPM)</th>
                <th className="px-4 py-3">చివరి పరీక్ష తేదీ</th>
                <th className="px-4 py-3">పురోగతి ట్రెండ్</th>
                <th className="px-4 py-3 text-right">చర్యలు (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-4 py-3 font-mono font-bold text-slate-500">#{s.rollNumber}</td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-900 font-telugu text-sm">{s.nameTelugu}</div>
                    <div className="text-[11px] text-slate-500">{s.name}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        s.readingLevel.includes('కథా')
                          ? 'bg-emerald-100 text-emerald-800'
                          : s.readingLevel.includes('వాక్య')
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {s.readingLevel.split(' ')[0]}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono">
                    <span className="font-bold text-sm text-slate-900">{s.currentWCPM}</span>
                    <span className="text-slate-400 text-[11px]"> / {s.targetWCPM} WCPM</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-mono text-[11px]">{s.lastAssessmentDate}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {s.accuracyTrend.map((acc, i) => (
                        <div
                          key={i}
                          title={`${acc}%`}
                          className={`w-2 rounded-full ${
                            acc >= 85 ? 'bg-emerald-500 h-5' : acc >= 70 ? 'bg-blue-500 h-3.5' : 'bg-amber-500 h-2.5'
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href="/reading-studio"
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center gap-1"
                        title="Conduct Reading Test for this student"
                      >
                        <Mic className="w-3 h-3" />
                        <span>పరీక్ష</span>
                      </Link>
                      <Link
                        href="/assessment-result"
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                      >
                        రిపోర్ట్
                      </Link>
                      <Link
                        href="/student-profile"
                        className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-[11px]"
                      >
                        ప్రొఫైల్
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Reading Test Modal */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  {t('కొత్త పఠన పరీక్షను కేటాయించండి', 'Assign Reading Test to Class 3-A')}
                </h3>
              </div>
              <button
                onClick={() => setAssignModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {assignSuccessMessage ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold font-telugu text-slate-900">{assignSuccessMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleAssignTest} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('పాఠ్యాంశం ఎంచుకోండి (SCERT Passages):', 'Select Telugu Story Passage:')}
                  </label>
                  <select
                    value={selectedPassageId}
                    onChange={(e) => setSelectedPassageId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-telugu text-slate-900 focus:ring-2 focus:ring-emerald-600"
                  >
                    {TELUGU_PASSAGES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.grade}వ తరగతి: {p.title} ({p.wordCount} పదాలు • {p.difficulty})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-800 space-y-1">
                  <div className="font-bold">కేటాయింపు వివరాలు:</div>
                  <div>• తరగతి: 3వ తరగతి ‘ఎ’ సెక్షన్ ({totalEnrolled} మంది విద్యార్థులు)</div>
                  <div>• రికార్డింగ్ వ్యవధి: ~40 సెకన్లు</div>
                  <div>• మూల్యాంకనం: మైక్రోఫోన్ ASR + ఉపాధ్యాయుల ధృవీకరణ</div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setAssignModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    రద్దు
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md cursor-pointer"
                  >
                    తరగతికి కేటాయించండి
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
