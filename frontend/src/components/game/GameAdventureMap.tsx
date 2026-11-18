'use client';

import React, { useState } from 'react';
import { GameLevel } from '@/lib/gameData';
import { Star, Lock, Play, CheckCircle2, Flame, Award, Sparkles } from 'lucide-react';

interface GameMapProps {
  levels: GameLevel[];
  activeLevelId: number;
  onSelectLevel: (level: GameLevel) => void;
  starsCount: number;
  diamondsCount: number;
  streakDays: number;
}

export default function GameAdventureMap({
  levels,
  activeLevelId,
  onSelectLevel,
  starsCount = 6,
  diamondsCount = 120,
  streakDays = 3,
}: GameMapProps) {
  return (
    <div className="relative w-full max-w-md mx-auto min-h-[640px] bg-gradient-to-b from-sky-400 via-emerald-300 to-green-500 rounded-[38px] shadow-2xl border-4 border-white/80 overflow-hidden flex flex-col justify-between">
      {/* Cartoon Background Elements (Sun, Clouds, Trees) */}
      <div className="absolute top-4 right-5 w-14 h-14 bg-amber-300 rounded-full shadow-[0_0_25px_rgba(251,191,36,0.8)] animate-pulse pointer-events-none"></div>
      
      {/* Animated Cartoon Clouds */}
      <div className="absolute top-8 left-6 w-24 h-8 bg-white/85 rounded-full blur-[1px] shadow-xs pointer-events-none"></div>
      <div className="absolute top-16 right-20 w-32 h-10 bg-white/70 rounded-full blur-[1px] shadow-xs pointer-events-none"></div>

      {/* Top Game HUD Bar (Duolingo Style: Stars, Diamonds, Streak) */}
      <div className="relative z-20 pt-4 px-5 flex justify-between items-center">
        {/* Child Profile Pill */}
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-md border border-white/80">
          <div className="w-7 h-7 rounded-full bg-amber-400 text-amber-950 font-black text-xs flex items-center justify-center font-telugu shadow-inner">
            రా
          </div>
          <div className="text-left leading-tight">
            <span className="text-[11px] font-extrabold text-slate-800 block">రాముడు (Ramu)</span>
            <span className="text-[9px] font-bold text-amber-700 font-mono">Lvl 3 • 25XP</span>
          </div>
        </div>

        {/* Currency Counters */}
        <div className="flex items-center gap-2">
          {/* Daily Streak */}
          <div className="flex items-center gap-1 bg-amber-500 text-white px-2.5 py-1 rounded-2xl text-xs font-black shadow-md border border-amber-300">
            <Flame className="w-3.5 h-3.5 fill-current animate-bounce" />
            <span>{streakDays}</span>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-1 bg-yellow-400 text-yellow-950 px-2.5 py-1 rounded-2xl text-xs font-black shadow-md border border-yellow-200">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{starsCount}</span>
          </div>

          {/* Diamonds */}
          <div className="flex items-center gap-1 bg-cyan-500 text-white px-2.5 py-1 rounded-2xl text-xs font-black shadow-md border border-cyan-300">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>{diamondsCount}</span>
          </div>
        </div>
      </div>

      {/* Main S-Curve Game Path SVG Background */}
      <div className="relative flex-1 w-full my-auto flex flex-col justify-around items-center py-6">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 400 500">
          {/* Outer Dirt Path */}
          <path
            d="M 200 460 Q 310 390 280 320 T 130 200 T 260 80"
            fill="none"
            stroke="#d97706"
            strokeWidth="38"
            strokeLinecap="round"
          />
          {/* Inner Light Path */}
          <path
            d="M 200 460 Q 310 390 280 320 T 130 200 T 260 80"
            fill="none"
            stroke="#fef3c7"
            strokeWidth="26"
            strokeLinecap="round"
            strokeDasharray="8 6"
          />
        </svg>

        {/* Level Nodes Laid along the Winding Path */}
        <div className="relative z-10 w-full flex flex-col-reverse items-center gap-10">
          {levels.map((lvl, index) => {
            const isCompleted = lvl.status === 'completed';
            const isActive = lvl.id === activeLevelId;
            const isLocked = lvl.status === 'locked';

            // Alternating X positions for S-curve path alignment
            const xOffset =
              index === 0
                ? 'translate-x-0'
                : index === 1
                ? 'translate-x-20'
                : index === 2
                ? 'translate-x-8' // Active level boss stage
                : index === 3
                ? '-translate-x-16'
                : 'translate-x-12';

            return (
              <div
                key={lvl.id}
                className={`flex flex-col items-center transition-all transform ${xOffset}`}
              >
                {/* Active Level Label Tag */}
                {isActive && (
                  <div className="mb-2 bg-gradient-to-r from-red-500 to-rose-600 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-lg border-2 border-white animate-bounce flex items-center gap-1.5 font-telugu">
                    <span>ప్రస్తుత సాధన: లెవల్ {lvl.id}</span>
                  </div>
                )}

                {/* Level Circle Button */}
                <button
                  type="button"
                  disabled={isLocked}
                  onClick={() => onSelectLevel(lvl)}
                  className={`relative group w-18 h-18 rounded-full flex flex-col items-center justify-center font-black transition-all shadow-xl cursor-pointer select-none ${
                    isActive
                      ? 'bg-gradient-to-b from-amber-400 to-orange-500 text-white scale-115 ring-4 ring-white ring-offset-4 ring-offset-amber-500 animate-pulse active:scale-105'
                      : isCompleted
                      ? 'bg-gradient-to-b from-emerald-400 to-green-600 text-white hover:scale-110 active:scale-95 border-3 border-emerald-200'
                      : 'bg-slate-300 text-slate-500 border-2 border-slate-400 cursor-not-allowed opacity-80'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <span className="text-xl font-bold">{lvl.id}</span>
                      <div className="flex gap-0.5 mt-0.5">
                        <Star className="w-3 h-3 fill-yellow-300 text-yellow-300" />
                        <Star className="w-3 h-3 fill-yellow-300 text-yellow-300" />
                        <Star className="w-3 h-3 fill-yellow-300 text-yellow-300" />
                      </div>
                    </>
                  ) : isActive ? (
                    <>
                      <Play className="w-7 h-7 fill-white translate-x-0.5" />
                      <span className="text-[10px] font-black tracking-tight uppercase">Play</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-6 h-6 text-slate-500" />
                      <span className="text-[9px] font-bold font-mono">{lvl.id}</span>
                    </>
                  )}
                </button>

                {/* Level Subtitle */}
                <span
                  className={`mt-1 text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs font-telugu ${
                    isActive
                      ? 'bg-amber-900 text-amber-100'
                      : isCompleted
                      ? 'bg-emerald-900/80 text-emerald-100'
                      : 'bg-slate-800/60 text-slate-300'
                  }`}
                >
                  {lvl.titleTe.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Floating Island Footer Controls */}
      <div className="relative z-20 pb-4 px-6">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-bold text-lg shadow-md font-telugu">
              🐯
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 font-telugu leading-tight">
                టిగ్గీ సార్ సిద్ధంగా ఉన్నారు!
              </h4>
              <p className="text-[10px] font-bold text-slate-500">
                లెవల్ 3 మొదలుపెట్టండి (Play Level 3)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectLevel(levels.find((l) => l.id === activeLevelId) || levels[2])}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-xs font-black rounded-xl shadow-md transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer font-telugu"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>ఆడండి!</span>
          </button>
        </div>
      </div>
    </div>
  );
}
