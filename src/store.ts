import create from "zustand";
import * as Tone from "tone";
import { NOTE_TO_TONE, SONGS } from "./data";
import type { NoteType, SongType } from "./data";

const MAX_STAGE = 9;

function toToneNote(note: NoteType): string {
  return NOTE_TO_TONE[note];
}

let fakePiano: Tone.Sampler | null = null;

const BOOP_VOLUME = -20;
const SUCCESS_THRESHOLD = 1 / 3;

function countNotes(song: SongType): number {
  return song.flat(2).length;
}

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
  song: SongType;
  score: number;
  isToneActivated: boolean;
  speed: number;
  songSampling: number;
  boop: Tone.Synth | null;
  isDebugging: boolean;
  isPlaying: boolean;
  stage: number;
  hasWon: boolean;
  indentScore: () => void;
  resetScore: () => void;
  clockStart: () => Promise<void>;
  clockPause: () => void;
  clockStop: () => void;
  clockGetTime: () => number;
  clockIsRunning: () => boolean;
  clockIsPaused: () => boolean;
  toggleClock: () => void;
  trigger: (note: NoteType) => void;
  release: (note: NoteType) => void;
  toggleBoopVolume: (willEnable: boolean) => void;
  isBoopEnabled: () => boolean;
  toggleDebugging: () => void;
  nextStage: () => void;
  endSong: () => void;
};

export const useQBeatsStore = create<QBeatsState>((set, get) => ({
  song: SONGS[0],
  score: 0,
  isToneActivated: false,
  speed: 120,
  songSampling: 2,
  boop: null,
  isDebugging: window.location.hash === "#debug",
  isPlaying: false,
  stage: 1,
  hasWon: false,
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

    Tone.Transport.bpm.value = get().speed / get().songSampling;
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
    return (Tone.Transport.seconds * get().speed) / 60;
  },
  clockIsRunning: () => {
    return Tone.Transport.state === "started";
  },
  clockIsPaused: () => {
    return Tone.Transport.state === "paused";
  },
  toggleClock: () => {
    if (get().clockIsRunning()) {
      get().clockPause();
    } else {
      if (!get().clockIsPaused()) {
        get().resetScore();
      }
      get().clockStart();
      set({ isPlaying: true });
    }
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
  toggleDebugging: () => set((state) => ({ isDebugging: !state.isDebugging })),
  nextStage: () =>
    set((state) => {
      const nextStage = state.stage < MAX_STAGE ? state.stage + 1 : MAX_STAGE;
      return {
        isPlaying: false,
        stage: nextStage,
        hasWon: state.stage === MAX_STAGE,
        song: SONGS[nextStage - 1] ?? SONGS[SONGS.length - 1],
      };
    }),
  endSong: () => {
    get().clockStop();
    if (get().score / countNotes(get().song) >= SUCCESS_THRESHOLD) {
      get().nextStage();
    } else {
      set({ isPlaying: false });
    }
  },
}));
