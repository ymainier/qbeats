import { useMemo } from "react";
import type { FC } from "react";
import { Box } from "@react-three/drei";
import { MeshLambertMaterial } from "three";

type GridProps = {
  thickness: number;
  gridSize: number;
  objectSize: number;
  color: string;
};

export const Grid: FC<GridProps> = ({
  thickness,
  gridSize,
  objectSize,
  color,
}) => {
  const material = useMemo(() => new MeshLambertMaterial({ color }), [color]);
  return (
    <group>
      {/* @ts-ignore */}
      <Box
        args={[(gridSize + 1) * objectSize, thickness, thickness]}
        position={[0, 0, -objectSize / 2]}
        material={material}
      />
      {/* @ts-ignore */}
      <Box
        args={[(gridSize + 1) * objectSize, thickness, thickness]}
        position={[0, 0, objectSize / 2]}
        material={material}
      />
      {Array.from({ length: gridSize + 2 }).map((_, i) => (
        // @ts-ignore
        <Box
          key={i}
          args={[thickness, thickness, objectSize + thickness]}
          position={[-(gridSize + objectSize) / 2 + i, 0, 0]}
          material={material}
        />
      ))}
    </group>
  );
};
