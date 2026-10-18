import React from 'react';
import { GameProfile, GameProgress, GameSettings, SubjectCode } from '../types/game';
import { CHARACTERS, VEHICLES } from '../data/characters';
import { getSubjectByCode } from '../data/curriculum';
import { soundManager } from '../utils/audio';
import { Star, Coins, Volume2, VolumeX, Mic, MicOff, Languages, Map, Wrench } from 'lucide-react';

interface GameHUDProps {
  profile: GameProfile;
  progress: GameProgress;
  settings: GameSettings;
  currentUnitTitle: string;
  clearedBarriersInUnit: number;
  totalBarriersInUnit: number;
  onOpenMap: () => void;
  onOpenGarage: () => void;
  onOpenSubjects: () => void;
  onOpenTrophyRoom: () => void;
  onToggleSound: () => void;
  onToggleVoice: () => void;
  onToggleLanguage: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  profile,
  progress,
  settings,
  currentUnitTitle,
  clearedBarriersInUnit,
  totalBarriersInUnit,
  onOpenMap,
  onOpenGarage,
  onOpenSubjects,
  onOpenTrophyRoom,
  onToggleSound,
  onToggleVoice,
  onToggleLanguage
}) => {
  const character = CHARACTERS.find(c => c.id === profile.character) || CHARACTERS[0];
  const vehicle = VEHICLES.find(v => v.id === profile.equippedVehicle) || VEHICLES[0];
  const currentSubj = getSubjectByCode(profile.currentSubject);

  const xpInCurrentLevel = profile.xp % 100;
  const xpPct = Math.min(100, xpInCurrentLevel);

  return (
    <div className="fixed top-3 left-3 right-3 z-30 pointer-events-none flex flex-col gap-2">
      {/* Top Main Cards Bar */}
      <div className="flex items-center justify-between gap-2">
        {/* Left Card: Character profile & XP */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md border-2 border-white/80 rounded-2xl px-3 py-2 shadow-lg flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm text-white font-black cursor-pointer transform hover:scale-105 active:scale-95 transition-all"
            style={{ backgroundColor: character.color }}
            onClick={onOpenGarage}
            title="Open Character & Vehicle Garage"
          >
            {character.icon}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm text-slate-800 leading-none">
                {profile.name}
              </span>
              <span className="bg-emerald-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-md">
                Lv {profile.level}
              </span>
            </div>

            {/* XP Bar */}
            <div className="flex items-center gap-2 mt-1">
              <div className="w-20 sm:w-24 h-2.5 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-300 rounded-full"
                  style={{ width: `${xpPct}%` }}
                />
              </div>
              <span className="text-[10px] font-black text-slate-500">
                {xpInCurrentLevel}/100 XP
              </span>
            </div>
          </div>
        </div>

        {/* Right Card: Collectibles & Action Buttons */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md border-2 border-white/80 rounded-2xl px-3 py-2 shadow-lg flex items-center gap-2 sm:gap-3">
          {/* Stars */}
          <div className="flex items-center gap-1 text-amber-600 font-black text-sm sm:text-base">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-500 animate-bounce" />
            <span>{profile.stars}</span>
          </div>

          {/* Coins */}
          <div className="flex items-center gap-1 text-yellow-600 font-black text-sm sm:text-base">
            <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
            <span>{profile.coins}</span>
          </div>

          <div className="w-px h-6 bg-slate-200 mx-0.5" />

          {/* Vehicle Icon / Garage Shortcut */}
          <button
            type="button"
            onClick={onOpenGarage}
            className="w-8 h-8 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center justify-center text-lg shadow-sm transition-all active:scale-90"
            title={`Equipped: ${vehicle.name} (Click to open Garage)`}
          >
            {vehicle.icon}
          </button>

          {/* Map Button */}
          <button
            type="button"
            onClick={onOpenMap}
            className="w-8 h-8 rounded-xl bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center shadow-sm transition-all active:scale-90"
            title="Open World Map"
          >
            <Map className="w-4 h-4" />
          </button>

          {/* Trophy Room Button */}
          <button
            type="button"
            onClick={onOpenTrophyRoom}
            className="w-8 h-8 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 flex items-center justify-center text-sm shadow-sm transition-all active:scale-90"
            title="Open Trophy Room & Achievements"
          >
            🏆
          </button>

          {/* Music BGM Toggle */}
          <button
            type="button"
            onClick={() => {
              soundManager.toggleBgm();
            }}
            className="w-8 h-8 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-700 flex items-center justify-center text-sm shadow-sm transition-all active:scale-90"
            title="Toggle 8-bit Mario Music"
          >
            🎵
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm transition-all active:scale-90 ${
              settings.soundEnabled
                ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                : 'bg-slate-100 text-slate-400'
            }`}
            title="Toggle Sound Effects"
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Voice Narration Toggle */}
          <button
            type="button"
            onClick={onToggleVoice}
            className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm transition-all active:scale-90 ${
              settings.voiceEnabled
                ? 'bg-purple-100 hover:bg-purple-200 text-purple-800'
                : 'bg-slate-100 text-slate-400'
            }`}
            title="Toggle Voice Read Aloud"
          >
            {settings.voiceEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>

          {/* Language Toggle (English / Bilingual Arabic) */}
          <button
            type="button"
            onClick={onToggleLanguage}
            className="px-2 h-8 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black text-xs flex items-center gap-1 shadow-sm transition-all active:scale-90"
            title="Toggle Bilingual Arabic / English mode"
          >
            <Languages className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {settings.language === 'bilingual' ? 'عربي + EN' : 'EN'}
            </span>
          </button>
        </div>
      </div>

      {/* Secondary Ribbon: Current Subject, Unit, & Pillar progress */}
      <div className="pointer-events-auto self-start bg-slate-900/85 backdrop-blur-md text-white rounded-xl px-3 py-1.5 text-xs font-black flex items-center gap-2 shadow-md">
        <button
          type="button"
          onClick={() => {
            soundManager.playPop();
            onOpenSubjects();
          }}
          className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-lg transition-all text-amber-300"
          title="Change Subject / تغيير المادة"
        >
          <span>{currentSubj.icon}</span>
          <span>{currentSubj.name}</span>
          <span className="text-[10px] text-amber-400 font-bold bg-amber-400/20 px-1.5 rounded">Change 🔄</span>
        </button>
        <span className="text-slate-400">•</span>
        <span className="truncate max-w-[180px] sm:max-w-[300px]">{currentUnitTitle}</span>
        <span className="text-slate-400">•</span>
        <span className="text-emerald-400">
          Pillars: {clearedBarriersInUnit}/{totalBarriersInUnit}
        </span>
      </div>
    </div>
  );
};
