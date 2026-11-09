import { forwardRef, useImperativeHandle, useRef } from "react";
import { STRIKE, TYPEBAR } from "../constants";
import { PALETTE } from "../palette";
import Typebar, { type TypebarHandle } from "./Typebar";

export type TypebasketHandle = {
  strike(index: number): void;
};

const Typebasket = forwardRef<TypebasketHandle>(function Typebasket(_, ref) {
  const bars = useRef<Array<TypebarHandle | null>>([]);

  useImperativeHandle(
    ref,
    () => ({
      strike(i: number) {
        bars.current[i]?.strike();
      },
    }),
    [],
  );

  const n = TYPEBAR.count;
  const halfSpan = TYPEBAR.arcSpan / 2;

  return (
    <group>
      {/* segment ring: a flat annulus marking the bars' pivot plane */}
      <mesh
        position={[0, TYPEBAR.pivotY - 0.08, STRIKE.z]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <ringGeometry
          args={[TYPEBAR.arcRadius - 0.6, TYPEBAR.arcRadius + 0.6, 64, 1]}
        />
        <meshStandardMaterial
          color={PALETTE.frameBlack}
          roughness={0.5}
          metalness={0.5}
        />
      </mesh>

      {Array.from({ length: n }).map((_bar, i) => {
        const t = n === 1 ? 0.5 : i / (n - 1);
        const theta = -halfSpan + t * TYPEBAR.arcSpan;
        const px = Math.sin(theta) * TYPEBAR.arcRadius;
        const pz = STRIKE.z + Math.cos(theta) * TYPEBAR.arcRadius;
        return (
          <group key={i} position={[px, TYPEBAR.pivotY, pz]}>
            <Typebar
              ref={(el) => {
                bars.current[i] = el;
              }}
              yaw={theta}
            />
          </group>
        );
      })}
    </group>
  );
});

export default Typebasket;
