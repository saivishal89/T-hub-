'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { TELUGU_GAME_LEVELS, ANIMAL_TEACHERS, GameLevel, AnimalTeacher } from '@/lib/gameData';
import GameAdventureMap from '@/components/game/GameAdventureMap';
import GameMatchQuizScreen from '@/components/game/GameMatchQuizScreen';
import GameProfileView from '@/components/game/GameProfileView';
import AnimatedAnimalAvatar from '@/components/game/AnimatedAnimalAvatar';
import { Gamepad2, MapPin, User, Sparkles, Volume2, ArrowLeft } from 'lucide-react';

export default function GameWorldPage() {
  const { t } = useApp();

  const [activeTab, setActiveTab] = useState<'map' | 'quiz' | 'profile'>('map');
  const [selectedLevel, setSelectedLevel] = useState<GameLevel>(TELUGU_GAME_LEVELS[2]); // Level 3 active
  const [selectedTeacher, setSelectedTeacher] = useState<AnimalTeacher>(ANIMAL_TEACHERS.tiggy);
  const [stars, setStars] = useState(6);
  const [diamonds, setDiamonds] = useState(120);

  const handleLevelSelect = (level: GameLevel) => {
    setSelectedLevel(level);
    setActiveTab('quiz');
  };

  const handleQuizComplete = () => {
    setStars((prev) => prev + 3);
    setDiamonds((prev) => prev + 50);
    setActiveTab('profile');
  };

  return (
    <div className="min-h-[90vh] bg-gradient-to-b from-sky-100 via-emerald-50 to-amber-100 py-6 px-4 flex flex-col items-center justify-center">
      {/* Game Mode Switcher Tab Bar */}
      <div className="w-full max-w-md flex items-center justify-between mb-4 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-md">
        <button
          type="button"
          onClick={() => setActiveTab('map')}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer font-telugu ${
            activeTab === 'map'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>మ్యాప్ (Island Map)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer font-telugu ${
            activeTab === 'quiz'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>సాధన (Play Stage)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer font-telugu ${
            activeTab === 'profile'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>ప్రొఫైల్ (Stats)</span>
        </button>
      </div>

      {/* Main Game Screen Render */}
      <div className="w-full max-w-md">
        {activeTab === 'map' && (
          <GameAdventureMap
            levels={TELUGU_GAME_LEVELS}
            activeLevelId={selectedLevel.id}
            onSelectLevel={handleLevelSelect}
            starsCount={stars}
            diamondsCount={diamonds}
            streakDays={4}
          />
        )}

        {activeTab === 'quiz' && (
          <GameMatchQuizScreen
            level={selectedLevel}
            onCompleteQuiz={handleQuizComplete}
            onBackToMap={() => setActiveTab('map')}
          />
        )}

        {activeTab === 'profile' && (
          <GameProfileView
            onBackToMap={() => setActiveTab('map')}
            starsCount={stars}
            diamondsCount={diamonds}
            streakDays={4}
          />
        )}
      </div>
    </div>
  );
}
