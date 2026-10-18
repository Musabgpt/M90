/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GameState, SubjectCode, CharacterId, Unit, Lesson } from './types/game';
import { loadSavedGameState, saveGameStateToStorage } from './utils/storage';
import { getSubjectByCode } from './data/curriculum';
import { VEHICLES } from './data/characters';
import { MarioCanvas, Barrier } from './components/MarioCanvas';
import { GameHUD } from './components/GameHUD';
import { QuestionModal } from './components/QuestionModal';
import { MapModal } from './components/MapModal';
import { GarageModal } from './components/GarageModal';
import { SubjectSelectScreen } from './components/SubjectSelectScreen';
import { UnitClearModal } from './components/UnitClearModal';
import { TrophyRoomModal } from './components/TrophyRoomModal';
import { soundManager } from './utils/audio';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => loadSavedGameState());
  const [showSubjectSelect, setShowSubjectSelect] = useState<boolean>(false);
  const [showMapModal, setShowMapModal] = useState<boolean>(false);
  const [showGarageModal, setShowGarageModal] = useState<boolean>(false);
  const [showTrophyModal, setShowTrophyModal] = useState<boolean>(false);
  const [activeBarrier, setActiveBarrier] = useState<Barrier | null>(null);
  const [clearedUnitReward, setClearedUnitReward] = useState<{ unit: Unit; vehicleId?: string } | null>(null);

  // Ref to trigger the Mario Super Vault leap from outside the canvas
  const activeJumpTriggerRef = useRef<(() => void) | null>(null);

  // Synchronize state with audio manager
  useEffect(() => {
    soundManager.setSoundEnabled(gameState.settings.soundEnabled);
    soundManager.setVoiceEnabled(gameState.settings.voiceEnabled);
  }, [gameState.settings.soundEnabled, gameState.settings.voiceEnabled]);

  // Save game state whenever it updates
  useEffect(() => {
    saveGameStateToStorage(gameState);
  }, [gameState]);

  // Find active subject and active unit
  const activeSubjectData = useMemo(() => {
    return getSubjectByCode(gameState.profile.currentSubject);
  }, [gameState.profile.currentSubject]);

  const activeUnit = useMemo(() => {
    return (
      activeSubjectData.units.find(u => u.id === gameState.profile.currentUnitId) ||
      activeSubjectData.units[0]
    );
  }, [activeSubjectData, gameState.profile.currentUnitId]);

  // Construct barriers along the course for the active unit
  const barriers: Barrier[] = useMemo(() => {
    let xPos = 420;
    const list: Barrier[] = [];

    // Ensure 10 barriers per unit (standard KS1 unit format)
    const lessons = activeUnit.lessons;
    lessons.forEach((lesson: Lesson, idx: number) => {
      const isCleared = !!gameState.progress.lessonsCompleted[lesson.id];
      list.push({
        id: `barrier-${lesson.id}`,
        x: xPos,
        w: 64,
        h: 90, // Solid high pillar
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        unitId: activeUnit.id,
        barrierIndex: idx,
        cleared: isCleared,
        hasStar: !isCleared,
        starCollected: isCleared,
        questionBlockY: 0
      });
      xPos += 520; // Room to run and jump between obstacles
    });

    return list;
  }, [activeUnit, gameState.progress.lessonsCompleted]);

  // Handle player encountering or tapping a barrier
  const handleEncounterBarrier = (barrier: Barrier) => {
    if (barrier.cleared) return;
    setActiveBarrier(barrier);
  };

  // Find active lesson object when barrier challenge is active
  const activeLesson = useMemo(() => {
    if (!activeBarrier) return null;
    return activeUnit.lessons.find(l => l.id === activeBarrier.lessonId) || null;
  }, [activeBarrier, activeUnit]);

  // Handle answering question correctly
  const handleQuestionCorrect = () => {
    if (!activeBarrier || !activeLesson) return;

    // 1. Trigger the epic Super Vault Leap!
    if (activeJumpTriggerRef.current) {
      activeJumpTriggerRef.current();
    }

    // 2. Mark lesson as cleared and update game state
    const lessonId = activeLesson.id;
    const unitId = activeUnit.id;

    setGameState(prev => {
      const isFirstTime = !prev.progress.lessonsCompleted[lessonId];
      const newXp = prev.profile.xp + (isFirstTime ? activeLesson.xp : 5);
      const newCoins = prev.profile.coins + (isFirstTime ? activeLesson.coins : 2);
      const newStars = prev.profile.stars + (isFirstTime ? 1 : 0);
      const newLevel = Math.floor(newXp / 100) + 1;

      const newLessonsCompleted = {
        ...prev.progress.lessonsCompleted,
        [lessonId]: true
      };

      // Check if all lessons in current unit are cleared
      const allLessonsInUnitCleared = activeUnit.lessons.every(
        l => newLessonsCompleted[l.id]
      );

      const newUnitsCompleted = {
        ...prev.progress.unitsCompleted,
        ...(allLessonsInUnitCleared ? { [unitId]: true } : {})
      };

      // Check if a new vehicle should be unlocked
      const totalUnitsCleared = Object.keys(newUnitsCompleted).length;
      const newlyUnlockedVehicles = [...prev.profile.unlockedVehicles];

      VEHICLES.forEach(v => {
        if (
          totalUnitsCleared >= v.unlockUnitReq &&
          !newlyUnlockedVehicles.includes(v.id)
        ) {
          newlyUnlockedVehicles.push(v.id);
        }
      });

      return {
        ...prev,
        profile: {
          ...prev.profile,
          xp: newXp,
          coins: newCoins,
          stars: newStars,
          level: newLevel,
          unlockedVehicles: newlyUnlockedVehicles
        },
        progress: {
          ...prev.progress,
          lessonsCompleted: newLessonsCompleted,
          unitsCompleted: newUnitsCompleted,
          questionsAnswered: prev.progress.questionsAnswered + 1,
          correctAnswers: prev.progress.correctAnswers + 1,
          streak: prev.progress.streak + 1,
          highScore: Math.max(prev.progress.highScore, prev.progress.streak + 1)
        }
      };
    });

    // Close the question modal so the player can watch the vault
    setActiveBarrier(null);

    // Check if entire unit is now cleared to show celebratory trophy
    const isUnitCompleteNow = activeUnit.lessons.every(
      l => gameState.progress.lessonsCompleted[l.id] || l.id === lessonId
    );

    if (isUnitCompleteNow && !gameState.progress.unitsCompleted[activeUnit.id]) {
      // Find unlocked vehicle for this unit
      const unitIndex = activeUnit.number;
      const vehicleReward = VEHICLES[unitIndex];

      setTimeout(() => {
        setClearedUnitReward({
          unit: activeUnit,
          vehicleId: vehicleReward?.id
        });
      }, 1200);
    }
  };

  // Handle switching subjects cleanly (fixes Issue #1: MAT-U1 hardcoding!)
  const handleSelectSubject = (code: SubjectCode) => {
    const subjData = getSubjectByCode(code);
    const firstUnitId = subjData.units[0]?.id || `${code}-U1`;

    setGameState(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        currentSubject: code,
        currentUnitId: firstUnitId
      }
    }));
  };

  const handleSelectUnit = (unitId: string) => {
    setGameState(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        currentUnitId: unitId
      }
    }));
  };

  const handleStartFromWelcome = (
    subject: SubjectCode,
    name: string,
    character: CharacterId
  ) => {
    const subjData = getSubjectByCode(subject);
    const firstUnitId = subjData.units[0]?.id || `${subject}-U1`;

    setGameState(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        name,
        character,
        currentSubject: subject,
        currentUnitId: firstUnitId
      }
    }));

    setShowSubjectSelect(false);
  };

  const clearedBarriersInUnit = activeUnit.lessons.filter(
    l => gameState.progress.lessonsCompleted[l.id]
  ).length;

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-sky-400">
      {/* 2D Canvas Engine with Parallax, Sprites, and Vaulting Mario */}
      <MarioCanvas
        characterId={gameState.profile.character}
        vehicleId={gameState.profile.equippedVehicle}
        subjectCode={gameState.profile.currentSubject}
        streak={gameState.progress.streak}
        barriers={barriers}
        onEncounterBarrier={handleEncounterBarrier}
        onCollectCoin={() => {
          setGameState(prev => ({
            ...prev,
            profile: { ...prev.profile, coins: prev.profile.coins + 1 }
          }));
        }}
        onStompCritter={() => {
          setGameState(prev => {
            const newXp = prev.profile.xp + 10;
            return {
              ...prev,
              profile: {
                ...prev.profile,
                xp: newXp,
                level: Math.floor(newXp / 100) + 1
              }
            };
          });
        }}
        isPaused={!!activeBarrier || showMapModal || showGarageModal || showSubjectSelect || showTrophyModal || !!clearedUnitReward}
        activeJumpTriggerRef={activeJumpTriggerRef}
      />

      {/* Top HUD Card */}
      <GameHUD
        profile={gameState.profile}
        progress={gameState.progress}
        settings={gameState.settings}
        currentUnitTitle={`Unit ${activeUnit.number}: ${activeUnit.title}`}
        clearedBarriersInUnit={clearedBarriersInUnit}
        totalBarriersInUnit={activeUnit.lessons.length}
        onOpenMap={() => {
          soundManager.playPop();
          setShowMapModal(true);
        }}
        onOpenGarage={() => {
          soundManager.playPop();
          setShowGarageModal(true);
        }}
        onOpenSubjects={() => {
          soundManager.playPop();
          setShowSubjectSelect(true);
        }}
        onOpenTrophyRoom={() => {
          soundManager.playPop();
          setShowTrophyModal(true);
        }}
        onToggleSound={() => {
          setGameState(prev => ({
            ...prev,
            settings: { ...prev.settings, soundEnabled: !prev.settings.soundEnabled }
          }));
        }}
        onToggleVoice={() => {
          setGameState(prev => ({
            ...prev,
            settings: { ...prev.settings, voiceEnabled: !prev.settings.voiceEnabled }
          }));
        }}
        onToggleLanguage={() => {
          soundManager.playPop();
          setGameState(prev => ({
            ...prev,
            settings: {
              ...prev.settings,
              language: prev.settings.language === 'bilingual' ? 'en' : 'bilingual'
            }
          }));
        }}
      />

      {/* Interactive Question Challenge Modal */}
      {activeBarrier && activeLesson && (
        <QuestionModal
          lesson={activeLesson}
          barrierIndex={activeBarrier.barrierIndex}
          onCorrect={handleQuestionCorrect}
          onClose={() => setActiveBarrier(null)}
          autoSpeak={gameState.settings.voiceEnabled}
          languageMode={gameState.settings.language}
        />
      )}

      {/* World Map Modal */}
      {showMapModal && (
        <MapModal
          currentSubject={gameState.profile.currentSubject}
          currentUnitId={gameState.profile.currentUnitId}
          completedLessons={gameState.progress.lessonsCompleted}
          completedUnits={gameState.progress.unitsCompleted}
          onSelectSubject={handleSelectSubject}
          onSelectUnit={handleSelectUnit}
          onClose={() => setShowMapModal(false)}
        />
      )}

      {/* Garage (Character & Vehicle) Modal */}
      {showGarageModal && (
        <GarageModal
          currentCharacter={gameState.profile.character}
          currentVehicle={gameState.profile.equippedVehicle}
          unlockedVehicles={gameState.profile.unlockedVehicles}
          totalUnitsCompleted={Object.keys(gameState.progress.unitsCompleted).length}
          onSelectCharacter={(charId: CharacterId) => {
            setGameState(prev => ({
              ...prev,
              profile: { ...prev.profile, character: charId }
            }));
          }}
          onSelectVehicle={(vehId: string) => {
            setGameState(prev => ({
              ...prev,
              profile: { ...prev.profile, equippedVehicle: vehId }
            }));
          }}
          onClose={() => setShowGarageModal(false)}
        />
      )}

      {/* Trophy Room & Achievements Modal */}
      {showTrophyModal && (
        <TrophyRoomModal
          profile={gameState.profile}
          progress={gameState.progress}
          onBonusCoinsEarned={(earned: number) => {
            setGameState(prev => ({
              ...prev,
              profile: { ...prev.profile, coins: prev.profile.coins + earned }
            }));
          }}
          onClose={() => setShowTrophyModal(false)}
        />
      )}

      {/* Subject & Character Select Screen (Welcome & Change) */}
      {showSubjectSelect && (
        <SubjectSelectScreen
          initialName={gameState.profile.name}
          initialCharacter={gameState.profile.character}
          completedLessons={gameState.progress.lessonsCompleted}
          onStartGame={handleStartFromWelcome}
        />
      )}

      {/* Unit Clear Celebration Modal */}
      {clearedUnitReward && (
        <UnitClearModal
          unit={clearedUnitReward.unit}
          unlockedVehicle={
            clearedUnitReward.vehicleId
              ? VEHICLES.find(v => v.id === clearedUnitReward.vehicleId)
              : undefined
          }
          onEquipAndContinue={(vehId?: string) => {
            if (vehId) {
              setGameState(prev => ({
                ...prev,
                profile: { ...prev.profile, equippedVehicle: vehId }
              }));
            }
            setClearedUnitReward(null);
            setShowMapModal(true); // Open map to choose next course
          }}
        />
      )}
    </div>
  );
}
