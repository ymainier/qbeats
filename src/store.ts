import create from "zustand";
import * as Tone from "tone";
import type { NoteType } from "./data";

function toToneNote(note: NoteType): string {
  if (note === 8) return "C5";
  if (note <= 5) return `${String.fromCharCode(66 + note)}4`;
  if (note === 6) return "A4";
  return "B4";
}

let boop: Tone.Synth | null = null;
let fakePiano: Tone.PolySynth | null = null;

function makeBoop(): Tone.Synth {
  return new Tone.Synth({
    oscillator: {
      // @ts-ignore
      type: "sine",
      modulationFrequency: 0.5,
    },
    envelope: {
      attack: 0,
      decay: 0.2,
      sustain: 0,
      release: 0.5,
    },
  }).toDestination();
}

function makeFakePiano(): Tone.PolySynth {
  return new Tone.PolySynth(Tone.Synth).toDestination();
}

type QBeatsState = {
  score: number;
  isToneActivated: boolean;
  bpm: number;
  indentScore: () => void;
  resetScore: () => void;
  clockStart: () => Promise<void>;
  clockPause: () => void;
  clockStop: () => void;
  clockGetTime: () => number;
  clockIsRunning: () => boolean;
  clockIsPaused: () => boolean;
  trigger: (note: NoteType) => void;
  release: (note: NoteType) => void;
};

export const useQBeatsStore = create<QBeatsState>((set, get) => ({
  score: 0,
  isToneActivated: false,
  bpm: 60,
  indentScore: () => set((state) => ({ score: state.score + 1 })),
  resetScore: () => set({ score: 0 }),
  clockStart: async () => {
    if (!boop) {
      boop = makeBoop();
      Tone.Transport.scheduleRepeat(() => {
        boop?.triggerAttackRelease(660, "8n");
      }, "4n");
    }

    if (!fakePiano) {
      fakePiano = makeFakePiano();
    }

    Tone.Transport.bpm.value = get().bpm;
    Tone.Transport.start();
    set({ isToneActivated: true });
  },
  clockPause: () => {
    Tone.Transport.pause();
  },
  clockStop: () => {
    Tone.Transport.stop();
  },
  clockGetTime: () => {
    return (Tone.Transport.seconds * get().bpm) / 60;
  },
  clockIsRunning: () => {
    return Tone.Transport.state === "started";
  },
  clockIsPaused: () => {
    return Tone.Transport.state === "paused";
  },
  trigger: (note: NoteType) => {
    fakePiano?.triggerAttack(toToneNote(note));
  },
  release: (note: NoteType) => {
    fakePiano?.triggerRelease(toToneNote(note));
  },
}));
