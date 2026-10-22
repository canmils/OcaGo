import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// UX-004 / PR #12: the turn status line must be readable (>=13px) at every
// viewport. The browser suite measures the computed value at runtime; this
// test pins the CSS contract so a breakpoint regression is caught by `npm test`
// alone. Both the base rule and the two mobile media blocks set the size.
const css = readFileSync(new URL('../src/style.css', import.meta.url), 'utf8');

/** All font-size declarations of `.status` rules outside any media block. */
function statusFontSizesOutsideMedia(): number[] {
  const withoutMedia = css.replace(/@media[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, '');
  const sizes: number[] = [];
  for (const match of withoutMedia.matchAll(/\.status\{([^}]*)\}/g)) {
    const size = /font-size:\s*([\d.]+)px/.exec(match[1]);
    if (size) sizes.push(Number(size[1]));
  }
  return sizes;
}

/** The font-size of the `.status` rule inside the `max-width:<px>` media block. */
function statusFontSizeInMedia(maxWidth: number): number | undefined {
  const block = new RegExp(`@media\\(max-width:${maxWidth}px\\)\\{((?:[^{}]*\\{[^{}]*\\})*)[^{}]*\\}`).exec(css);
  assert(block, `expected a max-width:${maxWidth}px media block in src/style.css`);
  const rule = /\.status\{([^}]*)\}/.exec(block[1]);
  assert(rule, `expected a .status rule inside the max-width:${maxWidth}px block`);
  const size = /font-size:\s*([\d.]+)px/.exec(rule[1]);
  return size ? Number(size[1]) : undefined;
}

test('status font size is at least 13px in the base rule and every mobile breakpoint (UX-004)', () => {
  const base = statusFontSizesOutsideMedia();
  assert(base.length >= 1, 'expected a base .status rule');
  for (const size of base) assert(size >= 13, `base .status font-size ${size}px < 13px`);
  for (const maxWidth of [650, 360]) {
    const size = statusFontSizeInMedia(maxWidth);
    assert(size !== undefined, `max-width:${maxWidth}px block must declare a .status font-size`);
    assert(size >= 13, `.status font-size ${size}px at max-width:${maxWidth}px < 13px`);
  }
});

test('desktop status keeps its 54px minimum-height reserve (UX-004 regression)', () => {
  const withoutMedia = css.replace(/@media[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, '');
  const rule = /\.status\{([^}]*)\}/.exec(withoutMedia);
  assert(rule, 'expected a base .status rule');
  const reserve = /min-height:\s*([\d.]+)px/.exec(rule[1]);
  assert(reserve, 'base .status must keep a min-height reserve');
  assert(Number(reserve[1]) >= 54, `base .status min-height ${reserve[1]}px < 54px`);
});

test('status contrast on the turn card is unchanged and still passes AA (UX-004 regression)', () => {
  const hex = (selector: string, property: 'color' | 'background'): string => {
    const withoutMedia = css.replace(/@media[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, '');
    const rule = new RegExp(`${selector.replace('.', '\\.')}\\{([^}]*)\\}`).exec(withoutMedia);
    assert(rule, `expected a ${selector} rule`);
    const declaration = property === 'color' ? /(?:^|;|\s)color:\s*(#[0-9a-fA-F]{6})/ : /background:\s*(#[0-9a-fA-F]{6})/;
    const value = declaration.exec(rule[1]);
    assert(value, `expected ${selector} to declare ${property}`);
    return value[1];
  };
  const channel = (hexcode: string, offset: number) => parseInt(hexcode.slice(offset, offset + 2), 16) / 255;
  const luminance = (hexcode: string) => {
    const tone = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return 0.2126 * tone(channel(hexcode, 1)) + 0.7152 * tone(channel(hexcode, 3)) + 0.0722 * tone(channel(hexcode, 5));
  };
  const foreground = hex('.status', 'color');
  const background = hex('.turn-card', 'background');
  const [light, dark] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  const ratio = (light + 0.05) / (dark + 0.05);
  assert(Math.abs(ratio - 6.43) < 0.15,
    `status contrast ${ratio.toFixed(2)}:1 drifted from the audited 6.43:1 (${foreground} on ${background})`);
  assert(ratio >= 4.5, `status contrast ${ratio.toFixed(2)}:1 below WCAG AA`);
});
