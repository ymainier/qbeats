import { useMemo } from "react";
import type { FC } from "react";
import { Box } from "@react-three/drei";
import { MeshLambertMaterial } from "three";
import type { NoteType } from "./data";

type PlayedNoteProps = {
  note: NoteType;
  thickness: number;
  gridSize: number;
  objectSize: number;
  color: string;
};
const PlayedNote: FC<PlayedNoteProps> = ({
  note,
  thickness,
  gridSize,
  objectSize,
  color,
}) => {
  const material = useMemo(
    () => new MeshLambertMaterial({ color }),
    [color]
  );

  return (
    <group>
      {/* @ts-ignore */}
      <Box
        args={[thickness, thickness, objectSize + thickness]}
        position={[-(gridSize + objectSize) / 2 + note - 1, 0, 0]}
        material={material}
      />
      {/* @ts-ignore */}
      <Box
        args={[thickness, thickness, objectSize + thickness]}
        position={[-(gridSize + objectSize) / 2 + note, 0, 0]}
        material={material}
      />
      {/* @ts-ignore */}
      <Box
        args={[objectSize + thickness, thickness, thickness]}
        position={[-(gridSize + objectSize + 1) / 2 + note, 0, -objectSize / 2]}
        material={material}
      />
      {/* @ts-ignore */}
      <Box
        args={[objectSize + thickness, thickness, thickness]}
        position={[-(gridSize + objectSize + 1) / 2 + note, 0, objectSize / 2]}
        material={material}
      />
    </group>
  );
};

type PlayedNotesProps = Omit<PlayedNoteProps, "note"> & {
  notes: Array<NoteType>;
};
export const PlayedNotes: FC<PlayedNotesProps> = ({
  notes,
  thickness,
  gridSize,
  objectSize,
  color,
}) => {
  return (
    <group>
      {notes.map((note) => (
        <PlayedNote
          key={note}
          note={note}
          thickness={thickness}
          gridSize={gridSize}
          objectSize={objectSize}
          color={color}
        />
      ))}
    </group>
  );
};
