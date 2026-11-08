import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { CanvasTexture, DoubleSide, type Mesh } from "three";
import { PAPER, PAPER_LOCAL_X, PAPER_REST_Y_LOCAL, PLATEN } from "../constants";
import { PALETTE } from "../palette";

export type PaperHandle = {
  draw(ch: string, col: number, row: number): void;
  drawHeader(text: string): number;
  reset(): void;
  mesh(): Mesh | null;
};

// Glyph advance (canvas px) must equal CARRIAGE.columnWidth * pixelsPerUnit
// so the typing visually tracks the carriage travel.
const GLYPH_PX = 22;
const GLYPH_W_RATIO = 0.613;

function paintBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
): void {
  ctx.fillStyle = PALETTE.paper;
  ctx.fillRect(0, 0, w, h);

  // subtle grain speckles
  ctx.fillStyle = "rgba(90, 65, 35, 0.045)";
  for (let i = 0; i < 2600; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    ctx.fillRect(x, y, 1, 1);
  }

  // faint horizontal fibre banding
  ctx.strokeStyle = "rgba(90, 65, 35, 0.035)";
  ctx.lineWidth = 1;
  for (let y = 0; y < h; y += 2) {
    if (Math.random() < 0.08) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  }
}

function drawGlyph(
  ctx: CanvasRenderingContext2D,
  ch: string,
  cx: number,
  cy: number,
): void {
  const jx = (Math.random() - 0.5) * 2.2;
  const jy = (Math.random() - 0.5) * 1.8;
  const alpha = 0.78 + Math.random() * 0.22;

  ctx.save();
  ctx.translate(cx + jx, cy + jy);
  ctx.rotate((Math.random() - 0.5) * 0.03);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = PALETTE.ink;
  ctx.font = `700 ${GLYPH_PX}px "Courier Prime", "Courier New", monospace`;
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillText(ch, 0, 0);
  // very faint over-strike for depth
  ctx.globalAlpha = alpha * 0.35;
  ctx.fillText(ch, 0.4, 0.3);
  ctx.restore();
}

const Paper = forwardRef<PaperHandle>(function Paper(_props, ref) {
  const meshRef = useRef<Mesh>(null);

  const { texture, ctx, size } = useMemo(() => {
    const w = Math.round(PAPER.width * PAPER.pixelsPerUnit);
    const h = Math.round(PAPER.height * PAPER.pixelsPerUnit);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    paintBackground(ctx, w, h);
    const texture = new CanvasTexture(canvas);
    texture.anisotropy = 4;
    texture.needsUpdate = true;
    return { texture, ctx, size: { w, h } };
  }, []);

  const advancePx = GLYPH_W_RATIO * GLYPH_PX;
  const leftPx = PAPER.leftMargin * PAPER.pixelsPerUnit;
  const linePx = PAPER.lineHeight * PAPER.pixelsPerUnit;
  const topPx = PAPER.topMargin * PAPER.pixelsPerUnit;

  useImperativeHandle(
    ref,
    () => ({
      draw(ch, col, row) {
        if (!ch || ch === "\n") return;
        if (ch === " ") return;
        const x = leftPx + col * advancePx;
        const y = topPx + row * linePx;
        drawGlyph(ctx, ch, x, y);
        texture.needsUpdate = true;
      },
      drawHeader(text) {
        // Trim leading/trailing blank lines so the art hugs the top margin.
        const lines = text.split("\n");
        while (lines.length && lines[0].trim() === "") lines.shift();
        while (lines.length && lines[lines.length - 1].trim() === "") {
          lines.pop();
        }
        for (let r = 0; r < lines.length; r++) {
          const line = lines[r];
          for (let c = 0; c < line.length; c++) {
            const ch = line[c];
            if (ch === " ") continue;
            drawGlyph(ctx, ch, leftPx + c * advancePx, topPx + r * linePx);
          }
        }
        texture.needsUpdate = true;
        return lines.length;
      },
      reset() {
        paintBackground(ctx, size.w, size.h);
        texture.needsUpdate = true;
      },
      mesh() {
        return meshRef.current;
      },
    }),
    [advancePx, ctx, leftPx, linePx, size.w, size.h, texture, topPx],
  );

  // Positioned inside the carriage: paper's bottom edge sits just above the
  // platen top (the strike line); the sheet tilts slightly away from the
  // typist so the written surface reads at an angle.
  return (
    <mesh
      ref={meshRef}
      position={[PAPER_LOCAL_X, PAPER_REST_Y_LOCAL, PLATEN.radius + 0.08]}
      rotation={[-0.14, 0, 0]}
      castShadow
    >
      <planeGeometry args={[PAPER.width, PAPER.height]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.92}
        metalness={0}
        side={DoubleSide}
      />
    </mesh>
  );
});

export default Paper;
