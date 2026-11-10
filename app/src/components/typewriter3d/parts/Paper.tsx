import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { CanvasTexture, DoubleSide, type Mesh } from "three";
import { PAPER, PAPER_LOCAL_X, PAPER_REST_Y_LOCAL, PLATEN } from "../constants";
import { PALETTE } from "../palette";

export type PaperHandle = {
  draw(ch: string, col: number, row: number): void;
  drawHeader(text: string): number;
  reset(): void;
  setFeed(feed: number): void;
  mesh(): Mesh | null;
};

function paintBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
): void {
  const tone = ctx.createLinearGradient(0, 0, 0, h);
  tone.addColorStop(0, "#f4eddd");
  tone.addColorStop(0.48, PALETTE.paper);
  tone.addColorStop(1, "#f5eddc");
  ctx.fillStyle = tone;
  ctx.fillRect(0, 0, w, h);

  let seed = 0x5eed1234;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0x100000000;
  };

  // Fine, irregular fibers and flecks give the sheet a stable paper grain.
  for (let i = 0; i < 900; i++) {
    const x = random() * w;
    const y = random() * h;
    const length = 2 + random() * 14;
    const drift = (random() - 0.5) * 3;
    ctx.strokeStyle =
      random() < 0.65
        ? "rgba(112, 82, 45, 0.045)"
        : "rgba(255, 255, 245, 0.2)";
    ctx.lineWidth = 0.5 + random() * 0.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + length, y + drift);
    ctx.stroke();
  }

  for (let i = 0; i < 3200; i++) {
    const light = random() < 0.55;
    ctx.fillStyle = light
      ? "rgba(255, 255, 245, 0.22)"
      : "rgba(100, 72, 39, 0.055)";
    const size = 0.5 + random() * 0.8;
    ctx.fillRect(random() * w, random() * h, size, size);
  }

  const edge = ctx.createLinearGradient(0, 0, w, 0);
  edge.addColorStop(0, "rgba(110, 78, 40, 0.055)");
  edge.addColorStop(0.04, "rgba(110, 78, 40, 0)");
  edge.addColorStop(0.96, "rgba(110, 78, 40, 0)");
  edge.addColorStop(1, "rgba(110, 78, 40, 0.055)");
  ctx.fillStyle = edge;
  ctx.fillRect(0, 0, w, h);
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
  ctx.font = `700 ${PAPER.glyphFontSize}px "Courier Prime", "Courier New", monospace`;
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
  const flatZ = useRef<Float32Array | null>(null);
  const lastFeed = useRef(-1);

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

  const advancePx = PAPER.glyphWidthRatio * PAPER.glyphFontSize;
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
      setFeed(feed) {
        const mesh = meshRef.current;
        if (!mesh || Math.abs(feed - lastFeed.current) < 0.005) return;

        const positions = mesh.geometry.getAttribute("position");
        if (!flatZ.current || flatZ.current.length !== positions.count) {
          flatZ.current = Float32Array.from(
            { length: positions.count },
            (_, i) => positions.getZ(i),
          );
        }

        const fall = Math.min(
          2.4,
          Math.pow(Math.max(0, feed), 1.45) * 0.28,
        );
        for (let i = 0; i < positions.count; i++) {
          const height = Math.max(0, Math.min(1, (positions.getY(i) + 1) / 7));
          positions.setZ(i, flatZ.current[i] + fall * height * height);
        }
        positions.needsUpdate = true;
        mesh.geometry.computeVertexNormals();
        lastFeed.current = feed;
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
      <planeGeometry args={[PAPER.width, PAPER.height, 1, 48]} />
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
