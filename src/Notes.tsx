import { useLayoutEffect, useEffect, useRef } from "react";
import type { FC } from "react";
import { InstancedMesh, Object3D } from "three";
import { useFrame } from "@react-three/fiber";
import { minMax } from "./data";
import type { SongType } from "./data";

type NotesProps = { song: SongType; color: string; objectSize: number };
export const Notes: FC<NotesProps> = ({ song, color, objectSize }) => {
  const ref = useRef<InstancedMesh>();
  const isPausedRef = useRef(false);

  useEffect(() => {
    const onKeyDown = ({ code }: KeyboardEvent) => {
      if (code === 'Space') {
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

  useLayoutEffect(() => {
    const object = new Object3D();
    const [low, high] = minMax(song);
    const width = high - low;
    let n = 0;
    if (!ref.current) return;
    const half = width / 2;
    for (let i = 0; i < song.length; i++) {
      for (let j = 0; j < song[i].length; j++) {
        const note = song[i][j];
        object.position.set(note - low - half, 0, -i);
        object.updateMatrix();
        ref.current.setMatrixAt(n, object.matrix);
        n++;
      }
    }
    ref.current.instanceMatrix.needsUpdate = true;
  }, [song]);

  return (
    <instancedMesh ref={ref} args={[null, null, song.flat().length]}>
      <boxGeometry args={[objectSize, 0.1, objectSize]} />
      <meshLambertMaterial color={color} />
    </instancedMesh>
  );
};
