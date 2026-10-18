import { GameState } from '../types/game';

const STORAGE_KEY = 'mario_parkour_y2_state_v10';

export const DEFAULT_GAME_STATE: GameState = {
  profile: {
    name: 'Champion',
    character: 'mario',
    level: 1,
    xp: 0,
    coins: 50,
    stars: 0,
    equippedVehicle: 'walk',
    unlockedVehicles: ['walk'],
    currentSubject: 'MAT',
    currentUnitId: 'MAT-U1'
  },
  progress: {
    lessonsCompleted: {},
    unitsCompleted: {},
    subjectsCompleted: {},
    questionsAnswered: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    streak: 0,
    highScore: 0
  },
  settings: {
    soundEnabled: true,
    voiceEnabled: true,
    voiceRate: 0.95,
    language: 'bilingual',
    musicVolume: 0.5,
    sfxVolume: 0.8
  }
};

export function loadSavedGameState(): GameState {
  if (typeof window === 'undefined') return DEFAULT_GAME_STATE;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Check legacy key if exists
      const legacyRaw = localStorage.getItem('ykk_mario_v9');
      if (legacyRaw) {
        try {
          const parsed = JSON.parse(legacyRaw);
          if (parsed && parsed.state && parsed.state.profile) {
            return {
              profile: {
                ...DEFAULT_GAME_STATE.profile,
                name: parsed.state.profile.name || 'Champion',
                xp: parsed.state.profile.xp || 0,
                coins: parsed.state.profile.coins || 50,
                stars: parsed.state.profile.stars || 0,
                level: parsed.state.profile.level || 1,
                currentSubject: parsed.state.profile.currentSubject || 'MAT',
                currentUnitId: `${parsed.state.profile.currentSubject || 'MAT'}-U1`
              },
              progress: {
                ...DEFAULT_GAME_STATE.progress,
                lessonsCompleted: parsed.state.progress?.lessonsCompleted || {},
                unitsCompleted: parsed.state.progress?.unitsCompleted || {},
                correctAnswers: parsed.state.progress?.correct || 0,
                wrongAnswers: parsed.state.progress?.wrong || 0
              },
              settings: DEFAULT_GAME_STATE.settings
            };
          }
        } catch (e) {}
      }
      return DEFAULT_GAME_STATE;
    }

    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.profile || !parsed.progress) {
      return DEFAULT_GAME_STATE;
    }

    return {
      profile: {
        ...DEFAULT_GAME_STATE.profile,
        ...parsed.profile,
        unlockedVehicles: Array.isArray(parsed.profile.unlockedVehicles)
          ? parsed.profile.unlockedVehicles
          : ['walk']
      },
      progress: {
        ...DEFAULT_GAME_STATE.progress,
        ...parsed.progress,
        lessonsCompleted: parsed.progress.lessonsCompleted || {},
        unitsCompleted: parsed.progress.unitsCompleted || {}
      },
      settings: {
        ...DEFAULT_GAME_STATE.settings,
        ...(parsed.settings || {})
      }
    };
  } catch (error) {
    console.warn('Failed to load saved state from localStorage:', error);
    return DEFAULT_GAME_STATE;
  }
}

export function saveGameStateToStorage(state: GameState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to save state to localStorage:', error);
  }
}
