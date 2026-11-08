// All units are "scene units" (≈ 1cm). Keep every part sized relative to these.

export const BASE = {
  width: 30,
  height: 7,
  depth: 22,
  topWidth: 25,
};

export const PLATEN = {
  radius: 1.5,
  length: 16,
  y: 8.6,
  z: -5.5,
};

export const KNOB = {
  radius: 2.0,
  length: 1.1,
  gap: 0.25,
};

export const PAPER = {
  width: 14,
  height: 18,
  pixelsPerUnit: 54,
  columns: 48,
  lineHeight: 1.3,
  topMargin: 1.6,
  leftMargin: 1.0,
};

// Paper is centred on the carriage so the platen, paper, and knobs read
// as a symmetric assembly. The carriage itself is shifted right at home
// so that the paper's canvas col-0 lands on the world-fixed strike point.
export const PAPER_LOCAL_X = 0;

export const CARRIAGE = {
  // homeX puts canvas col-0 under the strike at world x = 0:
  //   col-0 world = homeX + PAPER_LOCAL_X + (-width/2 + leftMargin)
  //              = homeX + 0 + (-7 + 1) = homeX - 6
  homeX: 6,
  minX: -6,
  columnWidth: 0.25,
  shiftDuration: 0.07,
  returnDuration: 0.55,
};

export const STRIKE = {
  x: 0,
  y: PLATEN.y + PLATEN.radius + 0.05,
  z: PLATEN.z + 0.1,
};

// Typebar geometry — pivots sit just above the body deck so bars are
// visibly outside the chassis. arcRadius is derived so the hammer at
// strikePitch lands exactly on STRIKE.
const _TB_PIVOT_Y = 7.6;
const _TB_LENGTH = 4;
const _TB_STRIKE_PITCH = Math.asin((STRIKE.y - _TB_PIVOT_Y) / _TB_LENGTH);

export const TYPEBAR = {
  count: 22,
  pivotY: _TB_PIVOT_Y,
  length: _TB_LENGTH,
  arcRadius: _TB_LENGTH * Math.cos(_TB_STRIKE_PITCH),
  arcSpan: Math.PI / 1.35,
  width: 0.3,
  thickness: 0.15,
  restPitch: -0.12,
  strikePitch: _TB_STRIKE_PITCH,
  strikeMs: 95,
  hammerW: 0.5,
  hammerH: 0.7,
  hammerD: 0.28,
};

export const KEYBOARD = {
  rows: 4,
  rowGap: 1.75,
  colGap: 1.8,
  frontZ: 8.3,
  baseY: 7.5, // cap-centre Y; rim rests on the deck top
  tier: 0.08,
  tilt: Math.PI / 14,
  keySize: 1.35,
  keyHeight: 0.75,
  travel: 0.28,
  pressMs: 110,
};

export const NAMEPLATE = {
  width: 7,
  height: 1.5,
  thickness: 0.18,
  y: 3.5,
};

export const DECK = {
  thickness: 0.1,
  margin: 0.4,
};

export const RIBBON = {
  spoolRadius: 1.2,
  spoolHeight: 1.1,
  spoolY: 6.2,
  spoolZ: -2.3,
  spoolX: 8.2,
  stripWidth: 0.55,
  stripHeight: 0.08,
};

// LOCAL to the carriage (not world). The carriage's origin sits at the
// platen's centre, so y/z here are offsets from there.
export const PAPER_BAIL = {
  radius: 0.12,
  length: 13,
  y: PLATEN.radius + 0.4,
  z: 1.3,
};
