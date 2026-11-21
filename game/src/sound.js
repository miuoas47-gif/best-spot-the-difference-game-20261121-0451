// sound.js — tiny WebAudio effects, made from oscillators, no sound files.
// A bright two-note chime on a find, a low buzz on a miss, a soft tick on
// a hint and a little arpeggio when a level is cleared. Nothing loads over
// the network and silence is the fallback when audio is unavailable.

export class SoundFX {
  constructor() {
    this.enabled = true;
    this.context = null;
  }

  ensureContext() {
    if (this.context) return this.context;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;
      this.context = new AudioContext();
    } catch {
      this.context = null;
    }
    return this.context;
  }

  unlock() {
    const ctx = this.ensureContext();
    if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
  }

  tone(frequency, startAt, length, type, volume) {
    const ctx = this.ensureContext();
    if (!ctx || !this.enabled) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + startAt);
      gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + startAt + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startAt + length);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + startAt);
      osc.stop(ctx.currentTime + startAt + length + 0.05);
    } catch {
      // Sound is decoration; a failure here must never break the game.
    }
  }

  found() {
    this.tone(660, 0, 0.18, 'sine', 0.16);
    this.tone(880, 0.09, 0.28, 'sine', 0.16);
  }

  wrong() {
    this.tone(140, 0, 0.22, 'sawtooth', 0.08);
  }

  hint() {
    this.tone(520, 0, 0.12, 'triangle', 0.12);
    this.tone(780, 0.08, 0.16, 'triangle', 0.12);
  }

  levelClear() {
    this.tone(523, 0, 0.16, 'sine', 0.15);
    this.tone(659, 0.12, 0.16, 'sine', 0.15);
    this.tone(784, 0.24, 0.22, 'sine', 0.15);
    this.tone(1047, 0.38, 0.34, 'sine', 0.15);
  }

  tick() {
    this.tone(980, 0, 0.06, 'square', 0.04);
  }
}
