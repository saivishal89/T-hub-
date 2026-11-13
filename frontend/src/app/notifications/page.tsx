'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  Users,
  BookOpen,
  Filter,
  Check,
  ChevronRight,
  School,
  TrendingDown,
} from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'alert' | 'success' | 'reminder' | 'system';
  titleTe: string;
  titleEn: string;
  descTe: string;
  descEn: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabelTe?: string;
  actionLabelEn?: string;
  category: 'student' | 'class' | 'district';
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOTIF-001',
    type: 'alert',
    titleTe: 'ప్రత్యేక శ్రద్ధ హెచ్చరిక: 2 మంది విద్యార్థులు < 20 WCPM',
    titleEn: 'Remediation Alert: 2 Students Below 20 WCPM',
    descTe: 'తరగతి 3-ఎ లోని టి. చరణ్ తేజ (16 WCPM) మరియు బి. తరుణ్ సంయుక్తాక్షరాల పఠనంలో తీవ్రంగా తడబడుతున్నారు. తక్షణమే అక్షర సాధన కేటాయించండి.',
    descEn: 'T. Charan Teja (16 WCPM) in Class 3-A requires urgent phoneme intervention on conjunct consonants (ఒత్తులు).',
    timestamp: '15 నిమిషాల క్రితం',
    read: false,
    actionUrl: '/practice',
    actionLabelTe: 'అక్షర సాధన అసైన్ చేయండి',
    actionLabelEn: 'Assign Word Practice',
    category: 'student',
  },
  {
    id: 'NOTIF-002',
    type: 'success',
    titleTe: 'లక్ష్య సాధన: రాముడు 45 WCPM మార్కును దాటాడు!',
    titleEn: 'Milestone Met: Ramu Crossed 45 WCPM Target!',
    descTe: 'జి. రాముడు నేటి పఠన పరీక్షలో 46 WCPM వేగంతో వాక్య స్థాయి (Sentence Level) సర్టిఫికేట్‌కు అర్హత సాధించాడు.',
    descEn: 'G. Ramu achieved 46 WCPM on today\'s assessment and qualified for the Foundational Reading Certificate.',
    timestamp: '2 గంటల క్రితం',
    read: false,
    actionUrl: '/student-profile',
    actionLabelTe: 'సర్టిఫికేట్ చూడండి',
    actionLabelEn: 'View Certificate',
    category: 'student',
  },
  {
    id: 'NOTIF-003',
    type: 'reminder',
    titleTe: 'వారపు పఠన అసెస్‌మెంట్ రిమైండర్',
    titleEn: 'Weekly Reading Assessment Due',
    descTe: 'తరగతి 3-ఎ లోని 4 మంది విద్యార్థులకు ఈ వారం పఠన పరీక్ష ఇంకా పూర్తి కాలేదు. గడువు: 15 నవంబర్ 2026.',
    descEn: '4 students in Class 3-A are pending their weekly SCERT Telugu passage assessment. Deadline: 15 Nov.',
    timestamp: '1 రోజు క్రితం',
    read: true,
    actionUrl: '/reading-studio',
    actionLabelTe: 'పరీక్ష ప్రారంభించండి',
    actionLabelEn: 'Launch Test Studio',
    category: 'class',
  },
  {
    id: 'NOTIF-004',
    type: 'system',
    titleTe: 'నూతన తెలుగు ASR మోడల్ v2.4 అప్‌డేట్',
    titleEn: 'Telugu Speech Engine v2.4 Deployed',
    descTe: 'తెలంగాణ మరియు రాయలసీమ గ్రామీణ బాలల స్వరాల గుర్తింపు ఖచ్చితత్వం 94.2% కు పెరిగింది.',
    descEn: 'Acoustic calibration for regional child accents updated across all mandals.',
    timestamp: '2 రోజుల క్రితం',
    read: true,
    category: 'district',
  },
];

export default function NotificationsPage() {
  const { t, language } = useApp();
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread' | 'student' | 'class'>('all');

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markSingleAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'student') return n.category === 'student';
    if (filter === 'class') return n.category === 'class';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-2">
            <Bell className="w-3.5 h-3.5" />
            <span>{t('నోటిఫికేషన్లు & హెచ్చరికల కేంద్రం', 'Alerts & Notifications Hub')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('పఠన హెచ్చరికలు & పురోగతి సమాచారం', 'Reading Progress & Intervention Alerts')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t(
              'విద్యార్థుల పఠన లోపాలు, తక్కువ WCPM హెచ్చరికలు మరియు విద్యాశాఖ ఆదేశాలు.',
              'Real-time alerts for lagging reading speeds, completed milestones, and weekly testing reminders.'
            )}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition border border-slate-200 shadow-xs"
          >
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{t('అన్నీ చదివినట్లు గుర్తించు', 'Mark all as read')}</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-500 uppercase mr-1">
          {t('ఫిల్టర్:', 'Filter:')}
        </span>
        {[
          { key: 'all', labelTe: 'అన్ని నోటిఫికేషన్లు', labelEn: 'All' },
          { key: 'unread', labelTe: `చదవనివి (${unreadCount})`, labelEn: `Unread (${unreadCount})` },
          { key: 'student', labelTe: 'విద్యార్థుల హెచ్చరికలు', labelEn: 'Student Alerts' },
          { key: 'class', labelTe: 'తరగతి రిమైండర్లు', labelEn: 'Class Reminders' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              filter === tab.key
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {language === 'te' ? tab.labelTe : tab.labelEn}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <div className="font-bold text-slate-800 text-sm">
              {t('ఏవీ పెండింగ్‌లో లేవు!', 'All caught up!')}
            </div>
            <div className="text-xs text-slate-500">
              {t('ప్రస్తుతానికి కొత్త హెచ్చరికలు లేవు.', 'No unread alerts for this filter.')}
            </div>
          </div>
        ) : (
          filtered.map((item) => {
            return (
              <div
                key={item.id}
                onClick={() => markSingleAsRead(item.id)}
                className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer ${
                  !item.read
                    ? 'bg-blue-50/60 border-blue-200 ring-1 ring-blue-400/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      item.type === 'alert'
                        ? 'bg-rose-100 text-rose-700'
                        : item.type === 'success'
                        ? 'bg-emerald-100 text-emerald-700'
                        : item.type === 'reminder'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {item.type === 'alert' ? (
                      <TrendingDown className="w-5 h-5" />
                    ) : item.type === 'success' ? (
                      <Award className="w-5 h-5" />
                    ) : item.type === 'reminder' ? (
                      <Clock className="w-5 h-5" />
                    ) : (
                      <Sparkles className="w-5 h-5" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">
                        {language === 'te' ? item.titleTe : item.titleEn}
                      </h3>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                      {language === 'te' ? item.descTe : item.descEn}
                    </p>
                    <div className="text-[10px] text-slate-400 font-medium pt-0.5">
                      {item.timestamp}
                    </div>
                  </div>
                </div>

                {item.actionUrl && (
                  <Link
                    href={item.actionUrl}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-300 shadow-xs transition flex-shrink-0 self-start sm:self-center"
                  >
                    <span>
                      {language === 'te' ? item.actionLabelTe : item.actionLabelEn}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

