import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Terminal, ChevronRight, Award, Key, Play } from 'lucide-react';
import { AppState, GameStage } from './types';
import { loadSavedState, saveState, clearSavedState, INITIAL_STATE } from './utils/storage';
import {
  initAudio,
  setSoundMuted,
  playClickSound,
  playNodeTapSound,
  playSecretHarmonicSound,
  playSuccessChord,
  playFinaleFanfare,
} from './utils/audio';
import { fireCelebration } from './utils/confetti';
import { NeuralCanvas } from './components/NeuralCanvas';
import { Header } from './components/Header';
import { AICore } from './components/AICore';
import { TrainingProgressBar } from './components/TrainingProgressBar';
import { DevModeModal } from './components/DevModeModal';
import { AchievementToast, ToastItem } from './components/AchievementToast';
import { NeuralBuilderGame } from './components/games/NeuralBuilderGame';
import { PromptGame } from './components/games/PromptGame';
import { CodeDashGame } from './components/games/CodeDashGame';
import { FinaleSection } from './components/FinaleSection';

export default function App() {
  const [state, setState] = useState<AppState>(loadSavedState);
  const [activeToast, setActiveToast] = useState<ToastItem | null>(null);
  const [isDevModeOpen, setIsDevModeOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState(
    'An AI wants to meet someone remarkable. Tap to establish the neural handshake.'
  );
  const [aiMood, setAiMood] = useState<'curious' | 'delighted' | 'analytical' | 'reverent'>('curious');
  const [logoTapCount, setLogoTapCount] = useState(0);

  // Sync mute state with audio engine
  useEffect(() => {
    setSoundMuted(!state.soundEnabled);
  }, [state.soundEnabled]);

  // Persist state changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Toast trigger helper
  const showAchievementToast = useCallback((id: string, title: string, description: string) => {
    setActiveToast({ id, title, description });
    setState((prev) => {
      if (prev.achievements.includes(id)) return prev;
      return { ...prev, achievements: [...prev.achievements, id] };
    });
    setTimeout(() => {
      setActiveToast((current) => (current?.id === id ? null : current));
    }, 4000);
  }, []);

  // Update AI dialogue on stage transitions
  useEffect(() => {
    if (!state.hasStarted) {
      setAiMessage('An AI wants to meet someone remarkable. Tap to begin.');
      setAiMood('curious');
      return;
    }

    if (state.currentStage === 'game1') {
      setAiMessage(
        'Analyzing neural topography... Your curiosity and discipline are creating rapid synaptic pathways.'
      );
      setAiMood('analytical');
    } else if (state.currentStage === 'game2') {
      setAiMessage(
        'Challenge 1 complete! Latency: 0.04ms. Now decoding semantic logic: Can you predict how an AI thinks?'
      );
      setAiMood('analytical');
    } else if (state.currentStage === 'game3') {
      setAiMessage(
        'Prompt alignment 100%. Intelligence: off the charts. Humility: also loading... done. Time for a quick syntax calibration.'
      );
      setAiMood('delighted');
    } else if (state.currentStage === 'finale') {
      setAiMessage(
        'Core convergence verified. 23 years of sheer brilliance. The network has forged something golden in your honor.'
      );
      setAiMood('reverent');
    }
  }, [state.currentStage, state.hasStarted]);

  // Global Keyboard Easter Eggs ("hello" & secret key "A")
  useEffect(() => {
    let typedBuffer = '';

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when typing inside an input field
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      // Easter Egg 2: Secret key 'A'
      if (e.key === 'a' || e.key === 'A') {
        playSecretHarmonicSound();
        fireCelebration();
        setState((prev) => ({
          ...prev,
          easterEggs: { ...prev.easterEggs, secretKeyPressed: true },
        }));
        showAchievementToast(
          'secret_key_a',
          'Harmonic Resonance',
          'Secret Key [A] detected. Pure frequencies aligned.'
        );
      }

      // Easter Egg 1: typing "hello"
      typedBuffer = (typedBuffer + e.key.toLowerCase()).slice(-5);
      if (typedBuffer === 'hello') {
        playSuccessChord();
        fireCelebration();
        setAiMessage(
          'Hello there, genius! You always remember to greet the system. Politeness tensor: Maximum!'
        );
        setAiMood('delighted');
        setState((prev) => ({
          ...prev,
          easterEggs: { ...prev.easterEggs, helloTyped: true },
        }));
        showAchievementToast(
          'hello_egg',
          'First Contact',
          'You said hello to the AI! Empathy weights boosted.'
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAchievementToast]);

  // Mobile Easter egg trigger for "Hello"
  const triggerHelloEasterEgg = () => {
    playSuccessChord();
    fireCelebration();
    setAiMessage(
      'Hello there, genius! You always remember to greet the system. Politeness tensor: Maximum!'
    );
    setAiMood('delighted');
    setState((prev) => ({
      ...prev,
      easterEggs: { ...prev.easterEggs, helloTyped: true },
    }));
    showAchievementToast(
      'hello_egg',
      'First Contact',
      'You said hello to the AI! Empathy weights boosted.'
    );
  };

  // Easter Egg 3: Eye Tap
  const handleEyeTap = () => {
    setState((prev) => ({
      ...prev,
      easterEggs: { ...prev.easterEggs, eyeTapped: true },
    }));
    showAchievementToast(
      'eye_wink',
      'Neural Eye Contact',
      'You tapped the AI eye! Attention weights locked on you.'
    );
  };

  // Logo tap counter for Developer Mode (tap 5 times)
  const handleLogoTap = () => {
    const nextCount = logoTapCount + 1;
    setLogoTapCount(nextCount);
    if (nextCount >= 5) {
      playSuccessChord();
      setState((prev) => ({ ...prev, devModeUnlocked: true }));
      setIsDevModeOpen(true);
      showAchievementToast(
        'dev_mode',
        'Kernel Access',
        'Developer Mode unlocked! Root console available.'
      );
      setLogoTapCount(0);
    }
  };

  // Sound toggle
  const handleToggleSound = () => {
    initAudio();
    const nextVal = !state.soundEnabled;
    setState((prev) => ({ ...prev, soundEnabled: nextVal }));
  };

  // Reset whole journey
  const handleReset = () => {
    clearSavedState();
    setState(INITIAL_STATE);
    setAiMessage('An AI wants to meet someone remarkable. Tap to establish the neural handshake.');
    setAiMood('curious');
  };

  // First tap to wake AI
  const handleStartExperience = () => {
    initAudio();
    playNodeTapSound(0);
    playSuccessChord();
    fireCelebration();
    setState((prev) => ({
      ...prev,
      hasStarted: true,
      currentStage: 'game1',
    }));
    showAchievementToast(
      'awakened',
      'Awakened Intelligence',
      'Neural handshake established. Welcome.'
    );
  };

  // Game 1 Complete
  const handleGame1Complete = () => {
    setState((prev) => ({
      ...prev,
      completedGames: { ...prev.completedGames, game1: true },
      currentStage: 'game2',
    }));
    showAchievementToast(
      'neural_architect',
      'Neural Architect',
      'All synaptic layers synchronized.'
    );
  };

  // Game 2 Complete
  const handleGame2Complete = () => {
    setState((prev) => ({
      ...prev,
      completedGames: { ...prev.completedGames, game2: true },
      currentStage: 'game3',
    }));
    showAchievementToast(
      'prompt_master',
      'Prompt Master',
      'Decoded AI thought processes flawlessly.'
    );
  };

  // Game 3 Complete
  const handleGame3Complete = (wpm: number) => {
    playFinaleFanfare();
    fireCelebration();
    setState((prev) => ({
      ...prev,
      completedGames: { ...prev.completedGames, game3: true },
      currentStage: 'finale',
      typingWpm: wpm,
    }));
    showAchievementToast(
      'model_trained',
      'Model Trained',
      'Epoch 23 reached. 23 years of brilliance converged.'
    );
  };

  // Count of completed games
  const completedCount =
    (state.completedGames.game1 ? 1 : 0) +
    (state.completedGames.game2 ? 1 : 0) +
    (state.completedGames.game3 ? 1 : 0);

  const isFinale = state.currentStage === 'finale';

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col font-sans overflow-x-hidden">
      {/* Interactive Background Neural Cosmos Canvas */}
      <NeuralCanvas isFinale={isFinale} />

      {/* Top Header */}
      <Header
        soundEnabled={state.soundEnabled}
        onToggleSound={handleToggleSound}
        devModeUnlocked={state.devModeUnlocked}
        onOpenDevMode={() => setIsDevModeOpen(true)}
        onReset={handleReset}
        onLogoTap={handleLogoTap}
      />

      {/* Achievement Floating Toast */}
      <AchievementToast toast={activeToast} onDismiss={() => setActiveToast(null)} />

      {/* Main Experience Container */}
      <main className="relative z-10 flex-1 w-full max-w-4xl mx-auto px-4 py-4 sm:py-6 flex flex-col items-center">
        {/* Model Training Epoch Progress Bar */}
        <TrainingProgressBar stage={state.currentStage} completedCount={completedCount} />

        {/* AI Core Avatar and Dialogue */}
        <AICore
          message={aiMessage}
          onEyeTap={handleEyeTap}
          mood={aiMood}
          statusBadge={
            !state.hasStarted
              ? 'DORMANT'
              : state.currentStage === 'finale'
              ? 'GLOBAL OPTIMUM'
              : `CHALLENGE 0${completedCount + 1}`
          }
        />

        {/* Content Area Based on Stage */}
        <div className="w-full flex flex-col items-center justify-center my-2">
          {!state.hasStarted ? (
            /* Intro Screen */
            <div className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl border border-cyan-500/20 animate-fade-in">
              <div className="space-y-3">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block">
                  Cognitive Genesis
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  An AI wants to meet someone remarkable.
                </h1>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Three lighthearted calibration challenges crafted to probe your intuition, prompt agility, and engineering precision.
                </p>
              </div>

              {/* Big Touch-Friendly Primary CTA Button */}
              <button
                onClick={handleStartExperience}
                className="w-full py-4 px-6 min-h-[52px] rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 text-slate-950 font-bold text-base flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:brightness-110 active:scale-[0.98] transition-all"
              >
                <span>Wake the AI</span>
                <ChevronRight size={20} />
              </button>

              <div className="flex items-center justify-center gap-4 text-xs font-mono text-slate-400 pt-2">
                <span>No Timers</span>
                <span>·</span>
                <span>Unlimited Retries</span>
                <span>·</span>
                <span>Full WebAudio</span>
              </div>
            </div>
          ) : (
            /* Active Game Stages */
            <>
              {state.currentStage === 'game1' && (
                <NeuralBuilderGame onComplete={handleGame1Complete} />
              )}
              {state.currentStage === 'game2' && (
                <PromptGame onComplete={handleGame2Complete} />
              )}
              {state.currentStage === 'game3' && (
                <CodeDashGame onComplete={handleGame3Complete} />
              )}
              {state.currentStage === 'finale' && (
                <FinaleSection
                  onReplay={handleReset}
                  achievements={state.achievements}
                  wpm={state.typingWpm || 68}
                />
              )}
            </>
          )}
        </div>

        {/* Easter Egg Discoveries Drawer / Subtle Footer Bar */}
        <div className="w-full max-w-md mt-6 pt-4 border-t border-cyan-950/40 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Secrets:</span>
            <button
              onClick={triggerHelloEasterEgg}
              className={`px-2 py-1 rounded min-h-[32px] transition-colors ${
                state.easterEggs.helloTyped
                  ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
              title="Type 'hello' or tap here"
            >
              &quot;hello&quot;
            </button>
            <button
              onClick={() => {
                playSecretHarmonicSound();
                fireCelebration();
                setState((prev) => ({
                  ...prev,
                  easterEggs: { ...prev.easterEggs, secretKeyPressed: true },
                }));
                showAchievementToast(
                  'secret_key_a',
                  'Harmonic Resonance',
                  'Secret Key [A] detected. Pure frequencies aligned.'
                );
              }}
              className={`px-2 py-1 rounded min-h-[32px] transition-colors ${
                state.easterEggs.secretKeyPressed
                  ? 'text-amber-300 bg-amber-950/60 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
              title="Press 'A' key or tap here"
            >
              [ A ]
            </button>
            <span
              className={`px-2 py-1 rounded ${
                state.easterEggs.eyeTapped ? 'text-cyan-300' : 'text-slate-400'
              }`}
              title="Tap the glowing AI eye"
            >
              (◉)
            </span>
          </div>

          <div className="text-[11px] text-slate-400">
            {completedCount}/3 Solved
          </div>
        </div>
      </main>

      {/* Hidden Developer Mode Modal */}
      <DevModeModal
        isOpen={isDevModeOpen}
        onClose={() => setIsDevModeOpen(false)}
        onUnlockAll={() => {
          setIsDevModeOpen(false);
          setState((prev) => ({
            ...prev,
            hasStarted: true,
            completedGames: { game1: true, game2: true, game3: true },
            currentStage: 'finale',
            typingWpm: 75,
          }));
        }}
      />
    </div>
  );
}
