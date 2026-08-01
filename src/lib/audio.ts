let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playCheckSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);

    if (navigator.vibrate) {
      navigator.vibrate(40);
    }
  } catch (e) {
    console.warn('Erro ao tocar som de check:', e);
  }
}

export function playTimerAlertSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const playBeep = (time: number, freq: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.3, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + 0.18);
    };

    playBeep(now, 880);
    playBeep(now + 0.2, 880);
    playBeep(now + 0.4, 1174.66);

    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 300]);
    }
  } catch (e) {
    console.warn('Erro ao tocar alarme de descanso:', e);
  }
}
