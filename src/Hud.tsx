import { FC } from "react";
import { useQBeatsStore } from "./store";
import "./Hud.css";

export const Hud: FC = () => {
  const score = useQBeatsStore((state) => state.score);
  return (
    <div className="hud">
      <h1>{score}</h1>
    </div>
  );
};
