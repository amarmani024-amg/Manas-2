import React, { useState } from 'react';
import { X, Play, Sparkles, Terminal as TerminalIcon, ShieldCheck, Cpu } from 'lucide-react';
import { playClickSound, playSecretHarmonicSound, playNodeTapSound } from '../utils/audio';
import { fireCelebration } from '../utils/confetti';

interface DevModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockAll?: () => void;
}

export const DevModeModal: React.FC<DevModeModalProps> = ({ isOpen, onClose, onUnlockAll }) => {
  const [activeTab, setActiveTab] = useState<'weights' | 'console' | 'audio'>('weights');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-md glass-panel rounded-2xl border border-cyan-400/40 shadow-[0_0_50px_rgba(0,240,255,0.2)] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-900/60 bg-[#050B1F]/90">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="text-xs font-mono font-bold text-cyan-300 ml-2 flex items-center gap-1">
              <TerminalIcon size={14} /> DEV_ROOT://ai-awakening
            </span>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close Developer Mode"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center border-b border-cyan-900/40 bg-slate-950/40 px-2 py-1 gap-1 text-xs font-mono">
          <button
            onClick={() => {
              playClickSound();
              setActiveTab('weights');
            }}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap min-h-[36px] ${
              activeTab === 'weights'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Hyperparameters
          </button>
          <button
            onClick={() => {
              playClickSound();
              setActiveTab('console');
            }}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap min-h-[36px] ${
              activeTab === 'console'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Kernel Logs
          </button>
          <button
            onClick={() => {
              playClickSound();
              setActiveTab('audio');
            }}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap min-h-[36px] ${
              activeTab === 'audio'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Diagnostics
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 font-mono text-xs text-slate-300">
          {activeTab === 'weights' && (
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-cyan-900/40">
                <div className="flex justify-between text-cyan-300 mb-1">
                  <span>Kindness Tensor</span>
                  <span className="font-bold text-amber-300">100.0%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-400 to-amber-300 h-full w-full" />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-cyan-900/40">
                <div className="flex justify-between text-cyan-300 mb-1">
                  <span>Loyalty & Integrity</span>
                  <span className="font-bold text-emerald-400">∞ (Locked)</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-full" />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-cyan-900/40">
                <div className="flex justify-between text-cyan-300 mb-1">
                  <span>Engineering Tenacity</span>
                  <span className="font-bold text-cyan-300">99.98%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full w-[99.98%]" />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-cyan-900/40">
                <div className="flex justify-between text-cyan-300 mb-1">
                  <span>Humility Matrix</span>
                  <span className="font-bold text-amber-300">Max Stability</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full w-full" />
                </div>
              </div>

              <p className="text-[11px] text-slate-400 italic">
                &gt; Note: All layers report zero gradient vanishing. An exceptionally grounded model at epoch 23.
              </p>
            </div>
          )}

          {activeTab === 'console' && (
            <div className="space-y-1.5 bg-black/60 p-3 rounded-xl border border-cyan-900/40 text-[11px] font-mono leading-relaxed">
              <p className="text-emerald-400">[BOOT] Kernel 23.0.0 initializing...</p>
              <p className="text-slate-400">[LOG] Inspecting architecture: Brilliant, disciplined, mature.</p>
              <p className="text-cyan-300">[STATUS] No vanity detected. High signal-to-noise ratio.</p>
              <p className="text-slate-400">[INFO] Core motive: Building systems to empower fellow humans.</p>
              <p className="text-amber-300">[CONVERGENCE] Verified: A truly remarkable mind.</p>
              <p className="text-cyan-400 animate-pulse">&gt; Ready for neural alignment_</p>
            </div>
          )}

          {activeTab === 'audio' && (
            <div className="space-y-3">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-cyan-900/40 space-y-2">
                <span className="text-cyan-300 font-bold block mb-1">Interactive Diagnostic Triggers:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      playSecretHarmonicSound();
                      fireCelebration();
                    }}
                    className="p-2 bg-cyan-950/70 border border-cyan-500/30 rounded-lg text-cyan-300 hover:bg-cyan-900 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Sparkles size={14} /> Firework Burst
                  </button>
                  <button
                    onClick={() => playSecretHarmonicSound()}
                    className="p-2 bg-amber-950/70 border border-amber-500/30 rounded-lg text-amber-300 hover:bg-amber-900 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Play size={14} /> Harmonic 'A'
                  </button>
                </div>
              </div>

              {onUnlockAll && (
                <button
                  onClick={() => {
                    playSecretHarmonicSound();
                    fireCelebration();
                    onUnlockAll();
                  }}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500/20 to-cyan-500/20 border border-amber-400/40 rounded-xl text-amber-300 font-bold flex items-center justify-center gap-2 hover:bg-amber-500/30 transition-all active:scale-98"
                >
                  <ShieldCheck size={16} /> Fast-Forward to Grand Finale
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-cyan-900/40 bg-[#050B1F]/90 flex justify-end">
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="px-4 py-2 min-h-[44px] bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 rounded-xl font-mono text-xs transition-colors"
          >
            Close Terminal
          </button>
        </div>
      </div>
    </div>
  );
};
