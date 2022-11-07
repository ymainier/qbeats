import type { FC } from "react";
import "./Instructions.css";
import { useQBeatsStore } from "./store";

const CONTENT = [
  {
    title: "Stage 1: 👋",
    lines: [
      "Hey, mon lapin! You asked for a game for your 9th birthday. So, I thought about this rhythm game here.",
      "You can play by plugging your piano and using the notes between the middle C and the C one octave higher. You can also use the computer keyboard. On our laptop Middle C is the Q key, D is the S key, and so on.",
      "Let's practice with only the white notes: C D E F G A B C B A G F E D C. Nice and easy. Remember that rhythm is essential: use the metronome sound or look at the bar.",
    ],
  },
  { title: "Stage 2: ❤️", lines: ["two"] },
  { title: "Stage 3: 🎁", lines: ["three"] },
  { title: "Stage 4: ⭐️", lines: ["four"] },
  { title: "Stage 5: 🌈", lines: ["five"] },
  { title: "Stage 6: ☀️", lines: ["six"] },
  { title: "Stage 7: 🎡", lines: ["seven"] },
  { title: "Stage 8: 🎇", lines: ["eight"] },
  {
    title: "Stage 9: Happy Birthday 🎂🎁🎉",
    lines: [
      "How times fly my love ❤️ I'm so proud of you, don't ever change mon lapin 🐰",
    ],
  },
];

const WON = {
  title: "Happy Birthday to You",
  lines: ["Happy Birthday to You", "Happy Birthday to You mon lapin"],
};

export const Instructions: FC = () => {
  const hasWon = useQBeatsStore((state) => state.hasWon);
  const stage = useQBeatsStore((state) => state.stage);
  const isPlaying = useQBeatsStore((state) => state.isPlaying);
  const startPlaying = useQBeatsStore((state) => state.startPlaying);
  const { title, lines } =
    hasWon || stage < 1 || stage > CONTENT.length ? WON : CONTENT[stage - 1];

  return (
    <section
      className={`instructions stage-${stage} ${
        isPlaying ? "is-playing" : "is-not-playing"
      }`}
    >
      <h1>{title}</h1>
      {lines.map((line, i) => (
        <p key={`${stage}-${i}`}>{line}</p>
      ))}
      {!hasWon && (
        <p>
          <button onClick={startPlaying}>Play !</button>
        </p>
      )}
    </section>
  );
};
