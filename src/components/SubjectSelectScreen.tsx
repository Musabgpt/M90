import React, { useState } from 'react';
import { SubjectCode, CharacterId } from '../types/game';
import { SUBJECTS_DATA } from '../data/curriculum';
import { CHARACTERS } from '../data/characters';
import { soundManager } from '../utils/audio';
import { Sparkles, Volume2, Play, Award, Zap } from 'lucide-react';

interface SubjectSelectScreenProps {
  initialName: string;
  initialCharacter: CharacterId;
  completedLessons: Record<string, boolean>;
  onStartGame: (subject: SubjectCode, name: string, character: CharacterId) => void;
}

export const SubjectSelectScreen: React.FC<SubjectSelectScreenProps> = ({
  initialName,
  initialCharacter,
  completedLessons,
  onStartGame
}) => {
  const [name, setName] = useState(initialName || 'Champion');
  const [character, setCharacter] = useState<CharacterId>(initialCharacter || 'mario');
  const [selectedSubj, setSelectedSubj] = useState<SubjectCode>('MAT');
  const [voiceTestStatus, setVoiceTestStatus] = useState<string>('');

  const testVoice = () => {
    soundManager.init();
    setVoiceTestStatus('🔊 Speaking in British English...');
    soundManager.speak(
      'Welcome to Super Mario Parkour! Real British National Curriculum Year 2. Let’s jump over every pillar!',
      'en',
      0.95,
      () => setVoiceTestStatus('✅ British Voice Ready!')
    );
  };

  const handleStart = () => {
    soundManager.init();
    soundManager.playStageClear();
    onStartGame(selectedSubj, name.trim() || 'Champion', character);
  };

  return (
    <div className="fixed inset-0 z-40 bg-gradient-to-b from-sky-500 via-indigo-600 to-purple-800 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl border-4 border-amber-400 my-auto animate-pop">
        {/* Title & Banner */}
        <div className="text-center mb-6">
          <div className="text-5xl sm:text-6xl mb-2 animate-bounce inline-block">🏃‍♂️💨</div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-800 leading-tight">
            SUPER MARIO PARKOUR
          </h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="bg-gradient-to-r from-red-500 to-amber-500 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              British Curriculum • Year 2
            </span>
            <span className="bg-emerald-500 text-white font-black text-xs px-3 py-1 rounded-full shadow-sm">
              ✨ 100% Real Questions
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-bold mt-2">
            كل إجابة صحيحة تجعل ماريو يقفز فوق العمود بحركة بهلوانية أسطورية!
          </p>
        </div>

        {/* Player Name & Character Selector */}
        <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name Input */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                Explorer Name / اسم اللاعب
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your name (e.g. محمد)"
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-300 focus:border-amber-500 focus:outline-none font-bold text-slate-800 text-sm shadow-inner"
              />
            </div>

            {/* Character Selector */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                Choose Hero / اختر البطل
              </label>
              <div className="flex gap-2">
                {CHARACTERS.slice(0, 4).map(c => {
                  const isSelected = character === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        soundManager.playPop();
                        setCharacter(c.id);
                      }}
                      className={`flex-1 py-2 rounded-xl text-lg flex items-center justify-center border-2 transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-100 ring-2 ring-emerald-300 scale-105'
                          : 'border-slate-200 bg-white hover:bg-slate-100'
                      }`}
                      title={c.name}
                    >
                      {c.icon}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Subject Grid */}
        <div className="mb-5">
          <label className="block text-xs font-black text-slate-700 uppercase mb-2">
            Choose Your Subject / اختر المادة التعليمية
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {SUBJECTS_DATA.map(subj => {
              const isSelected = selectedSubj === subj.code;

              // Calculate total cleared lessons in this subject
              const totalLessons = subj.units.reduce((acc, u) => acc + u.lessons.length, 0);
              const clearedLessons = subj.units.reduce(
                (acc, u) => acc + u.lessons.filter(l => completedLessons[l.id]).length,
                0
              );

              return (
                <button
                  key={subj.code}
                  type="button"
                  onClick={() => {
                    soundManager.playPop();
                    setSelectedSubj(subj.code);
                  }}
                  className={`p-3 rounded-2xl border-2 text-left transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50 shadow-md ring-2 ring-amber-300 scale-102'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-2xl">{subj.icon}</span>
                    <span className="text-[10px] font-black text-slate-400">
                      {clearedLessons}/{totalLessons}
                    </span>
                  </div>
                  <h3 className="font-black text-sm text-slate-800 leading-tight">
                    {subj.name}
                  </h3>
                  <p className="text-[11px] font-bold text-slate-500">{subj.nameAr}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Audio Test Bar */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3 mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="text-xs font-bold text-amber-950">
              <span>British Speech & Sound Effects</span>
              {voiceTestStatus && (
                <p className="text-[11px] font-black text-emerald-700">{voiceTestStatus}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={testVoice}
            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs rounded-xl shadow-sm active:scale-95"
          >
            🔊 Test Voice
          </button>
        </div>

        {/* Big Start Button */}
        <button
          type="button"
          onClick={handleStart}
          className="btn-mario-green w-full py-4 rounded-2xl text-white font-black text-lg sm:text-xl flex items-center justify-center gap-2 shadow-xl tracking-wide uppercase"
        >
          <Play className="w-6 h-6 fill-white" /> Start Mario Parkour 🚀
        </button>
      </div>
    </div>
  );
};
