import { useEffect, useRef } from "react";
import type { FC } from "react";
import { Grid } from "./Grid";
import { PlayedNotes } from "./PlayedNotes";
import { useNotes } from "./hooks";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";

type GridWithPlayedNotesProps = {
  gridSize: number;
  objectSize: number;
  gridColor: string;
  gridThickness: number;
  playedNotesColor: string;
  playedNotesThickness: number;
  initialCameraZ: number;
  songLength: number;
};
export const GridWithPlayedNotes: FC<GridWithPlayedNotesProps> = ({
  gridSize,
  objectSize,
  gridColor,
  gridThickness,
  playedNotesColor,
  playedNotesThickness,
  initialCameraZ,
  songLength,
}) => {
  const isPausedRef = useRef(false);
  const groupRef = useRef<Group>();
  const notes = useNotes();

  useEffect(() => {
    const onKeyDown = ({ code }: KeyboardEvent) => {
      if (code === 'Space') {
        isPausedRef.current = !isPausedRef.current;
      }
    };
    window.addEventListener("keydown", onKeyDown, false);
    return () => {
      window.removeEventListener("keydown", onKeyDown, false);
    };
  }, []);

  useFrame(({ camera }, delta) => {
    if (!groupRef.current || isPausedRef.current) return;
    if (groupRef.current.position.z < -songLength - 2) {
      camera.position.z = initialCameraZ;
      groupRef.current.position.z = 0;
      isPausedRef.current = true;
    } else {
      camera.position.z -= delta;
      groupRef.current.position.z -= delta;
    }
  });

  return (
    <group ref={groupRef}>
      <Grid
        thickness={gridThickness}
        gridSize={gridSize}
        objectSize={objectSize}
        color={gridColor}
      />
      <PlayedNotes
        notes={notes}
        thickness={playedNotesThickness}
        gridSize={gridSize}
        objectSize={objectSize}
        color={playedNotesColor}
      />
    </group>
  );
};
