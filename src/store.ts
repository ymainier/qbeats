import create from "zustand";
import * as Tone from "tone";
import { NOTE_TO_TONE } from './data';
import type { NoteType } from "./data";

function toToneNote(note: NoteType): string {
  return NOTE_TO_TONE[note];
}

let fakePiano: Tone.Sampler | null = null;

const BOOP_VOLUME = -20;

function makeBoop(): Tone.Synth {
  return new Tone.Synth({
    volume: BOOP_VOLUME,
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

function makeFakePiano(): Tone.Sampler {
  // @ts-ignore
  const synth = new Tone.Sampler({
    urls: {
      A4: "A4v1.mp3",
      C4: "C4v1.mp3",
      "D#4": "Ds4v1.mp3",
      "F#4": "Fs4v1.mp3",
    },
    baseUrl: "./",
  }).toDestination();
  synth.volume.value = 10;
  return synth;
}

type QBeatsState = {
  score: number;
  isToneActivated: boolean;
  bpm: number;
  boop: Tone.Synth | null;
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
  toggleBoopVolume: (willEnable: boolean) => void;
  isBoopEnabled: () => boolean;
};

export const useQBeatsStore = create<QBeatsState>((set, get) => ({
  score: 0,
  isToneActivated: false,
  bpm: 60,
  boop: null,
  indentScore: () => set((state) => ({ score: state.score + 1 })),
  resetScore: () => set({ score: 0 }),
  clockStart: async () => {
    let boop = get().boop;
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
    set({ isToneActivated: true, boop });
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
  toggleBoopVolume: (willEnable: boolean) => {
    const boop = get().boop;
    if (!boop) return;
    boop.volume.value = willEnable ? BOOP_VOLUME : boop.volume.minValue;
  },
  isBoopEnabled: () => {
    const boop = get().boop;
    if (!boop) return true;
    return boop.volume.value === BOOP_VOLUME;
  },
}));
