import { useEffect, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { CARRIAGE, PAPER, PLATEN } from "./constants";
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

export function useMechanism(
  refs: Refs,
  typed: string,
  index: number,
  ripping: boolean,
): void {
  const state = useRef<State>(makeState());

  // Reset on source-text change (new poem / stanza / replay).
  useEffect(() => {
    state.current = makeState();
    refs.paper.current?.reset();
  }, [typed, refs.paper]);

  // Advance through newly-typed characters.
  useEffect(() => {
    const s = state.current;
    while (s.lastIndex < index) {
      const ch = typed[s.lastIndex];
      s.lastIndex++;
      if (!ch) continue;

      const keyLabel = charToKey(ch);
      if (keyLabel) refs.keyboard.current?.press(keyLabel);

      if (ch === "\n") {
        s.targetCarriageX = CARRIAGE.homeX;
        s.targetPlatenRot -= PAPER.lineHeight / PLATEN.radius;
        s.targetPaperY += PAPER.lineHeight;
        s.col = 0;
        s.row += 1;
        s.mode = "return";
        refs.crLever.current?.swing();
        continue;
      }

      if (ch !== " ") {
        const barIdx = charToBarIndex(ch);
        if (barIdx != null) refs.basket.current?.strike(barIdx);
        refs.paper.current?.draw(ch, s.col, s.row);
      }
      s.targetCarriageX -= CARRIAGE.columnWidth;
      s.col += 1;
      s.mode = "shift";
    }
  }, [index, typed, refs.basket, refs.crLever, refs.keyboard, refs.paper]);

  // Mark rip window — the actual fly-off runs from useFrame.
  useEffect(() => {
    if (ripping) {
      state.current.ripStartedAt = performance.now();
      state.current.ripActive = true;
    }
  }, [ripping]);

  useFrame((_, dt) => {
    const s = state.current;

    // Carriage: exponential ease to target, speed depends on mode.
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

    // Platen rotation (visible via marker stripe).
    const pl = refs.platen.current;
    if (pl) {
      const k = 1 - Math.exp(-dt / 0.28);
      s.platenRot += (s.targetPlatenRot - s.platenRot) * k;
      pl.rotation.y = s.platenRot;
    }

    // Paper rise relative to its rest position inside the carriage; also
    // owns the rip-off trajectory.
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
        paperMesh.position.x = e * 8;
        paperMesh.position.y = PAPER_REST_Y + s.paperY + e * 18;
        paperMesh.position.z = PAPER_REST_Z + e * 22;
        paperMesh.rotation.x = PAPER_REST_PITCH + e * 1.3;
        paperMesh.rotation.z = e * 0.7;
        if (t >= 1) s.ripActive = false;
      } else {
        paperMesh.position.x = 0;
        paperMesh.position.y = PAPER_REST_Y + s.paperY;
        paperMesh.position.z = PAPER_REST_Z;
        paperMesh.rotation.x = PAPER_REST_PITCH;
        paperMesh.rotation.z = 0;
      }
    }
  });
}
