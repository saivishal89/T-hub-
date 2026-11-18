'use client';

import React from 'react';
import { Star, Award, Sparkles, Flame, CheckCircle2, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

interface GameProfileViewProps {
  onBackToMap: () => void;
  starsCount: number;
  diamondsCount: number;
  streakDays: number;
}

export default function GameProfileView({
  onBackToMap,
  starsCount = 6,
  diamondsCount = 120,
  streakDays = 3,
}: GameProfileViewProps) {
  // Gamified radar chart skills (Fluency, Accuracy, Speed, Syllables, Conjuncts)
  const skillsData = [
    { subject: 'పఠన వేగం (Speed)', score: 85 },
    { subject: 'ఖచ్చితత్వం (Accuracy)', score: 92 },
    { subject: 'గుణింతాలు (Syllables)', score: 78 },
    { subject: 'ఒత్తులు (Conjuncts)', score: 70 },
    { subject: 'స్పష్టత (Fluency)', score: 88 },
  ];

  return (
    <div className="relative w-full max-w-md mx-auto min-h-[640px] bg-gradient-to-b from-rose-100 via-white to-pink-50 rounded-[38px] shadow-2xl border-4 border-white overflow-hidden flex flex-col justify-between p-5">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-rose-200/60 pb-3">
        <button
          type="button"
          onClick={onBackToMap}
          className="text-xs font-black text-rose-800 bg-white/80 px-3 py-1.5 rounded-xl shadow-xs hover:bg-white transition cursor-pointer"
        >
          ← గేమ్ మ్యాప్ (Map)
        </button>
        <h3 className="text-xs font-black text-slate-800 font-telugu">
          గేమ్ ప్రొఫైల్ & రివార్డులు
        </h3>
        <div className="w-8"></div>
      </div>

      {/* Child Avatar & Level */}
      <div className="my-2 bg-white/95 rounded-2xl p-4 border border-rose-200 shadow-md flex items-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white font-black text-xl flex items-center justify-center font-telugu shadow-md">
          రా
        </div>
        <div>
          <h4 className="text-sm font-extrabold text-slate-900 font-telugu leading-tight">
            జి. రాముడు (G. Ramu)
          </h4>
          <p className="text-[11px] font-bold text-slate-500">
            తరగతి 3-A • Z.P. High School, Madhira
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-black bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md">
              లెవల్ 3 అన్వేషకుడు
            </span>
            <span className="text-[10px] font-bold text-amber-600">
              ⚡ 175 XP Total
            </span>
          </div>
        </div>
      </div>

      {/* Rewards Grid (Cards like in reference image) */}
      <div className="grid grid-cols-2 gap-3 my-2">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center gap-2.5 shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold">
            <Star className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="text-lg font-black text-amber-900 leading-none block">
              {starsCount} / 15
            </span>
            <span className="text-[10px] font-bold text-amber-700 font-telugu">
              నక్షత్రాలు (Stars)
            </span>
          </div>
        </div>

        <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-3 flex items-center gap-2.5 shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-cyan-400 text-cyan-950 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="text-lg font-black text-cyan-900 leading-none block">
              {diamondsCount} 💎
            </span>
            <span className="text-[10px] font-bold text-cyan-700 font-telugu">
              రత్నాలు (Gems)
            </span>
          </div>
        </div>
      </div>

      {/* Radar Skill Strength Chart (Reference Image Style) */}
      <div className="flex-1 bg-white/90 rounded-2xl p-3 border border-slate-200 shadow-sm flex flex-col items-center justify-center">
        <span className="text-[11px] font-black text-slate-700 font-telugu mb-1">
          📊 పఠన నైపుణ్యాల గ్రాఫ్ (Skill Strength Radar)
        </span>
        <div className="w-full h-44">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillsData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#475569' }} />
              <Radar
                name="Skill"
                dataKey="score"
                stroke="#3b82f6"
                fill="#60a5fa"
                fillOpacity={0.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Back Button */}
      <button
        type="button"
        onClick={onBackToMap}
        className="mt-3 w-full py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer select-none font-telugu flex items-center justify-center gap-1.5"
      >
        <span>తిరిగి అడ్వెంచర్ మ్యాప్‌కి వెళ్ళండి (Back to Play)</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
