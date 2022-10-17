import { FC } from "react";
import { useQBeatsStore } from "./store";

export const Hud: FC = () => {
  const score = useQBeatsStore((state) => state.score);
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        width: "100%",
        textAlign: "center",
      }}
    >
      <h1>{score}</h1>
    </div>
  );
};
