import type { FC } from "react";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import { Hud } from "./Hud";

const App: FC = () => (
  <>
    <Canvas>
      <Scene />
    </Canvas>
    <Hud />
  </>
);

export default App;
