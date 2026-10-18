import React from 'react';
import { SubjectCode, Unit } from '../types/game';
import { SUBJECTS_DATA, getSubjectByCode } from '../data/curriculum';
import { VEHICLES } from '../data/characters';
import { soundManager } from '../utils/audio';
import { X, Check, Lock, Star, ChevronRight } from 'lucide-react';

interface MapModalProps {
  currentSubject: SubjectCode;
  currentUnitId: string;
  completedLessons: Record<string, boolean>;
  completedUnits: Record<string, boolean>;
  onSelectSubject: (code: SubjectCode) => void;
  onSelectUnit: (unitId: string) => void;
  onClose: () => void;
}

export const MapModal: React.FC<MapModalProps> = ({
  currentSubject,
  currentUnitId,
  completedLessons,
  completedUnits,
  onSelectSubject,
  onSelectUnit,
  onClose
}) => {
  const currentSubjData = getSubjectByCode(currentSubject);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border-4 border-amber-400 overflow-hidden animate-pop">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 p-4 sm:px-6 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🗺️</span>
            <div>
              <h2 className="text-lg font-black leading-tight">Super World Map</h2>
              <p className="text-xs text-amber-100 font-bold">
                British Curriculum Year 2 - 10 Pillars per Unit
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

        {/* Subject Pills */}
        <div className="flex gap-2 p-2.5 bg-slate-100 overflow-x-auto border-b border-slate-200">
          {SUBJECTS_DATA.map(subj => {
            const isSelected = subj.code === currentSubject;
            return (
              <button
                key={subj.code}
                type="button"
                onClick={() => {
                  soundManager.playPop();
                  onSelectSubject(subj.code);
                }}
                className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 shrink-0 transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-300'
                    : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{subj.icon}</span>
                <span>{subj.name}</span>
              </button>
            );
          })}
        </div>

        {/* Units List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3">
          {currentSubjData.units.map((unit: Unit, idx: number) => {
            const isCompleted = !!completedUnits[unit.id];
            const isSelected = unit.id === currentUnitId;
            const isUnlocked =
              idx === 0 || !!completedUnits[currentSubjData.units[idx - 1].id];

            // Count completed lessons in this unit
            const clearedCount = unit.lessons.filter(l => completedLessons[l.id]).length;
            const progressPct = Math.round((clearedCount / (unit.lessons.length || 1)) * 100);
            const rewardVeh = VEHICLES[idx + 1];

            return (
              <div
                key={unit.id}
                onClick={() => {
                  if (!isUnlocked) {
                    soundManager.playWrong();
                    return;
                  }
                  soundManager.playPop();
                  onSelectUnit(unit.id);
                  onClose();
                }}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50 shadow-md ring-2 ring-amber-300'
                    : isCompleted
                    ? 'border-emerald-400 bg-emerald-50 hover:bg-emerald-100/70'
                    : isUnlocked
                    ? 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    : 'border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-black shadow-sm ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : isUnlocked
                          ? 'bg-amber-400 text-amber-950'
                          : 'bg-slate-300 text-slate-500'
                      }`}
                    >
                      {unit.icon}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                          Unit {unit.number}
                        </span>
                        {isCompleted && (
                          <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Cleared!
                          </span>
                        )}
                      </div>
                      <h3 className="font-black text-sm sm:text-base text-slate-800">
                        {unit.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">{unit.description}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    {isUnlocked ? (
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1 text-xs font-black text-amber-600">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          <span>{clearedCount}/{unit.lessons.length}</span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-400">
                          {progressPct}% Done
                        </span>
                      </div>
                    ) : (
                      <span className="p-2 rounded-xl bg-slate-200 text-slate-500 inline-block">
                        <Lock className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress mini dots */}
                <div className="flex gap-1.5 mt-3 pt-2 border-t border-slate-200/60">
                  {unit.lessons.map((ls, lIdx) => {
                    const done = !!completedLessons[ls.id];
                    return (
                      <div
                        key={ls.id}
                        className={`h-2 flex-1 rounded-full transition-all ${
                          done ? 'bg-emerald-500' : 'bg-slate-200'
                        }`}
                        title={`Pillar ${lIdx + 1}: ${ls.title}`}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
