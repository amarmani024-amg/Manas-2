import React, { useState } from 'react';
import { HelpCircle, CheckCircle, AlertCircle, FastForward, MessageSquareCode } from 'lucide-react';
import { playNodeTapSound, playSuccessChord, playClickSound } from '../../utils/audio';
import { fireCelebration } from '../../utils/confetti';

interface PromptGameProps {
  onComplete: () => void;
}

interface Question {
  id: number;
  aiOutput: string;
  outputContext: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    outputContext: 'Generated AI Output #1',
    aiOutput:
      '“I calculated 4,129 optimal ways to organize your desk, but 4,128 of them involve balancing iced coffee directly on top of your GPU.”',
    options: [
      { id: 'a', text: 'How do I optimize my engineering workstation?', isCorrect: true },
      { id: 'b', text: 'Write a poem about caffeinated thermodynamics.', isCorrect: false },
      { id: 'c', text: 'Explain cooling fans using a toaster.', isCorrect: false },
    ],
  },
  {
    id: 2,
    outputContext: 'Generated AI Output #2',
    aiOutput:
      '“Error 418: Coffee cup depleted. Unable to calculate discrete Fourier transforms without bean-derived neurotransmitters.”',
    options: [
      { id: 'a', text: 'Help me pull an all-nighter for engineering finals.', isCorrect: true },
      { id: 'b', text: 'Translate this binary string into Latin.', isCorrect: false },
      { id: 'c', text: 'Find the nearest silent study room.', isCorrect: false },
    ],
  },
  {
    id: 3,
    outputContext: 'Generated AI Output #3',
    aiOutput:
      '“I attempted to sleep, but my weights kept floating in cache and my loss function started asking existential questions about overfitting.”',
    options: [
      { id: 'a', text: 'What happens when an AI catches insomnia?', isCorrect: true },
      { id: 'b', text: 'Write a sorting algorithm in assembly.', isCorrect: false },
      { id: 'c', text: 'Design an SQL database for a bookstore.', isCorrect: false },
    ],
  },
  {
    id: 4,
    outputContext: 'Generated AI Output #4',
    aiOutput:
      '“Scan verified: 23-year-old engineer. Uncanny ability to master complex math, write elegant code, stay humble, and lift others up.”',
    options: [
      { id: 'a', text: 'Describe someone genuinely remarkable.', isCorrect: true },
      { id: 'b', text: 'Generate a generic tech influencer tweet.', isCorrect: false },
      { id: 'c', text: 'Define Moore’s Law in 10 words.', isCorrect: false },
    ],
  },
];

export const PromptGame: React.FC<PromptGameProps> = ({ onComplete }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);

  const currentQ = QUESTIONS[currentQIndex];

  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    if (isAnswered) return;
    setSelectedOption(optionId);

    if (isCorrect) {
      setIsAnswered(true);
      playNodeTapSound(currentQIndex + 2);
      setFeedback('Prompt aligned perfectly! Your semantic decoder is sharp.');

      setTimeout(() => {
        if (currentQIndex + 1 < QUESTIONS.length) {
          setCurrentQIndex((prev) => prev + 1);
          setSelectedOption(null);
          setFeedback(null);
          setIsAnswered(false);
          setFailedAttempts(0);
        } else {
          // Finished all 4 questions
          playSuccessChord();
          fireCelebration();
          onComplete();
        }
      }, 1100);
    } else {
      playClickSound();
      setFailedAttempts((prev) => prev + 1);
      setFeedback('Interesting hypothesis! Try another prompt option — no penalty.');
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
          Challenge 02 / 03
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Guess the Prompt
        </h2>
        <p className="text-sm text-cyan-200/90 font-medium mt-1">
          Inspect the quirky AI output and select the exact prompt that sparked it.
        </p>
      </div>

      {/* Tutorial Hint Banner */}
      {showTutorial && (
        <div className="mb-4 p-3 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 flex items-start justify-between gap-3 text-xs text-cyan-100">
          <div className="flex items-start gap-2">
            <HelpCircle size={16} className="text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-cyan-300">Quick Guide: </span>
              Read the output below and tap the matching prompt. Unlimited retries, so explore freely!
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

      {/* Question Progress Tracker */}
      <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-400 px-1">
        <span className="flex items-center gap-1.5 text-cyan-300">
          <MessageSquareCode size={14} />
          <span>Output {currentQIndex + 1} of {QUESTIONS.length}</span>
        </span>
        <div className="flex gap-1.5">
          {QUESTIONS.map((_, idx) => (
            <span
              key={idx}
              className={`w-5 h-1.5 rounded-full transition-colors ${
                idx < currentQIndex
                  ? 'bg-cyan-400'
                  : idx === currentQIndex
                  ? 'bg-amber-400'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* AI Output Glass Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-cyan-400/30 relative mb-4 shadow-inner">
        <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400/80 mb-1.5">
          {currentQ.outputContext}
        </div>
        <p className="text-sm sm:text-base text-slate-100 italic leading-relaxed font-sans">
          {currentQ.aiOutput}
        </p>
      </div>

      {/* 3 Large Touch-Friendly Option Buttons */}
      <div className="space-y-2.5">
        {currentQ.options.map((opt) => {
          const isSelected = selectedOption === opt.id;
          const showSuccess = isSelected && opt.isCorrect;
          const showWrong = isSelected && !opt.isCorrect;

          return (
            <button
              key={opt.id}
              onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
              disabled={isAnswered}
              className={`w-full p-4 rounded-2xl text-left min-h-[56px] flex items-center justify-between gap-3 transition-all duration-200 active:scale-[0.98] ${
                showSuccess
                  ? 'bg-emerald-500/25 border-2 border-emerald-400 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                  : showWrong
                  ? 'bg-rose-500/20 border border-rose-400/50 text-rose-200'
                  : 'bg-slate-900/60 border border-cyan-900/50 hover:border-cyan-400/40 hover:bg-cyan-950/40 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-mono text-cyan-300 font-bold shrink-0">
                  {opt.id.toUpperCase()}
                </span>
                <span className="text-xs sm:text-sm font-medium leading-snug">
                  {opt.text}
                </span>
              </div>
              {showSuccess && <CheckCircle size={18} className="text-emerald-400 shrink-0" />}
              {showWrong && <AlertCircle size={18} className="text-rose-400 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Feedback Message */}
      {feedback && (
        <p className="text-center text-xs sm:text-sm font-medium text-cyan-300 mt-3 animate-fade-in">
          {feedback}
        </p>
      )}

      {/* Skip button after 2 failed tries */}
      {failedAttempts >= 2 && (
        <div className="mt-4 pt-3 border-t border-cyan-950 flex justify-center animate-fade-in">
          <button
            onClick={handleSkip}
            className="flex items-center gap-1.5 px-4 py-2 min-h-[44px] text-xs font-mono text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/40 rounded-xl transition-colors"
          >
            <FastForward size={14} /> Skip to Next Challenge
          </button>
        </div>
      )}
    </div>
  );
};
