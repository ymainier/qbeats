import type { FC } from "react";
import { Grid } from "./Grid";
import { PlayedNotes } from "./PlayedNotes";
import { useNotes } from "./hooks";

type GridWithPlayedNotesProps = {
  gridSize: number;
  objectSize: number;
  gridColor: string;
  gridThickness: number;
  playedNotesColor: string;
  playedNotesThickness: number;
};
export const GridWithPlayedNotes: FC<GridWithPlayedNotesProps> = ({
  gridSize,
  objectSize,
  gridColor,
  gridThickness,
  playedNotesColor,
  playedNotesThickness,
}) => {
  const notes = useNotes();

  return (
    <group>
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
