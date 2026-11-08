import { useEffect, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { CARRIAGE, PAPER, PAPER_LOCAL_X, PLATEN } from "./constants";
import { charToBarIndex } from "./charToBar";
import { charToKey } from "./charToKey";
import type { CRLeverHandle } from "./parts/CRLever";
import type { KeyboardHandle } from "./parts/Keyboard";
import type { PaperHandle } from "./parts/Paper";
import type { TypebasketHandle } from "./parts/Typebasket";

type Refs = {
  carriage: RefObject<Group>;
  platen: RefObject<Group>;
  paper: RefObject<PaperHandle>;
  basket: RefObject<TypebasketHandle>;
  keyboard: RefObject<KeyboardHandle>;
  crLever: RefObject<CRLeverHandle>;
};

const PAPER_REST_X = PAPER_LOCAL_X;
const PAPER_REST_Y = PLATEN.radius + PAPER.height / 2;
const PAPER_REST_Z = PLATEN.radius + 0.08;
const PAPER_REST_PITCH = -0.14;
const RIP_MS = 1200;

type Mode = "shift" | "return";

type State = {
  col: number;
  row: number;
  carriageX: number;
  targetCarriageX: number;
  platenRot: number;
  targetPlatenRot: number;
  paperY: number;
  targetPaperY: number;
  mode: Mode;
  lastIndex: number;
  ripActive: boolean;
  ripStartedAt: number;
};

function makeState(): State {
  return {
    col: 0,
    row: 0,
    carriageX: CARRIAGE.homeX,
    targetCarriageX: CARRIAGE.homeX,
    platenRot: 0,
    targetPlatenRot: 0,
    paperY: 0,
    targetPaperY: 0,
    mode: "shift",
    lastIndex: 0,
    ripActive: false,
    ripStartedAt: 0,
  };
}

function processChar(
  ch: string,
  s: State,
  refs: Refs,
  silent: boolean,
): void {
  if (!ch) return;

  if (!silent) {
    const keyLabel = charToKey(ch);
    if (keyLabel) refs.keyboard.current?.press(keyLabel);
  }

  if (ch === "\n") {
    s.targetCarriageX = CARRIAGE.homeX;
    s.targetPlatenRot -= PAPER.lineHeight / PLATEN.radius;
    s.targetPaperY += PAPER.lineHeight;
    s.col = 0;
    s.row += 1;
    s.mode = "return";
    if (!silent) refs.crLever.current?.swing();
    return;
  }

  if (ch !== " ") {
    if (!silent) {
      const barIdx = charToBarIndex(ch);
      if (barIdx != null) refs.basket.current?.strike(barIdx);
    }
    refs.paper.current?.draw(ch, s.col, s.row);
  }
  s.targetCarriageX -= CARRIAGE.columnWidth;
  s.col += 1;
  s.mode = "shift";
}

export function useMechanism(
  refs: Refs,
  text: string,
  animateFrom: number,
  ripping: boolean,
): void {
  const state = useRef<State>(makeState());
  const didInit = useRef(false);

  useEffect(() => {
    const s = state.current;

    // First render: paint the prefix (everything up to animateFrom)
    // silently so previously-completed stanzas appear instantly on
    // the paper and the carriage/platen/paper snap to post-prefix state.
    if (!didInit.current) {
      didInit.current = true;
      refs.paper.current?.reset();
      for (let i = 0; i < animateFrom; i++) {
        processChar(text[i], s, refs, true);
      }
      s.lastIndex = animateFrom;
      s.carriageX = s.targetCarriageX;
      s.platenRot = s.targetPlatenRot;
      s.paperY = s.targetPaperY;
      s.mode = "shift";
    }

    // Each subsequent render advances through newly-typed characters
    // with full mechanism animations.
    while (s.lastIndex < text.length) {
      const ch = text[s.lastIndex];
      s.lastIndex += 1;
      processChar(ch, s, refs, false);
    }
  }, [text, animateFrom, refs.basket, refs.crLever, refs.keyboard, refs.paper]);

  useEffect(() => {
    if (ripping) {
      state.current.ripStartedAt = performance.now();
      state.current.ripActive = true;
    }
  }, [ripping]);

  useFrame((_, dt) => {
    const s = state.current;

    const car = refs.carriage.current;
    if (car) {
      const dur = s.mode === "return"
        ? CARRIAGE.returnDuration
        : CARRIAGE.shiftDuration;
      const k = 1 - Math.exp(-dt / dur);
      s.carriageX += (s.targetCarriageX - s.carriageX) * k;
      car.position.x = s.carriageX;
      if (
        s.mode === "return" &&
        Math.abs(s.targetCarriageX - s.carriageX) < 0.02
      ) {
        s.mode = "shift";
      }
    }

    const pl = refs.platen.current;
    if (pl) {
      const k = 1 - Math.exp(-dt / 0.28);
      s.platenRot += (s.targetPlatenRot - s.platenRot) * k;
      pl.rotation.y = s.platenRot;
    }

    const paperMesh = refs.paper.current?.mesh();
    if (paperMesh) {
      const k = 1 - Math.exp(-dt / 0.28);
      s.paperY += (s.targetPaperY - s.paperY) * k;

      if (s.ripActive) {
        const t = Math.min(
          1,
          (performance.now() - s.ripStartedAt) / RIP_MS,
        );
        const e = t * t;
        paperMesh.position.x = PAPER_REST_X + e * 8;
        paperMesh.position.y = PAPER_REST_Y + s.paperY + e * 18;
        paperMesh.position.z = PAPER_REST_Z + e * 22;
        paperMesh.rotation.x = PAPER_REST_PITCH + e * 1.3;
        paperMesh.rotation.z = e * 0.7;
        if (t >= 1) s.ripActive = false;
      } else {
        paperMesh.position.x = PAPER_REST_X;
        paperMesh.position.y = PAPER_REST_Y + s.paperY;
        paperMesh.position.z = PAPER_REST_Z;
        paperMesh.rotation.x = PAPER_REST_PITCH;
        paperMesh.rotation.z = 0;
      }
    }
  });
}
