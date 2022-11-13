import { FC } from "react";
import { useQBeatsStore } from "./store";
import "./Hud.css";

export const Hud: FC = () => {
  const score = useQBeatsStore((state) => state.score);
  return (
    <div className="hud">
      <h1>
        <span className="score">{score}</span>
      </h1>
    </div>
  );
};
