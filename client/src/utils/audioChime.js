// Web Audio API chime sounds for real-time notifications
// Zero external assets or dependencies needed.

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Plays a pleasant 3-tone chime for incoming farmer bookings (F5 -> A5 -> C6)
 */
export function playNewBookingChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [
      { freq: 698.46, start: 0, duration: 0.15 },    // F5
      { freq: 880.00, start: 0.12, duration: 0.18 },  // A5
      { freq: 1046.50, start: 0.25, duration: 0.35 }  // C6
    ];

    const now = ctx.currentTime;
    notes.forEach(({ freq, start, duration }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + start);

      gain.gain.setValueAtTime(0.001, now + start);
      gain.gain.exponentialRampToValueAtTime(0.18, now + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + start);
      osc.stop(now + start + duration);
    });
  } catch (e) {
    // Graceful silent fallback if audio is blocked by browser policy
  }
}

/**
 * Plays a confirmation chime when flight corridor is locked (C5 -> G5 -> C6)
 */
export function playCorridorLockedChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [
      { freq: 523.25, start: 0, duration: 0.12 },    // C5
      { freq: 783.99, start: 0.10, duration: 0.15 },  // G5
      { freq: 1046.50, start: 0.22, duration: 0.30 }  // C6
    ];

    const now = ctx.currentTime;
    notes.forEach(({ freq, start, duration }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + start);

      gain.gain.setValueAtTime(0.001, now + start);
      gain.gain.exponentialRampToValueAtTime(0.15, now + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + start);
      osc.stop(now + start + duration);
    });
  } catch (e) {
    // Graceful silent fallback
  }
}
