export type GameStage = 'intro' | 'game1' | 'game2' | 'game3' | 'finale';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt?: number;
  iconName: string;
}

export interface AppState {
  hasStarted: boolean;
  currentStage: GameStage;
  completedGames: {
    game1: boolean;
    game2: boolean;
    game3: boolean;
  };
  achievements: string[]; // achievement IDs
  easterEggs: {
    helloTyped: boolean;
    secretKeyPressed: boolean;
    eyeTapped: boolean;
  };
  devModeUnlocked: boolean;
  soundEnabled: boolean;
  typingWpm: number;
}
