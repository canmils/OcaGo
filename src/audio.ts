/** Original, asset-free garden chimes. Nothing sounds until a player opts in. */
export type AudioCue = 'roll' | 'step' | 'goose' | 'bridge' | 'setback' | 'rest' | 'victory' | 'click';
type Note = readonly [frequency: number, offset: number, duration: number];
const score: Record<AudioCue, readonly Note[]> = {
  click: [[740, 0, .045]],
  step: [[440, 0, .065]],
  roll: [[220, 0, .06], [294, .085, .06], [392, .17, .07], [523, .265, .1]],
  goose: [[523, 0, .13], [659, .1, .15], [784, .22, .23]],
  bridge: [[392, 0, .14], [523, .12, .14], [659, .24, .2]],
  setback: [[330, 0, .16], [262, .15, .2], [220, .32, .24]],
  rest: [[392, 0, .2], [330, .2, .3]],
  victory: [[523, 0, .2], [659, .16, .2], [784, .32, .23], [1047, .55, .5]],
};
const preferenceKey = 'ocago:sound';

export function createAudio() {
  let enabled = false, disposed = false, epoch = 0;
  try { enabled = localStorage.getItem(preferenceKey) === 'on'; } catch { /* Private browsing. */ }
  let context: AudioContext | undefined;
  let master: GainNode | undefined;
  const voices = new Map<OscillatorNode, GainNode>();
  const lastPlayed = new Map<AudioCue, number>();

  function stop() {
    epoch++;
    for (const [oscillator, envelope] of voices) {
      oscillator.onended = null;
      try { oscillator.stop(); } catch { /* Already ended. */ }
      oscillator.disconnect();
      envelope.disconnect();
    }
    voices.clear();
    lastPlayed.clear();
  }

  /** Must be invoked from a user gesture; never calls play automatically. */
  async function unlock(): Promise<boolean> {
    if (!enabled || disposed) return false;
    const attempt = epoch;
    try {
      const Audio = globalThis.AudioContext ?? (globalThis as typeof globalThis & {webkitAudioContext?: typeof AudioContext}).webkitAudioContext;
      if (!Audio) return false;
      if (!context) {
        context = new Audio();
        master = context.createGain();
        // Peak per-voice amplitude is 0.016; the voice cap also bounds summed gain.
        master.gain.value = .2;
        master.connect(context.destination);
      }
      if (context.state === 'suspended') await context.resume();
      return enabled && !disposed && attempt === epoch && context.state === 'running';
    } catch { return false; }
  }

  async function setEnabled(value: boolean): Promise<boolean> {
    if (disposed) return false;
    enabled = value;
    try { localStorage.setItem(preferenceKey, value ? 'on' : 'off'); } catch { /* In-memory preference still works. */ }
    if (!value) { stop(); return false; }
    // Keep the user's preference even if the platform temporarily blocks audio.
    return unlock();
  }

  function play(cue: AudioCue) {
    if (!enabled || disposed || document.hidden || !context || !master || context.state !== 'running') return;
    const now = context.currentTime;
    const minimumInterval = cue === 'step' ? .085 : cue === 'click' ? .1 : .24;
    if (now - (lastPlayed.get(cue) ?? -Infinity) < minimumInterval) return;
    const notes = score[cue];
    if (voices.size + notes.length > 12) return;
    lastPlayed.set(cue, now);
    for (const [frequency, offset, duration] of notes) {
      const oscillator = context.createOscillator();
      const envelope = context.createGain();
      const start = now + offset;
      oscillator.type = cue === 'roll' || cue === 'step' ? 'triangle' : 'sine';
      oscillator.frequency.setValueAtTime(frequency, start);
      envelope.gain.setValueAtTime(0, start);
      envelope.gain.linearRampToValueAtTime(.08, start + .008);
      envelope.gain.exponentialRampToValueAtTime(.0001, start + duration);
      oscillator.connect(envelope);
      envelope.connect(master);
      voices.set(oscillator, envelope);
      oscillator.onended = () => {
        oscillator.disconnect();
        envelope.disconnect();
        voices.delete(oscillator);
      };
      oscillator.start(start);
      oscillator.stop(start + duration + .01);
    }
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    stop();
    master?.disconnect();
    void context?.close().catch(() => {});
    context = undefined;
    master = undefined;
  }
  return { get enabled() { return enabled; }, setEnabled, unlock, play, stop, dispose };
}
