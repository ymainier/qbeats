import type { FC } from "react";
import { KeyboardLine } from "./KeyboardLine";
import { PlayedNotes } from "./PlayedNotes";

type KeyboardLineWithPlayedNotesProps = {
  gridSize: number;
  objectSize: number;
  gridColor: string;
  gridThickness: number;
  playedNotesColor: string;
  playedNotesThickness: number;
};
export const KeyboardLineWithPlayedNotes: FC<
  KeyboardLineWithPlayedNotesProps
> = ({
  gridSize,
  objectSize,
  gridColor,
  gridThickness,
  playedNotesColor,
  playedNotesThickness,
}) => (
  <group>
    <KeyboardLine
      thickness={gridThickness}
      gridSize={gridSize}
      objectSize={objectSize}
      color={gridColor}
    />
    <PlayedNotes
      thickness={playedNotesThickness}
      gridSize={gridSize}
      objectSize={objectSize}
      color={playedNotesColor}
    />
  </group>
);
