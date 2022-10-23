import { useEffect, useRef } from "react";
import type { FC } from "react";
import { Group, Color } from "three";
import { useFrame } from "@react-three/fiber";
import { Instances, Instance, Box } from "@react-three/drei";

import { minMax } from "./data";
import type { SongType, NoteType } from "./data";
import { useTimedNotesQueue } from "./hooks";
import { useQBeatsStore } from "./store";

type NotesProps = { song: SongType; color: string; objectSize: number };
export const Notes: FC<NotesProps> = ({ song, color, objectSize }) => {
  const threshold = 0.25;
  const [low, high] = minMax(song);
  const half = (high - low) / 2;
  const amplitude = low + half;
  const ref = useRef<Group>(null);
  const previousElapsedTimeRef = useRef(0);
  const notesRef = useRef({
    position: 0,
    matched: new Set<`${number}-${NoteType}`>(),
  });
  const indentScore = useQBeatsStore((state) => state.indentScore);
  const resetScore = useQBeatsStore((state) => state.resetScore);
  const clockStart = useQBeatsStore((state) => state.clockStart);
  const clockPause = useQBeatsStore((state) => state.clockPause);
  const clockStop = useQBeatsStore((state) => state.clockStop);
  const clockGetTime = useQBeatsStore((state) => state.clockGetTime);
  const clockIsRunning = useQBeatsStore((state) => state.clockIsRunning);
  const clockIsPaused = useQBeatsStore((state) => state.clockIsPaused);
  const timedNotesQueueRef = useTimedNotesQueue(clockGetTime);

  useEffect(() => {
    const onKeyDown = async ({ code }: KeyboardEvent) => {
      if (code === "Space") {
        if (clockIsRunning()) {
          clockPause();
        } else {
          if (!clockIsPaused()) {
            resetScore();
          }
          await clockStart();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown, false);
    return () => {
      window.removeEventListener("keydown", onKeyDown, false);
    };
  }, [resetScore, clockStart, clockPause, clockIsRunning, clockIsPaused]);

  useFrame(() => {
    // const elapsedTime = clock.getElapsedTime();
    const elapsedTime = clockGetTime();
    const delta = elapsedTime - previousElapsedTimeRef.current;
    previousElapsedTimeRef.current = elapsedTime;
    if (!ref.current) return;
    if (ref.current.position.z > song.length + 2) {
      ref.current.position.z = 0;
      clockStop();
      previousElapsedTimeRef.current = 0;
      notesRef.current.matched = new Set();
    } else {
      ref.current.position.z += delta;
    }
    notesRef.current.position = ref.current.position.z;
  });

  useFrame(() => {
    const newTimedNotes = timedNotesQueueRef.current.flush();
    if (newTimedNotes.length > 0) {
      song.forEach((line, i) =>
        line.forEach(({ note, duration }, j) => {
          newTimedNotes.forEach((timedNote) => {
            if (
              note === timedNote.note &&
              timedNote.start >= i - threshold &&
              timedNote.start <= i + threshold &&
              timedNote.stop >= i + duration - threshold &&
              timedNote.stop <= i + duration + threshold
            ) {
              indentScore();
              notesRef.current.matched.add(`${i}-${note}`);
            }
          });
        })
      );
    }
  });

  return (
    <group ref={ref}>
      <Box
        args={[high - low + objectSize, 0.01, song.length]}
        position={[0, -0.05, -song.length / 2]}
      />
      <Instances limit={song.flat().length}>
        <boxGeometry args={[objectSize, 0.1, objectSize]} />
        <meshLambertMaterial />
        {song.flatMap((line, i) =>
          line.map(({ note, duration }) => {
            return (
              <Note
                key={`${i}-${note}`}
                note={note}
                color={color}
                start={i}
                duration={duration}
                amplitude={amplitude}
                notesRef={notesRef}
                threshold={threshold}
              />
            );
          })
        )}
      </Instances>
    </group>
  );
};

type NoteProps = {
  note: NoteType;
  start: number;
  duration: number;
  amplitude: number; // low - half
  color: string;
  notesRef: React.MutableRefObject<{
    position: number;
    matched: Set<`${number}-${NoteType}`>;
  }>;
  threshold: number;
};

const Note: FC<NoteProps> = ({
  note,
  start,
  duration,
  amplitude,
  color,
  notesRef,
  threshold,
}) => {
  const ref = useRef<{ color: Color }>();
  useFrame(() => {
    if (!ref.current) return;
    if (notesRef.current.position === 0) {
      ref.current.color = new Color(color);
    } else if (notesRef.current.matched.has(`${start}-${note}`)) {
      ref.current.color = new Color("green");
    } else if (notesRef.current.position > start + duration + threshold) {
      ref.current.color = new Color("red");
    }
  });
  return (
    <Instance
      ref={ref}
      position={[note - amplitude, 0, -start - duration / 2]}
      scale={[1, 1, duration]}
      color={color}
    />
  );
};
