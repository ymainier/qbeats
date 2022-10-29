import { useEffect } from "react";
import type { FC } from "react";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Scene } from "./Scene";
import { Hud } from "./Hud";
import { useQBeatsStore } from "./store";
import { SONG } from "./data";

const App: FC = () => {
  const isDebugging = useQBeatsStore((state) => state.isDebugging);
  const toggleDebugging = useQBeatsStore((state) => state.toggleDebugging);

  useEffect(() => {
    function listenToQuestionMark({ key }: KeyboardEvent) {
      if (key === "?") toggleDebugging();
    }
    window.addEventListener("keydown", listenToQuestionMark, false);

    return () => {
      window.removeEventListener("keydown", listenToQuestionMark, false);
    };
  }, [toggleDebugging]);

  return (
    <>
      <Canvas>
        <Scene song={SONG} />
      </Canvas>
      <Hud />
      <Leva hidden={!isDebugging} />
    </>
  );
};

export default App;
