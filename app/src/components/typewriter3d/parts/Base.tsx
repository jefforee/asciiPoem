import { useMemo } from "react";
import { Shape } from "three";
import { Text } from "@react-three/drei";
import { BASE, DECK, NAMEPLATE } from "../constants";
import { PALETTE } from "../palette";

export default function Base() {
  const shape = useMemo(() => {
    const halfBot = BASE.width / 2;
    const halfTop = BASE.topWidth / 2;
    const s = new Shape();
    s.moveTo(-halfBot, 0);
    s.lineTo(halfBot, 0);
    s.lineTo(halfTop, BASE.height);
    s.lineTo(-halfTop, BASE.height);
    s.closePath();
    return s;
  }, []);

  const deckW = BASE.topWidth - DECK.margin * 2;
  const deckD = BASE.depth - DECK.margin * 2;

  return (
    <group>
      {/* main body — extruded trapezoidal silhouette, SHEFF bronze */}
      <mesh castShadow receiveShadow position={[0, 0, -BASE.depth / 2]}>
        <extrudeGeometry
          args={[
            shape,
            {
              depth: BASE.depth,
              bevelEnabled: true,
              bevelSize: 0.35,
              bevelThickness: 0.35,
              bevelSegments: 4,
              curveSegments: 1,
            },
          ]}
        />
        <meshStandardMaterial
          color={PALETTE.bodyMid}
          roughness={0.55}
          metalness={0.2}
        />
      </mesh>

      {/* dark deck on top of the body — the typebasket emerges from this */}
      <mesh
        position={[0, BASE.height + DECK.thickness / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[deckW, DECK.thickness, deckD]} />
        <meshStandardMaterial
          color={PALETTE.frameDark}
          roughness={0.55}
          metalness={0.35}
        />
      </mesh>

      {/* chrome trim strip around the deck edge */}
      <mesh
        position={[0, BASE.height + DECK.thickness, 0]}
        castShadow
      >
        <boxGeometry
          args={[deckW + 0.2, 0.08, deckD + 0.2]}
        />
        <meshStandardMaterial
          color={PALETTE.chrome}
          roughness={0.25}
          metalness={0.9}
        />
      </mesh>

      {/* SHEFF nameplate on the front face of the body */}
      <group position={[0, NAMEPLATE.y, BASE.depth / 2 + 0.02]}>
        <mesh castShadow>
          <boxGeometry
            args={[NAMEPLATE.width, NAMEPLATE.height, NAMEPLATE.thickness]}
          />
          <meshStandardMaterial
            color={PALETTE.plate}
            roughness={0.35}
            metalness={0.55}
          />
        </mesh>
        <Text
          position={[0, 0, NAMEPLATE.thickness / 2 + 0.01]}
          fontSize={0.9}
          color={PALETTE.plateInk}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.18}
        >
          {PALETTE.brand}
        </Text>
      </group>

      {/* darker skirt / foot plate under the body */}
      <mesh position={[0, -0.4, 0]} receiveShadow castShadow>
        <boxGeometry args={[BASE.width + 1.5, 0.6, BASE.depth + 1.2]} />
        <meshStandardMaterial
          color={PALETTE.frameBlack}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* rubber feet */}
      {([-1, 1] as const).flatMap((sx) =>
        ([-1, 1] as const).map((sz) => (
          <mesh
            key={`${sx}${sz}`}
            position={[
              sx * (BASE.width / 2 - 1.4),
              -0.95,
              sz * (BASE.depth / 2 - 1.4),
            ]}
            castShadow
          >
            <cylinderGeometry args={[0.55, 0.55, 0.55, 20]} />
            <meshStandardMaterial color={PALETTE.frameBlack} roughness={0.9} />
          </mesh>
        )),
      )}
    </group>
  );
}
