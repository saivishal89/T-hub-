'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Role, Language, UserAccount, VoiceGender } from '../types';
import { MOCK_USERS } from '../lib/mockData';

interface AppContextType {
  role: Role;
  currentUser: UserAccount;
  isAuthenticated: boolean;
  token: string | null;
  language: Language;
  setLanguage: (lang: Language) => void;
  voiceGender: VoiceGender;
  setVoiceGender: (vg: VoiceGender) => void;
  login: (email: string, pass: string, requestedRole?: Role) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  t: (te: string, en: string) => string;
  hasPermission: (permission: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserAccount>(MOCK_USERS.teacher);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>('ecr_local_token');
  const [language, setLanguageState] = useState<Language>('te');
  const [voiceGender, setVoiceGenderState] = useState<VoiceGender>('female');

  // Load persisted session on initial mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('ecr_current_user');
      const savedToken = localStorage.getItem('ecr_auth_token');
      const savedLang = localStorage.getItem('ecr_lang') as Language;
      const savedVoice = localStorage.getItem('ecr_voice_gender') as VoiceGender;

      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
        setIsAuthenticated(true);
      }
      if (savedToken) setToken(savedToken);
      if (savedLang) setLanguageState(savedLang);
      if (savedVoice) setVoiceGenderState(savedVoice);
    } catch (e) {
      console.warn('Session restoration error:', e);
    }
  }, []);

  // Enforce Role-Based Access Control (RBAC) route security
  useEffect(() => {
    if (!pathname) return;

    // Public pages
    if (pathname === '/login' || pathname === '/') return;

    const currentRole = currentUser?.role;

    // Student route guard
    if (currentRole === 'student') {
      if (pathname.startsWith('/admin') || pathname.startsWith('/teacher') || pathname.startsWith('/parent')) {
        console.warn(`[RBAC Guard] Student unauthorized on ${pathname}. Redirecting to /reading-studio`);
        router.push('/reading-studio');
      }
    }

    // Teacher route guard
    if (currentRole === 'teacher') {
      if (pathname.startsWith('/admin') || pathname.startsWith('/parent')) {
        console.warn(`[RBAC Guard] Teacher unauthorized on ${pathname}. Redirecting to /teacher`);
        router.push('/teacher');
      }
    }

    // Parent route guard
    if (currentRole === 'parent') {
      if (pathname.startsWith('/admin') || pathname.startsWith('/teacher') || pathname.startsWith('/reading-studio')) {
        console.warn(`[RBAC Guard] Parent unauthorized on ${pathname}. Redirecting to /parent`);
        router.push('/parent');
      }
    }
  }, [pathname, currentUser, router]);

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    localStorage.setItem('ecr_lang', newLang);
  };

  const setVoiceGender = (vg: VoiceGender) => {
    setVoiceGenderState(vg);
    localStorage.setItem('ecr_voice_gender', vg);
  };

  const t = (te: string, en: string) => (language === 'te' ? te : en);

  const hasPermission = (permission: string) => {
    if (!currentUser) return false;
    if (currentUser.permissions?.includes('all')) return true;
    return currentUser.permissions?.includes(permission) ?? false;
  };

  // Real Email & Password Login
  const login = async (
    email: string,
    pass: string,
    requestedRole?: Role
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Attempt Backend API authentication
    try {
      const res = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: pass, role: requestedRole }),
      });

      if (res.ok) {
        const data = await res.json();
        const user = data.user as UserAccount;
        setCurrentUser(user);
        setIsAuthenticated(true);
        setToken(data.token);
        localStorage.setItem('ecr_current_user', JSON.stringify(user));
        localStorage.setItem('ecr_auth_token', data.token);

        // Redirect based on role
        redirectUserByRole(user.role);
        return { success: true };
      }
    } catch {
      // Backend offline or starting, fall through to client-side credential validation
    }

    // 2. Client-side robust credential validation for offline/standalone execution
    const validCredentials: Record<string, { pass: string; user: UserAccount }> = {
      'admin@telangana.gov.in': { pass: 'Admin@1234', user: MOCK_USERS.admin },
      'lakshmi.teacher@telangana.gov.in': { pass: 'Teacher@1234', user: MOCK_USERS.teacher },
      'ramu.student@school.gov.in': { pass: 'Student@1234', user: MOCK_USERS.student },
      'parent.ramu@gmail.com': { pass: 'Parent@1234', user: MOCK_USERS.parent },
    };

    const record = validCredentials[cleanEmail];
    if (!record) {
      return { success: false, error: 'ఈ ఈమెయిల్ తో ఖాతా కనుగొనబడలేదు (Account not found with this email).' };
    }

    if (record.pass !== pass) {
      return { success: false, error: 'పాస్‌వర్డ్ సరిపోలలేదు (Incorrect password). దయచేసి మళ్ళీ ప్రయత్నించండి.' };
    }

    const matchedUser = record.user;
    if (requestedRole && matchedUser.role !== requestedRole) {
      return { success: false, error: `ఈ ఖాతాకి '${requestedRole}' పాత్ర అనుమతి లేదు (Access denied for this role).` };
    }

    setCurrentUser(matchedUser);
    setIsAuthenticated(true);
    setToken(`ecr_token_${Date.now()}`);
    localStorage.setItem('ecr_current_user', JSON.stringify(matchedUser));
    localStorage.setItem('ecr_auth_token', `ecr_token_${Date.now()}`);

    redirectUserByRole(matchedUser.role);
    return { success: true };
  };

  const redirectUserByRole = (userRole: Role) => {
    if (userRole === 'admin' || userRole === 'super_admin' || userRole === 'district_officer') {
      router.push('/admin');
    } else if (userRole === 'teacher') {
      router.push('/teacher');
    } else if (userRole === 'student') {
      router.push('/reading-studio');
    } else if (userRole === 'parent') {
      router.push('/parent');
    } else {
      router.push('/');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem('ecr_current_user');
    localStorage.removeItem('ecr_auth_token');
    router.push('/login');
  };

  return (
    <AppContext.Provider
      value={{
        role: currentUser?.role || 'teacher',
        currentUser,
        isAuthenticated,
        token,
        language,
        setLanguage,
        voiceGender,
        setVoiceGender,
        login,
        logout,
        t,
        hasPermission,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
