import React, { useState } from 'react';
import { CharacterId } from '../types/game';
import { CHARACTERS, VEHICLES } from '../data/characters';
import { soundManager } from '../utils/audio';
import { X, Check, Lock, Zap, Gauge, Sparkles } from 'lucide-react';

interface GarageModalProps {
  currentCharacter: CharacterId;
  currentVehicle: string;
  unlockedVehicles: string[];
  totalUnitsCompleted: number;
  onSelectCharacter: (charId: CharacterId) => void;
  onSelectVehicle: (vehicleId: string) => void;
  onClose: () => void;
}

export const GarageModal: React.FC<GarageModalProps> = ({
  currentCharacter,
  currentVehicle,
  unlockedVehicles,
  totalUnitsCompleted,
  onSelectCharacter,
  onSelectVehicle,
  onClose
}) => {
  const [tab, setTab] = useState<'character' | 'vehicle'>('character');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl border-4 border-amber-400 overflow-hidden animate-pop">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 p-4 sm:px-6 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏎️</span>
            <div>
              <h2 className="text-lg font-black leading-tight">Mushroom Garage</h2>
              <p className="text-xs text-amber-100 font-bold">
                Choose your Mario hero & turbo vehicle!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-black/10 hover:bg-black/20 text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-100 p-1.5 gap-2 border-b border-slate-200">
          <button
            type="button"
            onClick={() => {
              soundManager.playPop();
              setTab('character');
            }}
            className={`flex-1 py-2 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
              tab === 'character'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            🧑‍🚀 Characters
          </button>
          <button
            type="button"
            onClick={() => {
              soundManager.playPop();
              setTab('vehicle');
            }}
            className={`flex-1 py-2 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
              tab === 'vehicle'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            🛴 Vehicles ({unlockedVehicles.length}/{VEHICLES.length})
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          {tab === 'character' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CHARACTERS.map(c => {
                const isSelected = currentCharacter === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      soundManager.playPop();
                      soundManager.speak(c.catchphrase, 'en', 1.0);
                      onSelectCharacter(c.id);
                    }}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all relative ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 shadow-md ring-2 ring-emerald-300 scale-102'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}

                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm border-2 border-white"
                      style={{ backgroundColor: c.color }}
                    >
                      {c.icon}
                    </div>

                    <div className="text-center">
                      <h4 className="font-black text-sm text-slate-800">{c.name}</h4>
                      <p className="text-[11px] font-bold text-slate-500">{c.nameAr}</p>
                    </div>

                    <span className="text-[10px] italic text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      "{c.catchphrase}"
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {VEHICLES.map(v => {
                const isUnlocked =
                  unlockedVehicles.includes(v.id) ||
                  totalUnitsCompleted >= v.unlockUnitReq;
                const isEquipped = currentVehicle === v.id;

                return (
                  <div
                    key={v.id}
                    className={`p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 transition-all ${
                      isEquipped
                        ? 'border-amber-500 bg-amber-50 shadow-md ring-2 ring-amber-300'
                        : isUnlocked
                        ? 'border-slate-200 bg-white hover:bg-slate-50'
                        : 'border-slate-200 bg-slate-100 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-2xl">
                        {v.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-sm text-slate-800">{v.name}</h4>
                          <span className="text-xs font-bold text-slate-400">({v.nameAr})</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">{v.description}</p>
                        <div className="flex items-center gap-3 mt-1 text-[11px] font-bold text-slate-600">
                          <span className="flex items-center gap-1 text-emerald-600">
                            <Gauge className="w-3.5 h-3.5" /> Speed x{v.speedMultiplier}
                          </span>
                          <span className="flex items-center gap-1 text-amber-600">
                            <Zap className="w-3.5 h-3.5" /> Jump x{v.jumpMultiplier}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      {isEquipped ? (
                        <span className="px-3 py-1.5 rounded-xl bg-amber-400 text-amber-950 font-black text-xs shadow-sm flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" /> Equipped
                        </span>
                      ) : isUnlocked ? (
                        <button
                          type="button"
                          onClick={() => {
                            soundManager.playPowerUp();
                            onSelectVehicle(v.id);
                          }}
                          className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs shadow-sm active:scale-95 transition-all"
                        >
                          Equip
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-500 font-bold text-xs flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5" /> Unit {v.unlockUnitReq}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
