import { useEffect, useRef, useState } from "react";
import type { FC } from "react";
import { Group } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Instances, Instance } from "@react-three/drei";
import { minMax } from "./data";
import type { SongType } from "./data";
import { useTimedNotesQueue } from "./hooks";
import { Clock } from "./clock";

type NotesProps = { song: SongType; color: string; objectSize: number };
export const Notes: FC<NotesProps> = ({ song, color, objectSize }) => {
  const [low, high] = minMax(song);
  const half = (high - low) / 2;
  const ref = useRef<Group>(null);
  const previousElapsedTimeRef = useRef(0);
  const [qClock] = useState(new Clock());
  const timedNotesQueueRef = useTimedNotesQueue(qClock);
  const set = useThree((state) => state.set);
  const get = useThree((state) => state.get);
  useEffect(() => {
    // @ts-ignore
    set({ qClock });
  }, [set, qClock]);

  useEffect(() => {
    const onKeyDown = ({ code }: KeyboardEvent) => {
      // @ts-ignore
      const clock = get().qClock;
      if (code === "Space") {
        if (clock.isRunning()) {
          clock.pause();
        } else {
          clock.start();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown, false);
    return () => {
      window.removeEventListener("keydown", onKeyDown, false);
    };
  }, [get]);

  useFrame(({ get }) => {
    // @ts-ignore
    const clock = get().qClock;
    const elapsedTime = clock.getElapsedTime();
    const delta = elapsedTime - previousElapsedTimeRef.current;
    previousElapsedTimeRef.current = elapsedTime;
    if (!ref.current) return;
    if (ref.current.position.z > song.length + 2) {
      ref.current.position.z = 0;
      clock.stop();
      previousElapsedTimeRef.current = 0;
    } else {
      ref.current.position.z += delta;
    }
  });

  useFrame(() => {
    const newTimedNotes = timedNotesQueueRef.current.flush();
    if (newTimedNotes.length > 0) {
      console.time("noteFinder");
      song.forEach((line, i) =>
        line.forEach((note, j) => {
          newTimedNotes.forEach((timedNote) => {
            const duration = 1;
            const threshold = 0.25;
            if (
              note === timedNote.note &&
              timedNote.start >= i - threshold &&
              timedNote.start <= i + threshold &&
              timedNote.stop >= i + duration - threshold &&
              timedNote.stop <= i + duration + threshold
            ) {
              console.log(`matched ${note} at line ${i}`);
            }
          });
        })
      );
      console.timeEnd("noteFinder");
    }
  });

  return (
    <group ref={ref}>
      <Instances limit={song.flat().length}>
        <boxGeometry args={[objectSize, 0.1, objectSize]} />
        <meshLambertMaterial />
        {song.flatMap((line, i) =>
          line.map((note, j) => (
            <Instance
              key={`${i}-${j}`}
              color={color}
              position={[note - low - half, 0, -i]}
            />
          ))
        )}
      </Instances>
    </group>
  );
};
