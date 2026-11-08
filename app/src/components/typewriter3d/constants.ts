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

export const TYPEBAR = {
  count: 22,
  arcRadius: 4.3,
  pivotY: 4.6,
  arcSpan: Math.PI / 1.35,
  length: 7,
  width: 0.34,
  thickness: 0.16,
  restPitch: -0.55,
  strikePitch: Math.asin((STRIKE.y - 4.6) / 7),
  strikeMs: 95,
  hammerW: 0.55,
  hammerH: 0.75,
  hammerD: 0.3,
};

export const KEYBOARD = {
  rows: 4,
  rowGap: 1.85,
  colGap: 1.85,
  frontZ: 8.5,
  baseY: 5.2,
  tier: 0.3,
  tilt: Math.PI / 14,
  keySize: 1.4,
  keyHeight: 0.8,
  travel: 0.32,
  pressMs: 110,
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
