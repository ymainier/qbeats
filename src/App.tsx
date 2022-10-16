import type { FC } from "react";
import { Canvas } from "@react-three/fiber";

import { COLORS, OBJECT_SIZE, SONG, minMax } from "./data";
import { Notes } from "./Notes";
import { KeyboardLineWithPlayedNotes } from "./KeyboardLineWithPlayedNotes";

const App: FC = () => {
  const initialCameraZ = 4;
  const song = SONG;
  const [low, high] = minMax(song);
  const gridSize = high - low;

  return (
    <Canvas camera={{ position: [0, 2, initialCameraZ] }}>
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
    </Canvas>
  );
};

export default App;
