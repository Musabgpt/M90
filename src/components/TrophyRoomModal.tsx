import React, { useState, useEffect } from 'react';
import { GameProfile, GameProgress } from '../types/game';
import { SUBJECTS_DATA } from '../data/curriculum';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Trophy, Star, Award, Zap, Sparkles, X, Play, Timer, Coins } from 'lucide-react';

interface TrophyRoomModalProps {
  profile: GameProfile;
  progress: GameProgress;
  onBonusCoinsEarned: (coins: number) => void;
  onClose: () => void;
}

export const TrophyRoomModal: React.FC<TrophyRoomModalProps> = ({
  profile,
  progress,
  onBonusCoinsEarned,
  onClose
}) => {
  const [isBonusPlaying, setIsBonusPlaying] = useState(false);
  const [bonusTimer, setBonusTimer] = useState(15);
  const [bonusCoins, setBonusCoins] = useState(0);

  // Bonus Coin Rush Mini-game
  useEffect(() => {
    let interval: any = null;
    if (isBonusPlaying) {
      interval = setInterval(() => {
        setBonusTimer(t => {
          if (t <= 1) {
            clearInterval(interval);
            setIsBonusPlaying(false);
            soundManager.playStageClear();
            confetti({ particleCount: 70, spread: 60 });
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBonusPlaying]);

  const handleStartBonus = () => {
    soundManager.playPowerUp();
    setBonusCoins(0);
    setBonusTimer(15);
    setIsBonusPlaying(true);
  };

  const handleCatchCoin = () => {
    soundManager.playCoin();
    setBonusCoins(c => {
      const next = c + 1;
      onBonusCoinsEarned(1);
      return next;
    });
  };

  const accuracy =
    progress.questionsAnswered > 0
      ? Math.round((progress.correctAnswers / progress.questionsAnswered) * 100)
      : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl border-4 border-amber-400 overflow-hidden animate-pop">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 p-4 sm:px-6 flex items-center justify-between text-amber-950 shadow-md">
          <div className="flex items-center gap-2">
            <Trophy className="w-7 h-7 text-amber-950 fill-amber-300 animate-bounce" />
            <div>
              <h2 className="text-lg font-black leading-tight">Mushroom Trophy Hall</h2>
              <p className="text-xs font-bold text-amber-900">
                Your Year 2 Achievements & Bonus Rush
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-black/10 hover:bg-black/20 text-amber-950 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3 text-center">
              <span className="text-2xl">⭐</span>
              <h4 className="text-lg font-black text-amber-900">{profile.stars}</h4>
              <p className="text-[11px] font-bold text-amber-700">Stars Earned</p>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-3 text-center">
              <span className="text-2xl">🪙</span>
              <h4 className="text-lg font-black text-yellow-900">{profile.coins}</h4>
              <p className="text-[11px] font-bold text-yellow-700">Coins Banked</p>
            </div>

            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-3 text-center">
              <span className="text-2xl">🎯</span>
              <h4 className="text-lg font-black text-emerald-900">{accuracy}%</h4>
              <p className="text-[11px] font-bold text-emerald-700">Accuracy</p>
            </div>

            <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-3 text-center">
              <span className="text-2xl">🔥</span>
              <h4 className="text-lg font-black text-purple-900">{progress.streak}x</h4>
              <p className="text-[11px] font-bold text-purple-700">Streak</p>
            </div>
          </div>

          {/* Subject Mastery Cups */}
          <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4">
            <h3 className="font-black text-sm text-slate-800 uppercase mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" /> Subject Mastery Medals
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
              {SUBJECTS_DATA.map(subj => {
                const totalInSubj = subj.units.reduce((a, u) => a + u.lessons.length, 0);
                const clearedInSubj = subj.units.reduce(
                  (a, u) => a + u.lessons.filter(l => progress.lessonsCompleted[l.id]).length,
                  0
                );
                const isGold = clearedInSubj >= totalInSubj && totalInSubj > 0;
                const isSilver = clearedInSubj >= Math.ceil(totalInSubj / 2);

                return (
                  <div
                    key={subj.code}
                    className={`p-2 rounded-xl border-2 flex flex-col items-center gap-1 ${
                      isGold
                        ? 'border-amber-400 bg-amber-100 shadow-sm'
                        : isSilver
                        ? 'border-slate-300 bg-white'
                        : 'border-slate-200 bg-slate-100 opacity-60'
                    }`}
                  >
                    <span className="text-2xl">{subj.icon}</span>
                    <span className="text-[10px] font-black text-slate-700 leading-tight truncate w-full">
                      {subj.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      {clearedInSubj}/{totalInSubj}
                    </span>
                    {isGold && <span className="text-xs">🥇</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bonus Coin Rush Mini-Game */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-2xl p-4 text-white shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <h4 className="font-black text-sm">Coin Rush Bonus Frenzy</h4>
              </div>
              {isBonusPlaying && (
                <div className="flex items-center gap-1 bg-black/30 px-2.5 py-1 rounded-full text-xs font-black text-yellow-300">
                  <Timer className="w-3.5 h-3.5" /> {bonusTimer}s
                </div>
              )}
            </div>

            {!isBonusPlaying ? (
              <div className="flex items-center justify-between gap-3 mt-2">
                <p className="text-xs text-indigo-100 font-medium">
                  Tap fast to collect bonus coins in a 15-second timed frenzy!
                </p>
                <button
                  type="button"
                  onClick={handleStartBonus}
                  className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-amber-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1 shrink-0 active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-amber-950" /> Play Rush
                </button>
              </div>
            ) : (
              <div className="text-center py-3">
                <p className="text-xs font-bold text-yellow-200 mb-2">
                  Tap the Star Coin as fast as you can!
                </p>
                <button
                  type="button"
                  onClick={handleCatchCoin}
                  className="w-20 h-20 rounded-full bg-gradient-to-b from-yellow-300 via-yellow-400 to-amber-500 border-4 border-white shadow-xl mx-auto flex items-center justify-center text-4xl transform hover:scale-105 active:scale-90 transition-transform"
                >
                  🪙
                </button>
                <div className="mt-2 text-sm font-black text-yellow-300">
                  Coins Caught: +{bonusCoins}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
