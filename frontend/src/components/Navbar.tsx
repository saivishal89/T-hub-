'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';
import { Role, VoiceGender } from '../types';
import {
  BookOpen,
  Mic,
  BarChart3,
  Users,
  Award,
  Sparkles,
  Building2,
  Globe,
  ChevronDown,
  ShieldCheck,
  Menu,
  X,
  Volume2,
  GraduationCap,
  HeartHandshake,
  LogOut,
  Settings,
  Bot,
  FileCheck,
  CheckCircle,
  UserCheck,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    role,
    currentUser,
    isAuthenticated,
    logout,
    language,
    setLanguage,
    voiceGender,
    setVoiceGender,
    t,
  } = useApp();

  const [voiceDropdownOpen, setVoiceDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If on login page, render minimal official portal header
  if (pathname === '/login') {
    return (
      <header className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg font-telugu shadow">
              చ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base">
                  {t('ప్రతి బిడ్డ చదవాలి', 'Every Child Reads')}
                </span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                  FLN Telugu AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {t('పాఠశాల విద్యాశాఖ – అధికారిక పోర్టల్', 'School Education Department – Official Portal')}
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage(language === 'te' ? 'en' : 'te')}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>{language === 'te' ? 'English' : 'తెలుగు'}</span>
            </button>
          </div>
        </div>
      </header>
    );
  }

  interface NavLinkItem {
    href: string;
    labelTe: string;
    labelEn: string;
    icon: any;
    highlight?: boolean;
  }

  // 1. ADMIN EXCLUSIVE NAVIGATION (No student or teacher features shown)
  const adminLinks: NavLinkItem[] = [
    { href: '/admin', labelTe: 'రాష్ట్ర విశ్లేషణ', labelEn: 'Overview & Telemetry', icon: BarChart3 },
    { href: '/admin?tab=schools', labelTe: 'పాఠశాలలు', labelEn: 'Schools', icon: Building2 },
    { href: '/admin?tab=teachers', labelTe: 'ఉపాధ్యాయులు', labelEn: 'Teachers', icon: Users },
    { href: '/admin?tab=students', labelTe: 'విద్యార్థుల రికార్డులు', labelEn: 'Student Records', icon: Award },
    { href: '/admin?tab=ai-config', labelTe: 'AI మోడల్ అమరికలు', labelEn: 'AI Calibration', icon: Sparkles },
    { href: '/settings', labelTe: 'సిస్టమ్ సెట్టింగ్స్', labelEn: 'Settings', icon: Settings },
  ];

  // 2. TEACHER EXCLUSIVE NAVIGATION
  const teacherLinks: NavLinkItem[] = [
    { href: '/teacher', labelTe: 'తరగతి డ్యాష్‌బోర్డ్', labelEn: 'Classroom Hub', icon: Users },
    { href: '/reading-studio', labelTe: 'లైవ్ పఠన పరీక్ష', labelEn: 'Conduct Reading Test', icon: Mic, highlight: true },
    { href: '/assessment-result', labelTe: 'ఉపాధ్యాయుల ధృవీకరణ', labelEn: 'Sign-off & Verify', icon: FileCheck },
    { href: '/practice', labelTe: 'అక్షర సాధన కేటాయింపు', labelEn: 'Assign Practice', icon: Award },
    { href: '/settings', labelTe: 'ప్రొఫైల్', labelEn: 'Profile', icon: Settings },
  ];

  // 3. STUDENT EXCLUSIVE NAVIGATION (Gamified, Child-friendly)
  const studentLinks: NavLinkItem[] = [
    { href: '/reading-studio', labelTe: '📖 కథల గది', labelEn: 'Reading Studio', icon: BookOpen, highlight: true },
    { href: '/tutor', labelTe: '🤖 AI గురువు', labelEn: 'AI Reading Tutor', icon: Bot, highlight: true },
    { href: '/practice', labelTe: '🎮 అక్షర సాధన', labelEn: 'Word Practice', icon: Award },
    { href: '/student-profile', labelTe: '⭐ నా ప్రగతి', labelEn: 'My Progress', icon: GraduationCap },
  ];

  // 4. PARENT EXCLUSIVE NAVIGATION
  const parentLinks: NavLinkItem[] = [
    { href: '/parent', labelTe: 'బిడ్డ పఠన ప్రగతి', labelEn: 'Child Progress', icon: HeartHandshake },
    { href: '/parent?tab=recordings', labelTe: 'వాయిస్ రికార్డింగ్స్', labelEn: 'Voice Recordings', icon: Mic },
    { href: '/parent?tab=tips', labelTe: 'ఇంటి చిట్కాలు', labelEn: 'Home Learning Tips', icon: BookOpen },
    { href: '/parent?tab=report', labelTe: 'నివేదిక డౌన్‌లోడ్', labelEn: 'Download Report', icon: FileCheck },
  ];

  // Strictly bind navigation to current authenticated role
  const currentNavLinks: NavLinkItem[] =
    role === 'student'
      ? studentLinks
      : role === 'parent'
      ? parentLinks
      : role === 'teacher'
      ? teacherLinks
      : adminLinks;

  // Role Theme Styling
  const roleStyles: Record<string, { bannerBg: string; pillBg: string; label: string; labelTe: string }> = {
    admin: {
      bannerBg: 'from-blue-900 via-indigo-950 to-slate-950',
      pillBg: 'bg-blue-100 text-blue-900 border-blue-300',
      label: 'Admin Portal',
      labelTe: 'అడ్మిన్ పోర్టల్',
    },
    super_admin: {
      bannerBg: 'from-blue-900 via-indigo-950 to-slate-950',
      pillBg: 'bg-blue-100 text-blue-900 border-blue-300',
      label: 'State Director Portal',
      labelTe: 'రాష్ట్ర డైరెక్టర్ పోర్టల్',
    },
    district_officer: {
      bannerBg: 'from-indigo-900 via-slate-900 to-blue-950',
      pillBg: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      label: 'District Officer (DEO)',
      labelTe: 'జిల్లా విద్యాశాఖ అధికారి',
    },
    teacher: {
      bannerBg: 'from-emerald-900 via-teal-950 to-slate-950',
      pillBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      label: 'Teacher Portal',
      labelTe: 'ఉపాధ్యాయుల పోర్టల్',
    },
    student: {
      bannerBg: 'from-amber-600 via-orange-700 to-amber-900',
      pillBg: 'bg-amber-100 text-amber-900 border-amber-300',
      label: 'Student Portal',
      labelTe: 'విద్యార్థి పోర్టల్',
    },
    parent: {
      bannerBg: 'from-rose-800 via-purple-900 to-slate-950',
      pillBg: 'bg-rose-100 text-rose-900 border-rose-300',
      label: 'Parent Portal',
      labelTe: 'తల్లిదండ్రుల పోర్టల్',
    },
  };

  const activeRoleStyle = roleStyles[role] || roleStyles.teacher;

  const voiceOptions: { key: VoiceGender; labelTe: string; labelEn: string; desc: string }[] = [
    { key: 'female', labelTe: 'లక్ష్మి టీచర్ (Smt. Shruti)', labelEn: 'Female Teacher (Shruti)', desc: 'Warm pedagogical maternal intonation' },
    { key: 'male', labelTe: 'శ్రీనివాస్ సర్ (Sri Mohan)', labelEn: 'Male Educator (Mohan)', desc: 'Deep authoritative Telugu educator voice' },
    { key: 'child', labelTe: 'అనన్య (Child Peer)', labelEn: 'Child Classmate (Ananya)', desc: 'High-energy child cadence for peer motivation' },
    { key: 'falcon', labelTe: 'అనిషా (Falcon 2.1 AI)', labelEn: 'Anisha (Falcon 2.1)', desc: 'Low-latency natural Indian conversational' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Govt Bar */}
      <div className={`bg-gradient-to-r ${activeRoleStyle.bannerBg} text-white text-xs px-4 py-1.5 flex justify-between items-center font-medium`}>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="truncate max-w-[280px] sm:max-w-none">
            {t(
              'తెలంగాణ & ఆంధ్రప్రదేశ్ పాఠశాల విద్యాశాఖ – ప్రతి బిడ్డ చదవాలి (FLN / NIPUN Bharat)',
              'School Education Dept – Every Child Reads Telugu Literacy Initiative'
            )}
          </span>
          <span className="hidden md:inline-block text-white/40">|</span>
          <span className="hidden md:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 uppercase tracking-wider">
            {t(activeRoleStyle.labelTe, activeRoleStyle.label)}
          </span>
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center gap-3">
          {/* Voice Gender Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setVoiceDropdownOpen(!voiceDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/15 hover:bg-white/25 text-white text-[11px] font-medium transition-colors"
              title="Change Telugu AI Voice (Male / Female)"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {voiceGender === 'female'
                  ? '♀ లక్ష్మి టీచర్'
                  : voiceGender === 'male'
                  ? '♂ శ్రీనివాస్ సర్'
                  : voiceGender === 'child'
                  ? '🧒 అనన్య'
                  : '✨ అనిషా'}
              </span>
              <ChevronDown className="w-3 h-3 text-white/70" />
            </button>

            {voiceDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 text-slate-800 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  {t('తెలుగు AI స్వరం (Voice Engine)', 'Telugu AI Voice Persona')}
                </div>
                {voiceOptions.map((v) => (
                  <button
                    key={v.key}
                    onClick={() => {
                      setVoiceGender(v.key);
                      setVoiceDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex flex-col hover:bg-slate-50 transition-colors ${
                      voiceGender === v.key ? 'bg-blue-50/80 font-bold text-blue-900' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{t(v.labelTe, v.labelEn)}</span>
                      {voiceGender === v.key && <CheckCircle className="w-3.5 h-3.5 text-blue-600" />}
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal">{v.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'te' ? 'en' : 'te')}
            className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-colors"
          >
            <Globe className="w-3 h-3 text-emerald-300" />
            <span>{language === 'te' ? 'English' : 'తెలుగు'}</span>
          </button>
        </div>
      </div>

      {/* Main Role-Isolated Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo & Current Role Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
              <span className="font-telugu">చ</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">
                  {t('ప్రతి బిడ్డ చదవాలి', 'Every Child Reads')}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${activeRoleStyle.pillBg}`}>
                  {t(activeRoleStyle.labelTe, activeRoleStyle.label)}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {currentUser?.school || t('పాఠశాల పఠన నైపుణ్యాల నిర్ధారణ వేదిక', 'Telugu AI Literacy Platform')}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Items (Strictly Filtered by Current Role!) */}
          <nav className="hidden lg:flex items-center gap-1">
            {currentNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href.split('?')[0]));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-xs border border-blue-200/60 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  } ${link.highlight ? 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100' : ''}`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{t(link.labelTe, link.labelEn)}</span>
                </Link>
              );
            })}
          </nav>

          {/* Authenticated User Profile & Secure Logout (NO Role-Switching Dropdown!) */}
          <div className="flex items-center gap-3">
            {/* Authenticated User Identity Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[11px]">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-900 leading-tight truncate max-w-[130px]">
                  {currentUser?.nameTelugu || currentUser?.name}
                </div>
                <div className="text-[10px] text-slate-400 leading-tight">
                  {currentUser?.roleLabelTelugu || currentUser?.roleLabel}
                </div>
              </div>
            </div>

            {/* Secure Logout Button */}
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-red-50 hover:border-red-200 text-slate-700 hover:text-red-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
              title="Secure Logout"
            >
              <LogOut className="w-3.5 h-3.5 text-red-500" />
              <span className="hidden sm:inline">{t('లాగ్ అవుట్', 'Logout')}</span>
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Strictly filtered by role) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1">
          <div className="p-2 mb-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
            <span className="font-bold">{currentUser?.name}</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">{role}</span>
          </div>
          {currentNavLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                  isActive ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4 text-slate-500" />
                <span>{t(link.labelTe, link.labelEn)}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
