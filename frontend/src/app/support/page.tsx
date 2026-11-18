'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  HelpCircle,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle2,
  Send,
  Building2,
  FileQuestion,
  ShieldCheck,
} from 'lucide-react';

export default function SupportPage() {
  const { currentUser, t } = useApp();

  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('technical');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-slate-50 via-blue-50/20 to-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Support Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
              <HelpCircle className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                EduVerse Help & Support Center
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-1">
                24/7 Technical and Academic Support for Teachers, DEOs, and School Administrators
              </p>
            </div>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Support Desk Active</span>
          </div>
        </div>

        {/* Quick Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-1">
            <Phone className="w-5 h-5 text-blue-600" />
            <div className="text-xs font-bold text-slate-400 uppercase mt-2">Toll-Free Helpline</div>
            <div className="text-sm font-black text-slate-800">1800-425-EDUC (3382)</div>
            <div className="text-[11px] text-slate-500">Mon - Sat (9:00 AM - 6:00 PM)</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-1">
            <Mail className="w-5 h-5 text-emerald-600" />
            <div className="text-xs font-bold text-slate-400 uppercase mt-2">Email Support</div>
            <div className="text-sm font-black text-slate-800">support@eduverse-fln.gov.in</div>
            <div className="text-[11px] text-slate-500">Average response time: &lt; 2 hrs</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-1">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <div className="text-xs font-bold text-slate-400 uppercase mt-2">State Nodal Office</div>
            <div className="text-sm font-black text-slate-800">SCERT Head Office</div>
            <div className="text-[11px] text-slate-500">Basheerbagh, Hyderabad</div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <h3 className="text-base font-black text-slate-900 mb-1">
            Submit a Support Request
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Describe the issue you are facing and our engineering team will assist you promptly.
          </p>

          {submitted ? (
            <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200 animate-in fade-in">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-base font-black text-emerald-900">
                Support Request Submitted Successfully!
              </h4>
              <p className="text-xs text-emerald-700 max-w-md mx-auto">
                Ticket #EDU-{Math.floor(100000 + Math.random() * 900000)} has been generated. A confirmation has been sent to {currentUser?.email || 'your registered email'}.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setSubject('');
                  setMessage('');
                }}
                className="mt-4 px-5 py-2 bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-emerald-800 transition cursor-pointer"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Registered Email
                  </label>
                  <input
                    type="email"
                    disabled
                    value={currentUser?.email || 'lakshmi.teacher@telangana.gov.in'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Issue Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  >
                    <option value="technical">Microphone / Audio Recognition Issue</option>
                    <option value="data">Student Records & Rosters Issue</option>
                    <option value="login">Account Credentials & Access Roles</option>
                    <option value="fln">FLN Curriculum & Assessment Question</option>
                    <option value="other">General Feedback / Feature Suggestion</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subject / Summary
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Microphone audio waveform not updating during Grade 3 test"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Detailed Description
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Please describe what happened, school name, and student roll number if applicable..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Support Ticket</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
