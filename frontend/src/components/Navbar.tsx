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
  School,
  Gamepad2,
  HelpCircle,
  User,
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

  // If on login page, render minimal official portal header with EduVerse branding
  if (pathname === '/login') {
    return (
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 py-3.5 px-4 sm:px-8 shadow-xs sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 text-white flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform duration-300">
              E
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight group-hover:text-blue-700 transition-colors">
                  EduVerse
                </span>
                <span className="text-[10px] bg-blue-100 text-blue-900 font-extrabold px-2 py-0.5 rounded-full border border-blue-200">
                  Telugu AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {t('పాఠశాల విద్యాశాఖ – అధికారిక పోర్టల్', 'School Education Department – Official Portal')}
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/support"
              className="text-xs font-bold text-slate-600 hover:text-blue-600 flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{t('సహాయం', 'Support')}</span>
            </Link>

            <button
              onClick={() => setLanguage(language === 'te' ? 'en' : 'te')}
              className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors cursor-pointer"
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

  // 1. ADMIN EXCLUSIVE NAVIGATION - Clean, Simplified, Direct Labels
  const adminLinks: NavLinkItem[] = [
    { href: '/admin', labelTe: 'విశ్లేషణ', labelEn: 'Overview', icon: BarChart3 },
    { href: '/admin?tab=schools', labelTe: 'పాఠశాలలు', labelEn: 'Schools', icon: Building2 },
    { href: '/admin?tab=teachers', labelTe: 'ఉపాధ్యాయులు', labelEn: 'Teachers', icon: Users },
    { href: '/admin?tab=students', labelTe: 'విద్యార్థులు', labelEn: 'Students', icon: Award },
    { href: '/admin?tab=ai-config', labelTe: 'AI మోడల్', labelEn: 'AI Settings', icon: Sparkles },
    { href: '/profile', labelTe: 'నా ప్రొఫైల్', labelEn: 'My Profile', icon: User },
  ];

  // 2. TEACHER EXCLUSIVE NAVIGATION - Corrected labels (Conduct Reading Test fixed to Reading Studio)
  const teacherLinks: NavLinkItem[] = [
    { href: '/teacher', labelTe: 'తరగతి గది', labelEn: 'Classroom', icon: Users },
    { href: '/reading-studio', labelTe: 'పఠన పరీక్ష', labelEn: 'Reading Test', icon: Mic, highlight: true },
    { href: '/assessment-result', labelTe: 'ధృవీకరణ', labelEn: 'Verify & Sign-off', icon: FileCheck },
    { href: '/practice', labelTe: 'అక్షర సాధన', labelEn: 'Practice Hub', icon: Award },
    { href: '/profile', labelTe: 'నా ప్రొఫైల్', labelEn: 'My Profile', icon: User },
  ];

  // 3. STUDENT EXCLUSIVE NAVIGATION - Simplified, clear, child-friendly labels
  const studentLinks: NavLinkItem[] = [
    { href: '/tutor', labelTe: 'చిన్నీ (AI గురువు)', labelEn: 'Chinni 3D AI Tutor', icon: Bot, highlight: true },
    { href: '/reading-studio', labelTe: 'కథల గది', labelEn: 'Stories', icon: BookOpen },
    { href: '/practice', labelTe: 'అక్షర సాధన', labelEn: 'Practice', icon: Gamepad2 },
    { href: '/student-profile', labelTe: 'నా ప్రగతి', labelEn: 'My Progress', icon: BarChart3 },
    { href: '/profile', labelTe: 'ప్రొఫైల్', labelEn: 'Profile', icon: User },
  ];

  // 4. PARENT EXCLUSIVE NAVIGATION
  const parentLinks: NavLinkItem[] = [
    { href: '/parent', labelTe: 'బిడ్డ పురోగతి', labelEn: 'Child Progress', icon: HeartHandshake },
    { href: '/parent?tab=recordings', labelTe: 'రికార్డింగ్స్', labelEn: 'Voice Recordings', icon: Mic },
    { href: '/parent?tab=tips', labelTe: 'ఇంటి చిట్కాలు', labelEn: 'Home Tips', icon: BookOpen },
    { href: '/profile', labelTe: 'నా ప్రొఫైల్', labelEn: 'My Profile', icon: User },
  ];

  // 5. DEO EXCLUSIVE NAVIGATION
  const deoLinks: NavLinkItem[] = [
    { href: '/deo', labelTe: 'జిల్లా డ్యాష్‌బోర్డ్', labelEn: 'District Hub', icon: Building2 },
    { href: '/deo?tab=mandals', labelTe: 'మండలాలు', labelEn: 'Mandals', icon: BarChart3 },
    { href: '/deo?tab=schools', labelTe: 'పాఠశాలలు', labelEn: 'Schools', icon: School },
    { href: '/profile', labelTe: 'నా ప్రొఫైల్', labelEn: 'My Profile', icon: User },
  ];

  // Strictly bind navigation to current authenticated role
  const currentNavLinks: NavLinkItem[] =
    role === 'student'
      ? studentLinks
      : role === 'parent'
      ? parentLinks
      : role === 'teacher'
      ? teacherLinks
      : role === 'district_officer'
      ? deoLinks
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
      label: 'DEO Portal',
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all duration-300">
      {/* Top Govt Bar */}
      <div className={`bg-gradient-to-r ${activeRoleStyle.bannerBg} text-white text-xs px-4 py-1.5 flex justify-between items-center font-medium transition-all duration-500`}>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="truncate max-w-[280px] sm:max-w-none text-[11px] sm:text-xs">
            {t(
              'తెలంగాణ & ఏపీ విద్యాశాఖ – EduVerse AI పఠన వేదిక (FLN / NIPUN Bharat)',
              'School Education Dept – EduVerse Telugu AI Literacy Initiative'
            )}
          </span>
          <span className="hidden md:inline-block text-white/40">|</span>
          <span className="hidden md:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 uppercase tracking-wider">
            {t(activeRoleStyle.labelTe, activeRoleStyle.label)}
          </span>
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Support Link */}
          <Link
            href="/support"
            className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">{t('సహాయం', 'Support')}</span>
          </Link>

          {/* Voice Gender Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setVoiceDropdownOpen(!voiceDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/15 hover:bg-white/25 text-white text-[11px] font-medium transition-colors cursor-pointer"
              title="Change Telugu AI Voice"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">
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
                    className={`w-full text-left px-3 py-2 text-xs flex flex-col hover:bg-slate-50 transition-colors cursor-pointer ${
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
            className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <Globe className="w-3 h-3 text-emerald-300" />
            <span>{language === 'te' ? 'English' : 'తెలుగు'}</span>
          </button>
        </div>
      </div>

      {/* Main Role-Isolated Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo & Current Role Identity - EduVerse Prominent Branding */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 text-white flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 group-hover:shadow-blue-500/25 transition-all duration-300">
              E
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight group-hover:text-blue-700 transition-colors">
                  EduVerse
                </span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${activeRoleStyle.pillBg}`}>
                  {t(activeRoleStyle.labelTe, activeRoleStyle.label)}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {currentUser?.school || t('తెలుగు పఠన నైపుణ్యాల నిర్ధారణ వేదిక', 'Telugu FLN AI Literacy Platform')}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Items with Smooth Hover Animations and Simplified Labels */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {currentNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href.split('?')[0]));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20 translate-y-[-1px]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 hover:translate-y-[-1px]'
                  } ${
                    link.highlight && !isActive
                      ? 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                      : ''
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{t(link.labelTe, link.labelEn)}</span>
                </Link>
              );
            })}
          </nav>

          {/* Authenticated User Profile & Secure Logout */}
          <div className="flex items-center gap-3">
            {/* Authenticated User Identity Pill -> Links directly to /profile */}
            <Link
              href="/profile"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs transition-colors cursor-pointer group"
              title="View My Profile"
            >
              <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[11px] group-hover:scale-105 transition-transform">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-900 leading-tight truncate max-w-[120px] group-hover:text-blue-600 transition-colors">
                  {currentUser?.nameTelugu || currentUser?.name || 'User'}
                </div>
                <div className="text-[10px] text-slate-400 leading-tight">
                  {currentUser?.roleLabelTelugu || currentUser?.roleLabel || 'View Profile'}
                </div>
              </div>
            </Link>

            {/* Secure Logout Button */}
            <button
              type="button"
              onClick={logout}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-red-50 hover:border-red-200 text-slate-700 hover:text-red-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              title="Secure Logout"
            >
              <LogOut className="w-3.5 h-3.5 text-red-500" />
              <span className="hidden sm:inline">{t('లాగ్ అవుట్', 'Logout')}</span>
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
          <Link
            href="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="p-2.5 mb-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-center justify-between"
          >
            <div>
              <span className="font-bold block text-slate-900">{currentUser?.name}</span>
              <span className="text-[11px] text-slate-400">View My Profile</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold uppercase">{role}</span>
          </Link>
          {currentNavLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  isActive ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{t(link.labelTe, link.labelEn)}</span>
              </Link>
            );
          })}
          <Link
            href="/support"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-amber-500" />
            <span>Contact Support</span>
          </Link>
        </div>
      )}
    </header>
  );
}
