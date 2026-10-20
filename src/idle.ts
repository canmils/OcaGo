import './idle.css';

type IdleRole = 'goose' | 'blink' | 'flutter' | 'water';
const roles: IdleRole[] = ['goose', 'blink', 'flutter', 'water'];

/** A small decorative cast stays alive without moving the board, labels or tokens. */
export function createIdleScene(root: Element): { destroy(): void } {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const selected = new Map<IdleRole, Element>();
  let destroyed = false;
  root.classList.add('idle-scene');

  function updatePause() {
    root.classList.toggle('idle-paused', document.hidden || preference.matches);
  }

  function reconcile() {
    if (destroyed) return;
    for (const role of roles) {
      // The destination art can take priority over repeated geese on route cells.
      const next = root.querySelector(`[data-idle="${role}"][data-idle-priority]`)
        ?? root.querySelector(`[data-idle="${role}"]`);
      const current = selected.get(role);
      if (current === next) continue;
      current?.classList.remove(`idle-${role}`);
      selected.delete(role);
      if (next) {
        next.classList.add(`idle-${role}`);
        selected.set(role, next);
      }
    }
  }

  const observer = new MutationObserver(reconcile);
  // Rendering tokens may replace children, but class changes never retrigger this observer.
  observer.observe(root, { childList: true, subtree: true });
  document.addEventListener('visibilitychange', updatePause);
  preference.addEventListener('change', updatePause);
  updatePause();
  reconcile();

  return {
    destroy() {
      if (destroyed) return;
      destroyed = true;
      observer.disconnect();
      document.removeEventListener('visibilitychange', updatePause);
      preference.removeEventListener('change', updatePause);
      for (const [role, element] of selected) element.classList.remove(`idle-${role}`);
      selected.clear();
      root.classList.remove('idle-scene', 'idle-paused');
    },
  };
}
