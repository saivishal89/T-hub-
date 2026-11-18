'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  User,
  Mail,
  School,
  MapPin,
  Shield,
  Award,
  Calendar,
  CheckCircle2,
  Sparkles,
  Phone,
  BookOpen,
} from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, role, t } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState('+91 98765 43210');
  const [preferredLang, setPreferredLang] = useState('Telugu (తెలుగు)');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-slate-50 via-blue-50/20 to-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 text-white flex items-center justify-center font-bold text-3xl shadow-lg font-telugu">
            {currentUser?.name?.charAt(0) || 'U'}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight font-telugu">
                {currentUser?.nameTelugu || currentUser?.name || 'User Profile'}
              </h1>
              <span className="text-xs bg-blue-100 text-blue-900 font-bold px-3 py-1 rounded-full border border-blue-200 uppercase tracking-wide">
                {currentUser?.roleLabel || role}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {currentUser?.email || 'user@telangana.gov.in'}
            </p>
            <p className="text-xs text-blue-700 font-semibold mt-1 flex items-center justify-center sm:justify-start gap-1">
              <School className="w-3.5 h-3.5" />
              <span>{currentUser?.school || 'School Education Department, Telangana'}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-xs transition"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {savedSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile details updated successfully!</span>
          </div>
        )}

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Identity & Contact Information */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>Personal Information</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-medium block mb-0.5">Full Name (English / Telugu)</label>
                <div className="font-bold text-slate-800">
                  {currentUser?.name} ({currentUser?.nameTelugu || 'N/A'})
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-0.5">Email Address</label>
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentUser?.email}</span>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-0.5">Contact Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                  />
                ) : (
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{phone}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-0.5">Platform Role</label>
                <div className="font-bold text-slate-800 capitalize">{role.replace('_', ' ')}</div>
              </div>
            </div>
          </div>

          {/* Academic & Geographic Scope */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Jurisdiction & Academic Scope</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-medium block mb-0.5">Assigned District</label>
                <div className="font-bold text-slate-800">
                  {currentUser?.district || 'ఖమ్మం (Khammam)'}
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-0.5">Mandal / Division</label>
                <div className="font-bold text-slate-800">
                  {currentUser?.mandal || 'మధిర (Madhira)'}
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-0.5">School / Institution</label>
                <div className="font-bold text-slate-800">
                  {currentUser?.school || 'Z.P. High School, Madhira'}
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-0.5">Assigned Grade / Section</label>
                <div className="font-bold text-slate-800">
                  {currentUser?.grade || 'Class 1 to 5 FLN Curriculum'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Support Banner */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-blue-300">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Need Help or Account Access Assistance?</h4>
              <p className="text-xs text-white/70">
                Contact the EduVerse Helpdesk for role permission elevation or credentials reset.
              </p>
            </div>
          </div>

          <a
            href="/support"
            className="px-5 py-2.5 rounded-xl bg-white text-blue-950 hover:bg-blue-50 text-xs font-black shadow-sm transition shrink-0"
          >
            Contact Support →
          </a>
        </div>
      </div>
    </div>
  );
}
