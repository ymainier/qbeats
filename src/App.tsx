import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { useRef, useLayoutEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Box } from "@react-three/drei";
import colors from "nice-color-palettes";

const COLORS = colors[6];
const object = new THREE.Object3D();

// prettier-ignore
// const HAPPY_BIRTHDAY = [
//   1, 1, 2, 1, 4, 3,
//   1, 1, 2, 1, 5, 4,
//   1, 1, 1, 8, 6, 4, 3, 2
// ];
const ALL_NOTES = [1, 2, 3, 4, 5, 6, 7, 8] as const;
type Note = typeof ALL_NOTES[number];
type Song = Array<Array<Note>>;
// prettier-ignore
const TEST: Song = [
  [1, 2], [], [3, 4], [], [5], [6], [7], [8],
  [8], [7], [6], [5], [4], [3], [2], [1],
  [1], [2], [3], [4], [5], [6], [7], [8],
  [8], [7], [6], [5], [4], [3], [2], [1],
  [1], [2], [3], [4], [5], [6], [7], [8],
  [8], [7], [6], [5], [4], [3], [2], [1],
]

const SONG = TEST;

function isNote(element: unknown): element is Note {
  const all_notes: ReadonlyArray<unknown> = ALL_NOTES;
  return all_notes.includes(element);
}

const LOW = Math.min(...SONG.flat().filter(isNote));
const HIGH = Math.max(...SONG.flat().filter(isNote));
const WIDTH = HIGH - LOW;

const OBJECT_SIZE = 1;

function Boxes() {
  const ref = useRef<THREE.InstancedMesh>();
  useLayoutEffect(() => {
    let n = 0;
    if (!ref.current) return;
    const half = WIDTH / 2;
    for (let i = 0; i < SONG.length; i++) {
      for (let j = 0; j < SONG[i].length; j++) {
        const note = SONG[i][j];
        object.position.set(note - LOW - half, 0, -i);
        object.updateMatrix();
        n++;
        ref.current.setMatrixAt(n, object.matrix);
      }
    }
    ref.current.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <instancedMesh ref={ref} args={[null, null, SONG.flat().length]}>
      <boxGeometry args={[OBJECT_SIZE, 0.1, OBJECT_SIZE]} />
      <meshLambertMaterial color={COLORS[0]} />
    </instancedMesh>
  );
}

const PlayGrid: FC<{
  thickness: number;
  gridSize: number;
  objectSize: number;
}> = ({ thickness, gridSize, objectSize }) => {
  const material = useMemo(
    () => new THREE.MeshLambertMaterial({ color: COLORS[1] }),
    []
  );
  return (
    <group>
      {/* @ts-ignore */}
      <Box
        args={[(gridSize + 1) * objectSize, thickness, thickness]}
        position={[0, 0, -objectSize / 2]}
        material={material}
      />
      {/* @ts-ignore */}
      <Box
        args={[(gridSize + 1) * objectSize, thickness, thickness]}
        position={[0, 0, objectSize / 2]}
        material={material}
      />
      {Array.from({ length: gridSize + 2 }).map((_, i) => (
        // @ts-ignore
        <Box
          key={i}
          args={[thickness, thickness, objectSize + thickness]}
          position={[-(gridSize + objectSize) / 2 + i, 0, 0]}
          material={material}
        />
      ))}
    </group>
  );
};

type PlayedNoteProps = {
  note: Note;
  thickness: number;
  gridSize: number;
  objectSize: number;
};
const PlayedNote: FC<PlayedNoteProps> = ({
  note,
  thickness,
  gridSize,
  objectSize,
}) => {
  const material = useMemo(
    () => new THREE.MeshLambertMaterial({ color: COLORS[2] }),
    []
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

type PlayedNotesProps = Omit<PlayedNoteProps, "note"> & { notes: Array<Note> };
const PlayedNotes: FC<PlayedNotesProps> = ({
  notes,
  thickness,
  gridSize,
  objectSize,
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
        />
      ))}
    </group>
  );
};

const KEYCODES_TO_NOTES: Record<string, Note> = {
  KeyA: 1,
  KeyS: 2,
  KeyD: 3,
  KeyF: 4,
  KeyG: 5,
  KeyH: 6,
  KeyJ: 7,
  KeyK: 8,
};

function useNotes(): Array<Note> {
  const [playedNotes, setPlayedNotes] = useState<Array<Note>>([]);
  useEffect(() => {
    const onKeyDown = ({ code }: KeyboardEvent) => {
      const maybeNote = KEYCODES_TO_NOTES[code];
      if (!maybeNote) return;
      setPlayedNotes((notes) =>
        notes.includes(maybeNote) ? notes : [...notes, maybeNote]
      );
    };
    window.addEventListener("keydown", onKeyDown, false);

    const onKeyUp = ({ code }: KeyboardEvent) => {
      const maybeNote = KEYCODES_TO_NOTES[code];
      if (!maybeNote) return;
      setPlayedNotes((notes) =>
        notes.includes(maybeNote)
          ? notes.filter((note) => note !== maybeNote)
          : notes
      );
    };
    window.addEventListener("keyup", onKeyUp, false);

    return () => {
      window.removeEventListener("keydown", onKeyDown, false);
      window.removeEventListener("keyup", onKeyUp, false);
    };
  }, []);
  return playedNotes;
}

const App: FC = () => {
  const gridSize = HIGH - LOW;
  const objectSize = OBJECT_SIZE;
  const notes = useNotes();
  return (
    <Canvas camera={{ position: [0, 2, 4] }}>
      <ambientLight />
      <directionalLight position={[-150, 150, -150]} intensity={0.55} />
      <Boxes />
      <PlayGrid thickness={0.101} gridSize={gridSize} objectSize={objectSize} />
      <PlayedNotes
        notes={notes}
        thickness={0.102}
        gridSize={gridSize}
        objectSize={objectSize}
      />
      <OrbitControls />
    </Canvas>
  );
};

export default App;
