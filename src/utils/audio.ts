/**
 * WebAudio sound synthesizer for AI Awakening.
 * Pure WebAudio API: zero external asset dependencies, zero loading latency.
 * Starts strictly after the first user gesture.
 */

let audioCtx: AudioContext | null = null;
let isMuted: boolean = false;

export function initAudio(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return true;
  } catch {
    return false;
  }
}

export function setSoundMuted(muted: boolean) {
  isMuted = muted;
}

export function getSoundMuted(): boolean {
  return isMuted;
}

export function triggerVibration(pattern: number | number[] = 25) {
  if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore if vibration not supported or permissions blocked
    }
  }
}

// Gentle UI Click
export function playClickSound() {
  if (isMuted || !initAudio() || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.045);
  } catch {
    // Audio context error fallback
  }
}

// Melodic Node Tap Sound (ascending pentatonic notes in deep cyan harmony)
const PENTATONIC_FREQS = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];

export function playNodeTapSound(index: number = 0) {
  if (isMuted || !initAudio() || !audioCtx) return;
  triggerVibration(20);
  try {
    const freq = PENTATONIC_FREQS[index % PENTATONIC_FREQS.length];
    const now = audioCtx.currentTime;

    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    // Subtle harmonic overtone for a crystal cyber chime
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, now);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(audioCtx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.26);
    osc2.stop(now + 0.26);
  } catch {
    // Ignore audio error
  }
}

// Success Polyphonic Chord
export function playSuccessChord() {
  if (isMuted || !initAudio() || !audioCtx) return;
  triggerVibration([30, 40, 60]);
  try {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major 9 harmony
    const now = audioCtx.currentTime;

    notes.forEach((freq, i) => {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const delay = i * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);

      gain.gain.setValueAtTime(0.1, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.55);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.56);
    });
  } catch {
    // Ignore
  }
}

// Typing sound for Code Dash
export function playKeyClickSound() {
  if (isMuted || !initAudio() || !audioCtx) return;
  triggerVibration(10);
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const now = audioCtx.currentTime;

    osc.type = 'triangle';
    // Slight random pitch variation like a mechanical keyboard
    const randomFreq = 540 + Math.random() * 80;
    osc.frequency.setValueAtTime(randomFreq, now);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.035);
  } catch {
    // Ignore
  }
}

// Friendly notification / hint tone
export function playGentleHintSound() {
  if (isMuted || !initAudio() || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.12);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.16);
  } catch {
    // Ignore
  }
}

// Easter Egg 1: AI Eye Wink chirp
export function playWinkSound() {
  if (isMuted || !initAudio() || !audioCtx) return;
  triggerVibration([25, 30, 35]);
  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.16);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.23);
  } catch {
    // Ignore
  }
}

// Easter Egg 2: Secret Harmonic Resonance (Key 'A')
export function playSecretHarmonicSound() {
  if (isMuted || !initAudio() || !audioCtx) return;
  triggerVibration([40, 30, 40, 30, 60]);
  try {
    const freqs = [440, 554.37, 659.25, 880, 1108.73]; // A Major extended
    const now = audioCtx.currentTime;

    freqs.forEach((f, i) => {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.08);

      gain.gain.setValueAtTime(0.08, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.7);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.72);
    });
  } catch {
    // Ignore
  }
}

// Grand Finale Fanfare
export function playFinaleFanfare() {
  if (isMuted || !initAudio() || !audioCtx) return;
  triggerVibration([80, 50, 100, 50, 150]);
  try {
    const chord = [392.00, 493.88, 587.33, 783.99, 987.77, 1174.66];
    const now = audioCtx.currentTime;

    chord.forEach((f, idx) => {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const delay = idx * 0.09;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + delay);

      gain.gain.setValueAtTime(0.11, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 1.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 1.25);
    });
  } catch {
    // Ignore
  }
}
