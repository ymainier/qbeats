import { useLayoutEffect, useRef } from "react";
import type { FC } from "react";
import * as THREE from "three";
import { minMax } from "./data";
import type { SongType } from "./data";

type NotesProps = { song: SongType; color: string; objectSize: number };
export const Notes: FC<NotesProps> = ({ song, color, objectSize }) => {
  const ref = useRef<THREE.InstancedMesh>();
  useLayoutEffect(() => {
    const object = new THREE.Object3D();
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
        n++;
        ref.current.setMatrixAt(n, object.matrix);
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
