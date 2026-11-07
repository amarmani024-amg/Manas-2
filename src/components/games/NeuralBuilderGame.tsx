import React, { useState } from 'react';
import { Sparkles, ArrowRight, Check, HelpCircle, FastForward } from 'lucide-react';
import { playNodeTapSound, playSuccessChord, playClickSound } from '../../utils/audio';
import { fireCelebration } from '../../utils/confetti';

interface NeuralBuilderGameProps {
  onComplete: () => void;
}

interface NodeData {
  id: number;
  layer: number; // 0, 1, 2, 3
  label: string;
  sublabel: string;
}

const NODES: NodeData[] = [
  // Layer 0: Input
  { id: 0, layer: 0, label: 'Curiosity', sublabel: 'Input Layer' },
  { id: 1, layer: 0, label: 'Discipline', sublabel: 'Input Layer' },
  // Layer 1: Processing
  { id: 2, layer: 1, label: 'Deep Logic', sublabel: 'Hidden Layer 1' },
  { id: 3, layer: 1, label: 'Quiet Loyalty', sublabel: 'Hidden Layer 1' },
  // Layer 2: Refinement
  { id: 4, layer: 2, label: 'Maturity', sublabel: 'Hidden Layer 2' },
  { id: 5, layer: 2, label: 'Kindness', sublabel: 'Hidden Layer 2' },
  // Layer 3: Output
  { id: 6, layer: 3, label: 'Human Impact', sublabel: 'Output Layer' },
];

// Target connection sequence
const TARGET_PATH = [0, 2, 4, 6];

export const NeuralBuilderGame: React.FC<NeuralBuilderGameProps> = ({ onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [connectedNodes, setConnectedNodes] = useState<number[]>([]);
  const [failedTries, setFailedTries] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Tap the flashing node to establish connection 1 of 4.');
  const [showTutorial, setShowTutorial] = useState(true);

  const activeTargetNodeId = TARGET_PATH[currentStepIndex];

  const handleNodeClick = (nodeId: number) => {
    if (currentStepIndex >= TARGET_PATH.length) return;

    if (nodeId === activeTargetNodeId) {
      // Correct node tapped
      playNodeTapSound(currentStepIndex);
      const newConnected = [...connectedNodes, nodeId];
      setConnectedNodes(newConnected);

      const nextStep = currentStepIndex + 1;
      setCurrentStepIndex(nextStep);

      if (nextStep < TARGET_PATH.length) {
        setStatusMessage(`Great connection! Now tap node ${nextStep + 1} of 4.`);
      } else {
        // Completed game!
        playSuccessChord();
        fireCelebration();
        setStatusMessage('Neural path complete! All layers aligned seamlessly.');
        setTimeout(() => {
          onComplete();
        }, 1200);
      }
    } else {
      // Wrong node tapped
      playClickSound();
      setFailedTries((prev) => prev + 1);
      setStatusMessage('Follow the glowing beacon line! Tap the illuminated node.');
    }
  };

  const handleSkip = () => {
    playSuccessChord();
    fireCelebration();
    onComplete();
  };

  return (
    <div className="w-full max-w-xl mx-auto glass-panel rounded-3xl p-4 sm:p-6 shadow-2xl border border-cyan-500/20">
      {/* Title & One-line instruction */}
      <div className="mb-4 text-center">
        <div className="text-xs font-mono text-cyan-400 tracking-wider uppercase mb-1">
          Challenge 01 / 03
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Neural Network Builder
        </h2>
        <p className="text-sm text-cyan-200/90 font-medium mt-1">
          Tap the glowing nodes in sequence to establish synaptic connections across the layers.
        </p>
      </div>

      {/* Tutorial Hint Banner */}
      {showTutorial && (
        <div className="mb-4 p-3 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 flex items-start justify-between gap-3 text-xs text-cyan-100">
          <div className="flex items-start gap-2">
            <HelpCircle size={16} className="text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-cyan-300">Quick Guide: </span>
              Tap each pulsing node from left to right. Take all the time you need — no timer, no stress!
            </div>
          </div>
          <button
            onClick={() => setShowTutorial(false)}
            className="text-cyan-400 hover:text-white shrink-0 font-mono text-[11px] p-1"
          >
            Got it
          </button>
        </div>
      )}

      {/* Interactive Neural Grid */}
      <div className="relative py-4 px-2 my-2 bg-slate-950/60 rounded-2xl border border-cyan-900/40 min-h-[290px] flex items-center justify-between overflow-hidden">
        {/* Connection status tracker */}
        <div className="absolute top-2 left-3 text-[11px] font-mono text-slate-400">
          Connected: <span className="text-cyan-300 font-bold">{connectedNodes.length} / 4</span>
        </div>

        {/* 4 Layer Columns */}
        {[0, 1, 2, 3].map((layerIdx) => {
          const layerNodes = NODES.filter((n) => n.layer === layerIdx);
          const layerNames = ['Input', 'Hidden 1', 'Hidden 2', 'Output'];

          return (
            <div key={layerIdx} className="flex-1 flex flex-col items-center justify-around h-full z-10 py-4 gap-6">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                {layerNames[layerIdx]}
              </span>

              <div className="flex flex-col gap-4 items-center justify-center">
                {layerNodes.map((node) => {
                  const isConnected = connectedNodes.includes(node.id);
                  const isTarget = node.id === activeTargetNodeId;

                  return (
                    <button
                      key={node.id}
                      onClick={() => handleNodeClick(node.id)}
                      className={`relative min-w-[56px] min-h-[56px] sm:min-w-[64px] sm:min-h-[64px] rounded-2xl p-2 flex flex-col items-center justify-center transition-all duration-300 active:scale-95 text-center ${
                        isConnected
                          ? 'bg-cyan-500/30 border-2 border-cyan-300 text-white shadow-[0_0_20px_rgba(0,240,255,0.6)]'
                          : isTarget
                          ? 'bg-amber-400/25 border-2 border-amber-300 text-amber-100 shadow-[0_0_25px_rgba(255,215,0,0.6)] animate-pulse'
                          : 'bg-slate-900/70 border border-slate-700/60 text-slate-400 hover:border-cyan-500/40 hover:text-slate-200'
                      }`}
                      aria-label={`${node.label} (${node.sublabel})`}
                    >
                      {/* Connected badge */}
                      {isConnected ? (
                        <Check size={18} className="text-cyan-300 mb-0.5" />
                      ) : isTarget ? (
                        <Sparkles size={16} className="text-amber-300 mb-0.5 animate-spin-slow" />
                      ) : null}

                      <span className="text-xs sm:text-xs font-semibold leading-tight line-clamp-2">
                        {node.label}
                      </span>

                      {/* Beacon ripple ring when target */}
                      {isTarget && (
                        <span className="absolute -inset-1.5 rounded-2xl border border-amber-400/60 animate-ping pointer-events-none" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Status Feedback Line */}
      <div className="mt-3 text-center min-h-[24px]">
        <p className="text-xs sm:text-sm text-cyan-300 font-medium">
          {statusMessage}
        </p>
      </div>

      {/* Skip button after 2 failed tries */}
      {failedTries >= 2 && currentStepIndex < TARGET_PATH.length && (
        <div className="mt-3 pt-3 border-t border-cyan-950 flex justify-center animate-fade-in">
          <button
            onClick={handleSkip}
            className="flex items-center gap-1.5 px-4 py-2 min-h-[44px] text-xs font-mono text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/40 rounded-xl transition-colors"
          >
            <FastForward size={14} /> Skip to Next Step
          </button>
        </div>
      )}
    </div>
  );
};
