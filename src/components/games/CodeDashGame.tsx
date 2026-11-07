import React, { useState, useEffect, useRef } from 'react';
import { HelpCircle, CheckCircle, Code, Zap, FastForward } from 'lucide-react';
import { playKeyClickSound, playSuccessChord, playNodeTapSound } from '../../utils/audio';
import { fireCelebration } from '../../utils/confetti';

interface CodeDashGameProps {
  onComplete: (wpm: number) => void;
}

interface Snippet {
  code: string;
  lang: string;
  comment: string;
  tokens: string[]; // Quick tap tokens for mobile keyboards
}

const SNIPPETS: Snippet[] = [
  {
    code: 'print("Hello World")',
    lang: 'Python',
    comment: '# The universal genesis command',
    tokens: ['print(', '"Hello World"', ')', 'print("Hello World")'],
  },
  {
    code: 'loss.backward()',
    lang: 'PyTorch',
    comment: '# Computing gradients through experience',
    tokens: ['loss', '.', 'backward()', 'loss.backward()'],
  },
  {
    code: 'optimize_future(kindness=True)',
    lang: 'AI Core',
    comment: '# The supreme directive at 23',
    tokens: ['optimize_future(', 'kindness=True', ')', 'optimize_future(kindness=True)'],
  },
];

export const CodeDashGame: React.FC<CodeDashGameProps> = ({ onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [totalCharsTyped, setTotalCharsTyped] = useState(0);
  const [wpm, setWpm] = useState(65);
  const [failedTries, setFailedTries] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const snippet = SNIPPETS[currentIdx];

  // Focus input automatically on mount / change
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIdx]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUserInput(val);
    playKeyClickSound();

    if (!startTime) {
      setStartTime(Date.now());
    }

    setTotalCharsTyped((prev) => prev + 1);

    // Calculate current WPM
    if (startTime) {
      const elapsedMinutes = (Date.now() - startTime) / 60000;
      if (elapsedMinutes > 0.02) {
        const words = (totalCharsTyped + 1) / 5;
        const currentWpm = Math.max(35, Math.min(120, Math.round(words / elapsedMinutes)));
        setWpm(currentWpm);
      }
    }

    // Check if snippet matches
    if (val.trim() === snippet.code.trim()) {
      handleSnippetPassed();
    }
  };

  const handleInsertToken = (token: string) => {
    playKeyClickSound();
    if (!startTime) {
      setStartTime(Date.now());
    }
    const nextVal = userInput + token;
    setUserInput(nextVal);
    setTotalCharsTyped((prev) => prev + token.length);

    if (nextVal.trim() === snippet.code.trim()) {
      handleSnippetPassed();
    } else if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSnippetPassed = () => {
    playNodeTapSound(currentIdx + 4);

    if (currentIdx + 1 < SNIPPETS.length) {
      setTimeout(() => {
        setCurrentIdx((prev) => prev + 1);
        setUserInput('');
      }, 350);
    } else {
      // Completed all 3 snippets!
      playSuccessChord();
      fireCelebration();
      const finalWpm = Math.max(55, wpm);
      setTimeout(() => {
        onComplete(finalWpm);
      }, 900);
    }
  };

  const handleSkip = () => {
    playSuccessChord();
    fireCelebration();
    onComplete(68);
  };

  return (
    <div className="w-full max-w-xl mx-auto glass-panel rounded-3xl p-4 sm:p-6 shadow-2xl border border-cyan-500/20">
      {/* Title & One-line instruction */}
      <div className="mb-4 text-center">
        <div className="text-xs font-mono text-cyan-400 tracking-wider uppercase mb-1">
          Challenge 03 / 03
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Code Dash
        </h2>
        <p className="text-sm text-cyan-200/90 font-medium mt-1">
          Type 3 short snippets to calibrate the core syntax. Typos are forgiven!
        </p>
      </div>

      {/* Tutorial Hint Banner */}
      {showTutorial && (
        <div className="mb-4 p-3 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 flex items-start justify-between gap-3 text-xs text-cyan-100">
          <div className="flex items-start gap-2">
            <HelpCircle size={16} className="text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-cyan-300">Quick Guide: </span>
              Type in the box or tap the quick-insert tokens below. No penalties for typos!
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

      {/* Snippet Progress and WPM */}
      <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-400 px-1">
        <span className="flex items-center gap-1.5 text-cyan-300">
          <Code size={14} />
          <span>Snippet {currentIdx + 1} of {SNIPPETS.length} ({snippet.lang})</span>
        </span>
        <span className="flex items-center gap-1 text-amber-300 font-bold tabular-nums">
          <Zap size={13} /> {wpm} WPM
        </span>
      </div>

      {/* Code Target Box */}
      <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-900/60 font-mono text-xs sm:text-sm mb-4 relative overflow-hidden">
        <div className="text-slate-400 text-xs mb-1 select-none">{snippet.comment}</div>
        <div className="text-cyan-300 font-bold tracking-wide text-sm sm:text-base py-1">
          {snippet.code}
        </div>
      </div>

      {/* Input Field with Virtual Display */}
      <div className="relative mb-3">
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Type snippet here..."
          className="w-full px-4 py-3.5 bg-slate-900/90 border-2 border-cyan-500/40 focus:border-cyan-400 rounded-2xl font-mono text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none transition-all shadow-inner"
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="off"
          spellCheck="false"
        />
        {userInput.trim() === snippet.code.trim() && (
          <CheckCircle size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400" />
        )}
      </div>

      {/* Quick Token Buttons (Mobile ergonomic friendly!) */}
      <div className="mb-2">
        <div className="text-[11px] font-mono text-slate-400 mb-1.5 flex items-center gap-1">
          <span>Quick Tokens (tap to insert):</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {snippet.tokens.map((token, i) => (
            <button
              key={i}
              onClick={() => handleInsertToken(token)}
              className="px-3 py-2 min-h-[44px] bg-cyan-950/60 hover:bg-cyan-900/80 active:scale-95 border border-cyan-500/30 rounded-xl font-mono text-xs text-cyan-200 transition-all shadow-sm"
            >
              {token}
            </button>
          ))}
          <button
            onClick={() => setUserInput('')}
            className="px-2.5 py-2 min-h-[44px] bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-rose-300 border border-slate-700/40 rounded-xl font-mono text-xs transition-colors ml-auto"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Friendly speed rating banner */}
      <div className="mt-4 pt-3 border-t border-cyan-950/60 flex items-center justify-between text-xs text-slate-400 font-mono">
        <span>Precision: <strong className="text-cyan-300 font-semibold">100%</strong></span>
        <span className="text-amber-300">Fast & disciplined coding</span>
      </div>

      {/* Skip button after 2 failed tries */}
      {failedTries >= 2 && (
        <div className="mt-3 pt-3 border-t border-cyan-950 flex justify-center animate-fade-in">
          <button
            onClick={handleSkip}
            className="flex items-center gap-1.5 px-4 py-2 min-h-[44px] text-xs font-mono text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/40 rounded-xl transition-colors"
          >
            <FastForward size={14} /> Skip to Final Convergence
          </button>
        </div>
      )}
    </div>
  );
};
