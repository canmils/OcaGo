import './technical-art.css';

export type ArrivalKind = 'goose' | 'bridge' | 'rest' | 'setback' | 'finish';

/** Decorative garden treatment. Owns only its classes, variables and effect nodes. */
export function createBoardAtmosphere(board: HTMLElement) {
  board.classList.add('garden-atmosphere');
  const colors = ['#c95d43', '#4d71b1', '#8458a2'];
  const trail: HTMLElement[] = [];
  const effects = new Set<() => void>();
  let focused: HTMLElement | undefined;
  let previousPlayer = -1;
  let destroyed = false;

  function clearFocus() {
    focused?.classList.remove('traveler-focus');
    focused?.style.removeProperty('--traveler-color');
    focused = undefined;
    trail.forEach(tile => tile.classList.remove('traveler-trail'));
    trail.length = 0;
  }

  function focus(position: number, playerIndex: number) {
    if (destroyed) return;
    if (position <= 0) { clearFocus(); previousPlayer = playerIndex; return; }
    const next = position > 0 ? board.querySelector<HTMLElement>(`#cell-${position}`) ?? undefined : undefined;
    if (next === focused && previousPlayer === playerIndex) return;
    if (previousPlayer !== playerIndex) clearFocus();
    if (focused) {
      focused.classList.remove('traveler-focus');
      focused.style.removeProperty('--traveler-color');
      focused.classList.add('traveler-trail');
      trail.push(focused);
      if (trail.length > 2) trail.shift()?.classList.remove('traveler-trail');
    }
    // A bounce may return to a tile already in the short trail.
    if (next) {
      const index = trail.indexOf(next);
      if (index >= 0) trail.splice(index, 1);
      next.classList.remove('traveler-trail');
      next.classList.add('traveler-focus');
      next.style.setProperty('--traveler-color', colors[playerIndex] ?? colors[0]);
    }
    focused = next;
    previousPlayer = playerIndex;
  }

  async function arrive(position: number, kind: ArrivalKind, signal?: AbortSignal): Promise<void> {
    if (destroyed || signal?.aborted || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tile = board.querySelector<HTMLElement>(`#cell-${position}`);
    if (!tile || typeof tile.animate !== 'function') return;
    const ring = document.createElement('span');
    ring.className = `garden-arrival garden-arrival--${kind}`;
    ring.setAttribute('aria-hidden', 'true');
    tile.append(ring);
    const animation = ring.animate([
      { opacity: 0, transform: 'scale(.78)' },
      { opacity: .95, transform: 'scale(1.04)', offset: .3 },
      { opacity: 0, transform: 'scale(1.28)' }
    ], { duration: 420, easing: 'ease-out' });
    const cleanup = () => { animation.cancel(); ring.remove(); };
    effects.add(cleanup);
    signal?.addEventListener('abort', cleanup, { once: true });
    try { await animation.finished; } catch { /* Restart and teardown settle immediately. */ }
    finally {
      signal?.removeEventListener('abort', cleanup);
      effects.delete(cleanup);
      cleanup();
    }
  }

  function reset() {
    effects.forEach(cleanup => cleanup());
    effects.clear();
    clearFocus();
    previousPlayer = -1;
  }

  function destroy() {
    reset();
    destroyed = true;
    board.classList.remove('garden-atmosphere');
  }

  return { focus, arrive, reset, destroy };
}
