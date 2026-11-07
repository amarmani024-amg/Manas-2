import React, { useState, useEffect } from 'react';
import { playWinkSound } from '../utils/audio';

interface AICoreProps {
  message: string;
  isThinking?: boolean;
  onEyeTap?: () => void;
  statusBadge?: string;
  mood?: 'curious' | 'delighted' | 'analytical' | 'reverent';
}

export const AICore: React.FC<AICoreProps> = ({
  message,
  isThinking = false,
  onEyeTap,
  statusBadge = 'NEURAL HANDSHAKE',
  mood = 'curious',
}) => {
  const [isWinking, setIsWinking] = useState(false);
  const [winkCount, setWinkCount] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Typewriter effect for dialogue
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let i = 0;
    const speed = Math.max(12, Math.min(28, 600 / (message.length || 1)));
    const timer = setInterval(() => {
      i++;
      setDisplayedText(message.slice(0, i));
      if (i >= message.length) {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [message]);

  const handleEyeClick = () => {
    setIsWinking(true);
    setWinkCount((prev) => prev + 1);
    playWinkSound();
    if (onEyeTap) {
      onEyeTap();
    }
    setTimeout(() => {
      setIsWinking(false);
    }, 700);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto mb-4 select-none">
      {/* Interactive AI Core / Eye */}
      <div className="relative group cursor-pointer mb-3" onClick={handleEyeClick}>
        {/* Pulsing Aura Rings */}
        <div
          className={`absolute -inset-4 rounded-full blur-xl transition-all duration-700 ${
            mood === 'reverent'
              ? 'bg-amber-400/25'
              : mood === 'delighted'
              ? 'bg-cyan-400/35'
              : 'bg-cyan-500/20'
          } ${isWinking ? 'scale-125 bg-amber-400/40' : 'group-hover:scale-110'}`}
        />

        {/* Outer Ring */}
        <div
          className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-[2px] transition-transform duration-300 ${
            isWinking ? 'scale-95' : 'active:scale-95'
          } ${
            mood === 'reverent'
              ? 'bg-gradient-to-tr from-amber-400 via-amber-200 to-cyan-400 shadow-[0_0_30px_rgba(255,215,0,0.4)]'
              : 'bg-gradient-to-tr from-cyan-500 via-sky-300 to-indigo-500 shadow-[0_0_25px_rgba(0,240,255,0.35)]'
          }`}
        >
          {/* Inner Core */}
          <div className="w-full h-full rounded-full bg-[#050B1F] flex items-center justify-center overflow-hidden relative border border-cyan-500/30">
            {/* Grid overlay */}
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  'radial-gradient(circle at center, rgba(0, 240, 255, 0.4) 1px, transparent 1px)',
                backgroundSize: '8px 8px',
              }}
            />

            {/* Glowing Pupil / Eye Aperture */}
            <div className="relative flex items-center justify-center">
              {/* Outer iris glow */}
              <div
                className={`w-12 h-12 rounded-full border border-cyan-300/60 flex items-center justify-center transition-all duration-300 ${
                  isWinking ? 'h-1 w-12 rounded-none border-t-2 border-b-0' : ''
                }`}
              >
                {!isWinking && (
                  <div
                    className={`w-6 h-6 rounded-full transition-transform duration-300 ${
                      mood === 'reverent'
                        ? 'bg-gradient-to-tr from-amber-400 to-yellow-200 shadow-[0_0_15px_#FFD700]'
                        : 'bg-gradient-to-tr from-cyan-400 to-sky-200 shadow-[0_0_15px_#00F0FF]'
                    } ${isThinking ? 'animate-ping scale-75' : 'animate-pulse'}`}
                  />
                )}
              </div>

              {/* Sparkle when winking */}
              {isWinking && (
                <span className="absolute -top-1 -right-2 text-xs font-bold text-amber-300 animate-bounce">
                  ✨
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Small subtle hint badge for eye easter egg */}
        <div className="text-[10px] text-cyan-400/60 text-center mt-1 font-mono tracking-wider opacity-80 group-hover:opacity-100 transition-opacity">
          [ TAP CORE ]
        </div>
      </div>

      {/* AI Speech Bubble */}
      <div className="w-full relative glass-panel rounded-2xl p-4 shadow-xl border border-cyan-400/20">
        {/* Status indicator bar */}
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono pb-2 mb-2 border-b border-cyan-900/40">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="tracking-wide text-cyan-300 font-medium">{statusBadge}</span>
          </div>
          <span className="text-[11px] text-slate-400">
            {isThinking ? 'COMPUTING...' : 'ONLINE'}
          </span>
        </div>

        {/* Dialogue Text */}
        <p className="text-slate-100 text-sm sm:text-base leading-relaxed font-sans">
          {displayedText}
          {isTyping && <span className="inline-block w-1.5 h-4 ml-0.5 bg-cyan-400 animate-pulse" />}
        </p>

        {winkCount > 0 && isWinking && (
          <p className="text-xs text-amber-300 font-mono mt-2 animate-fade-in">
            &gt; Attention weights recalibrated: 100% focused on you.
          </p>
        )}
      </div>
    </div>
  );
};
