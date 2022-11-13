import type { FC } from "react";
import { KeyboardLine } from "./KeyboardLine";
import { PlayedNotes } from "./PlayedNotes";

type KeyboardLineWithPlayedNotesProps = {
  gridSize: number;
  objectSize: number;
  gridThickness: number;
  playedNotesThickness: number;
};
export const KeyboardLineWithPlayedNotes: FC<
  KeyboardLineWithPlayedNotesProps
> = ({ gridSize, objectSize, gridThickness, playedNotesThickness }) => (
  <group>
    <KeyboardLine
      thickness={gridThickness}
      gridSize={gridSize}
      objectSize={objectSize}
    />
    <PlayedNotes
      thickness={playedNotesThickness}
      gridSize={gridSize}
      objectSize={objectSize}
    />
  </group>
);
