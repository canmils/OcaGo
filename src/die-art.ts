/** Original OcaGo die faces. Consistent SVG pips instead of OS-dependent emoji. */

const body = '#fff8e7';
const edge = '#2e5c4d';
const pip = '#2e5c4d';

const faces: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[31, 31], [69, 69]],
  3: [[28, 28], [50, 50], [72, 72]],
  4: [[31, 31], [69, 31], [31, 69], [69, 69]],
  5: [[31, 31], [69, 31], [50, 50], [31, 69], [69, 69]],
  6: [[31, 25], [69, 25], [31, 50], [69, 50], [31, 75], [69, 75]],
};

function pipMark(x: number, y: number): string {
  return `<circle cx="${x}" cy="${y}" r="8.5" fill="${pip}"/><circle cx="${x - 2.4}" cy="${y - 2.4}" r="2.6" fill="${body}" opacity=".55"/>`;
}

/** A complete die illustration: rounded body, inked edge and pips for values 1–6. */
export function dieFaceSVG(value: number): string {
  const dots = (faces[value] ?? faces[5]).map(([x, y]) => pipMark(x, y)).join('');
  return `<svg class="die-face" viewBox="0 0 100 100" role="img" aria-hidden="true" focusable="false"><rect x="3" y="3" width="94" height="94" rx="20" fill="${body}" stroke="${edge}" stroke-width="3"/><rect x="10" y="10" width="80" height="80" rx="14" fill="none" stroke="${edge}" stroke-width="1" opacity=".22"/>${dots}</svg>`;
}

/** Paint a face without touching its accessible name, which the callers own. */
export function setDieFace(el: HTMLElement, value: number): void {
  el.innerHTML = dieFaceSVG(value);
  el.dataset.face = String(value);
}
