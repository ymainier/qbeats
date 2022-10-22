import { useMemo } from "react";
import type { FC } from "react";
import { Box } from "@react-three/drei";
import { MeshLambertMaterial } from "three";

type KeyboardLineProps = {
  thickness: number;
  gridSize: number;
  objectSize: number;
  color: string;
};

export const KeyboardLine: FC<KeyboardLineProps> = ({
  thickness,
  gridSize,
  objectSize,
  color,
}) => {
  const material = useMemo(() => new MeshLambertMaterial({ color }), [color]);
  return (
    <group>
      <Box
        args={[gridSize * objectSize, thickness, thickness]}
        position={[0, 0, 0]}
        material={material}
      />
    </group>
  );
};
