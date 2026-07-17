// Lightweight sound effects synthesized with the Web Audio API.
// No external audio files are needed, so this works completely offline
// and never has a missing-asset / CORS problem.

let audioCtx = null;

const getContext = () => {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioCtx) {
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

const playTone = (ctx, freq, startTime, duration, type = 'sine', gainPeak = 0.2) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(gainPeak, startTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration);
};

// Bright ascending two-note chime for a correct answer
export const playCorrectSound = () => {
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  playTone(ctx, 523.25, now, 0.15, 'sine', 0.22);        // C5
  playTone(ctx, 783.99, now + 0.12, 0.28, 'sine', 0.22); // G5
};

// Low descending buzz for a wrong answer
export const playWrongSound = () => {
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  playTone(ctx, 220, now, 0.18, 'sawtooth', 0.15);
  playTone(ctx, 160, now + 0.1, 0.28, 'sawtooth', 0.15);
};

// Soft click for general UI interactions (question timeout, navigation, etc.)
export const playTickSound = () => {
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  playTone(ctx, 440, now, 0.08, 'square', 0.08);
};
