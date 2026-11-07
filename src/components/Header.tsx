import React, { useState } from 'react';
import { Volume2, VolumeX, Terminal, RotateCcw } from 'lucide-react';
import { playClickSound, setSoundMuted } from '../utils/audio';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  devModeUnlocked: boolean;
  onOpenDevMode: () => void;
  onReset: () => void;
  onLogoTap: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  devModeUnlocked,
  onOpenDevMode,
  onReset,
  onLogoTap,
}) => {
  const [tapCounter, setTapCounter] = useState(0);

  const handleTitleClick = () => {
    playClickSound();
    const next = tapCounter + 1;
    setTapCounter(next);
    onLogoTap();
  };

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-[#050B1F]/80 border-b border-cyan-950/60 px-4 py-2.5 transition-all">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark (Tap 5 times for Developer Mode easter egg) */}
        <div
          onClick={handleTitleClick}
          className="flex items-center gap-2 cursor-pointer select-none group"
          title="Tap 5 times to unlock Developer Mode"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center p-0.5 shadow-[0_0_10px_rgba(0,240,255,0.3)] group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-md bg-[#050B1F] flex items-center justify-center text-cyan-400 font-mono font-bold text-xs">
              AI
            </div>
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-slate-100 whitespace-nowrap group-hover:text-cyan-300 transition-colors">
            AI Awakening
          </span>
        </div>

        {/* Zone 2: Discreet Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Dev Mode Trigger */}
          {devModeUnlocked && (
            <button
              onClick={() => {
                playClickSound();
                onOpenDevMode();
              }}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-cyan-400 hover:bg-cyan-950/50 transition-colors"
              title="Developer Console"
              aria-label="Developer Console"
            >
              <Terminal size={18} />
            </button>
          )}

          {/* Sound Toggle Button */}
          <button
            onClick={() => {
              playClickSound();
              onToggleSound();
            }}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-cyan-950/40 transition-colors"
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            aria-label={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 size={19} className="text-cyan-400" /> : <VolumeX size={19} className="text-slate-500" />}
          </button>

          {/* Reset Experience Button */}
          <button
            onClick={() => {
              playClickSound();
              onReset();
            }}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
            title="Reset Progress"
            aria-label="Reset Progress"
          >
            <RotateCcw size={17} />
          </button>
        </div>
      </div>
    </header>
  );
};
