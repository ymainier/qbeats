import { FC, useLayoutEffect, useRef } from "react";
import { Group } from "three";
import { useThree } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { useControls } from "leva";

import { COLORS, OBJECT_SIZE, SONG, minMax } from "./data";
import { Notes } from "./Notes";
import { KeyboardLineWithPlayedNotes } from "./KeyboardLineWithPlayedNotes";

export const Scene: FC = () => {
  const song = SONG;
  const [low, high] = minMax(song);
  const gridSize = high - low + 1;
  const camera = useThree((state) => state.camera);
  const viewport = useThree((state) => state.viewport);
  const groupRef = useRef<Group>(null);

  useControls({
    position: {
      value: {
        x: 0,
        y: 3,
        z: 6,
      },
      step: 0.1,
      onChange({ x, y, z }) {
        camera.position.set(x, y, z);
      },
    },
  });
  useLayoutEffect(() => {
    camera.position.set(0, 3, 6);
  }, [camera]);
  useLayoutEffect(() => {
    const scale = viewport.getCurrentViewport().width / (gridSize + 3)
    groupRef.current?.scale.set(scale, scale, scale);
  }, [gridSize, viewport]);

  return (
    <group ref={groupRef}>
      <Stats />
      <ambientLight />
      <directionalLight position={[-150, 150, -150]} intensity={0.55} />
      <Notes song={song} color={COLORS[0]} objectSize={OBJECT_SIZE} />
      <KeyboardLineWithPlayedNotes
        gridSize={gridSize}
        objectSize={OBJECT_SIZE}
        gridColor={COLORS[1]}
        gridThickness={OBJECT_SIZE * 0.101}
        playedNotesColor={COLORS[2]}
        playedNotesThickness={OBJECT_SIZE * 0.102}
      />
    </group>
  );
};
