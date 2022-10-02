import { useEffect, useRef } from "react";
import type { FC } from "react";
import { Group } from "three";
import { useFrame } from "@react-three/fiber";
import { Instances, Instance } from "@react-three/drei";
import { minMax } from "./data";
import type { SongType } from "./data";

type NotesProps = { song: SongType; color: string; objectSize: number };
export const Notes: FC<NotesProps> = ({ song, color, objectSize }) => {
  const [low, high] = minMax(song);
  const half = (high - low) / 2;
  const ref = useRef<Group>();
  const isPausedRef = useRef(false);

  useEffect(() => {
    const onKeyDown = ({ code }: KeyboardEvent) => {
      if (code === "Space") {
        isPausedRef.current = !isPausedRef.current;
      }
    };
    window.addEventListener("keydown", onKeyDown, false);
    return () => {
      window.removeEventListener("keydown", onKeyDown, false);
    };
  }, []);

  useFrame(({ camera }, delta) => {
    if (!ref.current || isPausedRef.current) return;
    if (ref.current.position.z > song.length + 2) {
      ref.current.position.z = 0;
      isPausedRef.current = true;
    } else {
      ref.current.position.z += delta;
    }
  });

  return (
    <group ref={ref}>
      {/* @ts-ignore */}
      <Instances limit={song.flat().length}>
        <boxGeometry args={[objectSize, 0.1, objectSize]} />
        <meshLambertMaterial />
        {song.flatMap((line, i) =>
          line.map((note, j) => (
            <Instance key={`${i}-${j}`} color={color} position={[note - low - half, 0, -i]} />
          ))
        )}
      </Instances>
    </group>
  );
};
