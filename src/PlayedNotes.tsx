import type { FC } from "react";
import { Box } from "@react-three/drei";
import type { NoteType } from "./data";
import { usePlayedNotes } from "./hooks";

type PlayedNoteProps = {
  note: NoteType;
  thickness: number;
  gridSize: number;
  objectSize: number;
};
const PlayedNote: FC<PlayedNoteProps> = ({
  note,
  thickness,
  gridSize,
  objectSize,
}) => (
  <group>
    <Box
      args={[objectSize + thickness, thickness, thickness]}
      position={[-(gridSize + objectSize) / 2 + note, 0, 0]}
    >
      <meshLambertMaterial color="#fff" />
    </Box>
  </group>
);

type PlayedNotesProps = Omit<PlayedNoteProps, "note">;
export const PlayedNotes: FC<PlayedNotesProps> = ({
  thickness,
  gridSize,
  objectSize,
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
        />
      ))}
    </group>
  );
};
