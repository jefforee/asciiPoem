// All units are "scene units" (≈ 1cm). Keep every part sized relative to these.

export const BASE = {
  width: 28,
  height: 6,
  depth: 20,
  topWidth: 24, // front silhouette is trapezoidal (narrower at top)
  // The base's local origin sits at the centre of the bottom face.
};

export const PLATEN = {
  radius: 1.6,
  length: 22,
  y: 7.6, // vertical centre of the platen above the table
  z: -5, // toward the back of the base
};

export const KNOB = {
  radius: 2.1,
  length: 1.2,
  gap: 0.25,
};

export const CARRIAGE = {
  homeX: 8, // carriage starts shifted right so the left paper margin lines up with the strike point
  minX: -8, // leftmost extent before "ding"
  columnWidth: 0.42, // X-distance the carriage travels per character
  shiftDuration: 0.08, // seconds
  returnDuration: 0.55, // seconds for the fly-back on CR
};

export const PAPER = {
  width: 17,
  height: 22,
  // Paper wraps the platen; its local origin is the top of the sheet above the platen.
  pixelsPerUnit: 48,
  columns: 48, // typable columns across the paper
  lineHeight: 1.4, // scene units per line
  topMargin: 2.2, // scene units from top of sheet to first line baseline
  leftMargin: 1.4, // scene units from left edge of sheet to column 0
};

export const STRIKE = {
  // Strike point in Typewriter-local coords — top of platen, centred in X.
  x: 0,
  y: PLATEN.y + PLATEN.radius + 0.05,
  z: PLATEN.z + 0.1,
};

export const TYPEBAR = {
  count: 32,
  arcRadius: 6.2,
  pivotY: 3.5,
  pivotZ: 1.5, // in front of the strike line; bars swing up and back to hit the platen
  restPitch: Math.PI * 0.42, // angle of a resting bar below horizontal
  strikePitch: -0.05, // angle when the hammer is at the platen
  length: 7,
  width: 0.35,
  thickness: 0.18,
  strikeMs: 110,
};

export const KEYBOARD = {
  rows: 4,
  rowGap: 2.1,
  colGap: 2.0,
  frontZ: 7.4, // Z of the front-most row (closest to the typist)
  baseY: 4.4, // Y of the lowest row's key top
  tier: 0.4, // Y rise per row back
  tilt: Math.PI / 14, // keyboard surface tilt
  keySize: 1.55,
  keyHeight: 0.9,
  travel: 0.35, // Y depression on press
  pressMs: 110,
};

export const RIBBON = {
  spoolRadius: 1.3,
  spoolHeight: 1.2,
  spoolY: 5.3,
  spoolZ: -1.6,
  spoolX: 9,
  stripWidth: 0.6,
  stripHeight: 0.08,
};

export const PAPER_BAIL = {
  radius: 0.12,
  length: 18,
  y: PLATEN.y + PLATEN.radius + 0.4,
  z: PLATEN.z + 1.3,
};
