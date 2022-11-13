import { FC } from "react";
import { useSpring, animated } from "react-spring";
import { useQBeatsStore } from "./store";
import "./Hud.css";

export const Hud: FC = () => {
  const score = useQBeatsStore((state) => state.score);
  const style = useSpring({
    reset: true,
    from: { rotateY: 0 },
    to: { rotateY: 720 },
  });
  return (
    <div className="hud">
      <h1>
        <span className="score-container">
          <animated.span style={style} className="score-text">
            {score}
          </animated.span>
        </span>
      </h1>
    </div>
  );
};
