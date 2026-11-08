import { useMemo } from "react";
import { Shape } from "three";
import { BASE } from "../constants";
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

  return (
    <group>
      {/* main body — extruded trapezoidal silhouette, bronze paint */}
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

      {/* darker skirt / foot plate under the body */}
      <mesh
        position={[0, -0.4, 0]}
        receiveShadow
        castShadow
      >
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
            <meshStandardMaterial
              color={PALETTE.frameBlack}
              roughness={0.9}
            />
          </mesh>
        )),
      )}
    </group>
  );
}
