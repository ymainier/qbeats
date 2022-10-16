import type { FC } from "react";
import { KeyboardLine } from "./KeyboardLine";
import { PlayedNotes } from "./PlayedNotes";
import { usePlayedNotes } from "./hooks";

type KeyboardLineWithPlayedNotesProps = {
  gridSize: number;
  objectSize: number;
  gridColor: string;
  gridThickness: number;
  playedNotesColor: string;
  playedNotesThickness: number;
};
export const KeyboardLineWithPlayedNotes: FC<KeyboardLineWithPlayedNotesProps> = ({
  gridSize,
  objectSize,
  gridColor,
  gridThickness,
  playedNotesColor,
  playedNotesThickness,
}) => {
  const notes = usePlayedNotes();

  return (
    <group>
      <KeyboardLine
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
