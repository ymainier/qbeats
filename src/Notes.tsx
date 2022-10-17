import { useEffect, useRef, useState } from "react";
import type { FC } from "react";
import { Group, Color } from "three";
import { useFrame } from "@react-three/fiber";
import { Instances, Instance } from "@react-three/drei";

import { minMax } from "./data";
import type { SongType, NoteType } from "./data";
import { useTimedNotesQueue } from "./hooks";
import { Clock } from "./clock";
import { useQBeatsStore } from "./store";

type NotesProps = { song: SongType; color: string; objectSize: number };
export const Notes: FC<NotesProps> = ({ song, color, objectSize }) => {
  const threshold = 0.25;
  const [low, high] = minMax(song);
  const half = (high - low) / 2;
  const amplitude = low + half;
  const ref = useRef<Group>(null);
  const previousElapsedTimeRef = useRef(0);
  const [clock] = useState(() => new Clock());
  const timedNotesQueueRef = useTimedNotesQueue(clock);
  const notesRef = useRef({
    position: 0,
    matched: new Set<`${number}-${NoteType}`>(),
  });
  const indentScore = useQBeatsStore((state) => state.indentScore);
  const resetScore = useQBeatsStore((state) => state.resetScore);

  useEffect(() => {
    const onKeyDown = ({ code }: KeyboardEvent) => {
      if (code === "Space") {
        if (clock.isRunning()) {
          clock.pause();
        } else {
          if (!clock.isStarted()) {
            resetScore();
          }
          clock.start();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown, false);
    return () => {
      window.removeEventListener("keydown", onKeyDown, false);
    };
  }, [clock, resetScore]);

  useFrame(() => {
    const elapsedTime = clock.getElapsedTime();
    const delta = elapsedTime - previousElapsedTimeRef.current;
    previousElapsedTimeRef.current = elapsedTime;
    if (!ref.current) return;
    if (ref.current.position.z > song.length + 2) {
      ref.current.position.z = 0;
      clock.stop();
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
        line.forEach((note, j) => {
          newTimedNotes.forEach((timedNote) => {
            const duration = 1;
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
      <Instances limit={song.flat().length}>
        <boxGeometry args={[objectSize, 0.1, objectSize]} />
        <meshLambertMaterial />
        {song.flatMap((line, i) =>
          line.map((note) => {
            const duration = 1;
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
  threshold: number
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
  const ref = useRef<{color: Color}>();
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
