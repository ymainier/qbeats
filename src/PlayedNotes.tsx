import { useMemo } from "react";
import type { FC } from "react";
import { Box } from "@react-three/drei";
import { MeshLambertMaterial } from "three";
import type { NoteType } from "./data";
import { usePlayedNotes } from "./hooks";

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
  const material = useMemo(() => new MeshLambertMaterial({ color }), [color]);

  return (
    <group>
      <Box
        args={[objectSize + thickness, thickness, thickness]}
        position={[-(gridSize + objectSize) / 2 + note, 0, 0]}
        material={material}
      />
    </group>
  );
};

type PlayedNotesProps = Omit<PlayedNoteProps, "note">;
export const PlayedNotes: FC<PlayedNotesProps> = ({
  thickness,
  gridSize,
  objectSize,
  color,
}) => {
  const notes = usePlayedNotes();

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
