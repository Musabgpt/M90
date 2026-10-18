import React, { useState } from 'react';
import { Question } from '../types/game';
import { soundManager } from '../utils/audio';
import { Sparkles, Palette, Clock, Compass, Layers, Droplets, Sun } from 'lucide-react';

// 1. Interactive Counting Cubes / Ten-Frame
const CubesWidget: React.FC<{ data: any }> = ({ data }) => {
  const countA = data?.countA || 5;
  const countB = data?.countB || 0;
  const multiplier = data?.multiplier || 1;
  const [countedA, setCountedA] = useState<number[]>([]);
  const [countedB, setCountedB] = useState<number[]>([]);

  const toggleA = (idx: number) => {
    soundManager.playPop();
    setCountedA(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const toggleB = (idx: number) => {
    soundManager.playPop();
    setCountedB(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const totalCounted = (countedA.length + countedB.length) * multiplier;

  return (
    <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 my-3 text-slate-800 shadow-inner">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">🧊</span>
          <span className="font-bold text-sm text-amber-900">
            Interactive Cubes (Tap to count!)
          </span>
        </div>
        <span className="bg-amber-200 text-amber-950 px-3 py-0.5 rounded-full text-xs font-black">
          Counted: {totalCounted}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 justify-center my-2">
        {Array.from({ length: countA }).map((_, i) => {
          const isCounted = countedA.includes(i);
          return (
            <button
              key={`a-${i}`}
              type="button"
              onClick={() => toggleA(i)}
              className={`w-11 h-11 rounded-xl font-black text-sm flex items-center justify-center transition-all transform active:scale-90 ${
                isCounted
                  ? 'bg-gradient-to-b from-emerald-400 to-green-600 text-white shadow-[0_3px_0_#15803d] scale-95 ring-2 ring-emerald-300'
                  : 'bg-gradient-to-b from-amber-300 to-orange-400 text-amber-950 shadow-[0_4px_0_#c2410c] hover:-translate-y-0.5'
              }`}
            >
              {multiplier > 1 ? `${(i + 1) * multiplier}` : i + 1}
            </button>
          );
        })}
      </div>

      {countB > 0 && (
        <>
          <div className="text-center font-black text-amber-600 my-1">+</div>
          <div className="flex flex-wrap gap-2 justify-center my-2">
            {Array.from({ length: countB }).map((_, i) => {
              const isCounted = countedB.includes(i);
              return (
                <button
                  key={`b-${i}`}
                  type="button"
                  onClick={() => toggleB(i)}
                  className={`w-11 h-11 rounded-xl font-black text-sm flex items-center justify-center transition-all transform active:scale-90 ${
                    isCounted
                      ? 'bg-gradient-to-b from-emerald-400 to-green-600 text-white shadow-[0_3px_0_#15803d] scale-95 ring-2 ring-emerald-300'
                      : 'bg-gradient-to-b from-sky-400 to-blue-600 text-white shadow-[0_4px_0_#1d4ed8] hover:-translate-y-0.5'
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

// 2. Interactive Number Line
const NumberLineWidget: React.FC<{ data: any }> = ({ data }) => {
  const min = data?.min ?? 0;
  const max = data?.max ?? 20;
  const step = data?.step ?? 2;
  const target = data?.target ?? 10;
  const [pos, setPos] = useState<number>(data?.current ?? min);

  const stepForward = () => {
    soundManager.playJump();
    setPos(p => Math.min(max, p + step));
  };

  const stepBack = () => {
    soundManager.playPop();
    setPos(p => Math.max(min, p - step));
  };

  return (
    <div className="bg-sky-50 border-2 border-sky-300 rounded-2xl p-4 my-3 text-slate-800 shadow-inner">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">🦘</span>
          <span className="font-bold text-sm text-sky-900">
            Interactive Number Line (Jump in steps of {step})
          </span>
        </div>
        <span className="bg-sky-200 text-sky-950 px-3 py-0.5 rounded-full text-xs font-black">
          Position: {pos} {pos === target && '🎯 Target!'}
        </span>
      </div>

      <div className="relative py-6 px-2 overflow-x-auto">
        <div className="h-2 bg-sky-300 rounded-full relative w-full min-w-[280px]">
          {Array.from({ length: Math.floor((max - min) / step) + 1 }).map((_, i) => {
            const val = min + i * step;
            const pct = ((val - min) / (max - min)) * 100;
            const isCurrent = val === pos;
            const isTarget = val === target;

            return (
              <div
                key={val}
                className="absolute -top-1.5 flex flex-col items-center cursor-pointer"
                style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}
                onClick={() => {
                  soundManager.playPop();
                  setPos(val);
                }}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 transition-transform ${
                    isCurrent
                      ? 'bg-amber-400 border-amber-600 scale-125 z-10'
                      : isTarget
                      ? 'bg-emerald-400 border-emerald-600 ring-2 ring-emerald-300'
                      : 'bg-white border-sky-400 hover:scale-110'
                  }`}
                />
                <span
                  className={`text-xs mt-1 font-bold ${
                    isCurrent
                      ? 'text-amber-800 scale-110'
                      : isTarget
                      ? 'text-emerald-700'
                      : 'text-slate-500'
                  }`}
                >
                  {val}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center gap-3 mt-3">
        <button
          type="button"
          onClick={stepBack}
          className="px-3 py-1.5 bg-white border-2 border-sky-200 hover:bg-sky-100 rounded-xl font-bold text-xs shadow-sm"
        >
          ⬅️ Jump -{step}
        </button>
        <button
          type="button"
          onClick={stepForward}
          className="px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold text-xs shadow-[0_2px_0_#0369a1]"
        >
          Jump +{step} ➡️
        </button>
      </div>
    </div>
  );
};

// 3. Interactive Clock Face
const ClockWidget: React.FC<{ data: any }> = ({ data }) => {
  const hour = data?.hour || 3;
  const minute = data?.minute || 30;

  const minuteAngle = minute * 6;
  const hourAngle = (hour % 12) * 30 + (minute / 60) * 30;

  return (
    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-4 my-3 text-slate-800 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-2 w-full justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-600" />
          <span className="font-bold text-sm text-amber-900">Analog Clock Face</span>
        </div>
        <span className="bg-amber-200 text-amber-950 px-3 py-0.5 rounded-full text-xs font-black font-mono">
          {hour.toString().padStart(2, '0')}:{minute.toString().padStart(2, '0')}
        </span>
      </div>

      <div className="relative w-40 h-40 bg-white rounded-full border-4 border-amber-500 shadow-md flex items-center justify-center my-2">
        {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(n => {
          const rad = (n * 30 - 90) * (Math.PI / 180);
          const x = 50 + 38 * Math.cos(rad);
          const y = 50 + 38 * Math.sin(rad);
          return (
            <span
              key={n}
              className="absolute text-[11px] font-black text-slate-700 select-none"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {n}
            </span>
          );
        })}

        <div className="absolute w-3 h-3 bg-red-600 rounded-full z-20 shadow-sm" />

        <div
          className="absolute w-1.5 h-10 bg-slate-800 rounded-full origin-bottom z-10 transition-transform"
          style={{
            bottom: '50%',
            transform: `rotate(${hourAngle}deg)`
          }}
        />

        <div
          className="absolute w-1 h-14 bg-blue-600 rounded-full origin-bottom z-10 transition-transform"
          style={{
            bottom: '50%',
            transform: `rotate(${minuteAngle}deg)`
          }}
        />
      </div>
      <p className="text-xs text-amber-800 font-medium">
        🔵 Long hand: Minutes (at {minute} mins) • ⚫ Short hand: Hours (past {hour})
      </p>
    </div>
  );
};

// 4. Interactive Fraction Slices
const FractionWidget: React.FC<{ data: any }> = ({ data }) => {
  const denominator = data?.denominator || 4;
  const initialNumerator = data?.numerator || 1;
  const [selected, setSelected] = useState<number[]>(
    Array.from({ length: initialNumerator }, (_, i) => i)
  );

  const toggleSlice = (idx: number) => {
    soundManager.playPop();
    setSelected(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 my-3 text-slate-800">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">🍕</span>
          <span className="font-bold text-sm text-rose-900">
            Fraction Visualizer (Tap pieces to shade!)
          </span>
        </div>
        <span className="bg-rose-200 text-rose-950 px-3 py-0.5 rounded-full text-xs font-black">
          Fraction: {selected.length}/{denominator}
        </span>
      </div>

      <div className="flex gap-2 max-w-sm mx-auto my-3">
        {Array.from({ length: denominator }).map((_, i) => {
          const isShaded = selected.includes(i);
          return (
            <button
              key={i}
              type="button"
              onClick={() => toggleSlice(i)}
              className={`flex-1 h-14 rounded-xl font-black text-sm flex items-center justify-center transition-all ${
                isShaded
                  ? 'bg-gradient-to-b from-rose-500 to-red-600 text-white shadow-[0_4px_0_#9f1239] scale-100 ring-2 ring-rose-300'
                  : 'bg-white border-2 border-dashed border-rose-300 text-rose-700 hover:bg-rose-100'
              }`}
            >
              1/{denominator}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// 5. Interactive Color Mixer
const ColorMixerWidget: React.FC<{ data: any }> = ({ data }) => {
  const color1 = data?.color1 || '#FF0000';
  const color2 = data?.color2 || '#FFD700';
  const resultColor = data?.result || '#FFA500';
  const name1 = data?.name1 || 'Red';
  const name2 = data?.name2 || 'Yellow';
  const resultName = data?.resultName || 'Orange';

  const [isMixed, setIsMixed] = useState(false);

  const handleMix = () => {
    soundManager.playStar();
    setIsMixed(true);
  };

  return (
    <div className="bg-purple-50 border-2 border-purple-300 rounded-2xl p-4 my-3 text-slate-800">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-purple-600" />
          <span className="font-bold text-sm text-purple-900">
            Interactive Paint Palette
          </span>
        </div>
        <button
          type="button"
          onClick={handleMix}
          className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-1 active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" /> Mix Colours!
        </button>
      </div>

      <div className="flex items-center justify-center gap-3 my-3">
        <div className="flex flex-col items-center">
          <div
            className="w-12 h-12 rounded-2xl shadow-md border-2 border-white flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: color1 }}
          />
          <span className="text-xs font-bold mt-1 text-slate-700">{name1}</span>
        </div>

        <span className="text-xl font-black text-purple-800">+</span>

        <div className="flex flex-col items-center">
          <div
            className="w-12 h-12 rounded-2xl shadow-md border-2 border-white flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: color2 }}
          />
          <span className="text-xs font-bold mt-1 text-slate-700">{name2}</span>
        </div>

        <span className="text-xl font-black text-purple-800">=</span>

        <div className="flex flex-col items-center">
          <div
            className={`w-14 h-14 rounded-2xl shadow-md border-2 border-white flex items-center justify-center text-white text-xs font-bold transition-all duration-500 ${
              isMixed ? 'scale-110 ring-4 ring-purple-300' : 'opacity-40'
            }`}
            style={{ backgroundColor: isMixed ? resultColor : '#D1D5DB' }}
          >
            {isMixed && '✨'}
          </div>
          <span className="text-xs font-black mt-1 text-purple-900">
            {isMixed ? resultName : '???'}
          </span>
        </div>
      </div>
    </div>
  );
};

// 6. Phonics Tiles
const PhonicsTilesWidget: React.FC<{ data: any }> = ({ data }) => {
  const sounds: string[] = data?.sounds || ['t', 'r', 'ai', 'n'];
  const targetWord = data?.targetWord || 'train';

  const playPhoneme = (s: string) => {
    soundManager.speak(s, 'en', 1.0);
  };

  return (
    <div className="bg-indigo-50 border-2 border-indigo-300 rounded-2xl p-4 my-3 text-slate-800">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔤</span>
          <span className="font-bold text-sm text-indigo-900">
            Sound Buttons (Tap to sound out!)
          </span>
        </div>
        <button
          type="button"
          onClick={() => soundManager.speak(targetWord, 'en', 0.9)}
          className="text-xs font-bold text-indigo-700 bg-indigo-200 px-2.5 py-1 rounded-lg hover:bg-indigo-300"
        >
          🔊 Say Whole Word
        </button>
      </div>

      <div className="flex justify-center gap-3 my-3">
        {sounds.map((sound, i) => (
          <button
            key={i}
            type="button"
            onClick={() => playPhoneme(sound)}
            className="px-4 py-3 bg-white border-2 border-indigo-400 hover:border-indigo-600 rounded-2xl font-black text-lg text-indigo-900 shadow-[0_3px_0_#818cf8] active:translate-y-1 transition-all"
          >
            {sound}
            <div className="w-2 h-2 rounded-full bg-indigo-500 mx-auto mt-1" />
          </button>
        ))}
      </div>
    </div>
  );
};

// 7. Material Tester
const MaterialTesterWidget: React.FC<{ data: any }> = ({ data }) => {
  const [tested, setTested] = useState(false);
  const material = data?.material || 'glass';
  const property = data?.property || 'transparent';

  const testAction = () => {
    soundManager.playCorrect();
    setTested(true);
  };

  return (
    <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 my-3 text-slate-800">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-600" />
          <span className="font-bold text-sm text-emerald-900">
            Science Material Lab (Click to test property!)
          </span>
        </div>
        <button
          type="button"
          onClick={testAction}
          className="px-3 py-1 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm active:scale-95"
        >
          🧪 Test Material
        </button>
      </div>

      <div className="flex items-center justify-center gap-4 my-2 p-3 bg-white rounded-xl border border-emerald-200">
        <div className="text-center">
          <span className="text-2xl">{material === 'glass' ? '🪟' : '🧥'}</span>
          <p className="text-xs font-bold text-slate-600 capitalize">{material}</p>
        </div>
        <div className="text-lg">➡️</div>
        <div className="text-center">
          {property === 'transparent' ? (
            <div className="flex items-center gap-1 text-xs font-black text-amber-700 bg-amber-100 px-3 py-1.5 rounded-lg">
              <Sun className="w-4 h-4 text-amber-500 animate-spin" />
              {tested ? 'Light passes through! (Transparent)' : 'Ready to shine light'}
            </div>
          ) : (
            <div className="flex items-center gap-1 text-xs font-black text-blue-700 bg-blue-100 px-3 py-1.5 rounded-lg">
              <Droplets className="w-4 h-4 text-blue-500" />
              {tested ? 'Water rolls off! (Waterproof)' : 'Ready to test water'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 8. Compass Rose
const CompassWidget: React.FC = () => {
  return (
    <div className="bg-cyan-50 border-2 border-cyan-300 rounded-2xl p-4 my-3 text-slate-800 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-2 w-full">
        <Compass className="w-5 h-5 text-cyan-600" />
        <span className="font-bold text-sm text-cyan-900">Cardinal Compass Rose</span>
      </div>

      <div className="relative w-36 h-36 bg-white rounded-full border-4 border-cyan-500 shadow-md flex items-center justify-center my-1">
        <span className="absolute top-1 text-xs font-black text-red-600">N</span>
        <span className="absolute bottom-1 text-xs font-black text-slate-700">S</span>
        <span className="absolute right-2 text-xs font-black text-slate-700">E</span>
        <span className="absolute left-2 text-xs font-black text-slate-700">W</span>

        <div className="w-1.5 h-20 relative flex flex-col items-center">
          <div className="w-3 h-10 bg-red-600 shadow-sm" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
          <div className="w-3 h-10 bg-slate-800" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }} />
          <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-amber-400 rounded-full border-2 border-white" />
        </div>
      </div>
      <p className="text-xs text-cyan-900 font-bold mt-1">
        Never Eat Shredded Wheat (North, East, South, West)
      </p>
    </div>
  );
};

// Root dispatcher
export const InteractiveWidget: React.FC<{ question: Question }> = ({ question }) => {
  switch (question.interactiveType) {
    case 'cubes':
      return <CubesWidget key={question.id} data={question.interactiveData} />;
    case 'number-line':
      return <NumberLineWidget key={question.id} data={question.interactiveData} />;
    case 'clock':
      return <ClockWidget key={question.id} data={question.interactiveData} />;
    case 'fraction':
      return <FractionWidget key={question.id} data={question.interactiveData} />;
    case 'color-mixer':
      return <ColorMixerWidget key={question.id} data={question.interactiveData} />;
    case 'phonics-tiles':
      return <PhonicsTilesWidget key={question.id} data={question.interactiveData} />;
    case 'material-tester':
      return <MaterialTesterWidget key={question.id} data={question.interactiveData} />;
    case 'compass':
      return <CompassWidget key={question.id} />;
    default:
      return null;
  }
};
