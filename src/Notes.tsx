import { useEffect, useRef } from "react";
import type { FC } from "react";
import { Group, Color } from "three";
import { useFrame } from "@react-three/fiber";
import { Box, Instances, Instance, Segments, Segment } from "@react-three/drei";

import {
  ALL_NOTES,
  NOTE_COLORS,
  FAILURE_COLOR,
  SUCCESS_COLOR,
  GROUND_COLOR,
  SEGMENT_COLOR,
  SKY_COLOR,
  shuffle,
} from "./data";
import type { NoteType } from "./data";
import { useTimedNotesQueue } from "./hooks";
import { useQBeatsStore } from "./store";

const COLORS = shuffle(NOTE_COLORS);

type NotesProps = { objectSize: number };
export const Notes: FC<NotesProps> = ({ objectSize }) => {
  const threshold = 0.35;
  const song = useQBeatsStore((state) => state.song);
  const low = Math.min(...ALL_NOTES);
  const high = Math.max(...ALL_NOTES);
  const half = (high - low) / 2;
  const amplitude = low + half;
  const ref = useRef<Group>(null);
  const previousElapsedTimeRef = useRef(0);
  const notesRef = useRef({
    position: 0,
    matched: new Set<`${number}-${NoteType}`>(),
  });
  const clockGetTime = useQBeatsStore((state) => state.clockGetTime);
  const indentScore = useQBeatsStore((state) => state.indentScore);
  const endSong = useQBeatsStore((state) => state.endSong);
  const toggleClock = useQBeatsStore((state) => state.toggleClock);
  const stage = useQBeatsStore((state) => state.stage);
  const timedNotesQueueRef = useTimedNotesQueue();

  useEffect(() => {
    const onKeyDown = async ({ code }: KeyboardEvent) => {
      if (code === "Space") {
        toggleClock();
      }
    };
    window.addEventListener("keydown", onKeyDown, false);
    return () => {
      window.removeEventListener("keydown", onKeyDown, false);
    };
  }, [toggleClock]);

  useFrame(() => {
    const elapsedTime = clockGetTime();
    const delta = elapsedTime - previousElapsedTimeRef.current;
    previousElapsedTimeRef.current = elapsedTime;
    if (!ref.current) return;
    if (ref.current.position.z > song.length) {
      ref.current.position.z = 0;
      endSong();
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
  let index = 0;

  return (
    <group ref={ref}>
      <Box args={[10000, 0.01, 10000]} position={[0, -0.05, -1000 / 2]}>
        <meshLambertMaterial color={GROUND_COLOR} />
      </Box>
      <Box args={[10000, 10000, 0.01]} position={[0, 0, -1000 / 2]}>
        <meshLambertMaterial color={SKY_COLOR} />
      </Box>
      <Segments lineWidth={1}>
        {Array.from({ length: high - low + 2 }).map((_, i) => (
          <Segment
            key={`segment-${i}`}
            start={[i - half - objectSize / 2, -0.04, 0]}
            end={[i - half - objectSize / 2, -0.04, -song.length]}
            color={SEGMENT_COLOR}
          />
        ))}
      </Segments>
      <Instances limit={song.flat().length}>
        <boxGeometry args={[objectSize, 0.1, objectSize]} />
        <meshLambertMaterial />
        {song.flatMap((line, i) =>
          line.map(({ note, duration }, j) => {
            return (
              <Note
                key={`note-${stage}-${i}-${j}-${note}`}
                note={note}
                start={i}
                duration={duration}
                amplitude={amplitude}
                notesRef={notesRef}
                threshold={threshold}
                index={index++}
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
  amplitude: number;
  notesRef: React.MutableRefObject<{
    position: number;
    matched: Set<`${number}-${NoteType}`>;
  }>;
  threshold: number;
  index: number;
};

const Note: FC<NoteProps> = ({
  note,
  start,
  duration,
  amplitude,
  notesRef,
  threshold,
  index,
}) => {
  const ref = useRef<{ color: Color }>();
  useFrame(() => {
    if (!ref.current) return;
    if (notesRef.current.position === 0) {
      const randomColor = COLORS[index % COLORS.length];
      ref.current.color = new Color(randomColor);
    } else if (notesRef.current.matched.has(`${start}-${note}`)) {
      ref.current.color = new Color(SUCCESS_COLOR);
    } else if (notesRef.current.position > start + duration + threshold) {
      ref.current.color = new Color(FAILURE_COLOR);
    }
  });
  return (
    <Instance
      ref={ref}
      position={[note - amplitude, 0, -start - duration / 2]}
      scale={[1, 1, duration - 0.1]}
    />
  );
};
