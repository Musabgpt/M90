import React, { useEffect } from 'react';
import { Unit } from '../types/game';
import { VehicleConfig } from '../types/game';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Trophy, Star, Sparkles, ArrowRight } from 'lucide-react';

interface UnitClearModalProps {
  unit: Unit;
  unlockedVehicle?: VehicleConfig;
  onEquipAndContinue: (vehicleId?: string) => void;
}

export const UnitClearModal: React.FC<UnitClearModalProps> = ({
  unit,
  unlockedVehicle,
  onEquipAndContinue
}) => {
  useEffect(() => {
    soundManager.playStageClear();

    // Multistage celebratory confetti
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 }
    });

    const timeout = setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 400);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 flex flex-col items-center text-center shadow-2xl border-4 border-amber-400 animate-pop">
        {/* Golden Trophy Icon */}
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 flex items-center justify-center text-5xl shadow-xl border-4 border-white mb-4 animate-bounce">
          🏆
        </div>

        <span className="bg-emerald-500 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-2">
          Course Cleared!
        </span>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 leading-tight">
          Unit {unit.number} Complete!
        </h2>
        <p className="text-sm font-bold text-slate-600 mt-1">
          {unit.title} • All 10 Pillars Vaulted!
        </p>

        {/* Rewards pill */}
        <div className="flex items-center gap-4 bg-amber-50 border-2 border-amber-200 rounded-2xl px-5 py-2.5 my-4">
          <div className="flex items-center gap-1.5 text-amber-700 font-black text-base">
            <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
            <span>+10 Stars</span>
          </div>
          <div className="w-px h-6 bg-amber-200" />
          <div className="flex items-center gap-1.5 text-yellow-700 font-black text-base">
            <span>🪙 +50 Coins</span>
          </div>
        </div>

        {/* Vehicle Unlocked Announcement */}
        {unlockedVehicle && (
          <div className="w-full bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-600 text-white rounded-2xl p-4 my-2 shadow-md">
            <div className="flex items-center justify-center gap-2 text-xs font-black uppercase text-amber-300">
              <Sparkles className="w-4 h-4" /> New Turbo Vehicle Unlocked!
            </div>
            <div className="flex items-center justify-center gap-3 mt-2">
              <span className="text-4xl">{unlockedVehicle.icon}</span>
              <div className="text-left">
                <h3 className="font-black text-lg leading-tight">{unlockedVehicle.name}</h3>
                <p className="text-xs text-purple-200 font-bold">
                  Speed x{unlockedVehicle.speedMultiplier} • Jump Boost x{unlockedVehicle.jumpMultiplier}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Continue Button */}
        <button
          type="button"
          onClick={() => onEquipAndContinue(unlockedVehicle?.id)}
          className="btn-mario-green w-full py-4 rounded-2xl text-white font-black text-lg mt-4 flex items-center justify-center gap-2 shadow-lg"
        >
          <span>{unlockedVehicle ? `Equip ${unlockedVehicle.name} & Continue` : 'Continue Adventure'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
