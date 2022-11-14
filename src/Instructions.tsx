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
  { title: "Stage 2: 👶", lines: ["As you quickly as you went from walking to running, let's do sharps! You'll do C# D# F# G# A# G# F# D# C#. If you use the laptop keyboard, the keys are Z E T Y and U."] },
  { title: "Stage 3: 🧸", lines: ["And now with the fun part: songs!", "The little girl in this first song must like her lamb as much as you love you teddy."] },
  { title: "Stage 4: ⭐️", lines: ["Ever since you were born, you've been my little star. Shine bright my love!"] },
  { title: "Stage 5: 🔔", lines: ["One of your favorite moment of the year, and one of my favorite moment too since you're in my life 🎅"] },
  { title: "Stage 6: 🌈", lines: ["Life with you is as beautiful and sweet as this song. It is Garota de Ipanema: The Girl from Ipanema."] },
  { title: "Stage 7: 🦜", lines: ["You already know how to play this one! I can't believe how fast you learn things. It is the melody from Cockatoo."] },
  { title: "Stage 8: 🎇", lines: ["That song celebrate joy, and this is what you are to me: happiness"] },
  {
    title: "Stage 9: 🎂",
    lines: [
      "How times fly my love ❤️ I'm so proud of you, don't ever change mon lapin 🐰. HBD",
    ],
  },
];

const WON = {
  title: "🎂🎁🎉",
  lines: ["Happy Birthday to You", "Happy Birthday to You", "Happy Birthday to You mon petit lapin ❤️"],
};

export const Instructions: FC = () => {
  const hasWon = useQBeatsStore((state) => state.hasWon);
  const stage = useQBeatsStore((state) => state.stage);
  const isPlaying = useQBeatsStore((state) => state.isPlaying);
  const toggleClock = useQBeatsStore((state) => state.toggleClock);
  const { title, lines } =
    hasWon || stage < 1 || stage > CONTENT.length ? WON : CONTENT[stage - 1];

  return (
    <section
      className={`instructions stage-${stage} ${
        isPlaying ? "is-playing" : "is-not-playing"
      }`}
    >
      <div className="instructions-container">
        <h1>{title}</h1>
        {lines.map((line, i) => (
          <p key={`${stage}-${i}`}>{line}</p>
        ))}
        {!hasWon && (
          <p className="button-container">
            <button onClick={toggleClock}>Play !</button>
          </p>
        )}
      </div>
    </section>
  );
};
