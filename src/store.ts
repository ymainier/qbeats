import create from "zustand";
import * as Tone from "tone";

let boop: Tone.Synth | null = null;

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
    return Tone.Transport.seconds;
  },
  clockIsRunning: () => {
    return Tone.Transport.state === 'started';
  },
  clockIsPaused: () => {
    return Tone.Transport.state === 'paused';
  }
}));
