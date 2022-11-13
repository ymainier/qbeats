import type { FC } from "react";
import { Box } from "@react-three/drei";

type KeyboardLineProps = {
  thickness: number;
  gridSize: number;
  objectSize: number;
};

export const KeyboardLine: FC<KeyboardLineProps> = ({
  thickness,
  gridSize,
  objectSize,
}) => (
  <group>
    <Box
      args={[gridSize * objectSize, thickness, thickness]}
      position={[0, 0, 0]}
    >
      <meshLambertMaterial color="#e4cd5a" />
    </Box>
  </group>
);
