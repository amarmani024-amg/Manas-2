import React, { useState } from 'react';
import { GameStage } from '../types';
import { playClickSound } from '../utils/audio';

interface TrainingProgressBarProps {
  stage: GameStage;
  completedCount: number; // 0 to 3
}

interface EpochInfo {
  epoch: number;
  label: string;
  loss: string;
  detail: string;
}

const EPOCHS: Record<number, EpochInfo> = {
  0: {
    epoch: 1,
    label: 'Epoch 1/23: Initializing neural curiosity & caffeine receptors...',
    loss: '0.942',
    detail: 'Sensory layers calibrated. Detecting remarkable intellectual capacity.',
  },
  1: {
    epoch: 8,
    label: 'Epoch 8/23: Pruning noise & ego weights... remaining: 0.000%',
    loss: '0.412',
    detail: 'Synaptic latency dropping. Loyalty tensors permanently frozen at 100%.',
  },
  2: {
    epoch: 15,
    label: 'Epoch 15/23: Backpropagating discipline & late-night code epiphanies...',
    loss: '0.128',
    detail: 'Prompt alignment verified. Zero hallucination detected.',
  },
  3: {
    epoch: 23,
    label: 'Epoch 23/23: Convergence reached. 23 years of sheer brilliance.',
    loss: '0.000',
    detail: 'Global optimum achieved. Model recognizes a truly exceptional human.',
  },
};

export const TrainingProgressBar: React.FC<TrainingProgressBarProps> = ({
  stage,
  completedCount,
}) => {
  const [showLogs, setShowLogs] = useState(false);

  const currentInfo =
    stage === 'finale'
      ? EPOCHS[3]
      : EPOCHS[completedCount] || EPOCHS[0];

  const progressPercentage =
    stage === 'finale'
      ? 100
      : Math.min(100, Math.round(((currentInfo.epoch) / 23) * 100));

  const toggleLogs = () => {
    playClickSound();
    setShowLogs(!showLogs);
  };

  return (
    <div className="w-full max-w-lg mx-auto mb-5">
      <div
        onClick={toggleLogs}
        className="glass-panel rounded-xl p-3 cursor-pointer hover:border-cyan-400/40 transition-all active:scale-[0.99] border border-cyan-500/20"
      >
        <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
          <span className="text-cyan-300 font-semibold flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            TRAINING PROGRESS
          </span>
          <span className="text-slate-400 tabular-nums">
            Loss: <span className="text-emerald-400 font-bold">{currentInfo.loss}</span> · {progressPercentage}%
          </span>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full h-2.5 bg-slate-900/80 rounded-full overflow-hidden p-0.5 border border-cyan-950">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-400 to-amber-300 transition-all duration-700 ease-out shadow-[0_0_12px_rgba(0,240,255,0.6)]"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Current Epoch Label */}
        <div className="flex items-center justify-between mt-2 text-xs">
          <span className="text-slate-200 font-medium truncate pr-2">
            {currentInfo.label}
          </span>
          <span className="text-[10px] text-cyan-400/70 font-mono shrink-0 hover:text-cyan-300">
            {showLogs ? '▲ Hide Log' : '▼ Inspect'}
          </span>
        </div>

        {/* Expanded Training Log */}
        {showLogs && (
          <div className="mt-2.5 pt-2 border-t border-cyan-900/40 text-[11px] font-mono text-slate-300 space-y-1 animate-fade-in">
            <div className="text-cyan-400">&gt; Hyperparameter check:</div>
            <div className="pl-2">· Architecture: 23-Year Deep Transformer</div>
            <div className="pl-2">· Optimizer: Sincere Discipline + Relentless Curiosity</div>
            <div className="pl-2">· Weight Decay: 0.0 (Loyalty cannot decay)</div>
            <div className="pl-2 text-amber-300">&gt; {currentInfo.detail}</div>
          </div>
        )}
      </div>
    </div>
  );
};
