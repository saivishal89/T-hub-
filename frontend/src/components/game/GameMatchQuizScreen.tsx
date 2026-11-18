'use client';

import React, { useState } from 'react';
import { GameLevel } from '@/lib/gameData';
import AnimatedAnimalAvatar from './AnimatedAnimalAvatar';
import { Volume2, CheckCircle2, RotateCcw, ArrowRight, Star, Sparkles } from 'lucide-react';

interface GameMatchScreenProps {
  level: GameLevel;
  onCompleteQuiz: () => void;
  onBackToMap: () => void;
}

export default function GameMatchQuizScreen({
  level,
  onCompleteQuiz,
  onBackToMap,
}: GameMatchScreenProps) {
  // Pairs from level 3 quiz
  const defaultPairs = [
    { id: '1', leftText: 'తాబేలు', icon: '🐢', rightText: 'తాబేలు (Tortoise)' },
    { id: '2', leftText: 'టమాటా', icon: '🍅', rightText: 'టమాటా (Tomato)' },
    { id: '3', leftText: 'లేడి', icon: '🦌', rightText: 'లేడి (Deer)' },
    { id: '4', leftText: 'కోకిల', icon: '🐦', rightText: 'కోకిల (Cuckoo)' },
  ];

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [teacherMessage, setTeacherMessage] = useState(
    'చిన్నారులూ, ఎడమవైపు బొమ్మను చూసి కుడివైపు ఉన్న సరైన తెలుగు పేరుతో జతపరచండి!'
  );

  const speakText = (text: string) => {
    setIsSpeaking(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsSpeaking(false), 2000);
    }
  };

  const handleLeftClick = (id: string, text: string) => {
    setSelectedLeft(id);
    speakText(text);
    if (selectedRight) {
      checkMatch(id, selectedRight);
    }
  };

  const handleRightClick = (id: string, text: string) => {
    setSelectedRight(id);
    speakText(text);
    if (selectedLeft) {
      checkMatch(selectedLeft, id);
    }
  };

  const checkMatch = (leftId: string, rightId: string) => {
    if (leftId === rightId) {
      // Correct Match!
      const nextMatched = [...matchedIds, leftId];
      setMatchedIds(nextMatched);
      setSelectedLeft(null);
      setSelectedRight(null);
      setTeacherMessage('అద్భుతం! శభాష్! సరైన సమాధానం!');
      speakText('శభాష్! సరైన సమాధానం!');

      if (nextMatched.length === defaultPairs.length) {
        setTimeout(() => {
          onCompleteQuiz();
        }, 1200);
      }
    } else {
      // Wrong Match
      setTeacherMessage('అయ్యో! ఇంకొక్కసారి బొమ్మను మరియు అక్షరాన్ని సరిగ్గా పరిశీలించు!');
      speakText('ఇంకొక్కసారి పరిశీలించు చిన్నా!');
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 700);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto min-h-[640px] bg-gradient-to-b from-emerald-100 via-sky-50 to-amber-50 rounded-[38px] shadow-2xl border-4 border-white overflow-hidden flex flex-col justify-between p-5">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
        <button
          type="button"
          onClick={onBackToMap}
          className="text-xs font-black text-emerald-800 bg-white/80 px-3 py-1.5 rounded-xl shadow-xs hover:bg-white transition cursor-pointer"
        >
          ← మ్యాప్ (Map)
        </button>
        <div className="text-center">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
            {level.stageNameTe}
          </span>
          <h3 className="text-xs font-black text-slate-800 font-telugu">
            {level.titleTe}
          </h3>
        </div>
        <div className="flex items-center gap-1 bg-yellow-400 text-yellow-950 font-black text-xs px-2 py-1 rounded-xl shadow-xs">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>{matchedIds.length} / 4</span>
        </div>
      </div>

      {/* Interactive Animal Companion Box */}
      <div className="my-2 bg-white/90 backdrop-blur-md rounded-2xl p-3 border border-amber-200 shadow-md flex items-center gap-3">
        <div className="shrink-0 -my-2">
          <AnimatedAnimalAvatar
            animalId="tiggy"
            isSpeaking={isSpeaking}
            isListening={false}
            emotion={matchedIds.length === 4 ? 'celebrating' : 'happy'}
            size="sm"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-amber-900 font-telugu">
              🐯 టిగ్గీ సార్ (Tiggy):
            </span>
            <button
              type="button"
              onClick={() => speakText(teacherMessage)}
              className="text-amber-600 hover:text-amber-800 p-1 rounded-lg cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-slate-700 font-medium font-telugu leading-snug mt-0.5">
            {teacherMessage}
          </p>
        </div>
      </div>

      {/* Main Match Columns (Lingokids / Duolingo Style matching) */}
      <div className="flex-1 flex justify-between gap-4 py-2">
        {/* Left Column: Pictures & Words */}
        <div className="flex-1 space-y-2.5">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider text-center">
            బొమ్మలు (Images)
          </div>
          {defaultPairs.map((p) => {
            const isMatched = matchedIds.includes(p.id);
            const isSelected = selectedLeft === p.id;
            return (
              <button
                key={p.id}
                type="button"
                disabled={isMatched}
                onClick={() => handleLeftClick(p.id, p.leftText)}
                className={`w-full p-2.5 rounded-2xl border-2 flex items-center justify-between transition-all shadow-xs cursor-pointer select-none font-telugu ${
                  isMatched
                    ? 'bg-emerald-100 border-emerald-400 opacity-60'
                    : isSelected
                    ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-400 scale-102'
                    : 'bg-white border-slate-200 hover:border-amber-300'
                }`}
              >
                <span className="text-2xl">{p.icon}</span>
                <span className="text-xs font-bold text-slate-800">{p.leftText}</span>
                {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </button>
            );
          })}
        </div>

        {/* Right Column: Telugu Target Names */}
        <div className="flex-1 space-y-2.5">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider text-center">
            అక్షరాలు (Telugu Names)
          </div>
          {defaultPairs
            .slice()
            .reverse() // Scrambled order for game challenge
            .map((p) => {
              const isMatched = matchedIds.includes(p.id);
              const isSelected = selectedRight === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  disabled={isMatched}
                  onClick={() => handleRightClick(p.id, p.leftText)}
                  className={`w-full p-2.5 rounded-2xl border-2 flex items-center justify-center transition-all shadow-xs cursor-pointer select-none font-telugu text-center ${
                    isMatched
                      ? 'bg-emerald-100 border-emerald-400 opacity-60'
                      : isSelected
                      ? 'bg-sky-100 border-sky-500 ring-2 ring-sky-400 scale-102'
                      : 'bg-white border-slate-200 hover:border-sky-300'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-800">{p.rightText}</span>
                </button>
              );
            })}
        </div>
      </div>

      {/* Bottom Completion Banner */}
      {matchedIds.length === defaultPairs.length && (
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-3 rounded-2xl shadow-xl flex items-center justify-between animate-in fade-in zoom-in-95">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-300 fill-current animate-bounce" />
            <span className="text-xs font-black font-telugu">లెవల్ 3 పూర్తయింది! +50 XP!</span>
          </div>
          <button
            type="button"
            onClick={onCompleteQuiz}
            className="px-3.5 py-1.5 bg-white text-emerald-800 font-black text-xs rounded-xl shadow-md cursor-pointer hover:bg-slate-50"
          >
            తదుపరి →
          </button>
        </div>
      )}
    </div>
  );
}
