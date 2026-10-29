/**
 * Web Audio API synthesizer for realistic roulette click/ticker and celebration fanfare.
 * Works seamlessly in all modern browsers with zero external network dependencies.
 */

class SoundEffects {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private tickInterval: number | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted() {
    return this.isMuted;
  }

  public playSingleTick(volume = 0.4) {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800 + Math.random() * 200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.035);

      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Audio error ignored
    }
  }

  public playSpinningSound(durationSeconds: number) {
    if (this.isMuted) return;
    this.stopSpinningSound();

    const startTime = Date.now();
    const totalMs = durationSeconds * 1000;

    const scheduleNextTick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / totalMs);

      if (progress >= 1) {
        return;
      }

      // Interval starts fast (e.g. 35ms) and slows down up to 450ms near the end
      // Quadratic deceleration curve matching cubic-bezier(0.1, 0.8, 0.3, 1)
      const currentInterval = 35 + Math.pow(progress, 2.5) * 450;
      const currentVol = Math.max(0.05, 0.4 * (1 - progress * 0.7));

      this.playSingleTick(currentVol);

      this.tickInterval = window.setTimeout(scheduleNextTick, currentInterval);
    };

    scheduleNextTick();
  }

  public stopSpinningSound() {
    if (this.tickInterval !== null) {
      clearTimeout(this.tickInterval);
      this.tickInterval = null;
    }
  }

  public playCelebration() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const notes = [
        { freq: 523.25, time: 0.0, dur: 0.15 }, // C5
        { freq: 659.25, time: 0.15, dur: 0.15 }, // E5
        { freq: 783.99, time: 0.30, dur: 0.20 }, // G5
        { freq: 1046.50, time: 0.50, dur: 0.50 }, // C6
        { freq: 783.99, time: 0.75, dur: 0.15 }, // G5
        { freq: 1046.50, time: 0.90, dur: 0.80 }, // C6
      ];

      notes.forEach(({ freq, time, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + time);

        gain.gain.setValueAtTime(0.3, ctx.currentTime + time);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + time);
        osc.stop(ctx.currentTime + time + dur);
      });
    } catch {
      // Audio error ignored
    }
  }
}

export const soundEffects = new SoundEffects();
