import test from 'node:test';
import assert from 'node:assert/strict';
import {dieFaceSVG} from '../src/die-art';

const pipCount = (svg: string) => (svg.match(/r="8\.5"/g) ?? []).length;

test('every die face is an original SVG icon, never an emoji', () => {
  for (let value = 1; value <= 6; value++) {
    const svg = dieFaceSVG(value);
    assert.match(svg, /^<svg\b/, `face ${value} is an SVG`);
    assert.match(svg, /aria-hidden="true"/, `face ${value} stays decorative`);
    assert.doesNotMatch(svg, /[\u2680-\u2685]/, `face ${value} contains no die emoji`);
    assert.doesNotMatch(svg, /<img\b/, `face ${value} needs no external asset`);
  }
});

test('pip counts match the die value', () => {
  for (let value = 1; value <= 6; value++) {
    assert.equal(pipCount(dieFaceSVG(value)), value, `face ${value} has ${value} pips`);
  }
});

test('all six faces are visually distinct', () => {
  const faces = new Set(Array.from({length: 6}, (_, index) => dieFaceSVG(index + 1)));
  assert.equal(faces.size, 6);
});
