import './animation.css';
import {setDieFace} from './die-art';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Every effect settles when cancelled; a restart never leaves an awaiting turn stuck. */
async function motion(el: HTMLElement, frames: Keyframe[], duration: number, signal?: AbortSignal): Promise<void> {
  if (signal?.aborted || reducedMotion() || typeof el.animate !== 'function') return;
  const animation = el.animate(frames, {duration, easing: 'cubic-bezier(.2,.75,.25,1)'});
  const cancel = () => animation.cancel();
  signal?.addEventListener('abort', cancel, {once: true});
  try { await animation.finished; } catch { /* Cancellation is expected on restart. */ }
  finally { signal?.removeEventListener('abort', cancel); animation.cancel(); }
}

/** Anticipation is decorative: only the real die value is exposed to assistive technology. */
export async function animateDice(el: HTMLElement, die: number, signal?: AbortSignal): Promise<void> {
  if (signal?.aborted) return;
  el.classList.add('motion-dice');
  el.setAttribute('aria-label', 'Rolling the die');
  try {
    await motion(el, [
      {transform:'translateY(0) rotate(0) scale(1)'},
      {transform:'translateY(-10px) rotate(-14deg) scale(1.06)', offset:.25},
      {transform:'translateY(-5px) rotate(13deg) scale(1.04)', offset:.55},
      {transform:'translateY(0) rotate(-5deg) scale(.97)', offset:.8},
      {transform:'translateY(0) rotate(0) scale(1)'}
    ], 440, signal);
    if (!signal?.aborted) {
      setDieFace(el, die);
      el.setAttribute('aria-label', `Die: ${die}`);
    }
  } finally { el.classList.remove('motion-dice'); }
}

/** Call after rendering a path position, passing its destination tile. */
export async function animateStep(el?: HTMLElement, signal?: AbortSignal): Promise<void> {
  if (!el || signal?.aborted) return;
  const token = el.querySelector<HTMLElement>('.token') ?? el;
  await motion(token, [
    {transform:'translateY(-7px) scale(.82)', opacity:.65},
    {transform:'translateY(1px) scale(1.12)', opacity:1, offset:.7},
    {transform:'translateY(0) scale(1)', opacity:1}
  ], 115, signal);
}

export type EventMotion = 'goose' | 'bridge' | 'setback' | 'rest';
export async function animateEvent(el: HTMLElement, kind: EventMotion, signal?: AbortSignal): Promise<void> {
  if (kind === 'goose' || kind === 'bridge') {
    const token = el.querySelector<HTMLElement>('.token') ?? el;
    await motion(token, kind === 'goose' ? [
      {transform:'translateY(0) rotate(0)'},
      {transform:'translateY(-13px) rotate(-8deg)', offset:.45},
      {transform:'translateY(0) rotate(0)'}
    ] : [
      {transform:'translateX(-8px)', opacity:.4},
      {transform:'translateX(3px)', opacity:1, offset:.7},
      {transform:'translateX(0)', opacity:1}
    ], 300, signal);
    return;
  }
  const setback = kind === 'setback';
  await motion(el, setback ? [
    {transform:'translateX(0)'}, {transform:'translateX(-4px)',offset:.25},
    {transform:'translateX(4px)',offset:.6}, {transform:'translateX(0)'}
  ] : [
    {filter:'brightness(1)', transform:'scale(1)'},
    {filter:'brightness(1.22)', transform:`scale(${kind === 'rest' ? 1.03 : 1.08})`,offset:.45},
    {filter:'brightness(1)', transform:'scale(1)'}
  ], 300, signal);
}

/** Lightweight original garden confetti. Caller cleans up on restart/unmount. */
export function celebrateVictory(board: HTMLElement): () => void {
  const layer = document.createElement('div');
  layer.className = 'victory-petals';
  layer.setAttribute('aria-hidden', 'true');
  board.append(layer);
  let timer: ReturnType<typeof setTimeout> | undefined;
  const cleanup = () => { clearTimeout(timer); layer.remove(); };
  if (reducedMotion()) { cleanup(); return cleanup; }
  for (let index = 0; index < 24; index++) {
    const petal = document.createElement('i');
    petal.style.setProperty('--petal-x', `${(index * 37) % 100}%`);
    petal.style.setProperty('--petal-delay', `${(index % 7) * 65}ms`);
    petal.style.setProperty('--petal-drift', `${((index * 23) % 100) - 50}px`);
    petal.style.setProperty('--petal-color', ['#f5be49','#fff3c8','#f28b7d','#79bdb0'][index % 4]);
    layer.append(petal);
  }
  timer = setTimeout(cleanup, 2600);
  return cleanup;
}
