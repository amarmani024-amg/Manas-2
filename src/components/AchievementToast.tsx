import React from 'react';
import { Award, Sparkles, CheckCircle2 } from 'lucide-react';

export interface ToastItem {
  id: string;
  title: string;
  description: string;
}

interface AchievementToastProps {
  toast: ToastItem | null;
  onDismiss: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ toast, onDismiss }) => {
  if (!toast) return null;

  return (
    <div
      onClick={onDismiss}
      className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm cursor-pointer animate-bounce-short"
      role="alert"
    >
      <div className="glass-panel-gold rounded-2xl p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-amber-400/40 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,215,0,0.5)]">
          <Award size={22} className="text-slate-950" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold uppercase tracking-wider">
            <Sparkles size={13} />
            <span>Achievement Unlocked</span>
          </div>
          <div className="text-sm font-bold text-white truncate">{toast.title}</div>
          <div className="text-xs text-slate-300 line-clamp-1">{toast.description}</div>
        </div>
        <div className="text-amber-400 opacity-80 hover:opacity-100">
          <CheckCircle2 size={18} />
        </div>
      </div>
    </div>
  );
};
