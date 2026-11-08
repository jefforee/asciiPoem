// All units are "scene units" (≈ 1cm). Keep every part sized relative to these.

export const BASE = {
  width: 30,
  height: 7,
  depth: 22,
  topWidth: 25,
};

export const PLATEN = {
  radius: 1.5,
  length: 18,
  y: 8.6,
  z: -5.5,
};

export const KNOB = {
  radius: 2.0,
  length: 1.1,
  gap: 0.25,
};

export const PAPER = {
  width: 16,
  height: 18,
  pixelsPerUnit: 54,
  columns: 48,
  lineHeight: 1.3,
  topMargin: 1.6,
  leftMargin: 1.0,
};

// Paper's local X offset inside the carriage is set so canvas column 0
// lives at carriage-local x = 0. That way the carriage can sit centred
// at home (homeX = 0) and the platen stays symmetric relative to the
// body, which reads much more like a real typewriter.
export const PAPER_LOCAL_X = PAPER.width / 2 - PAPER.leftMargin;

export const CARRIAGE = {
  homeX: 0,
  minX: -12,
  // Scene-units per typed character. Set equal to the canvas glyph advance
  // so strike-point and canvas column stay aligned across a full line.
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

export const PAPER_BAIL = {
  radius: 0.12,
  length: 15,
  y: PLATEN.y + PLATEN.radius + 0.4,
  z: PLATEN.z + 1.3,
};
