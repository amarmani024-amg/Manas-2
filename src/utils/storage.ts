import { AppState } from '../types';

const STORAGE_KEY = 'ai_awakening_save_v1';

export const INITIAL_STATE: AppState = {
  hasStarted: false,
  currentStage: 'intro',
  completedGames: {
    game1: false,
    game2: false,
    game3: false,
  },
  achievements: [],
  easterEggs: {
    helloTyped: false,
    secretKeyPressed: false,
    eyeTapped: false,
  },
  devModeUnlocked: false,
  soundEnabled: true,
  typingWpm: 0,
};

export function loadSavedState(): AppState {
  if (typeof window === 'undefined') return INITIAL_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_STATE,
      ...parsed,
      completedGames: {
        ...INITIAL_STATE.completedGames,
        ...(parsed.completedGames || {}),
      },
      easterEggs: {
        ...INITIAL_STATE.easterEggs,
        ...(parsed.easterEggs || {}),
      },
    };
  } catch {
    return INITIAL_STATE;
  }
}

export function saveState(state: AppState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota or disabled storage
  }
}

export function clearSavedState(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}
