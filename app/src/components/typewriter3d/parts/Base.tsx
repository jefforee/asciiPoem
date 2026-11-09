import { useMemo } from "react";
import { RoundedBox, Text } from "@react-three/drei";
import { Path, Shape } from "three";
import { BASE, DECK } from "../constants";
import { PALETTE } from "../palette";

function roundedRect(
  path: Shape | Path,
  width: number,
  height: number,
  radius: number,
  clockwise = false,
): void {
  const x = width / 2;
  const y = height / 2;
  const r = Math.min(radius, x, y);

  if (!clockwise) {
    path.moveTo(-x + r, -y);
    path.lineTo(x - r, -y);
    path.quadraticCurveTo(x, -y, x, -y + r);
    path.lineTo(x, y - r);
    path.quadraticCurveTo(x, y, x - r, y);
    path.lineTo(-x + r, y);
    path.quadraticCurveTo(-x, y, -x, y - r);
    path.lineTo(-x, -y + r);
    path.quadraticCurveTo(-x, -y, -x + r, -y);
  } else {
    path.moveTo(-x + r, -y);
    path.lineTo(-x, -y + r);
    path.lineTo(-x, y - r);
    path.quadraticCurveTo(-x, y, -x + r, y);
    path.lineTo(x - r, y);
    path.quadraticCurveTo(x, y, x, y - r);
    path.lineTo(x, -y + r);
    path.quadraticCurveTo(x, -y, x - r, -y);
    path.closePath();
  }
}

export default function Base() {
  const { shape, keyboardFrame } = useMemo(() => {
    const xAtZ = (z: number) => -z;
    const s = new Shape();
    s.moveTo(xAtZ(-BASE.depth / 2), 0);
    s.lineTo(xAtZ(BASE.depth / 2), 0);
    s.lineTo(xAtZ(BASE.depth / 2), 0.75);
    s.quadraticCurveTo(xAtZ(BASE.depth / 2), 2.7, xAtZ(9.5), 3.7);
    s.lineTo(xAtZ(-0.3), 5.7);
    s.quadraticCurveTo(xAtZ(-1.5), 5.65, xAtZ(-3.2), 5.45);
    s.quadraticCurveTo(xAtZ(-3.7), 5.4, xAtZ(-4.05), 4.82);
    s.lineTo(xAtZ(-7), 4.82);
    s.quadraticCurveTo(xAtZ(-7.55), 4.82, xAtZ(-7.9), 5.45);
    s.quadraticCurveTo(xAtZ(-8.2), 6.15, xAtZ(-8.8), 6.35);
    s.quadraticCurveTo(xAtZ(-9.8), 6.7, xAtZ(-10.65), 6.25);
    s.quadraticCurveTo(xAtZ(-11), 6.05, xAtZ(-BASE.depth / 2), 5.45);
    s.closePath();

    const frame = new Shape();
    roundedRect(frame, 24.1, 10.6, 1.2);
    const opening = new Path();
    roundedRect(opening, 21.6, 8.35, 0.85, true);
    frame.holes.push(opening);

    return { shape: s, keyboardFrame: frame };
  }, []);

  const deckW = BASE.topWidth - DECK.margin * 2;
  const keyboardDeckAngle = -Math.PI / 2 + Math.atan(0.2);
  const keyboardDeckPosition: [number, number, number] = [0, 4.865, 4.6];

  return (
    <group>
      {/* Main shell rises behind the keyboard and leaves the typebasket open. */}
      <mesh
        castShadow
        receiveShadow
        position={[-BASE.width / 2, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <extrudeGeometry
          args={[
            shape,
            {
              depth: BASE.width,
              bevelEnabled: true,
              bevelSize: 0.38,
              bevelThickness: 0.32,
              bevelSegments: 12,
              curveSegments: 10,
            },
          ]}
        />
        <meshStandardMaterial
          color={PALETTE.bodyTop}
          roughness={0.42}
          metalness={0.08}
        />
      </mesh>

      <mesh
        position={keyboardDeckPosition}
        rotation={[keyboardDeckAngle, 0, 0]}
        castShadow
        receiveShadow
      >
        <RoundedBox
          args={[deckW, 9.8, DECK.thickness]}
          radius={0.06}
          smoothness={6}
        >
          <meshStandardMaterial
            color={PALETTE.bodyTop}
            roughness={0.42}
            metalness={0.08}
          />
        </RoundedBox>
      </mesh>

      <group
        position={keyboardDeckPosition}
        rotation={[keyboardDeckAngle, 0, 0]}
      >
        <RoundedBox
          args={[21.55, 8.3, 0.12]}
          position={[0, 0, 0.08]}
          radius={0.06}
          smoothness={6}
          receiveShadow
        >
          <meshStandardMaterial
            color={PALETTE.bodyBot}
            roughness={0.7}
            metalness={0.02}
          />
        </RoundedBox>
        <mesh
          position={[0, 0, 0.16]}
          castShadow
          receiveShadow
        >
          <extrudeGeometry
            args={[
              keyboardFrame,
              {
                depth: 0.35,
                bevelEnabled: true,
                bevelSegments: 5,
                bevelSize: 0.09,
                bevelThickness: 0.08,
              },
            ]}
          />
          <meshStandardMaterial
            color={PALETTE.bodyTop}
            roughness={0.42}
            metalness={0.08}
          />
        </mesh>
      </group>

      <RoundedBox
        args={[BASE.width - 6, 0.08, 2.8]}
        position={[0, 4.86, -5.5]}
        radius={0.08}
        smoothness={6}
        receiveShadow
      >
        <meshStandardMaterial
          color={PALETTE.bodyMid}
          roughness={0.6}
          metalness={0.03}
        />
      </RoundedBox>

      <group position={[0, 5.7, -0.3]} rotation={[keyboardDeckAngle, 0, 0]}>
        <RoundedBox
          args={[4.6, 0.62, 0.08]}
          position={[0, 0, 0.38]}
          radius={0.12}
          smoothness={8}
          castShadow
        >
          <meshStandardMaterial
            color={PALETTE.plate}
            roughness={0.48}
            metalness={0.05}
          />
        </RoundedBox>
        <Text
          position={[0, 0, 0.427]}
          fontSize={0.26}
          color={PALETTE.plateInk}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.015}
        >
          {PALETTE.brand} LETTERA 35
        </Text>
      </group>

      {/* darker skirt / foot plate under the body */}
      <RoundedBox
        args={[BASE.width + 1.5, 0.6, BASE.depth + 1.2]}
        position={[0, -0.4, 0]}
        radius={0.28}
        smoothness={8}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial
          color={PALETTE.frameBlack}
          roughness={0.7}
          metalness={0.1}
        />
      </RoundedBox>

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
