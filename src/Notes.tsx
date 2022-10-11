import { useEffect, useRef } from "react";
import type { FC } from "react";
import { Group } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Instances, Instance } from "@react-three/drei";
import { minMax } from "./data";
import type { SongType } from "./data";
import { useNotes } from "./hooks";
import { Clock } from "./clock";

type NotesProps = { song: SongType; color: string; objectSize: number };
export const Notes: FC<NotesProps> = ({ song, color, objectSize }) => {
  const [low, high] = minMax(song);
  const half = (high - low) / 2;
  const ref = useRef<Group>(null);
  const previousElapsedTimeRef = useRef(0);
  const notes = useNotes();
  console.log(notes);
  const set = useThree((state) => state.set);
  const get = useThree((state) => state.get);
  useEffect(() => {
    // @ts-ignore
    set({ qClock: new Clock() });
  }, [set]);

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
      clock.pause();
    } else {
      ref.current.position.z += delta;
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
