import React, { useState, useEffect, useMemo } from 'react';
import { Lesson, Question } from '../types/game';
import { InteractiveWidget } from './InteractiveWidget';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Volume2, Lightbulb, CheckCircle2, XCircle, ArrowRight, Sparkles, X } from 'lucide-react';

interface QuestionModalProps {
  lesson: Lesson;
  barrierIndex: number;
  onCorrect: () => void;
  onClose: () => void;
  autoSpeak: boolean;
  languageMode: 'en' | 'bilingual';
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  lesson,
  barrierIndex,
  onCorrect,
  onClose,
  autoSpeak,
  languageMode
}) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const question: Question = lesson.questions[currentQIndex] || lesson.questions[0];

  // Shuffle options once per question so the correct answer isn't predictably 'A'
  const shuffledOptions = useMemo(() => {
    const list = [...question.options];
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }, [question.id]);

  // Read aloud helper
  const speakQuestion = () => {
    setIsSpeaking(true);
    soundManager.speak(
      `${question.question}. Options are: ${shuffledOptions.join(', ')}`,
      'en',
      0.95,
      () => setIsSpeaking(false)
    );
  };

  // Auto-speak on first display if enabled
  useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setShowHint(false);

    if (autoSpeak) {
      const timer = setTimeout(() => {
        speakQuestion();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [currentQIndex, question.id, autoSpeak]);

  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;

    soundManager.playPop();
    setSelectedOption(opt);
    setIsAnswered(true);

    const correct = opt === question.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      soundManager.playCorrect();

      // Confetti burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Voice praise
      soundManager.speak(
        `Brilliant! ${question.explanation}. Watch Mario leap over the pillar!`,
        'en',
        0.95
      );

      // Trigger leap and proceed
      setTimeout(() => {
        if (currentQIndex < lesson.questions.length - 1) {
          setCurrentQIndex(prev => prev + 1);
        } else {
          onCorrect();
        }
      }, 1400);
    } else {
      soundManager.playWrong();
      soundManager.speak(`Not quite. Try again! ${question.hint}`, 'en', 0.95);
    }
  };

  const handleRetry = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border-4 border-amber-400 overflow-hidden transform transition-all animate-pop">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-4 sm:px-6 flex items-center justify-between text-white shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-2xl shadow-inner">
              🚧
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-red-500 text-white text-[11px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Pillar {barrierIndex + 1}/10
                </span>
                <span className="text-amber-950 text-xs font-bold">
                  Q {currentQIndex + 1} of {lesson.questions.length}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-amber-950 leading-tight">
                {lesson.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={speakQuestion}
              className={`p-2 rounded-xl bg-white/30 hover:bg-white/40 text-amber-950 font-bold transition-all ${
                isSpeaking ? 'ring-4 ring-white animate-pulse' : ''
              }`}
              title="Read Question Aloud (British Voice)"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => {
                soundManager.stopSpeaking();
                onClose();
              }}
              className="p-2 rounded-xl bg-black/10 hover:bg-black/20 text-amber-950 font-bold transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Question Text */}
          <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-4 shadow-sm">
            <h3 className="text-base sm:text-lg font-black text-slate-800 leading-snug">
              {question.question}
            </h3>

            {/* Bilingual translation if enabled */}
            {languageMode === 'bilingual' && question.questionAr && (
              <p className="text-sm font-bold text-sky-800 mt-2 text-right dir-rtl font-arabic">
                {question.questionAr}
              </p>
            )}
          </div>

          {/* Interactive Widget (Cubes, Clock, Number line, Paint, etc.) */}
          <InteractiveWidget question={question} />

          {/* Hint Drawer */}
          {question.hint && (
            <div>
              {!showHint ? (
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playPop();
                    setShowHint(true);
                  }}
                  className="flex items-center gap-1.5 text-xs font-black text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl transition-all"
                >
                  <Lightbulb className="w-4 h-4 text-amber-500" /> Need a clue? Click here!
                </button>
              ) : (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3 text-xs sm:text-sm font-bold text-amber-950 flex items-start justify-between gap-2 animate-fadeIn">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <span>{question.hint}</span>
                      {languageMode === 'bilingual' && question.hintAr && (
                        <p className="text-amber-800 mt-1 text-right dir-rtl font-arabic text-xs">
                          {question.hintAr}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => soundManager.speak(question.hint, 'en', 0.95)}
                    className="p-1 text-amber-800 hover:text-amber-950 shrink-0"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {shuffledOptions.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isSelected = selectedOption === opt;
              const isTargetCorrect = opt === question.correctAnswer;

              let btnClass = 'card-option';
              if (isAnswered) {
                if (isTargetCorrect) {
                  btnClass += ' correct';
                } else if (isSelected && !isCorrect) {
                  btnClass += ' wrong';
                }
              }

              return (
                <button
                  key={`${question.id}-${opt}`}
                  type="button"
                  disabled={isAnswered && isCorrect}
                  onClick={() => handleSelectOption(opt)}
                  className={`${btnClass} p-3.5 sm:p-4 text-left flex items-center gap-3 w-full`}
                >
                  <span className="w-9 h-9 rounded-xl bg-slate-100 font-black text-slate-700 flex items-center justify-center shrink-0 border border-slate-200 text-sm">
                    {letter}
                  </span>
                  <span className="text-slate-800 font-bold text-sm sm:text-base flex-1">
                    {opt}
                  </span>
                  {isAnswered && isTargetCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback Banner */}
          {isAnswered && (
            <div
              className={`p-4 rounded-2xl border-2 flex items-start gap-3 animate-fadeIn ${
                isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-red-50 border-red-300 text-red-950'
              }`}
            >
              {isCorrect ? (
                <>
                  <Sparkles className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-black text-emerald-800 text-sm">
                      🌟 Excellent! Vaulting over the pillar!
                    </h4>
                    <p className="text-xs font-semibold text-emerald-900 mt-1">
                      {question.explanation}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-black text-red-800 text-sm">
                      Not quite yet! Let’s learn and try again:
                    </h4>
                    <p className="text-xs font-semibold text-red-900 mt-1">
                      {question.explanation}
                    </p>
                    <button
                      type="button"
                      onClick={handleRetry}
                      className="mt-2.5 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black shadow-sm"
                    >
                      🔄 Try Again
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:px-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-bold">
          <span>🎯 Real UK National Curriculum Year 2</span>
          <span>⭐ Clears Pillar + Awards Star</span>
        </div>
      </div>
    </div>
  );
};
