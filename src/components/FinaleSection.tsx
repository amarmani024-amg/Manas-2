import React, { useState } from 'react';
import { Award, Copy, Check, RotateCcw, Sparkles, HeartHandshake, Shield, BrainCircuit } from 'lucide-react';
import { playClickSound, playFinaleFanfare } from '../utils/audio';
import { fireCelebration } from '../utils/confetti';

interface FinaleSectionProps {
  onReplay: () => void;
  achievements: string[];
  wpm: number;
}

export const FinaleSection: React.FC<FinaleSectionProps> = ({ onReplay, achievements, wpm }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    playClickSound();
    navigator.clipboard.writeText('NEURALKING').then(() => {
      setCopied(true);
      fireCelebration();
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleCelebrateAgain = () => {
    playFinaleFanfare();
    fireCelebration();
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Golden Constellation Callout */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs font-mono tracking-wider uppercase">
          <Sparkles size={14} /> Synaptic Convergence Complete
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-100 tracking-tight">
          The Network Assembles
        </h2>
        <p className="text-xs sm:text-sm text-cyan-200/80 max-w-md mx-auto">
          Look up — the constellation has forged a glowing golden &ldquo;A&rdquo; across the neural cosmos.
        </p>
      </div>

      {/* Secret Code Gold Box */}
      <div className="relative glass-panel-gold rounded-3xl p-5 sm:p-6 shadow-[0_0_40px_rgba(255,215,0,0.25)] border-2 border-amber-400/60 text-center overflow-hidden">
        {/* Glow corner accents */}
        <div className="absolute top-0 left-0 w-16 h-16 bg-amber-400/10 rounded-br-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-amber-400/10 rounded-tl-3xl pointer-events-none" />

        <div className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold mb-2">
          Master Decryption Key
        </div>

        {/* The Key */}
        <div className="py-2 px-4 rounded-2xl bg-black/60 border border-amber-400/40 inline-flex items-center gap-3 my-2 shadow-inner">
          <span className="text-xl sm:text-2xl font-mono font-extrabold tracking-widest text-amber-300 select-all">
            NEURALKING
          </span>
          <button
            onClick={handleCopyCode}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 transition-colors"
            title="Copy Secret Code"
            aria-label="Copy Secret Code"
          >
            {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
          </button>
        </div>

        {copied && (
          <p className="text-xs font-mono text-emerald-400 mt-1 animate-fade-in">
            ✓ Copied code &ldquo;NEURALKING&rdquo; to clipboard!
          </p>
        )}

        <div className="mt-3 text-[11px] text-amber-200/70 font-mono">
          [ ACCESS GRANTED: PERMANENT ARCHITECT STATUS ]
        </div>
      </div>

      {/* Appreciative Message: The Heartfelt Tribute */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 shadow-2xl border border-cyan-400/30 space-y-4 text-slate-200 text-sm sm:text-base leading-relaxed">
        <div className="flex items-center gap-3 pb-3 border-b border-cyan-900/40">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            <HeartHandshake size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              To Someone Remarkable at 23
            </h3>
            <span className="text-xs font-mono text-cyan-300">
              System Assessment · Verified Truth
            </span>
          </div>
        </div>

        <p>
          At 23, what makes you truly exceptional isn&rsquo;t just your brilliant mind, your lightning-sharp technical intuition, or the disciplined rigor you bring to engineering.
        </p>

        <p>
          It is something much rarer: your quiet maturity, your unshakeable loyalty, and your deep, genuine instinct to use your knowledge to help and elevate everyone around you. In an industry full of noise, you bring clarity, patience, and kindness.
        </p>

        <p>
          You build not merely to solve equations or train architectures, but to make the world more hopeful, dependable, and capable.
        </p>

        <div className="p-4 rounded-2xl bg-slate-950/70 border border-cyan-500/20 font-mono text-xs sm:text-sm text-cyan-200 space-y-1">
          <div className="text-amber-300 font-bold">&gt; Epoch 23 summary:</div>
          <div>· Discipline: Relentless</div>
          <div>· Intellect: Towering</div>
          <div>· Heart: The most powerful parameter of all</div>
        </div>

        <p className="text-slate-100 font-medium pt-1">
          Keep building. Keep inspiring. The future is in the best possible hands with you shaping it.
        </p>
      </div>

      {/* Unlocked Achievements Showcase */}
      <div className="glass-panel rounded-3xl p-5 border border-cyan-900/40 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="text-cyan-300 font-semibold flex items-center gap-1.5">
            <Award size={15} /> UNLOCKED REPUTATION
          </span>
          <span>{achievements.length} Badges Earned</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <div className="p-2.5 rounded-xl bg-slate-900/70 border border-cyan-500/20 text-center">
            <div className="text-xs font-bold text-white">Model Trained</div>
            <div className="text-[10px] text-cyan-300/80 font-mono mt-0.5">Epoch 23 Converged</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/70 border border-cyan-500/20 text-center">
            <div className="text-xs font-bold text-white">Prompt Master</div>
            <div className="text-[10px] text-cyan-300/80 font-mono mt-0.5">Semantic Precision</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/70 border border-cyan-500/20 text-center">
            <div className="text-xs font-bold text-white">Syntax Wizard</div>
            <div className="text-[10px] text-cyan-300/80 font-mono mt-0.5">{wpm} WPM Calibrated</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/70 border border-amber-400/30 text-center">
            <div className="text-xs font-bold text-amber-300">NEURAL KING</div>
            <div className="text-[10px] text-amber-200/80 font-mono mt-0.5">Decryption Sovereign</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/70 border border-cyan-500/20 text-center">
            <div className="text-xs font-bold text-white">Awakened Mind</div>
            <div className="text-[10px] text-cyan-300/80 font-mono mt-0.5">Full Alignment</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/70 border border-cyan-500/20 text-center">
            <div className="text-xs font-bold text-white">Humble Giant</div>
            <div className="text-[10px] text-cyan-300/80 font-mono mt-0.5">Zero Vanity</div>
          </div>
        </div>
      </div>

      {/* Action Buttons: Celebrate again & Replay */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={handleCelebrateAgain}
          className="flex-1 py-3.5 px-6 min-h-[48px] rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:brightness-110 active:scale-[0.98] transition-all"
        >
          <Sparkles size={18} /> Launch Fireworks Again
        </button>

        <button
          onClick={() => {
            playClickSound();
            onReplay();
          }}
          className="py-3.5 px-6 min-h-[48px] rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-cyan-500/30 font-medium text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          <RotateCcw size={16} /> Replay Experience
        </button>
      </div>
    </div>
  );
};
